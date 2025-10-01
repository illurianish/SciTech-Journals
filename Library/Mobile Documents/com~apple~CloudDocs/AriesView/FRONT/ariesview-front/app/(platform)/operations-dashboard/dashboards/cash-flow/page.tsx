'use client';

import ChartComponent from '../../../components/ChartComponent';

export default function CashFlowDashboard() {
  // Cash Flow Trend Chart Data
  const cashFlowTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Net Cash Flow ($K)',
        data: [175, 182, 190, 184, 195, 205, 198, 208, 215, 225, 218, 225],
        borderColor: 'rgba(56, 178, 172, 1)',
        backgroundColor: 'rgba(56, 178, 172, 0.2)',
        fill: true
      }
    ]
  };

  // Income vs Expenses Chart Data
  const incomeVsExpensesData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Income ($M)',
        data: [2.1, 2.15, 2.2, 2.3],
        backgroundColor: 'rgba(56, 178, 172, 0.7)'
      },
      {
        label: 'Expenses ($M)',
        data: [1.0, 1.05, 1.08, 1.05],
        backgroundColor: 'rgba(245, 158, 11, 0.7)'
      },
      {
        label: 'Debt Service ($M)',
        data: [0.58, 0.58, 0.58, 0.58],
        backgroundColor: 'rgba(107, 114, 128, 0.7)'
      }
    ]
  };

  // Expense Breakdown Chart Data
  const expenseBreakdownData = {
    labels: ['Maintenance', 'Utilities', 'Admin', 'Property Tax', 'Insurance', 'Marketing', 'Other'],
    datasets: [
      {
        label: 'Expense Categories',
        data: [1.25, 0.85, 0.68, 0.55, 0.42, 0.25, 0.18],
        backgroundColor: [
          'rgba(56, 178, 172, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(99, 102, 241, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(107, 114, 128, 0.7)'
        ]
      }
    ]
  };

  return (
    <div className="px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Net Cash Flow Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Summary Cards */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Income</h3>
          <p className="text-2xl font-bold text-gray-900">$8.75M</p>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-green-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              +5.2%
            </span>
            <span className="text-gray-400 ml-2">YoY</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Expenses</h3>
          <p className="text-2xl font-bold text-gray-900">$4.18M</p>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-red-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
              </svg>
              +3.8%
            </span>
            <span className="text-gray-400 ml-2">YoY</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Debt Service</h3>
          <p className="text-2xl font-bold text-gray-900">$2.32M</p>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-gray-500">No change</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Net Cash Flow</h3>
          <p className="text-2xl font-bold text-green-600">$2.25M</p>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-green-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              +7.5%
            </span>
            <span className="text-gray-400 ml-2">YoY</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Charts */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Cash Flow Trend</h2>
          </div>
          <div className="p-6">
            <ChartComponent 
              type="line" 
              data={cashFlowTrendData} 
              height={300} 
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Income vs. Expenses</h2>
          </div>
          <div className="p-6">
            <ChartComponent 
              type="bar" 
              data={incomeVsExpensesData} 
              height={300} 
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow col-span-1">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Expense Breakdown</h2>
          </div>
          <div className="p-6">
            <ChartComponent 
              type="doughnut" 
              data={expenseBreakdownData} 
              height={300} 
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow col-span-2">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Distribution History</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { date: 'Dec 15, 2023', amount: '$342,500', type: 'Quarterly', status: 'Completed' },
                    { date: 'Sep 15, 2023', amount: '$328,750', type: 'Quarterly', status: 'Completed' },
                    { date: 'Jun 15, 2023', amount: '$315,200', type: 'Quarterly', status: 'Completed' },
                    { date: 'Mar 15, 2023', amount: '$305,800', type: 'Quarterly', status: 'Completed' },
                    { date: 'Dec 15, 2022', amount: '$298,100', type: 'Quarterly', status: 'Completed' },
                  ].map((dist, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dist.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dist.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dist.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {dist.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Property Cash Flow Analysis</h2>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Income</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Debt Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cash Flow</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cash on Cash</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { name: 'Riverview Apartments', income: '$1.25M', expenses: '$485K', debt: '$420K', cashflow: '$345K', coc: '8.2%' },
                { name: 'Highland Towers', income: '$980K', expenses: '$355K', debt: '$325K', cashflow: '$300K', coc: '7.5%' },
                { name: 'Sunset Gardens', income: '$850K', expenses: '$390K', debt: '$290K', cashflow: '$170K', coc: '5.8%' },
                { name: 'Metropolitan Plaza', income: '$1.62M', expenses: '$610K', debt: '$580K', cashflow: '$430K', coc: '9.3%' },
                { name: 'Lakeside Villas', income: '$755K', expenses: '$410K', debt: '$255K', cashflow: '$90K', coc: '4.2%' },
              ].map((property, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{property.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.income}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.expenses}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.debt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">{property.cashflow}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.coc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 