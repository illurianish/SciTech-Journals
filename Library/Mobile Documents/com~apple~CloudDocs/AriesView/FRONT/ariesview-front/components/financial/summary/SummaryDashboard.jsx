"use client"

import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SummaryDashboard = ({ propertyId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editableData, setEditableData] = useState(defaultEditableData);

  // Use the new hooks
  const { 
    data: propertyData, 
    isLoading, 
    error 
  } = usePropertySummary(propertyId);
  
  const updatePropertyMutation = useUpdatePropertySummary();

  // Initialize editable data when property data loads
  useEffect(() => {
    if (propertyData) {
      setEditableData({
        purchase_price: propertyData.purchase_price || defaultEditableData.purchase_price,
        purchase_date: propertyData.purchase_date ? new Date(propertyData.purchase_date) : defaultEditableData.purchase_date,
        square_feet: propertyData.square_feet || defaultEditableData.square_feet,
        exit_year: propertyData.exit_year || defaultEditableData.exit_year,
        exit_cap_rate: propertyData.exit_cap_rate || defaultEditableData.exit_cap_rate,
      });
    }
  }, [propertyData]);

  // Calculate financial values and projections
  const calculatedData = useMemo(() => {
    if (!propertyData) return calculateInitialValues(defaultPropertyData);
    return calculateInitialValues(propertyData);
  }, [propertyData]);

  const projections = useMemo(() => {
    if (!propertyData) return generateProjections(defaultPropertyData);
    return generateProjections(propertyData);
  }, [propertyData]);

  // Chart data
  const chartData = useMemo(() => generateChartData(projections), [projections]);
  const chartOptions = useMemo(() => generateChartOptions(), []);

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle numeric inputs
    if (name === 'purchase_price' || name === 'square_feet') {
      setEditableData({
        ...editableData,
        [name]: parseFloat(value) || 0,
      });
    }
    // Handle percentage inputs
    else if (name === 'exit_cap_rate') {
      setEditableData({
        ...editableData,
        [name]: parseFloat(value) / 100, // Convert from percentage to decimal
      });
    }
    // Handle select inputs
    else if (name === 'exit_year') {
      setEditableData({
        ...editableData,
        [name]: parseInt(value, 10),
      });
    }
    // Default handler for other inputs
    else {
      setEditableData({
        ...editableData,
        [name]: value,
      });
    }
  };

  // Handle date selection
  const handleDateChange = (date) => {
    setEditableData({
      ...editableData,
      purchase_date: date,
    });
    setShowDatePicker(false);
  };

  // Handle save button
  const handleSave = async () => {
    try {
      // Validate data before saving
      const errors = validatePropertyData(editableData);
      if (errors.length > 0) {
        alert('Validation errors:\n' + errors.join('\n'));
        return;
      }

      await updatePropertyMutation.mutateAsync({
        propertyId,
        propertyData: editableData,
      });

      setIsEditing(false);
    } catch (err) {
      console.error('Error updating property data:', err);
      alert('Error updating property data: ' + err.message);
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    if (propertyData) {
      setEditableData({
        purchase_price: propertyData.purchase_price || defaultEditableData.purchase_price,
        purchase_date: propertyData.purchase_date ? new Date(propertyData.purchase_date) : defaultEditableData.purchase_date,
        square_feet: propertyData.square_feet || defaultEditableData.square_feet,
        exit_year: propertyData.exit_year || defaultEditableData.exit_year,
        exit_cap_rate: propertyData.exit_cap_rate || defaultEditableData.exit_cap_rate,
      });
    }
    setIsEditing(false);
  };

  // Loading and error states
  if (isLoading && !propertyData) {
    return <div className="p-6 text-center">Loading property data...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error.message}</div>;
  }

  // Use property data or default data
  const currentPropertyData = propertyData || defaultPropertyData;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Financial Summary Dashboard</h2>
        <div className="flex space-x-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={updatePropertyMutation.isPending}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 disabled:opacity-50"
              >
                {updatePropertyMutation.isPending ? 'Saving...' : 'Save'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Property Information Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Property Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Property Name (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Property Name</label>
            <div className="h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              {currentPropertyData?.property_name || 'Unknown Property'}
            </div>
          </div>

          {/* Property Address (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Address</label>
            <div className="h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              {currentPropertyData?.address || 'Unknown Address'}
            </div>
          </div>

          {/* Property Type (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Property Type</label>
            <div className="h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              {currentPropertyData?.property_type || 'Unknown Type'}
            </div>
          </div>

          {/* Square Footage (Editable - Blue) */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Square Footage</label>
            {isEditing ? (
              <input
                type="number"
                name="square_feet"
                value={editableData.square_feet}
                onChange={handleInputChange}
                className="h-10 w-full px-3 py-2 border border-blue-300 rounded-md bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="h-10 px-3 py-2 border border-blue-300 rounded-md bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700 text-blue-600 dark:text-blue-400">
                {formatNumber(editableData.square_feet)} SF
              </div>
            )}
          </div>

          {/* Purchase Date (Editable - Blue) */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Purchase Date</label>
            {isEditing ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="h-10 w-full px-3 py-2 border border-blue-300 rounded-md bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
                >
                  <span>
                    {editableData.purchase_date
                      ? formatDateForDisplay(editableData.purchase_date)
                      : 'Select date'}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                {showDatePicker && (
                  <div className="absolute z-10 mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 p-2">
                    <input
                      type="date"
                      value={formatDateForInputSummary(editableData.purchase_date)}
                      onChange={(e) => handleDateChange(new Date(e.target.value))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="h-10 px-3 py-2 border border-blue-300 rounded-md bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700 text-blue-600 dark:text-blue-400">
                {formatDateForDisplay(editableData.purchase_date)}
              </div>
            )}
          </div>

          {/* Purchase Price (Editable - Blue) */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Purchase Price</label>
            {isEditing ? (
              <input
                type="number"
                name="purchase_price"
                value={editableData.purchase_price}
                onChange={handleInputChange}
                className="h-10 w-full px-3 py-2 border border-blue-300 rounded-md bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="h-10 px-3 py-2 border border-blue-300 rounded-md bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700 text-blue-600 dark:text-blue-400">
                {formatCurrency(editableData.purchase_price)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Financial Highlights Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Financial Highlights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Current Value (Calculated - Black/Default) */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Current Value</label>
            <div className="h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              {formatCurrency(calculatedData.current_value)}
            </div>
          </div>

          {/* NOI (Calculated - Black/Default) */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Net Operating Income</label>
            <div className="h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              {formatCurrency(calculatedData.noi)}
            </div>
          </div>

          {/* Cap Rate (Calculated - Black/Default) */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Cap Rate</label>
            <div className="h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              {formatPercent(calculatedData.cap_rate)}
            </div>
          </div>

          {/* Cash on Cash Return (Calculated - Black/Default) */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Cash on Cash Return</label>
            <div className="h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              {formatPercent(calculatedData.cash_on_cash)}
            </div>
          </div>

          {/* IRR (Calculated - Black/Default) */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">IRR</label>
            <div className="h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              {formatPercent(calculatedData.irr)}
            </div>
          </div>

          {/* DSCR (Calculated - Black/Default) */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Debt Service Coverage Ratio</label>
            <div className="h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              {calculatedData.dscr.toFixed(2)}x
            </div>
          </div>

          {/* Exit Year (Editable - Blue) */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Exit Year</label>
            {isEditing ? (
              <select
                name="exit_year"
                value={editableData.exit_year}
                onChange={handleInputChange}
                className="h-10 w-full px-3 py-2 border border-blue-300 rounded-md bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20].map((year) => (
                  <option key={year} value={year}>
                    Year {year}
                  </option>
                ))}
              </select>
            ) : (
              <div className="h-10 px-3 py-2 border border-blue-300 rounded-md bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700 text-blue-600 dark:text-blue-400">
                Year {editableData.exit_year}
              </div>
            )}
          </div>

          {/* Exit Cap Rate (Editable - Blue) */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Exit Cap Rate</label>
            {isEditing ? (
              <input
                type="number"
                name="exit_cap_rate"
                value={(editableData.exit_cap_rate * 100).toFixed(2)}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                max="20"
                className="h-10 w-full px-3 py-2 border border-blue-300 rounded-md bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="h-10 px-3 py-2 border border-blue-300 rounded-md bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700 text-blue-600 dark:text-blue-400">
                {formatPercent(editableData.exit_cap_rate)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Summary Table */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">10-Year Performance Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Year
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Occupancy
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Revenue
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  NOI
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Cash Flow
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {projections.map((year) => (
                <tr
                  key={year.year}
                  className={year.year === editableData.exit_year ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    Year {year.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                    {formatPercent(year.occupancy)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                    {formatCurrency(year.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                    {formatCurrency(year.noi)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                    {formatCurrency(year.cashFlow)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                    {formatCurrency(year.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Performance Chart</h3>
        <div className="h-80 w-full">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default SummaryDashboard; 