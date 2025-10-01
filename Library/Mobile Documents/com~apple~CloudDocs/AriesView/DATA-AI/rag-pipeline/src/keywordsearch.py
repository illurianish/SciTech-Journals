import weaviate
import pandas as pd
import os
from typing import List

def keyword_search(weaviate_client,
                   keywords: List[str],
                   class_name: str = "LeaseDocument",
                   limit: int = 10):
    """Perform keyword-based BM25 search with Weaviate v4"""

    print(f"🔍 Searching for keywords: {keywords}")

    try:
        collection = weaviate_client.collections.get(class_name)
        query_string = " ".join(keywords)

        # Use BM25 search - simplified without operator for compatibility
        response = collection.query.bm25(
            query=query_string,
            limit=limit,
        )

        objects = response.objects

        if not objects:
            print(" No results found for keywords")
            return pd.DataFrame()

        # Format into DataFrame
        results = []
        for i, obj in enumerate(objects):
            props = obj.properties
            text = props.get("text", "")
            results.append({
                "rank": i + 1,
                "chunk_id": props.get("chunk_id", ""),
                "filename": props.get("filename", ""),
                "document_id": props.get("document_id", ""),
                "text_preview": (text[:300] + "...") if len(text) > 300 else text,
                "full_text": text,
                "score": getattr(obj.metadata, "score", None),
            })

        df = pd.DataFrame(results)
        print(f" Found {len(objects)} chunks containing keywords")
        return df

    except Exception as e:
        print(f"  Error performing keyword search: {e}")
        return pd.DataFrame()
