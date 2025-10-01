import os
import fitz  # PyMuPDF
from langchain.docstore.document import Document
import weaviate
from weaviate.classes.config import Configure, Property, DataType
from langchain_experimental.text_splitter import SemanticChunker
from langchain_community.embeddings import HuggingFaceEmbeddings
from datetime import datetime
from typing import List 
import re


def load_pdf_as_document(file_path: str) -> Document:
    """Load PDF and return as LangChain Document"""

    # Check file path exists
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    
    doc = fitz.open(file_path)
    print(f"Opened {file_path}, {len(doc)} pages")
    for i in range(len(doc)):
        page = doc[i]
        # Use get_text if available, else fallback to getText for compatibility
        text = page.get_text() if hasattr(page, 'get_text') else page.getText()  
        print(f"Page {i+1} text length: {len(text)}")
    text = "\n".join([
        doc[i].get_text() if hasattr(doc[i], 'get_text') else doc[i].getText()  
        for i in range(len(doc))
    ])
    filename = os.path.basename(file_path)
    doc.close()
    print(f"Total extracted {len(text)} characters from {filename}")
    return Document(page_content=text, metadata={"Title": filename, "source": file_path})

# --- Setup Weaviate Schema ---

def setup_weaviate_schema(client, class_name: str = "LeaseDocument"):
    """Setup Weaviate schema for v4"""
    try:
        # Check if collection exists and delete if it does
        if client.collections.exists(class_name):
            print(f" Collection {class_name} already exists. Deleting and recreating...")
            client.collections.delete(class_name)
        
        # Create collection with v4 syntax
        client.collections.create(
            name=class_name,
            vectorizer_config=weaviate.classes.config.Configure.Vectorizer.text2vec_transformers(),
            properties=[
                weaviate.classes.config.Property(name="text", data_type=weaviate.classes.config.DataType.TEXT),
                weaviate.classes.config.Property(name="filename", data_type=weaviate.classes.config.DataType.TEXT),
                weaviate.classes.config.Property(name="document_id", data_type=weaviate.classes.config.DataType.TEXT),
                weaviate.classes.config.Property(name="chunk_id", data_type=weaviate.classes.config.DataType.TEXT),
                weaviate.classes.config.Property(name="chunk_index", data_type=weaviate.classes.config.DataType.INT),
                weaviate.classes.config.Property(name="created_at", data_type=weaviate.classes.config.DataType.TEXT),
                weaviate.classes.config.Property(name="source", data_type=weaviate.classes.config.DataType.TEXT),
                weaviate.classes.config.Property(name="title", data_type=weaviate.classes.config.DataType.TEXT)   
            ]
        )

        # Create collection for User Profile
        client.collections.create(
                name="User_Profile_"+class_name,
                vectorizer_config=weaviate.classes.config.Configure.Vectorizer.text2vec_transformers(),
                properties=[
                    weaviate.classes.config.Property(name="user_id", data_type=weaviate.classes.config.DataType.TEXT),
                    weaviate.classes.config.Property(name="email", data_type=weaviate.classes.config.DataType.TEXT),
                    weaviate.classes.config.Property(name="display_name", data_type=weaviate.classes.config.DataType.TEXT),
                    weaviate.classes.config.Property(name="role", data_type=weaviate.classes.config.DataType.TEXT),
                    weaviate.classes.config.Property(name="summary", data_type=weaviate.classes.config.DataType.TEXT),
                    weaviate.classes.config.Property(name="created_at", data_type=weaviate.classes.config.DataType.TEXT),
                    weaviate.classes.config.Property(name="tags", data_type=weaviate.classes.config.DataType.TEXT)
                ]
        )

        print(f" Created Weaviate collection: {class_name}")
        
    except Exception as e:
        print(f" Error setting up schema: {e}")
        raise

# --- Load Chunks, Embed, Store in Weaviate ---

