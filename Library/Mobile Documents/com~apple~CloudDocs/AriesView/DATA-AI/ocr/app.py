# uvicorn app:app --reload --host 0.0.0.0 --port 8000
import os
os.environ["OMP_NUM_THREADS"] = "1"
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Header
from fastapi.responses import JSONResponse
from starlette.concurrency import run_in_threadpool
from pathlib import Path
from typing import Optional, Dict
from pydantic import BaseModel
import httpx
from dotenv import load_dotenv
import tempfile
from fitz_processor import processor
from fastapi import Query
import json
import uuid
from datetime import datetime

load_dotenv()

from paddleocr import PPStructureV3
from pdf2image import convert_from_path
from tqdm import tqdm
from config import TEXT_RECOGNITION_MODEL_NAME, DPI, USE_DOC_ORIENTATION_CLASSIFY, USE_DOC_UNWARPING, LAYOUT_DETECTION_MODEL_NAME, TEXT_DETECTION_MODEL_NAME, DEVICE



# --- Configuration & Security ---
API_KEY = os.getenv("OCR_SERVICE_API_KEY")  # Default to 'testkey' for local dev
if not API_KEY:
    raise ValueError("OCR_SERVICE_API_KEY environment variable not set. Please provide a secret key.")


app = FastAPI()
pipeline: Optional[PPStructureV3] = None


# --- Pydantic Models ---
class URLPayload(BaseModel):
    document_id: str
    filename: str
    url: str
    upload_url: str  # SAS URL for uploading the results

# --- Authentication Dependency ---
async def verify_api_key(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization header is missing."
        )
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer" or token != API_KEY:
            raise HTTPException(status_code=401, detail="Invalid API Key.")
    except ValueError:
        raise HTTPException(
            status_code=401,
            detail="Invalid Authorization header format. Use 'Bearer <key>'."
        )
    
# --- Model Loading ---
@app.on_event("startup")
async def load_model_at_startup():
    """
    Preload the PPStructureV3 pipeline on startup so that the first request is fast.
    """
    global pipeline
    pipeline = await get_pipeline()

async def get_pipeline() -> PPStructureV3:
    global pipeline
    if pipeline is None:
        print("Initializing PP-StructureV3 pipeline...")
        # Initialize the PPStructureV3 pipeline in a thread to avoid blocking the event loop
        pipeline = await run_in_threadpool(
            PPStructureV3,
            use_doc_orientation_classify=USE_DOC_ORIENTATION_CLASSIFY,
            use_doc_unwarping=USE_DOC_UNWARPING,
            layout_detection_model_name=LAYOUT_DETECTION_MODEL_NAME,
            text_detection_model_name=TEXT_DETECTION_MODEL_NAME,
            text_recognition_model_name=TEXT_RECOGNITION_MODEL_NAME,
            device=DEVICE
        )
        print("Pipeline initialized successfully.")
    return pipeline

# --- Core OCR Processing Logic (Refactored) ---
async def process_local_file_ocr(file_path: Path, original_filename: str, temp_dir: Path) -> Dict:
    """
    Processes a local file (PDF or image) using the OCR pipeline.
    This function contains the core, reusable logic.
    """
    pl = await get_pipeline()
    aggregated = []
    suffix = file_path.suffix.lower()

    if suffix == ".pdf":
        # Convert PDF to images one page at a time to manage memory
        pages = await run_in_threadpool(convert_from_path, str(file_path), DPI)
        for idx, img in enumerate(tqdm(pages, desc=f"Processing {original_filename}"), start=1):
            # Create a temporary path for the page image inside the dedicated directory
            page_fname = f"{file_path.stem}_page_{idx}.png"
            page_path = temp_dir / page_fname
            img.save(page_path, format="PNG")

            try:
                output = await run_in_threadpool(pl.predict, str(page_path))
                page_results = [res.json for res in output]
                aggregated.append({"page": idx, "results": page_results})
            finally:
                # Clean up the temporary page image immediately
                page_path.unlink()
    else:
        # Handle single image input
        output = await run_in_threadpool(pl.predict, str(file_path))
        aggregated = [{"page": 1, "results": [res.json for res in output]}]

    return {
        "input_path": original_filename,
        "num_pages": len(aggregated),
        "pages_results": aggregated
    }


