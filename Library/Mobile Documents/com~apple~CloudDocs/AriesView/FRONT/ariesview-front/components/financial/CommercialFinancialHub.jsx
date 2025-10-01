"use client"

import { useState } from 'react';
import SummaryDashboard from './summary/SummaryDashboard';
import RentRoll from './rentroll/RentRoll';

// Tab navigation component
const FinancialTabNav = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'summary', name: 'Summary Dashboard' },
    { id: 'income', name: 'Income Statement' },
    { id: 'acquisitionModel', name: 'ACQUISITION MODEL' },
    { id: 'rentRoll', name: 'Rent Roll' },
    { id: 'capex', name: 'CapEx Plan' },
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === tab.id
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}
            `}
          >
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  );
};

const CommercialFinancialHub = ({ propertyId }) => {
  const [activeTab, setActiveTab] = useState('summary');

  return (
    <div className="container mx-auto py-6">
      <FinancialTabNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="mt-6">
        {activeTab === 'summary' && (
          <SummaryDashboard propertyId={propertyId} />
        )}
        {activeTab === 'income' && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Income Statement</h2>
            <p>Income Statement component will be implemented here</p>
          </div>
        )}
        {activeTab === 'acquisitionModel' && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">ACQUISITION MODEL</h2>
            <p>ACQUISITION MODE and MODEL content will be implemented here</p>
          </div>
        )}
        {activeTab === 'rentRoll' && (
          <RentRoll propertyId={propertyId} />
        )}
        {activeTab === 'capex' && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">CapEx Plan</h2>
            <p>CapEx Plan component will be implemented here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommercialFinancialHub; 