# OCR

Fails with Mac, use Linux, maybe Windows is okay (untested)

# Installation
```
pip install -r requirements.txt
```

# Run locally
```
uvicorn app:app --reload --host 0.0.0.0 --port 8888
```

# Run on docker
```
docker build --platform linux/amd64 -t ocr-app .
docker run --platform linux/amd64 -p 8888:8888 ocr-app
```

# Notes
- This service is now based on PyMuPDF (fitz) for PDF and image extraction.
- PaddleOCR and related dependencies are no longer required.
- See [http://localhost:8888/docs](http://localhost:8888/docs) for API documentation and usage.
- Supported file types: PDF, PNG, JPG, JPEG, BMP, TIFF.