// Not used yet
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

// --- Helper Functions ---
const formatNumber = (value, style, digits = 2) => {
    if (value === null || typeof value === 'undefined' || isNaN(value)) return 'N/A';
    try {
        const options = {};
        if (style === 'currency') { options.style = 'currency'; options.currency = 'USD'; options.minimumFractionDigits = 0; options.maximumFractionDigits = 0; }
        else if (style === 'percent') { options.style = 'percent'; options.minimumFractionDigits = digits; options.maximumFractionDigits = digits; }
        else if (style === 'integer') { options.minimumFractionDigits = 0; options.maximumFractionDigits = 0; }
        else if (style === 'decimal') { options.style = 'decimal'; options.minimumFractionDigits = digits; options.maximumFractionDigits = digits; }
        else { options.minimumFractionDigits = digits; options.maximumFractionDigits = digits; }
        return new Intl.NumberFormat('en-US', options).format(value);
    } catch (error) { console.error("Assumptions Num Format Err:", error); return String(value); }
};

// --- Data Structures (Conceptual) ---
/*
interface ValuationAssumptions {
    acquisition_cap_rate: number | null; // Editable %
    exit_cap_rate: number | null;        // Editable %
    value_growth_rate: number | null;    // Editable %
    current_estimated_value: number | null; // Calculated
    yearly_projected_value: (number | null)[]; // Calculated
}

interface MarketAssumptions {
    vacancy_rate: number | null;         // Editable %
    rent_growth_rate: number | null;     // Editable %
    renewal_probability: number | null;  // Editable %
    avg_tenant_term: number | null;      // Editable Years
    yearly_market_rent_sf: (number | null)[]; // Calculated
}

interface ExpenseAssumptions {
    general_inflation: number | null;   // Editable %
    property_tax_growth: number | null;// Editable %
    insurance_growth: number | null;    // Editable %
    utilities_growth: number | null;    // Editable %
    repairs_growth: number | null;      // Editable %
    management_fee_percent: number | null; // Editable %
}

interface CapExAssumptions { // Synced with CapExPlan
    ti_allowance_new: number | null;    // Editable $/SF
    ti_allowance_renewal: number | null; // Editable $/SF
    lc_rate_new: number | null;         // Editable %
    lc_rate_renewal: number | null;     // Editable %
    reserve_per_sf: number | null;      // Editable $/SF
}

interface InvestmentStructure {
    equity_investment: number | null;   // Calculated/Pulled
    target_irr: number | null;          // Editable %
    target_equity_multiple: number | null; // Editable Number
    actual_irr: number | null;          // Calculated/Pulled
    actual_equity_multiple: number | null; // Calculated/Pulled
    irr_variance: number | null;        // Calculated
    multiple_variance: number | null;   // Calculated
}

interface AssumptionsData {
    property_id: string;
    property_sf: number | null; // Needed for calcs
    years_projected: number;
    noi_year_1: number | null; // Needed for value calc
    base_market_rent_sf: number | null; // Needed for market rent projection
    valuation: ValuationAssumptions;
    market: MarketAssumptions;
    expenses: ExpenseAssumptions;
    capex: CapExAssumptions;
    investment: InvestmentStructure;
}
*/

