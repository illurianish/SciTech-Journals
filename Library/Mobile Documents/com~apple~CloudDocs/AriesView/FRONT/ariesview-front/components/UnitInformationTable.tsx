import React from 'react';
import { useUnitInformationTable, UnitInformation } from '@/app/rest/unit';

interface UnitInformationTableProps {
  units?: UnitInformation[];
  setUnits?: (units: UnitInformation[]) => void;
}

const calculateRemainingTerm = (leaseFrom: string, leaseTo: string) => {
  if (!leaseFrom || !leaseTo) return 0;
  const from = new Date(leaseFrom);
  const to = new Date(leaseTo);
  if (isNaN(from.getTime()) || isNaN(to.getTime())) return 0;
  const months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  return Math.max(0, months);
};

const UnitInformationTable: React.FC<UnitInformationTableProps> = ({ units: propUnits, setUnits: propSetUnits }) => {
  const {
    units,
    setUnits,
    handleChange,
    handleAdd,
    handleDelete,
    summaryCalculations
  } = useUnitInformationTable(propUnits || []);

  // Use prop functions if provided, otherwise use hook functions
  const finalUnits = propUnits || units;
  const finalSetUnits = propSetUnits || setUnits;
  const finalHandleChange = propSetUnits ? handleChange : (idx: number, field: keyof UnitInformation, value: any) => {
    const updatedUnits = finalUnits.map((unit, i) => {
      if (i !== idx) return unit;
      let updated = { ...unit, [field]: value };
      if (field === 'leaseFrom' || field === 'leaseTo') {
        updated.remainingTerm = calculateRemainingTerm(updated.leaseFrom, updated.leaseTo);
      }
      return updated;
    });
    finalSetUnits(updatedUnits);
  };
  const finalHandleAdd = propSetUnits ? handleAdd : () => {
    const nextId = finalUnits.length > 0 ? Math.max(...finalUnits.map(u => u.id || 0)) + 1 : 1;
    finalSetUnits([
      ...finalUnits,
      {
        id: nextId,
        unitNumber: nextId,
        status: 'Occupied',
        tenantName: '',
        leaseType: '',
        y0MonthlyRent: 0,
        y0AnnualizedGross: 0,
        t12MonthlyRent: 0,
        t12AnnualizedGross: 0,
        proformaMonthlyRent: 0,
        proformaAnnualizedGross: 0,
        leaseFrom: '',
        leaseTo: '',
        remainingTerm: 0,
        amendmentType: '',
        securityDeposit: 0,
        rentableArea: 0,
      },
    ]);
  };
  const finalHandleDelete = propSetUnits ? handleDelete : (idx: number) => {
    finalSetUnits(finalUnits.filter((_, i) => i !== idx));
  };

  // Summary calculations
  const { totalProformaMonthlyRent, totalRemainingTerm } = propSetUnits ? {
    totalProformaMonthlyRent: finalUnits.reduce((sum, u) => sum + (parseFloat(u.proformaMonthlyRent as any) || 0), 0),
    totalRemainingTerm: finalUnits.reduce((sum, u) => sum + (parseInt(u.remainingTerm as any) || 0), 0)
  } : summaryCalculations;

  return (
    <div>
      {/* Summary Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
          <p className="text-sm font-medium opacity-90">Total Pro Forma Monthly Rent</p>
          <p className="text-4xl font-extrabold mt-2">${totalProformaMonthlyRent.toFixed(2)}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
          <p className="text-sm font-medium opacity-90">Total Remaining Term (Months)</p>
          <p className="text-4xl font-extrabold mt-2">{totalRemainingTerm}</p>
        </div>
      </section>
      {/* Table Section */}
      <section className="table-container bg-white w-full">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">Unit Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lease Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">y0 Monthly Rent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">y0 Pro forma Annualized Gross</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">t12 Monthly Rent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">t12 Pro forma Annualized Gross</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pro forma Monthly Rent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pro forma Annualized Gross</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lease From</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lease To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining Term</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amendment Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Security Deposit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rentable Area (SF)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {finalUnits.map((unit, idx) => (
              <tr key={unit.id || idx}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <input
                    type="number"
                    value={unit.unitNumber}
                    className="table-input unit-number"
                    readOnly
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <select
                    value={unit.status}
                    onChange={e => finalHandleChange(idx, 'status', e.target.value)}
                    className="table-input unit-status"
                  >
                    <option value="Occupied">Occupied</option>
                    <option value="Vacant">Vacant</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="text"
                    value={unit.tenantName}
                    onChange={e => finalHandleChange(idx, 'tenantName', e.target.value)}
                    placeholder="Tenant Name"
                    className="table-input tenant-name"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="text"
                    value={unit.leaseType}
                    onChange={e => finalHandleChange(idx, 'leaseType', e.target.value)}
                    placeholder="Lease Type"
                    className="table-input lease-type"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="number"
                    value={unit.y0MonthlyRent}
                    onChange={e => finalHandleChange(idx, 'y0MonthlyRent', e.target.value)}
                    step="0.01"
                    placeholder="0.00"
                    className="table-input y0-monthly-rent"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="number"
                    value={unit.y0AnnualizedGross}
                    onChange={e => finalHandleChange(idx, 'y0AnnualizedGross', e.target.value)}
                    step="0.01"
                    placeholder="0.00"
                    className="table-input y0-annualized-gross"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="number"
                    value={unit.t12MonthlyRent}
                    onChange={e => finalHandleChange(idx, 't12MonthlyRent', e.target.value)}
                    step="0.01"
                    placeholder="0.00"
                    className="table-input t12-monthly-rent"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="number"
                    value={unit.t12AnnualizedGross}
                    onChange={e => finalHandleChange(idx, 't12AnnualizedGross', e.target.value)}
                    step="0.01"
                    placeholder="0.00"
                    className="table-input t12-annualized-gross"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="number"
                    value={unit.proformaMonthlyRent}
                    onChange={e => finalHandleChange(idx, 'proformaMonthlyRent', e.target.value)}
                    step="0.01"
                    placeholder="0.00"
                    className="table-input proforma-monthly-rent"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="number"
                    value={unit.proformaAnnualizedGross}
                    onChange={e => finalHandleChange(idx, 'proformaAnnualizedGross', e.target.value)}
                    step="0.01"
                    placeholder="0.00"
                    className="table-input proforma-annualized-gross"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="date"
                    value={unit.leaseFrom}
                    onChange={e => finalHandleChange(idx, 'leaseFrom', e.target.value)}
                    className="table-input lease-from"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="date"
                    value={unit.leaseTo}
                    onChange={e => finalHandleChange(idx, 'leaseTo', e.target.value)}
                    className="table-input lease-to"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="number"
                    value={unit.remainingTerm}
                    className="table-input remaining-term"
                    readOnly
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="text"
                    value={unit.amendmentType}
                    onChange={e => finalHandleChange(idx, 'amendmentType', e.target.value)}
                    placeholder="Amendment Type"
                    className="table-input amendment-type"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="number"
                    value={unit.securityDeposit}
                    onChange={e => finalHandleChange(idx, 'securityDeposit', e.target.value)}
                    step="0.01"
                    placeholder="0.00"
                    className="table-input security-deposit"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="number"
                    value={unit.rentableArea}
                    onChange={e => finalHandleChange(idx, 'rentableArea', e.target.value)}
                    placeholder="0"
                    className="table-input rentable-area"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    type="button"
                    onClick={() => finalHandleDelete(idx)}
                    className="text-red-600 hover:text-red-900 delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {/* Add New Unit Button */}
      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={finalHandleAdd}
          id="addUnitBtn"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Add New Unit
        </button>
      </div>
    </div>
  );
};

export default UnitInformationTable;
