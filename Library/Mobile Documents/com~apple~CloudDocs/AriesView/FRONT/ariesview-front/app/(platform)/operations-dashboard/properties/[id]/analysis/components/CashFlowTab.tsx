'use client'

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface CashFlowTabProps {
  propertyId: string;
}

// Example Data Structure (matches financial_loans & financial_acquisition_costs)
const exampleLoans = [
  { id: 'l1', loan_amount: 3500000, interest_rate: 0.055, amortization_years: 30, loan_term_years: 10 },
];
const exampleAcquisitionCosts = {
    id: 'ac1',
    closing_costs: 75000,
    due_diligence_costs: 25000,
    initial_capex: 150000
};

const formatCurrency = (value: number | null | undefined) => { /* ... */ if (value === null || value === undefined) return 'N/A'; return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value); };
const formatPercentage = (value: number | null | undefined) => { /* ... */ if (value === null || value === undefined) return 'N/A'; return new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value); };

export default function CashFlowTab({ propertyId }: CashFlowTabProps) {
  // In the future, fetch data based on propertyId

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Cash Flow Inputs</h3>
      
      <h4 className="text-md font-semibold mt-6 mb-2">Loan Details</h4>
       <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Amount</TableHead>
            <TableHead>Interest Rate</TableHead>
            <TableHead>Amortization (Yrs)</TableHead>
            <TableHead>Term (Yrs)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exampleLoans.map((loan) => (
            <TableRow key={loan.id}>
              <TableCell>{formatCurrency(loan.loan_amount)}</TableCell>
              <TableCell>{formatPercentage(loan.interest_rate)}</TableCell>
              <TableCell>{loan.amortization_years}</TableCell>
              <TableCell>{loan.loan_term_years}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
       <h4 className="text-md font-semibold mt-6 mb-2">Acquisition Costs</h4>
       <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow>
                <TableCell>Closing Costs</TableCell>
                <TableCell>{formatCurrency(exampleAcquisitionCosts.closing_costs)}</TableCell>
            </TableRow>
             <TableRow>
                <TableCell>Due Diligence Costs</TableCell>
                <TableCell>{formatCurrency(exampleAcquisitionCosts.due_diligence_costs)}</TableCell>
            </TableRow>
             <TableRow>
                <TableCell>Initial CapEx</TableCell>
                <TableCell>{formatCurrency(exampleAcquisitionCosts.initial_capex)}</TableCell>
            </TableRow>
        </TableBody>
      </Table>

       <p className="text-sm text-gray-500 mt-4">Placeholder data shown. Integration with backend needed.</p>
    </div>
  );
} 