// --- Calculation Logic ---
const recalculateAssumptions = (inputData) => {
    if (!inputData) return null;
    const data = JSON.parse(JSON.stringify(inputData)); // Deep copy
    const years = data.years_projected;
    const currentYear = new Date().getFullYear();

    // 1. Valuation
    const acqCapRate = data.valuation.acquisition_cap_rate ?? 0;
    const noiY1 = data.noi_year_1 ?? 0;
    // Estimate current value based on Y1 NOI and Acquisition Cap Rate (or maybe Exit Cap? Depends on model logic)
    // Using Acq Cap Rate here as a placeholder logic for current value estimation
    data.valuation.current_estimated_value = acqCapRate > 0 ? noiY1 / acqCapRate : null;
    data.valuation.yearly_projected_value = [];
    const valueGrowth = data.valuation.value_growth_rate ?? 0;
    let currentProjValue = data.valuation.current_estimated_value ?? 0;
    for (let i = 0; i < years; i++) {
        data.valuation.yearly_projected_value.push(currentProjValue);
        currentProjValue *= (1 + valueGrowth);
    }

    // 2. Market
    data.market.yearly_market_rent_sf = [];
    const rentGrowth = data.market.rent_growth_rate ?? 0;
    let currentMarketRent = data.base_market_rent_sf ?? 0; // Needs a base value
    for (let i = 0; i < years; i++) {
        data.market.yearly_market_rent_sf.push(currentMarketRent);
        currentMarketRent *= (1 + rentGrowth);
    }
    
    // 3. Expenses - No derived calculations in this section based on requirements
    
    // 4. CapEx - No derived calculations here; inputs are editable (sync handled elsewhere)
    
    // 5. Investment Structure
    const targetIRR = data.investment.target_irr ?? 0;
    const actualIRR = data.investment.actual_irr ?? 0; // This needs to be PULLED from CF calc
    data.investment.irr_variance = actualIRR - targetIRR;
    
    const targetMult = data.investment.target_equity_multiple ?? 0;
    const actualMult = data.investment.actual_equity_multiple ?? 0; // This needs to be PULLED from CF calc
    data.investment.multiple_variance = actualMult - targetMult;

    return data;
};

// --- Sample Data Generation ---
const generateSampleAssumptionsData = (propertyId) => {
    const years = 10;
    const propertySF = 80000 + Math.random() * 40000;
    const noiY1 = 500000 + Math.random() * 200000;
    const equity = 2500000 + Math.random() * 1000000;

    let sample = {
        property_id: propertyId,
        property_sf: Math.round(propertySF),
        years_projected: years,
        noi_year_1: noiY1,
        base_market_rent_sf: 32 + Math.random() * 8,
        valuation: {
            acquisition_cap_rate: 0.06 + Math.random() * 0.015,
            exit_cap_rate: 0.065 + Math.random() * 0.015,
            value_growth_rate: 0.025 + Math.random() * 0.01,
            current_estimated_value: null, // Calculated
            yearly_projected_value: [], // Calculated
        },
        market: {
            vacancy_rate: 0.05 + Math.random() * 0.05,
            rent_growth_rate: 0.02 + Math.random() * 0.015,
            renewal_probability: 0.65 + Math.random() * 0.15,
            avg_tenant_term: 5 + Math.floor(Math.random() * 3),
            yearly_market_rent_sf: [], // Calculated
        },
        expenses: {
            general_inflation: 0.02 + Math.random() * 0.01,
            property_tax_growth: 0.025 + Math.random() * 0.01,
            insurance_growth: 0.03 + Math.random() * 0.02,
            utilities_growth: 0.015 + Math.random() * 0.01,
            repairs_growth: 0.02 + Math.random() * 0.01,
            management_fee_percent: 0.03 + Math.random() * 0.01,
        },
        capex: { // Should match defaults in CapExPlan ideally
            ti_allowance_new: 30 + Math.random() * 10,
            ti_allowance_renewal: 15 + Math.random() * 5,
            lc_rate_new: 0.05 + Math.random() * 0.01,
            lc_rate_renewal: 0.025 + Math.random() * 0.005,
            reserve_per_sf: 1.0 + Math.random() * 0.5,
        },
        investment: {
            equity_investment: equity, // Pulled/Calculated elsewhere
            target_irr: 0.12 + Math.random() * 0.06, // 12-18%
            target_equity_multiple: 2.0 + Math.random() * 0.5, // 2.0x - 2.5x
            actual_irr: 0.15 + Math.random() * 0.08, // Placeholder - Pulled from CF
            actual_equity_multiple: 2.2 + Math.random() * 0.6, // Placeholder - Pulled from CF
            irr_variance: null, // Calculated
            multiple_variance: null, // Calculated
        },
    };

    sample = recalculateAssumptions(sample);
    return sample;
};

