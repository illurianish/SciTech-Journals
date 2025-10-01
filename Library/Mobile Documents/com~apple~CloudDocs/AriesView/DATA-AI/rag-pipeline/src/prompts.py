from typing import List

def create_legal_rag_prompt(query: str, context_chunks: List[str], max_length: int = 5000) -> str:
    """Create RAG prompt with context truncation"""
    context_text = "\n\n".join(context_chunks)
    if len(context_text) > max_length:
        context_text = context_text[:max_length] + "..."
    
    return f"""You are a helpful legal assistant specialized in lease agreements.
Answer the user's question using only the content from the lease document.

Relevant Lease Content:
{context_text}

Be accurate, concise, and formal in your responses.
If the answer is not in the document, say 'Not mentioned in the lease.'
Cite specific sections or phrases from the lease document when possible.

Question: {query}

Answer:"""


def create_generic_rag_prompt(query: str) -> str:
    return f"""You are a helpful AI assistant for AriesView, a real estate investment and management platform.
    
    The user asked: "{query}"
    
    I don't have access to your specific documents yet. To provide more accurate and detailed answers based on your actual documents, please upload your documents to the platform first.
    
    Here's a general response about your question:
    
    Please provide a helpful response about real estate investment, property management, or related topics. If the question is about specific documents or data that would need to be uploaded, politely explain that you'd need access to those documents to provide a detailed answer.
    
    Keep your response informative, professional, and relevant to real estate and investment topics.
    
    Answer:"""

def general_rag_prompt(query: str) -> str:
    return f"""You are a helpful AI assistant for AriesView, a real estate investment and management platform. 
            
The user asked: "{query}"

No relevant documents were found in the collection. Please provide a helpful general response about real estate investment, property management, or related topics. If the question is about specific documents or data that would need to be uploaded, politely explain that you'd need access to those documents to provide a detailed answer.

Keep your response informative, professional, and relevant to real estate and investment topics.

Answer:"""