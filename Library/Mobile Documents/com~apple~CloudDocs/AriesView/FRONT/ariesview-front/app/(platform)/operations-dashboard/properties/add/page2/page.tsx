// SECOND TAB: UPLOAD DOCUMENTS

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePropertyForm } from '../PropertyFormContext'
import type { Document } from '../PropertyFormContext'
import { useAddDocument } from '@/app/rest/document'
import toast from 'react-hot-toast'


interface UploadableDocument extends Document {
  uploadStatus?: 'pending' | 'uploading' | 'success' | 'error';
  uploadError?: string | null;
}

// Using the document hook instead of manual token handling

export default function UploadDocumentsPage() {
  const router = useRouter()
  const { state: contextState, dispatch } = usePropertyForm()
  const [localDocuments, setLocalDocuments] = useState<UploadableDocument[]>(contextState.documents.map(doc => ({ ...doc, uploadStatus: 'pending' })) || []);
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false); // Add submitting state
  const [apiError, setApiError] = useState<string | null>(null); // Add API error state
  const { propertyId } = contextState

  const [documentULType, setDocumentULType] = useState('');

  // Local state for the tag input field
  const [currentTag, setCurrentTag] = useState('');

  // Use the document upload hook
  const addDocumentMutation = useAddDocument();

  useEffect(() => {
    if (!propertyId) {
      console.warn('Property ID missing in context, redirecting.')
      router.push('/operations-dashboard/properties/add')
    }
    const currentStatuses = new Map(localDocuments.map(d => [d.id, { status: d.uploadStatus, error: d.uploadError }]));
    setLocalDocuments(contextState.documents.map(doc => ({
      ...doc,
      uploadStatus: currentStatuses.get(doc.id)?.status || 'pending',
      uploadError: currentStatuses.get(doc.id)?.error
    })) || [])

  }, [propertyId, contextState.documents, router]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!documentULType) {
      alert('Please select a document type before uploading files.');
      return;
    }
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files))
      e.target.value = ''
    }
  }

  const generateLocalId = () => {
    return `local-${Math.random().toString(36).substring(2, 11)}`;
  }


  const handleFiles = (files: File[]) => {
    if (!propertyId) {
      alert('Cannot upload documents: Property ID is missing.');
      return;
    }

    if (!documentULType) {
      alert('Please select a document type before uploading files.');
      return;
    }

    const newUploadables: UploadableDocument[] = files.map(file => ({
      id: propertyId,
      name: file.name,
      type: file.type,
      category: documentULType,
      size: file.size,
      uploadDate: new Date(),
      file: file,
      uploadStatus: 'pending'
    }));

    setLocalDocuments(prev => [...prev, ...newUploadables]);
    newUploadables.forEach(doc => uploadDocument(doc));
  };

  const uploadDocument = async (doc: UploadableDocument) => {
    if (!propertyId) return;

    setLocalDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, uploadStatus: 'uploading' } : d));

    try {
      const formData = new FormData();
      formData.append('document', doc.file);
      formData.append('documentType', "property");
      formData.append('documentLevel', "Property");
      formData.append('documentCategory', doc.category);

      const result = await addDocumentMutation.mutateAsync({ propertyId, formData });

      setLocalDocuments(prev => prev.map(d => d.id === doc.id ? {
        ...d,
        id: result.document?.id || doc.id,
        uploadStatus: 'success',
        uploadError: null,
      } : d));

      toast.success(`Successfully uploaded ${doc.name}`);

    } catch (err) {
      console.error(`Failed to upload ${doc.name}:`, err);
      const errorMsg = err instanceof Error ? err.message : 'Unknown upload error';
      setLocalDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, uploadStatus: 'error', uploadError: errorMsg } : d));
      toast.error(`Failed to upload ${doc.name}: ${errorMsg}`);
    }
  };

  const handleRemoveDocument = (id: string) => {
    setLocalDocuments(prev => prev.filter(doc => doc.id !== id));
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  // Remove handleSubmit and property creation logic
  // Remove the Save and Continue button and related UI


  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-[#0066cc]">Upload Documents</h1>
            <Link
              href="/operations-dashboard"
              className="text-gray-500 hover:text-gray-700"
            >
              Back to Dashboard
            </Link>
          </div>

          <div className="mb-8">
            <div className="flex items-center">
              <div className="relative flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="mt-2 text-sm font-medium text-gray-500">Property Overview</div>
              </div>
              <div className="flex-grow h-0.5 bg-green-500 mx-4"></div>
              <div className="relative flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#0066cc] text-white flex items-center justify-center font-bold">2</div>
                <div className="mt-2 text-sm font-medium  text-[#0066cc]">Upload Documents</div>
              </div>
              <div className="flex-grow h-0.5 bg-gray-200 mx-4"></div>
              <div className="relative flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold">3</div>
                <div className="mt-2 text-sm font-medium text-gray-500">Property Details</div>
              </div>
              <div className="flex-grow h-0.5 bg-gray-200 mx-4"></div>
              <div className="relative flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold">4</div>
                <div className="mt-2 text-sm font-medium text-gray-500">Unit Details</div>
              </div>
              <div className="flex-grow h-0.5 bg-gray-200 mx-4"></div>
              <div className="relative flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold">5</div>
                <div className="mt-2 text-sm font-medium text-gray-500">Processing</div>
              </div>
              <div className="flex-grow h-0.5 bg-gray-200 mx-4"></div>
              <div className="relative flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold">6</div>
                <div className="mt-2 text-sm font-medium text-gray-500">Review</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Property Documents</h2>


          <div className="mb-6 w-full max-w-sm">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={documentULType}
              onChange={(e) => setDocumentULType(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md"
            >
              <option value="">Select Type</option>
              <option value="insurance">Insurance</option>
              <option value="financial">Financial</option>
              <option value="tax">Tax</option>
              <option value="legal">Legal</option>
            </select>
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : !documentULType
                ? 'border-gray-200 bg-gray-100 cursor-not-allowed'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="fileUpload"
              disabled={!documentULType}
            />
            <label
              htmlFor="fileUpload"
              className={`cursor-pointer ${!documentULType ? 'pointer-events-none opacity-50' : ''}`}>
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="mt-2 text-sm font-medium text-gray-600">
                Drag and drop files here, or <span className="text-[#0066cc]">click to select files</span>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                PDF, DOCX, XLSX, PNG, JPG, etc.
              </p>
            </label>
          </div>
        </div>

        {localDocuments.length > 0 && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Uploaded Documents</h3>
            <ul className="space-y-3">
              {localDocuments.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-100">
                  <div className="flex items-center overflow-hidden mr-4">
                    <div className="mr-3 flex-shrink-0">
                      {doc.uploadStatus === 'uploading' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>}
                      {doc.uploadStatus === 'success' && <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
                      {doc.uploadStatus === 'error' && <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>}
                      {doc.uploadStatus === 'pending' && <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 10.586V6z" clipRule="evenodd" /></svg>}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-gray-800 truncate" title={doc.name}>{doc.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(doc.size)} - {doc.type}
                        {doc.uploadStatus === 'error' && <span className="text-red-600 ml-2 truncate">({doc.uploadError})</span>}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveDocument(doc.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
                    title="Remove document"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}



        <div className="flex justify-between items-center mt-10">
          <Link
            href="/operations-dashboard/properties/add"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Back to Property Overview
          </Link>
          <button
            type="button"
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0066cc] hover:bg-[#0055aa] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={localDocuments.some(doc => doc.uploadStatus === 'uploading') || addDocumentMutation.isPending}
            onClick={() => router.push('/operations-dashboard/properties/add/page3')}
          >
            {addDocumentMutation.isPending ? 'Uploading...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  )
} 