// --- Main Component ---
const Assumptions = ({ propertyId }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        console.log(`Fetching assumptions for property: ${propertyId}`);
        try {
            const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;
            const response = await fetch(`${backendUrl}/api/financial/assumptions/${propertyId}`);

            if (!response.ok) {
                console.warn(`API fetch failed (${response.status}), using sample assumptions data for property ${propertyId}`);
                const sampleData = generateSampleAssumptionsData(propertyId);
                setData(sampleData);
            } else {
                const result = await response.json();
                if (!result.success || !result.data) {
                    console.error('API Error: Invalid assumptions data format', result);
                    const sampleData = generateSampleAssumptionsData(propertyId);
                    setData(sampleData);
                    setError(result.error || 'API returned unsuccessful or invalid data, using sample data.');
                } else {
                    let fetchedData = result.data;
                    // TODO: Validate fetched data structure & presence of required fields (noi_year_1, base_market_rent_sf, etc.)
                    fetchedData.property_id = propertyId;
                    fetchedData.years_projected = fetchedData.years_projected || 10;
                    fetchedData = recalculateAssumptions(fetchedData);
                    setData(fetchedData);
                    setError(null);
                }
            }
        } catch (err) {
            console.error('Error in fetchData process (Assumptions):', err);
            setError(`Fetch error: ${err.message}. Using sample data.`);
            const sampleData = generateSampleAssumptionsData(propertyId);
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
            const newData = JSON.parse(JSON.stringify(prevData));
            const sectionData = newData[section];
            if (!sectionData) return newData;

            let processedValue = null;
            if (typeof value === 'string') {
                processedValue = value === '' ? null : parseFloat(value);
                if (isNaN(processedValue)) processedValue = null;
            } else {
                processedValue = value; // Should generally be string from input
            }

            // Handle percentage inputs (store as decimal)
            const percentFields = [
                'acquisition_cap_rate', 'exit_cap_rate', 'value_growth_rate',
                'vacancy_rate', 'rent_growth_rate', 'renewal_probability',
                'general_inflation', 'property_tax_growth', 'insurance_growth',
                'utilities_growth', 'repairs_growth', 'management_fee_percent',
                'lc_rate_new', 'lc_rate_renewal', 'target_irr'
            ];
            if (percentFields.includes(field)) {
                if (processedValue !== null) processedValue /= 100;
            }
            
            sectionData[field] = processedValue;
            
            // TODO: Implement mechanism to sync CapEx inputs if changed here
            if (section === 'capex') {
                console.warn("Need to implement sync logic for CapEx assumptions!");
                // Potentially trigger a save/update that CapExPlan component listens to,
                // or update a shared state, or rely on backend to handle sync.
            }
            
            return recalculateAssumptions(newData); // Recalculate based on the change
        });
        // TODO: Add debounced save logic
    };
    
     // Helper to render editable input fields
    const renderEditableInput = (section, field, label, inputType = 'percent' | 'number' | 'currency') => {
        if (!data) return null;
        const sectionData = data[section];
        const value = sectionData ? sectionData[field] : null;
        const isPercent = inputType === 'percent';
        
        let displayValue = '';
         if (value !== null && value !== undefined) {
            if (isPercent) {
                displayValue = (value * 100).toFixed(2);
            } else { // number or currency ($/SF)
                displayValue = value.toFixed(2);
            }
        } else {
             displayValue = '';
        }
        
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
                    className="w-28 h-8 text-sm text-blue-600 font-medium text-right border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    placeholder={isPercent ? "%" : (inputType === 'currency' ? "$/SF" : "Number")}
                    step="0.01"
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
    if (loading) return <div className="p-4 text-center">Loading Assumptions...</div>;
    if (error && !data) return <div className="p-4 text-center text-red-500">Error: {error}</div>;
    if (!data) return <div className="p-4 text-center text-gray-500">No assumptions data available.</div>;

    // --- Render Component ---
    const { valuation, market, expenses, capex, investment } = data;

    return (
        <div className="space-y-6 p-1">
             {error && <div className="p-3 mb-4 text-center text-orange-700 bg-orange-100 border border-orange-300 rounded-md">Warning: {error}</div>}
            
             <h2 className="text-xl font-semibold text-gray-800">Model Assumptions</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                
                {/* --- Valuation Assumptions --- */}
                <section className="bg-white p-4 shadow rounded-lg space-y-2">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-2">Valuation</h3>
                    {renderEditableInput('valuation', 'acquisition_cap_rate', 'Acquisition Cap Rate %', 'percent')}
                    {renderEditableInput('valuation', 'exit_cap_rate', 'Exit Cap Rate %', 'percent')}
                    {renderEditableInput('valuation', 'value_growth_rate', 'Value Growth Rate %', 'percent')}
                    {renderCalculatedValue('Current Estimated Value', valuation?.current_estimated_value, 'currency')}
                    {/* Optional: Add button to show yearly value table in a modal? */}
                </section>

                {/* --- Market Assumptions --- */}
                <section className="bg-white p-4 shadow rounded-lg space-y-2">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-2">Market</h3>
                    {renderEditableInput('market', 'vacancy_rate', 'Market Vacancy Rate %', 'percent')}
                    {renderEditableInput('market', 'rent_growth_rate', 'Market Rent Growth %', 'percent')}
                    {renderEditableInput('market', 'renewal_probability', 'Renewal Probability %', 'percent')}
                    {renderEditableInput('market', 'avg_tenant_term', 'Average Tenant Term (Yrs)', 'number')}
                    {/* Optional: Add button to show yearly market rent table? */}
                </section>

                 {/* --- Expense Assumptions --- */}
                <section className="bg-white p-4 shadow rounded-lg space-y-2">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-2">Expenses</h3>
                     {renderEditableInput('expenses', 'general_inflation', 'General Inflation %', 'percent')}
                    {renderEditableInput('expenses', 'property_tax_growth', 'Property Tax Growth %', 'percent')}
                    {renderEditableInput('expenses', 'insurance_growth', 'Insurance Growth %', 'percent')}
                    {renderEditableInput('expenses', 'utilities_growth', 'Utilities Growth %', 'percent')}
                    {renderEditableInput('expenses', 'repairs_growth', 'Repairs Growth %', 'percent')}
                    {renderEditableInput('expenses', 'management_fee_percent', 'Management Fee %', 'percent')}
                </section>

                {/* --- CapEx Assumptions --- */}
                <section className="bg-white p-4 shadow rounded-lg space-y-2">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-2">Capital Expenditures</h3>
                    <p className="text-xs text-gray-500 -mt-2 mb-2 italic">Synced with CapEx Plan tab</p>
                    {renderEditableInput('capex', 'ti_allowance_new', 'TI Allowance (New) $/SF', 'currency')}
                    {renderEditableInput('capex', 'ti_allowance_renewal', 'TI Allowance (Renewal) $/SF', 'currency')}
                    {renderEditableInput('capex', 'lc_rate_new', 'LC Rate (New) %', 'percent')}
                    {renderEditableInput('capex', 'lc_rate_renewal', 'LC Rate (Renewal) %', 'percent')}
                    {renderEditableInput('capex', 'reserve_per_sf', 'Annual Reserve $/SF', 'currency')}
                </section>

                 {/* --- Investment Structure --- */}
                <section className="bg-white p-4 shadow rounded-lg space-y-2">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-2">Investment Structure & Returns</h3>
                    {renderCalculatedValue('Equity Investment', investment?.equity_investment, 'currency')}
                    {renderEditableInput('investment', 'target_irr', 'Target IRR %', 'percent')}
                    {renderEditableInput('investment', 'target_equity_multiple', 'Target Equity Multiple', 'number')}
                     <hr className="my-3"/>
                     {renderCalculatedValue('Actual IRR (Calculated)', investment?.actual_irr, 'percent', 2)}
                     {renderCalculatedValue('Actual Equity Multiple (Calc.)', investment?.actual_equity_multiple, 'decimal', 2)}
                     {renderCalculatedValue('IRR Variance', investment?.irr_variance, 'percent', 2)}
                     {renderCalculatedValue('Multiple Variance', investment?.multiple_variance, 'decimal', 2)}
                 </section>
                 
                  {/* Placeholder for yearly tables if needed */}
                  {/* Example: Yearly Projected Value Table 
                  <section className="bg-white p-4 shadow rounded-lg xl:col-span-3">
                     <h3 className="text-lg font-semibold text-gray-700 mb-3">Projected Value (10 Years)</h3>
                      <Table size="sm">
                         <TableHeader><TableRow>{valuation?.yearly_projected_value?.map((_, i) => <TableHead key={i}>{new Date().getFullYear() + i}</TableHead>)}</TableRow></TableHeader>
                         <TableBody><TableRow>{valuation?.yearly_projected_value?.map((val, i) => <TableCell key={i}>{formatNumber(val, 'currency')}</TableCell>)}</TableRow></TableBody>
                     </Table>
                  </section>*/} 
            </div>
        </div>
    );
}

export default Assumptions; 