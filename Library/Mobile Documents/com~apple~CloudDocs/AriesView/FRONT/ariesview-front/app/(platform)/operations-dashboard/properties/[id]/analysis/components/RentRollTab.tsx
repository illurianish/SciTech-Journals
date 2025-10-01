'use client'

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface RentRollTabProps {
  propertyId: string;
}

// Example Data Structure (matches financial_leases & financial_units)
const exampleUnits = [
  {
    unit_id: 'u1',
    unit_number: '101',
    unit_square_feet: 1200,
    tenant_name: 'Global Corp',
    lease_start: '2023-03-01',
    lease_end: '2028-02-29',
    base_rent: 3500,
    rent_escalation: 0.03,
    recovery_type: 'NNN',
    reimburse_percent: 1.0,
    renewal_probability: 0.75,
    market_rent: 3800
  },
  {
    unit_id: 'u2',
    unit_number: '102',
    unit_square_feet: 850,
    tenant_name: 'Local Biz Inc.',
    lease_start: '2024-01-15',
    lease_end: '2027-01-14',
    base_rent: 2800,
    rent_escalation: 0.025,
    recovery_type: 'Modified Gross',
    reimburse_percent: null,
    renewal_probability: 0.60,
    market_rent: 3000
  },
  {
    unit_id: 'u3',
    unit_number: '103',
    unit_square_feet: 1500,
    tenant_name: 'Vacant', // Example vacant unit
    lease_start: null,
    lease_end: null,
    base_rent: null,
    rent_escalation: null,
    recovery_type: null,
    reimburse_percent: null,
    renewal_probability: null,
    market_rent: 3200 // Market rent for vacant space
  },
];

const formatCurrency = (value: number | null | undefined) => { /* ... same as before ... */ if (value === null || value === undefined) return 'N/A'; return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value); };
const formatPercentage = (value: number | null | undefined) => { /* ... same as before ... */ if (value === null || value === undefined) return 'N/A'; return new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value); };

export default function RentRollTab({ propertyId }: RentRollTabProps) {
  // In the future, fetch data based on propertyId

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Rent Roll</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Unit #</TableHead>
            <TableHead>Tenant</TableHead>
            <TableHead className="text-right">SqFt</TableHead>
            <TableHead>Lease End</TableHead>
            <TableHead className="text-right">Base Rent</TableHead>
            <TableHead className="text-right">Escalation</TableHead>
            {/* Add more columns as needed */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {exampleUnits.map((unit) => (
            <TableRow key={unit.unit_id}>
              <TableCell>{unit.unit_number}</TableCell>
              <TableCell>{unit.tenant_name}</TableCell>
              <TableCell className="text-right">{unit.unit_square_feet?.toLocaleString()}</TableCell>
              <TableCell>{unit.lease_end || 'N/A'}</TableCell>
              <TableCell className="text-right">{formatCurrency(unit.base_rent)}</TableCell>
              <TableCell className="text-right">{formatPercentage(unit.rent_escalation)}</TableCell>
              {/* Add more cells */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
       <p className="text-sm text-gray-500 mt-4">Placeholder data shown. Integration with backend needed.</p>
    </div>
  );
} 