import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from './http';

// Types
export interface FinancialAssumptions {
  // Property Summary
  propertyName: string;
  propertyType: string;
  status: string;
  fund: string;
  tags: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;

  // Property Details
  yearBuilt: string | number;
  squareFootage: string | number;
  psf: string | number;
  areaUnit: string;
  units: string | number;
  landlordName: string;
  landlordAddress: string;

  // Facilities & Insurance
  parkingFacilitiesDescription: string;
  landlordRepairsFacilities: string;
  landlordInsurance: string;

  // Zoning & Easements
  zoningCode: string;
  easementType: string;

  // Superior Interest Holders
  numSuperiorInterestHolders: string | number;
  listSuperiorInterestHolders: string;

  // Property Financials
  analysisStart: string;
  analysisPeriod: number;
  exitValuationNOI: string;
  exitCapRateGrowth: string;
  marketCapRateYr1: number;
  discountRate: number;

  // Acquisition Information
  purchasePriceMethod: string;
  upfrontCapEx: number;
  dueDiligenceClosingCost: number;
  sellingCostAtExit: number;
  setPurchasePrice: number;

  // Financing Assumptions
  financingInterestRate: number;
  financingYearsIO: number;
  financingAmoPeriod: number;
  financingTerm: number;
  financingLTV: number;
  financingLenderFees: number;

  // Operating Assumptions
  operatingVacancy: number;
  managementFee: number;
}

export interface AssumptionsFormData extends FinancialAssumptions {
  [key: string]: any; // Allow for dynamic field access
}

// Hooks
export function useFinancialAssumptions(propertyId: string) {
  return useQuery({
    queryKey: ['financial-assumptions', propertyId],
    queryFn: async () => {
      if (!propertyId) {
        throw new Error('Property ID is required');
      }
      
      console.log('Fetching financial assumptions for propertyId:', propertyId);
      console.log('API URL:', `/api/properties/${propertyId}/financial-assumptions`);
      
      try {
        console.log('Making API request to:', `/api/properties/${propertyId}/financial-assumptions`);
        
        // Check if token exists
        const token = localStorage.getItem('authToken');
        console.log('Auth token exists:', !!token);
        console.log('Auth token length:', token?.length);
        
        // Test if we can reach the backend at all
        try {
          const testRes = await http.get('/api/property');
          console.log('Backend is reachable, properties endpoint works');
        } catch (testError) {
          console.error('Backend connectivity test failed:', testError);
        }
        
        const res = await http.get(`/api/properties/${propertyId}/financial-assumptions`);
        console.log('API Response Status:', res.status);
        console.log('API Response Headers:', res.headers);
        console.log('API Response Data:', res.data);
        
        if (!res.data) {
          console.warn('API returned empty data, using defaults');
          return defaultFinancialAssumptions;
        }
        
        // The backend returns { success: true, data: responseData }
        // We need to extract the actual data from the response
        if (res.data.success && res.data.data) {
          console.log('Extracted data from API response:', res.data.data);
          return res.data.data;
        } else if (res.data.success === false) {
          console.error('API returned error:', res.data.error);
          throw new Error(res.data.error || 'API returned an error');
        } else {
          console.warn('Unexpected API response format:', res.data);
          console.warn('Using defaults due to unexpected format');
          return defaultFinancialAssumptions;
        }
              } catch (error: any) {
          console.error('Error fetching financial assumptions:', error);
          console.error('Error details:', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers
          });
          
          // If it's a 404, the property might not exist or user doesn't have access
          if (error.response?.status === 404) {
            console.warn('Property not found or access denied, using defaults');
            return defaultFinancialAssumptions;
          }
          
          // If it's a 401, authentication issue
          if (error.response?.status === 401) {
            console.error('Authentication failed, check token');
            throw new Error('Authentication failed. Please log in again.');
          }
          
          // For other errors, return default data
          console.warn('API error, using default data');
          return defaultFinancialAssumptions;
        }
    },
    enabled: !!propertyId,
    // Provide default data while loading
    placeholderData: defaultFinancialAssumptions,
    retry: 1, // Only retry once to avoid too many failed requests
    retryDelay: 1000, // Wait 1 second before retrying
  });
}

