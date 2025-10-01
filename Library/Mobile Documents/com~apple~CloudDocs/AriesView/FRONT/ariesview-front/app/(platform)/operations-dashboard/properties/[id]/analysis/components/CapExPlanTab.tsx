'use client'

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface CapExPlanTabProps {
  propertyId: string;
}

// Example Data Structure (matches financial_capital_projects & financial_capex_settings)
const exampleProjects = [
  { id: 'cp1', name: 'Roof Replacement', cost: 120000, year: 2025, notes: 'Complete replacement needed' },
  { id: 'cp2', name: 'HVAC Upgrades (Units 101-105)', cost: 35000, year: 2026, notes: 'Upgrade to high-efficiency units' },
];
const exampleSettings = {
    id: 'cs1',
    ti_allowance_new_lease: 25.00,
    ti_allowance_renewal: 15.00,
    leasing_commission_new_lease: 0.06,
    leasing_commission_renewal: 0.03,
    annual_reserve_per_sqft: 0.50
};

const formatCurrency = (value: number | null | undefined, digits = 0) => { /* ... */ if (value === null || value === undefined) return 'N/A'; return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value); };
const formatPercentage = (value: number | null | undefined) => { /* ... */ if (value === null || value === undefined) return 'N/A'; return new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value); };

export default function CapExPlanTab({ propertyId }: CapExPlanTabProps) {
  // In the future, fetch data based on propertyId

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Capital Expenditures Plan</h3>
      
      <h4 className="text-md font-semibold mt-6 mb-2">Planned Projects</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exampleProjects.map((proj) => (
            <TableRow key={proj.id}>
              <TableCell>{proj.name}</TableCell>
              <TableCell>{proj.year}</TableCell>
              <TableCell>{formatCurrency(proj.cost)}</TableCell>
              <TableCell>{proj.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <h4 className="text-md font-semibold mt-6 mb-2">Leasing & Reserve Settings</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Setting</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow>
                <TableCell>TI Allowance (New Lease - $/sqft)</TableCell>
                <TableCell>{formatCurrency(exampleSettings.ti_allowance_new_lease, 2)}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>TI Allowance (Renewal - $/sqft)</TableCell>
                <TableCell>{formatCurrency(exampleSettings.ti_allowance_renewal, 2)}</TableCell>
            </TableRow>
             <TableRow>
                <TableCell>Leasing Commission (New)</TableCell>
                <TableCell>{formatPercentage(exampleSettings.leasing_commission_new_lease)}</TableCell>
            </TableRow>
             <TableRow>
                <TableCell>Leasing Commission (Renewal)</TableCell>
                <TableCell>{formatPercentage(exampleSettings.leasing_commission_renewal)}</TableCell>
            </TableRow>
             <TableRow>
                <TableCell>Annual Reserve ($/sqft)</TableCell>
                <TableCell>{formatCurrency(exampleSettings.annual_reserve_per_sqft, 2)}</TableCell>
            </TableRow>
        </TableBody>
      </Table>

       <p className="text-sm text-gray-500 mt-4">Placeholder data shown. Integration with backend needed.</p>
    </div>
  );
} 