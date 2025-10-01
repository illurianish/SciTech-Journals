"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// For Exit Year dropdown

// Define the expanded data structure for the summary dashboard
interface PropertySummaryFields {
  all_in_basis: number | null;
  going_in_cap_rate: number | null;
  price_per_sf: number | null;
  year1_noi: number | null;
  year3_noi: number | null;
  terminal_cap_rate: number | null;
  terminal_value: number | null;
}
interface PropertyMetrics {
  purchase_price: number | null;
  dcf_value: number | null;
  replacement_cost: number | null;
  unlevered_irr: number | null;
  unlevered_equity_multiple: number | null;
  avg_free_and_clear_return: number | null;
  levered_irr: number | null;
  levered_equity_multiple: number | null;
  avg_cash_on_cash_return: number | null;
  min_dscr_noi: number | null;
  min_debt_yield_noi: number | null;
}
interface FinancialAssumptions {
  loan_amount: number | null;
  lender_fees: number | null;
  equity_required: number | null;
  annual_io_payment: number | null;
  annual_amo_payment: number | null;
}
interface FinancialHighlight {
  current_value: number | null; // Calculated
  noi: number | null; // Calculated (from Income Statement)
  cap_rate: number | null; // Calculated (NOI / Current Value)
  cash_on_cash: number | null; // Calculated
  irr: number | null; // Calculated
  dscr: number | null; // Calculated (Debt Service Coverage Ratio)
  exit_year: number | null; // Editable (Dropdown)
  exit_cap_rate: number | null; // Editable (Percentage input)
}
interface PerformanceYear {
  year: number;
  occupancy: number | null; // Percentage
  revenue: number | null;
  noi: number | null;
  cash_flow: number | null;
  value: number | null;
}

interface IncomeStatement {
  base_rent: number | null;
  recovery_income: number | null;
  other_income: number | null;
  potential_gross_income: number | null;
  rent_abatement: number | null;
  vacancy: number | null;
  other_adjustment: number | null;
  effective_gross_revenue: number | null;
  marketing: number | null;
  administrative: number | null;
  utilities: number | null;
  payroll: number | null;
  repair_and_maintenance: number | null;
  management: number | null;
  insurance: number | null;
  taxes: number | null;
  operating_expenses: number | null;
  net_operating_income: number | null;
  tenant_improvements: number | null;
  leasing_commissions: number | null;
  capital_reserves: number | null;
  misc_capex: number | null;
  capital_expenditures: number | null;
  cash_flow_from_operations: number | null;
}


interface SummaryData
  extends PropertySummaryFields,
  PropertyMetrics,
  FinancialAssumptions,
  IncomeStatement,
  FinancialHighlight {
  performance_summary: PerformanceYear[];
}

// Define component props
interface SummaryDashboardTabProps {
  propertyId: string; // ID used for fetching/saving
  // We might need to pass basic property info (name, address, type) if not fetched here
  // For now, assume fetch includes it or use placeholders.
}

// Helper to format date for input type="date"
const formatDateForInput = (dateString: string | null): string => {
  if (!dateString) return "";
  try {
    // Ensure it's treated as UTC date to avoid timezone shifts in display
    const [year, month, day] = dateString.split("-");
    if (year && month && day) {
      // Create date in UTC
      const utcDate = new Date(
        Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day))
      );
      // Format as YYYY-MM-DD
      return utcDate.toISOString().split("T")[0];
    }
    return "";
  } catch (error) {
    console.error("Error formatting date for input:", dateString, error);
    return "";
  }
};

// Helper to format number for display
const formatNumber = (
  value: number | null | undefined,
  style: "currency" | "decimal" | "percent" | "integer" | "text",
  digits: number = 2
) => {
  if (value === null || typeof value === "undefined") return "N/A";
  try {
    const options: Intl.NumberFormatOptions = {};
    if (style === "currency") {
      options.style = "currency";
      options.currency = "USD";
      options.minimumFractionDigits = 0;
      options.maximumFractionDigits = 0;
    } else if (style === "percent") {
      options.style = "percent";
      options.minimumFractionDigits = digits;
      options.maximumFractionDigits = digits;
    } else if (style === "integer") {
      options.minimumFractionDigits = 0;
      options.maximumFractionDigits = 0;
    } else if (style === "text") {
      // For text fields, just return the value as is
      return value ?? "N/A";
    } else {
      // decimal
      options.minimumFractionDigits = digits;
      options.maximumFractionDigits = digits;
    }
    return new Intl.NumberFormat("en-US", options).format(value);
  } catch (error) {
    console.error("Error formatting number:", value, style, error);
    return String(value); // Fallback to string
  }
};

