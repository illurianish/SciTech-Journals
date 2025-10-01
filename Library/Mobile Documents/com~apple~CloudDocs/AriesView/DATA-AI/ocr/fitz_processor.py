import fitz  # PyMuPDF
from pathlib import Path
from typing import Dict, List, Any, Optional
import json
from PIL import Image
import io
from config import (
    EXTRACT_IMAGES, EXTRACT_TABLES, EXTRACT_LINKS, EXTRACT_ANNOTATIONS,
    INCLUDE_METADATA, INCLUDE_PAGE_INFO, USE_OCR, OCR_LANGUAGE
)


class FitzDocumentProcessor:
    """Handles document processing using PyMuPDF (fitz)."""
    
    def __init__(self):
        self.supported_formats = {'.pdf', '.epub', '.xps', '.oxps', '.cbz', '.fb2'}
    
    def process_document(self, file_path: Path, original_filename: str) -> Dict[str, Any]:
        """
        Process a document and extract text, images, tables, and metadata.
        
        Args:
            file_path: Path to the document file
            
        Returns:
            Dictionary containing extracted information
        """
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        
        file_extension = file_path.suffix.lower()
        
        if file_extension == '.pdf':
            return self._process_pdf(file_path, original_filename)
        elif file_extension in {'.png', '.jpg', '.jpeg', '.bmp', '.tiff'}:
            return self._process_image(file_path, original_filename)
        else:
            raise ValueError(f"Unsupported file format: {file_extension}")
    
    def _process_pdf(self, pdf_path: Path, original_filename: str) -> Dict[str, Any]:
        """Process PDF documents using PyMuPDF."""
        doc = fitz.open(str(pdf_path))
        
        result = {
            "input_path": original_filename,
            "num_pages": len(doc),
            "pages_results": [],
            "metadata": {}
        }
        
        # Extract metadata if enabled
        if INCLUDE_METADATA:
            result["metadata"] = self._extract_metadata(doc)
        
        # Process each page
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            page_result = self._process_page(page, page_num + 1)
            result["pages_results"].append(page_result)
        
        doc.close()
        
        if self.is_pdf_empty(result):
            result["fitz_message"] = "Fitz (PyMuPDF) could not extract any text or structured content from this PDF. Only images were found, so this is likely a scanned or image-based PDF."
            result["fitz_empty"] = True
        
        return result
    
    def _process_page(self, page: fitz.Page, page_num: int) -> Dict[str, Any]:
        """Process a single page of a document."""
        page_result = {
            "page": page_num,
            "results": []
        }
        
        # Extract text blocks
        text_blocks = self._extract_text_blocks(page)
        page_result["results"].extend(text_blocks)
        
        # Extract tables if enabled
        if EXTRACT_TABLES:
            tables = self._extract_tables(page)
            page_result["results"].extend(tables)
        
        # Extract images if enabled
        if EXTRACT_IMAGES:
            images = self._extract_images(page, page_num)
            page_result["results"].extend(images)
        
        # Extract links if enabled
        if EXTRACT_LINKS:
            links = self._extract_links(page)
            page_result["results"].extend(links)
        
        # Extract annotations if enabled
        if EXTRACT_ANNOTATIONS:
            annotations = self._extract_annotations(page)
            page_result["results"].extend(annotations)
        
        return page_result
    
    def _extract_text_blocks(self, page: fitz.Page) -> List[Dict[str, Any]]:
        """Extract text blocks from a page."""
        text_blocks = []
        
        # Get text blocks with their bounding boxes
        blocks = page.get_text("dict")
        
        for block in blocks.get("blocks", []):
            if block.get("type") == 0:  # Text block
                for line in block.get("lines", []):
                    for span in line.get("spans", []):
                        text_block = {
                            "type": "text",
                            "bbox": span.get("bbox", []),
                            "text": span.get("text", ""),
                            "font": span.get("font", ""),
                            "size": span.get("size", 0),
                            "flags": span.get("flags", 0)
                        }
                        text_blocks.append(text_block)
        
        return text_blocks
    
    def _extract_tables(self, page: fitz.Page) -> List[Dict[str, Any]]:
        """Extract tables from a page."""
        tables = []
        
        # Get tables using PyMuPDF's table extraction
        table_dict = page.find_tables()
        
        for i, table in enumerate(table_dict.tables):
            table_data = {
                "type": "table",
                "bbox": list(table.bbox) if table.bbox is not None else None,
                "rows": table.extract(),
                "table_index": i
            }
            tables.append(table_data)
        
        return tables
    
    def _extract_images(self, page: fitz.Page, page_num: int) -> List[Dict[str, Any]]:
        """Extract images from a page."""
        images = []
        
        # Get image list with full info
        image_list = page.get_images(full=True)
        
        for img_index, img in enumerate(image_list):
            xref = img[0]
            bbox = page.get_image_bbox(img)  # This now works with full=True
            
            image_data = {
                "type": "image",
                "bbox": list(bbox) if bbox is not None else None,
                "image_index": img_index,
                "xref": xref,
                "width": img[2],
                "height": img[3]
            }
            images.append(image_data)
        
        return images
    
    def _extract_links(self, page: fitz.Page) -> List[Dict[str, Any]]:
        """Extract links from a page."""
        links = []
        
        # Get links
        link_list = page.get_links()
        
        for link in link_list:
            link_data = {
                "type": "link",
                "bbox": list(link.get("from", [])) if link.get("from") is not None else None,
                "uri": link.get("uri", ""),
                "page": link.get("page", -1)
            }
            links.append(link_data)
        
        return links
    
    def _extract_annotations(self, page: fitz.Page) -> List[Dict[str, Any]]:
        """Extract annotations from a page."""
        annotations = []
        
        # Get annotations
        annot_list = page.annots()
        
        for annot in annot_list:
            annot_data = {
                "type": "annotation",
                "bbox": list(annot.rect) if annot.rect is not None else None,
                "content": annot.info.get("content", ""),
                "subject": annot.info.get("subject", ""),
                "title": annot.info.get("title", "")
            }
            annotations.append(annot_data)
        
        return annotations
    
    def _extract_metadata(self, doc: fitz.Document) -> Dict[str, Any]:
        """Extract document metadata."""
        metadata = doc.metadata
        return {
            "title": metadata.get("title", ""),
            "author": metadata.get("author", ""),
            "subject": metadata.get("subject", ""),
            "creator": metadata.get("creator", ""),
            "producer": metadata.get("producer", ""),
            "creation_date": metadata.get("creationDate", ""),
            "modification_date": metadata.get("modDate", ""),
            "format": metadata.get("format", ""),
            "encryption": metadata.get("encryption", "")
        }
    
    def _process_image(self, image_path: Path, original_filename: str) -> Dict[str, Any]:
        """Process image files (basic text extraction from images)."""
        # For images, we'll return basic information
        # Note: For actual OCR on images, you might want to integrate with Tesseract or other OCR engines
        
        result = {
            "input_path": original_filename,
            "num_pages": 1,
            "pages_results": [{
                "page": 1,
                "results": [{
                    "type": "image_info",
                    "file_path": str(image_path),
                    "note": "Image processing requires additional OCR integration for text extraction"
                }]
            }]
        }
        
        return result
    
    def is_pdf_empty(self, pdf_result: Dict[str, Any]) -> bool:
        """
        Returns True if all pages in the PDF have no extractable content except images (i.e., only images are present).
        """
        for page in pdf_result.get("pages_results", []):
            results = page.get("results", [])
            if not results:
                continue  # This page is empty, so keep checking
            # If any result is not an image, then fitz found something else
            for r in results:
                if r.get("type") != "image":
                    return False
        # If we get here, all results are either empty or only images
        return True


# Global processor instance
processor = FitzDocumentProcessor() 