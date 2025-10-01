from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
import weaviate
from datetime import datetime
import traceback

from src.viewchunks import view_chunks
from src.keywordsearch import keyword_search

# Create router for management endpoints
router = APIRouter(prefix="/management", tags=["Management"])

# Pydantic models
class KeywordSearchRequest(BaseModel):
    keywords: List[str]
    limit: Optional[int] = 10
    class_name: Optional[str] = "LeaseDocument"

def get_weaviate_client():
    """Get Weaviate client - this should be injected from main.py"""
    # This will be overridden by the main app
    raise NotImplementedError("Weaviate client should be injected from main app")

# Setter function to inject dependencies
def set_weaviate_client(client):
    """Set the Weaviate client for this module"""
    global get_weaviate_client
    get_weaviate_client = lambda: client

# --- Chunks Management Endpoints ---

@router.get("/chunks")
async def view_chunks_endpoint(
    limit: int = Query(10, ge=1, le=100),
    class_name: str = Query("LeaseDocument"),
    show_text_preview: bool = Query(True)
):
    """View stored chunks in Weaviate"""
    try:
        client = get_weaviate_client()
        chunks_df = view_chunks(client, class_name, limit, show_text_preview)
        
        if chunks_df is None:
            return {"message": "No chunks found", "chunks": []}
        
        # Convert DataFrame to list of dictionaries
        chunks_list = chunks_df.to_dict('records')
        
        return {
            "message": f"Retrieved {len(chunks_list)} chunks",
            "chunks": chunks_list,
            "total_returned": len(chunks_list)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error viewing chunks: {str(e)}")

# --- Keyword Search Endpoint ---

@router.post("/search/keyword")
async def keyword_search_endpoint(request: KeywordSearchRequest):
    """Perform keyword-based search"""
    try:
        client = get_weaviate_client()
        results_df = keyword_search(
            weaviate_client=client,
            keywords=request.keywords,
            class_name=request.class_name,
            limit=request.limit
        )
        
        if results_df.empty:
            return {
                "message": "No results found",
                "keywords": request.keywords,
                "results": []
            }
        
        # Convert DataFrame to list of dictionaries
        results_list = results_df.to_dict('records')
        
        return {
            "message": f"Found {len(results_list)} results",
            "keywords": request.keywords,
            "results": results_list,
            "total_results": len(results_list)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error performing keyword search: {str(e)}")

# --- Collections Management Endpoints ---

@router.get("/collections")
async def list_collections():
    """List all Weaviate collections"""
    try:
        client = get_weaviate_client()
        collection_names = client.collections.list_all()
        
        collection_info = []
        for collection_name in collection_names:
            try:
                # Get collection object
                collection = client.collections.get(collection_name)
                # Get collection stats
                response = collection.query.fetch_objects(limit=10000)
                count = len(response.objects) if response.objects else 0
                collection_info.append({
                    "name": collection_name,
                    "object_count": count
                })
            except Exception as e:
                collection_info.append({
                    "name": collection_name,
                    "object_count": "unknown",
                    "error": str(e)
                })
        
        return {
            "message": "Collections retrieved successfully",
            "collections": collection_info,
            "total_collections": len(collection_names)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing collections: {str(e)}")

@router.delete("/collections/{collection_name}")
async def delete_collection_by_name(
    collection_name: str,
    confirm: bool = Query(False, description="Must be set to true to confirm deletion")
):
    """Delete a specific Weaviate collection by name with warnings"""
    try:
        client = get_weaviate_client()
        
        # Check if confirmation is provided
        if not confirm:
            return {
                "warning": "⚠️ DELETION NOT CONFIRMED",
                "message": f"To delete collection '{collection_name}', set confirm=true",
                "collection_name": collection_name,
                "danger": "This action will permanently delete all data in the collection",
                "example": f"DELETE /management/collections/{collection_name}?confirm=true"
            }
        
        # Check if collection exists
        if collection_name not in client.collections.list_all():
            raise HTTPException(status_code=404, detail=f"Collection '{collection_name}' not found")
        
        # Get collection info before deletion for warning
        try:
            collection = client.collections.get(collection_name)
            response = collection.query.fetch_objects(limit=10000)
            object_count = len(response.objects) if response.objects else 0
        except Exception:
            object_count = "unknown"
        
        # Delete the collection
        client.collections.delete(collection_name)
        
        return {
            "message": f"✅ Collection '{collection_name}' deleted successfully",
            "collection_name": collection_name,
            "objects_deleted": object_count,
            "timestamp": datetime.now().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error deleting collection '{collection_name}': {e}")
        raise HTTPException(status_code=500, detail=f"Error deleting collection: {str(e)}") 