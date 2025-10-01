// Looks like not in use
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Placeholder for financial calculations - Consider using a library like 'financejs' or 'formulajs'
// import { /* PMT, IRR, ... */ } from 'financejs';

// --- Helper Functions ---
const formatNumber = (value, style, digits = 2) => {
  if (value === null || typeof value === 'undefined' || isNaN(value)) return 'N/A';
  try {
      const options = {};
      if (style === 'currency') { options.style = 'currency'; options.currency = 'USD'; options.minimumFractionDigits = 0; options.maximumFractionDigits = 0; }
      else if (style === 'percent') { options.style = 'percent'; options.minimumFractionDigits = digits; options.maximumFractionDigits = digits; }
      else if (style === 'integer') { options.minimumFractionDigits = 0; options.maximumFractionDigits = 0; }
      else { options.minimumFractionDigits = digits; options.maximumFractionDigits = digits; }
      return new Intl.NumberFormat('en-US', options).format(value);
  } catch (error) { console.error("CF Number Format Error:", error); return String(value); }
};

// Basic PMT calculation (Interest Rate per period, Number of periods, Present Value)
const calculatePMT = (ratePerPeriod, numberOfPeriods, presentValue) => {
    if (ratePerPeriod === 0) return presentValue / numberOfPeriods;
    return (presentValue * ratePerPeriod * Math.pow(1 + ratePerPeriod, numberOfPeriods)) / (Math.pow(1 + ratePerPeriod, numberOfPeriods) - 1);
};

// Basic IRR calculation (requires iteration - simplified placeholder)
// A proper implementation would use Newton-Raphson or similar.
const calculateIRR = (cashFlows, guess = 0.1) => {
    // Very basic placeholder - Use a library for accuracy
    if (!cashFlows || cashFlows.length === 0 || cashFlows[0] >= 0) return null; // Need initial negative investment
    const maxIterations = 100;
    const tolerance = 1e-6;
    let irr = guess;

    for (let i = 0; i < maxIterations; i++) {
        let npv = 0;
        let derivative = 0;
        for (let t = 0; t < cashFlows.length; t++) {
            npv += cashFlows[t] / Math.pow(1 + irr, t);
            derivative -= (t * cashFlows[t]) / Math.pow(1 + irr, t + 1);
        }
        if (Math.abs(npv) < tolerance) return irr;
        if (derivative === 0) break; // Avoid division by zero
        irr = irr - npv / derivative;
    }
    return null; // Failed to converge
};

// --- Data Structures (Conceptual - No Interfaces in JS) ---
/*
interface AcquisitionData {
    purchase_price: number | null;         // Black (Pulled)
    closing_costs: number | null;          // Blue (Editable)
    due_diligence_costs: number | null;    // Blue (Editable)
    initial_capital_expenditure: number | null; // Blue (Editable)
    total_acquisition_cost: number | null; // Black (Calculated)
}

interface FinancingData {
    loan_amount: number | null;              // Blue (Editable)
    loan_to_value: number | null;          // Black (Calculated)
    interest_rate: number | null;          // Blue (Editable, decimal e.g., 0.05 for 5%)
    amortization_years: number | null;     // Blue (Editable)
    loan_term_years: number | null;        // Blue (Editable)
    annual_debt_service: number | null;    // Black (Calculated)
    yearly_principal: (number | null)[];
    yearly_interest: (number | null)[];
    yearly_loan_balance: (number | null)[];
}

// ... other interfaces ...

interface CashFlowStatementData {
    acquisition: AcquisitionData;
    financing: FinancingData;
    operations: OperationsYearData[];
    sale_proceeds: SaleProceedsData;
    investment_returns: InvestmentReturnsData;
    property_id: string;
    years_projected: number;
    noi_forecast: (number | null)[];
    capex_forecast: (number | null)[];
}
*/