# --- Core Document Processing Logic (PyMuPDF) ---
async def process_local_file_fitz(file_path: Path, original_filename: str) -> Dict:
    try:
        response = await run_in_threadpool(processor.process_document, file_path, original_filename)
        return response
    except Exception as e:
        print(f"Error processing file {file_path}: {e}")
        raise e
    
async def is_fitz_successful(result: dict) -> bool:
    """
    Returns True if Fitz (PyMuPDF) was able to extract meaningful content from the document.
    Returns False if the result indicates fitz_empty (i.e., only images or nothing was found).
    """
    return not result.get("fitz_empty", False)

    
async def process_local_file(file_path: Path, original_filename: str, temp_dir: Path, processor_type: str="all") -> Dict:
    try:
        if processor_type == "fitz":
            return await process_local_file_fitz(file_path, original_filename)
        elif processor_type == "ocr":
            return await process_local_file_ocr(file_path, original_filename, temp_dir)
        elif processor_type == "all":
            fitz_response = await process_local_file_fitz(file_path, original_filename)
            if is_fitz_successful(fitz_response):
                return fitz_response
            else:
                return await process_local_file_ocr(file_path, original_filename, temp_dir)
        else:
            raise HTTPException(status_code=400, detail="Invalid processor type. Use 'fitz' or 'ocr'.")
    except Exception as e:
        print(f"Error processing file {file_path}: {e}")
        raise e

# --- API Endpoints ---
@app.post("/predict/file")
async def predict_from_file(file: UploadFile = File(...), processor_type: str = Query("all", enum=["all", "fitz", "ocr"], description="The processing engine to use.")):
    """
    Accepts a PDF or image file via HTTP upload, processes it, and returns JSON results.
    This is the primary endpoint for direct file uploads and requires an API key.
    """
    suffix = Path(file.filename).suffix.lower()
    if not suffix:
        print(f"Warning: No file extension for '{file.filename}'. Assuming PDF.")
        suffix = ".pdf"

    # Create a unique temporary directory for this request
    with tempfile.TemporaryDirectory() as temp_dir_str:
        temp_dir = Path(temp_dir_str)
        tmp_path = temp_dir / file.filename
        
        try:
            # Save the uploaded file into the dedicated directory
            data = await file.read()
            with open(tmp_path, "wb") as f:
                f.write(data)

            response = await process_local_file(tmp_path, file.filename, temp_dir, processor_type)
            return JSONResponse(response)
        except Exception as exc:
            print(f"Error processing file {file.filename}: {exc}")
            raise HTTPException(status_code=500, detail=str(exc))
        # The temporary directory and its contents are automatically removed here

