'use client'

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SummaryDashboardTabProps {
  propertyId: string;
}

// Example Data Structure (matches financial_property_details)
const exampleData = {
  purchase_price: 5000000,
  purchase_date: '2022-01-15',
  square_feet: 105000,
  exit_year: 2032,
  exit_cap_rate: 0.0650, // 6.50%
};

const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(value);
};

const formatPercentage = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
        style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2
    }).format(value);
};

export default function SummaryDashboardTab({ propertyId }: SummaryDashboardTabProps) {
  // In the future, fetch data based on propertyId

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Summary Dashboard</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Metric</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Purchase Price</TableCell>
            <TableCell>{formatCurrency(exampleData.purchase_price)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Purchase Date</TableCell>
            <TableCell>{exampleData.purchase_date}</TableCell>
          </TableRow>
           <TableRow>
            <TableCell>Square Feet</TableCell>
            <TableCell>{exampleData.square_feet?.toLocaleString()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Target Exit Year</TableCell>
            <TableCell>{exampleData.exit_year}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Target Exit Cap Rate</TableCell>
            <TableCell>{formatPercentage(exampleData.exit_cap_rate)}</TableCell>
          </TableRow>
          {/* Add more summary metrics as needed */}
        </TableBody>
      </Table>
      <p className="text-sm text-gray-500 mt-4">Placeholder data shown. Integration with backend needed.</p>
    </div>
  );
} 