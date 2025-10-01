'use client';

import { useState } from 'react';
import ChartComponent from '../../../components/ChartComponent';

export default function BudgetVsActualDashboard() {
  const [activeTab, setActiveTab] = useState('revenue');
  const [selectedProperty, setSelectedProperty] = useState('all');

  // Overall Performance Chart Data
  const overallPerformanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Budget',
        data: [850, 875, 880, 890, 895, 910, 915, 920, 925, 930, 935, 940],
        borderColor: 'rgba(99, 102, 241, 1)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 2,
        fill: false
      },
      {
        label: 'Actual',
        data: [825, 865, 895, 885, 910, 925, 915, 940, 945, 960, 950, 970],
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: false
      }
    ]
  };

  // Revenue Breakdown Data
  const revenueBreakdownData = {
    labels: ['Rent', 'Parking', 'Amenities', 'Late Fees', 'Other'],
    datasets: [
      {
        label: 'Budget',
        data: [7.85, 0.65, 0.45, 0.15, 0.2],
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
      },
      {
        label: 'Actual',
        data: [8.1, 0.7, 0.42, 0.18, 0.25],
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
      }
    ]
  };

  // Expense Breakdown Data
  const expenseBreakdownData = {
    labels: ['Maintenance', 'Utilities', 'Payroll', 'Admin', 'Insurance', 'Marketing', 'Taxes'],
    datasets: [
      {
        label: 'Budget',
        data: [1.2, 0.85, 0.75, 0.45, 0.35, 0.25, 0.55],
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
      },
      {
        label: 'Actual',
        data: [1.35, 0.82, 0.72, 0.42, 0.35, 0.28, 0.55],
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
      }
    ]
  };

  // Variance Analysis Data
  const varianceAnalysisData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Revenue Variance',
        data: [+3.5, +4.2, +2.8, +3.1],
        backgroundColor: 'rgba(16, 185, 129, 0.7)'
      },
      {
        label: 'Expense Variance',
        data: [-1.8, -1.2, -2.5, -1.5],
        backgroundColor: 'rgba(239, 68, 68, 0.7)'
      },
      {
        label: 'Net Variance',
        data: [+1.7, +3.0, +0.3, +1.6],
        backgroundColor: 'rgba(99, 102, 241, 0.7)'
      }
    ]
  };

  // Properties data
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
        <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Budget vs. Actual Dashboard</h1>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <select 
            value={selectedProperty} 
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Select property"
          >
            {properties.map(property => (
              <option key={property.id} value={property.id}>{property.name}</option>
            ))}
          </select>
          
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab('revenue')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                activeTab === 'revenue'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Revenue
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('expenses')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'expenses'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Expenses
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('overall')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                activeTab === 'overall'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Overall
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Summary Cards */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Annual Budget</h3>
          <p className="text-2xl font-bold text-gray-900">$10.92M</p>
          <div className="text-xs text-gray-500 mt-1">Fiscal Year 2023</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Actual YTD</h3>
          <p className="text-2xl font-bold text-gray-900">$9.65M</p>
          <div className="flex items-center mt-1">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '88%' }}></div>
            </div>
            <span className="text-xs text-gray-500 ml-2">88%</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Variance</h3>
          <p className="text-2xl font-bold text-green-600">+$320K</p>
          <div className="text-xs text-gray-500 mt-1">+3.2% against budget</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Year-End Forecast</h3>
          <p className="text-2xl font-bold text-gray-900">$11.2M</p>
          <div className="flex items-center mt-2 text-xs">
            <span className="text-green-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              +2.6%
            </span>
            <span className="text-gray-400 ml-2">vs budget</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Charts */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Budget vs. Actual Performance</h2>
          </div>
          <div className="p-6">
            <ChartComponent 
              type="line" 
              data={overallPerformanceData} 
              height={300} 
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Variance Analysis by Quarter</h2>
          </div>
          <div className="p-6">
            <ChartComponent 
              type="bar" 
              data={varianceAnalysisData} 
              height={300} 
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            {activeTab === 'revenue' ? 'Revenue Breakdown' : 
             activeTab === 'expenses' ? 'Expense Breakdown' : 
             'Overall Performance'}
          </h2>
        </div>
        <div className="p-6">
          <ChartComponent 
            type="bar" 
            data={activeTab === 'revenue' ? revenueBreakdownData : 
                  activeTab === 'expenses' ? expenseBreakdownData : 
                  overallPerformanceData} 
            height={300} 
          />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Detailed Budget Analysis</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">Filter</button>
            <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">Export</button>
          </div>
        </div>
        <div className="p-6 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variance ($)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variance (%)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { category: 'Rental Income', budget: '$9.30M', actual: '$9.65M', varianceAmount: '+$350K', variancePercent: '+3.8%', status: 'Favorable' },
                { category: 'Maintenance', budget: '$1.20M', actual: '$1.35M', varianceAmount: '-$150K', variancePercent: '-12.5%', status: 'Unfavorable' },
                { category: 'Utilities', budget: '$850K', actual: '$820K', varianceAmount: '+$30K', variancePercent: '+3.5%', status: 'Favorable' },
                { category: 'Admin Expenses', budget: '$450K', actual: '$420K', varianceAmount: '+$30K', variancePercent: '+6.7%', status: 'Favorable' },
                { category: 'Marketing', budget: '$250K', actual: '$280K', varianceAmount: '-$30K', variancePercent: '-12.0%', status: 'Unfavorable' },
                { category: 'Property Taxes', budget: '$550K', actual: '$550K', varianceAmount: '$0', variancePercent: '0.0%', status: 'On Target' },
              ].map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.budget}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.actual}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.varianceAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.variancePercent}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.status === 'Favorable' ? 'bg-green-100 text-green-800' :
                      item.status === 'Unfavorable' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
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