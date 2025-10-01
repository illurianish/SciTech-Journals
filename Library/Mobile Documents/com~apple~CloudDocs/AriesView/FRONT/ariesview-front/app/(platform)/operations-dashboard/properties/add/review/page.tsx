'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePropertyForm } from '../PropertyFormContext'
import type { PropertyData, Document } from '../PropertyFormContext'

export default function ReviewPage() {
  const router = useRouter()
  const { state: contextState, dispatch } = usePropertyForm()
  const { propertyData, documents, propertyId } = contextState
  
  useEffect(() => {
    if (!propertyData || !propertyId) {
      console.warn('Property data or ID missing in context, redirecting.')
      router.push('/operations-dashboard/properties/add')
    }
  }, [propertyData, propertyId, router])
  
  const handleSubmit = () => {
    if (!propertyId) {
      alert("Cannot complete process: Property ID is missing.")
      return
    }

    console.log("Finalizing property creation process...");
    
    // First clear the form data to prevent memory issues
    dispatch({ type: 'CLEAR_FORM' })
    
    // Use setTimeout to ensure the state update happens before redirection
    console.log(`Preparing to redirect to property page: /operations-dashboard/properties/${propertyId}`);
    
    // Force immediate navigation instead of waiting
    window.location.href = `/operations-dashboard/properties/${propertyId}`;
    
    // Fallback - if the above direct navigation doesn't work
    setTimeout(() => {
      console.log("Fallback navigation triggered");
      router.push(`/operations-dashboard/properties/${propertyId}`);
    }, 100);
  }
  
  const formatCurrency = (value?: number | string | null) => {
    const parseOptionalNumber = (val: string | number | undefined | null): number | null => {
      if (val === undefined || val === null || val === '') return null
      const num = Number(val)
      return isNaN(num) ? null : num
    }
    const num = parseOptionalNumber(value)
    if (num === null) return 'N/A'
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num)
  }
  
  if (!propertyData || !propertyId) {
    return <div className="min-h-screen bg-gray-50 flex justify-center items-center">Loading or Redirecting...</div>
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-[#0066cc]">Review Property Information</h1>
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
                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="mt-2 text-sm font-medium text-gray-500">Upload Documents</div>
              </div>
              <div className="flex-grow h-0.5 bg-green-500 mx-4"></div>
              <div className="relative flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="mt-2 text-sm font-medium text-gray-500">Property Details</div>
              </div>
              <div className="flex-grow h-0.5 bg-green-500 mx-4"></div>
              <div className="relative flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="mt-2 text-sm font-medium text-gray-500">Unit Details</div>
              </div>
              <div className="flex-grow h-0.5 bg-green-500 mx-4"></div>
              <div className="relative flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="mt-2 text-sm font-medium text-gray-500">Processing</div>
              </div>
              <div className="flex-grow h-0.5 bg-green-500 mx-4"></div>
              <div className="relative flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#0066cc] text-white flex items-center justify-center font-bold">6</div>
                <div className="mt-2 text-sm font-medium text-[#0066cc]">Review</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Property Information</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div><dt className="text-gray-500">Property Name</dt><dd className="text-gray-900 font-medium">{propertyData.propertyName}</dd></div>
              <div><dt className="text-gray-500">Property Type</dt><dd className="text-gray-900 font-medium">{propertyData.propertyType}</dd></div>
              <div><dt className="text-gray-500">Status</dt><dd className="text-gray-900 font-medium">{propertyData.propertyStatus === 'evaluation' ? 'Evaluation' : 'Owned'}</dd></div>
              <div className="md:col-span-2"><dt className="text-gray-500">Address</dt><dd className="text-gray-900 font-medium">{`${propertyData.address}, ${propertyData.city}, ${propertyData.state} ${propertyData.zip}`}</dd></div>
              <div><dt className="text-gray-500">Portfolio/Folder</dt><dd className="text-gray-900 font-medium">{propertyData.portfolio || 'N/A'}</dd></div>
            </dl>
          </div>

          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Financial Information</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
               <div><dt className="text-gray-500">Acquisition Date</dt><dd className="text-gray-900 font-medium">{propertyData.acquisitionDate || 'N/A'}</dd></div>
               <div><dt className="text-gray-500">Acquisition Price</dt><dd className="text-gray-900 font-medium">{formatCurrency(propertyData.purchasePrice)}</dd></div>
               <div><dt className="text-gray-500">Market Value</dt><dd className="text-gray-900 font-medium">{formatCurrency(propertyData.currentValue)}</dd></div>
            </dl>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Uploaded Documents ({documents.length})</h2>
            {documents.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Document Name</th>
                      <th scope="col" className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th scope="col" className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Size</th>
                      <th scope="col" className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents.map(doc => (
                      <tr key={doc.id}>
                        <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{doc.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-500">{doc.category}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-500">{(doc.size / 1024).toFixed(1)} KB</td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-500">{new Date(doc.uploadDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No documents were uploaded in the previous step.</p>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
          <button 
            type="button" 
            onClick={() => router.back()} 
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-3"
          >
            Back
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Finish and View Property
          </button>
        </div>
      </div>
    </div>
  )
} 