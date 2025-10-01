import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, TextField, Divider, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
// Placeholder for chart component - assuming Recharts or similar
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for chart and table (replace with actual data fetching/calculations)
// TODO: Replace mockChartData with calculations based on projected NOI and Cash Flow
const mockChartData = [
  { year: 'Y1', noi: 400000, cashFlow: 250000 },
  { year: 'Y2', noi: 420000, cashFlow: 270000 },
  { year: 'Y3', noi: 440000, cashFlow: 290000 },
  { year: 'Y4', noi: 460000, cashFlow: 310000 },
  { year: 'Y5', noi: 480000, cashFlow: 330000 },
  { year: 'Y6', noi: 500000, cashFlow: 350000 },
  { year: 'Y7', noi: 520000, cashFlow: 370000 },
  { year: 'Y8', noi: 540000, cashFlow: 390000 },
  { year: 'Y9', noi: 560000, cashFlow: 410000 },
  { year: 'Y10', noi: 580000, cashFlow: 430000 },
];

// TODO: Replace mockPerformanceSummary with actual calculated data
// Need Occupancy, Revenue, NOI, Cash Flow, Value projections for years 1-10
const mockPerformanceSummary = Array.from({ length: 10 }, (_, i) => ({
  year: i + 1,
  occupancy: 0.95 - i * 0.005, // Placeholder
  revenue: 600000 + i * 25000, // Placeholder
  noi: 400000 + i * 20000,
  cashFlow: 250000 + i * 20000,
  value: 6000000 + i * 200000, // Placeholder
  debtService: 150000, // Example static value - needed for DSCR calc
  // dscr: (400000 + i * 20000) / 150000, // Not displayed in table anymore, but needed for DSCR highlight
}));

// Helper for editable fields (Blue Text)
const EditableField = ({ label, value, onChange, InputProps = {}, ...props }) => (
  <TextField
    label={label}
    value={value}
    onChange={onChange}
    variant="standard"
    InputProps={{ ...InputProps, style: { ...InputProps.style, color: 'blue' } }}
    InputLabelProps={{ shrink: true }}
    sx={{ mb: 1, '& .MuiInput-underline:before': { borderBottomColor: 'blue' } }}
    {...props}
  />
);

// Helper for calculated fields (Black Text)
const CalculatedField = ({ label, value, ...props }) => (
  <Typography variant="body1" sx={{ mb: 1 }} {...props}>
    <strong>{label}:</strong> {value}
  </Typography>
);

