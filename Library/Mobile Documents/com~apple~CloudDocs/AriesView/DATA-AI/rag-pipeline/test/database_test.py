import requests
import csv
import os
import traceback

def test_rag_query():

    url = "http://localhost:8001/rag/database"
    try:
        response = requests.post(url, json={})
        response.raise_for_status() 

    except Exception as e:
        print("ERROR in database_test.py:")
        traceback.print_exc()
        print(f"Error processing query: {e}")

if __name__ == "__main__":
    test_rag_query()