import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from './http';

// Types
export interface PropertySummary {
  id: string;
  property_name: string;
  address: string;
  property_type: string;
  purchase_price: number;
  purchase_date: string;
  square_feet: number;
  exit_year: number;
  exit_cap_rate: number;
}

export interface CalculatedFinancials {
  current_value: number;
  noi: number;
  cap_rate: number;
  cash_on_cash: number;
  irr: number;
  dscr: number;
}

export interface YearlyProjection {
  year: number;
  occupancy: number;
  revenue: number;
  noi: number;
  cashFlow: number;
  value: number;
}

export interface EditablePropertyData {
  purchase_price: number;
  purchase_date: Date;
  square_feet: number;
  exit_year: number;
  exit_cap_rate: number;
}

// Hooks
export function usePropertySummary(propertyId: string) {
  return useQuery({
    queryKey: ['property-summary', propertyId],
    queryFn: async () => {
      if (!propertyId) {
        throw new Error('Property ID is required');
      }
      const res = await http.get(`/api/financial/summary/${propertyId}`);
      return res.data;
    },
    enabled: !!propertyId,
  });
}

export function useUpdatePropertySummary() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ propertyId, propertyData }: { propertyId: string; propertyData: Partial<EditablePropertyData> }) => {
      const res = await http.put(`/api/financial/summary/${propertyId}`, propertyData);
      return res.data;
    },
    onSuccess: (_, { propertyId }) => {
      queryClient.invalidateQueries({ queryKey: ['property-summary', propertyId] });
      queryClient.invalidateQueries({ queryKey: ['financial-calculations'] });
    },
  });
}

export function useFinancialCalculations(propertyId: string) {
  return useQuery({
    queryKey: ['financial-calculations', propertyId],
    queryFn: async () => {
      if (!propertyId) {
        throw new Error('Property ID is required');
      }
      const res = await http.get(`/api/financial/calculations/${propertyId}`);
      return res.data;
    },
    enabled: !!propertyId,
  });
}

// Utility Functions
export function calculateInitialValues(data: PropertySummary): CalculatedFinancials {
  const purchasePrice = data.purchase_price || 0;
  const noi = purchasePrice * 0.06; // Assuming 6% NOI yield
  const capRate = 0.06; // Assuming 6% cap rate

  return {
    current_value: purchasePrice * 1.1, // Assuming 10% appreciation
    noi: noi,
    cap_rate: capRate,
    cash_on_cash: 0.07, // Assuming 7% cash on cash return
    irr: 0.12, // Assuming 12% IRR
    dscr: 1.25, // Assuming 1.25x DSCR
  };
}

export function generateProjections(data: PropertySummary): YearlyProjection[] {
  const purchasePrice = data.purchase_price || 0;
  const noi = purchasePrice * 0.06; // Assuming 6% NOI yield
  const projections: YearlyProjection[] = [];

  for (let i = 1; i <= 10; i++) {
    const yearData: YearlyProjection = {
      year: i,
      occupancy: 0.92 + (i * 0.005), // Starting at 92%, increasing slightly each year
      revenue: purchasePrice * 0.09 * (1 + (i * 0.02)), // Growing revenue each year
      noi: noi * (1 + (i * 0.02)), // Growing NOI each year
      cashFlow: purchasePrice * 0.04 * (1 + (i * 0.02)), // Growing cash flow each year
      value: purchasePrice * (1 + (i * 0.025)), // Growing property value each year
    };
    projections.push(yearData);
  }

  return projections;
}

export function calculateNOI(purchasePrice: number, occupancy: number = 0.95): number {
  // Basic NOI calculation: Purchase Price * Cap Rate * Occupancy
  const capRate = 0.06; // 6% cap rate
  return purchasePrice * capRate * occupancy;
}

export function calculateCapRate(noi: number, propertyValue: number): number {
  return propertyValue > 0 ? noi / propertyValue : 0;
}

export function calculateCashOnCash(annualCashFlow: number, totalInvestment: number): number {
  return totalInvestment > 0 ? annualCashFlow / totalInvestment : 0;
}

export function calculateIRR(cashFlows: number[], initialInvestment: number): number {
  // Simplified IRR calculation - in a real implementation, you'd use a more sophisticated algorithm
  if (cashFlows.length === 0 || initialInvestment <= 0) return 0;
  
  const totalCashFlow = cashFlows.reduce((sum, flow) => sum + flow, 0);
  const totalReturn = (totalCashFlow - initialInvestment) / initialInvestment;
  
  // Convert to annual rate (simplified)
  return Math.pow(1 + totalReturn, 1 / cashFlows.length) - 1;
}

export function calculateDSCR(noi: number, debtService: number): number {
  return debtService > 0 ? noi / debtService : 0;
}

export function calculateCurrentValue(purchasePrice: number, appreciationRate: number = 0.025, yearsHeld: number = 1): number {
  return purchasePrice * Math.pow(1 + appreciationRate, yearsHeld);
}

// Formatting Functions
export function formatCurrency(amount: number): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
}

export function formatPercent(value: number): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}

export function formatDateForInputSummary(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function formatDateForDisplay(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

// Chart Data Generators
export function generateChartData(projections: YearlyProjection[]) {
  return {
    labels: projections.map(p => `Year ${p.year}`),
    datasets: [
      {
        label: 'NOI',
        data: projections.map(p => p.noi),
        borderColor: 'rgb(59, 130, 246)', // Primary blue color
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Cash Flow',
        data: projections.map(p => p.cashFlow),
        borderColor: 'rgb(16, 185, 129)', // Secondary green color
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.3,
      },
    ],
  };
}

export function generateChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '10-Year Financial Performance',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => formatCurrency(value),
        },
      },
    },
  };
}

// Validation Functions
export function validatePropertyData(data: Partial<EditablePropertyData>): string[] {
  const errors: string[] = [];

  if (data.purchase_price !== undefined && data.purchase_price <= 0) {
    errors.push('Purchase price must be greater than 0');
  }

  if (data.square_feet !== undefined && data.square_feet <= 0) {
    errors.push('Square footage must be greater than 0');
  }

  if (data.exit_year !== undefined && (data.exit_year < 1 || data.exit_year > 30)) {
    errors.push('Exit year must be between 1 and 30');
  }

  if (data.exit_cap_rate !== undefined && (data.exit_cap_rate < 0 || data.exit_cap_rate > 0.2)) {
    errors.push('Exit cap rate must be between 0% and 20%');
  }

  return errors;
}

// Default Data
export const defaultPropertyData: PropertySummary = {
  id: '',
  property_name: 'michele',
  address: '472 West Broadway',
  property_type: 'Commercial',
  purchase_price: 5000000,
  purchase_date: '2022-01-15',
  square_feet: 105000,
  exit_year: 10,
  exit_cap_rate: 0.065,
};

export const defaultEditableData: EditablePropertyData = {
  purchase_price: 5000000,
  purchase_date: new Date('2022-01-15'),
  square_feet: 105000,
  exit_year: 10,
  exit_cap_rate: 0.065,
};
