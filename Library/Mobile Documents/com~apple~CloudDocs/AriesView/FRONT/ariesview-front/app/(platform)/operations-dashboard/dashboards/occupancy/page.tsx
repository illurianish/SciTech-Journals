'use client';

import { useState } from 'react';
import ChartComponent from '../../../components/ChartComponent';

export default function OccupancyDashboard() {
  const [timeFrame, setTimeFrame] = useState('yearly');
  const [propertyFilter, setPropertyFilter] = useState('all');

  // Occupancy Trend Data
  const occupancyTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Occupancy Rate (%)',
        data: [92.5, 93.1, 94.2, 95.0, 94.8, 94.5, 95.2, 95.8, 96.2, 95.7, 95.0, 94.8],
        borderColor: 'rgba(99, 102, 241, 1)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 2,
        fill: true
      },
      {
        label: 'Target Occupancy (%)',
        data: [93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93, 93],
        borderColor: 'rgba(107, 114, 128, 0.8)',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false
      }
    ]
  };

  // Occupancy by Property Type Data
  const occupancyByPropertyTypeData = {
    labels: ['Apartments', 'Office Space', 'Retail', 'Industrial', 'Mixed-Use'],
    datasets: [
      {
        label: 'Occupancy Rate (%)',
        data: [95.2, 88.7, 92.1, 97.8, 93.5],
        backgroundColor: [
          'rgba(99, 102, 241, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(139, 92, 246, 0.7)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Lease Expiry Profile Data
  const leaseExpiryProfileData = {
    labels: ['< 3 months', '3-6 months', '6-12 months', '1-2 years', '> 2 years'],
    datasets: [
      {
        label: 'Square Footage (thousands)',
        data: [48, 72, 135, 210, 95],
        backgroundColor: 'rgba(99, 102, 241, 0.7)'
      }
    ]
  };

  // Vacancy Reasons Data
  const vacancyReasonsData = {
    labels: ['Relocating', 'Price', 'Space Requirements', 'Amenities', 'Building Condition', 'Other'],
    datasets: [
      {
        label: 'Percentage of Move-outs',
        data: [32, 25, 18, 12, 8, 5],
        backgroundColor: [
          'rgba(99, 102, 241, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(107, 114, 128, 0.7)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Properties for filter
  const properties = [
    { id: 'all', name: 'All Properties' },
    { id: 'riverview', name: 'Riverview Apartments' },
    { id: 'highland', name: 'Highland Towers' },
    { id: 'sunset', name: 'Sunset Gardens' },
    { id: 'metropolitan', name: 'Metropolitan Plaza' },
    { id: 'lakeside', name: 'Lakeside Villas' }
  ];

  return (
    <div className="px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Occupancy Dashboard</h1>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <select 
            value={propertyFilter} 
            onChange={(e) => setPropertyFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Filter by property"
          >
            {properties.map(property => (
              <option key={property.id} value={property.id}>{property.name}</option>
            ))}
          </select>
          
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setTimeFrame('monthly')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                timeFrame === 'monthly'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setTimeFrame('quarterly')}
              className={`px-4 py-2 text-sm font-medium ${
                timeFrame === 'quarterly'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Quarterly
            </button>
            <button
              type="button"
              onClick={() => setTimeFrame('yearly')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                timeFrame === 'yearly'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Summary Cards */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Current Occupancy</h3>
          <p className="text-2xl font-bold text-indigo-600">94.8%</p>
          <div className="flex items-center mt-1 text-xs text-gray-500">
            <span className="text-green-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              +1.8%
            </span>
            <span className="ml-2">vs last year</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Leased Units</h3>
          <p className="text-2xl font-bold text-gray-900">1,248</p>
          <div className="text-xs text-gray-500 mt-1">Out of 1,316 total units</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Avg. Lease Duration</h3>
          <p className="text-2xl font-bold text-gray-900">18.3 mo</p>
          <div className="flex items-center mt-1 text-xs text-gray-500">
            <span className="text-green-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              +2.1 mo
            </span>
            <span className="ml-2">vs last year</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Renewal Rate</h3>
          <p className="text-2xl font-bold text-gray-900">76.2%</p>
          <div className="flex items-center mt-1 text-xs text-gray-500">
            <span className="text-yellow-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l1 1a1 1 0 01-1.414 1.414L10 5.414 9.707 5.707a1 1 0 01-1.414-1.414l1-1A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              -0.8%
            </span>
            <span className="ml-2">vs last year</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Charts */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Occupancy Trend</h2>
          </div>
          <div className="p-6">
            <ChartComponent 
              type="line" 
              data={occupancyTrendData} 
              height={300} 
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Occupancy by Property Type</h2>
          </div>
          <div className="p-6">
            <ChartComponent 
              type="bar" 
              data={occupancyByPropertyTypeData} 
              height={300} 
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Lease Expiry Profile</h2>
          </div>
          <div className="p-6">
            <ChartComponent 
              type="bar" 
              data={leaseExpiryProfileData} 
              height={300} 
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Vacancy Reasons</h2>
          </div>
          <div className="p-6">
            <ChartComponent 
              type="doughnut" 
              data={vacancyReasonsData} 
              height={300} 
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Property Occupancy Detail</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">Filter</button>
            <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">Export</button>
          </div>
        </div>
        <div className="p-6 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Units</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupied</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vacancy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupancy %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">YoY Change</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { property: 'Riverview Apartments', units: 342, occupied: 329, vacancy: 13, occupancyRate: '96.2%', yoyChange: '+1.8%', status: 'increase' },
                { property: 'Highland Towers', units: 218, occupied: 201, vacancy: 17, occupancyRate: '92.2%', yoyChange: '-0.5%', status: 'decrease' },
                { property: 'Sunset Gardens', units: 176, occupied: 172, vacancy: 4, occupancyRate: '97.7%', yoyChange: '+2.3%', status: 'increase' },
                { property: 'Metropolitan Plaza', units: 285, occupied: 267, vacancy: 18, occupancyRate: '93.7%', yoyChange: '+1.2%', status: 'increase' },
                { property: 'Lakeside Villas', units: 295, occupied: 279, vacancy: 16, occupancyRate: '94.6%', yoyChange: '+0.9%', status: 'increase' },
              ].map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.property}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.units}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.occupied}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.vacancy}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.occupancyRate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`flex items-center ${
                      item.status === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.status === 'increase' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v3.586l-4.293-4.293a1 1 0 00-1.414 0L8 10.586 3.707 6.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                        </svg>
                      )}
                      {item.yoyChange}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 