// Generate sample 10-year performance data
const generateSamplePerformance = (startYear: number): PerformanceYear[] => {
  return Array.from({ length: 10 }, (_, i) => {
    const year = startYear + i;
    return {
      year: year,
      occupancy: 0.9 + Math.random() * 0.09, // 90-99%
      revenue: 500000 + i * 25000 + Math.random() * 10000,
      noi: 300000 + i * 15000 + Math.random() * 8000,
      cash_flow: 100000 + i * 10000 + Math.random() * 5000,
      value: 5000000 + i * 200000 + Math.random() * 50000,
    };
  });
};

// Generate sample summary data
const generateSampleSummaryData = (propertyId: string): SummaryData => {
  const currentYear = new Date().getFullYear();
  return {
    all_in_basis: 25000000 + Math.floor(Math.random() * 1000000),
    going_in_cap_rate: 0.065,
    price_per_sf: 490.17,
    year1_noi: 1593050,
    year3_noi: 1568002,
    terminal_cap_rate: 0.07,
    terminal_value: 24365431.89,
    current_value: 24500000,
    noi: 1600000,
    cap_rate: 0.065,
    cash_on_cash: 0.09,
    irr: 0.14,
    dscr: 1.3,
    exit_year: currentYear + 10,
    exit_cap_rate: 0.065,
    performance_summary: generateSamplePerformance(currentYear),
    purchase_price: 24508462,
    dcf_value: 21284123.18,
    replacement_cost: 20000000,
    unlevered_irr: 0.052,
    unlevered_equity_multiple: 1.52,
    avg_free_and_clear_return: 0.0571,
    levered_irr: 0.074,
    levered_equity_multiple: 1.77,
    avg_cash_on_cash_return: 0.0616,
    min_dscr_noi: 1.8,
    min_debt_yield_noi: 0.102,
    loan_amount: 15930500,
    lender_fees: 159305,
    equity_required: 9477436,
    annual_amo_payment: 858421,
    annual_io_payment: 557568,
    base_rent: 35.00,
    recovery_income: 13.70,
    other_income: 2.00,
    potential_gross_income: 50.70,
    rent_abatement: 0.00,
    vacancy: 5.07,
    other_adjustment: 0.00,
    effective_gross_revenue: 45.63,
    marketing: 0.30,
    administrative: 1.30,
    utilities: 1.50,
    payroll: 1.90,
    repair_and_maintenance: 1.70,
    management: 1.37,
    insurance: 0.70,
    taxes: 5.00,
    operating_expenses: 13.77,
    net_operating_income: 31.86,
    tenant_improvements: 0.00,
    leasing_commissions: 0.00,
    capital_reserves: 0.50,
    misc_capex: 0.00,
    capital_expenditures: 0.50,
    cash_flow_from_operations: 31.36,
  };
};
const SummaryDashboardTab: React.FC<SummaryDashboardTabProps> = ({
  propertyId,
}) => {
  const [data, setData] = useState<SummaryData | null>(null);
  const [initialData, setInitialData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  const loadDataFromLocalStorage = () => {
    setLoading(true);
    setError(null);
    try {
      const storedData = localStorage.getItem('financialHubData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log('Successfully retrieved data from localStorage:', parsedData);

        // Map the parsed data to the component's state structure
        const mappedData: SummaryData = {
          // Property Summary
          all_in_basis: parsedData.property_summary['All-in Basis'] || null,
          going_in_cap_rate: parsedData.property_summary['Going-in Cap Rate (%)'] !== undefined ? parsedData.property_summary['Going-in Cap Rate (%)'] / 100 : null,
          price_per_sf: parsedData.property_summary['Price/SF'] || null,
          year1_noi: parsedData.property_summary['Year 1 NOI'] || null,
          year3_noi: parsedData.property_summary['Year 3 NOI'] || null,
          terminal_cap_rate: parsedData.property_summary['Terminal Cap Rate (%)'] !== undefined ? parsedData.property_summary['Terminal Cap Rate (%)'] / 100 : null,
          terminal_value: parsedData.property_summary['Terminal Value'] || null,

          // Financial Assumptions
          loan_amount: parsedData.financing_assumptions['Loan Amount'] || null,
          lender_fees: parsedData.financing_assumptions['Lender Fees'] || null,
          equity_required: parsedData.financing_assumptions['Equity Required'] || null,
          annual_io_payment: parsedData.financing_assumptions['Annual Interest-Only Payment'] || null,
          annual_amo_payment: parsedData.financing_assumptions['Annual Amortizing Payment'] || null,

          // Income Statement
          administrative: parsedData.income_statement_summary['Administrative ($/SF)'] || null,
          base_rent: parsedData.income_statement_summary['Base Rent ($/SF)'] || null,
          capital_expenditures: parsedData.income_statement_summary['Capital Expenditures ($/SF)'] || null,
          capital_reserves: parsedData.income_statement_summary['Capital Reserves ($/SF)'] || null,
          cash_flow_from_operations: parsedData.income_statement_summary['Cash Flow From Operations ($/SF)'] || null,
          effective_gross_revenue: parsedData.income_statement_summary['Effective Gross Revenue ($/SF)'] || null,
          insurance: parsedData.income_statement_summary['Insurance ($/SF)'] || null,
          leasing_commissions: parsedData.income_statement_summary['Leasing Commissions ($/SF)'] || null,
          management: parsedData.income_statement_summary['Management ($/SF)'] || null,
          marketing: parsedData.income_statement_summary['Marketing ($/SF)'] || null,
          misc_capex: parsedData.income_statement_summary['Misc CapEx ($/SF)'] || null,
          net_operating_income: parsedData.income_statement_summary['Net Operating Income ($/SF)'] || null,
          operating_expenses: parsedData.income_statement_summary['Operating Expenses ($/SF)'] || null,
          other_adjustment: parsedData.income_statement_summary['Other Adjustment ($/SF)'] || null,
          other_income: parsedData.income_statement_summary['Other Income ($/SF)'] || null,
          payroll: parsedData.income_statement_summary['Payroll ($/SF)'] || null,
          potential_gross_income: parsedData.income_statement_summary['Potential Gross Income ($/SF)'] || null,
          recovery_income: parsedData.income_statement_summary['Recovery Income ($/SF)'] || null,
          rent_abatement: parsedData.income_statement_summary['Rent Abatement ($/SF)'] || null,
          repair_and_maintenance: parsedData.income_statement_summary['Repair and Maintenance ($/SF)'] || null,
          taxes: parsedData.income_statement_summary['Taxes ($/SF)'] || null,
          tenant_improvements: parsedData.income_statement_summary['Tenant Improvements ($/SF)'] || null,
          utilities: parsedData.income_statement_summary['Utilities ($/SF)'] || null,
          vacancy: parsedData.income_statement_summary['Vacancy ($/SF)'] || null,

          // Property Metrics
          purchase_price: parsedData.property_metrics['Purchase Price'] || null,
          dcf_value: parsedData.property_metrics['DCF Value'] || null,
          replacement_cost: parsedData.property_metrics['Replacement Cost'] || null,
          unlevered_irr: parsedData.property_metrics['Unlevered IRR'] || null,
          unlevered_equity_multiple: parsedData.property_metrics['Unlevered Equity Multiple'] || null,
          avg_free_and_clear_return: parsedData.property_metrics['Avg. Free and Clear Return'] || null,
          levered_irr: parsedData.property_metrics['Levered IRR'] || null,
          levered_equity_multiple: parsedData.property_metrics['Levered Equity Multiple'] || null,
          avg_cash_on_cash_return: parsedData.property_metrics['Avg. Cash-on-Cash Return'] || null,
          min_dscr_noi: parsedData.property_metrics['Min. DSCR (NOI)'] || null,
          min_debt_yield_noi: parsedData.property_metrics['Min. Debt Yield (NOI)'] || null,

          // Placeholder/Sample data for fields not in localStorage payload
          performance_summary: generateSamplePerformance(new Date().getFullYear()),
          current_value: null,
          noi: null,
          cap_rate: null,
          cash_on_cash: null,
          irr: null,
          dscr: null,
          exit_year: new Date().getFullYear() + 10,
          exit_cap_rate: null,
          
        };

        setData(mappedData);
        setInitialData(mappedData);
      } else {
        // No data in localStorage, fall back to sample data
        console.warn('No financialHubData found in localStorage, using sample data.');
        const sampleData = generateSampleSummaryData(propertyId);
        setData(sampleData);
        setInitialData(sampleData);
        setError('No saved data found. Displaying sample data.');
      }
    } catch (err) {
      console.error('Error parsing data from localStorage:', err);
      const sampleData = generateSampleSummaryData(propertyId);
      setData(sampleData);
      setInitialData(sampleData);
      setError('Error processing data. Displaying sample data.');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (propertyId) {
      // Only fetch if propertyId is available
      // fetchData(); // fetchOutputData does a similar thing
      // fetchOutputData();
      loadDataFromLocalStorage();
      console.log("data fetched for ", propertyId)
    } else {
      // Handle case where propertyId is not yet available (e.g., initial load)
      setData(null);
      setInitialData(null);
      setError("No property selected.");
      setLoading(false);
    }
  }, [propertyId]); // Rerun if propertyId changes

  // --- Input Handling ---
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setData((prevData) => {
      if (!prevData) return null;
      let processedValue: string | number | null = value;

      if (
        type === "number" ||
        (e.target instanceof HTMLInputElement &&
          e.target.inputMode === "numeric")
      ) {
        processedValue = value === "" ? null : parseFloat(value);
        if (isNaN(processedValue as number)) processedValue = null;
      }
      // Handle percentage input for exit_cap_rate (assuming user enters e.g., 6.5 for 6.5%)
      if (name === "exit_cap_rate" && typeof processedValue === "number") {
        processedValue = processedValue / 100;
      }

      return { ...prevData, [name]: processedValue };
    });
  };

  // Handle Exit Year Dropdown Change
  const handleExitYearChange = (value: string) => {
    const year = value ? parseInt(value, 10) : null;
    setData((prevData) => {
      if (!prevData) return null;
      return { ...prevData, exit_year: isNaN(year!) ? null : year };
    });
  };

  // --- Save/Cancel Logic ---
  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    setError(null);
    console.log()
  };

  const handleCancel = () => {
    setData(initialData); // Reset data to last saved state
    setEditMode(false);
    setError(null); // Clear errors
  };

  // --- Loading & Error States ---
  if (loading) return <div className="p-4 text-center">Loading Summary...</div>;
  // Show save error prominently
  if (error && saving)
    return (
      <div className="p-4 text-center text-red-500">Error Saving: {error}</div>
    );
  // Handle case where propertyId is missing after load attempt
  if (!propertyId || (!data && !loading)) {
    return (
      <div className="p-4 text-center text-gray-500">
        {error || "No property selected or data available."}
      </div>
    );
  }
  // If data exists (even sample data), proceed to render
  if (!data)
    return (
      <div className="p-4 text-center text-gray-500">
        No summary data loaded.
      </div>
    );

  // Determine years for exit year dropdown (e.g., current year + 20 years)
  const currentYear = new Date().getFullYear();
  const exitYearOptions = Array.from({ length: 21 }, (_, i) => currentYear + i);

  // --- Render Logic ---
  return (
    <div className="space-y-8 p-1">
      {error && !saving && (
        <div className="p-3 mb-4 text-center text-orange-700 bg-orange-100 border border-orange-300 rounded-md">
          Warning: {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Summary Dashboard
        </h2>
        {/* <div className="flex space-x-2">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-1.5 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Edit
            </button>
          )}
        </div> */}
      </div>

      {/* --- Property Information Section --- */}
      <section className="bg-white p-4 shadow rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">
          Property Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <EditableField
            label="All-in Basis"
            name="all_in_basis"
            value={data.all_in_basis}
            type="number"
            isEditing={editMode}
            onChange={handleInputChange}
            formatStyle="currency"
            inputColor="text-blue-600"
          />
          <EditableField
            label="Going-In Cap Rate (%)"
            name="going_in_cap_rate"
            value={
              data.going_in_cap_rate !== null
                ? data.going_in_cap_rate
                : null
            }
            type="number"
            isEditing={editMode}
            onChange={handleInputChange}
            formatStyle="percent"
            formatDigits={2}
            inputColor="text-blue-600"
            placeholder="e.g., 6.5"
          />
          <EditableField
            label="Price / SF"
            name="price_per_sf"
            value={data.price_per_sf}
            type="number"
            isEditing={editMode}
            onChange={handleInputChange}
            formatStyle="decimal"
            formatDigits={2}
            inputColor="text-blue-600"
          />
          <EditableField
            label="Year 1 NOI"
            name="year1_noi"
            value={data.year1_noi}
            type="number"
            isEditing={editMode}
            onChange={handleInputChange}
            formatStyle="currency"
            inputColor="text-blue-600"
          />
          <EditableField
            label="Year 3 NOI"
            name="year3_noi"
            value={data.year3_noi}
            type="number"
            isEditing={editMode}
            onChange={handleInputChange}
            formatStyle="currency"
            inputColor="text-blue-600"
          />
          <EditableField
            label="Terminal Cap Rate (%)"
            name="terminal_cap_rate"
            value={
              data.terminal_cap_rate !== null
                ? data.terminal_cap_rate
                : null
            }
            type="number"
            isEditing={editMode}
            onChange={handleInputChange}
            formatStyle="percent"
            formatDigits={2}
            inputColor="text-blue-600"
            placeholder="e.g., 7.0"
          />
          <EditableField
            label="Terminal Value"
            name="terminal_value"
            value={data.terminal_value}
            type="number"
            isEditing={editMode}
            onChange={handleInputChange}
            formatStyle="currency"
            inputColor="text-blue-600"
          />
        </div>
      </section>

      {/* --- Property Metrics Section --- */}
      <section className="bg-white p-4 shadow rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">
          Property Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoField
            label="Purchase Price"
            value={formatNumber(data.purchase_price, "currency")}
          />
          <InfoField
            label="DCF Value"
            value={formatNumber(data.dcf_value, "currency")}
            tooltip="Discounted Cash Flow using discount rate"
          />
          <InfoField
            label="Replacement Cost"
            value={formatNumber(data.replacement_cost, "currency")}
            tooltip="Replacement cost per SF × total rentable SF"
          />

          <InfoField
            label="Unlevered IRR"
            value={formatNumber(data.unlevered_irr / 100, "percent", 2)}
            tooltip="From pro forma cash flow output"
          />
          <InfoField
            label="Unlevered Equity Multiple"
            value={formatNumber(data.unlevered_equity_multiple, "decimal", 2)}
            tooltip="From pro forma cash flow output"
          />
          <InfoField
            label="Avg. Free and Clear Return"
            value={formatNumber(data.avg_free_and_clear_return / 100, "percent", 2)}
            tooltip="From pro forma table (analysis period)"
          />

          <InfoField
            label="Levered IRR"
            value={formatNumber(data.levered_irr / 100, "percent", 2)}
            tooltip="From pro forma cash flow output"
          />
          <InfoField
            label="Levered Equity Multiple"
            value={formatNumber(data.levered_equity_multiple, "decimal", 2)}
            tooltip="From pro forma cash flow output"
          />
          <InfoField
            label="Avg. Cash-on-Cash Return"
            value={formatNumber(data.avg_cash_on_cash_return / 100, "percent", 2)}
            tooltip="From pro forma table (analysis period)"
          />

          <InfoField
            label="Min. DSCR (NOI)"
            value={formatNumber(data.min_dscr_noi, "decimal", 2)}
            tooltip="Minimum Debt Service Coverage Ratio"
          />
          <InfoField
            label="Min. Debt Yield (NOI)"
            value={formatNumber(data.min_debt_yield_noi / 100, "percent", 2)}
            tooltip="Minimum debt yield from cash flow"
          />
        </div>
      </section>

      {/* --- Financing Assumptions Section --- */}
      <section className="bg-white p-4 shadow rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">
          Financing Assumptions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField
            label="Loan Amount"
            value={formatNumber(data.loan_amount, "currency")}
            tooltip="Purchase price * LTV"
          />
          <InfoField
            label="Lender Fees ($)"
            value={formatNumber(data.lender_fees, "currency")}
            tooltip="Loan * Lender fee %"
          />
          <InfoField
            label="Equity Required"
            value={formatNumber(data.equity_required, "currency")}
            tooltip="Basis - Debt"
          />
          <InfoField
            label="Annual Amo. Payment"
            value={formatNumber(data.annual_amo_payment, "currency")}
            tooltip="PMT(Interest rate/12, amortization yr *12, -loan)*12"
          />
          <InfoField
            label="Annual I/O Payment"
            value={formatNumber(data.annual_io_payment, "currency")}
            tooltip="Loan amount * interest rate"
          />
        </div>
      </section>

      {/* --- Income Statement Summary Section --- */}
      <section className="bg-white p-4 shadow rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">
          Income Statement Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Row 1: Base Rent, Recovery Income, Other Income */}
          <InfoField
            label="Base Rent ($/SF)"
            value={formatNumber(data.base_rent, "decimal", 2)}
          />
          <InfoField
            label="Recovery Income ($/SF)"
            value={formatNumber(data.recovery_income, "decimal", 2)}
          />
          <InfoField
            label="Other Income ($/SF)"
            value={formatNumber(data.other_income, "decimal", 2)}
          />

          {/* Row 2: Potential Gross Income (bold) */}
          <InfoField
            label={
              <span className="font-bold">Potential Gross Income ($/SF)</span>
            }
            value={formatNumber(data.potential_gross_income, "decimal", 2)}
          />

          {/* Row 3: Rent Abatement */}
          <InfoField label="Rent Abatement ($/SF)" value={formatNumber(data.rent_abatement, "decimal", 2)} />

          {/* Row 4: Vacancy, Other Adjustment */}
          <InfoField
            label="Vacancy ($/SF)"
            value={formatNumber(data.vacancy, "decimal", 2)}
          />
          <InfoField label="Other Adjustment ($/SF)" value={formatNumber(data.other_adjustment, "decimal", 2)} />

          {/* Row 5: Effective Gross Revenue (bold) */}
          <InfoField
            label={
              <span className="font-bold">Effective Gross Revenue ($/SF)</span>
            }
            value={formatNumber(data.effective_gross_revenue, "decimal", 2)}
          />

          {/* Row 6: Marketing, Administrative, Utilities, Payroll, Repair and Maintenance, Mgmt, Insurance, Taxes */}
          <InfoField
            label="Marketing ($/SF)"
            value={formatNumber(data.marketing, "decimal", 2)}
          />
          <InfoField
            label="Administrative ($/SF)"
            value={formatNumber(data.administrative, "decimal", 2)}
          />
          <InfoField
            label="Utilities ($/SF)"
            value={formatNumber(data.utilities, "decimal", 2)}
          />
          <InfoField
            label="Payroll ($/SF)"
            value={formatNumber(data.payroll, "decimal", 2)}
          />
          <InfoField
            label="Repair and Maintenance ($/SF)"
            value={formatNumber(data.repair_and_maintenance, "decimal", 2)}
          />
          <InfoField
            label="Mgmt (% of EGR) ($/SF)"
            value={formatNumber(data.management, "decimal", 2)}
          />
          <InfoField
            label="Insurance ($/SF)"
            value={formatNumber(data.insurance, "decimal", 2)}
          />
          <InfoField
            label="Taxes ($/SF)"
            value={formatNumber(data.taxes, "decimal", 2)}
          />

          {/* Row 7: Operating Expenses */}
          <InfoField
            label="Operating Expenses ($/SF)"
            value={formatNumber(data.operating_expenses, "decimal", 2)}
          />

          {/* Row 8: Net Operating Income (bold) */}
          <InfoField
            label={
              <span className="font-bold">Net Operating Income ($/SF)</span>
            }
            value={formatNumber(data.net_operating_income, "decimal", 2)}
          />

          {/* Row 9: Tenant Improvements, Leasing Commissions, Capital Reserves, Misc. CapEx, Capital Expenditures */}
          <InfoField label="Tenant Improvements ($/SF)" value={formatNumber(data.tenant_improvements, "decimal", 2)} />
          <InfoField label="Leasing Commissions ($/SF)" value={formatNumber(data.leasing_commissions, "decimal", 2)} />
          <InfoField
            label="Capital Reserves ($/SF)"
            value={formatNumber(data.capital_reserves, "decimal", 2)}
          />
          <InfoField label="Misc. CapEx ($/SF)" value={formatNumber(data.misc_capex, "decimal", )} />
          <InfoField
            label="Capital Expenditures ($/SF)"
            value={formatNumber(data.capital_expenditures, "decimal", 2)}
          />

          {/* Row 10: Cash Flow From Operations (bold) */}
          <InfoField
            label={
              <span className="font-bold">
                Cash Flow From Operations ($/SF)
              </span>
            }
            value={formatNumber(data.cash_flow_from_operations, "decimal", 2)}
          />
        </div>
      </section>
    </div>
  );
};

// --- Helper Components for Fields ---

// Read-only field component with optional tooltip
const InfoField: React.FC<{
  label: React.ReactNode;
  value: string | number | undefined | null;
  tooltip?: string;
}> = ({ label, value, tooltip }) => (
  <div className="relative group">
    <label className="block text-xs font-medium text-gray-500 mb-1">
      {label}
    </label>
    <p className="mt-1 text-sm text-gray-900 h-9 flex items-center px-3 bg-gray-50 rounded-md border border-gray-200">
      {value ?? "N/A"}
    </p>
    {tooltip && (
      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {tooltip}
      </span>
    )}
  </div>
);

// Editable field component
interface EditableFieldProps {
  label: string;
  name: keyof SummaryData;
  value: string | number | null | undefined;
  type: "text" | "number" | "date";
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formatStyle: "currency" | "decimal" | "percent" | "integer" | "date" | "text";
  formatDigits?: number;
  inputColor?: string; // e.g., 'text-blue-600'
  placeholder?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  name,
  value,
  type,
  isEditing,
  onChange,
  formatStyle,
  formatDigits = 2,
  inputColor = "text-gray-900",
  placeholder,
}) => {
  const displayValue =
    type === "date"
      ? formatDateForInput(value as string | null)
      : formatStyle === "currency"
        ? formatNumber(value as number | null, "currency")
        : formatStyle === "percent"
          ? formatNumber(value as number | null, "percent", formatDigits)
          : formatStyle === "integer"
            ? formatNumber(value as number | null, "integer")
            : formatStyle === "decimal"
              ? formatNumber(value as number | null, "decimal", formatDigits)
              : formatStyle === "text"
                ? value ?? "N/A" // Handle text fields
                : value ?? "N/A";

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs font-medium text-gray-500 mb-1"
      >
        {label}
      </label>
      {isEditing ? (
        <input
          type={type}
          id={name}
          name={name}
          // Handle value conversion for input display
          value={
            type === "date"
              ? formatDateForInput(value as string | null)
              : ((value ?? "") as string | number)
          }
          onChange={onChange}
          step={
            type === "number" && formatStyle === "percent"
              ? "0.01"
              : type === "number" && formatStyle === "decimal"
                ? "0.01"
                : "any"
          }
          className={`mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${inputColor}`}
          inputMode={type === "number" ? "numeric" : undefined}
          pattern={type === "number" ? "[0-9]*[.,]?[0-9]*" : undefined} // Allow decimals
          placeholder={placeholder}
        />
      ) : (
        <p
          className={`mt-1 text-sm h-9 flex items-center px-3 bg-gray-50 rounded-md border border-transparent ${inputColor}`}
        >
          {displayValue}
        </p>
      )}
    </div>
  );
};

// Editable Select Field Component
interface EditableSelectFieldProps {
  label: string;
  name: keyof SummaryData;
  value: string | number | null | undefined;
  options: { value: string | number; label: string }[];
  isEditing: boolean;
  onChange: (value: string) => void;
  inputColor?: string;
}

const EditableSelectField: React.FC<EditableSelectFieldProps> = ({
  label,
  name,
  value,
  options,
  isEditing,
  onChange,
  inputColor = "text-gray-900",
}) => {
  const displayValue =
    options.find((opt) => opt.value === value)?.label ?? "N/A";

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs font-medium text-gray-500 mb-1"
      >
        {label}
      </label>
      {isEditing ? (
        <Select value={value?.toString() ?? ""} onValueChange={onChange}>
          <SelectTrigger className={`mt-1 w-full ${inputColor}`}>
            <SelectValue placeholder={`Select ${label}...`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <p
          className={`mt-1 text-sm h-9 flex items-center px-3 bg-gray-50 rounded-md border border-transparent ${inputColor}`}
        >
          {displayValue}
        </p>
      )}
    </div>
  );
};

export default SummaryDashboardTab;
