from pathlib import Path
from fitz_processor import processor
import json

def test_pdf_processing():
    """Test PDF processing with PyMuPDF."""
    
    # Test with a sample PDF file
    pdf_path = Path("data/Aroma Joe's SECOND_-_LEASE_AMENDMENT_TO_1.pdf")
    
    if not pdf_path.exists():
        print(f"Test file not found: {pdf_path}")
        print("Please ensure you have a test PDF file in the data/ directory.")
        return
    
    print(f"Processing PDF: {pdf_path}")
    print("=" * 50)
    
    try:
        # Process the document
        result = processor.process_document(pdf_path)
        
        # Print summary
        print(f"Document: {result['input_path']}")
        print(f"Pages: {result['num_pages']}")
        
        if 'metadata' in result:
            print("\nMetadata:")
            for key, value in result['metadata'].items():
                if value:  # Only print non-empty values
                    print(f"  {key}: {value}")
        
        # Print page results summary
        print(f"\nPage Results Summary:")
        for page_result in result['pages_results']:
            page_num = page_result['page']
            results = page_result['results']
            
            # Count different types of content
            text_count = len([r for r in results if r['type'] == 'text'])
            table_count = len([r for r in results if r['type'] == 'table'])
            image_count = len([r for r in results if r['type'] == 'image'])
            link_count = len([r for r in results if r['type'] == 'link'])
            annotation_count = len([r for r in results if r['type'] == 'annotation'])
            
            print(f"  Page {page_num}: {text_count} text blocks, {table_count} tables, "
                  f"{image_count} images, {link_count} links, {annotation_count} annotations")
        
        # Save detailed results to JSON file
        output_file = Path("output/fitz_results.json")
        output_file.parent.mkdir(exist_ok=True)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        
        print(f"\nDetailed results saved to: {output_file}")
        
        # Show sample text content from first page
        if result['pages_results']:
            first_page = result['pages_results'][0]
            text_blocks = [r for r in first_page['results'] if r['type'] == 'text']
            
            if text_blocks:
                print(f"\nSample text from page 1 (first 3 blocks):")
                for i, block in enumerate(text_blocks[:3]):
                    print(f"  Block {i+1}: {block['text'][:100]}...")
        
    except Exception as e:
        print(f"Error processing document: {e}")
        import traceback
        traceback.print_exc()

def test_image_processing():
    """Test image processing with PyMuPDF."""
    
    # Test with a sample image file (if available)
    image_extensions = ['.png', '.jpg', '.jpeg', '.bmp', '.tiff']
    
    for ext in image_extensions:
        image_path = Path(f"data/test_image{ext}")
        if image_path.exists():
            print(f"\nProcessing image: {image_path}")
            print("=" * 50)
            
            try:
                result = processor.process_document(image_path)
                print(f"Image: {result['input_path']}")
                print(f"Results: {result['pages_results'][0]['results']}")
                break
            except Exception as e:
                print(f"Error processing image: {e}")
    
    else:
        print("No test image files found in data/ directory.")

if __name__ == "__main__":
    print("PyMuPDF Document Processing Test")
    print("=" * 50)
    
    # Test PDF processing
    test_pdf_processing()
    
    # Test image processing
    test_image_processing()
    
    print("\nTest completed!") 