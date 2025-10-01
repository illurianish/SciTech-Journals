'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PerformanceReportsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('1y');
  const [reportType, setReportType] = useState('all');
  
  // Sample performance data
  const propertyPerformanceData = [
    { id: 1, name: "Riverfront Towers", type: "Multifamily", returns: "12.5%", noi: "$1.85M", appreciation: "8.2%", status: "Performing" },
    { id: 2, name: "Westside Office Plaza", type: "Office", returns: "8.7%", noi: "$2.24M", appreciation: "4.1%", status: "Performing" },
    { id: 3, name: "Highland Retail Center", type: "Retail", returns: "7.2%", noi: "$1.36M", appreciation: "2.9%", status: "Underperforming" },
    { id: 4, name: "Parkview Apartments", type: "Multifamily", returns: "11.9%", noi: "$1.42M", appreciation: "7.6%", status: "Performing" },
    { id: 5, name: "Industrial Flex Space", type: "Industrial", returns: "9.5%", noi: "$0.95M", appreciation: "5.2%", status: "Performing" }
  ];
  
  // Available report templates
  const reportTemplates = [
    { id: 1, name: "Quarterly Performance Summary", description: "Comprehensive quarterly performance overview for investors" },
    { id: 2, name: "Annual Return Analysis", description: "Detailed breakdown of annual returns and appreciation" },
    { id: 3, name: "NOI & Cash Flow Statement", description: "Detailed NOI and cash flow breakdown by property" },
    { id: 4, name: "Portfolio Distribution & Allocation", description: "Asset allocation and geographic distribution analysis" }
  ];

  // Sample chart data for Portfolio Performance
  const renderPortfolioPerformanceChart = () => {
    return (
      <div className="relative">
        {/* Chart SVG */}
        <svg className="w-full h-80" viewBox="0 0 800 300">
          {/* Chart grid */}
          <line x1="50" y1="250" x2="750" y2="250" stroke="#e5e7eb" strokeWidth="1" />
          <line x1="50" y1="200" x2="750" y2="200" stroke="#e5e7eb" strokeWidth="1" />
          <line x1="50" y1="150" x2="750" y2="150" stroke="#e5e7eb" strokeWidth="1" />
          <line x1="50" y1="100" x2="750" y2="100" stroke="#e5e7eb" strokeWidth="1" />
          <line x1="50" y1="50" x2="750" y2="50" stroke="#e5e7eb" strokeWidth="1" />
          
          {/* X-axis labels (months) */}
          <text x="96" y="275" textAnchor="middle" fontSize="12" fill="#6b7280">Jan</text>
          <text x="150" y="275" textAnchor="middle" fontSize="12" fill="#6b7280">Feb</text>
          <text x="204" y="275" textAnchor="middle" fontSize="12" fill="#6b7280">Mar</text>
          <text x="258" y="275" textAnchor="middle" fontSize="12" fill="#6b7280">Apr</text>
          <text x="312" y="275" textAnchor="middle" fontSize="12" fill="#6b7280">May</text>
          <text x="366" y="275" textAnchor="middle" fontSize="12" fill="#6b7280">Jun</text>
          <text x="420" y="275" textAnchor="middle" fontSize="12" fill="#6b7280">Jul</text>
          <text x="474" y="275" textAnchor="middle" fontSize="12" fill="#6b7280">Aug</text>
          <text x="528" y="275" textAnchor="middle" fontSize="12" fill="#6b7280">Sep</text>
          <text x="582" y="275" textAnchor="middle" fontSize="12" fill="#6b7280">Oct</text>
          <text x="636" y="275" textAnchor="middle" fontSize="12" fill="#6b7280">Nov</text>
          <text x="690" y="275" textAnchor="middle" fontSize="12" fill="#6b7280">Dec</text>
          
          {/* Y-axis labels (values) */}
          <text x="40" y="250" textAnchor="end" fontSize="12" fill="#6b7280">0%</text>
          <text x="40" y="200" textAnchor="end" fontSize="12" fill="#6b7280">2%</text>
          <text x="40" y="150" textAnchor="end" fontSize="12" fill="#6b7280">4%</text>
          <text x="40" y="100" textAnchor="end" fontSize="12" fill="#6b7280">6%</text>
          <text x="40" y="50" textAnchor="end" fontSize="12" fill="#6b7280">8%</text>
          
          {/* Actual return line (green) */}
          <path 
            d="M96,230 L150,225 L204,218 L258,210 L312,190 L366,188 L420,160 L474,150 L528,140 L582,125 L636,120 L690,110" 
            fill="none" 
            stroke="#10b981" 
            strokeWidth="3"
          />
          
          {/* Target return line (blue) */}
          <path 
            d="M96,240 L150,235 L204,230 L258,225 L312,220 L366,215 L420,210 L474,205 L528,200 L582,195 L636,190 L690,185" 
            fill="none" 
            stroke="#3b82f6" 
            strokeWidth="3" 
            strokeDasharray="5,5"
          />
          
          {/* Dots on the actual return line */}
          <circle cx="96" cy="230" r="4" fill="#10b981" />
          <circle cx="150" cy="225" r="4" fill="#10b981" />
          <circle cx="204" cy="218" r="4" fill="#10b981" />
          <circle cx="258" cy="210" r="4" fill="#10b981" />
          <circle cx="312" cy="190" r="4" fill="#10b981" />
          <circle cx="366" cy="188" r="4" fill="#10b981" />
          <circle cx="420" cy="160" r="4" fill="#10b981" />
          <circle cx="474" cy="150" r="4" fill="#10b981" />
          <circle cx="528" cy="140" r="4" fill="#10b981" />
          <circle cx="582" cy="125" r="4" fill="#10b981" />
          <circle cx="636" cy="120" r="4" fill="#10b981" />
          <circle cx="690" cy="110" r="4" fill="#10b981" />
        </svg>
        
        {/* Legend */}
        <div className="absolute top-4 right-4 bg-white p-2 rounded-md shadow-sm border border-gray-200">
          <div className="flex items-center mb-1">
            <div className="w-4 h-2 bg-green-500 mr-2"></div>
            <span className="text-xs text-gray-600">Actual Return (7.2%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-2 bg-blue-500 mr-2 border-dashed border-2"></div>
            <span className="text-xs text-gray-600">Target Return (5.5%)</span>
          </div>
        </div>
      </div>
    );
  };

  // Sample chart data for Asset Allocation
  const renderAssetAllocationChart = () => {
    // Donut chart for asset allocation
    const total = 100;
    const multifamily = 42;
    const office = 25;
    const retail = 18;
    const industrial = 15;
    
    // Calculate donut segments
    const multifamilyEnd = multifamily / total * 100;
    const officeEnd = multifamilyEnd + (office / total * 100);
    const retailEnd = officeEnd + (retail / total * 100);
    
    // SVG drawing instructions for a donut chart
    return (
      <div className="flex justify-center">
        <div className="relative w-60 h-60">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Donut segments */}
            {/* Multifamily - 42% */}
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              fill="transparent"
              stroke="#4f46e5" 
              strokeWidth="20"
              strokeDasharray={`${multifamilyEnd} ${100-multifamilyEnd}`}
              transform="rotate(-90 50 50)"
            />
            
            {/* Office - 25% */}
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              fill="transparent"
              stroke="#a855f7" 
              strokeWidth="20"
              strokeDasharray={`${office} ${100-office}`}
              strokeDashoffset={`${-multifamilyEnd}`}
              transform="rotate(-90 50 50)"
            />
            
            {/* Retail - 18% */}
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              fill="transparent"
              stroke="#ec4899" 
              strokeWidth="20"
              strokeDasharray={`${retail} ${100-retail}`}
              strokeDashoffset={`${-officeEnd}`}
              transform="rotate(-90 50 50)"
            />
            
            {/* Industrial - 15% */}
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              fill="transparent"
              stroke="#f59e0b" 
              strokeWidth="20"
              strokeDasharray={`${industrial} ${100-industrial}`}
              strokeDashoffset={`${-retailEnd}`}
              transform="rotate(-90 50 50)"
            />
            
            {/* Inner circle to create donut hole */}
            <circle cx="50" cy="50" r="30" fill="white" />
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-xs text-gray-500">Total</span>
            <span className="text-lg font-semibold">$147.5M</span>
          </div>
        </div>
      </div>
    );
  };

  // Sample chart data for Geographic Distribution
  const renderGeographicDistributionChart = () => {
    // Bar chart data
    const regions = ['Northeast', 'Southeast', 'Midwest', 'West'];
    const percentages = [35, 28, 22, 15];
    const colors = ['#4f46e5', '#a855f7', '#ec4899', '#f59e0b'];
    
    return (
      <div className="h-60">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          {/* Y axis */}
          <line x1="50" y1="170" x2="50" y2="20" stroke="#e5e7eb" strokeWidth="1" />
          
          {/* X axis */}
          <line x1="50" y1="170" x2="370" y2="170" stroke="#e5e7eb" strokeWidth="1" />
          
          {/* Y-axis labels */}
          <text x="45" y="170" textAnchor="end" fontSize="10" fill="#6b7280">0%</text>
          <text x="45" y="135" textAnchor="end" fontSize="10" fill="#6b7280">10%</text>
          <text x="45" y="100" textAnchor="end" fontSize="10" fill="#6b7280">20%</text>
          <text x="45" y="65" textAnchor="end" fontSize="10" fill="#6b7280">30%</text>
          <text x="45" y="30" textAnchor="end" fontSize="10" fill="#6b7280">40%</text>
          
          {/* Bars and labels */}
          {regions.map((region, index) => {
            const barHeight = percentages[index] * 3.5;
            const x = 70 + (index * 80);
            
            return (
              <g key={`region-${index}`}>
                {/* Bar */}
                <rect 
                  x={x} 
                  y={170 - barHeight} 
                  width="40" 
                  height={barHeight} 
                  fill={colors[index]}
                  rx="4"
                />
                
                {/* Value on top of bar */}
                <text 
                  x={x + 20} 
                  y={165 - barHeight} 
                  textAnchor="middle" 
                  fontSize="12" 
                  fill="#6b7280"
                  fontWeight="bold"
                >
                  {percentages[index]}%
                </text>
                
                {/* X-axis label */}
                <text 
                  x={x + 20} 
                  y="185" 
                  textAnchor="middle" 
                  fontSize="10" 
                  fill="#6b7280"
                >
                  {region}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Reports</h1>
          <p className="text-gray-600">Generate and view investment performance reports</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Export
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">
            Generate New Report
          </button>
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
            Overview
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className={`${
              activeTab === 'properties'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Property Performance
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`${
              activeTab === 'templates'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Report Templates
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`${
              activeTab === 'history'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Report History
          </button>
        </nav>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label htmlFor="time-range" className="block text-sm font-medium text-gray-700 mb-1">
            Time Range
          </label>
          <select
            id="time-range"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Last 1 Year</option>
            <option value="3y">Last 3 Years</option>
            <option value="5y">Last 5 Years</option>
            <option value="all">All Time</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="report-type" className="block text-sm font-medium text-gray-700 mb-1">
            Report Type
          </label>
          <select
            id="report-type"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="all">All Reports</option>
            <option value="quarterly">Quarterly Reports</option>
            <option value="annual">Annual Reports</option>
            <option value="special">Special Reports</option>
          </select>
        </div>
      </div>
      
      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Portfolio Performance Summary</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Total Return (Annualized)</p>
                <p className="text-2xl font-semibold text-gray-900">10.2%</p>
                <p className="text-sm text-green-600">+1.5% vs. previous period</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Cash Yield</p>
                <p className="text-2xl font-semibold text-gray-900">6.8%</p>
                <p className="text-sm text-green-600">+0.3% vs. previous period</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Appreciation</p>
                <p className="text-2xl font-semibold text-gray-900">5.4%</p>
                <p className="text-sm text-green-600">+0.8% vs. previous period</p>
              </div>
            </div>
            
            {/* Portfolio Performance Chart */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Portfolio Performance Over Time</h3>
              </div>
              {renderPortfolioPerformanceChart()}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Asset Allocation</h2>
              
              {/* Asset Allocation Chart */}
              {renderAssetAllocationChart()}
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-500">Multifamily</p>
                  <p className="text-lg font-medium text-gray-900">42%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Office</p>
                  <p className="text-lg font-medium text-gray-900">25%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Retail</p>
                  <p className="text-lg font-medium text-gray-900">18%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Industrial</p>
                  <p className="text-lg font-medium text-gray-900">15%</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Geographic Distribution</h2>
              
              {/* Geographic Distribution Chart */}
              {renderGeographicDistributionChart()}
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-500">Northeast</p>
                  <p className="text-lg font-medium text-gray-900">35%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Southeast</p>
                  <p className="text-lg font-medium text-gray-900">28%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Midwest</p>
                  <p className="text-lg font-medium text-gray-900">22%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">West</p>
                  <p className="text-lg font-medium text-gray-900">15%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'properties' && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
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
                    Total Returns
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NOI
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Appreciation
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
                {propertyPerformanceData.map((property) => (
                  <tr key={property.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {property.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {property.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {property.returns}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {property.noi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {property.appreciation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        property.status === 'Performing' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href="#" className="text-indigo-600 hover:text-indigo-900">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportTemplates.map((template) => (
            <div key={template.id} className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-2">{template.name}</h3>
              <p className="text-gray-600 mb-4">{template.description}</p>
              <div className="flex justify-end">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Generate Report
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {activeTab === 'history' && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Generated
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Q4 2023 Performance Summary
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Quarterly
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Jan 15, 2024
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Sarah Johnson
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href="#" className="text-indigo-600 hover:text-indigo-900 mr-4">
                    View
                  </Link>
                  <Link href="#" className="text-indigo-600 hover:text-indigo-900">
                    Download
                  </Link>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  2023 Annual Portfolio Review
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Annual
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Feb 5, 2024
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Michael Chen
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href="#" className="text-indigo-600 hover:text-indigo-900 mr-4">
                    View
                  </Link>
                  <Link href="#" className="text-indigo-600 hover:text-indigo-900">
                    Download
                  </Link>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Boston Properties Performance Analysis
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Special
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Feb 12, 2024
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  David Wilson
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href="#" className="text-indigo-600 hover:text-indigo-900 mr-4">
                    View
                  </Link>
                  <Link href="#" className="text-indigo-600 hover:text-indigo-900">
                    Download
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 