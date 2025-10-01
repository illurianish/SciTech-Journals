import React, { useState } from 'react';

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

interface AIDocumentExtractorProps {
  onExtractComplete: (extractedData: ExtractedData) => void;
  initialFundId?: string;
  initialPropertyId?: string;
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
  fundId?: string;
  propertyId?: string;
}

const AIDocumentExtractor: React.FC<AIDocumentExtractorProps> = ({ 
  onExtractComplete,
  initialFundId = '',
  initialPropertyId = ''
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [fundId, setFundId] = useState(initialFundId);
  const [propertyId, setPropertyId] = useState(initialPropertyId);

  // Get properties for selected fund
  const selectedFundProperties = fundsData.find(fund => fund.id === fundId)?.properties || [];

  const handleFundChange = (newFundId: string) => {
    setFundId(newFundId);
    setPropertyId('');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const simulateExtraction = () => {
    if (!file) return;
    
    setIsProcessing(true);
    setExtractionProgress(0);

    const interval = setInterval(() => {
      setExtractionProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          
          // Simulate extracted data
          const mockExtractedData: ExtractedData = {
            title: file?.name || 'Untitled Document',
            type: 'Contract',
            date: new Date().toISOString().split('T')[0],
            keyPoints: [
              'Agreement term: 5 years',
              'Monthly rent: $12,500',
              'Security deposit: $25,000',
              'Maintenance responsibilities defined in Section 8',
            ],
            entities: [
              { name: 'Tenant', type: 'Organization', value: 'ABC Corporation' },
              { name: 'Start Date', type: 'Date', value: '2024-01-01' },
              { name: 'End Date', type: 'Date', value: '2028-12-31' },
              { name: 'Total Value', type: 'Currency', value: '$750,000' },
            ],
            fundId,
            propertyId
          };

          onExtractComplete(mockExtractedData);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">AI Document Extractor</h3>
          <p className="mt-1 text-sm text-gray-500">
            Upload a document to automatically extract key information using AI
          </p>
        </div>

        {/* Fund and Property Selection */}
        {!isProcessing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ai-fund-select" className="block text-sm font-medium text-gray-700">
                Select Fund
              </label>
              <select
                id="ai-fund-select"
                value={fundId}
                onChange={(e) => handleFundChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                suppressHydrationWarning
              >
                <option value="">Select a Fund</option>
                {fundsData.map(fund => (
                  <option key={fund.id} value={fund.id}>{fund.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="ai-property-select" className="block text-sm font-medium text-gray-700">
                Select Property
              </label>
              <select
                id="ai-property-select"
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                disabled={!fundId}
                suppressHydrationWarning
              >
                <option value="">Select a Property</option>
                {selectedFundProperties.map(property => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {!isProcessing ? (
          <div className="space-y-4">
            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.txt"
                      aria-label="Upload document"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
              </div>
            </div>

            {file && (
              <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-md">
                <div className="flex items-center">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="ml-2 text-sm text-gray-900">{file.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-sm text-red-600 hover:text-red-500"
                  suppressHydrationWarning
                >
                  Remove
                </button>
              </div>
            )}

            <div>
              <button
                onClick={simulateExtraction}
                disabled={!file || (!fundId && !propertyId)}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${file && (fundId || propertyId) ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                suppressHydrationWarning
              >
                Extract Information
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    Extracting
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {extractionProgress}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div
                  style={{ width: `${extractionProgress}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300"
                />
              </div>
              <p className="text-sm text-gray-500 text-center">
                AI is analyzing your document. This may take a few moments...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIDocumentExtractor; 