def extract_label_value_chunks_from_paddleocr(ocr_data):
    """
    Extract label-value chunks from PaddleOCR JSON using heuristics for better context.
    Accepts loaded JSON dict (not file path).
    Returns a list of chunk dicts.
    """
    all_chunks = []
    for page in ocr_data.get("pages_results", []):
        page_num = page.get("page", None)
        blocks = []
        for result in page.get("results", []):
            for block in result.get("res", {}).get("parsing_res_list", []):
                text = block.get("block_content", "").strip()
                if text:
                    blocks.append({
                        "page": page_num,
                        "block_label": block.get("block_label"),
                        "block_bbox": block.get("block_bbox"),
                        "text": text
                    })
        # Sort blocks top-to-bottom, then left-to-right
        blocks.sort(key=lambda b: (b["block_bbox"][1], b["block_bbox"][0]))

        i = 0
        while i < len(blocks):
            block = blocks[i]
            def is_label(text):
                return text.strip().endswith(":") or (len(text.strip()) < 40 and ":" in text)
            if is_label(block["text"]):
                chunk_text = block["text"]
                chunk_label = block["block_label"]
                chunk_bbox = block["block_bbox"]
                j = i + 1
                while j < len(blocks) and not is_label(blocks[j]["text"]):
                    chunk_text += " " + blocks[j]["text"]
                    j += 1
                all_chunks.append({
                    "page": block["page"],
                    "block_label": chunk_label,
                    "block_bbox": chunk_bbox,
                    "text": chunk_text
                })
                i = j
            else:
                all_chunks.append(block)
                i += 1
    return all_chunks

# --- Load Chunks, Embed, Store in Weaviate ---

def load_chunks(collection, ocr_data: dict, embedding_model=None, text_splitter=None, min_chunk_length: int = 200):
    """Process content and store chunks in Weaviate vector database. Supports PaddleOCR JSON with label-value chunking."""
    # Use provided embedding model and text splitter, or load them if not provided
    if embedding_model is None or text_splitter is None:
        print(" Loading embedding model (consider passing pre-loaded model for better performance)...")
        hf_model_name = "sentence-transformers/all-MiniLM-L6-v2"
        embedding_model = HuggingFaceEmbeddings(model_name=hf_model_name)
        text_splitter = SemanticChunker(embedding_model)
    else:
        print(" Using pre-loaded embedding model and text splitter")
    document_id = ocr_data.get('document_id', None)
    filename = ocr_data.get('filename', None)

    # Detect PaddleOCR format (has parsing_res_list)
    has_structured_parsing_data = False
    for page in ocr_data.get("pages_results", []):
        for result in page.get("results", []):
            if "res" in result and "parsing_res_list" in result["res"]:
                has_structured_parsing_data = True
                break
        if has_structured_parsing_data:
            break

    if has_structured_parsing_data:
        chunks_data = extract_label_value_chunks_from_paddleocr(ocr_data)
        # Use the chunked text directly
        chunks = [c for c in chunks_data if len(c["text"]) > min_chunk_length]
    else:
        content = []
        for page in ocr_data.get('pages_results', []):
            content.extend([result['text'] for result in page.get('results', []) if result.get('type') == 'text'])
        content = " ".join(content)
        # Semantic Chunking
        chunks = text_splitter.create_documents([content])
        chunks = [c for c in chunks if len(c.page_content) > min_chunk_length]
        # Convert to dict for uniformity
        chunks = [{"text": c.page_content} for c in chunks]

    print(f" Created {len(chunks)} chunks from OCR data")

    # Prepare batch data for efficient insertion
    objects = []
    for i, chunk in enumerate(chunks):
        chunk_id = f"{document_id or 'content'}_chunk_{i}"
        
        # Generate embedding
        vector = embedding_model.embed_query(chunk["text"])
        # Prepare properties
        properties = {
            "text": chunk["text"],
            "filename": filename,
            "document_id": document_id,
            "chunk_id": chunk_id,
            "chunk_index": i,
            "created_at": datetime.now().isoformat()
        }
        
        # Add to batch
        objects.append(weaviate.classes.data.DataObject(
            properties=properties,
            vector=vector
        ))
    

    try:
        collection.data.insert_many(objects)
        print(f" Inserted {len(objects)} chunks into Weaviate")
    except Exception as e:
        print(f" Error with batch insert: {e}")
        successful_inserts = 0
        for obj in objects:
            try:
                collection.data.insert(obj.properties, vector=obj.vector)
                successful_inserts += 1
            except Exception as insert_error:
                print(f"  Error inserting individual chunk: {insert_error}")
        print(f" Inserted {successful_inserts} chunks individually")
    
    return {
        "chunks_created": len(chunks),
        "total_chars": sum(len(c["text"]) for c in chunks),
        "filename": filename,
        "document_id": document_id
    }

