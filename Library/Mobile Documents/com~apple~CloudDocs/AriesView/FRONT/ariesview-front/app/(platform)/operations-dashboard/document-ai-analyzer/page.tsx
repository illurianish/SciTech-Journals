'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/Sidebar'

export default function DocumentAIAnalyzer() {
  const [showSidebar, setShowSidebar] = useState(true)
  const [activeTab, setActiveTab] = useState('upload')
  const router = useRouter();
  
  // Handle navigation from sidebar
  const handleProfileClick = () => {
    router.push('/operations-dashboard?view=profile');
  };

  const handleSettingsClick = () => {
    router.push('/operations-dashboard?view=settings');
  };

  const handleDashboardClick = () => {
    router.push('/operations-dashboard');
  };
  
  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      {showSidebar && (
        <Sidebar 
          currentPath="/operations-dashboard/document-ai-analyzer"
          onProfileClick={handleProfileClick}
          onSettingsClick={handleSettingsClick}
          onDashboardClick={handleDashboardClick}
        />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="px-6 py-4 bg-white shadow">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  aria-label="Toggle sidebar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <h1 className="text-2xl font-semibold text-gray-900">Document AI Analyzer</h1>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setActiveTab('upload')}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === 'upload' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  Upload Document
                </button>
                <button 
                  onClick={() => setActiveTab('batch')}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === 'batch' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  Batch Process
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white p-4 rounded-md shadow">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Lease Documents</h2>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    +8.3%
                  </span>
                </div>
                <p className="mt-2 text-3xl font-semibold text-gray-900">243</p>
                <p className="mt-1 text-sm text-gray-500">Total lease documents processed</p>
              </div>
              <div className="bg-white p-4 rounded-md shadow">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Pending Analysis</h2>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                    12 new
                  </span>
                </div>
                <p className="mt-2 text-3xl font-semibold text-gray-900">18</p>
                <p className="mt-1 text-sm text-gray-500">Documents waiting for processing</p>
              </div>
              <div className="bg-white p-4 rounded-md shadow">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Key Terms Extracted</h2>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    +15.2%
                  </span>
                </div>
                <p className="mt-2 text-3xl font-semibold text-gray-900">4,892</p>
                <p className="mt-1 text-sm text-gray-500">Lease terms automatically identified</p>
              </div>
              <div className="bg-white p-4 rounded-md shadow">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Time Saved</h2>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    Efficiency
                  </span>
                </div>
                <p className="mt-2 text-3xl font-semibold text-gray-900">486 hrs</p>
                <p className="mt-1 text-sm text-gray-500">Compared to manual extraction</p>
              </div>
            </div>

            {activeTab === 'upload' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-md shadow">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-900">Upload Lease Document</h2>
                    </div>
                    <div className="p-4">
                      <div className="mb-6 border-2 border-dashed border-gray-300 rounded-md py-12 px-6 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">Drag and drop your document here, or</p>
                          <label className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                            <span>Browse Files</span>
                            <input type="file" className="sr-only" />
                          </label>
                        </div>
                        <p className="mt-2 text-xs text-gray-500">PDF, DOCX, or TXT up to 20MB</p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Document Type</label>
                          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" aria-label="Select document type">
                            <option>Lease Agreement</option>
                            <option>Lease Abstract</option>
                            <option>Amendment</option>
                            <option>Renewal</option>
                            <option>Estoppel Certificate</option>
                            <option>SNDA</option>
                            <option>Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Property Name</label>
                          <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="E.g., Highland Towers" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Analysis Priority</label>
                          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" aria-label="Select analysis priority">
                            <option>Standard (24 hours)</option>
                            <option>High (8 hours)</option>
                            <option>Urgent (4 hours)</option>
                          </select>
                        </div>
                        <div className="flex justify-end pt-4">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            Start Analysis
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="bg-white rounded-md shadow">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-900">Recently Analyzed Documents</h2>
                    </div>
                    <div className="p-4">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Document
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Property
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Analysis Date
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Key Terms Found
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center text-blue-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">Highland_Towers_Lease.pdf</div>
                                    <div className="text-xs text-gray-500">Lease Agreement</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">Highland Towers</div>
                                <div className="text-xs text-gray-500">New York, NY</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">Oct 15, 2023</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">28</div>
                                <div className="text-xs text-green-600">100% confidence</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button className="text-blue-600 hover:text-blue-900 mr-3">View Analysis</button>
                                <button className="text-blue-600 hover:text-blue-900">PDF</button>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-md flex items-center justify-center text-green-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">Riverside_Amendment_2.pdf</div>
                                    <div className="text-xs text-gray-500">Amendment</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">Riverside Apartments</div>
                                <div className="text-xs text-gray-500">Chicago, IL</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">Oct 12, 2023</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">14</div>
                                <div className="text-xs text-yellow-600">92% confidence</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button className="text-blue-600 hover:text-blue-900 mr-3">View Analysis</button>
                                <button className="text-blue-600 hover:text-blue-900">PDF</button>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-md flex items-center justify-center text-purple-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">Sunset_Plaza_Abstract.docx</div>
                                    <div className="text-xs text-gray-500">Lease Abstract</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">Sunset Plaza</div>
                                <div className="text-xs text-gray-500">Los Angeles, CA</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">Oct 10, 2023</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">22</div>
                                <div className="text-xs text-green-600">98% confidence</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button className="text-blue-600 hover:text-blue-900 mr-3">View Analysis</button>
                                <button className="text-blue-600 hover:text-blue-900">PDF</button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-md shadow">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Batch Document Processing</h2>
                </div>
                <div className="p-4">
                  <div className="mb-6 border-2 border-dashed border-gray-300 rounded-md py-12 px-6 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Drag and drop multiple documents here, or</p>
                      <label className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                        <span>Browse Folder</span>
                        <input 
                          type="file" 
                          multiple
                          className="sr-only"
                          onChange={(e) => {
                            // Handle directory selection
                            const files = e.target.files;
                            if (files && files.length > 0) {
                              // Process files
                            }
                          }}
                        />
                      </label>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">Up to 100 documents at once, maximum 500MB total</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Batch Name</label>
                      <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="E.g., October Leases" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Property Portfolio</label>
                      <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" aria-label="Select property portfolio">
                        <option>All Properties</option>
                        <option>East Coast Portfolio</option>
                        <option>West Coast Portfolio</option>
                        <option>Midwest Portfolio</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Document Types to Extract</label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center">
                          <input id="lease-terms" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
                          <label htmlFor="lease-terms" className="ml-2 block text-sm text-gray-700">Lease Terms</label>
                        </div>
                        <div className="flex items-center">
                          <input id="rent-schedules" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
                          <label htmlFor="rent-schedules" className="ml-2 block text-sm text-gray-700">Rent Schedules</label>
                        </div>
                        <div className="flex items-center">
                          <input id="key-dates" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
                          <label htmlFor="key-dates" className="ml-2 block text-sm text-gray-700">Key Dates</label>
                        </div>
                        <div className="flex items-center">
                          <input id="tenant-info" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
                          <label htmlFor="tenant-info" className="ml-2 block text-sm text-gray-700">Tenant Information</label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Output Format</label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center">
                          <input id="structured-data" name="format" type="radio" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" defaultChecked />
                          <label htmlFor="structured-data" className="ml-2 block text-sm text-gray-700">Structured Data (Excel/CSV)</label>
                        </div>
                        <div className="flex items-center">
                          <input id="pdf-report" name="format" type="radio" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                          <label htmlFor="pdf-report" className="ml-2 block text-sm text-gray-700">PDF Report</label>
                        </div>
                        <div className="flex items-center">
                          <input id="system-import" name="format" type="radio" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                          <label htmlFor="system-import" className="ml-2 block text-sm text-gray-700">Direct System Import</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-6">
                    <button className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-3">
                      Save as Template
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      Process Batch
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 bg-white rounded-md shadow">
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Lease Term Extraction Accuracy</h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">Rent Terms</h3>
                      <span className="text-green-600 text-sm font-medium">98.7%</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '98.7%' }}></div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">Lease Dates</h3>
                      <span className="text-green-600 text-sm font-medium">99.2%</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '99.2%' }}></div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">Options & Rights</h3>
                      <span className="text-yellow-600 text-sm font-medium">92.4%</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-yellow-600 h-1.5 rounded-full" style={{ width: '92.4%' }}></div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">Legal Clauses</h3>
                      <span className="text-yellow-600 text-sm font-medium">91.8%</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-yellow-600 h-1.5 rounded-full" style={{ width: '91.8%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-sm text-center">
                    AI model performance continues to improve with each document analyzed.<br />
                    <span className="font-medium">Last model update: October 14, 2023</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 