function SummaryDashboard({ propertyId, initialData }) {
  const [propertyDetails, setPropertyDetails] = useState({
    name: initialData?.name || 'Sample Property',
    address: initialData?.address || '123 Main St',
    type: initialData?.type || 'Office',
    square_feet: initialData?.square_feet || '',
    purchase_date: initialData?.purchase_date ? initialData.purchase_date.split('T')[0] : '',
    purchase_price: initialData?.purchase_price || '',
    exit_year: initialData?.exit_year || '10', // Default to year 10
    exit_cap_rate: initialData?.exit_cap_rate || '',
  });

  // Calculated financial metrics
  const [financialMetrics, setFinancialMetrics] = useState({
    // TODO: Calculate Current Value (e.g., based on current NOI and market cap rate?)
    currentValue: 6200000, // Placeholder
    // TODO: Calculate NOI (likely pull from Income Statement data)
    noi: 550000, // Placeholder
    // TODO: Calculate Cap Rate (NOI / Current Value or Purchase Price)
    capRate: 0.0887, // Placeholder (NOI / Placeholder Current Value)
    // TODO: Calculate Cash on Cash Return (Annual Cash Flow / Equity Investment)
    cashOnCashReturn: 0.08, // Placeholder
    // TODO: Calculate IRR (Requires cash flow stream and exit value)
    irr: 0.12, // Placeholder (12%)
    // TODO: Calculate DSCR (NOI / Annual Debt Service)
    dscr: 1.45, // Placeholder
  });

  // TODO: Replace with actual chart data state
  const [chartData, setChartData] = useState(mockChartData);
  // TODO: Replace with actual performance summary data state
  const [performanceSummary, setPerformanceSummary] = useState(mockPerformanceSummary);

  useEffect(() => {
      // TODO: Fetch actual summary data from /api/financial/summary/:propertyId on load
      console.log(`Fetching summary data for property ${propertyId}`);
      // This effect should ideally fetch the base data (purchase info, sqft, exit assumptions)
      // Other effects might be needed to fetch data for calculations (rent roll, income, expenses, cash flow)
      // Or, a more comprehensive backend endpoint could provide all necessary data.

      // Example setting state based on potentially updated initialData prop or fetched data
      setPropertyDetails(prev => ({
          ...prev,
          name: initialData?.name || prev.name,
          address: initialData?.address || prev.address,
          type: initialData?.type || prev.type,
          square_feet: initialData?.square_feet !== undefined ? initialData.square_feet : prev.square_feet,
          purchase_date: initialData?.purchase_date ? initialData.purchase_date.split('T')[0] : prev.purchase_date,
          purchase_price: initialData?.purchase_price !== undefined ? initialData.purchase_price : prev.purchase_price,
          exit_year: initialData?.exit_year !== undefined ? initialData.exit_year.toString() : prev.exit_year, // Ensure string for Select
          exit_cap_rate: initialData?.exit_cap_rate !== undefined ? initialData.exit_cap_rate : prev.exit_cap_rate,
      }));

      // TODO: Trigger calculations for financialMetrics, performanceSummary, chartData
      // based on fetched data and propertyDetails (e.g., exit_year).
      // setFinancialMetrics({...calculated values});
      // setPerformanceSummary([...calculated values]);
      // setChartData([...calculated values]);

  }, [propertyId, initialData]); // Rerun if propertyId or initial data changes


  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setPropertyDetails(prev => ({ ...prev, [name]: value }));

    // TODO: Add debounced PUT request to /api/financial/summary/:propertyId here
    // This should save the editable fields: square_feet, purchase_date, purchase_price, exit_year, exit_cap_rate
    console.log(`Updated ${name}: ${value} - Needs PUT request`);

    // TODO: Recalculate dependent metrics if needed (e.g., if exit_year changes, highlight in table might change)
     if (name === 'exit_year') {
         // Force recalculation/refresh of dependent components if necessary
         console.log("Exit year changed, potentially update table highlight")
     }
  };

  // Formatters for display
  const formatCurrency = (value) => value ? `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : '$0';
  const formatPercent = (value, digits = 1) => value ? `${(Number(value) * 100).toFixed(digits)}%` : '0.0%';

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>

        {/* Property Information Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Property Information</Typography>
            <CalculatedField label="Property Name" value={propertyDetails.name} />
            <CalculatedField label="Address" value={propertyDetails.address} />
            <CalculatedField label="Property Type" value={propertyDetails.type} />
            <EditableField
              label="Square Feet"
              name="square_feet"
              value={propertyDetails.square_feet}
              onChange={handleDetailChange}
              type="number"
              fullWidth
            />
            <EditableField
              label="Purchase Date"
              name="purchase_date"
              value={propertyDetails.purchase_date}
              onChange={handleDetailChange}
              type="date"
              fullWidth
            />
             <EditableField
              label="Purchase Price"
              name="purchase_price"
              value={propertyDetails.purchase_price}
              onChange={handleDetailChange}
              type="number"
              // Example: InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
              fullWidth
            />
          </Paper>
        </Grid>

        {/* Financial Highlights & Exit Assumptions Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Financial Highlights</Typography>
            {/* Calculated Fields */}
            <CalculatedField label="Current Value" value={formatCurrency(financialMetrics.currentValue)} />
            <CalculatedField label="Net Operating Income (NOI)" value={formatCurrency(financialMetrics.noi)} />
            <CalculatedField label="Cap Rate" value={formatPercent(financialMetrics.capRate, 2)} />
            <CalculatedField label="Cash-on-Cash Return" value={formatPercent(financialMetrics.cashOnCashReturn)} />
            <CalculatedField label="IRR (Levered)" value={formatPercent(financialMetrics.irr, 1)} />
            <CalculatedField label="DSCR" value={financialMetrics.dscr.toFixed(2)} />

            <Divider sx={{ my: 2 }} />
             <Typography variant="subtitle1" gutterBottom>Exit Assumptions</Typography>
             {/* Editable Fields */}
             <FormControl fullWidth variant="standard" sx={{ mb: 1, '& .MuiInput-underline:before': { borderBottomColor: 'blue' } }}>
                 <InputLabel id="exit-year-label" shrink={true} style={{ color: 'blue' }}>Target Exit Year</InputLabel>
                 <Select
                    labelId="exit-year-label"
                    name="exit_year"
                    value={propertyDetails.exit_year}
                    onChange={handleDetailChange}
                    label="Target Exit Year" // Keep label for accessibility, though InputLabel is visible
                    style={{ color: 'blue' }}
                 >
                    {/* Generate year options (e.g., 1-10) */}
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(year => (
                        <MenuItem key={year} value={year.toString()}>{`Year ${year}`}</MenuItem>
                    ))}
                 </Select>
             </FormControl>
             <EditableField
              label="Target Exit Cap Rate (%)"
              name="exit_cap_rate"
              value={propertyDetails.exit_cap_rate ? (parseFloat(propertyDetails.exit_cap_rate) * 100).toString() : ''}
              onChange={(e) => {
                  const displayValue = e.target.value;
                  // Allow empty input or valid number input
                  if (displayValue === '' || !isNaN(parseFloat(displayValue))) {
                       const decimalValue = displayValue === '' ? '' : (parseFloat(displayValue) / 100).toString();
                       handleDetailChange({ target: { name: 'exit_cap_rate', value: decimalValue } });
                  }
              }}
              type="number"
              step="0.01"
              fullWidth
            />
          </Paper>
        </Grid>

        {/* 10-Year Performance Summary Table Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>10-Year Performance Summary (Projected)</Typography>
            <Box sx={{ overflowX: 'auto' }}>
              {/* TODO: Consider replacing with MUI DataGrid for better features */}
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={tableHeaderStyle}>Year</th>
                    <th style={tableHeaderStyle}>Occupancy</th>
                    <th style={tableHeaderStyle}>Revenue</th>
                    <th style={tableHeaderStyle}>NOI</th>
                    <th style={tableHeaderStyle}>Cash Flow</th>
                    <th style={tableHeaderStyle}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {/* // TODO: Replace mockPerformanceSummary with state variable `performanceSummary` holding calculated data */}
                  {performanceSummary.map((row) => (
                    <tr key={row.year} style={row.year.toString() === propertyDetails.exit_year ? exitRowStyle : {}}>
                      <td style={tableCellStyle}>{row.year}</td>
                      <td style={tableCellStyle}>{formatPercent(row.occupancy)}</td>
                      <td style={tableCellStyle}>{formatCurrency(row.revenue)}</td>
                      <td style={tableCellStyle}>{formatCurrency(row.noi)}</td>
                      <td style={tableCellStyle}>{formatCurrency(row.cashFlow)}</td>
                      <td style={tableCellStyle}>{formatCurrency(row.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Paper>
        </Grid>

        {/* NOI & Cash Flow Performance Chart Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>NOI & Cash Flow Performance (Projected)</Typography>
             {/* TODO: Implement actual chart using chartData state */}
             <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed grey', mt: 2 }}>
                 <Typography color="textSecondary">Chart Placeholder (e.g., Recharts LineChart)</Typography>
                 {/* Example Recharts Structure:
                 <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}> // Use state: chartData
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" /> // Assumes chartData has { year: 'Y1', ... } structure
                        <YAxis tickFormatter={formatCurrency} />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                        <Line type="monotone" dataKey="noi" stroke="#1976d2" name="NOI" activeDot={{ r: 8 }} /> // Primary color
                        <Line type="monotone" dataKey="cashFlow" stroke="#f57c00" name="Cash Flow" /> // Secondary color
                    </LineChart>
                 </ResponsiveContainer>
                 */}
             </Box>
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
}

// Styles for table
const tableHeaderStyle = {
  borderBottom: '2px solid #ddd',
  padding: '12px 8px',
  textAlign: 'left',
  backgroundColor: '#f8f9fa',
  fontWeight: 'bold',
};

const tableCellStyle = {
  borderBottom: '1px solid #eee',
  padding: '10px 8px',
  textAlign: 'left',
};

// Style for highlighted exit year row
const exitRowStyle = {
    backgroundColor: 'rgba(25, 118, 210, 0.1)', // Light blue background
    fontWeight: 'bold',
};


export default SummaryDashboard; 