'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function InvestorPortalPage() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Sample investor data
  const investor = {
    name: "Michael Thompson",
    email: "michael.thompson@example.com",
    accountNumber: "INV-20789",
    totalInvested: "$1,250,000",
    currentValue: "$1,487,500",
    totalReturns: "19%",
    joinDate: "May 12, 2022"
  };
  
  // Sample investments data
  const investments = [
    { 
      id: 1, 
      name: "Riverfront Towers", 
      type: "Multifamily", 
      invested: "$500,000", 
      currentValue: "$592,500", 
      returns: "18.5%", 
      distributions: "$42,500", 
      status: "Active"
    },
    { 
      id: 2, 
      name: "Westside Office Plaza", 
      type: "Office", 
      invested: "$350,000", 
      currentValue: "$385,000", 
      returns: "10%", 
      distributions: "$28,000", 
      status: "Active"
    },
    { 
      id: 3, 
      name: "Highland Retail Center", 
      type: "Retail", 
      invested: "$400,000", 
      currentValue: "$510,000", 
      returns: "27.5%", 
      distributions: "$36,000", 
      status: "Active"
    }
  ];
  
  // Sample documents
  const documents = [
    { id: 1, name: "Subscription Agreement - Riverfront Towers", type: "Legal", date: "May 12, 2022", category: "Investment Docs" },
    { id: 2, name: "Operating Agreement - Riverfront Towers", type: "Legal", date: "May 12, 2022", category: "Investment Docs" },
    { id: 3, name: "Q1 2024 Investor Statement", type: "Financial", date: "Apr 15, 2024", category: "Statements" },
    { id: 4, name: "Q4 2023 Investor Statement", type: "Financial", date: "Jan 15, 2024", category: "Statements" },
    { id: 5, name: "2023 K-1 Tax Document", type: "Tax", date: "Mar 20, 2024", category: "Tax Documents" },
    { id: 6, name: "Subscription Agreement - Westside Office Plaza", type: "Legal", date: "Aug 7, 2022", category: "Investment Docs" },
    { id: 7, name: "Operating Agreement - Westside Office Plaza", type: "Legal", date: "Aug 7, 2022", category: "Investment Docs" },
    { id: 8, name: "Subscription Agreement - Highland Retail Center", type: "Legal", date: "Nov 22, 2022", category: "Investment Docs" },
    { id: 9, name: "Operating Agreement - Highland Retail Center", type: "Legal", date: "Nov 22, 2022", category: "Investment Docs" }
  ];
  
  // Sample messages and updates
  const messages = [
    { id: 1, title: "Q1 2024 Distribution Notice", date: "Apr 1, 2024", read: true, summary: "Your Q1 2024 distribution has been processed and will be deposited on Apr 15, 2024." },
    { id: 2, title: "Riverfront Towers - Annual Investor Update", date: "Mar 25, 2024", read: true, summary: "Annual update on property performance, local market trends, and projections for the coming year." },
    { id: 3, title: "Tax Documents Available", date: "Mar 20, 2024", read: false, summary: "Your 2023 K-1 tax documents are now available in your investor portal." },
    { id: 4, title: "Westside Office Plaza - New Tenant Announcement", date: "Feb 12, 2024", read: false, summary: "We're pleased to announce the signing of a new 10-year lease with TechCorp Inc." },
    { id: 5, title: "Highland Retail Center - Capital Improvement Update", date: "Jan 30, 2024", read: true, summary: "Update on the facade renovation project and its impact on property value." }
  ];
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investor Portal</h1>
          <p className="text-gray-600">Your personalized investment dashboard</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Export Data
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">
            Schedule Meeting
          </button>
        </div>
      </div>
      
      {/* Investor Overview Card */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{investor.name}</h2>
            <p className="text-sm text-gray-500">Account: {investor.accountNumber} | Joined: {investor.joinDate}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Active Investor
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Total Invested</p>
            <p className="text-xl font-semibold text-gray-900">{investor.totalInvested}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Current Value</p>
            <p className="text-xl font-semibold text-gray-900">{investor.currentValue}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Total Return</p>
            <p className="text-xl font-semibold text-green-600">{investor.totalReturns}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Properties</p>
            <p className="text-xl font-semibold text-gray-900">{investments.length}</p>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Portfolio Overview
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`${
              activeTab === 'documents'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Documents
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`${
              activeTab === 'messages'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm relative`}
          >
            Messages & Updates
            {messages.filter(m => !m.read).length > 0 && (
              <span className="absolute top-3 -right-2 h-5 w-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">
                {messages.filter(m => !m.read).length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`${
              activeTab === 'settings'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Account Settings
          </button>
        </nav>
      </div>
      
      {/* Portfolio Overview Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Your Investments</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invested</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distributions</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {investments.map((investment) => (
                    <tr key={investment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{investment.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{investment.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{investment.invested}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{investment.currentValue}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{investment.returns}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{investment.distributions}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {investment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href="#" className="text-indigo-600 hover:text-indigo-900">View Details</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Distributions</h3>
            </div>
            <div className="p-6">
              {/* Chart placeholder */}
              <div className="bg-gray-100 rounded-lg h-80 flex items-center justify-center mb-4">
                <p className="text-gray-500">Distribution History Chart</p>
              </div>
              
              <div className="mt-4 flex justify-center">
                <Link href="/operations-dashboard/investor-reporting/distribution-statements" className="text-indigo-600 hover:text-indigo-900">
                  View All Distribution Statements →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Documents Content */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Documents & Statements</h3>
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {documents.map((doc) => (
                    <tr key={doc.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-4">View</button>
                        <button className="text-indigo-600 hover:text-indigo-900">Download</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Showing {documents.length} documents</p>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">Previous</button>
                  <button className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">Next</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Messages Content */}
      {activeTab === 'messages' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Messages & Updates</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {messages.map((message) => (
                <div key={message.id} className={`p-6 ${message.read ? 'bg-white' : 'bg-indigo-50'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-base font-medium text-gray-900 flex items-center">
                        {!message.read && (
                          <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                        )}
                        {message.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">{message.date}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-indigo-600 text-sm hover:text-indigo-900">
                        Mark as {message.read ? 'Unread' : 'Read'}
                      </button>
                      <button 
                        className="text-gray-400 hover:text-gray-500"
                        aria-label="Message options"
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">{message.summary}</p>
                  <div className="mt-4">
                    <button className="text-sm text-indigo-600 hover:text-indigo-900">Read More</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Account Settings Content */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Account Settings</h3>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={investor.name}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                      />
                      <p className="mt-1 text-xs text-gray-500">Contact your account manager to update your name</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={investor.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Communication Preferences</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        id="email-distributions"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        defaultChecked
                        aria-label="Receive email notifications for distributions"
                      />
                      <label htmlFor="email-distributions" className="ml-3 text-sm text-gray-700">
                        Email notifications for distributions
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="email-reports"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        defaultChecked
                        aria-label="Receive email notifications for new reports and statements"
                      />
                      <label htmlFor="email-reports" className="ml-3 text-sm text-gray-700">
                        Email notifications for new reports and statements
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="email-updates"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        defaultChecked
                        aria-label="Receive email notifications for property updates"
                      />
                      <label htmlFor="email-updates" className="ml-3 text-sm text-gray-700">
                        Email notifications for property updates
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="email-newsletters"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        aria-label="Receive company newsletters and announcements"
                      />
                      <label htmlFor="email-newsletters" className="ml-3 text-sm text-gray-700">
                        Company newsletters and announcements
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Account Security</h4>
                  <div className="space-y-4">
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Change Password
                    </button>
                    <div className="flex items-center">
                      <input
                        id="two-factor"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        aria-label="Enable two-factor authentication"
                      />
                      <label htmlFor="two-factor" className="ml-3 text-sm text-gray-700">
                        Enable two-factor authentication
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 