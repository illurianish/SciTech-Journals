import React from 'react';

export default function FeaturePanels() {
  return (
    <section className="bg-gradient-to-b from-gray-100 to-gray-200 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Slogan */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How AriesView Enhances Your Investments</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          
          {/* Acquisition Screening Panel */}
          <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="bg-white rounded-xl overflow-hidden shadow-xl">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"></path>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white text-center">ACQUISITION SCREENING</h3>
              </div>
              <div className="p-8">
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <p className="font-medium text-gray-800">Automated ROI Analysis</p>
                  </div>
                  <p className="text-gray-600 text-sm pl-9">Instantly evaluate potential returns with our advanced algorithms</p>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <p className="font-medium text-gray-800">Market Benchmarking</p>
                  </div>
                  <p className="text-gray-600 text-sm pl-9">Compare properties against market standards</p>
                </div>
                
                <div>
                  <div className="flex items-center mb-3">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <p className="font-medium text-gray-800">Risk Assessment</p>
                  </div>
                  <p className="text-gray-600 text-sm pl-9">Comprehensive compliance and risk evaluation</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Due Diligence Panel */}
          <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="bg-white rounded-xl overflow-hidden shadow-xl">
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white text-center">DUE DILIGENCE</h3>
              </div>
              <div className="p-8">
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <div className="bg-indigo-100 p-2 rounded-full mr-3">
                      <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <p className="font-medium text-gray-800">AI-Powered Data Extraction</p>
                  </div>
                  <p className="text-gray-600 text-sm pl-9">Automatically extract key data from lease documents</p>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <div className="bg-indigo-100 p-2 rounded-full mr-3">
                      <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <p className="font-medium text-gray-800">Anomaly Detection</p>
                  </div>
                  <p className="text-gray-600 text-sm pl-9">Identify inconsistencies with audit trail reporting</p>
                </div>
                
                <div>
                  <div className="flex items-center mb-3">
                    <div className="bg-indigo-100 p-2 rounded-full mr-3">
                      <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <p className="font-medium text-gray-800">Scenario Modeling</p>
                  </div>
                  <p className="text-gray-600 text-sm pl-9">Simulate various risk scenarios for informed decisions</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Asset Management Panel */}
          <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="bg-white rounded-xl overflow-hidden shadow-xl">
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 7H7v6h6V7z" />
                      <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white text-center">ASSET MANAGEMENT</h3>
              </div>
              <div className="p-8">
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <p className="font-medium text-gray-800">Expense Tracking</p>
                  </div>
                  <p className="text-gray-600 text-sm pl-9">Monitor and benchmark property expenses</p>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <p className="font-medium text-gray-800">Compliance Monitoring</p>
                  </div>
                  <p className="text-gray-600 text-sm pl-9">Automated rent and lease compliance tracking</p>
                </div>
                
                <div>
                  <div className="flex items-center mb-3">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <p className="font-medium text-gray-800">Investor Relations</p>
                  </div>
                  <p className="text-gray-600 text-sm pl-9">Streamlined waterfall calculations and reporting</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
} 