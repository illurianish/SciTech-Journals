import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from './http';

// --- Types ---
export interface AcquisitionData {
  purchase_price: number | null;
  closing_costs: number | null;
  due_diligence_costs: number | null;
  initial_capital_expenditure: number | null;
  total_acquisition_cost: number | null;
}

export interface FinancingData {
  loan_amount: number | null;
  loan_to_value: number | null;
  interest_rate: number | null;
  amortization_years: number | null;
  loan_term_years: number | null;
  annual_debt_service: number | null;
  yearly_principal: (number | null)[];
  yearly_interest: (number | null)[];
  yearly_loan_balance: (number | null)[];
}

export interface OperationsYearData {
  year: number;
  net_operating_income: number | null;
  capital_costs: number | null;
  cash_flow_before_debt: number | null;
  debt_service: number | null;
  cash_flow_after_debt: number | null;
}

export interface SaleProceedsData {
  sale_year: number | null;
  exit_cap_rate: number | null;
  sale_price: number | null;
  selling_costs_percent: number | null;
  selling_costs_amount: number | null;
  remaining_loan_balance: number | null;
  net_sale_proceeds: number | null;
}

export interface InvestmentReturnsData {
  equity_investment: number | null;
  yearly_cash_on_cash: (number | null)[];
  irr: number | null;
  equity_multiple: number | null;
}

