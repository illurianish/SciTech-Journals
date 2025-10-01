import React, { useState, useEffect, useRef } from 'react';
import { useUnits } from '@/app/rest/unit';
import { useAllUnits } from '@/app/rest/unitNumbers';
import DocumentEditor from './DocumentEditor';
import AIDocumentExtractor from './AIDocumentExtractor';
import {
  AlertTriangle,
  CheckCircle,
  FileText,
  Upload,
  Clock,
  ArrowRight,
  Search,
  X,
  Eye,
  Trash2
} from 'lucide-react';
import { getAuth, onAuthStateChanged, getIdToken } from "firebase/auth";
import { app } from "@/app/firebase/config";
import toast from 'react-hot-toast';

// Firebase token helper function
async function getFirebaseAuthToken(): Promise<string | null> {
  const auth = getAuth(app);
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (user) {
        try {
          const token = await getIdToken(user, true);
          resolve(token);
        } catch (error) {
          console.error("Error getting Firebase token:", error);
          reject(new Error("Could not get Firebase ID token."));
        }
      } else {
        console.warn("No Firebase user currently signed in for token retrieval.");
        resolve(null);
      }
    }, (error) => {
        console.error("Auth state error:", error);
        reject(error);
    });
  });
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' bytes';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Import AI document types and data

interface DocumentHubProps {
  propertyId: string;
  propertyName: string;
}

interface Document {
  id: string;
  title: string;
  dateCreated: string;
  documentType: string;
  documentCategory?: string;
  size: string;
  createdBy: string;
  url: string | null;
  mimeType: string;
  fundId?: string;
  propertyId?: string;
  unitId?: string;
}

interface Fund {
  id: string;
  name: string;
  properties: Property[];
}

interface Property {
  id: string;
  name: string;
  address: string;
}

interface ExtractedData {
  title: string;
  type: string;
  date: string;
  keyPoints: string[];
  entities: {
    name: string;
    type: string;
    value: string;
  }[];
}

// Mock data for funds and properties
const fundsData: Fund[] = [
  {
    id: 'fund1',
    name: 'Babson Real Estate Fund I',
    properties: [
      { id: 'prop1', name: 'River Street Plaza', address: '522 River St, Boston, MA 02126' },
      { id: 'prop2', name: 'Hooksett Retail Center', address: '555 Hooksett Road, Manchester, NH 03106' }
    ]
  },
  {
    id: 'fund2',
    name: 'Evolston Capital Fund II',
    properties: [
      { id: 'prop3', name: 'Main Street Complex', address: '123 Main St, Hartford, CT 06103' },
      { id: 'prop4', name: 'Oakwood Plaza', address: '789 Oak Ave, Providence, RI 02903' }
    ]
  }
];

