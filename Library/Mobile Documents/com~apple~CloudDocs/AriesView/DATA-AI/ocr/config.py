# PyMuPDF Configuration Settings

# PDF processing settings
DPI = 150
DEVICE = 'gpu'  # PaddleOCR expects 'gpu' not 'cuda'

# Text extraction settings
EXTRACT_IMAGES = True
EXTRACT_TABLES = True
EXTRACT_LINKS = True
EXTRACT_ANNOTATIONS = True

# OCR settings (if using OCR capabilities)
USE_OCR = False  # Set to True if you want to use OCR features
OCR_LANGUAGE = 'eng'  # Language for OCR

# Output format settings
INCLUDE_METADATA = True
INCLUDE_PAGE_INFO = True

USE_DOC_ORIENTATION_CLASSIFY = False
USE_DOC_UNWARPING = False
LAYOUT_DETECTION_MODEL_NAME = 'PP-DocLayout-S'
TEXT_DETECTION_MODEL_NAME = 'PP-OCRv3_mobile_det'
TEXT_RECOGNITION_MODEL_NAME = 'en_PP-OCRv3_mobile_rec'
