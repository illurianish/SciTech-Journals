'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface BaseDocument {
  id: string
  type: 'lease' | 'insurance' | 'tax' | 'permit' | 'contract' | 'financial' | 'maintenance'
  name: string
  uploadDate: string
  summary: {
    title: string
    description: string
    keyPoints: string[]
    riskLevel: 'Low' | 'Medium' | 'High'
    status: 'Active' | 'Pending' | 'Expired'
  }
  metadata: {
    documentType: string
    dateCreated: string
    lastModified: string
    pageCount: number
    fileSize: string
    author: string
    version: string
  }
  relatedDocuments: {
    id: string
    name: string
    relationship: string
    relevantSections?: string[]
  }[]
}

// Simple document data for demonstration
const sampleDocument: BaseDocument = {
  id: 'doc-001',
  type: 'lease',
  name: 'Commercial Lease Agreement - Tech Plaza Suite 2000',
  uploadDate: '2024-03-18',
  summary: {
    title: 'Commercial Lease Agreement',
    description: 'Master lease agreement for Suite 2000 in Tech Plaza between AriesView Properties and Quantum Technologies Inc.',
    keyPoints: [
      'Initial term of 7 years with two 5-year renewal options',
      'Base rent of $52 per square foot with 3.5% annual increases',
      'Modified Gross lease structure',
      'Tenant improvement allowance of $85 per square foot',
      'Expansion right on adjacent suite'
    ],
    riskLevel: 'Low',
    status: 'Active'
  },
  metadata: {
    documentType: 'Commercial Lease',
    dateCreated: '2024-02-28',
    lastModified: '2024-03-18',
    pageCount: 68,
    fileSize: '3.2 MB',
    author: 'Legal Department',
    version: '1.0'
  },
  relatedDocuments: [
    {
      id: 'doc-002',
      name: 'Work Letter',
      relationship: 'Exhibit',
      relevantSections: ['TI Specifications', 'Construction Schedule']
    },
    {
      id: 'doc-003',
      name: 'Building Rules and Regulations',
      relationship: 'Exhibit',
      relevantSections: ['Loading Dock', 'Moving Procedures']
    }
  ]
};

export default function AbstractComponent() {
  const params = useParams();
  const [document, setDocument] = useState<BaseDocument | null>(null);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    // In production, this would be an API call to fetch the document data
    if (params.documentId) {
      // Here we're using sample data
      setDocument({
        ...sampleDocument,
        id: params.documentId as string
      });
    }
  }, [params.documentId]);

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  const tabs = ['summary', 'details'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Link
              href={`/operations-dashboard/properties/${params.id}/document-hub`}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Document Hub
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{document.name}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {document.type.toUpperCase()}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              document.summary.status === 'Active' ? 'bg-green-100 text-green-800' :
              document.summary.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {document.summary.status}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              document.summary.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
              document.summary.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {document.summary.riskLevel} Risk
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'summary' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Document Summary</h2>
                <p className="text-gray-600 mb-4">{document.summary.description}</p>
                <h3 className="text-lg font-medium mb-2">Key Points</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {document.summary.keyPoints.map((point, index) => (
                    <li key={index} className="text-gray-600">{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Document Details</h2>
                <p className="text-gray-600 mb-4">
                  This is a simplified version of the document details view.
                  In a real application, this would contain more detailed information about the document.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Document Metadata */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Document Information</h2>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-gray-500">Document Type</dt>
                  <dd className="text-gray-900">{document.metadata.documentType}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Created</dt>
                  <dd className="text-gray-900">{document.metadata.dateCreated}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Last Modified</dt>
                  <dd className="text-gray-900">{document.metadata.lastModified}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Pages</dt>
                  <dd className="text-gray-900">{document.metadata.pageCount}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Size</dt>
                  <dd className="text-gray-900">{document.metadata.fileSize}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Version</dt>
                  <dd className="text-gray-900">{document.metadata.version}</dd>
                </div>
              </dl>
            </div>

            {/* Related Documents */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Related Documents</h2>
              <ul className="space-y-3">
                {document.relatedDocuments.map((doc) => (
                  <li key={doc.id}>
                    <Link
                      href={`/operations-dashboard/properties/${params.id}/document-hub/${doc.id}/abstract`}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                      {doc.name}
                      <span className="ml-1 text-xs text-gray-500">({doc.relationship})</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 