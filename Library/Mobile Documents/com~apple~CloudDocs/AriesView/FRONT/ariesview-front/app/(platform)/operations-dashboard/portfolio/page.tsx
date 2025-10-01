'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface PropertySummary {
  id: string;
  name: string;
  address: string;
  type: string;
  value: string;
  occupancy: string;
  roi: string;
  status: 'performing' | 'underperforming' | 'at-risk';
}

export default function PortfolioOverviewPage() {
  const [properties, setProperties] = useState<PropertySummary[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would be fetched from an API
    // For now, create some mock data
    setTimeout(() => {
      setProperties([
        {
          id: '1',
          name: 'Oakwood Apartments',
          address: '123 Main St, San Francisco, CA 94105',
          type: 'Multifamily',
          value: '$4,500,000',
          occupancy: '92%',
          roi: '7.8%',
          status: 'performing'
        },
        {
          id: '2',
          name: 'Parkside Plaza',
          address: '456 Commerce Way, San Francisco, CA 94107',
          type: 'Retail Mall',
          value: '$8,200,000',
          occupancy: '86%',
          roi: '6.5%',
          status: 'underperforming'
        },
        {
          id: '3',
          name: 'Riverfront Office',
          address: '789 Market St, San Francisco, CA 94103',
          type: 'Office',
          value: '$12,000,000',
          occupancy: '95%',
          roi: '8.2%',
          status: 'performing'
        },
        {
          id: '4',
          name: 'Sunset Towers',
          address: '321 Sunset Blvd, San Francisco, CA 94118',
          type: 'Multifamily',
          value: '$6,800,000',
          occupancy: '78%',
          roi: '5.1%',
          status: 'at-risk'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'performing':
        return 'bg-green-100 text-green-800';
      case 'underperforming':
        return 'bg-yellow-100 text-yellow-800';
      case 'at-risk':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatStatus = (status: string) => {
    switch (status) {
      case 'performing':
        return 'Performing';
      case 'underperforming':
        return 'Underperforming';
      case 'at-risk':
        return 'At Risk';
      default:
        return status;
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Portfolio</h2>
          <p className="text-gray-500">Please wait while we load your property portfolio...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-[#0066cc]">Portfolio Overview</h1>
            <Link
              href="/operations-dashboard/properties/add"
              className="px-4 py-2 bg-[#0066cc] text-white rounded-md hover:bg-[#0055aa] flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New Property
            </Link>
          </div>
          
          {/* Portfolio Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-500 mb-2">Total Properties</h3>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-[#0066cc]">{properties.length}</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-500 mb-2">Total Value</h3>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-[#0066cc]">$31.5M</span>
                <span className="ml-2 text-sm text-green-600 font-medium">+5.2%</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-500 mb-2">Avg. Occupancy</h3>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-[#0066cc]">88%</span>
                <span className="ml-2 text-sm text-green-600 font-medium">+2.1%</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-500 mb-2">Avg. ROI</h3>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-[#0066cc]">6.9%</span>
                <span className="ml-2 text-sm text-orange-600 font-medium">-0.3%</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Portfolio Health */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-[#0066cc] mb-4">Portfolio Health</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-700">Financial Health</h3>
              <div className="mt-2 flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="ml-2 text-sm font-medium">85%</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">Strong performance across portfolio</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-700">Risk Level</h3>
              <div className="mt-2 flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '35%' }}></div>
                </div>
                <span className="ml-2 text-sm font-medium">35%</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">Low to moderate risk exposure</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-700">Growth Potential</h3>
              <div className="mt-2 flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '72%' }}></div>
                </div>
                <span className="ml-2 text-sm font-medium">72%</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">Strong growth forecasted</p>
            </div>
          </div>
        </div>
        
        {/* Property List */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-[#0066cc]">Properties</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Occupancy
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ROI
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {properties.map((property) => (
                  <tr key={property.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {property.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {property.address}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{property.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{property.value}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{property.occupancy}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{property.roi}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(property.status)}`}>
                        {formatStatus(property.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/operations-dashboard/properties/${property.id}`} className="text-[#0066cc] hover:text-[#0055aa] mr-4">
                        View
                      </Link>
                      <Link href={`/operations-dashboard/properties/${property.id}/analysis`} className="text-[#0066cc] hover:text-[#0055aa]">
                        Analysis
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Market Insights */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[#0066cc] mb-4">Market Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Market Trends</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#0066cc] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  San Francisco market rents increased 3.2% year-over-year
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#0066cc] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Office vacancy rates are stabilizing post-pandemic
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#0066cc] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Multifamily demand remains strong in urban core locations
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Opportunities</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#0066cc] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Consider property upgrades at Sunset Towers to improve occupancy
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#0066cc] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Evaluate potential for rent increases at Oakwood Apartments
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#0066cc] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Explore refinancing options for Riverfront Office to lock in lower rates
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 