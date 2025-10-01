from weaviate.client import WeaviateClient

def check_collection_exists(class_name: str, client: WeaviateClient) -> bool:
    """
    Check if a collection exists based on class name.
    
    Args:
        class_name (str): Name of the collection to check
        
    Returns:
        bool: True if collection exists, False otherwise
    """
    try:
        # Get all available collections
        all_collections = client.collections.list_all()
        # Handle empty collections
        if not all_collections:
            print(f"   No collections found in Weaviate")
            return False
        
        # Handle different return types from list_all()
        collection_names = []
        
        # Check if it's a dictionary (some client versions return dict)
        if isinstance(all_collections, dict):
            collection_names = list(all_collections.keys())
        # Check if it's a list
        elif isinstance(all_collections, list):
            # Check if first element is string
            if isinstance(all_collections[0], str):
                collection_names = all_collections
            else:
                # Handle objects - try multiple attribute names
                collection_names = []
                for col in all_collections:
                    if hasattr(col, 'name'):
                        collection_names.append(col.name)
                    elif hasattr(col, 'config') and hasattr(col.config, 'name'):
                        collection_names.append(col.config.name)
                    elif hasattr(col, 'class_name'):
                        collection_names.append(col.class_name)
                    else:
                        # Fallback: convert to string and hope it's the name
                        collection_names.append(str(col))
        else:
            # Fallback for unexpected types
            collection_names = [str(col) for col in all_collections]
        
        print(f"   Available collection names: {collection_names}")
        print(f"   Looking for collection: '{class_name}'")
        
        # Check if the collection name exists in the list
        exists = class_name in collection_names
        
        if exists:
            print(f"   ✅ Collection '{class_name}' found in Weaviate")
        else:
            print(f"   ❌ Collection '{class_name}' NOT found in Weaviate")
            
        return exists
        
    except Exception as e:
        print(f"Warning: Error checking collection {class_name}: {e}")
        return False
    