def combine_short_chunks_by_page(chunks, min_length=200):
    merged = []
    buffer = None
    for chunk in chunks:
        # Ensure block_label and block_bbox are lists for merging
        chunk = chunk.copy()
        if not isinstance(chunk.get('block_label'), list):
            chunk['block_label'] = [chunk.get('block_label')]
        if not isinstance(chunk.get('block_bbox'), list):
            chunk['block_bbox'] = [chunk.get('block_bbox')]
        if buffer is None:
            buffer = chunk
            continue
        if (len(buffer['text']) < min_length and buffer.get('page') == chunk.get('page')):
            buffer['text'] += "\n" + chunk['text']
            buffer['block_label'].extend(chunk['block_label'])
            buffer['block_bbox'].extend(chunk['block_bbox'])
        else:
            merged.append(buffer)
            buffer = chunk
    if buffer:
        merged.append(buffer)
    return merged

# --- Load Chunks, Embed, Store in Weaviate ---

def load_chunk_store_pdfs(pdf_paths: List[str], weaviate_client, class_name: str = "LeaseDocument",
                         embedding_model=None, text_splitter=None, min_chunk_length: int = 200):
    """Process PDFs and store in Weaviate vector database"""
    
    # Use provided embedding model and text splitter, or load them if not provided
    if embedding_model is None or text_splitter is None:
        print("Loading embedding model (consider passing pre-loaded model for better performance)...")
        hf_model_name = "sentence-transformers/all-MiniLM-L6-v2"
        embedding_model = HuggingFaceEmbeddings(model_name=hf_model_name)
        text_splitter = SemanticChunker(embedding_model)
    else:
        print(" Using pre-loaded embedding model and text splitter")
    
    # Setup Weaviate schema
    setup_weaviate_schema(weaviate_client, class_name)
    
    # Get collection reference
    collection = weaviate_client.collections.get(class_name)
    
    total_chunks = 0
    processed_docs = []
    
    for pdf_path in pdf_paths:
        print(f" Processing {pdf_path}...")
        
        # Load document
        if not os.path.exists(pdf_path):
            print(f"⚠️ File not found: {pdf_path}")
            continue
        
        try:
            doc = load_pdf_as_document(pdf_path)
        except Exception as e:
            print(f"❌ Exception while loading PDF: {e}")
        
        # Get content
        content = doc.page_content
        
        # Try to extract blocks with metadata
        blocks_with_metadata = None
        
        if blocks_with_metadata:
            # Merge small blocks for context
            merged_chunks = combine_short_chunks_by_page(blocks_with_metadata, min_length=min_chunk_length)
            chunks = merged_chunks
        else:
            # Use section-based chunking for lease documents
            chunks_text = split_text_by_lease_sections(content, min_length=min_chunk_length, max_length=1200)
            # Wrap as dicts for uniformity
            chunks = [{"text": t} for t in chunks_text]
        # Print out the first 10 chunks for inspection
        print(f"\n--- First 10 chunks for {os.path.basename(pdf_path)} ---")
        for idx, chunk in enumerate(chunks[:10]):
            text = chunk["text"]
            print(f"\nChunk {idx+1} (length {len(text)}):\n{text[:500]}{'...' if len(text) > 500 else ''}")
        # Now, 'chunks' is a list of meaningful text segments
        objects = []
        for i, chunk in enumerate(chunks):
            chunk_id = f"{os.path.basename(pdf_path)}_chunk_{i}"
            vector = embedding_model.embed_query(chunk["text"])
            properties = {
                "text": chunk["text"],
                "source": pdf_path,
                "title": doc.metadata.get("Title", ""),
                "chunk_id": chunk_id,
                "chunk_index": i,
                "created_at": datetime.now().isoformat()
            }
            # Add metadata if present
            if "page" in chunk:
                properties["page"] = chunk["page"]
            if "block_label" in chunk:
                properties["block_label"] = chunk["block_label"]
            if "block_bbox" in chunk:
                properties["block_bbox"] = chunk["block_bbox"]
            objects.append(weaviate.classes.data.DataObject(
                properties=properties,
                vector=vector
            ))
        
        
        try:
            collection.data.insert_many(objects)
            print(f" Inserted {len(objects)} chunks from {pdf_path}")
        except Exception as e:
            print(f" Error inserting chunks: {e}")
            
            for obj in objects:
                try:
                    collection.data.insert(obj.properties, vector=obj.vector)
                except Exception as insert_error:
                    print(f"  Error inserting individual chunk: {insert_error}")
        
        total_chunks += len(chunks)
        processed_docs.append({
            "file": pdf_path,
            "chunks": len(chunks),
            "total_chars": len(content),
            "chunkDetails": chunks
        })
    
    print(f" Stored {total_chunks} chunks from {len(pdf_paths)} documents in Weaviate")
   
    return processed_docs