// --- Calculation Logic --- 
const recalculateCashFlow = (inputData) => {
    const data = { ...inputData }; // Create a mutable copy
    const years = data.years_projected;

    // 1. Acquisition
    data.acquisition.total_acquisition_cost = 
        (data.acquisition.purchase_price ?? 0) + 
        (data.acquisition.closing_costs ?? 0) + 
        (data.acquisition.due_diligence_costs ?? 0) + 
        (data.acquisition.initial_capital_expenditure ?? 0);

    // 2. Financing
    const loanAmount = data.financing.loan_amount ?? 0;
    const purchasePrice = data.acquisition.purchase_price;
    data.financing.loan_to_value = (purchasePrice && purchasePrice > 0) ? loanAmount / purchasePrice : null;
    
    const interestRate = data.financing.interest_rate ?? 0;
    const amortizationYears = data.financing.amortization_years ?? 0;
    const loanTermYears = data.financing.loan_term_years ?? 0;
    const periods = amortizationYears * 12; // Monthly payments
    const ratePerPeriod = interestRate / 12;
    
    let annualDebtService = null;
    let monthlyPayment = 0;
    if (loanAmount > 0 && ratePerPeriod >= 0 && periods > 0) {
        monthlyPayment = calculatePMT(ratePerPeriod, periods, loanAmount);
        annualDebtService = monthlyPayment * 12;
    }
    data.financing.annual_debt_service = annualDebtService;

    // Yearly P&I Breakdown
    data.financing.yearly_principal = [];
    data.financing.yearly_interest = [];
    data.financing.yearly_loan_balance = [];
    let currentBalance = loanAmount;
    for (let y = 0; y < years; y++) {
        let yearPrincipal = 0;
        let yearInterest = 0;
        let endBalance = currentBalance;
        if (currentBalance > 0 && annualDebtService !== null && y < loanTermYears) {
            for (let m = 0; m < 12; m++) {
                const interestPayment = currentBalance * ratePerPeriod;
                const principalPayment = monthlyPayment - interestPayment;
                yearInterest += interestPayment;
                yearPrincipal += principalPayment;
                currentBalance -= principalPayment;
                if (currentBalance < 0) currentBalance = 0; // Ensure balance doesn't go negative
            }
             endBalance = currentBalance > 0 ? currentBalance : 0;
        }
        data.financing.yearly_principal.push(y < loanTermYears ? yearPrincipal : 0);
        data.financing.yearly_interest.push(y < loanTermYears ? yearInterest : 0);
        data.financing.yearly_loan_balance.push(y < loanTermYears ? endBalance : (y > 0 && data.financing.yearly_loan_balance[y-1] !== undefined ? data.financing.yearly_loan_balance[y-1] : loanAmount)); // Carry balance after term
    }

    // 3. Operations
    data.operations = [];
    const currentYear = new Date().getFullYear();
    for (let y = 0; y < years; y++) {
        const noi = data.noi_forecast[y] ?? 0;
        const capex = data.capex_forecast[y] ?? 0;
        const debtService = (y < loanTermYears && annualDebtService !== null) ? annualDebtService : 0;
        const cfBeforeDebt = noi - capex;
        const cfAfterDebt = cfBeforeDebt - debtService;
        data.operations.push({
            year: currentYear + y,
            net_operating_income: data.noi_forecast[y],
            capital_costs: data.capex_forecast[y],
            cash_flow_before_debt: cfBeforeDebt,
            debt_service: debtService,
            cash_flow_after_debt: cfAfterDebt,
        });
    }

    // 4. Sale Proceeds
    const saleYearIndex = (data.sale_proceeds.sale_year ?? (currentYear + years -1)) - currentYear;
    // Ensure saleYearIndex is within bounds for noi_forecast access
    const safeSaleYearIndex = Math.max(0, Math.min(saleYearIndex, years - 1)); 
    const noiIndexForSalePrice = Math.min(safeSaleYearIndex + 1, years - 1); // Use NOI Y+1 if available, else last year NOI
    const noiAtSaleYear = data.noi_forecast[noiIndexForSalePrice] ?? data.noi_forecast[safeSaleYearIndex] ?? 0; 

    const exitCap = data.sale_proceeds.exit_cap_rate ?? 0;
    data.sale_proceeds.sale_price = (exitCap > 0) ? noiAtSaleYear / exitCap : null;
    
    const sellingCostsPercent = data.sale_proceeds.selling_costs_percent ?? 0;
    const salePrice = data.sale_proceeds.sale_price ?? 0;
    data.sale_proceeds.selling_costs_amount = salePrice * sellingCostsPercent;
    
    data.sale_proceeds.remaining_loan_balance = (safeSaleYearIndex >= 0 && safeSaleYearIndex < years) ? data.financing.yearly_loan_balance[safeSaleYearIndex] : null;
    const remainingLoan = data.sale_proceeds.remaining_loan_balance ?? 0;
    const sellingCostsAmount = data.sale_proceeds.selling_costs_amount ?? 0;
    data.sale_proceeds.net_sale_proceeds = salePrice - sellingCostsAmount - remainingLoan;

    // 5. Investment Returns
    const totalAcquisition = data.acquisition.total_acquisition_cost ?? 0;
    data.investment_returns.equity_investment = totalAcquisition - loanAmount;
    const equity = data.investment_returns.equity_investment;

    data.investment_returns.yearly_cash_on_cash = [];
    const cashFlowStreamForIRR = equity && equity > 0 ? [-equity] : [0]; // Start with negative equity investment
    let cumulativeCashFlow = 0;
    for (let y = 0; y < years; y++) {
        const cfAfterDebt = data.operations[y]?.cash_flow_after_debt ?? 0;
        const coc = (equity && equity !== 0) ? cfAfterDebt / equity : null;
        data.investment_returns.yearly_cash_on_cash.push(coc);
        
        let yearEndCashFlow = cfAfterDebt;
        // Add net sale proceeds in the sale year
        if (y === safeSaleYearIndex) {
            yearEndCashFlow += (data.sale_proceeds.net_sale_proceeds ?? 0);
        }
        cashFlowStreamForIRR.push(yearEndCashFlow);
        cumulativeCashFlow += yearEndCashFlow;
    }
    
    data.investment_returns.irr = calculateIRR(cashFlowStreamForIRR);
    data.investment_returns.equity_multiple = (equity && equity !== 0) ? (cumulativeCashFlow + equity) / equity : null; // (Total Cash Received) / Equity

    return data;
};

