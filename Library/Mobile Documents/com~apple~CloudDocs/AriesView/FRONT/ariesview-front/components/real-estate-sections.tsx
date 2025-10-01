'use client'

import React from 'react';
import Image from 'next/image';
import FaqAccordion from './FaqAccordion';

export default function RealEstateSections() {
  // FAQ data for the Individual Investors section
  const investorFaqs = [
    {
      question: "What is AriesView?",
      answer: "AriesView is a private AI solution that helps real estate companies make sense of their internal documents and financial data. Our platform automates analysis of your portfolio information, extracts key insights, and creates an executive view to support strategic decision-making."
    },
    {
      question: "How does AriesView handle our document analysis needs?",
      answer: "Our AI analyzes your lease agreements, financial statements, and property documents to extract critical information, identify patterns, and build a comprehensive view of your portfolio. Unlike solutions that rely on public APIs, we process your proprietary documents to provide insights unique to your operations."
    },
    {
      question: "What financial insights can we gain through AriesView?",
      answer: "AriesView helps you understand key metrics like rent distributions across your portfolio, tenant concentrations, lease expiration timelines, and scenarios for how interest rate changes would impact your NOI. We transform your internal financial data into actionable intelligence."
    },
    {
      question: "How does AriesView support operational decision-making?",
      answer: "The platform adapts to your specific CRE portfolio needs, analyzing your data to support various business rules you define. For example, you might need to enforce tenant mix policies, evaluate potential conflicts with existing non-compete clauses, analyze rent optimization against market rates, assess sustainability metrics, or track lease expiration clustering. You can interact with the AI to explore 'what-if' scenarios and understand the financial implications of different choices."
    },
    {
      question: "Can AriesView integrate with our existing systems without exposing our data?",
      answer: "Yes, AriesView is designed as a private solution that connects securely with your internal systems. We don't rely on or share your data with external APIs. Your proprietary information remains within your control while gaining the benefits of AI-powered analytics."
    }
  ];

  return (
    <section className="bg-gray-50 pt-10 pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        
        {/* Product Cards Section */}
        <div className="mb-16 bg-white p-10 rounded-xl shadow-md">
          <h2 className="text-3xl font-bold text-[#001A41] mb-8 text-center">Our Real Estate AI Solutions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Acquisition Screening Card */}
            <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-[#001A41] rounded-lg flex items-center justify-center w-full mb-4" style={{ height: "180px" }}>
                <div className="text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    {/* Building with magnifying glass */}
                    <path d="M3 21h18"></path> 
                    <path d="M5 21V7l5-4 5 4v14"></path>
                    <path d="M9 21v-6h2v6"></path>
                    <path d="M7 9h6"></path>
                    <path d="M7 12h6"></path>
                    <circle cx="18" cy="16" r="3"></circle>
                    <path d="M20.5 18.5l1.5 1.5"></path>
                  </svg>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mt-6">Acquisition Screening</h3>
              
              <p className="mt-4 text-gray-600 text-center">
                {/* Removed: Automated ROI Analysis & Market Benchmarking. Initial Risk & Compliance Assessment. */}
              </p>
              
              <a 
                href="/solutions/acquisition-screening" 
                className="mt-6 inline-block rounded-lg bg-[#001A41] px-6 py-3 text-center text-base font-semibold text-white shadow-md transition duration-300 ease-in-out hover:bg-[#0e2b5c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#001A41]"
              >
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
            
            {/* Due Diligence Card */}
            <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-[#001A41] rounded-lg flex items-center justify-center w-full mb-4" style={{ height: "180px" }}>
                <div className="text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    {/* Magnifying glass with document */}
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <path d="M14 2v6h6"></path>
                    <path d="M16 13H8"></path>
                    <path d="M16 17H8"></path>
                    <path d="M10 9H8"></path>
                    <circle cx="17" cy="15" r="3"></circle>
                    <path d="M21 19l-2.5-2.5"></path>
                  </svg>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mt-6">Due Diligence</h3>
              
              <p className="mt-4 text-gray-600 text-center">
                {/* Removed: AI-Powered Lease Data Extraction. Anomaly Detection & Audit Trail Reporting. Risk Analysis & Scenario Modelling. */}
              </p>
              
              <a 
                href="/solutions/due-diligence" 
                className="mt-6 inline-block rounded-lg bg-[#001A41] px-6 py-3 text-center text-base font-semibold text-white shadow-md transition duration-300 ease-in-out hover:bg-[#0e2b5c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#001A41]"
              >
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
            
            {/* Asset Management Card */}
            <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-[#001A41] rounded-lg flex items-center justify-center w-full mb-4" style={{ height: "180px" }}>
                <div className="text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    {/* Simple building columns icon */}
                    <path d="M3 21h18"></path>
                    <path d="M5 21v-10h3v10"></path>
                    <path d="M11 21v-14h3v14"></path>
                    <path d="M17 21v-8h3v8"></path>
                  </svg>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mt-6">Asset Management</h3>
              
              <p className="mt-4 text-gray-600 text-center">
                {/* Removed: Expense Tracking & Benchmarking. Automated Rent & Lease Compliance Monitoring. Investor Relations & Waterfall Calculations. */}
              </p>
              
              <a 
                href="/solutions/asset-management" 
                className="mt-6 inline-block rounded-lg bg-[#001A41] px-6 py-3 text-center text-base font-semibold text-white shadow-md transition duration-300 ease-in-out hover:bg-[#0e2b5c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#001A41]"
              >
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
        
        {/* Empower Your Real Estate Team with Intelligence */}
        <div className="mb-16 bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-8 rounded-xl shadow-md">
          <h2 className="text-3xl font-bold text-[#001A41] mb-10 text-center">
            Empower Your Real Estate Team with Intelligence
          </h2>
          
          <div className="flex flex-col gap-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex-shrink-0 mb-4">
                  <div className="w-14 h-14 flex items-center justify-center text-[#001A41] bg-blue-50 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      <line x1="7" y1="15" x2="7" y2="15.01"></line>
                      <line x1="11" y1="15" x2="11" y2="15.01"></line>
                      <line x1="15" y1="15" x2="15" y2="15.01"></line>
                      <line x1="7" y1="19" x2="7" y2="19.01"></line>
                      <line x1="11" y1="19" x2="11" y2="19.01"></line>
                      <line x1="15" y1="19" x2="15" y2="19.01"></line>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#001A41] mb-3">Unify and Secure Property Data</h3>
                  <p className="text-gray-600">
                    Bring together leases, financials, and operations into a single intelligent system for a complete view of your portfolio.
                  </p>
                </div>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex-shrink-0 mb-4">
                  <div className="w-14 h-14 flex items-center justify-center text-[#001A41] bg-blue-50 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                      <path d="M5 3 L7 7"></path>
                      <path d="M17 3 L15 7"></path>
                      <path d="M5 21 L7 17"></path>
                      <path d="M17 21 L15 17"></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#001A41] mb-3">Optimize Operations</h3>
                  <p className="text-gray-600">
                    Use AI recommendations to reduce costs, improve lease terms, and increase property performance.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex-shrink-0 mb-4">
                  <div className="w-14 h-14 flex items-center justify-center text-[#001A41] bg-blue-50 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <line x1="18" y1="20" x2="18" y2="10"></line>
                      <line x1="12" y1="20" x2="12" y2="4"></line>
                      <line x1="6" y1="20" x2="6" y2="14"></line>
                      <line x1="3" y1="20" x2="21" y2="20"></line>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#001A41] mb-3">Boost Asset Performance</h3>
                  <p className="text-gray-600">
                    Unlock deeper insights from historical data and trends to improve NOI and drive long-term value.
                  </p>
                </div>
              </div>
              
              {/* Feature 4 */}
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex-shrink-0 mb-4">
                  <div className="w-14 h-14 flex items-center justify-center text-[#001A41] bg-blue-50 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M22 2L11 13"></path>
                      <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#001A41] mb-3">Accelerate Decision Making</h3>
                  <p className="text-gray-600">
                    Model outcomes and make portfolio-level decisions faster using context-aware AI and scenario simulation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Real Estate Private Equity & Syndicators */}
        <div className="mb-16 bg-white py-16 px-8 rounded-xl shadow-md">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-start">
            <div>
              <h2 className="text-3xl font-bold text-[#001A41] mb-4">Real Estate Private Equity & Syndicators</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Scale your real estate investment operations with institutional-grade tools for fund management and LP relations. Our platform streamlines property due diligence, automates waterfall calculations, and provides comprehensive risk analysis for large-scale real estate acquisitions and portfolio management.
              </p>
              <div className="mb-4">
                <a href="/private-equity" className="text-blue-600 font-semibold text-lg inline-flex items-center py-2 px-4 rounded-md hover:bg-blue-50 transition-colors duration-300 group">
                  Learn more
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                    <path className="fill-current" d="M6.602 11l-.875-.864L9.33 6.534H0v-1.25h9.33L5.727 1.693l.875-.875 5.091 5.091z" />
                  </svg>
                </a>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span>Fund Management</span>
                <span>•</span>
                <span>LP Relations</span>
                <span>•</span>
                <span>Waterfall Calculations</span>
                <span>•</span>
                <span>Risk Analysis</span>
              </div>
            </div>
            <div className="relative h-[400px] w-full rounded-xl overflow-hidden group">
              <div className="absolute inset-0 bg-blue-900 opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-10"></div>
              <Image
                src="/images/pe-dashboard.jpg"
                fill
                style={{ objectFit: 'cover' }}
                alt="Private Equity Dashboard"
                className="rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
        
        {/* Real Estate Asset Managers */}
        <div className="mb-16 bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-8 rounded-xl shadow-md">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-start">
            <div className="order-2 md:order-1 relative h-[400px] w-full rounded-xl overflow-hidden group">
              <div className="absolute inset-0 bg-blue-900 opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-10"></div>
              <Image
                src="/images/asset-management.jpg"
                fill
                style={{ objectFit: 'cover' }}
                alt="Asset Management Dashboard"
                className="rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold text-[#001A41] mb-4">Real Estate Asset Managers</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Optimize your real estate portfolio's operational performance with real-time monitoring and analytics. Track property expenses, ensure lease compliance, and leverage market benchmarking to make data-driven decisions that maximize asset value and minimize risk.
              </p>
              <div className="mb-4">
                <a href="/asset-managers" className="text-blue-600 font-semibold text-lg inline-flex items-center py-2 px-4 rounded-md hover:bg-blue-50 transition-colors duration-300 group">
                  Learn more
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                    <path className="fill-current" d="M6.602 11l-.875-.864L9.33 6.534H0v-1.25h9.33L5.727 1.693l.875-.875 5.091 5.091z" />
                  </svg>
                </a>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span>Expense Tracking</span>
                <span>•</span>
                <span>Lease Compliance</span>
                <span>•</span>
                <span>Performance Analytics</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Real Estate Individual Investors */}
        <div className="mb-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-start bg-white py-16 px-8 rounded-xl shadow-md">
            <div>
              <h2 className="text-3xl font-bold text-[#001A41] mb-4">Real Estate Individual Investors</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Make confident real estate investment decisions with professional-grade tools scaled for individual portfolios. Efficiently screen property acquisitions, analyze ROI potential, and manage properties with automated systems that save time and reduce complexity.
              </p>
              <div className="mb-4">
                <a href="/individual-investors" className="text-blue-600 font-semibold text-lg inline-flex items-center py-2 px-4 rounded-md hover:bg-blue-50 transition-colors duration-300 group">
                  Learn more
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                    <path className="fill-current" d="M6.602 11l-.875-.864L9.33 6.534H0v-1.25h9.33L5.727 1.693l.875-.875 5.091 5.091z" />
                  </svg>
                </a>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span>Deal Screening</span>
                <span>•</span>
                <span>ROI Analysis</span>
                <span>•</span>
                <span>Cash Flow Forecasting</span>
              </div>
            </div>
            <div className="relative h-[400px] w-full rounded-xl overflow-hidden group">
              <div className="absolute inset-0 bg-blue-900 opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-10"></div>
              <Image
                src="/images/investor-dashboard.jpg"
                fill
                style={{ objectFit: 'cover' }}
                alt="Investor Dashboard"
                className="rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
          
          {/* Why choose AriesView section */}
          <div className="my-16 bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-8 rounded-xl shadow-md">
            <h2 className="text-3xl font-bold text-[#001A41] mb-12 text-center">Why choose AriesView</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1: Re-styled */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-[#001A41]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-[#001A41] mb-3 text-center">Comprehensive Property Dashboard</h3>
                <p className="text-gray-600 text-sm text-center">
                  Monitor your entire portfolio with at-a-glance metrics. Track occupancy rates, financial performance, and property status from a centralized operations dashboard.
                </p>
              </div>
              
              {/* Feature 2: Re-styled */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-center mb-4">
                   <div className="bg-blue-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-[#001A41]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-[#001A41] mb-3 text-center">Intelligent Document Management</h3>
                <p className="text-gray-600 text-sm text-center">
                  Manage all property documents with AI-powered insights. Extract key information from leases, financial statements, and contracts with automated document analysis.
                </p>
              </div>
              
              {/* Feature 3: Re-styled */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                 <div className="flex justify-center mb-4">
                   <div className="bg-blue-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-[#001A41]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-[#001A41] mb-3 text-center">AI-Powered Financial Analysis</h3>
                <p className="text-gray-600 text-sm text-center">
                  Leverage AriesView's AI to automatically analyze property financials, track NOI, calculate ROI, and generate financial projections with our comprehensive financial hub.
                </p>
              </div>
            </div>
          </div>
          
          {/* FAQs section */}
          <div className="bg-white py-16 px-8 rounded-xl shadow-md">
            <h2 className="text-3xl font-bold text-[#001A41] mb-10 text-center">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto">
              <FaqAccordion faqs={investorFaqs} />
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
} 