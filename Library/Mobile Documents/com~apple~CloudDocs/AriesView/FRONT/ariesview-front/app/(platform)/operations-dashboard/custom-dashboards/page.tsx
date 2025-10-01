'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  BarChart3, PieChart, LineChart, Table, Download, 
  Settings, Plus, Filter, Calendar, Building, 
  DollarSign, TrendingUp, ChevronDown, Share2
} from 'lucide-react';

export default function CustomDashboardsPage() {
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedProperties, setSelectedProperties] = useState([1, 3]);
  const [dateRange, setDateRange] = useState('last-quarter');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Sample property portfolio data
  const properties = [
    { id: 1, name: "Riverfront Plaza", address: "123 Main St, Boston, MA", type: "Office", units: 12, vacancy: 8, noi: 2400000 },
    { id: 2, name: "Tech Center Building", address: "456 Innovation Way, Cambridge, MA", type: "Office", units: 15, vacancy: 12, noi: 3200000 },
    { id: 3, name: "Harbor View Apartments", address: "789 Seaport Blvd, Boston, MA", type: "Multifamily", units: 42, vacancy: 5, noi: 1850000 },
    { id: 4, name: "Downtown Retail Center", address: "101 Commerce St, Boston, MA", type: "Retail", units: 8, vacancy: 15, noi: 980000 },
    { id: 5, name: "Westside Industrial Park", address: "555 Factory Rd, Waltham, MA", type: "Industrial", units: 6, vacancy: 0, noi: 1650000 }
  ];

  // Sample template report data
  const reportTemplates = [
    { id: 1, name: "Financial Performance Overview", type: "Financial", charts: 4, lastUsed: "2023-12-15" },
    { id: 2, name: "Tenant Health & Occupancy", type: "Operational", charts: 6, lastUsed: "2023-12-20" },
    { id: 3, name: "Budget vs. Actual Comparison", type: "Financial", charts: 3, lastUsed: "2023-11-30" },
    { id: 4, name: "NOI & Cash Flow Analysis", type: "Financial", charts: 5, lastUsed: "2024-01-10" },
    { id: 5, name: "Maintenance & Capex Overview", type: "Operational", charts: 4, lastUsed: "2024-01-05" },
    { id: 6, name: "Lease Expiration Risk", type: "Risk", charts: 3, lastUsed: "2023-12-02" }
  ];

  // Sample saved dashboards
  const savedDashboards = [
    { id: 1, name: "Q4 2023 Portfolio Review", properties: 5, charts: 8, created: "2024-01-15", shared: true },
    { id: 2, name: "Annual Investor Report - 2023", properties: 3, charts: 12, created: "2024-01-10", shared: true },
    { id: 3, name: "Boston Properties Performance", properties: 2, charts: 6, created: "2023-12-18", shared: false },
    { id: 4, name: "Acquisition Target Analysis", properties: 1, charts: 5, created: "2023-12-05", shared: false }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Custom Dashboards</h1>
            <p className="text-gray-600">Create, customize and share property performance reports</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setIsCreatingNew(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Dashboard
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('templates')}
              className={`${
                activeTab === 'templates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            >
              Report Templates
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`${
                activeTab === 'saved'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            >
              Saved Dashboards
            </button>
            <button
              onClick={() => setActiveTab('scheduled')}
              className={`${
                activeTab === 'scheduled'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            >
              Scheduled Reports
            </button>
          </nav>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4">
          <div className="w-full md:w-auto">
            <label htmlFor="property-filter" className="block text-sm font-medium text-gray-700 mb-1">Properties</label>
            <div className="relative">
              <select
                id="property-filter"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option>All Properties</option>
                <option>Office Properties</option>
                <option>Multifamily Properties</option>
                <option>Retail Properties</option>
                <option>Industrial Properties</option>
              </select>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <div className="relative">
              <select
                id="date-range"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="last-quarter">Last Quarter</option>
                <option value="last-year">Last Year</option>
                <option value="ytd">Year to Date</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <label htmlFor="report-type" className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <div className="relative">
              <select
                id="report-type"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option>All Types</option>
                <option>Financial</option>
                <option>Operational</option>
                <option>Risk</option>
                <option>Sustainability</option>
              </select>
            </div>
          </div>
          <div className="w-full md:w-auto md:ml-auto self-end">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>

        {/* Templates Tab Content */}
        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportTemplates.map(template => (
              <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-500">{template.type} Report • {template.charts} Charts</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      template.type === 'Financial' ? 'bg-blue-100 text-blue-800' : 
                      template.type === 'Operational' ? 'bg-green-100 text-green-800' : 
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {template.type}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {Array.from({ length: Math.min(4, template.charts) }).map((_, i) => (
                      <div key={i} className="bg-gray-100 rounded-md h-16 flex items-center justify-center">
                        {i === 0 ? <BarChart3 className="h-8 w-8 text-gray-400" /> : 
                         i === 1 ? <PieChart className="h-8 w-8 text-gray-400" /> :
                         i === 2 ? <LineChart className="h-8 w-8 text-gray-400" /> :
                         <Table className="h-8 w-8 text-gray-400" />}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-gray-500">Last used: {new Date(template.lastUsed).toLocaleDateString()}</p>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500">
                      Preview
                    </button>
                    <button className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
                      Use Template
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Saved Dashboards Tab Content */}
        {activeTab === 'saved' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dashboard Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Properties</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charts</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shared</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {savedDashboards.map(dashboard => (
                  <tr key={dashboard.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{dashboard.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{dashboard.properties}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{dashboard.charts}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{new Date(dashboard.created).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        dashboard.shared ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {dashboard.shared ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">View</button>
                        <button className="text-blue-600 hover:text-blue-900">Edit</button>
                        <button className="text-blue-600 hover:text-blue-900" aria-label="Download dashboard">
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-900" aria-label="Share dashboard">
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Scheduled Reports Tab Content */}
        {activeTab === 'scheduled' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No scheduled reports</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by scheduling your first automated report.</p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule a Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create New Dashboard Modal */}
        {isCreatingNew && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        Create New Dashboard
                      </h3>
                      <div className="mt-6">
                        <div className="mb-4">
                          <label htmlFor="dashboard-name" className="block text-sm font-medium text-gray-700 mb-1">
                            Dashboard Name
                          </label>
                          <input
                            type="text"
                            name="dashboard-name"
                            id="dashboard-name"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder="Q1 2024 Portfolio Performance"
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label htmlFor="dashboard-type" className="block text-sm font-medium text-gray-700 mb-1">
                            Dashboard Type
                          </label>
                          <select
                            id="dashboard-type"
                            name="dashboard-type"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          >
                            <option>Financial Performance</option>
                            <option>Operational Metrics</option>
                            <option>Risk Assessment</option>
                            <option>Custom Dashboard</option>
                          </select>
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Properties
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                            {properties.map(property => (
                              <div key={property.id} className="flex items-center">
                                <input
                                  id={`property-${property.id}`}
                                  name={`property-${property.id}`}
                                  type="checkbox"
                                  checked={selectedProperties.includes(property.id)}
                                  onChange={() => {
                                    if (selectedProperties.includes(property.id)) {
                                      setSelectedProperties(selectedProperties.filter(id => id !== property.id));
                                    } else {
                                      setSelectedProperties([...selectedProperties, property.id]);
                                    }
                                  }}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`property-${property.id}`} className="ml-2 block text-sm text-gray-900">
                                  {property.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Metrics to Include
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div className="border border-gray-200 rounded-lg p-3 hover:border-blue-500 hover:bg-blue-50 cursor-pointer">
                              <div className="flex items-center">
                                <DollarSign className="h-5 w-5 text-blue-500 mr-2" />
                                <span className="text-sm font-medium">Financial KPIs</span>
                              </div>
                            </div>
                            <div className="border border-gray-200 rounded-lg p-3 hover:border-blue-500 hover:bg-blue-50 cursor-pointer">
                              <div className="flex items-center">
                                <Building className="h-5 w-5 text-blue-500 mr-2" />
                                <span className="text-sm font-medium">Occupancy</span>
                              </div>
                            </div>
                            <div className="border border-gray-200 rounded-lg p-3 hover:border-blue-500 hover:bg-blue-50 cursor-pointer">
                              <div className="flex items-center">
                                <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                                <span className="text-sm font-medium">NOI Trends</span>
                              </div>
                            </div>
                            <div className="border border-gray-200 rounded-lg p-3 hover:border-blue-500 hover:bg-blue-50 cursor-pointer">
                              <div className="flex items-center">
                                <BarChart3 className="h-5 w-5 text-blue-500 mr-2" />
                                <span className="text-sm font-medium">Expense Ratios</span>
                              </div>
                            </div>
                            <div className="border border-gray-200 rounded-lg p-3 hover:border-blue-500 hover:bg-blue-50 cursor-pointer">
                              <div className="flex items-center">
                                <PieChart className="h-5 w-5 text-blue-500 mr-2" />
                                <span className="text-sm font-medium">Revenue Mix</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Create & Customize
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreatingNew(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 