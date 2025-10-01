"use client";

import React, { useState, useEffect } from 'react';
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
import {
  useCashFlowStatement,
  useUpdateCashFlowStatement,
  useSaveCashFlowField,
  formatNumber,
  recalculateCashFlow,
  generateSampleCashFlowData,
  type CashFlowStatementData,
} from "@/app/rest/cashflowstatement";

interface CashFlowStatementTabProps {
  propertyId: string;
}

// --- Main Component ---
const CashFlowStatementTab: React.FC<CashFlowStatementTabProps> = ({ propertyId }) => {
    const [data, setData] = useState<CashFlowStatementData | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Use the new hooks
    const { 
        data: cashFlowData, 
        isLoading, 
        error: fetchError 
    } = useCashFlowStatement(propertyId);
    
    const updateCashFlowMutation = useUpdateCashFlowStatement();
    const saveFieldMutation = useSaveCashFlowField();

    // Initialize data when fetched data loads
    useEffect(() => {
        if (cashFlowData) {
            // Validate and recalculate the fetched data
            let fetchedData: CashFlowStatementData = cashFlowData;
            fetchedData.property_id = propertyId;
            fetchedData.years_projected = fetchedData.years_projected || 10;
            
            // Recalculate everything based on fetched inputs to ensure consistency
            fetchedData = recalculateCashFlow(fetchedData);
            setData(fetchedData);
            setError(null);
        } else if (fetchError) {
            console.warn(`API fetch failed, using sample cash flow data for property ${propertyId}`);
            const sampleData = generateSampleCashFlowData(propertyId);
            setData(sampleData);
            setError(fetchError.message || 'API returned unsuccessful or invalid data, using sample data.');
        }
    }, [cashFlowData, fetchError, propertyId]);

    // --- Input Handlers ---
    const handleInputChange = (section: keyof CashFlowStatementData, field: string, value: string | number) => {
        let processedValue: number | null = null;
        
        // Process the value
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

        setData(prevData => {
            if (!prevData) return null;
            
            // Create a deep copy to avoid mutating nested objects directly
            const newData = JSON.parse(JSON.stringify(prevData)) as CashFlowStatementData;
            
            // Type assertion to access nested fields
            const sectionData = newData[section] as any;
            
            sectionData[field] = processedValue;

            // Recalculate the entire cash flow based on the change
            return recalculateCashFlow(newData);
        });

        // Save the field change to the backend
        if (processedValue !== null) {
            saveFieldMutation.mutate({
                propertyId,
                section,
                field,
                value: processedValue
            });
        }
    };

    const handleSave = async () => {
        if (!data) return;
        
        try {
            await updateCashFlowMutation.mutateAsync({
                propertyId,
                cashFlowData: data,
            });
            alert('Cash flow statement saved successfully!');
        } catch (err) {
            console.error('Error saving cash flow statement:', err);
            alert('Error saving cash flow statement: ' + (err as Error).message);
        }
    };
    
    // Helper to render editable input fields
    const renderEditableInput = (section: keyof CashFlowStatementData, field: string, label: string, isPercent: boolean = false) => {
        if (!data) return null;
        const sectionData = data[section] as any;
        const value = sectionData ? sectionData[field] : null;
        const displayValue = isPercent ? (value !== null ? value * 100 : '') : (value ?? '');
        
        return (
            <div className="flex items-center justify-between py-1">
                <Label htmlFor={`${section}-${field}`} className="text-sm text-gray-600">{label}:</Label>
                <Input 
                    id={`${section}-${field}`}
                    name={field}
                    type="number"
                    inputMode="numeric"
                    value={displayValue}
                    onChange={(e) => handleInputChange(section, field, e.target.value)}
                    className="w-32 h-8 text-sm text-blue-600 font-medium text-right border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    placeholder={isPercent ? "%" : "Amount"}
                />
            </div>
        );
    };
    
     // Helper to render calculated values
    const renderCalculatedValue = (label: string, value: number | null | undefined, format: 'currency' | 'percent' | 'integer' | 'decimal' = 'currency', digits: number = 2) => (
        <div className="flex items-center justify-between py-1">
            <span className="text-sm text-gray-600">{label}:</span>
            <span className="text-sm font-medium text-gray-900">{formatNumber(value, format, digits)}</span>
        </div>
    );

    // --- Loading & Error States ---
    if (isLoading) return <div className="p-4 text-center">Loading Cash Flow Statement...</div>;
    if (error && !data) return <div className="p-4 text-center text-red-500">Error: {error}</div>;
    if (!data) return <div className="p-4 text-center text-gray-500">No cash flow data available.</div>;

    // --- Render Component ---
    const { acquisition, financing, operations, sale_proceeds, investment_returns } = data;
    const years = operations.map(op => op.year);

    return (
        <div className="space-y-6 p-1">
            {error && <div className="p-3 mb-4 text-center text-orange-700 bg-orange-100 border border-orange-300 rounded-md">Warning: {error}</div>}
            
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Cash Flow Statement</h2>
                <button
                    onClick={handleSave}
                    disabled={updateCashFlowMutation.isPending}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-lg shadow"
                >
                    {updateCashFlowMutation.isPending ? 'Saving...' : 'Save'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* --- Acquisition Section --- */}
                <div className="bg-white p-4 shadow rounded-lg space-y-2">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-2">Acquisition</h3>
                    {renderCalculatedValue('Purchase Price', acquisition.purchase_price)}
                    {renderEditableInput('acquisition', 'closing_costs', 'Closing Costs')}
                    {renderEditableInput('acquisition', 'due_diligence_costs', 'Due Diligence')}
                    {renderEditableInput('acquisition', 'initial_capital_expenditure', 'Initial CapEx')}
                    {renderCalculatedValue('Total Acquisition Cost', acquisition.total_acquisition_cost, 'currency')}
                </div>

                {/* --- Financing Section (Inputs) --- */}
                <div className="bg-white p-4 shadow rounded-lg space-y-2">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-2">Financing</h3>
                    {renderEditableInput('financing', 'loan_amount', 'Loan Amount')}
                    {renderCalculatedValue('Loan-to-Value (LTV)', financing.loan_to_value, 'percent', 1)}
                    {renderEditableInput('financing', 'interest_rate', 'Interest Rate %', true)}
                    {renderEditableInput('financing', 'amortization_years', 'Amortization (Yrs)', false)}
                    {renderEditableInput('financing', 'loan_term_years', 'Loan Term (Yrs)', false)}
                     {renderCalculatedValue('Annual Debt Service', financing.annual_debt_service, 'currency')}
                </div>
                
                 {/* --- Sale Proceeds Section --- */} 
                 <div className="bg-white p-4 shadow rounded-lg space-y-2">
                     <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-2">Sale Proceeds</h3>
                     {/* Sale Year and Exit Cap would likely be edited elsewhere (e.g., assumptions tab) */} 
                     {renderCalculatedValue('Sale Year', sale_proceeds.sale_year, 'integer', 0)}
                     {renderCalculatedValue('Exit Cap Rate', sale_proceeds.exit_cap_rate, 'percent', 2)}
                     {renderCalculatedValue('Sale Price (Calculated)', sale_proceeds.sale_price)}
                     {renderEditableInput('sale_proceeds', 'selling_costs_percent', 'Selling Costs %', true)}
                     {renderCalculatedValue('Selling Costs Amount', sale_proceeds.selling_costs_amount)}
                     {renderCalculatedValue('Remaining Loan Balance', sale_proceeds.remaining_loan_balance)}
                     {renderCalculatedValue('Net Sale Proceeds', sale_proceeds.net_sale_proceeds, 'currency')}
                 </div>
                 
                 {/* --- Investment Returns Section --- */} 
                 <div className="bg-white p-4 shadow rounded-lg space-y-2">
                     <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-2">Investment Returns</h3>
                     {renderCalculatedValue('Equity Investment', investment_returns.equity_investment)}
                      {/* Display Avg CoC or First Year? Simplified for now */}
                     {renderCalculatedValue('Cash on Cash (Avg 10yr)', investment_returns.yearly_cash_on_cash.reduce((s, v) => s + (v || 0), 0) / (investment_returns.yearly_cash_on_cash.filter(v => v !== null).length || 1), 'percent', 1)}
                     {renderCalculatedValue('Internal Rate of Return (IRR)', investment_returns.irr, 'percent', 2)}
                     {renderCalculatedValue('Equity Multiple', investment_returns.equity_multiple, 'decimal', 2)}
                 </div>
            </div>

            {/* --- Operations & Financing Details Table --- */} 
             <div className="overflow-x-auto bg-white p-4 shadow rounded-lg mt-6">
                 <h3 className="text-lg font-semibold text-gray-700 mb-3">Operations & Financing Details (10 Years)</h3>
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
                            <TableCell colSpan={years.length + 1} className="sticky left-0 bg-gray-100 z-10">Operations</TableCell>
                         </TableRow>
                         <TableRow>
                             <TableCell className="sticky left-0 bg-white z-10 font-medium">Net Operating Income</TableCell>
                             {operations.map((op, i) => <TableCell key={i}>{formatNumber(op.net_operating_income, 'currency')}</TableCell>)}
                         </TableRow>
                         <TableRow>
                             <TableCell className="sticky left-0 bg-white z-10 font-medium">Capital Costs</TableCell>
                             {operations.map((op, i) => <TableCell key={i}>({formatNumber(op.capital_costs, 'currency')})</TableCell>)}
                         </TableRow>
                         <TableRow className="font-semibold bg-gray-50">
                             <TableCell className="sticky left-0 bg-gray-50 z-10">Cash Flow Before Debt</TableCell>
                             {operations.map((op, i) => <TableCell key={i}>{formatNumber(op.cash_flow_before_debt, 'currency')}</TableCell>)}
                         </TableRow>
                         <TableRow>
                             <TableCell className="sticky left-0 bg-white z-10 font-medium">Debt Service</TableCell>
                             {operations.map((op, i) => <TableCell key={i}>({formatNumber(op.debt_service, 'currency')})</TableCell>)}
                         </TableRow>
                         <TableRow className="font-bold bg-blue-100">
                             <TableCell className="sticky left-0 bg-blue-100 z-10">Cash Flow After Debt</TableCell>
                             {operations.map((op, i) => <TableCell key={i}>{formatNumber(op.cash_flow_after_debt, 'currency')}</TableCell>)}
                         </TableRow>
                          {/* Financing Details */}
                         <TableRow className="bg-gray-100 font-semibold mt-4">
                             <TableCell colSpan={years.length + 1} className="sticky left-0 bg-gray-100 z-10">Financing Details</TableCell>
                         </TableRow>
                         <TableRow>
                             <TableCell className="sticky left-0 bg-white z-10 font-medium">Principal Paid</TableCell>
                             {financing.yearly_principal.map((p, i) => <TableCell key={i}>{formatNumber(p, 'currency')}</TableCell>)}
                         </TableRow>
                         <TableRow>
                             <TableCell className="sticky left-0 bg-white z-10 font-medium">Interest Paid</TableCell>
                             {financing.yearly_interest.map((intr, i) => <TableCell key={i}>{formatNumber(intr, 'currency')}</TableCell>)}
                         </TableRow>
                         <TableRow className="font-semibold bg-gray-50">
                             <TableCell className="sticky left-0 bg-gray-50 z-10">End of Year Loan Balance</TableCell>
                             {financing.yearly_loan_balance.map((bal, i) => <TableCell key={i}>{formatNumber(bal, 'currency')}</TableCell>)}
                         </TableRow>
                         {/* Investment Returns (Yearly) */} 
                         <TableRow className="bg-gray-100 font-semibold mt-4">
                             <TableCell colSpan={years.length + 1} className="sticky left-0 bg-gray-100 z-10">Investment Returns</TableCell>
                         </TableRow>
                         <TableRow>
                             <TableCell className="sticky left-0 bg-white z-10 font-medium">Cash on Cash Return</TableCell>
                             {investment_returns.yearly_cash_on_cash.map((coc, i) => <TableCell key={i}>{formatNumber(coc, 'percent', 1)}</TableCell>)}
                         </TableRow>
                     </TableBody>
                 </Table>
             </div>
        </div>
    );
}

export default CashFlowStatementTab; 