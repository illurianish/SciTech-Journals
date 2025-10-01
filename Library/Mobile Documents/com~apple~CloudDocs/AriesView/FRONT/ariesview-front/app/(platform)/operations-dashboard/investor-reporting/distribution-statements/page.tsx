'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DistributionStatementsPage() {
  const [activeTab, setActiveTab] = useState('current');
  const [yearFilter, setYearFilter] = useState('2024');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [expandedStatement, setExpandedStatement] = useState<number | null>(null);
  
  // Sample distribution data
  const distributionData = [
    { 
      id: 1, 
      date: "Mar 15, 2024", 
      amount: "$12,500.00", 
      property: "Riverfront Towers", 
      type: "Quarterly Cash Flow",
      quarter: "Q1 2024",
      status: "Paid",
      details: {
        rentalIncome: "$350,000",
        operatingExpenses: "$187,500",
        netOperatingIncome: "$162,500",
        debtService: "$85,000",
        reservesCapex: "$25,000",
        netCashFlow: "$52,500",
        investorShare: "23.8%",
        investorDistribution: "$12,500",
        preferredReturn: "7%",
        performanceFee: "$1,250"
      }
    },
    { 
      id: 2, 
      date: "Feb 28, 2024", 
      amount: "$8,750.00", 
      property: "Westside Office Plaza", 
      type: "Monthly Cash Flow", 
      quarter: "Q1 2024",
      status: "Paid",
      details: {
        rentalIncome: "$225,000",
        operatingExpenses: "$135,000",
        netOperatingIncome: "$90,000",
        debtService: "$45,000",
        reservesCapex: "$10,000",
        netCashFlow: "$35,000",
        investorShare: "25%",
        investorDistribution: "$8,750",
        preferredReturn: "6.5%",
        performanceFee: "$875"
      }
    },
    { 
      id: 3, 
      date: "Jan 31, 2024", 
      amount: "$15,200.00", 
      property: "Parkview Apartments", 
      type: "Special Distribution", 
      quarter: "Q1 2024",
      status: "Paid",
      details: {
        rentalIncome: "$0",
        operatingExpenses: "$0",
        netOperatingIncome: "$0",
        debtService: "$0",
        reservesCapex: "$0",
        netCashFlow: "$0",
        investorShare: "19%",
        investorDistribution: "$15,200",
        preferredReturn: "N/A",
        performanceFee: "$0",
        notes: "Capital event distribution from refinancing"
      }
    },
    { 
      id: 4, 
      date: "Dec 15, 2023", 
      amount: "$13,200.00", 
      property: "Riverfront Towers", 
      type: "Quarterly Cash Flow", 
      quarter: "Q4 2023",
      status: "Paid",
      details: {
        rentalIncome: "$345,000",
        operatingExpenses: "$182,000",
        netOperatingIncome: "$163,000",
        debtService: "$85,000",
        reservesCapex: "$22,500",
        netCashFlow: "$55,500",
        investorShare: "23.8%",
        investorDistribution: "$13,200",
        preferredReturn: "7%",
        performanceFee: "$1,320"
      }
    },
    { 
      id: 5, 
      date: "Apr 15, 2024", 
      amount: "$9,800.00", 
      property: "Highland Retail Center", 
      type: "Quarterly Cash Flow", 
      quarter: "Q2 2024",
      status: "Scheduled",
      details: {
        rentalIncome: "$195,000",
        operatingExpenses: "$115,000",
        netOperatingIncome: "$80,000",
        debtService: "$40,000",
        reservesCapex: "$10,000",
        netCashFlow: "$30,000",
        investorShare: "32.7%",
        investorDistribution: "$9,800",
        preferredReturn: "6.8%",
        performanceFee: "$980"
      }
    }
  ];
  
  // Filter distributions based on current filters
  const filteredDistributions = distributionData.filter(item => {
    if (yearFilter !== 'all' && !item.date.includes(yearFilter)) return false;
    if (propertyFilter !== 'all' && item.property !== propertyFilter) return false;
    if (activeTab === 'current' && item.status !== 'Paid') return false;
    if (activeTab === 'scheduled' && item.status !== 'Scheduled') return false;
    return true;
  });
  
  // Calculate summary statistics
  const totalPaid = filteredDistributions
    .filter(item => item.status === 'Paid')
    .reduce((sum, item) => sum + parseFloat(item.amount.replace(/[$,]/g, '')), 0);
    
  const totalScheduled = filteredDistributions
    .filter(item => item.status === 'Scheduled')
    .reduce((sum, item) => sum + parseFloat(item.amount.replace(/[$,]/g, '')), 0);
  
  // Get unique properties for filter
  const properties = ['all', ...new Set(distributionData.map(item => item.property))];
  
  // Toggle expanded statement
  const toggleStatement = (id: number) => {
    if (expandedStatement === id) {
      setExpandedStatement(null);
    } else {
      setExpandedStatement(id);
    }
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Distribution Statements</h1>
          <p className="text-gray-600">View and manage your investment distributions and payment information</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Export All
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">
            Tax Documents
          </button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500">Total Distributions YTD</p>
          <p className="text-2xl font-semibold text-gray-900">${(totalPaid + totalScheduled).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500">Paid Distributions</p>
          <p className="text-2xl font-semibold text-green-600">${totalPaid.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500">Scheduled Distributions</p>
          <p className="text-2xl font-semibold text-blue-600">${totalScheduled.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500">Average Yield</p>
          <p className="text-2xl font-semibold text-gray-900">6.8%</p>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('all')}
            className={`${
              activeTab === 'all'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            All Distributions
          </button>
          <button
            onClick={() => setActiveTab('current')}
            className={`${
              activeTab === 'current'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Paid Distributions
          </button>
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`${
              activeTab === 'scheduled'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Scheduled Distributions
          </button>
        </nav>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label htmlFor="year-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <select
            id="year-filter"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="all">All Years</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="property-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Property
          </label>
          <select
            id="property-filter"
            value={propertyFilter}
            onChange={(e) => setPropertyFilter(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="all">All Properties</option>
            {properties.filter(p => p !== 'all').map((property, index) => (
              <option key={index} value={property}>{property}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Distributions List */}
      <div className="space-y-4">
        {filteredDistributions.length > 0 ? (
          filteredDistributions.map((distribution) => (
            <div key={distribution.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div 
                className="px-6 py-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleStatement(distribution.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900 mr-3">{distribution.property}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        distribution.status === 'Paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {distribution.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{distribution.type} - {distribution.quarter}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{distribution.amount}</p>
                    <p className="text-sm text-gray-500">{distribution.date}</p>
                  </div>
                  <div className="ml-4">
                    <svg 
                      className={`h-5 w-5 text-gray-400 transform transition-transform ${expandedStatement === distribution.id ? 'rotate-180' : ''}`} 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Expanded Statement Details */}
              {expandedStatement === distribution.id && (
                <div className="border-t border-gray-200 px-6 py-4">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Distribution Details</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Property Performance</h5>
                      <table className="min-w-full">
                        <tbody className="divide-y divide-gray-200">
                          <tr>
                            <td className="py-2 text-sm text-gray-500">Rental Income</td>
                            <td className="py-2 text-sm text-gray-900 text-right">{distribution.details.rentalIncome}</td>
                          </tr>
                          <tr>
                            <td className="py-2 text-sm text-gray-500">Operating Expenses</td>
                            <td className="py-2 text-sm text-gray-900 text-right">{distribution.details.operatingExpenses}</td>
                          </tr>
                          <tr>
                            <td className="py-2 text-sm font-medium text-gray-700">Net Operating Income</td>
                            <td className="py-2 text-sm font-medium text-gray-900 text-right">{distribution.details.netOperatingIncome}</td>
                          </tr>
                          <tr>
                            <td className="py-2 text-sm text-gray-500">Debt Service</td>
                            <td className="py-2 text-sm text-gray-900 text-right">{distribution.details.debtService}</td>
                          </tr>
                          <tr>
                            <td className="py-2 text-sm text-gray-500">Reserves/CapEx</td>
                            <td className="py-2 text-sm text-gray-900 text-right">{distribution.details.reservesCapex}</td>
                          </tr>
                          <tr>
                            <td className="py-2 text-sm font-medium text-gray-700">Net Cash Flow</td>
                            <td className="py-2 text-sm font-medium text-gray-900 text-right">{distribution.details.netCashFlow}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Investor Distribution</h5>
                      <table className="min-w-full">
                        <tbody className="divide-y divide-gray-200">
                          <tr>
                            <td className="py-2 text-sm text-gray-500">Investor Share</td>
                            <td className="py-2 text-sm text-gray-900 text-right">{distribution.details.investorShare}</td>
                          </tr>
                          <tr>
                            <td className="py-2 text-sm text-gray-500">Preferred Return</td>
                            <td className="py-2 text-sm text-gray-900 text-right">{distribution.details.preferredReturn}</td>
                          </tr>
                          <tr>
                            <td className="py-2 text-sm text-gray-500">Performance Fee</td>
                            <td className="py-2 text-sm text-gray-900 text-right">{distribution.details.performanceFee}</td>
                          </tr>
                          <tr>
                            <td className="py-2 text-sm font-medium text-gray-700">Investor Distribution</td>
                            <td className="py-2 text-sm font-medium text-gray-900 text-right">{distribution.amount}</td>
                          </tr>
                          {distribution.details.notes && (
                            <tr>
                              <td colSpan={2} className="py-2">
                                <p className="text-sm text-gray-500 mt-2">
                                  <span className="font-medium">Notes:</span> {distribution.details.notes}
                                </p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Download PDF
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">
                      View Full Statement
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-500">No distributions found matching the current filters.</p>
          </div>
        )}
      </div>
      
      {/* Payment Info Section */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Payment Method</h3>
            <div className="bg-white rounded-md p-4 border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Direct Deposit (ACH)</p>
                  <p className="text-sm text-gray-500">Bank of America - ****4567</p>
                </div>
              </div>
              <button className="mt-3 text-sm text-indigo-600 hover:text-indigo-700">Update Payment Method</button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Payment Schedule</h3>
            <div className="bg-white rounded-md p-4 border border-gray-200">
              <p className="text-sm text-gray-900 mb-1">Distributions are typically processed within 15 days after the end of each quarter.</p>
              <p className="text-sm text-gray-500">Next scheduled payment: April 15, 2024</p>
              <button className="mt-3 text-sm text-indigo-600 hover:text-indigo-700">View Distribution Calendar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 