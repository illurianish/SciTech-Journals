"use client";

import React from 'react';

interface CashFlowTabProps {
  propertyId: string;
}

const CashFlowTab: React.FC<CashFlowTabProps> = ({ propertyId }) => {
  // TODO: Fetch data from /api/financial/cashflow/:propertyId and implement editable sections
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Cash Flow</h2>
      <p className="text-sm text-gray-500">Placeholder content for Cash Flow (Property: {propertyId}). Fetching and editing to be implemented.</p>
    </div>
  );
};

export default CashFlowTab; 