# RAG Pipeline API for AriesView

A FastAPI application for processing PDFs and performing semantic, keyword, and hybrid searches using Weaviate vector database.

## Features

- **PDF Processing**: Upload and process PDF documents with semantic chunking
- **Vector Search**: Perform semantic search using embeddings
- **Keyword Search**: BM25-based keyword search
- **Hybrid Search**: Combine semantic and keyword search for better results
- **Chunk Management**: View and analyze document chunks
- **Statistics**: Get detailed statistics about processed documents

## Prerequisites

- Python 3.8+
- Weaviate server running locally (or accessible)
- Docker (optional, for running Weaviate)

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd "RAG pipeline for AriesView"
   ```

2. **Create and activate virtual environment**:
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Start Weaviate server** (if not already running):
   ```bash
   docker-compose up -d
   ```

## Environment Configuration

The application supports environment variables for easy configuration across different deployments.

### Setting up Environment Variables

1. **Copy the example file**:
   ```bash
   cp env.example .env
   ```

2. **Edit the .env file** with your configuration:
   ```bash
   # Ollama Configuration
   OLLAMA_MODEL=mistral:7b
   OLLAMA_URL=http://ollama.ariesview.com:11434
   ```

### Available Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OLLAMA_MODEL` | `mistral:7b` | The Ollama model to use for LLM generation |
| `OLLAMA_URL` | `http://ollama.ariesview.com:11434` | The Ollama server URL |
| `WEAVIATE_HOST` | `weaviate.ariesview.com` | Weaviate server hostname |
| `WEAVIATE_HTTP_PORT` | `8084` | Weaviate HTTP port |
| `WEAVIATE_GRPC_PORT` | `50051` | Weaviate gRPC port |
| `WEAVIATE_HTTP_SECURE` | `false` | Enable HTTPS for Weaviate (true/false) |
| `WEAVIATE_GRPC_SECURE` | `false` | Enable secure gRPC for Weaviate (true/false) |

### Common Model Options

- `mistral:7b` - Good balance of performance and speed
- `llama3:latest` - Latest Llama 3 model (requires installation)
- `gemma2:9b` - Google's Gemma 2 model  
- `codellama:7b` - Specialized for code understanding

### Using Environment Variables

You can set environment variables in several ways:

1. **Using .env file** (recommended for development):
   ```bash
   # Create .env file
   echo "OLLAMA_MODEL=llama3:latest" > .env
   ```

2. **Export in shell** (for temporary changes):
   ```bash
   export OLLAMA_MODEL=llama3:latest
   export OLLAMA_URL=http://localhost:11434
   python main.py
   ```

3. **Docker environment** (for containerized deployments):
   ```yaml
   environment:
     - OLLAMA_MODEL=mistral:7b
     - OLLAMA_URL=http://ollama:11434
     - WEAVIATE_HOST=weaviate
     - WEAVIATE_HTTP_PORT=8080
     - WEAVIATE_GRPC_PORT=50051
   ```

## Running the Application

1. **Start the FastAPI server**:
   ```bash
   python main.py
   ```

2. **Access the API**:
   - API Documentation: http://localhost:8000/docs
   - Alternative docs: http://localhost:8000/redoc
   - Health check: http://localhost:8000/health

## API Endpoints

### Core Endpoints

- `GET /` - API information and available endpoints
- `GET /health` - Health check and Weaviate connection status
- `GET /collections` - List all Weaviate collections

### PDF Processing

- `POST /process-pdfs` - Process existing PDF files
- `POST /upload-pdf` - Upload and process a single PDF file

### Data Management

- `GET /chunks` - View stored document chunks
- `GET /stats` - Get statistics about processed documents

### Search Operations

- `POST /search/semantic` - Perform semantic search
- `POST /search/keyword` - Perform keyword-based search
- `POST /search/hybrid` - Perform hybrid search (semantic + keyword)

## Usage Examples

### 1. Health Check
```bash
curl http://localhost:8000/health
```

