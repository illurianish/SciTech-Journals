'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePropertyForm } from '../PropertyFormContext'

export default function ProcessingPage() {
  const router = useRouter()
  const { state: contextState } = usePropertyForm()
  const { propertyData, documents } = contextState

  const [processingStage, setProcessingStage] = useState(documents?.length > 0 ? 1 : 5)
  const [processingComplete, setProcessingComplete] = useState(documents?.length === 0)
  const [processingError, setProcessingError] = useState<string | null>(null)
  
  useEffect(() => {
    if (!propertyData) {
      console.warn('Property data missing in context, redirecting.')
      router.push('/operations-dashboard/properties/add')
      return
    }

    if (documents && documents.length > 0 && !processingComplete) {
      const stageTimers = [
        setTimeout(() => setProcessingStage(2), 2000),
        setTimeout(() => setProcessingStage(3), 4000),
        setTimeout(() => setProcessingStage(4), 6000),
        setTimeout(() => {
          setProcessingStage(5)
          setProcessingComplete(true)
        }, 8000)
      ]

      return () => {
        stageTimers.forEach(timer => clearTimeout(timer))
      }
    }
  }, [propertyData, documents, router, processingComplete])
  
  const handleContinue = () => {
    if (processingComplete) {
      router.push('/operations-dashboard/properties/add/review')
    }
  }
  
  if (!propertyData) {
    return <div className="min-h-screen bg-gray-50 flex justify-center items-center">Loading or Redirecting...</div>
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-[#0066cc]">{documents?.length > 0 ? 'Processing Documents' : 'Preparing Review'}</h1>
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
                <div className="w-10 h-10 rounded-full bg-[#0066cc] text-white flex items-center justify-center font-bold">5</div>
                <div className="mt-2 text-sm font-medium text-[#0066cc]">Processing</div>
              </div>
              <div className="flex-grow h-0.5 bg-gray-200 mx-4"></div>
              <div className="relative flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold">6</div>
                <div className="mt-2 text-sm font-medium text-gray-500">Review</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-1 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Property Summary</h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Property Name</p>
                <p className="font-medium">{propertyData.propertyName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Property Type</p>
                <p className="font-medium">{propertyData.propertyType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{propertyData.address}, {propertyData.city}, {propertyData.state} {propertyData.zip}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">
                  {propertyData.propertyStatus === 'evaluation' 
                    ? 'New Property for Evaluation' 
                    : 'Existing Owned Property'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Portfolio/Folder</p>
                <p className="font-medium">
                  {propertyData.portfolio ? propertyData.portfolio : 'Not assigned'}
                </p>
              </div>
              {propertyData.tags && propertyData.tags.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500">Tags</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {propertyData.tags?.map((tag, index) => (
                      <span key={index} className="bg-gray-100 rounded-full px-2 py-0.5 text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="md:col-span-2 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {documents?.length > 0 ? 'Document Processing Status' : 'No Documents to Process'}
            </h2>
            
            {processingError ? (
              <div className="bg-red-50 p-4 rounded-md border border-red-100 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error Processing Documents</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{processingError}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : documents?.length > 0 ? (
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">OCR Document Processing</p>
                    <span className={`text-sm px-2 py-1 rounded-full ${processingStage >= 2 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {processingStage >= 2 ? 'Complete' : 'In Progress'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div 
                      className="bg-[#0066cc] h-2 rounded-full transition-all duration-500" 
                      style={{ width: processingStage >= 2 ? '100%' : '60%' }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Data Extraction</p>
                    <span className={`text-sm px-2 py-1 rounded-full ${processingStage >= 3 ? 'bg-green-100 text-green-800' : processingStage >= 2 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'}`}>
                      {processingStage >= 3 ? 'Complete' : processingStage >= 2 ? 'In Progress' : 'Pending'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div 
                      className="bg-[#0066cc] h-2 rounded-full transition-all duration-500" 
                      style={{ width: processingStage >= 3 ? '100%' : processingStage >= 2 ? '50%' : '0%' }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Financial Analysis</p>
                    <span className={`text-sm px-2 py-1 rounded-full ${processingStage >= 4 ? 'bg-green-100 text-green-800' : processingStage >= 3 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'}`}>
                      {processingStage >= 4 ? 'Complete' : processingStage >= 3 ? 'In Progress' : 'Pending'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div 
                      className="bg-[#0066cc] h-2 rounded-full transition-all duration-500" 
                      style={{ width: processingStage >= 4 ? '100%' : processingStage >= 3 ? '70%' : '0%' }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Report Generation</p>
                    <span className={`text-sm px-2 py-1 rounded-full ${processingStage >= 5 ? 'bg-green-100 text-green-800' : processingStage >= 4 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'}`}>
                      {processingStage >= 5 ? 'Complete' : processingStage >= 4 ? 'In Progress' : 'Pending'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div 
                      className="bg-[#0066cc] h-2 rounded-full transition-all duration-500" 
                      style={{ width: processingStage >= 5 ? '100%' : processingStage >= 4 ? '40%' : '0%' }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 italic">Skipping document processing steps.</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <Link 
            href="/operations-dashboard/properties/add/page4" 
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back to Unit Level Details
          </Link>
          <button
            type="button"
            onClick={handleContinue}
            disabled={!processingComplete}
            className={`px-6 py-2 rounded-md text-white ${processingComplete ? 'bg-[#0066cc] hover:bg-[#0055aa]' : 'bg-gray-300 cursor-not-allowed'}`}
          >
            {processingComplete ? 'Continue to Review' : 'Processing...'}
          </button>
        </div>
      </div>
    </div>
  )
} 