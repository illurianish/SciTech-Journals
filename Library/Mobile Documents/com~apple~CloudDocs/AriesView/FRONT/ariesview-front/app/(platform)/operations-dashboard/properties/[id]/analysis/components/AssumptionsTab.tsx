'use client'

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface AssumptionsTabProps {
  propertyId: string;
}

// Example Data Structure (matches financial_assumptions)
const exampleData = {
    id: 'a1',
    acquisition_cap_rate: 0.0600,
    exit_cap_rate: 0.0650,
    projected_value_growth: null, // Example: Not used if exit cap is primary
    vacancy_rate: 0.0500, // 5%
    market_rent_growth: 0.0300, // 3%
    renewal_probability: 0.7000, // 70%
    inflation_rate: 0.0250 // 2.5%
};

const formatPercentage = (value: number | null | undefined) => { /* ... */ if (value === null || value === undefined) return 'N/A'; return new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value); };

export default function AssumptionsTab({ propertyId }: AssumptionsTabProps) {
  // In the future, fetch data based on propertyId

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Financial Assumptions</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Assumption</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow>
                <TableCell>Acquisition Cap Rate</TableCell>
                <TableCell>{formatPercentage(exampleData.acquisition_cap_rate)}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Exit Cap Rate</TableCell>
                <TableCell>{formatPercentage(exampleData.exit_cap_rate)}</TableCell>
            </TableRow>
             <TableRow>
                <TableCell>Projected Value Growth (Annual)</TableCell>
                <TableCell>{formatPercentage(exampleData.projected_value_growth) || 'N/A (Using Exit Cap)'}</TableCell>
            </TableRow>
             <TableRow>
                <TableCell>General Vacancy Rate</TableCell>
                <TableCell>{formatPercentage(exampleData.vacancy_rate)}</TableCell>
            </TableRow>
             <TableRow>
                <TableCell>Market Rent Growth (Annual)</TableCell>
                <TableCell>{formatPercentage(exampleData.market_rent_growth)}</TableCell>
            </TableRow>
             <TableRow>
                <TableCell>Renewal Probability</TableCell>
                <TableCell>{formatPercentage(exampleData.renewal_probability)}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Expense Inflation Rate (Annual)</TableCell>
                <TableCell>{formatPercentage(exampleData.inflation_rate)}</TableCell>
            </TableRow>
        </TableBody>
      </Table>
       <p className="text-sm text-gray-500 mt-4">Placeholder data shown. Integration with backend needed.</p>
    </div>
  );
} 