@app.post("/predict/url", dependencies=[Depends(verify_api_key)])
async def predict_from_url(payload: URLPayload, processor_type: str = Query("all", enum=["all", "fitz", "ocr"], description="The processing engine to use.")):
    """
    Accepts a URL (e.g., a SAS link to a blob) in a JSON payload, downloads the file,
    processes it, uploads results to the provided upload URL, and returns metadata. Requires an API key.
    """
    # Extract filename from URL to determine file type
    try:
        # Strip query params like SAS tokens to get a clean path
        url_path = Path(payload.url.split('?')[0])
        original_filename = payload.filename
        suffix = url_path.suffix.lower()
        if not suffix:
            print(f"Warning: No file extension in URL '{payload.url}'. Assuming PDF.")
            suffix = ".pdf"
    except Exception:
        original_filename = "file_from_url"
        suffix = ".pdf"
        print(f"Warning: Could not determine filename from URL '{payload.url}'. Assuming PDF.")

    # Generate unique identifiers
    document_id = payload.document_id
    timestamp = datetime.utcnow().isoformat()

    # Create a unique temporary directory for this request
    with tempfile.TemporaryDirectory() as temp_dir_str:
        temp_dir = Path(temp_dir_str)
        tmp_path = temp_dir / original_filename

        try:
            # Download the file by streaming it directly to the temp file
            async with httpx.AsyncClient() as client:
                print(f"Streaming file from URL...")
                async with client.stream("GET", payload.url, follow_redirects=True, timeout=30.0) as response:
                    response.raise_for_status()
                    with open(tmp_path, "wb") as f:
                        async for chunk in response.aiter_bytes():
                            f.write(chunk)
                print("File downloaded successfully.")

            # Process the downloaded file
            processing_result = await process_local_file(tmp_path, original_filename, temp_dir, processor_type)
            
            # Determine which processor was actually used
            actual_processor_used = processor_type
            if processor_type == "all":
                # Check if we fell back to OCR by examining the structure
                if "pages_results" in processing_result and processing_result["pages_results"]:
                    first_page_results = processing_result["pages_results"][0].get("results", [])
                    if first_page_results and all(result.get("type") == "text" for result in first_page_results if "type" in result):
                        actual_processor_used = "fitz"
                    elif first_page_results and any("bbox" in result and "text" not in result for result in first_page_results):
                        actual_processor_used = "ocr"
                    else:
                        actual_processor_used = "fitz"  # Default assumption

            # Prepare result data for upload
            result_data = {
                "document_id": document_id,
                "processed_at": timestamp,
                "processor_used": actual_processor_used,
                "filename": original_filename,
                "source_url": payload.url,
                **processing_result
            }

            # Upload results to the provided SAS URL
            result_json = json.dumps(result_data, indent=2)
            result_bytes = result_json.encode('utf-8')
            
            async with httpx.AsyncClient() as client:
                print(f"Uploading OCR results to provided URL...")
                upload_response = await client.put(
                    payload.upload_url,
                    content=result_bytes,
                    headers={
                        'Content-Type': 'application/json',
                        'x-ms-blob-type': 'BlockBlob'
                    },
                    timeout=30.0
                )
                upload_response.raise_for_status()
                print("OCR results uploaded successfully.")

            # Return structured response with metadata
            response_data = {
                "document_id": document_id,
                "status": "completed",
                "processor_used": actual_processor_used,
                "filename": original_filename,
                "upload_url": payload.upload_url,
                "processed_at": timestamp,
                "num_pages": processing_result.get("num_pages", None)
            }
            
            return JSONResponse(response_data)

        except httpx.RequestError as exc:
            error_response = {
                "document_id": document_id,
                "status": "failed",
                "error": f"Failed to download file or upload results: {exc}",
                "filename": original_filename,
                "processor_used": None,
                "processed_at": timestamp,
                "num_pages": None
            }
            raise HTTPException(status_code=400, detail=error_response)
        except Exception as exc:
            print(f"Error processing from URL {payload.url}: {exc}")
            error_response = {
                "document_id": document_id,
                "status": "failed", 
                "error": str(exc),
                "filename": original_filename,
                "processor_used": processor_type,
                "processed_at": timestamp,
                "num_pages": None
            }
            raise HTTPException(status_code=500, detail=error_response)
        # The temporary directory and its contents are automatically removed here

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    """
    [DEPRECATED] This endpoint is deprecated and will be removed in a future version.
    It remains for backward compatibility and does not enforce API key authentication.
    Please use the secure `/predict/file` endpoint instead.
    """
    print("WARNING: Using deprecated '/predict/' endpoint. Please switch to '/predict/file' and use API key authentication.")
    suffix = Path(file.filename).suffix.lower() or ".pdf"

    # Create a unique temporary directory for this request
    with tempfile.TemporaryDirectory() as temp_dir_str:
        temp_dir = Path(temp_dir_str)
        tmp_path = temp_dir / file.filename

        try:
            # Save the uploaded file into the dedicated directory
            data = await file.read()
            with open(tmp_path, "wb") as f:
                f.write(data)
                
            response = await process_local_file(tmp_path, file.filename, temp_dir)
            return JSONResponse(response)
        except Exception as exc:
            raise HTTPException(status_code=500, detail=str(exc))
        # The temporary directory and its contents are automatically removed here


if __name__ == "__main__":
    import uvicorn
    # For production, run with a proper ASGI server like Gunicorn with Uvicorn workers.
    # Example: OCR_SERVICE_API_KEY=your_super_secret_key uvicorn app:app --host 0.0.0.0 --port 8888
    uvicorn.run("app:app", host="0.0.0.0", port=8888, reload=True)