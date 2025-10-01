import os
import weaviate
from langchain_community.embeddings import HuggingFaceEmbeddings
import pandas as pd
from typing import List # type: ignore

# --- Semantic Search ---

def semantic_search(weaviate_client,
                   query: str,
                   class_name: str = "LeaseDocument",
                   limit: int = 5,
                   embedding_model=None):
    """Perform semantic search on stored chunks"""
    
    print(f"🔍 Searching for: '{query}'")
    
    try:
        # Use provided embedding model or load it if not provided
        if embedding_model is None:
            print("⚠️ Loading embedding model (consider passing pre-loaded model for better performance)...")
            hf_model_name = "sentence-transformers/all-MiniLM-L6-v2"
            embedding_model = HuggingFaceEmbeddings(model_name=hf_model_name)
        else:
            print("✅ Using pre-loaded embedding model")
        
        # Generate query vector
        query_vector = embedding_model.embed_query(query)
        
        collection = weaviate_client.collections.get(class_name)
        
        # Perform search
        response = collection.query.near_vector(
            near_vector=query_vector,
            limit=limit,
            return_metadata=weaviate.classes.query.MetadataQuery(distance=True)
        )
        
        objects = response.objects
        
        if not objects:
            print(" No results found")
            return None
        
        # Format results
        search_results = []
        for i, obj in enumerate(objects):
            props = obj.properties
            text = props.get("text", "")
            
            search_results.append({
                "rank": i + 1,
                "chunk_id": props.get("chunk_id", ""),
                "filename": props.get("filename", ""),
                "document_id": props.get("document_id", ""),
                "distance": obj.metadata.distance if obj.metadata else None,
                "text_preview": text[:300] + "..." if len(text) > 300 else text,
                "full_text": text
            })
        
        # Create DataFrame
        df = pd.DataFrame(search_results)
        print(f" Found {len(objects)} relevant chunks")
        
        return df
        
    except Exception as e:
        print(f" Error performing semantic search: {e}")
        return None