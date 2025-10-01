'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
  status: 'processed' | 'pending' | 'error';
}

export default function DocumentsContent() {
  const params = useParams();
  const propertyId = params.id as string;
  
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Lease Agreement.pdf',
      type: 'PDF',
      size: '2.4 MB',
      uploadDate: '2023-10-15',
      status: 'processed'
    },
    {
      id: '2',
      name: 'Property Inspection Report.pdf',
      type: 'PDF',
      size: '4.8 MB',
      uploadDate: '2023-09-22',
      status: 'processed'
    },
    {
      id: '3',
      name: 'Financial Statement Q3.xlsx',
      type: 'XLSX',
      size: '1.2 MB',
      uploadDate: '2023-11-05',
      status: 'processed'
    },
    {
      id: '4',
      name: 'Insurance Policy.pdf',
      type: 'PDF',
      size: '3.1 MB',
      uploadDate: '2023-08-17',
      status: 'pending'
    }
  ]);
  
  const [property, setProperty] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  useEffect(() => {
    // Simulate loading property and documents
    const loadData = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would fetch from an API
        // For now, simulate with localStorage + mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if property exists in localStorage
        const savedProperties = localStorage.getItem('ariesviewProperties');
        let propertyName = 'Property';
        
        if (savedProperties) {
          const parsedProperties = JSON.parse(savedProperties);
          const foundProperty = parsedProperties.find((p: any) => p.id === propertyId);
          
          if (foundProperty) {
            propertyName = foundProperty.name;
          }
        }
        
        setProperty({ name: propertyName });
        
        // Set mock documents
        setDocuments([
          {
            id: '1',
            name: 'Lease Agreement.pdf',
            type: 'lease',
            size: '2.4 MB',
            uploadDate: '2023-10-15',
            status: 'processed'
          },
          {
            id: '2',
            name: 'Property Inspection Report.pdf',
            type: 'maintenance',
            size: '4.8 MB',
            uploadDate: '2023-09-22',
            status: 'processed'
          },
          {
            id: '3',
            name: 'Financial Statement Q3.xlsx',
            type: 'financial',
            size: '1.2 MB',
            uploadDate: '2023-11-05',
            status: 'processed'
          },
          {
            id: '4',
            name: 'Insurance Policy.pdf',
            type: 'legal',
            size: '3.1 MB',
            uploadDate: '2023-08-17',
            status: 'processed'
          }
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [propertyId]);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      setUploading(true);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create new document entry
      const newDoc: Document = {
        id: (documents.length + 1).toString(),
        name: selectedFile.name,
        type: selectedFile.name.split('.').pop() || 'UNKNOWN',
        size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'pending'
      };
      
      // Add to documents list
      setDocuments([newDoc, ...documents]);
      
      // Reset file selection
      setSelectedFile(null);
      
      // Simulate processing completion after delay
      setTimeout(() => {
        setDocuments(prev => 
          prev.map(doc => doc.id === newDoc.id ? { ...doc, status: 'processed' } : doc)
        );
      }, 5000);
      
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };
  
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'processed':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Processed
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Processing
          </span>
        );
      case 'error':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Error
          </span>
        );
      default:
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Documents</h2>
          <p className="text-gray-500">Please wait while we load the property documents...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Link 
              href={`/operations-dashboard/properties/${propertyId}`}
              className="text-[#0066cc] hover:text-[#0055aa] flex items-center mr-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Property
            </Link>
            <h1 className="text-2xl font-bold text-[#0066cc]">
              {property ? `${property.name} - Documents` : 'Property Documents'}
            </h1>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-6">
            {/* Upload Section */}
            <div className="md:w-1/3 mb-6 md:mb-0">
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-lg font-semibold text-[#0066cc] mb-4">Upload New Document</h2>
                
                <div 
                  className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                    dragActive ? 'border-[#0066cc] bg-blue-50' : 'border-gray-300'
                  }`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="space-y-1 text-center">
                    <svg 
                      className={`mx-auto h-12 w-12 ${selectedFile ? 'text-[#0066cc]' : 'text-gray-400'}`} 
                      stroke="currentColor" 
                      fill="none" 
                      viewBox="0 0 48 48"
                    >
                      <path 
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
                        strokeWidth={2} 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label 
                        htmlFor="file-upload" 
                        className="relative cursor-pointer bg-white rounded-md font-medium text-[#0066cc] hover:text-[#0055aa] focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          className="sr-only" 
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOCX, XLSX, JPG up to 10MB
                    </p>
                  </div>
                </div>
                
                {selectedFile && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg className="h-6 w-6 text-[#0066cc] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-900 truncate" title={selectedFile.name}>
                          {selectedFile.name}
                        </span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="text-gray-400 hover:text-gray-500"
                        title="Remove file"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </div>
                  </div>
                )}
                
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={!selectedFile || uploading}
                    className={`w-full px-4 py-2 text-white rounded-md flex items-center justify-center ${
                      !selectedFile ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#0066cc] hover:bg-[#0055aa]'
                    }`}
                  >
                    {uploading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      'Upload Document'
                    )}
                  </button>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Document Guidelines</h3>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li className="flex items-start">
                      <svg className="h-4 w-4 text-[#0066cc] mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Ensure documents are legible and complete
                    </li>
                    <li className="flex items-start">
                      <svg className="h-4 w-4 text-[#0066cc] mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      PDF files yield the best analysis results
                    </li>
                    <li className="flex items-start">
                      <svg className="h-4 w-4 text-[#0066cc] mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Processing may take a few minutes to complete
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Documents List Section */}
            <div className="md:w-2/3">
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-[#0066cc]">Property Documents</h2>
                  <span className="text-sm text-gray-500">{documents.length} documents</span>
                </div>
                
                {documents.length === 0 ? (
                  <div className="p-6 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mt-2 text-gray-500">No documents found for this property.</p>
                    <p className="text-sm text-gray-400">Upload documents to begin analysis.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Document
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Size
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {documents.map((doc) => (
                          <tr key={doc.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{doc.type}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{doc.size}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{doc.uploadDate}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusDisplay(doc.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                className="text-[#0066cc] hover:text-[#0055aa] mr-4"
                                title="View document"
                              >
                                View
                              </button>
                              <button
                                className="text-red-600 hover:text-red-800"
                                title="Delete document"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              
              {documents.length > 0 && (
                <div className="mt-6 bg-white shadow-md rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#0066cc] mb-4">Document Analysis</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Our AI has analyzed these documents and extracted the following insights:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-md font-medium text-gray-800 mb-2">Lease Summary</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>Current rental income: $215,000 annually</li>
                        <li>Average lease term: 24 months</li>
                        <li>Renewal rate: 65%</li>
                      </ul>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-md font-medium text-gray-800 mb-2">Financial Health</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>Current ROI: 7.8%</li>
                        <li>Expense ratio: 42%</li>
                        <li>Cash flow: Positive</li>
                      </ul>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-md font-medium text-gray-800 mb-2">Risk Factors</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>Inspection identified minor repairs needed</li>
                        <li>Insurance coverage sufficient</li>
                        <li>Market conditions stable</li>
                      </ul>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-md font-medium text-gray-800 mb-2">Opportunities</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>Potential for 5% rent increase at next renewal</li>
                        <li>Energy efficiency upgrades could reduce expenses</li>
                        <li>Refinancing opportunity identified</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <Link
                      href={`/operations-dashboard/properties/${propertyId}/analysis`}
                      className="px-4 py-2 bg-[#0066cc] text-white rounded-md hover:bg-[#0055aa] flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
                      </svg>
                      View Full Analysis
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 