### 2. Process Existing PDFs
```bash
curl -X POST "http://localhost:8000/process-pdfs" \
     -H "Content-Type: application/json" \
     -d '{
       "pdf_files": ["Lease.pdf"],
       "class_name": "LeaseDocument",
       "min_chunk_length": 200
     }'
```

### 3. Upload and Process PDF
```bash
curl -X POST "http://localhost:8000/upload-pdf" \
     -F "file=@Lease.pdf" \
     -F "class_name=LeaseDocument" \
     -F "min_chunk_length=200"
```

### 4. View Chunks
```bash
curl "http://localhost:8000/chunks?limit=10&class_name=LeaseDocument"
```

### 5. Get Statistics
```bash
curl "http://localhost:8000/stats?class_name=LeaseDocument"
```

### 6. Semantic Search
```bash
curl -X POST "http://localhost:8000/search/semantic" \
     -H "Content-Type: application/json" \
     -d '{
       "query": "rental payment terms",
       "limit": 5,
       "class_name": "LeaseDocument"
     }'
```

### 7. Keyword Search
```bash
curl -X POST "http://localhost:8000/search/keyword" \
     -H "Content-Type: application/json" \
     -d '{
       "keywords": ["rent", "payment", "lease"],
       "limit": 10,
       "class_name": "LeaseDocument"
     }'
```

### 8. Hybrid Search
```bash
curl -X POST "http://localhost:8000/search/hybrid" \
     -H "Content-Type: application/json" \
     -d '{
       "query": "rental payment terms",
       "limit": 10,
       "alpha": 0.5,
       "class_name": "LeaseDocument"
     }'
```
### 9. Run Testing Script
```python testing.py```

## Configuration

### Weaviate Connection
The application connects to Weaviate using environment variables with these default settings:
- Host: `weaviate.ariesview.com` (configurable via `WEAVIATE_HOST`)
- HTTP Port: `8084` (configurable via `WEAVIATE_HTTP_PORT`)
- gRPC Port: `50051` (configurable via `WEAVIATE_GRPC_PORT`)
- Security: Disabled by default (configurable via `WEAVIATE_HTTP_SECURE` and `WEAVIATE_GRPC_SECURE`)

You can override these settings using environment variables or a `.env` file.

### Search Parameters
- **Semantic Search**: Uses sentence-transformers/all-MiniLM-L6-v2 model
- **Keyword Search**: Uses BM25 algorithm with AND operator
- **Hybrid Search**: Combines both with configurable alpha parameter (0.0 = keyword only, 1.0 = semantic only)

## API Documentation

Once the server is running, visit http://localhost:8000/docs for interactive API documentation powered by Swagger UI.

## Error Handling

The API includes comprehensive error handling:
- HTTP 400: Bad request (invalid parameters)
- HTTP 404: File not found
- HTTP 500: Internal server error (Weaviate connection issues, processing errors)

## Development

### Project Structure
```
├── main.py              # FastAPI application
├── requirements.txt     # Python dependencies
├── docker-compose.yml   # Weaviate server configuration
├── src/
│   ├── chunking.py      # PDF processing and chunking
│   ├── viewchunks.py    # Chunk viewing and statistics
│   ├── semanticsearch.py # Semantic search implementation
│   ├── keywordsearch.py # Keyword search implementation
│   └── hybridsearch.py  # Hybrid search implementation
└── venv/                # Virtual environment
```

### Adding New Endpoints

1. Define Pydantic models for request/response
2. Create endpoint function with appropriate decorator
3. Add error handling and validation
4. Update the root endpoint documentation

## Troubleshooting

### Common Issues

1. **Weaviate Connection Failed**
   - Ensure Weaviate server is running: `docker-compose ps`
   - Check ports 9090 and 50051 are available
   - Verify network connectivity

2. **PDF Processing Errors**
   - Ensure PDF files are valid and not corrupted
   - Check file permissions
   - Verify sufficient disk space

3. **Search Returns No Results**
   - Ensure documents have been processed first
   - Check collection name matches
   - Verify search query is appropriate

### Logs
The application provides detailed logging for debugging. Check the console output for error messages and processing status.

## License

[Add your license information here] 