import requests
import csv
import os

def test_rag_query():
    lease_pdf_path = "Lease.txt"

    url = "http://localhost:8001/rag/query"


    
    prompts = [ # List of prompts to test
        {
            "query": "What is the tenant's responsibility for repairs?",
        },
        {
            "query": "What are the landlord's obligations for maintenance?",
        },
        {
            "query": "How is the rent calculated for this lease?",
        },
        {
            "query": "What are the termination conditions of the lease?",
        },
        {
            "query": "Are there any restrictions on subletting the property?",
        },
        {
            "query": "Under what conditions is the tenant allowed to have pets on the property?",
        },
        {
            "query": "What is the procedure if the tenant does not return the property in the same condition as received?",
        },
        {
            "query": "What if I pay the rent late?",
        },
        {
            "query": "What happens if I damage the property?",
        },
        {
            "query": "Can the landlord increase the rent during the lease term?",
        },

    ]

    base = { # Base payload for call to /rag/query API
        "search_type": "hybrid",
        "limit": 5,
        "class_name": "LeaseDocument",
        "alpha": 0.5,
        "ollama_model": "mistral:7b",
        "ollama_url": "http://ollama.ariesview.com:11434",
        "include_context": True,
        "max_context_length": 2000,
        "prompt_type": "executive"
    }

    filename = "rag_response.csv"
    
    if os.path.exists(filename):
        os.remove(filename)


    with open(filename, "a", newline='', encoding="utf-8") as f:

        writer = csv.writer(f)
        
        writer.writerow(["Query", "Response Text", "Chunks Used", "Context"]) 

        for prompt in prompts:
            payload = base.copy()
            payload["query"] = prompt["query"] 

            try:
                response = requests.post(url, json=payload)
                response.raise_for_status() 
                data = response.json()

                context_chunks = data["context_chunks"]
                parsed_context = "\n".join([f"CHUNK #{i + 1}: " + "\n".join(chunk.split("\\n")) for i, chunk in enumerate(context_chunks)])
                data["context_chunks"] = parsed_context


                writer.writerow([prompt["query"], data["llm_response"], data["chunks_used"], data["context_chunks"]])
                print(f"Successfully processed query: {prompt['query']}")
                print(data["llm_response"])

            except Exception as e:
                print(f"Error processing query '{prompt['query']}': {e}")
                writer.writerow([prompt["query"], f"Error: {str(e)}", ""])

if __name__ == "__main__":
    test_rag_query()