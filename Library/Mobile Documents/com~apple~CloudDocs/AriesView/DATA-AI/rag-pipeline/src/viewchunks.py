import weaviate
import pandas as pd
import os
import numpy as np

# --- View Chunks ---

def view_chunks(weaviate_client, 
                class_name: str = "LeaseDocument",
                limit: int = 10,
                show_text_preview: bool = True):
    """View stored chunks in Weaviate"""
    
    print(f" Viewing chunks from {class_name}...")
    
    try:
        collection = weaviate_client.collections.get(class_name)
        
        response = collection.query.fetch_objects(limit=limit)
        objects = response.objects
        
        if not objects:
            print(" No data found")
            return None
        
        # Create DataFrame for better visualization
        chunks_data = []
        for obj in objects:
            props = obj.properties
            text = props.get("text", "")
            text_preview = text[:200] + "..." if show_text_preview and len(text) > 200 else text
            
            chunks_data.append({
                "chunk_id": props.get("chunk_id", ""),
                "filename": props.get("filename", ""),
                "document_id": props.get("document_id", ""),
                "chunk_index": props.get("chunk_index", 0),
                "text_length": len(text),
                "text_preview": text_preview if show_text_preview else "...",
                "created_at": props.get("created_at", "")
            })
        
        df = pd.DataFrame(chunks_data)
        print(f" Found {len(objects)} chunks (showing first {limit})")
        return df
        
    except Exception as e:
        print(f" Error viewing chunks: {e}")
        return None