// --- Sample Data Generation ---
const generateSampleCashFlowData = (propertyId) => {
    const years = 10;
    const currentYear = new Date().getFullYear();
    const purchasePrice = 5000000 + Math.random() * 2000000;
    const propertySF = 60000 + Math.random() * 40000;
    const noiY1 = purchasePrice * (0.05 + Math.random() * 0.02); // 5-7% cap rate initially
    const noiGrowth = 0.02 + Math.random() * 0.01;
    const capexReservePerSf = 0.5 + Math.random() * 1.0;
    const saleYear = currentYear + years - 1; // Assume sale at end of projection
    const exitCap = 0.06 + Math.random() * 0.015;

    const noiForecast = Array.from({ length: years }, (_, i) => noiY1 * Math.pow(1 + noiGrowth, i));
    const capexForecast = Array.from({ length: years }, (_, i) => propertySF * capexReservePerSf * Math.pow(1 + noiGrowth, i)); // Assume capex grows too

    let sample = {
        property_id: propertyId,
        years_projected: years,
        noi_forecast: noiForecast,
        capex_forecast: capexForecast,
        acquisition: {
            purchase_price: purchasePrice,
            closing_costs: purchasePrice * (0.015 + Math.random() * 0.01), // 1.5-2.5%
            due_diligence_costs: 10000 + Math.random() * 15000,
            initial_capital_expenditure: purchasePrice * (0.02 + Math.random() * 0.03), // 2-5%
            total_acquisition_cost: null, // Will be calculated
        },
        financing: {
            loan_amount: purchasePrice * (0.65 + Math.random() * 0.1), // 65-75% LTV
            interest_rate: 0.045 + Math.random() * 0.02, // 4.5% - 6.5%
            amortization_years: 25 + (Math.random() > 0.5 ? 5 : 0), // 25 or 30
            loan_term_years: 10,
            loan_to_value: null, // Calculated
            annual_debt_service: null, // Calculated
            yearly_principal: [], // Calculated
            yearly_interest: [], // Calculated
            yearly_loan_balance: [], // Calculated
        },
        operations: [], // Calculated
        sale_proceeds: {
            sale_year: saleYear,
            exit_cap_rate: exitCap,
            selling_costs_percent: 0.01 + Math.random() * 0.01, // 1-2%
            sale_price: null, // Calculated
            selling_costs_amount: null, // Calculated
            remaining_loan_balance: null, // Calculated
            net_sale_proceeds: null, // Calculated
        },
        investment_returns: {
            equity_investment: null, // Calculated
            yearly_cash_on_cash: [], // Calculated
            irr: null, // Calculated
            equity_multiple: null, // Calculated
        }
    };
    // Run initial calculation
    sample = recalculateCashFlow(sample);
    return sample;
};

