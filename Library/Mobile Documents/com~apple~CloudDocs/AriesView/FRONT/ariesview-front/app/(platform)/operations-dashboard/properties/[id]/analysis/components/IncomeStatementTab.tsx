'use client'

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface IncomeStatementTabProps {
  propertyId: string;
}

// Example Data Structure (matches financial_income_items & financial_expense_items)
const exampleIncome = [
  { id: 'i1', name: 'Base Rental Revenue', category: 'Rental', amount_year_1: 550000, growth_rate: 0.03 },
  { id: 'i2', name: 'Parking Fees', category: 'Other', amount_year_1: 15000, growth_rate: 0.02 },
];
const exampleExpenses = [
  { id: 'e1', name: 'Property Taxes', category: 'Taxes', amount_year_1: 80000, growth_rate: 0.025, reimbursable: true },
  { id: 'e2', name: 'Insurance', category: 'Insurance', amount_year_1: 25000, growth_rate: 0.04, reimbursable: true },
  { id: 'e3', name: 'Management Fees', category: 'Operating Expenses', amount_year_1: 20000, growth_rate: 0.03, reimbursable: false },
  { id: 'e4', name: 'Utilities', category: 'Operating Expenses', amount_year_1: 45000, growth_rate: 0.02, reimbursable: true },
];

const formatCurrency = (value: number | null | undefined) => { /* ... */ if (value === null || value === undefined) return 'N/A'; return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value); };
const formatPercentage = (value: number | null | undefined) => { /* ... */ if (value === null || value === undefined) return 'N/A'; return new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value); };

export default function IncomeStatementTab({ propertyId }: IncomeStatementTabProps) {
  // In the future, fetch data based on propertyId

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Income Statement (Year 1 Estimates)</h3>
      
      <h4 className="text-md font-semibold mt-6 mb-2">Income</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount (Year 1)</TableHead>
            <TableHead>Growth Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exampleIncome.map((item) => (
            <TableRow key={item.id}>{
              /* Ensure no whitespace between cells */
            }<TableCell>{item.name}</TableCell>{
            }<TableCell>{item.category}</TableCell>{
            }<TableCell>{formatCurrency(item.amount_year_1)}</TableCell>{
            }<TableCell>{formatPercentage(item.growth_rate)}</TableCell>{
            }</TableRow>
          ))}
        </TableBody>
      </Table>

      <h4 className="text-md font-semibold mt-6 mb-2">Expenses</h4>
       <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount (Year 1)</TableHead>
            <TableHead>Growth Rate</TableHead>
             <TableHead>Reimbursable</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exampleExpenses.map((item) => (
            <TableRow key={item.id}>{
              /* Ensure no whitespace between cells */
            }<TableCell>{item.name}</TableCell>{
            }<TableCell>{item.category}</TableCell>{
            }<TableCell>{formatCurrency(item.amount_year_1)}</TableCell>{
            }<TableCell>{formatPercentage(item.growth_rate)}</TableCell>{
            }<TableCell>{item.reimbursable ? 'Yes' : 'No'}</TableCell>{
            }</TableRow>
          ))}
        </TableBody>
      </Table>

       <p className="text-sm text-gray-500 mt-4">Placeholder data shown. Integration with backend needed.</p>
    </div>
  );
} 