export interface CashFlowStatementData {
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

// --- Utility Functions ---
export const formatNumber = (value: number | null | undefined, style: 'currency' | 'decimal' | 'percent' | 'integer', digits: number = 2): string => {
  if (value === null || typeof value === 'undefined' || isNaN(value)) return 'N/A';
  try {
      const options: Intl.NumberFormatOptions = {};
      if (style === 'currency') { options.style = 'currency'; options.currency = 'USD'; options.minimumFractionDigits = 0; options.maximumFractionDigits = 0; }
      else if (style === 'percent') { options.style = 'percent'; options.minimumFractionDigits = digits; options.maximumFractionDigits = digits; }
      else if (style === 'integer') { options.minimumFractionDigits = 0; options.maximumFractionDigits = 0; }
      else { options.minimumFractionDigits = digits; options.maximumFractionDigits = digits; }
      return new Intl.NumberFormat('en-US', options).format(value);
  } catch (error) { console.error("CF Number Format Error:", error); return String(value); }
};

// Basic PMT calculation (Interest Rate per period, Number of periods, Present Value)
export const calculatePMT = (ratePerPeriod: number, numberOfPeriods: number, presentValue: number): number => {
    if (ratePerPeriod === 0) return presentValue / numberOfPeriods;
    return (presentValue * ratePerPeriod * Math.pow(1 + ratePerPeriod, numberOfPeriods)) / (Math.pow(1 + ratePerPeriod, numberOfPeriods) - 1);
};

// Basic IRR calculation (requires iteration - simplified placeholder)
// A proper implementation would use Newton-Raphson or similar.
export const calculateCashFlowIRR = (cashFlows: number[], guess: number = 0.1): number | null => {
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

// --- Calculation Logic --- 
// This function recalculates derived fields based on input data
export const recalculateCashFlow = (inputData: CashFlowStatementData): CashFlowStatementData => {
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
        data.financing.yearly_loan_balance.push(y < loanTermYears ? endBalance : (y > 0 ? data.financing.yearly_loan_balance[y-1] : loanAmount)); // Carry balance after term
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
    const noiAtSaleYear = data.noi_forecast[saleYearIndex + 1] ?? data.noi_forecast[saleYearIndex] ?? 0; // NOI in year AFTER sale year
    const exitCap = data.sale_proceeds.exit_cap_rate ?? 0;
    data.sale_proceeds.sale_price = (exitCap > 0) ? noiAtSaleYear / exitCap : null;
    
    const sellingCostsPercent = data.sale_proceeds.selling_costs_percent ?? 0;
    const salePrice = data.sale_proceeds.sale_price ?? 0;
    data.sale_proceeds.selling_costs_amount = salePrice * sellingCostsPercent;
    
    data.sale_proceeds.remaining_loan_balance = (saleYearIndex >= 0 && saleYearIndex < years) ? data.financing.yearly_loan_balance[saleYearIndex] : null;
    const remainingLoan = data.sale_proceeds.remaining_loan_balance ?? 0;
    const sellingCostsAmount = data.sale_proceeds.selling_costs_amount ?? 0;
    data.sale_proceeds.net_sale_proceeds = salePrice - sellingCostsAmount - remainingLoan;

    // 5. Investment Returns
    const totalAcquisition = data.acquisition.total_acquisition_cost ?? 0;
    data.investment_returns.equity_investment = totalAcquisition - loanAmount;
    const equity = data.investment_returns.equity_investment;

    data.investment_returns.yearly_cash_on_cash = [];
    const cashFlowStreamForIRR: number[] = equity && equity > 0 ? [-equity] : [0]; // Start with negative equity investment
    let cumulativeCashFlow = 0;
    for (let y = 0; y < years; y++) {
        const cfAfterDebt = data.operations[y].cash_flow_after_debt ?? 0;
        const coc = (equity && equity > 0) ? cfAfterDebt / equity : null;
        data.investment_returns.yearly_cash_on_cash.push(coc);
        
        let yearEndCashFlow = cfAfterDebt;
        // Add net sale proceeds in the sale year
        if (y === saleYearIndex) {
            yearEndCashFlow += (data.sale_proceeds.net_sale_proceeds ?? 0);
        }
        cashFlowStreamForIRR.push(yearEndCashFlow);
        cumulativeCashFlow += yearEndCashFlow;
    }
    
    data.investment_returns.irr = calculateCashFlowIRR(cashFlowStreamForIRR);
    data.investment_returns.equity_multiple = (equity && equity > 0) ? (cumulativeCashFlow + equity) / equity : null; // (Total Cash Received) / Equity

    return data;
};

// --- Sample Data Generation ---
export const generateSampleCashFlowData = (propertyId: string): CashFlowStatementData => {
    const years = 10;
    const currentYear = new Date().getFullYear();
    // Sample base data (would normally come from property details, IS, CapEx plan, assumptions)
    const purchasePrice = 5000000 + Math.random() * 2000000;
    const propertySF = 60000 + Math.random() * 40000;
    const noiY1 = purchasePrice * (0.05 + Math.random() * 0.02); // 5-7% cap rate initially
    const noiGrowth = 0.02 + Math.random() * 0.01;
    const capexReservePerSf = 0.5 + Math.random() * 1.0;
    const saleYear = currentYear + years - 1; // Assume sale at end of projection
    const exitCap = 0.06 + Math.random() * 0.015;

    const noiForecast = Array.from({ length: years }, (_, i) => noiY1 * Math.pow(1 + noiGrowth, i));
    const capexForecast = Array.from({ length: years }, (_, i) => propertySF * capexReservePerSf * Math.pow(1 + noiGrowth, i)); // Assume capex grows too

    let sample: CashFlowStatementData = {
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

// --- Hooks ---
export function useCashFlowStatement(propertyId: string) {
  return useQuery({
    queryKey: ['cash-flow-statement', propertyId],
    queryFn: async () => {
      if (!propertyId) {
        throw new Error('Property ID is required');
      }
      const res = await http.get(`/api/financial/cashflow/${propertyId}`);
      return res.data;
    },
    enabled: !!propertyId,
  });
}

export function useUpdateCashFlowStatement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ propertyId, cashFlowData }: { propertyId: string; cashFlowData: Partial<CashFlowStatementData> }) => {
      const res = await http.put(`/api/financial/cashflow/${propertyId}`, cashFlowData);
      return res.data;
    },
    onSuccess: (_, { propertyId }) => {
      queryClient.invalidateQueries({ queryKey: ['cash-flow-statement', propertyId] });
      queryClient.invalidateQueries({ queryKey: ['financial-assumptions', propertyId] });
    },
  });
}

export function useSaveCashFlowField() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      propertyId, 
      section, 
      field, 
      value 
    }: { 
      propertyId: string; 
      section: keyof CashFlowStatementData; 
      field: string; 
      value: any; 
    }) => {
      const res = await http.patch(`/api/financial/cashflow/${propertyId}/field`, {
        section,
        field,
        value
      });
      return res.data;
    },
    onSuccess: (_, { propertyId }) => {
      queryClient.invalidateQueries({ queryKey: ['cash-flow-statement', propertyId] });
    },
  });
}