def split_text_by_lease_sections(text, min_length=300, max_length=1500):
    # Regex for lease headings (Section, Article, Exhibit, etc.)
    pattern = r'(^((SECTION|ARTICLE|EXHIBIT|SCHEDULE)\s+[A-Z0-9]+|^[A-Z][A-Z\s\d\.\:\-]{5,}$|^\d+\.\s+[A-Z][A-Za-z\s]+|^[A-Z]\.\s+[A-Z][A-Za-z\s]+))'
    matches = list(re.finditer(pattern, text, flags=re.MULTILINE))
    chunks = []
    last_end = 0

    if not matches:
        # No headings found, return the whole text as one chunk
        return [text.strip()]

    for i, match in enumerate(matches):
        start = match.start()
        if i > 0:
            # Previous chunk: from last_end to this heading's start
            chunk_text = text[last_end:start].strip()
            if chunk_text:
                chunks.append(chunk_text)
        # This heading: from heading start to next heading or end
        heading = match.group().strip()
        if i + 1 < len(matches):
            next_start = matches[i + 1].start()
            content = text[match.end():next_start].strip()
        else:
            content = text[match.end():].strip()
        chunk = f"{heading}\n{content}" if content else heading
        chunks.append(chunk)
        last_end = match.end() + len(content)

    # Merge short chunks with the next one
    merged_chunks = []
    buffer = ""
    for chunk in chunks:
        if len(buffer) == 0:
            buffer = chunk
        elif len(buffer) < min_length:
            buffer += "\n" + chunk
        else:
            merged_chunks.append(buffer)
            buffer = chunk
    if buffer:
        merged_chunks.append(buffer)
    # Further split long chunks by paragraphs if needed
    final_chunks = []
    for chunk in merged_chunks:
        if len(chunk) > max_length:
            paragraphs = [p.strip() for p in chunk.split('\n\n') if p.strip()]
            para_buffer = ""
            for para in paragraphs:
                if len(para_buffer) + len(para) < max_length:
                    para_buffer += ("\n\n" if para_buffer else "") + para
                else:
                    if para_buffer:
                        final_chunks.append(para_buffer)
                    para_buffer = para
            if para_buffer:
                final_chunks.append(para_buffer)
        else:
            final_chunks.append(chunk)
    return final_chunks