const RealEstateDocumentAnalyzer = ({ onSaveToDocumentHub }: { onSaveToDocumentHub?: (doc: any) => void }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [documentType, setDocumentType] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Sample document clauses for analysis results
  const documentClauses = [
    { id: 1, section: "Purchase Price", content: "$850,000 with $25,000 earnest money deposit", status: "standard" },
    { id: 2, section: "Financing Contingency", content: "Buyer has 30 days to secure financing", status: "standard" },
    { id: 3, section: "Inspection Period", content: "14 days from effective date", status: "risk", 
      explanation: "Industry standard is 21-30 days. This shortened period limits buyer's ability to conduct thorough inspections." },
    { id: 4, section: "Title Review", content: "Seller to provide title commitment within 7 days", status: "standard" },
    { id: 5, section: "Property Condition", content: "Seller not required to make any repairs noted in inspection", status: "risk", 
      explanation: "Most agreements include provisions for material defects to be addressed by seller. This shifts all repair burden to buyer." },
    { id: 6, section: "Arbitration Clause", content: "All disputes subject to binding arbitration", status: "risk", 
      explanation: "Mandatory arbitration limits legal options in case of disputes. Consider requesting modification to make arbitration optional." },
    { id: 7, section: "Seller Disclosure", content: "Waiver of additional seller disclosures beyond statutory minimum", status: "risk", 
      explanation: "Limits seller's disclosure obligations, increasing risk of undisclosed property issues." },
    { id: 8, section: "Closing Date", content: "45 days from effective date", status: "standard" },
    { id: 9, section: "Due Diligence Period", content: "10 business days from effective date", status: "risk",
      explanation: "Short due diligence period may not provide sufficient time to complete all necessary investigations." },
    { id: 10, section: "Escrow Agent", content: "Title company selected solely by seller", status: "risk",
      explanation: "Standard practice is for escrow agent to be mutually agreed upon by both parties." },
    { id: 11, section: "Extension Clause", content: "No extension allowed under any circumstances", status: "risk",
      explanation: "Most agreements allow for reasonable extensions for unforeseen delays. Recommend negotiating this term." },
    { id: 12, section: "Possession Date", content: "3 days after closing", status: "standard" },
    { id: 13, section: "Prorations", content: "Property taxes, HOA dues, and utilities prorated at closing", status: "standard" },
    { id: 14, section: "Default Provisions", content: "If buyer defaults, seller keeps deposit as sole remedy", status: "standard" },
    { id: 15, section: "Property Access", content: "Buyer granted access only with 72 hours notice", status: "risk",
      explanation: "Standard is 24-48 hours notice. This restricts buyer's ability to coordinate inspections in a timely manner." },
    { id: 16, section: "Representations & Warranties", content: "Seller makes no representations about property condition", status: "risk",
      explanation: "Seller should at minimum represent their knowledge of the property's condition. This clause increases buyer risk." },
    { id: 17, section: "Personal Property", content: "All fixtures and appliances included in sale", status: "standard" },
    { id: 18, section: "Deed Type", content: "Special Warranty Deed rather than General Warranty Deed", status: "risk",
      explanation: "Special Warranty Deed offers less protection to buyer as seller only warrants against claims arising during their ownership." },
    { id: 19, section: "Title Insurance", content: "Buyer responsible for all title insurance costs", status: "risk",
      explanation: "In this market, seller typically pays for owner's title policy. Recommend negotiating this term." },
    { id: 20, section: "Survey", content: "Existing survey provided, no new survey required", status: "standard" },
    { id: 21, section: "Appraisal Contingency", content: "No appraisal contingency included", status: "risk",
      explanation: "Without an appraisal contingency, buyer may be obligated to proceed even if property appraises below purchase price." },
    { id: 22, section: "Termite Inspection", content: "Seller to provide wood destroying insect report", status: "standard" },
    { id: 23, section: "Homeowners Association", content: "HOA documents delivered within 5 days of effective date", status: "standard" },
    { id: 24, section: "Assignment", content: "Buyer may not assign contract without seller approval", status: "standard" },
    { id: 25, section: "Attorney Review", content: "No attorney review period provided", status: "risk",
      explanation: "Standard practice includes 3-5 day attorney review period. This limits buyer's ability to seek legal counsel." },
    { id: 26, section: "Lead Paint Disclosure", content: "Property built after 1978, no disclosure required", status: "standard" },
    { id: 27, section: "Recording Fees", content: "Buyer pays all recording fees", status: "standard" },
    { id: 28, section: "Specific Performance", content: "Buyer waives right to specific performance remedy", status: "risk",
      explanation: "Standard contracts allow buyer to seek specific performance. This waiver removes an important legal remedy." },
    { id: 29, section: "Zoning Compliance", content: "No guarantee of zoning compliance or future use", status: "risk",
      explanation: "Seller should warrant current zoning compliance. This shifts additional risk to buyer." },
    { id: 30, section: "Counterparts", content: "Contract may be executed in counterparts", status: "standard" }
  ];

  // Handle file upload simulation
  const handleFileUpload = () => {
    setUploadedFile({ name: "Property_Purchase_Agreement_123_Main_St.pdf", size: "2.4 MB" });
    setIsAnalyzing(true);
    
    // Simulate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 10;
      setLoadingProgress(progress);
      
      if (progress >= 100) {
        clearInterval(progressInterval);
        setIsAnalyzing(false);
        setAnalysisComplete(true);
        setDocumentType('Purchase Agreement');
        setActiveTab('analysis');
      }
    }, 300);
  };
  
  // Reset analysis
  const resetAnalysis = () => {
    setUploadedFile(null);
    setIsAnalyzing(false);
    setAnalysisComplete(false);
    setDocumentType('');
    setActiveTab('upload');
    setLoadingProgress(0);
  };
  
  // Navigation tabs component
  const NavigationTabs = () => (
    <div className="flex border-b border-gray-200 mb-6">
      <button 
        className={`px-4 py-2 font-medium ${activeTab === 'upload' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        onClick={() => setActiveTab('upload')}
      >
        Upload Document
      </button>
      <button 
        className={`px-4 py-2 font-medium ${activeTab === 'analysis' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'} ${!analysisComplete && 'opacity-50 cursor-not-allowed'}`}
        onClick={() => analysisComplete && setActiveTab('analysis')}
        disabled={!analysisComplete}
      >
        Analysis Results
      </button>
      <button 
        className={`px-4 py-2 font-medium ${activeTab === 'summary' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'} ${!analysisComplete && 'opacity-50 cursor-not-allowed'}`}
        onClick={() => analysisComplete && setActiveTab('summary')}
        disabled={!analysisComplete}
      >
        Summary Report
      </button>
    </div>
  );

  // Upload screen
  const UploadScreen = () => (
    <div className="flex flex-col items-center p-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
      {!uploadedFile ? (
        <>
          <Upload className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Drag and drop your lease document</h2>
          <p className="text-gray-500 mb-4">Supported formats: PDF, DOCX, DOC, TXT</p>
          
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={handleFileUpload}
          >
            Browse Files
          </button>
          
          <div className="mt-8 flex justify-center w-full max-w-xs">
            <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
              <FileText className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-medium">Leases</h3>
              <p className="text-sm text-gray-500">Commercial & Residential</p>
            </div>
          </div>
        </>
      ) : (
        <>
          {isAnalyzing ? (
            <div className="flex flex-col items-center">
              <Clock className="w-16 h-16 text-blue-600 mb-4 animate-pulse" />
              <h2 className="text-xl font-semibold mb-2">Analyzing your document...</h2>
              <p className="text-gray-500 mb-4">This may take a few moments</p>
              
              <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5 mb-2">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${loadingProgress}%` }}></div>
              </div>
              <p className="text-sm text-gray-500">{loadingProgress < 50 ? 'Extracting document structure...' : 'Analyzing clauses and terms...'}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Document analyzed successfully!</h2>
              <div className="flex items-center bg-white p-3 rounded border border-gray-200 mb-4">
                <FileText className="text-gray-500 mr-2" />
                <div>
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-500">{uploadedFile.size}</p>
                </div>
              </div>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center"
                onClick={() => setActiveTab('analysis')}
              >
                View Analysis <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );

  // Analysis results screen
  const AnalysisResults = () => {
    const riskCount = documentClauses.filter(c => c.status === 'risk').length;
    
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Document Analysis: {uploadedFile?.name}</h2>
            <p className="text-gray-600">Type: {documentType}</p>
          </div>
          <button 
            className="px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
            onClick={resetAnalysis}
          >
            Analyze New Document
          </button>
        </div>
        
        <div className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex">
            <AlertTriangle className="text-yellow-600 mr-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-yellow-800">Analysis Summary</h3>
              <p className="text-yellow-700">This document contains <strong>{riskCount} high-risk clauses</strong> that deviate from industry standards. Review recommended.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
          <div className="flex bg-gray-50 px-4 py-2 border-b border-gray-200 font-medium">
            <div className="w-1/4">Section</div>
            <div className="w-2/5">Content</div>
            <div className="w-1/4">Status</div>
            <div className="w-1/12">Page</div>
            <div className="w-1/12">Action</div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {documentClauses.map(clause => (
              <div key={clause.id} className={`flex px-4 py-3 ${clause.status === 'risk' ? 'bg-red-50' : ''}`}>
                <div className="w-1/4 font-medium">{clause.section}</div>
                <div className="w-2/5 text-sm">{clause.content}</div>
                <div className="w-1/4">
                  {clause.status === 'standard' ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" /> Standard
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <AlertTriangle className="w-3 h-3 mr-1" /> Non-Standard
                    </span>
                  )}
                  
                  {clause.status === 'risk' && (
                    <p className="mt-1 text-xs text-red-700">{clause.explanation}</p>
                  )}
                </div>
                <div className="w-1/12 text-sm">{Math.floor(Math.random() * 20) + 1}</div>
                <div className="w-1/12">
                  <button 
                    className="text-blue-600 hover:text-blue-800 text-sm"
                    onClick={() => alert(`Viewing section: ${clause.section}`)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end">
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center"
            onClick={() => setActiveTab('summary')}
          >
            Generate Summary Report <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };
  
  // Summary report screen
  const SummaryReport = () => (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Summary Report: {uploadedFile?.name}</h2>
          <p className="text-gray-600">Document Type: {documentType}</p>
        </div>
        <div className="space-x-3">
          <button 
            className="px-3 py-2 border border-blue-600 text-blue-600 bg-white rounded hover:bg-blue-50 transition-colors"
            onClick={() => {
              if (onSaveToDocumentHub && uploadedFile) {
                onSaveToDocumentHub({
                  title: uploadedFile.name,
                  documentType: documentType,
                  size: uploadedFile.size,
                  contents: documentClauses
                });
                toast.success("Document saved to Document Hub successfully!");
              }
            }}
          >
            Save to Document Hub
          </button>
          <button 
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={() => alert('PDF download initiated')}
          >
            Download Report
          </button>
         
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Executive Summary</h3>
        <p className="mb-4">This Property Purchase Agreement for 123 Main St (dated March 15, 2025) establishes a purchase price of $850,000 with a $25,000 earnest money deposit. The buyer has 30 days to secure financing and the closing is set for 45 days from the effective date.</p>
        
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
          <h4 className="font-medium text-yellow-800 mb-2">Key Risk Factors</h4>
          <ul className="list-disc pl-5 text-yellow-700 space-y-1">
            <li>Short inspection period of 14 days may limit buyer's ability to conduct thorough inspections</li>
            <li>Seller not required to make any repairs noted in inspection</li>
            <li>Mandatory arbitration clause limits legal options in case of disputes</li>
            <li>Limited seller disclosure obligations beyond statutory minimum</li>
          </ul>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <h4 className="font-medium mb-2">Property Details</h4>
            <div className="space-y-2">
              <div className="flex">
                <span className="w-1/2 text-gray-600">Property Address:</span>
                <span>123 Main St, Anytown, ST 12345</span>
              </div>
              <div className="flex">
                <span className="w-1/2 text-gray-600">Property Type:</span>
                <span>Single Family Residence</span>
              </div>
              <div className="flex">
                <span className="w-1/2 text-gray-600">Purchase Price:</span>
                <span>$850,000</span>
              </div>
              <div className="flex">
                <span className="w-1/2 text-gray-600">Earnest Money:</span>
                <span>$25,000</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Key Dates</h4>
            <div className="space-y-2">
              <div className="flex">
                <span className="w-2/3 text-gray-600">Effective Date:</span>
                <span>March 15, 2025</span>
              </div>
              <div className="flex">
                <span className="w-2/3 text-gray-600">Financing Deadline:</span>
                <span>April 14, 2025</span>
              </div>
              <div className="flex">
                <span className="w-2/3 text-gray-600">Inspection Deadline:</span>
                <span>March 29, 2025</span>
              </div>
              <div className="flex">
                <span className="w-2/3 text-gray-600">Closing Date:</span>
                <span>April 30, 2025</span>
              </div>
            </div>
          </div>
        </div>
        
        <h4 className="font-medium mb-2">Negotiation Recommendations</h4>
        <ol className="list-decimal pl-5 space-y-1 mb-4">
          <li>Request extension of inspection period to 21 days</li>
          <li>Modify property condition clause to require seller to address material defects</li>
          <li>Request modification of arbitration clause to make it optional rather than mandatory</li>
          <li>Request comprehensive seller disclosure beyond statutory minimum</li>
        </ol>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Document Preview</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {[1, 2].map(pageNum => (
            <div key={pageNum} className="p-4 flex flex-col items-center">
              <div className="w-full h-64 bg-gray-100 mb-2 flex items-center justify-center">
                <FileText className="w-16 h-16 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">Page {pageNum}</p>
              <button 
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                onClick={() => alert(`Opening page ${pageNum} in full view`)}
              >
                View Full Page
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Real Estate Document Analyzer</h1>
        <p className="text-gray-600">AI-Powered Analysis & Risk Assessment for Real Estate Documents</p>
      </header>
      
      <NavigationTabs />
      
      {activeTab === 'upload' && <UploadScreen />}
      {activeTab === 'analysis' && <AnalysisResults />}
      {activeTab === 'summary' && <SummaryReport />}
    </div>
  );
};

const DocumentHub: React.FC<DocumentHubProps> = ({ propertyId, propertyName }) => {
  const [documentLevel, setDocumentLevel] = useState('property'); // or 'unit'
  const [showEditor, setShowEditor] = useState(false);
  const [showExtractor, setShowExtractor] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [selectedFund, setSelectedFund] = useState<string>('');
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [viewMode, setViewMode] = useState<'normal'>('normal');
  const [expandedType, setExpandedType] = useState<string>('ownership'); 
  const [selectedDocument, setSelectedDocument] = useState<{id: string, type: string} | null>(null);


  const [showUploadUI, setShowUploadUI] = useState(false);

  const [documentULScope, setDocumentULScope] = useState('');
  const [documentULType, setDocumentULType] = useState('');
  
  // Added for file upload functionality
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [documentType, setDocumentType] = useState('Other');
  const [isDragging, setIsDragging] = useState(false);
  // --- State for Unit Selection in Upload ---
  const [selectedUnitId, setSelectedUnitId] = useState('');
  const { data: allUnits, isLoading: allUnitsLoading, isError: allUnitsError } = useAllUnits(propertyId);
  
  // State for real documents from the backend
  const [documents, setDocuments] = useState<Document[]>([]);
  const [propertyDocuments, setPropertyDocuments] = useState<Document[]>([]);
  const [unitDocuments, setUnitDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- State for Preview Modal ---
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>('');
  const [previewMimeType, setPreviewMimeType] = useState<string>('');

  // --- Document category grouping for left nav ---
  const [documentTypes, setDocumentTypes] = useState([]);
  const propertyLevelTypes = documentTypes.filter((type) => type.level === 'property');
  const unitLevelTypes = documentTypes.filter((type) => type.level === 'unit');

  const propertyDocs = [
    { label: 'Ownership & Transfer', type: 'Doc', count: 3, color: 'bg-blue-100 text-blue-700' },
    { label: 'Legal & Compliance', type: 'Doc', count: 2, color: 'bg-green-100 text-green-700' },
    { label: 'Financial & Insurance', type: 'Doc', count: 4, color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Operations & Entity', type: 'Doc', count: 2, color: 'bg-red-100 text-red-700' },
  ];

  const unitDocs = [
    { label: 'Lease & Occupancy', type: 'Doc', count: 4, color: 'bg-purple-100 text-purple-700' },
    { label: 'Legal Protections', type: 'Doc', count: 3, color: 'bg-pink-100 text-pink-700' },
    { label: 'Operations & Finance', type: 'Doc', count: 2, color: 'bg-indigo-100 text-indigo-700' },
  ];

  const propertyFilters = [
  { value: 'ownership', label: 'Ownership' },
  { value: 'legal', label: 'Legal & Compliance' },
  { value: 'financial', label: 'Financial & Insurance' },
  { value: 'operations', label: 'Operations & Entity' },
  ];

   
 const unitFilters = [
    { value: "lease", label: "Lease & Occupancy" },
    { value: "inspection", label: "Legal Protections" }, // <-- was 'legal'
    { value: "tenant_communication", label: "Operations & Finance" },
  ];

  // ------------------------------

  // Fetch documents effect (no changes needed here, assuming backend returns SAS URLs)
  useEffect(() => {
  if (!propertyId) return;

  const documentTypes = [
  {
    id: 'ownership',
    name: 'Ownership & Transfer',
    level: 'property',
    documents: []
  },
  {
    id: 'legal-compliance',
    name: 'Legal & Compliance',
    level: 'property',
    documents: []
  },
  {
    id: 'financial-insurance',
    name: 'Financial & Insurance',
    level: 'property',
    documents: []
  },
  {
    id: 'operations-entity',
    name: 'Operations & Entity',
    level: 'property',
    documents: []
  },
  {
    id: 'lease-occupancy',
    name: 'Lease & Occupancy',
    level: 'unit',
    documents: []
  },
  {
    id: 'legal-protections',
    name: 'Legal Protections',
    level: 'unit',
    documents: []
  },
  {
    id: 'unit-ops-finance',
    name: 'Operations & Finance',
    level: 'unit',
    documents: []
  }
];

// 🧠 Mapping from dropdown category to internal group id based on level
const categoryToGroupIdMap = {
      Property: {
        insurance: "ownership",
        financial: "financial-insurance",
        tax: "operations-entity",
        legal: "legal-compliance",
      },
      Unit: {
        lease: "lease-occupancy",
        inspection: "legal-protections", // <-- was 'legal-protection'
        tenant_communication: "unit-ops-finance",
      },
    };

// 🛠 Helper to format ISO to YYYY-MM-DD
const formatDate = (isoString) => isoString.split('T')[0];

// 🔄 Main transformation function
function transformDocuments(systemResponse) {
  const result = JSON.parse(JSON.stringify(documentTypes)); // deep copy

  function addToGroup(doc, level) {
    const groupId = categoryToGroupIdMap[level]?.[doc.documentCategory.toLowerCase()];
    if (!groupId) return;

    const targetGroup = result.find(g => g.id === groupId && g.level.toLowerCase() === level.toLowerCase());
    if (!targetGroup) return;

    targetGroup.documents.push({
      id: doc.id,
      title: doc.title,
      abstraction: '', // abstraction not provided
      date: formatDate(doc.dateCreated)
    });
  }

  systemResponse.propertyDocuments.forEach(doc => addToGroup(doc, 'Property'));
  systemResponse.unitDocuments.forEach(doc => addToGroup(doc, 'Unit'));

  return result;
}


  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const token = await getFirebaseAuthToken();
      const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
      if (!API_URL) {
        throw new Error("Backend API URL is not configured.");
      }
      const response = await fetch(`${API_URL}/api/documents/properties/${propertyId}/documents`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch documents: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      
      console.log('Fetched documents:', data);
      const transformed = transformDocuments(data);
      setDocumentTypes(transformed);
      console.log(JSON.stringify(transformed, null, 2));
      // Expecting propertyDocuments and unitDocuments arrays
      setPropertyDocuments(Array.isArray(data.propertyDocuments) ? data.propertyDocuments : []);
      setUnitDocuments(Array.isArray(data.unitDocuments) ? data.unitDocuments : []);
      setDocuments([...(data.propertyDocuments || []), ...(data.unitDocuments || [])]); // For legacy code compatibility
      if (!expandedType && documentTypes.length > 0) {
      setExpandedType(documentTypes[0].id);
    }
    } catch (error) {
      let errorMessage = "Failed to load documents. ";
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage += "Could not connect to the API server. Please ensure the backend server is running.";
      } else if (error instanceof Error) {
        errorMessage += error.message;
      } else {
        errorMessage += "Please try again later.";
      }
      toast.error(errorMessage);
      setError(error instanceof Error ? error.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };
  fetchDocuments();
}, [propertyId, expandedType]); // include expandedType dependency if necessary
  
  // Add a helper function to determine document type from MIME type
  function getDocumentTypeFromMimeType(mimeType: string): string {
    if (!mimeType) return 'Other';
    
    if (mimeType.includes('pdf')) return 'PDF';
    if (mimeType.includes('word') || mimeType.includes('docx') || mimeType.includes('doc')) return 'Contract';
    if (mimeType.includes('sheet') || mimeType.includes('excel') || mimeType.includes('xls')) return 'Financial';
    if (mimeType.includes('image')) return 'Image';
    if (mimeType.includes('text')) return 'Text';
    
    return 'Other';
  }

  // If no real documents are available, show a helpful message instead of sample data
  const hasDocuments = documents.length > 0;
  
  // Get properties for selected fund
  const selectedFundProperties = fundsData.find(fund => fund.id === selectedFund)?.properties || [];

  // Reset property selection when fund changes
  const handleFundChange = (fundId: string) => {
    setSelectedFund(fundId);
    setSelectedProperty('');
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.documentType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || doc.documentType.toLowerCase() === filterType.toLowerCase();
    const matchesFund = !selectedFund || doc.fundId === selectedFund;
    const matchesProperty = !selectedProperty || doc.propertyId === selectedProperty;
    return matchesSearch && matchesFilter && matchesFund && matchesProperty;
  });

  const handleSaveDocument = (content: string, title: string, propertyId: string) => {
    // In a real app, this would save to your backend
    const newDocument: Document = {
      id: `doc${documents.length + 1}`,
      title,
      dateCreated: new Date().toISOString().split('T')[0],
      documentType: 'General',
      size: '0.3 MB',
      createdBy: 'Current User',
      url: null,
      mimeType: 'application/octet-stream',
      fundId: selectedFund || undefined,
      propertyId: selectedProperty || undefined
    };
    
    setDocuments([...documents, newDocument]);
    setShowEditor(false);
    
    // Success notification with fund and property information
    let saveLocation = propertyName;
    if (selectedFund) {
      const fund = fundsData.find(f => f.id === selectedFund);
      if (selectedProperty) {
        const property = fund?.properties.find(p => p.id === selectedProperty);
        saveLocation = `${fund?.name} > ${property?.name}`;
      } else {
        saveLocation = fund?.name || '';
      }
    }
    
    toast.success(`Document "${title}" has been saved to ${saveLocation}`);
  };

  // Handle document deletion
  const handleDeleteDocument = async (documentId: string) => {
    if (!propertyId) return;

  if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
    return;
  }

  try {
    const token = await getFirebaseAuthToken();
    const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
    if (!API_URL) {
      throw new Error("Backend API URL is not configured.");
    }

    const response = await fetch(`${API_URL}/api/documents/${documentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Delete error response:', errorText);
      throw new Error(`Failed to delete document: ${response.status} ${response.statusText}`);
    }

    // Remove from all relevant arrays
    setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== documentId));
    setPropertyDocuments(prevDocs => prevDocs.filter(doc => doc.id !== documentId));
    setUnitDocuments(prevDocs => prevDocs.filter(doc => doc.id !== documentId));

    toast.success("The document has been successfully deleted.");
  } catch (error) {
    console.error('Error deleting document:', error);
    let errorMessage = "Failed to delete document. ";

    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      errorMessage += "Could not connect to the API server. Please ensure the backend server is running.";
    } else if (error instanceof Error) {
      errorMessage += error.message;
    }

    toast.error(errorMessage);
  }
};

  const handleExtractComplete = (data: ExtractedData) => {
    setExtractedData(data);
    setShowExtractor(false);

    // Create a new document from the extracted data
    const newDocument: Document = {
      id: `doc${documents.length + 1}`,
      title: data.title,
      dateCreated: data.date,
      documentType: data.type,
      size: '0.5 MB', // This would be actual file size in a real app
      createdBy: 'AI Extractor',
      url: null,
      mimeType: '',
      fundId: selectedFund || undefined,
      propertyId: selectedProperty || undefined
    };

    setDocuments([...documents, newDocument]);
  };

  const toggleExpand = (typeId: string) => {
  if (expandedType !== typeId) {
    setExpandedType(typeId);
  }
};

  const selectDocument = (id: string, type: string) => {
    setSelectedDocument({ id, type });
  };

  // Generate AI Summary
  const generateAISummary = () => {
    const totalDocuments = documentTypes.reduce((sum, type) => sum + type.documents.length, 0);
    
    const keyInsights = [
      "All leases have renewal options with an average term of 30 months",
      "Property insurance coverage is adequate with no major exclusions",
      "Tax assessments show a 7% increase from previous year",
      "No significant environmental risks identified in recent assessments",
      "Building systems require $85,000 in maintenance within 18 months"
    ];
    
    return (
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-blue-800 mb-2">AI Document Summary</h3>
        <p className="text-sm text-blue-700 mb-3">
          Analysis of {totalDocuments} documents across {documentTypes.length} categories
        </p>
        <div className="space-y-2">
          <h4 className="font-medium text-blue-800">Key Insights:</h4>
          <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
            {keyInsights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  // Add a handler for saving analyzed documents to the document hub
  const handleSaveAnalyzedDocument = (doc: any) => {
    const newDocument: Document = {
      id: `doc${documents.length + 1}`,
      title: doc.title,
      dateCreated: new Date().toISOString().split('T')[0],
      documentType: doc.documentType || 'Legal',
      size: doc.size || '2.4 MB',
      createdBy: 'AI Analyzer',
      url: null,
      mimeType: doc.mimeType || 'application/pdf',
      fundId: selectedFund || undefined,
      propertyId: selectedProperty || propertyId
    };
    
    setDocuments([...documents, newDocument]);
    // Switch back to list view to show the newly added document
    setViewMode('normal');
  };

  // --- Functions for Preview Modal ---
  const handlePreviewClick = (doc: Document) => {
    if (!doc.url) {
      toast.error("Preview URL is not available for this document.");
        return;
    }
    setPreviewUrl(doc.url);
    setPreviewTitle(doc.title);
    setPreviewMimeType(doc.mimeType);
    setIsPreviewModalOpen(true);
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setPreviewUrl(null);
    setPreviewTitle('');
    setPreviewMimeType('');
  };
  // ----------------------------------

  const renderDocumentList = () => {
    if (loading) {
      return (
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading documents...</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="p-6 text-center">
          <div className="text-red-500 mb-2">
            <AlertTriangle className="h-8 w-8 mx-auto" />
          </div>
          <p className="text-red-600">Error loading documents</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
        </div>
      );
    }
    // Select correct document list based on documentLevel
    const docsToShow = documentLevel === 'property' ? propertyDocuments : unitDocuments;
    if (docsToShow.length === 0) {
      return (
        <div className="p-6 text-center">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-600 font-medium">No documents found</p>
          <p className="text-sm text-gray-500 mt-2">
            Upload documents for this property using the form on the left.
          </p>
        </div>
      );
    }
    // Filter by search and type
    const filteredDocs = docsToShow.filter(doc => {
      const matchesSearch = searchQuery === '' ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.documentType?.toLowerCase().includes(searchQuery.toLowerCase()) || '');
      const matchesType = filterType === 'all' ||
        (doc.documentType?.toLowerCase() === filterType.toLowerCase() || doc.documentCategory?.toLowerCase() === filterType.toLowerCase());
      return matchesSearch && matchesType;
    });
    if (filteredDocs.length === 0) {
      return (
        <div className="p-6 text-center">
          <p className="text-gray-600">No documents match your filters</p>
          <button 
            onClick={() => {setSearchQuery(''); setFilterType('all');}}
            className="mt-2 text-blue-600 text-sm hover:underline"
          >
            Clear filters
          </button>
        </div>
      );
    }
    return (
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDocs.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{doc.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.documentType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.documentCategory}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.size}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(doc.dateCreated).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => handlePreviewClick(doc)}
                      className={`flex items-center space-x-1 ${doc.url ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400 cursor-not-allowed'}`}
                      disabled={!doc.url}
                      title={doc.url ? "Preview document" : "Preview not available"}
                      suppressHydrationWarning
                    >
                       <Eye size={16} />
                       <span>View</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="flex items-center space-x-1 text-red-600 hover:text-red-800"
                      title="Delete document"
                      suppressHydrationWarning
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const handleUploadDocument = async () => {
    if (!propertyId) {
      toast.error("Property ID is required");
      return;
    }

    if (!fileInputRef.current?.files?.length) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      setUploading(true);
      const token = await getFirebaseAuthToken();
      const formData = new FormData();
      
      const file = fileInputRef.current.files[0];
      formData.append('document', file);
      
      // No need to append propertyId as it's already in the URL
      // formData.append('propertyId', propertyId);
      formData.append('documentType', documentType);
      formData.append('documentLevel', documentULScope);
      formData.append('documentCategory', documentULType);

      // Use environment variable for the API URL
      const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
      if (!API_URL) {
          throw new Error("Backend API URL is not configured.");
      }
      console.log(`Uploading document to: ${API_URL}/api/documents/properties/${propertyId}/documents`);

      // Update the API endpoint to match the backend route structure
      const response = await fetch(`${API_URL}/api/documents/properties/${propertyId}/documents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload error response:', errorText);
        throw new Error(`Failed to upload document: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Document uploaded successfully:', data);
      
      // Add the new document to the list
      const newDocument: Document = {
        id: data.document.id,
        title: file.name,
        dateCreated: new Date().toISOString(),
        documentType: documentType,
        size: formatFileSize(file.size),
        createdBy: 'You',
        url: data.document.blobUrl || data.document.blob_url,
        mimeType: data.document.mimeType || data.document.mime_type || '',
        propertyId: propertyId
      };

      setDocuments(prev => [...prev, newDocument]);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setDocumentType('Other');
      
      toast.success("Document uploaded successfully");
    } catch (error) {
      console.error('Error uploading document:', error);
      
      let errorMessage = "Failed to upload document. ";
      
      // More specific error handling
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage += "Could not connect to the API server. Please ensure the backend server is running.";
      } else {
        errorMessage += "Please try again.";
      }
      
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  // Handle drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      // Create a new FileList-like object
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      
      // Update the file input
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
        
        // Automatically trigger upload
        handleUploadDocument();
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">

        </div>

        <div className="flex flex-wrap gap-3 justify-end">
          {/* <button
            onClick={() => {
              setShowEditor(!showEditor);
              setShowExtractor(false);
            }}
            className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            suppressHydrationWarning
          >
            {showEditor ? 'Close Editor' : 'Create Document'}
          </button>
          <button
            onClick={() => {
              setShowExtractor(!showExtractor);
              setShowEditor(false);
            }}
            className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            suppressHydrationWarning
          >
            {showExtractor ? 'Close Extractor' : 'AI Extract'}
          </button> */}
          <button
            onClick={() => {
              setShowUploadUI(!showUploadUI);
              setShowEditor(false);
              setShowExtractor(false);
            }}
            className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            suppressHydrationWarning
          >
            {showUploadUI ? 'Close Upload' : 'Upload Document'}
          </button>
        </div>
      </div>

      {showEditor ? (
  <div className="p-6">
    <DocumentEditor 
            onSave={handleSaveDocument} 
            initialFundId={selectedFund}
            initialPropertyId={selectedProperty}
          />
  </div>
) : showExtractor ? (
  <div className="p-6">
    <AIDocumentExtractor 
            onExtractComplete={handleExtractComplete} 
            initialFundId={selectedFund}
            initialPropertyId={selectedProperty}/>
  </div>
) : showUploadUI ? (
  <div className="p-6">
  <div
    className={`rounded-md p-6 transition-colors ${
      isDragging 
        ? 'bg-blue-50 border-2 border-dashed border-blue-400' 
        : 'bg-gray-50 border border-gray-200'
    }`}
    onDragOver={handleDragOver}
    onDragEnter={handleDragOver}
    onDragLeave={handleDragLeave}
    onDrop={handleDrop}
  >
    <div className="flex flex-col items-center justify-center text-center">
      <Upload className={`h-10 w-10 ${isDragging ? 'text-blue-500' : 'text-blue-400'} mb-3`} />

      <h3 className="text-lg font-medium text-gray-900 mb-1">Upload Document</h3>
      <p className="text-sm text-gray-500 mb-4">
        Drag and drop your file here, or use the options below
      </p>
      
      {/* Scope & Type side-by-side */}
        <div className="flex flex-col md:flex-row gap-4 mb-4 w-full max-w-md">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Scope</label>
            <select
              value={documentULScope}
              onChange={(e) => {
                setDocumentULScope(e.target.value);
                setDocumentULType(''); // Reset type
                setSelectedUnitId(''); // Reset unit selection
              }}
              className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md"
            >
              <option value="">Select Scope</option>
              <option value="Unit">Unit Level</option>
              <option value="Property">Property Level</option>
            </select>
          </div>

          {/* Show Select Unit beside Scope only for Unit Level, using all unit data */}
          {documentULScope === 'Unit' && (
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Unit</label>
              <select
                value={selectedUnitId}
                onChange={e => setSelectedUnitId(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md"
                disabled={allUnitsLoading || !allUnits || allUnits.length === 0}
              >
                <option value="">{allUnitsLoading ? 'Loading units...' : 'Select Unit'}</option>
                {allUnits && allUnits.map((unit: any) => (
                  <option key={unit.unitId} value={unit.unitId}>
                    {unit.unitNumber} {unit.tenantName ? `- ${unit.tenantName}` : ''}
                  </option>
                ))}
              </select>
              {allUnitsError && <div className="text-xs text-red-500 mt-1">Failed to load units.</div>}
            </div>
          )}

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={documentULType}
              onChange={(e) => setDocumentULType(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md"
              disabled={
                (!documentULScope) ||
                (documentULScope === 'Unit' && !selectedUnitId)
              }
            >
              <option value="">Select Type</option>
              {documentULScope === 'Unit' ? (
                <>
                  <option value="lease">Lease</option>
                  <option value="inspection">Inspection</option>
                  <option value="tenant_communication">Tenant Communication</option>
                </>
              ) : documentULScope === 'Property' ? (
                <>
                  <option value="insurance">Insurance</option>
                  <option value="financial">Financial</option>
                  <option value="tax">Tax</option>
                  <option value="legal">Legal</option>
                </>
              ) : null}
            </select>
          </div>
        </div>


      {/* File Upload Button */}
      <label
        htmlFor="fileUpload"
        className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors ${
          documentULScope && documentULType
            ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
        }`}
      >
        Select File
        <input
          id="fileUpload"
          name="fileUpload"
          type="file"
          className="sr-only"
          ref={fileInputRef}
          onChange={() => fileInputRef.current?.files?.length && handleUploadDocument()}
          disabled={!documentULScope || !documentULType}
        />
      </label>

      <p className="mt-3 text-xs text-gray-500">PDF, DOCX, XLSX, or TXT — up to 10MB</p>

      {uploading && (
        <div className="mt-4 flex items-center">
          <svg className="animate-spin h-5 w-5 text-blue-600 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <span className="text-blue-600 font-medium">Uploading document...</span>
        </div>
      )}
    </div>
  </div>
</div>
) : viewMode === 'normal' ? (

        <div className="p-6">
          {/* <div className="mb-6">{generateAISummary()}</div> */}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-1 space-y-4">
    {/* Property-Level Categories */}
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="font-medium text-gray-900">Property-Level Documents</h3>
      </div>
      <div className="p-3 space-y-2">
        {propertyLevelTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => toggleExpand(type.id)}
            className={`w-full px-3 py-2 text-left rounded-md text-sm ${
              expandedType === type.id
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex justify-between items-center">
              <span>{type.name}</span>
              <span className="text-xs bg-gray-200 text-gray-700 rounded-full px-2 py-0.5">
                {type.documents.length}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>

    {/* Unit-Level Categories */}
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="font-medium text-gray-900">Unit-Level Documents</h3>
      </div>
      <div className="p-3 space-y-2">
        {unitLevelTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => toggleExpand(type.id)}
            className={`w-full px-3 py-2 text-left rounded-md text-sm ${
              expandedType === type.id
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex justify-between items-center">
              <span>{type.name}</span>
              <span className="text-xs bg-gray-200 text-gray-700 rounded-full px-2 py-0.5">
                {type.documents.length}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>

  {/* Document Viewer */}
  <div className="lg:col-span-2">
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
      <h3 className="font-medium text-gray-900">
        {documentTypes.find((t) => t.id === expandedType)?.name}
      </h3>
    </div>
    <div className="divide-y divide-gray-200">
      {(() => {
        const selectedType = documentTypes.find(t => t.id === expandedType);
        if (!selectedType || selectedType.documents.length === 0) {
          return (
            <div className="p-6 text-center text-gray-500">
              There are no documents in this category.
            </div>
          );
        }

        return selectedType.documents.map((doc) => (
          <div
            key={doc.id}
            className={`p-4 hover:bg-gray-50 cursor-pointer ${
              selectedDocument?.id === doc.id ? 'bg-blue-50' : ''
            }`}
            onClick={() => selectDocument(doc.id, expandedType)}
          >
            <div className="flex justify-between mb-1">
              <h4 className="font-medium text-gray-900">{doc.title}</h4>
              <span className="text-xs text-gray-500">{doc.date}</span>
            </div>
            <p className="text-sm text-gray-600">{doc.abstraction}</p>
            <div className="mt-2 flex justify-end space-x-2">
              <button
                className="text-xs text-blue-600 hover:text-blue-800"
                onClick={(e) => {
                  e.stopPropagation();
                  // Find the full document in propertyDocuments or unitDocuments
                  const allDocs = [...propertyDocuments, ...unitDocuments];
                  const fullDoc = allDocs.find(d => d.id === doc.id);
                  if (fullDoc && fullDoc.url) {
                    handlePreviewClick(fullDoc);
                  } else {
                    toast.error('Preview not available for this document.');
                  }
                }}
              >
                View Original
              </button>
              <button
             className="text-xs text-blue-600 hover:text-blue-800"
             onClick={(e) => {
             e.stopPropagation(); // Prevents selecting the document when deleting
             console.log('Deleting doc:', doc); 
             handleDeleteDocument(doc.id);
  }}
>
  Delete
</button>
            </div>
          </div>
        ));
      })()}
    </div>
  </div>
</div>
</div>

          {/* <div className="mt-6 flex justify-end">
            <button className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-sm font-medium rounded text-blue-600 bg-white hover:bg-blue-50">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Document for AI Processing
            </button>
          </div> */}
        </div>
      ) : (
        <>
          {/* Legal Summary Section */}

          <div className="border-b border-gray-200 mb-4">
          <nav className="-mb-px flex space-x-8 justify-center" aria-label="Tabs">
            {[
              { name: 'Property-Level', value: 'property' },
              { name: 'Unit-Level', value: 'unit' }
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setDocumentLevel(tab.value)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  documentLevel === tab.value
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                aria-current={documentLevel === tab.value ? 'page' : undefined}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
          
          <div className="px-6 pt-4">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Document Overview</h2>
                <button 
                  onClick={() => {
                    setShowEditor(!showEditor);
                    setShowExtractor(false);
                  }}
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  + Add Document
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(documentLevel === 'property' ? propertyDocs : unitDocs).map((cat, idx) => (
                <div
                  key={cat.label}
                  className="flex flex-col items-center border rounded-lg p-3 bg-gray-50 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                  onClick={() =>
                    setFilterType(
                      cat.label.toLowerCase().includes('ownership') ? 'ownership' :
                      cat.label.toLowerCase().includes('legal') ? 'legal' :
                      cat.label.toLowerCase().includes('financial') ? 'financial' :
                      cat.label.toLowerCase().includes('operations') ? 'operations' :
                      cat.label.toLowerCase().includes('lease') ? 'lease' :
                      'all'
                    )
                  }
                >
                  <span className={`px-2 py-1 rounded text-xs font-semibold mb-2 ${cat.color}`}>{cat.type}</span>
                  <div className="font-medium text-gray-800 text-sm text-center">{cat.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{cat.count} document{cat.count > 1 ? 's' : ''}</div>
                </div>
              ))}
              </div>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="px-6 py-4 space-y-4">
            {/* Fund and Property Selection */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="fund-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Fund
                </label>
                <select
                  id="fund-select"
                  value={selectedFund}
                  onChange={(e) => handleFundChange(e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  suppressHydrationWarning
                >
                  <option value="">All Funds</option>
                  {fundsData.map(fund => (
                    <option key={fund.id} value={fund.id}>{fund.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="property-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Property
                </label>
                <select
                  id="property-select"
                  value={selectedProperty}
                  onChange={(e) => setSelectedProperty(e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  disabled={!selectedFund}
                  suppressHydrationWarning
                >
                  <option value="">All Properties</option>
                  {selectedFundProperties.map(property => (
                    <option key={property.id} value={property.id}>
                      {property.name} - {property.address}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search and Document Type Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search documents..."
                  suppressHydrationWarning
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="max-w-xs block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                suppressHydrationWarning
                aria-label="Filter document type"
              >
                <option value="all">All Types</option>
                {(documentLevel === 'property' ? propertyFilters : unitFilters).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Document List */}
          <div className="overflow-x-auto">
            {renderDocumentList()}
          </div>

          {/* Upload Document */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div 
              className={`rounded-md p-6 transition-colors ${
                isDragging 
                  ? 'bg-blue-50 border-2 border-dashed border-blue-400' 
                  : 'bg-gray-50 border border-gray-200'
              }`}
              onDragOver={handleDragOver}
              onDragEnter={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex-shrink-0 mb-3">
                  <svg className={`h-10 w-10 ${isDragging ? 'text-blue-500' : 'text-blue-400'}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Upload Document</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Drag and drop your file here, or click to browse
                  </p>
                  
                  <label
                    htmlFor="fileUpload"
                    className={`inline-flex cursor-pointer items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                      documentULScope && documentULType
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Select File
                    <input
                      id="fileUpload"
                      name="fileUpload"
                      type="file"
                      className="sr-only"
                      ref={fileInputRef}
                      onChange={() => {
                        if (documentULScope && documentULType && fileInputRef.current?.files?.length) {
                          handleUploadDocument();
                        }
                      }}
                      disabled={!documentULScope || !documentULType}
                    />
                  </label>
                  
                  <p className="mt-3 text-xs text-gray-500">PDF, DOCX, XLSX or TXT up to 10MB</p>
                
                  <div className="mt-4">
                    <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-1">
                      Document Type
                    </label>
                    <select
                      id="documentType"
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                      className="mx-auto max-w-xs block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="Lease">Lease</option>
                      <option value="Insurance">Insurance</option>
                      <option value="Financial">Financial</option>
                      <option value="Tax">Tax</option>
                      <option value="Legal">Legal</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                
                {uploading && (
                  <div className="mt-4 flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-blue-600 font-medium">Uploading document...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Real Estate Document Analyzer */}
          <div className="px-6 py-4 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">AI Document Analyzer</h3>
            <RealEstateDocumentAnalyzer onSaveToDocumentHub={handleSaveAnalyzedDocument} />
          </div>

          {/* Extracted Data Modal */}
          {extractedData && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Extracted Information</h3>
                  <button
                    onClick={() => setExtractedData(null)}
                    className="text-gray-400 hover:text-gray-500"
                    suppressHydrationWarning
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Key Points</h4>
                    <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                      {extractedData.keyPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Entities</h4>
                    <div className="mt-2 grid grid-cols-1 gap-2">
                      {extractedData.entities.map((entity, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-md"
                        >
                          <div className="text-sm text-gray-900">{entity.name}</div>
                          <div className="text-sm text-gray-500">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {entity.value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setExtractedData(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    suppressHydrationWarning
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

   {/* --- Document Preview Modal --- */}
{isPreviewModalOpen && previewUrl && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 transition-opacity duration-300 ease-in-out">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
      {/* Modal Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 truncate pr-4" title={previewTitle}>
          Preview: {previewTitle}
        </h3>
        <button
          onClick={closePreviewModal}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Close preview"
          suppressHydrationWarning
        >
          <X size={24} />
        </button>
      </div>

      {/* Modal Body - Iframe or Message */}
      <div className="flex-grow p-4 overflow-y-auto">
        {previewMimeType.startsWith('image/') ? (
          <img
            src={previewUrl}
            alt={`Preview of ${previewTitle}`}
            className="max-w-full max-h-full mx-auto object-contain"
          />
        ) : previewMimeType === 'application/pdf' ? (
          <iframe
            src={previewUrl}
            title={`Preview of ${previewTitle}`}
            className="w-full h-[75vh] border-0"
          ></iframe>
        ) : previewMimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          previewMimeType === 'application/msword' ||
          previewMimeType === 'application/vnd.ms-excel' ||
          previewMimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ? (
          // Use Office Online Viewer for Word/Excel files
          <iframe
            src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(previewUrl)}`}
            title={`Preview of ${previewTitle}`}
            className="w-full h-[75vh] border-0"
          ></iframe>
        ) : (
          <div className="text-center p-10">
            <p className="text-lg text-gray-700 mb-4">
              Preview is not available for this file type ({previewMimeType}).
            </p>
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Open in New Tab
            </a>
          </div>
        )}
      </div>
    </div>
  </div>
)}
</div>
  );
}

export default DocumentHub;