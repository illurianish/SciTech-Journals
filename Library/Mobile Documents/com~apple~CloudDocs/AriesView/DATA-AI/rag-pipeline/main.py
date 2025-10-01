from fastapi import FastAPI, HTTPException, UploadFile, File, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import weaviate
import uvicorn
import os
import tempfile
import shutil
import requests
import json
from urllib.parse import urlparse
from datetime import datetime, timezone
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer, util
import sys
import logging
import torch
import traceback
from contextlib import asynccontextmanager
from src.prompts import create_legal_rag_prompt, create_generic_rag_prompt, general_rag_prompt
from src.checkcollection import check_collection_exists

# Load environment variables
load_dotenv()

# Environment configuration
DEFAULT_OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "mistral:7b")
DEFAULT_OLLAMA_URL = os.getenv("OLLAMA_URL", "https://ollama.ariesview.com")


# Weaviate Configuration
DEFAULT_WEAVIATE_HOST = os.getenv("WEAVIATE_HOST", "weaviate.ariesview.com")
DEFAULT_WEAVIATE_HTTP_PORT = int(os.getenv("WEAVIATE_HTTP_PORT", "8084"))
DEFAULT_WEAVIATE_GRPC_PORT = int(os.getenv("WEAVIATE_GRPC_PORT", "50051"))
DEFAULT_WEAVIATE_HTTP_SECURE = os.getenv("WEAVIATE_HTTP_SECURE", "false").lower() == "true"
DEFAULT_WEAVIATE_GRPC_SECURE = os.getenv("WEAVIATE_GRPC_SECURE", "false").lower() == "true"

# Import core functionality
from src.chunking import load_chunk_store_pdfs, load_chunks, setup_weaviate_schema
from src.semanticsearch import semantic_search
from src.keywordsearch import keyword_search
from src.hybridsearch import hybrid_search
from management_endpoints import router as management_router, set_weaviate_client
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_experimental.text_splitter import SemanticChunker
import src.database_embed


