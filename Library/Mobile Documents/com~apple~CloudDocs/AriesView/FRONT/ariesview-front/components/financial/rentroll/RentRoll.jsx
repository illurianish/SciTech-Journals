"use client"

import { useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';


// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RentRoll = ({ propertyId }) => {
  const [editingRowId, setEditingRowId] = useState(null);
  const [editableRowData, setEditableRowData] = useState({});

  // Use the new hooks
  const { data: rentRollResponse, isLoading, error } = useRentRoll(propertyId);
  const updateUnitMutation = useUpdateUnit();
  const updateLeaseMutation = useUpdateLease();
  const deleteLeaseMutation = useDeleteLease();

  // Combine unit and lease data
  const rentRollData = useMemo(() => {
    if (!rentRollResponse?.data) return [];
    
    const { units = [], leases = [] } = rentRollResponse.data;
    return leases.map(lease => {
      const unit = units.find(u => u.id === lease.unit_id);
      return {
        ...lease,
        ...(unit || {}),
        lease_id: lease.id,
        unit_id: unit?.id,
      };
    });
  }, [rentRollResponse]);

  // Edit handlers
  const handleEditClick = (row) => {
    setEditingRowId(row.lease_id);
    setEditableRowData({ ...row });
  };

  const handleCancelClick = () => {
    setEditingRowId(null);
    setEditableRowData({});
  };

  const handleSaveClick = async (leaseId) => {
    const row = rentRollData.find(r => r.lease_id === leaseId);
    if (!row) return;

    try {
      // Update unit data
      const unitData = {
        unit_number: editableRowData.unit_number,
        square_feet: editableRowData.square_feet,
      };
      await updateUnitMutation.mutateAsync({ unitId: row.unit_id, unitData });

      // Update lease data
      const leaseData = {
        tenant_name: editableRowData.tenant_name,
        lease_start: editableRowData.lease_start,
        lease_end: editableRowData.lease_end,
        base_rent: editableRowData.base_rent,
        rent_escalation: editableRowData.rent_escalation,
        recovery_type: editableRowData.recovery_type,
        reimburse_percent: editableRowData.reimburse_percent,
        renewal_probability: editableRowData.renewal_probability,
        market_rent: editableRowData.market_rent,
      };
      await updateLeaseMutation.mutateAsync({ leaseId, leaseData });

      setEditingRowId(null);
      setEditableRowData({});
    } catch (err) {
      console.error("Error saving rent roll row:", err);
      // Error handling is managed by the mutation
    }
  };

  const handleDeleteClick = async (row) => {
    if (!window.confirm(`Are you sure you want to delete unit ${row.unit_number} / lease for ${row.tenant_name || 'Vacant'}?`)) {
      return;
    }

    try {
      await deleteLeaseMutation.mutateAsync(row.lease_id);
    } catch (err) {
      console.error("Error deleting rent roll row:", err);
      // Error handling is managed by the mutation
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    let processedValue = value;
    if (['rent_escalation', 'reimburse_percent', 'renewal_probability'].includes(name)) {
      processedValue = parseFloat(value) / 100;
    } else if (type === 'number') {
      processedValue = parseFloat(value) || 0;
    }

    setEditableRowData(prev => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  // Loading and error states
  if (isLoading) {
    return <div className="p-6 text-center">Loading rent roll data...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error.message}</div>;
  }

  if (rentRollData.length === 0) {
    return (
      <div className="bg-white p-6 rounded shadow text-center">
        <h3 className="text-xl font-semibold mb-4">No Rent Roll Data</h3>
        <p className="mb-4">No units or leases found for this property.</p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add New Unit/Lease
        </button>
      </div>
    );
  }

  // UI Components
  const RentRollTable = () => (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit #</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SqFt</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lease Start</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lease End</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Rent</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Escalation</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recovery Type</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reimbursement %</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renewal Probability %</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Rent</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Annual Rent</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {rentRollData.map((row) => (
          <tr key={row.lease_id} className="hover:bg-gray-100">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
              <input
                type="text"
                name="unit_number"
                value={editingRowId === row.lease_id ? editableRowData.unit_number : row.unit_number}
                onChange={handleInputChange}
                className="bg-blue-50"
                disabled={editingRowId !== row.lease_id}
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
              <input
                type="text"
                name="tenant_name"
                value={editingRowId === row.lease_id ? editableRowData.tenant_name : row.tenant_name}
                onChange={handleInputChange}
                className="bg-blue-50"
                disabled={editingRowId !== row.lease_id}
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
              <input
                type="number"
                name="square_feet"
                value={editingRowId === row.lease_id ? editableRowData.square_feet : row.square_feet}
                onChange={handleInputChange}
                className="bg-blue-50"
                disabled={editingRowId !== row.lease_id}
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
              <input
                type="date"
                name="lease_start"
                value={editingRowId === row.lease_id ? formatDateForInput(editableRowData.lease_start) : formatDateForInput(row.lease_start)}
                onChange={handleInputChange}
                className="bg-blue-50"
                disabled={editingRowId !== row.lease_id}
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
              <input
                type="date"
                name="lease_end"
                value={editingRowId === row.lease_id ? formatDateForInput(editableRowData.lease_end) : formatDateForInput(row.lease_end)}
                onChange={handleInputChange}
                className="bg-blue-50"
                disabled={editingRowId !== row.lease_id}
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
              <input
                type="number"
                name="base_rent"
                value={editingRowId === row.lease_id ? editableRowData.base_rent : row.base_rent}
                onChange={handleInputChange}
                className="bg-blue-50"
                disabled={editingRowId !== row.lease_id}
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
              <input
                type="number"
                name="rent_escalation"
                value={editingRowId === row.lease_id ? (editableRowData.rent_escalation * 100) : (row.rent_escalation * 100)}
                onChange={handleInputChange}
                className="bg-blue-50"
                disabled={editingRowId !== row.lease_id}
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
              <select
                name="recovery_type"
                value={editingRowId === row.lease_id ? editableRowData.recovery_type : row.recovery_type}
                onChange={handleInputChange}
                className="bg-blue-50"
                disabled={editingRowId !== row.lease_id}
              >
                <option value="NNN">NNN</option>
                <option value="Modified Gross">Modified Gross</option>
                <option value="Gross">Gross</option>
              </select>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
              <input
                type="number"
                name="reimburse_percent"
                value={editingRowId === row.lease_id ? (editableRowData.reimburse_percent * 100) : (row.reimburse_percent * 100)}
                onChange={handleInputChange}
                className="bg-blue-50"
                disabled={editingRowId !== row.lease_id}
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
              <input
                type="number"
                name="renewal_probability"
                value={editingRowId === row.lease_id ? (editableRowData.renewal_probability * 100) : (row.renewal_probability * 100)}
                onChange={handleInputChange}
                className="bg-blue-50"
                disabled={editingRowId !== row.lease_id}
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
              <input
                type="number"
                name="market_rent"
                value={editingRowId === row.lease_id ? editableRowData.market_rent : row.market_rent}
                onChange={handleInputChange}
                className="bg-blue-50"
                disabled={editingRowId !== row.lease_id}
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
              {formatCurrency(calculateAnnualRent(row.base_rent, row.square_feet))}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
              {editingRowId === row.lease_id ? (
                <>
                  <button 
                    onClick={() => handleSaveClick(row.lease_id)} 
                    className="text-green-600 hover:text-green-900"
                    disabled={updateUnitMutation.isPending || updateLeaseMutation.isPending}
                  >
                    Save
                  </button>
                  <button onClick={handleCancelClick} className="ml-2 text-red-600 hover:text-red-900">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => handleEditClick(row)} className="text-blue-600 hover:text-blue-900">
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(row)} 
                    className="ml-2 text-red-600 hover:text-red-900"
                    disabled={deleteLeaseMutation.isPending}
                  >
                    Delete
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const LeaseExpirationChart = () => {
    const data = {
      labels: Array.from({ length: 10 }, (_, i) => `Year ${i + 1}`),
      datasets: [
        {
          label: 'Lease Expiration %',
          data: calculateLeaseExpirationData(rentRollData),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
        },
      ],
    };

    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Lease Expiration Schedule</h3>
        <Bar data={data} options={{ maintainAspectRatio: false }} />
      </div>
    );
  };

  const SummaryStatistics = () => (
    <div className="mt-6 grid grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded shadow">
        <h4 className="text-sm font-semibold">Total Square Footage</h4>
        <p className="text-black">{calculateTotalSqFt(rentRollData).toLocaleString()}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h4 className="text-sm font-semibold">Average Rent per SF</h4>
        <p className="text-black">{formatCurrency(calculateAverageRentPerSqFt(rentRollData), true)}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h4 className="text-sm font-semibold">Current Occupancy %</h4>
        <p className="text-black">{formatPercent(calculateOccupancy(rentRollData))}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h4 className="text-sm font-semibold">Weighted Average Lease Term</h4>
        <p className="text-black">{calculateWALT(rentRollData).toFixed(1)} months</p>
      </div>
    </div>
  );

  const RentProjectionTable = () => (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">10-Year Rent Projection</h3>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projected Rent</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.from({ length: 10 }, (_, i) => (
            <tr key={i} className="hover:bg-gray-100">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-black">Year {i + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                {formatCurrency(calculateProjectedRent(rentRollData, i + 1))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Rent Roll</h2>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add New Unit/Lease
        </button>
      </div>
      
      <div className="bg-white p-6 rounded shadow overflow-x-auto">
        <RentRollTable />
      </div>
      
      <LeaseExpirationChart />
      <SummaryStatistics />
      <RentProjectionTable />
    </div>
  );
};

export default RentRoll; 