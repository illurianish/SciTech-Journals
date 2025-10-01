'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { propertiesData } from '../../data'
import Link from 'next/link'

interface DocumentCategory {
  id: string
  name: string
  totalDocs: number
  processedDocs: number
  icon: React.ReactNode
}

interface DocumentPreview {
  id: number
  name: string
  category: string
  uploadDate: string
  isAnalyzed: boolean
  type: string
  status: string
  content?: string
  aiAbstract?: {
    summary: string
    keyPoints: string[]
    dates: { [key: string]: string }
    financialData?: { [key: string]: string | number }
    parties?: { [key: string]: string }
    terms?: string[]
    risks?: string[]
    recommendations?: string[]
  }
}

const DocumentRow = ({ doc, propertyId, onDocumentClick }: { 
  doc: DocumentPreview
  propertyId: string
  onDocumentClick: (doc: DocumentPreview) => void 
}) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <button
            onClick={() => onDocumentClick(doc)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            {doc.name}
          </button>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {doc.isAnalyzed ? (
          <Link
            href={`/operations-dashboard/properties/${propertyId}/document-hub/${doc.id}/abstract`}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200"
          >
            View Abstract
          </Link>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {doc.category}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {doc.uploadDate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          doc.status === 'Active' ? 'bg-green-100 text-green-800' :
          doc.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {doc.status}
        </span>
      </td>
    </tr>
  )
}

export default function DocumentManagementHub() {
  const params = useParams()
  const propertyId = params.id
  const [property, setProperty] = useState<any>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [documents, setDocuments] = useState<DocumentPreview[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [showAIAbstractModal, setShowAIAbstractModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<DocumentPreview | null>(null)

  const documentCategories: DocumentCategory[] = [
    {
      id: 'all',
      name: 'All Documents',
      totalDocs: 45,
      processedDocs: 38,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      id: 'leases',
      name: 'Leases & Agreements',
      totalDocs: 12,
      processedDocs: 10,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'ownership',
      name: 'Ownership & Deeds',
      totalDocs: 8,
      processedDocs: 8,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      )
    }
  ]

  // Sample documents data with content and AI abstracts
  const sampleDocuments: DocumentPreview[] = [
    {
      id: 1,
      name: 'Master Lease Agreement - Tenant A',
      category: 'Leases & Agreements',
      uploadDate: '2024-02-15',
      isAnalyzed: true,
      type: 'lease',
      status: 'Active',
      content: 'Sample lease agreement content...',
      aiAbstract: {
        summary: 'Commercial lease agreement between Property Owner and Tenant A for office space.',
        keyPoints: [
          'Lease term: 5 years',
          'Monthly rent: $15,000',
          'Security deposit: $45,000',
          'Renewal option: 2x5 years'
        ],
        dates: {
          'Start Date': '2024-03-01',
          'End Date': '2029-02-28',
          'Rent Commencement': '2024-03-01'
        },
        financialData: {
          'Base Rent': 15000,
          'Annual Increase': 3,
          'Operating Expenses': 'Triple Net (NNN)',
          'Security Deposit': 45000
        },
        parties: {
          'Landlord': 'Property Owner LLC',
          'Tenant': 'Tenant A Corporation',
          'Guarantor': 'Parent Company Inc.'
        },
        terms: [
          'Triple Net lease structure',
          'Tenant responsible for all operating expenses',
          'Early termination option after 36 months',
          'Right of first refusal on adjacent space'
        ],
        risks: [
          'No personal guarantee from tenant principals',
          'Complex early termination clause',
          'Extensive tenant improvement requirements'
        ]
      }
    },
    {
      id: 2,
      name: 'Property Deed',
      category: 'Ownership & Deeds',
      uploadDate: '2024-01-10',
      isAnalyzed: true,
      type: 'deed',
      status: 'Verified',
      content: 'Sample property deed content...',
      aiAbstract: {
        summary: 'Warranty Deed for commercial property transfer',
        keyPoints: [
          'Clean title transfer',
          'No encumbrances',
          'All required signatures present',
          'Properly recorded with county'
        ],
        dates: {
          'Recording Date': '2024-01-10',
          'Transfer Date': '2024-01-05'
        },
        parties: {
          'Grantor': 'Previous Owner LLC',
          'Grantee': 'Current Owner LLC'
        }
      }
    },
    {
      id: 3,
      name: 'Q4 2023 Financial Statement',
      category: 'Financial Documents',
      uploadDate: '2024-01-20',
      isAnalyzed: true,
      type: 'financial',
      status: 'Processed'
    }
  ]

  useEffect(() => {
    const propertyData = propertiesData.find(p => p.id === propertyId)
    if (propertyData) {
      setProperty(propertyData)
      setDocuments(sampleDocuments)
    }
  }, [propertyId])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    // Handle file drop logic here
  }

  const handleDocumentClick = (doc: DocumentPreview) => {
    setSelectedDocument(doc)
    setShowDocumentModal(true)
  }

  const DocumentModal = () => {
    if (!selectedDocument) return null

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-4/5 shadow-lg rounded-md bg-white h-4/5 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">{selectedDocument.name}</h3>
            <button
              onClick={() => setShowDocumentModal(false)}
              className="text-gray-400 hover:text-gray-500"
              title="Close document preview"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="h-full overflow-y-auto p-4 bg-gray-50">
            {selectedDocument.content}
          </div>
        </div>
      </div>
    )
  }

  const AIAbstractModal = () => {
    if (!selectedDocument?.aiAbstract) return null

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-4/5 shadow-lg rounded-md bg-white h-4/5 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">AI Abstract: {selectedDocument.name}</h3>
            <button
              onClick={() => setShowAIAbstractModal(false)}
              className="text-gray-400 hover:text-gray-500"
              title="Close AI abstract"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="h-full overflow-y-auto">
            <div className="space-y-6 p-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Summary</h4>
                <p className="text-gray-600">{selectedDocument.aiAbstract.summary}</p>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Key Points</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {selectedDocument.aiAbstract.keyPoints.map((point, index) => (
                    <li key={index} className="text-gray-600">{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!property) {
    return <div className="p-6">Loading property details...</div>
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Navigation Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center text-sm">
          <Link href="/operations-dashboard" className="text-blue-600 hover:text-blue-800">
            Dashboard
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link href="/operations-dashboard/properties" className="text-blue-600 hover:text-blue-800">
            Properties
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link href={`/operations-dashboard/properties/${propertyId}`} className="text-blue-600 hover:text-blue-800">
            {property.name}
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-600 font-medium">Document Hub</span>
        </div>
        
        {/* Property Navigation Tabs */}
        <div className="flex mt-4 space-x-4 border-b">
          <Link 
            href={`/operations-dashboard/properties/${propertyId}`}
            className="px-4 py-2 text-gray-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600"
          >
            Overview
          </Link>
          <Link 
            href={`/operations-dashboard/properties/${propertyId}/document-hub`}
            className="px-4 py-2 text-blue-600 border-b-2 border-blue-600 font-medium"
          >
            Document Hub
          </Link>
          <Link 
            href={`/operations-dashboard/properties/${propertyId}/financial-hub`}
            className="px-4 py-2 text-gray-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600"
          >
            Financial Hub
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left sidebar - Document categories */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4">Document Categories</h2>
            <div className="space-y-2">
              {documentCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="flex-shrink-0">{category.icon}</span>
                    <span>{category.name}</span>
                  </div>
                  <div className="text-sm">
                    <span className={selectedCategory === category.id ? 'text-blue-600' : 'text-gray-500'}>
                      {category.processedDocs}/{category.totalDocs}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Upload Area */}
          <div
            className={`bg-white rounded-lg shadow-sm p-6 border-2 border-dashed ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Drag and drop your documents here
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                or
              </p>
              <div className="mt-2">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Browse Files
                </button>
              </div>
            </div>
          </div>

          {/* Document List */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Document Repository</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Document Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      AI Analyzed
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Upload Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {documents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        No documents uploaded yet
                      </td>
                    </tr>
                  ) : (
                    documents.map((doc) => (
                      <DocumentRow
                        key={doc.id}
                        doc={doc}
                        propertyId={params.id as string}
                        onDocumentClick={handleDocumentClick}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      {showDocumentModal && <DocumentModal />}

      {/* AI Abstract Modal */}
      {showAIAbstractModal && <AIAbstractModal />}
    </div>
  )
} 