export function useUpdateFinancialAssumptions() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ propertyId, assumptionsData }: { propertyId: string; assumptionsData: Partial<FinancialAssumptions> }) => {
      const res = await http.put(`/api/properties/${propertyId}/financial-assumptions`, assumptionsData);
      return res.data;
    },
    onSuccess: (_, { propertyId }) => {
      queryClient.invalidateQueries({ queryKey: ['financial-assumptions', propertyId] });
      queryClient.invalidateQueries({ queryKey: ['property-summary'] });
    },
  });
}

export function useImportFinancialData() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ propertyId, importData }: { propertyId: string; importData: any }) => {
      const res = await http.post(`/api/properties/${propertyId}/import-financial-data`, importData);
      return res.data;
    },
    onSuccess: (_, { propertyId }) => {
      queryClient.invalidateQueries({ queryKey: ['financial-assumptions', propertyId] });
      queryClient.invalidateQueries({ queryKey: ['property-summary'] });
    },
  });
}

// --- Utility Functions ---
export const formatDateForInputAssumptions = (dateString: string | null): string => {
  if (!dateString) return "";
  try {
    const [y, m, d] = dateString.split("-");
    const dt = new Date(Date.UTC(+y, +m - 1, +d));
    return dt.toISOString().split("T")[0];
  } catch {
    return "";
  }
};

export const validateFinancialAssumptions = (data: Partial<FinancialAssumptions>): string[] => {
  const errors: string[] = [];

  // Required fields
  if (!data.propertyName?.trim()) {
    errors.push('Property name is required');
  }

  if (!data.analysisStart) {
    errors.push('Analysis start date is required');
  }

  // Numeric validations
  if (data.analysisPeriod !== undefined && (data.analysisPeriod < 1 || data.analysisPeriod > 50)) {
    errors.push('Analysis period must be between 1 and 50 years');
  }

  if (data.marketCapRateYr1 !== undefined && (data.marketCapRateYr1 < 0 || data.marketCapRateYr1 > 20)) {
    errors.push('Market cap rate must be between 0% and 20%');
  }

  if (data.discountRate !== undefined && (data.discountRate < 0 || data.discountRate > 30)) {
    errors.push('Discount rate must be between 0% and 30%');
  }

  if (data.financingInterestRate !== undefined && (data.financingInterestRate < 0 || data.financingInterestRate > 20)) {
    errors.push('Interest rate must be between 0% and 20%');
  }

  if (data.financingLTV !== undefined && (data.financingLTV < 0 || data.financingLTV > 100)) {
    errors.push('LTV must be between 0% and 100%');
  }

  if (data.operatingVacancy !== undefined && (data.operatingVacancy < 0 || data.operatingVacancy > 100)) {
    errors.push('Vacancy rate must be between 0% and 100%');
  }

  if (data.managementFee !== undefined && (data.managementFee < 0 || data.managementFee > 20)) {
    errors.push('Management fee must be between 0% and 20%');
  }

  return errors;
};

export const defaultFinancialAssumptions: FinancialAssumptions = {
  // Property Summary
  propertyName: "Hiland Office",
  propertyType: "N/A",
  status: "N/A",
  fund: "N/A",
  tags: "N/A",
  address: "N/A",
  city: "Hiland",
  state: "WI",
  zipcode: "N/A",

  // Property Details
  yearBuilt: "",
  squareFootage: "50000",
  psf: "400",
  areaUnit: "SF",
  units: "",
  landlordName: "",
  landlordAddress: "",

  // Facilities & Insurance
  parkingFacilitiesDescription: "N/A",
  landlordRepairsFacilities: "N/A",
  landlordInsurance: "N/A",

  // Zoning & Easements
  zoningCode: "N/A",
  easementType: "N/A",

  // Superior Interest Holders
  numSuperiorInterestHolders: "N/A",
  listSuperiorInterestHolders: "",

  // Property Financials
  analysisStart: "2025-07-01",
  analysisPeriod: 10,
  exitValuationNOI: "T12",
  exitCapRateGrowth: "5 bps",
  marketCapRateYr1: 6.5,
  discountRate: 7.5,

  // Acquisition Information
  purchasePriceMethod: "Manual Input",
  upfrontCapEx: 250000,
  dueDiligenceClosingCost: 2.0,
  sellingCostAtExit: 2.0,
  setPurchasePrice: 24508462,

  // Financing Assumptions
  financingInterestRate: 3.5,
  financingYearsIO: 0,
  financingAmoPeriod: 30,
  financingTerm: 10,
  financingLTV: 65,
  financingLenderFees: 1,

  // Operating Assumptions
  operatingVacancy: 10,
  managementFee: 3,
};
