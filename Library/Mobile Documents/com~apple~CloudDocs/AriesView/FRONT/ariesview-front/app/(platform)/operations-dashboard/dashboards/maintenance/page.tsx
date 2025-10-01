'use client';

import { useState } from 'react';
import ChartComponent from '../../../components/ChartComponent';

export default function MaintenanceDashboard() {
  const [timeFrame, setTimeFrame] = useState('monthly');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Work Order Status Chart Data
  const workOrderStatusData = {
    labels: ['Open', 'In Progress', 'On Hold', 'Completed'],
    datasets: [
      {
        label: 'Work Orders by Status',
        data: [42, 78, 15, 235],
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)',  // red
          'rgba(245, 158, 11, 0.7)', // amber
          'rgba(59, 130, 246, 0.7)', // blue
          'rgba(16, 185, 129, 0.7)'  // green
        ],
        borderWidth: 1
      }
    ]
  };

  // Work Order Types Chart Data
  const workOrderTypesData = {
    labels: ['Plumbing', 'HVAC', 'Electrical', 'Structural', 'Appliance', 'Landscaping', 'Other'],
    datasets: [
      {
        label: 'Work Orders by Type',
        data: [63, 52, 45, 22, 37, 18, 25],
        backgroundColor: 'rgba(99, 102, 241, 0.7)'
      }
    ]
  };

  // Work Order Timeline Data
  const workOrderTimelineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'New Work Orders',
        data: [42, 38, 55, 48, 59, 68, 72, 65, 57, 51, 48, 42],
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        fill: false
      },
      {
        label: 'Completed Work Orders',
        data: [38, 35, 49, 45, 52, 63, 67, 61, 55, 49, 45, 39],
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: false
      }
    ]
  };

  // Resolution Time Chart Data
  const resolutionTimeData = {
    labels: ['Plumbing', 'HVAC', 'Electrical', 'Structural', 'Appliance', 'Landscaping', 'Other'],
    datasets: [
      {
        label: 'Avg. Days to Resolution',
        data: [2.3, 3.8, 2.1, 5.2, 1.8, 1.5, 2.8],
        backgroundColor: 'rgba(99, 102, 241, 0.7)'
      }
    ]
  };

  // Priority options
  const priorities = [
    { id: 'all', name: 'All Priorities' },
    { id: 'emergency', name: 'Emergency' },
    { id: 'urgent', name: 'Urgent' },
    { id: 'high', name: 'High' },
    { id: 'medium', name: 'Medium' },
    { id: 'low', name: 'Low' }
  ];

  return (
    <div className="px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Maintenance Dashboard</h1>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <select 
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Filter by priority"
          >
            {priorities.map(priority => (
              <option key={priority.id} value={priority.id}>{priority.name}</option>
            ))}
          </select>
          
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setTimeFrame('weekly')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                timeFrame === 'weekly'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Weekly
            </button>
            <button
              type="button"
              onClick={() => setTimeFrame('monthly')}
              className={`px-4 py-2 text-sm font-medium ${
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
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                timeFrame === 'quarterly'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Quarterly
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Summary Cards */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Work Orders</h3>
          <p className="text-2xl font-bold text-indigo-600">370</p>
          <div className="flex items-center mt-1 text-xs text-gray-500">
            <span className="text-red-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              +8.3%
            </span>
            <span className="ml-2">vs last month</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Open Work Orders</h3>
          <p className="text-2xl font-bold text-amber-500">135</p>
          <div className="text-xs text-gray-500 mt-1">42 Urgent / Emergency</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Avg. Response Time</h3>
          <p className="text-2xl font-bold text-gray-900">1.4 days</p>
          <div className="flex items-center mt-1 text-xs text-gray-500">
            <span className="text-green-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v3.586l-4.293-4.293a1 1 0 00-1.414 0L8 10.586 3.707 6.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
              </svg>
              -0.3 days
            </span>
            <span className="ml-2">vs last month</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Completion Rate</h3>
          <p className="text-2xl font-bold text-green-600">92.8%</p>
          <div className="flex items-center mt-1 text-xs text-gray-500">
            <span className="text-green-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              +1.5%
            </span>
            <span className="ml-2">vs last month</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Charts */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Work Order Status</h2>
          </div>
          <div className="p-6">
            <ChartComponent 
              type="doughnut" 
              data={workOrderStatusData} 
              height={300} 
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Work Order Types</h2>
          </div>
          <div className="p-6">
            <ChartComponent 
              type="bar" 
              data={workOrderTypesData} 
              height={300} 
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Work Order Timeline</h2>
          </div>
          <div className="p-6">
            <ChartComponent 
              type="line" 
              data={workOrderTimelineData} 
              height={300} 
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Average Resolution Time by Category</h2>
          </div>
          <div className="p-6">
            <ChartComponent 
              type="bar" 
              data={resolutionTimeData} 
              height={300} 
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Recent Work Orders</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">Filter</button>
            <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">Export</button>
          </div>
        </div>
        <div className="p-6 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { id: 'WO-12548', description: 'HVAC system not cooling properly', property: 'Highland Towers - Unit 302', category: 'HVAC', priority: 'High', status: 'In Progress', submitted: '08/12/2023' },
                { id: 'WO-12547', description: 'Water leak under kitchen sink', property: 'Sunset Gardens - Unit 105', category: 'Plumbing', priority: 'Urgent', status: 'Open', submitted: '08/12/2023' },
                { id: 'WO-12546', description: 'Bathroom light fixture replacement', property: 'Riverview Apartments - Unit 710', category: 'Electrical', priority: 'Medium', status: 'In Progress', submitted: '08/11/2023' },
                { id: 'WO-12545', description: 'Dishwasher not draining properly', property: 'Metropolitan Plaza - Unit 405', category: 'Appliance', priority: 'Medium', status: 'Completed', submitted: '08/11/2023' },
                { id: 'WO-12544', description: 'Cracked window in living room', property: 'Lakeside Villas - Unit 208', category: 'Structural', priority: 'High', status: 'In Progress', submitted: '08/10/2023' },
              ].map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{item.id}</td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-900 max-w-xs">{item.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.property}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.priority === 'Emergency' ? 'bg-red-100 text-red-800' :
                      item.priority === 'Urgent' ? 'bg-orange-100 text-orange-800' :
                      item.priority === 'High' ? 'bg-yellow-100 text-yellow-800' :
                      item.priority === 'Medium' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.status === 'Open' ? 'bg-red-100 text-red-800' :
                      item.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      item.status === 'On Hold' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.submitted}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="flex justify-center mt-6">
            <nav className="flex items-center">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">1</button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-indigo-50 text-sm font-medium text-indigo-600 hover:bg-indigo-100">2</button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">3</button>
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">8</button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">9</button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">10</button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
} 