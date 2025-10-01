import weaviate
import pandas as pd
import os
from typing import List # type: ignore


def hybrid_search(weaviate_client,
                  query: str,
                  class_name: str = "LeaseDocument",
                  limit: int = 10,
                  alpha: float = 0.5):
    """
    Perform hybrid (vector + BM25) search with Weaviate v4 using latest API.
    """

    print(f" Hybrid search: '{query}' (alpha={alpha}, limit={limit})")

    collection = weaviate_client.collections.get(class_name)

    response = collection.query.hybrid(
        query=query,
        alpha=alpha,
        limit=limit,
        query_properties=["text"],         # Specify BM25 search on the "text" field
        return_properties=["chunk_id", "text", "filename", "document_id"],  # Which properties you want back
        return_metadata=["score"]         # Include search ranking score
    )

    objects = response.objects
    if not objects:
        print(" No matching chunks found.")
        return pd.DataFrame()

    results = []
    for i, obj in enumerate(objects):
        props = obj.properties
        results.append({
            "rank": i + 1,
            "chunk_id": props.get("chunk_id", ""),
            "filename": props.get("filename", ""),
            "document_id": props.get("document_id", ""),
            "text_preview": (props.get("text", "")[:300] + "..."),
            "full_text": props.get("text", ""),
            "score": getattr(obj.metadata, "score", None)
        })

    df = pd.DataFrame(results)
    print(f" Retrieved {len(df)} chunks.")

    print(results[0]["full_text"])
    return df

