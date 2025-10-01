"""
Preload PyMuPDF and test basic functionality
This script ensures PyMuPDF is working correctly.
"""

import fitz
from pathlib import Path
import sys

def test_fitz_installation():
    """Test if PyMuPDF is properly installed and working."""
    print("Testing PyMuPDF installation...")
    
    try:
        # Test basic fitz functionality
        print(f"PyMuPDF version: {fitz.__doc__}")
        print(f"PyMuPDF version: {fitz.__version__}")  # If available
        
        # Test creating a simple PDF
        doc = fitz.open()
        page = doc.new_page()
        page.insert_text((50, 50), "Hello PyMuPDF!")
        doc.save("test_output.pdf")
        doc.close()
        
        # Clean up test file
        Path("test_output.pdf").unlink()
        
        print("✓ PyMuPDF is working correctly!")
        return True
        
    except Exception as e:
        print(f"✗ Error testing PyMuPDF: {e}")
        return False

def check_supported_formats():
    """Check what file formats PyMuPDF supports."""
    print("\nSupported file formats:")
    formats = [
        ".pdf", ".epub", ".xps", ".oxps", ".cbz", ".fb2",
        ".png", ".jpg", ".jpeg", ".bmp", ".tiff"
    ]
    
    for fmt in formats:
        print(f"  - {fmt}")
    
    print("\nNote: PyMuPDF primarily excels at PDF processing.")
    print("For image OCR, consider integrating with Tesseract or other OCR engines.")

if __name__ == "__main__":
    print("PyMuPDF Preload Test")
    print("=" * 40)
    
    success = test_fitz_installation()
    
    if success:
        check_supported_formats()
        print("\n✓ PyMuPDF is ready to use!")
    else:
        print("\n✗ PyMuPDF installation has issues.")
        print("Please check your installation and try again.")
        sys.exit(1) 