# Global variables
weaviate_client = None
embedding_model = None
text_splitter = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for FastAPI startup/shutdown events"""
    # Startup
    global weaviate_client, embedding_model, text_splitter
    try:
        # Connect to Weaviate
        weaviate_client = weaviate.connect_to_custom(
            http_host=DEFAULT_WEAVIATE_HOST,
            http_port=DEFAULT_WEAVIATE_HTTP_PORT,
            grpc_host=DEFAULT_WEAVIATE_HOST,
            grpc_port=DEFAULT_WEAVIATE_GRPC_PORT,
            grpc_secure=DEFAULT_WEAVIATE_GRPC_SECURE,
            http_secure=DEFAULT_WEAVIATE_HTTP_SECURE
        )
        print(" Connected to Weaviate successfully")
        
        # Inject Weaviate client into management endpoints
        set_weaviate_client(weaviate_client)
        
        # Check GPU availability and configure device
        if torch.cuda.is_available():
            device = "cuda"
            gpu_name = torch.cuda.get_device_name(0)
            print(f"🚀 GPU detected: {gpu_name}")
            print(f"   CUDA version: {torch.version.cuda}")
        else:
            device = "cpu"
            print("⚠️  No GPU detected, using CPU")
        
        # Load embedding model with GPU support (this takes time, so do it once at startup)
        print(f"🤖 Loading embedding model on {device.upper()}...")
        model_kwargs = {'device': device}
        encode_kwargs = {'device': device, 'batch_size': 32}
        
        embedding_model = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs=model_kwargs,
            encode_kwargs=encode_kwargs
        )
        text_splitter = SemanticChunker(embedding_model)
        print(f"✅ Embedding model loaded successfully on {device.upper()}")
        
    except Exception as e:
        print(f" Failed to initialize services: {e}")
    
    yield
    
    # Shutdown
    if weaviate_client:
        weaviate_client.close()
        print("🔌 Weaviate client connection closed")
    
    # Clean up embedding model if needed
    embedding_model = None
    text_splitter = None
    print(" Global resources cleaned up")

# Initialize FastAPI app
app = FastAPI(
    title="RAG Pipeline API for AriesView",
    description="A FastAPI application for processing PDFs and performing semantic, keyword, and hybrid searches using Weaviate",
    version="1.0.0",
    lifespan=lifespan
)

# Add management router to the app
app.include_router(management_router)

# Pydantic models
class SearchRequest(BaseModel):
    query: str
    limit: Optional[int] = 5
    class_name: Optional[str] = "LeaseDocument"

class HybridSearchRequest(BaseModel):
    query: str
    limit: Optional[int] = 10
    alpha: Optional[float] = 0.5
    class_name: Optional[str] = "LeaseDocument"

class RAGRequest(BaseModel):
    query: str
    search_type: Optional[str] = "hybrid"
    limit: Optional[int] = 5
    class_name: Optional[str] = "LeaseDocument"
    alpha: Optional[float] = 0.5
    ollama_model: Optional[str] = DEFAULT_OLLAMA_MODEL
    ollama_url: Optional[str] = DEFAULT_OLLAMA_URL
    include_context: Optional[bool] = True
    max_context_length: Optional[int] = 2000
    prompt_type: Optional[str] = "executive"

class OcrBlobProcessingRequest(BaseModel):
    sas_url: str
    user_id: str
    min_chunk_length: Optional[int] = 200

def get_weaviate_client():
    """Get Weaviate client"""
    global weaviate_client
    if weaviate_client is None:
        try:
            weaviate_client = weaviate.connect_to_custom(
                http_host=DEFAULT_WEAVIATE_HOST,
                http_port=DEFAULT_WEAVIATE_HTTP_PORT,
                grpc_host=DEFAULT_WEAVIATE_HOST,
                grpc_port=DEFAULT_WEAVIATE_GRPC_PORT,
                grpc_secure=DEFAULT_WEAVIATE_GRPC_SECURE,
                http_secure=DEFAULT_WEAVIATE_HTTP_SECURE
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to connect to Weaviate: {str(e)}")
    return weaviate_client


def call_ollama(prompt: str, model: str = DEFAULT_OLLAMA_MODEL, url: str = DEFAULT_OLLAMA_URL) -> Dict[str, Any]:
    """Call Ollama API"""
    try:
        response = requests.post(f"{url}/api/generate", json={
            "model": model,
            "prompt": prompt,
            "stream": False
        }, timeout=120)
        
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"Ollama API error: {response.text}")
        
        result = response.json()
        if "response" not in result:
            raise HTTPException(status_code=500, detail="Ollama API response missing 'response' field")
        
        return result
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Ollama connection error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling Ollama: {str(e)}")



def extract_chunks_from_results(search_results: Dict[str, Any]) -> List[str]:
    """Extract text chunks from search results"""
    chunks = []
    if "results" in search_results:
        for result in search_results["results"]:
            if "full_text" in result:
                chunks.append(result["full_text"])
            elif "text_preview" in result:
                chunks.append(result["text_preview"])
    return chunks


def simple_rerank(query: str, chunks: list[str], top_k) -> list[str]:
    """
    Rerank a list of text chunks by similarity to the query.
    """
    import torch
    
    # Detect GPU and use it if available
    device = "cuda" if torch.cuda.is_available() else "cpu"
    embedding_model = SentenceTransformer("all-MiniLM-L6-v2", device=device)

    query_embedding = embedding_model.encode(query, convert_to_tensor=True)

    # Compute all chunk embeddings in one batch for efficiency
    chunk_embeddings = embedding_model.encode(chunks, convert_to_tensor=True)

    # Compute cosine similarities between new query embedding and new chunk embeddings
    similarities = util.cos_sim(query_embedding, chunk_embeddings)[0]

    # Re-ranked precise similarity
    top_indices = similarities.topk(k=top_k).indices

    res = []
    for i in top_indices:
        res.append(chunks[i])

    return res


@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "RAG Pipeline API for AriesView",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "upload_pdf": "/upload-pdf",
            "process_ocr": "/process-ocr-blob",
            "semantic_search": "/search/semantic",
            "hybrid_search": "/search/hybrid",
            "rag_query": "/rag/query",
            "management": "/management"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        client = get_weaviate_client()
        # Test connection
        collections = client.collections.list_all()
        return {
            "status": "healthy",
            "weaviate_connected": True,
            "collections_count": len(collections)
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "weaviate_connected": False,
            "error": str(e)
        }

@app.post("/upload-pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    class_name: str = Query("LeaseDocument"),
    min_chunk_length: int = Query(200)
):
    """Upload and process a single PDF file"""
    try:
        # Validate file type

        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        # Save uploaded file temporarily
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
                shutil.copyfileobj(file.file, temp_file)
                temp_file_path = temp_file.name
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error saving uploaded file: {str(e)}")
        
        
        try:
            client = get_weaviate_client()
            
            # Process the uploaded PDF with pre-loaded models
            processed_docs = load_chunk_store_pdfs(
                pdf_paths=[temp_file_path],
                weaviate_client=client,
                class_name=class_name,
                embedding_model=embedding_model,
                text_splitter=text_splitter,
                min_chunk_length=min_chunk_length
            )
            return {
                "message": "PDF uploaded and processed successfully",
                "filename": file.filename,
                "processed_docs": processed_docs
            }
            
        finally:
            # Clean up temporary file
            #if temp_file_path and os.path.exists(temp_file_path):
                print(f"🧹 Deleting temp file: {temp_file_path}")
                #os.unlink(temp_file_path)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading PDF: {str(e)}")

@app.post("/process-ocr-blob")
async def process_ocr_blob(request: OcrBlobProcessingRequest):
    """
    Process OCR JSON from Azure Blob Storage SAS URL and update Weaviate
    This endpoint:
    1. Downloads OCR JSON from the provided SAS URL
    2. Processes it through spatial chunking
    3. Stores the chunks in Weaviate vector database
    """
    try:
        print(f"🔄 Processing OCR blob from SAS URL")
        print(f"   URL: {request.sas_url}")
        print(f"   Class: {request.user_id}")
        
        # TODO 1: Validate SAS URL format and accessibility
        if not request.sas_url or not request.sas_url.startswith(('http://', 'https://')):
            raise HTTPException(status_code=400, detail="Invalid SAS URL format")
        
        # TODO 2: Download OCR JSON from blob storage
        print(" Downloading OCR JSON from blob storage...")
        try:
            response = requests.get(request.sas_url, timeout=60)
            response.raise_for_status()
            
            # Validate JSON content
            ocr_data = response.json()
            print(f"   ✅ Successfully downloaded OCR JSON ({len(response.content)} bytes)")
            
        except requests.exceptions.RequestException as e:
            raise HTTPException(status_code=400, detail=f"Failed to download from SAS URL: {str(e)}")
        except json.JSONDecodeError as e:
            raise HTTPException(status_code=400, detail=f"Invalid JSON format in blob: {str(e)}")

        # Set up schema
        user_id = request.user_id
        class_name = f"User_{user_id}"
        weaviate_client = get_weaviate_client()
        try:
            if class_name not in weaviate_client.collections.list_all():
                setup_weaviate_schema(weaviate_client, class_name)
            collection = weaviate_client.collections.get(class_name)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error setting up Weaviate collection for {user_id}: {str(e)}")
        
        # chunk and store in weaviate
        try:
            chunks_metadata = load_chunks(collection, ocr_data, embedding_model=embedding_model, text_splitter=text_splitter, min_chunk_length=request.min_chunk_length)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error in chunking: {str(e)}")
        
        # TODO 10: Return comprehensive processing results
        return {
            "message": "OCR blob processed successfully",
            "sas_url": request.sas_url,
            "user_id": request.user_id,
            "class_name": class_name,
            "document_metadata": {
                "document_id": ocr_data['document_id'],
                "filename": ocr_data['filename'],
                "source": request.sas_url,
                "processing_method": "semantic_chunking"
            }
        }
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        # Catch any unexpected errors
        import traceback
        print(f" Unexpected error in OCR blob processing: {e}")
        print(f"   Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Unexpected error processing OCR blob: {str(e)}")

@app.post("/search/semantic")
async def semantic_search_endpoint(request: SearchRequest):
    """Perform semantic search"""
    try:
        client = get_weaviate_client()
        results_df = semantic_search(
            weaviate_client=client,
            query=request.query,
            class_name=request.class_name,
            limit=request.limit,
            embedding_model=embedding_model
        )
        
        if results_df is None or results_df.empty:
            return {
                "message": "No results found",
                "query": request.query,
                "results": []
            }
        
        # Convert DataFrame to list of dictionaries
        results_list = results_df.to_dict('records')
        
        return {
            "message": f"Found {len(results_list)} results",
            "query": request.query,
            "results": results_list,
            "total_results": len(results_list)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error performing semantic search: {str(e)}")

@app.post("/search/hybrid")
async def hybrid_search_endpoint(request: HybridSearchRequest):
    """Perform hybrid search (semantic + keyword)"""
    try:
        client = get_weaviate_client()

        results_df = hybrid_search(
            weaviate_client=client,
            query=request.query,
            class_name=request.class_name,
            limit=request.limit,
            alpha=request.alpha
        )
        
        if results_df.empty:
            return {
                "message": "No results found",
                "query": request.query,
                "alpha": request.alpha,
                "results": []
            }
        
        # Convert DataFrame to list of dictionaries
        results_list = results_df.to_dict('records')
        
        return {
            "message": f"Found {len(results_list)} results",
            "query": request.query,
            "alpha": request.alpha,
            "results": results_list,
            "total_results": len(results_list)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error performing hybrid search: {str(e)}")

@app.post("/rag/query")
async def rag_query_endpoint(request: RAGRequest):
    """Comprehensive RAG endpoint that combines search and LLM generation"""
    try:
        print(f"🔍 RAG Query received: '{request.query}' (search_type: {request.search_type}, class: {request.class_name})")
    
        # Check if collection exists using helper function
        collection_exists = check_collection_exists(request.class_name, weaviate_client)
        print(f"   Collection '{request.class_name}' exists: {collection_exists}")
        
        if not collection_exists:
            print(f"   Collection '{request.class_name}' does not exist, using generic prompt")
            # Generate generic response when collection doesn't exist
            generic_prompt = create_generic_rag_prompt(request.query)
            
            try:
                ollama_result = call_ollama(generic_prompt, request.ollama_model, request.ollama_url)
                llm_response = ollama_result.get("response", "")
            except Exception as e:
                print(f"   Error generating generic response: {e}")
                llm_response = f"I apologize, but I encountered an error while processing your request. Please try again later. Error: {str(e)}"
            
            return {
                "query": request.query,
                "llm_response": llm_response,
                "ollama_model": request.ollama_model,
                "chunks_used": 0,
                "collection_exists": False
            }
        
        # Collection exists, proceed with normal RAG flow
        print(f"   Collection '{request.class_name}' exists, proceeding with search")
        client = get_weaviate_client()
        context_chunks = []
        
        # Perform search based on search_type
        if request.search_type == "semantic":
            results_df = semantic_search(
                weaviate_client=client,
                query=request.query,
                class_name=request.class_name,
                limit=request.limit,
                embedding_model=embedding_model
            )
            if results_df is not None and not results_df.empty:
                context_chunks.extend(extract_chunks_from_results({"results": results_df.to_dict('records')}))
                
        elif request.search_type == "hybrid":
            results_df = hybrid_search(
                weaviate_client=client,
                query=request.query,
                class_name=request.class_name,
                limit=request.limit,
                alpha=request.alpha
            )
            if not results_df.empty:
                context_chunks.extend(extract_chunks_from_results({"results": results_df.to_dict('records')}))
                
        elif request.search_type == "all":
            # Semantic search
            semantic_df = semantic_search(
                weaviate_client=client,
                query=request.query,
                class_name=request.class_name,
                limit=request.limit,
                embedding_model=embedding_model
            )
            if semantic_df is not None and not semantic_df.empty:
                context_chunks.extend(extract_chunks_from_results({"results": semantic_df.to_dict('records')}))
            
            # Keyword search
            keywords = request.query.lower().split()
            keyword_df = keyword_search(
                weaviate_client=client,
                keywords=keywords,
                class_name=request.class_name,
                limit=request.limit
            )
            if not keyword_df.empty:
                context_chunks.extend(extract_chunks_from_results({"results": keyword_df.to_dict('records')}))
            
            # Hybrid search
            hybrid_df = hybrid_search(
                weaviate_client=client,
                query=request.query,
                class_name=request.class_name,
                limit=request.limit,
                alpha=request.alpha
            )
            if not hybrid_df.empty:
                context_chunks.extend(extract_chunks_from_results({"results": hybrid_df.to_dict('records')}))
        
        # Remove duplicates and generate response
        unique_chunks = list(dict.fromkeys(context_chunks))
        print(f"   Unique chunks after deduplication: {len(unique_chunks)}")

        k = 3 # Number of top chunks to use for LLM prompt

        # Rerank chunks by relevance to query   
        if len(unique_chunks) >= k:
            print(f"   Reranking chunks for relevance...")
            unique_chunks = simple_rerank(request.query, unique_chunks, top_k=k)

        # Generate LLM response
        if unique_chunks:
            print(f"   Generating document-based response with {len(unique_chunks)} chunks")
            prompt = create_legal_rag_prompt(request.query, unique_chunks, request.max_context_length) if request.include_context else f"Question: {request.query}\n\nAnswer:"
            ollama_result = call_ollama(prompt, request.ollama_model, request.ollama_url)
            llm_response = ollama_result.get("response", "")
        else:
            print(f"   No chunks found, generating general response")
            # Generate general response when no chunks found
            general_prompt = general_rag_prompt(request.query)
            
            ollama_result = call_ollama(general_prompt, request.ollama_model, request.ollama_url)
            llm_response = ollama_result.get("response", "")
        
        # Prepare response
        response_data = {
            "query": request.query,
            "search_type": request.search_type,
            "llm_response": llm_response,
            "ollama_model": request.ollama_model,
            "chunks_used": len(unique_chunks),
            "collection_exists": True
        }
        
        if request.include_context and unique_chunks:
            response_data["context_chunks"] = unique_chunks[:3]
        
        return response_data
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in RAG query: {str(e)}")
    


@app.post("/rag/database")
async def rag_database():
    """RAG endpoint that queries user data from the database and generates a response"""
    try:
        client = get_weaviate_client()
        user_id = 9

        data = src.database_embed.fetch_user_data(user_id=user_id)
        
        class_name = f"User_{user_id}"
        weaviate_client = get_weaviate_client()
        try:
            if class_name not in weaviate_client.collections.list_all():
                setup_weaviate_schema(weaviate_client, class_name)
            collection = weaviate_client.collections.get(class_name)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error setting up Weaviate collection for {user_id}: {str(e)}")
        
        summary_text = src.database_embed.format_data(data)

        device = "cuda" if torch.cuda.is_available() else "cpu"
        embedding_model = SentenceTransformer("all-MiniLM-L6-v2", device=device)
        vector = embedding_model.encode(summary_text, convert_to_tensor=True)
        src.database_embed.store_in_weaviate(collection, data, summary_text, vector)
        print("User data embedded and stored in Weaviate successfully.")
        
        '''return {
            "message": f"Found {len(results_list)} results",
            "query": request.query,
            "alpha": request.alpha,
            "results": results_list,
            "total_results": len(results_list)
        }'''

        return {
            "message": "User data embedded and stored in Weaviate successfully."
        }
        
    except Exception as e:
        print("ERROR in /rag/database:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error storing database data: {str(e)}")
    
if __name__ == "__main__":
    print("🚀 Starting server...", flush=True)
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)