// --- Main Component ---
const CashFlowStatement = ({ propertyId }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        console.log(`Fetching cash flow for property: ${propertyId}`);
        try {
            const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;
            // TODO: Add token/auth header
            const response = await fetch(`${backendUrl}/api/financial/cashflow/${propertyId}`);

            if (!response.ok) {
                console.warn(`API fetch failed (${response.status}), using sample cash flow data for property ${propertyId}`);
                const sampleData = generateSampleCashFlowData(propertyId);
                setData(sampleData);
            } else {
                const result = await response.json();
                 if (!result.success || !result.data) { // Basic check
                     console.error('API Error: Invalid cash flow data format', result);
                    const sampleData = generateSampleCashFlowData(propertyId);
                    setData(sampleData);
                    setError(result.error || 'API returned unsuccessful or invalid data, using sample data.');
                 } else {
                    // TODO: Validate fetched data structure
                    let fetchedData = result.data;
                    // Ensure essential calculation inputs are present, if not, use sample/defaults
                    fetchedData.property_id = propertyId;
                    fetchedData.years_projected = fetchedData.years_projected || 10;
                    // Basic check for forecasts - replace with robust validation/defaults
                    fetchedData.noi_forecast = fetchedData.noi_forecast || Array(fetchedData.years_projected).fill(0);
                    fetchedData.capex_forecast = fetchedData.capex_forecast || Array(fetchedData.years_projected).fill(0);
                    
                    // Recalculate everything based on fetched inputs to ensure consistency
                    fetchedData = recalculateCashFlow(fetchedData);
                    setData(fetchedData);
                    setError(null);
                 }
            }
        } catch (err) {
            console.error('Error in fetchData process (Cash Flow):', err);
            setError(`Fetch error: ${err.message}. Using sample data.`);
            const sampleData = generateSampleCashFlowData(propertyId);
            setData(sampleData);
        } finally {
            setLoading(false);
        }
    }, [propertyId]);

    useEffect(() => {
        if (propertyId) {
            fetchData();
        } else {
            setData(null);
            setError("No property selected.");
            setLoading(false);
        }
    }, [propertyId, fetchData]);

    // --- Input Handlers ---
    const handleInputChange = (section, field, value) => {
        setData(prevData => {
            if (!prevData) return null;
            
            // Create a deep copy to avoid mutating nested objects directly
            const newData = JSON.parse(JSON.stringify(prevData));
            
            const sectionData = newData[section];
            
            let processedValue = null;
            if (typeof value === 'string') {
                processedValue = value === '' ? null : parseFloat(value);
                if (isNaN(processedValue)) processedValue = null;
            } else {
                processedValue = value; // Already a number
            }

            // Handle percentages (store as decimals)
            if ((section === 'financing' && field === 'interest_rate') || 
                (section === 'sale_proceeds' && field === 'selling_costs_percent')) {
                if (processedValue !== null) {
                    processedValue /= 100;
                }
            }
            
            if (sectionData) {
                 sectionData[field] = processedValue;
            }

            // Recalculate the entire cash flow based on the change
            return recalculateCashFlow(newData);
        });
         // TODO: Debounce API save call? Or provide explicit save button?
         // console.log(`Saving updated field: ${section}.${field}`);
         // API call to PUT the updated data structure
    };
    
    // Helper to render editable input fields
    const renderEditableInput = (section, field, label, isPercent = false) => {
        if (!data) return null;
        const sectionData = data[section];
        const value = sectionData ? sectionData[field] : null;
        
        let displayValue = '';
        if (value !== null && value !== undefined) {
            if (isPercent) {
                // Display percentage with 2 decimal places in the input (e.g., 5.91)
                displayValue = (value * 100).toFixed(2); 
            } else {
                 // Display non-percentage/currency with 2 decimal places in the input (e.g., 137550.18)
                displayValue = value.toFixed(2);
            }
        } else {
             displayValue = ''; // Keep empty if null/undefined
        }
        
        return (
            <div className="flex items-center justify-between py-1">
                <Label htmlFor={`${section}-${field}`} className="text-sm text-gray-600">{label}:</Label>
                <Input 
                    id={`${section}-${field}`}
                    name={field}
                    type="number"
                    inputMode="numeric"
                    value={displayValue} // Use the formatted displayValue
                    onChange={(e) => handleInputChange(section, field, e.target.value)}
                    className="w-32 h-8 text-sm text-blue-600 font-medium text-right border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    placeholder={isPercent ? "%" : "Amount"}
                    step={isPercent ? "0.01" : "0.01"} // Add step for easier input
                />
            </div>
        );
    };
    
     // Helper to render calculated values
    const renderCalculatedValue = (label, value, format = 'currency', digits = 2) => (
        <div className="flex items-center justify-between py-1">
            <span className="text-sm text-gray-600">{label}:</span>
            <span className="text-sm font-medium text-gray-900">{formatNumber(value, format, digits)}</span>
        </div>
    );

    // --- Loading & Error States ---
    if (loading) return <div className="p-4 text-center">Loading Cash Flow Statement...</div>;
    if (error && !data) return <div className="p-4 text-center text-red-500">Error: {error}</div>;
    if (!data) return <div className="p-4 text-center text-gray-500">No cash flow data available.</div>;

    // --- Render Component ---
    const { acquisition, financing, operations, sale_proceeds, investment_returns } = data;
    const years = operations && Array.isArray(operations) ? operations.map(op => op.year) : [];

    return (
        <div className="space-y-6 p-1">
            {error && <div className="p-3 mb-4 text-center text-orange-700 bg-orange-100 border border-orange-300 rounded-md">Warning: {error}</div>}
            
            <h2 className="text-xl font-semibold text-gray-800">Cash Flow Statement</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* --- Acquisition Section --- */}
                <div className="bg-white p-4 shadow rounded-lg space-y-2">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-2">Acquisition</h3>
                    {renderCalculatedValue('Purchase Price', acquisition?.purchase_price)}
                    {renderEditableInput('acquisition', 'closing_costs', 'Closing Costs')}
                    {renderEditableInput('acquisition', 'due_diligence_costs', 'Due Diligence')}
                    {renderEditableInput('acquisition', 'initial_capital_expenditure', 'Initial CapEx')}
                    {renderCalculatedValue('Total Acquisition Cost', acquisition?.total_acquisition_cost, 'currency')}
                </div>

                {/* --- Financing Section (Inputs) --- */}
                <div className="bg-white p-4 shadow rounded-lg space-y-2">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-2">Financing</h3>
                    {renderEditableInput('financing', 'loan_amount', 'Loan Amount')}
                    {renderCalculatedValue('Loan-to-Value (LTV)', financing?.loan_to_value, 'percent', 1)}
                    {renderEditableInput('financing', 'interest_rate', 'Interest Rate %', true)}
                    {renderEditableInput('financing', 'amortization_years', 'Amortization (Yrs)')}
                    {renderEditableInput('financing', 'loan_term_years', 'Loan Term (Yrs)')}
                     {renderCalculatedValue('Annual Debt Service', financing?.annual_debt_service, 'currency')}
                </div>
                
                 {/* --- Sale Proceeds Section --- */} 
                 <div className="bg-white p-4 shadow rounded-lg space-y-2">
                     <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-2">Sale Proceeds</h3>
                     {renderCalculatedValue('Sale Year', sale_proceeds?.sale_year, 'integer', 0)}
                     {renderCalculatedValue('Exit Cap Rate', sale_proceeds?.exit_cap_rate, 'percent', 2)}
                     {renderCalculatedValue('Sale Price (Calculated)', sale_proceeds?.sale_price)}
                     {renderEditableInput('sale_proceeds', 'selling_costs_percent', 'Selling Costs %', true)}
                     {renderCalculatedValue('Selling Costs Amount', sale_proceeds?.selling_costs_amount)}
                     {renderCalculatedValue('Remaining Loan Balance', sale_proceeds?.remaining_loan_balance)}
                     {renderCalculatedValue('Net Sale Proceeds', sale_proceeds?.net_sale_proceeds, 'currency')}
                 </div>
                 
                 {/* --- Investment Returns Section --- */} 
                 <div className="bg-white p-4 shadow rounded-lg space-y-2">
                     <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-2">Investment Returns</h3>
                     {renderCalculatedValue('Equity Investment', investment_returns?.equity_investment)}
                     {renderCalculatedValue('Cash on Cash (Avg 10yr)', 
                        (investment_returns?.yearly_cash_on_cash?.reduce((s, v) => s + (v || 0), 0) ?? 0) / 
                        (investment_returns?.yearly_cash_on_cash?.filter(v => v !== null && v !== undefined).length || 1), 
                        'percent', 1)}
                     {renderCalculatedValue('Internal Rate of Return (IRR)', investment_returns?.irr, 'percent', 2)}
                     {renderCalculatedValue('Equity Multiple', investment_returns?.equity_multiple, 'decimal', 2)}
                 </div>
            </div>

            {/* --- Operations & Financing Details Table --- */} 
             <div className="overflow-x-auto bg-white p-4 shadow rounded-lg mt-6">
                 <h3 className="text-lg font-semibold text-gray-700 mb-3">Operations & Financing Details ({years?.length || 0} Years)</h3>
                 <Table className="min-w-full">
                    <TableHeader>
                         <TableRow>
                            <TableHead className="sticky left-0 bg-gray-50 z-10 w-[200px]">Item</TableHead>
                             {years.map(year => <TableHead key={year} className="w-[120px]">{year}</TableHead>)}
                         </TableRow>
                     </TableHeader>
                    <TableBody>
                         {/* Operations */}
                         <TableRow className="bg-gray-100 font-semibold">
                            <TableCell colSpan={(years?.length || 0) + 1} className="sticky left-0 bg-gray-100 z-10">Operations</TableCell>
                         </TableRow>
                         <TableRow>
                             <TableCell className="sticky left-0 bg-white z-10 font-medium">Net Operating Income</TableCell>
                             {operations?.map((op, i) => <TableCell key={i}>{formatNumber(op.net_operating_income, 'currency')}</TableCell>)}
                         </TableRow>
                         <TableRow>
                             <TableCell className="sticky left-0 bg-white z-10 font-medium">Capital Costs</TableCell>
                             {operations?.map((op, i) => <TableCell key={i}>({formatNumber(op.capital_costs, 'currency')})</TableCell>)}
                         </TableRow>
                         <TableRow className="font-semibold bg-gray-50">
                             <TableCell className="sticky left-0 bg-gray-50 z-10">Cash Flow Before Debt</TableCell>
                             {operations?.map((op, i) => <TableCell key={i}>{formatNumber(op.cash_flow_before_debt, 'currency')}</TableCell>)}
                         </TableRow>
                         <TableRow>
                             <TableCell className="sticky left-0 bg-white z-10 font-medium">Debt Service</TableCell>
                             {operations?.map((op, i) => <TableCell key={i}>({formatNumber(op.debt_service, 'currency')})</TableCell>)}
                         </TableRow>
                         <TableRow className="font-bold bg-blue-100">
                             <TableCell className="sticky left-0 bg-blue-100 z-10">Cash Flow After Debt</TableCell>
                             {operations?.map((op, i) => <TableCell key={i}>{formatNumber(op.cash_flow_after_debt, 'currency')}</TableCell>)}
                         </TableRow>
                          {/* Financing Details */}
                         <TableRow className="bg-gray-100 font-semibold mt-4">
                             <TableCell colSpan={(years?.length || 0) + 1} className="sticky left-0 bg-gray-100 z-10">Financing Details</TableCell>
                         </TableRow>
                         <TableRow>
                             <TableCell className="sticky left-0 bg-white z-10 font-medium">Principal Paid</TableCell>
                             {financing?.yearly_principal?.map((p, i) => <TableCell key={i}>{formatNumber(p, 'currency')}</TableCell>)}
                         </TableRow>
                         <TableRow>
                             <TableCell className="sticky left-0 bg-white z-10 font-medium">Interest Paid</TableCell>
                             {financing?.yearly_interest?.map((intr, i) => <TableCell key={i}>{formatNumber(intr, 'currency')}</TableCell>)}
                         </TableRow>
                         <TableRow className="font-semibold bg-gray-50">
                             <TableCell className="sticky left-0 bg-gray-50 z-10">End of Year Loan Balance</TableCell>
                             {financing?.yearly_loan_balance?.map((bal, i) => <TableCell key={i}>{formatNumber(bal, 'currency')}</TableCell>)}
                         </TableRow>
                         {/* Investment Returns (Yearly) */} 
                         <TableRow className="bg-gray-100 font-semibold mt-4">
                             <TableCell colSpan={(years?.length || 0) + 1} className="sticky left-0 bg-gray-100 z-10">Investment Returns</TableCell>
                         </TableRow>
                         <TableRow>
                             <TableCell className="sticky left-0 bg-white z-10 font-medium">Cash on Cash Return</TableCell>
                             {investment_returns?.yearly_cash_on_cash?.map((coc, i) => <TableCell key={i}>{formatNumber(coc, 'percent', 2)}</TableCell>)}
                         </TableRow>
                     </TableBody>
                 </Table>
             </div>
        </div>
    );
}

export default CashFlowStatement; 