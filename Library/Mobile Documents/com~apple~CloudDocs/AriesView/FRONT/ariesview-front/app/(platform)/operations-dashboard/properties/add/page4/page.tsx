'use client'

/**
 * AddUnitDataPage - Refactored to use document hooks from document.ts
 * 
 * Changes made:
 * - Replaced custom document upload logic with useDocumentUpload hook
 * - Replaced custom document deletion logic with useDocumentDeletion hook
 * - Created custom useDocumentManagement hook for better organization
 * - Removed redundant utility functions (deepClone, formatFileSize, etc.)
 * - Simplified nested state management
 * - Improved error handling and async operations
 */

import { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic';
const UnitInformationTable = dynamic(() => import('@/components/UnitInformationTable'), { ssr: false });
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePropertyForm } from '../PropertyFormContext' // Import context hook
import type { PropertyData, Document } from '../PropertyFormContext' // Import type
import { useCreateUnitDetails } from '@/app/rest/property' // Import React Query hook
import { 
  useDocumentUpload, 
  useDocumentDeletion, 
  formatFileSize, 
  getDocumentTypeFromMimeType 
} from '@/app/rest/document' // Import document hooks
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


// Define initial state structure matching PropertyData keys
const initialFormData: Partial<PropertyData> = {
  // DO NOT COMBINE into Property Summary. 
  // it will evoke a back-end error.

  // Page 1
  basicInformation: { // --> properties
    name: '', // fixed
    propertyType: '', // fixed
    status: '', // fixed
    fund: '', // fixed
    tags: [], // fixed
    address: '', // fixed
    city: '', // fixed
    state: '', // fixed
    zipcode: '', // fixed
  },

  propertyDetails: { // --> properties
    year_built: '', // fixed 
    square_footage: '', // fixed 
    psf: '', // fixed
    area_unit: '', // fixed
    units: '', // fixed 
    landlord_name: '', // fixed
    landlord_address: '', // fixed
  },

  propertyWideFacilitiesInsuranceMaintenance: { // --> properties
    parking_facilities_description: '', // fixed
    landlord_repairs_facilities: '', // fixed
    landlord_insurance: '', // fixed
  },

  // Page 3
  zoningAndEasements: { // --> zoning_and_easements
    zoning_code: '', // fixed
    easement_type: '', // fixed
  },

  superiorInterestHolders: { // --> superior_interest_holders
    num_superior_interest_holders: '', // fixed
    list_superior_interest_holders: '', // fixed
  },

  propertyFinancialsAndCharacteristics: { // --> property_financials_and_characteristics
    analysis_start: '', // fixed
    analysis_period: '', // fixed
    exit_valuation_noi: '', // fixed
    exit_cap_rate_growth: '', // fixed
    market_cap_rate: '', // fixed
    discount_rate: '', // fixed
  },

  acquisitionInformation: { // --> financial_acquisition_costs
    purchase_price_method: '', // fixed
    upfront_capex: '', // fixed
    due_diligence_costs: '', // fixed
    selling_cost_at_exit: '', // fixed
    purchase_price: '', // fixed
  },

  assumptions: {
    financing: { // --> financial_assumptions
      interest_rate_fin_assumptions: '', // fixed
      years_interest_only: '', // fixed
      amortization_period: '', // fixed
      loan_term: '', // fixed
      loan_to_value: '', // fixed
      lender_fees: '', // fixed
    },
    operating: { // --> operating_assumptions
      vacancy_rate: '', // fixed
      management_fee: '', // fixed
    },
  },
  cashFlows: {
    year_0: { // fixed
      baseRent: '',
      recoveryIncome: '',
      otherIncome: '',
      rentAbatement: '',
      vacancyAmount: '',
      marketing: '',
      administrative: '',
      utilities: '',
      payroll: '',
      repairAndMaintenance: '',
      mgmtOfEGR: '',
      insurance: '',
      taxes: '',
    },
    t12: { // fixed
      baseRent: '',
      recoveryIncome: '',
      otherIncome: '',
      rentAbatement: '',
      vacancyAmount: '',
      marketing: '',
      administrative: '',
      utilities: '',
      payroll: '',
      repairAndMaintenance: '',
      mgmtOfEGR: '',
      insurance: '',
      taxes: '',

    },
    pro_forma_yr1: { // fixed
      baseRent: '',
      recoveryIncome: '',
      otherIncome: '',
      rentAbatement: '',
      vacancyAmount: '',
      marketing: '',
      administrative: '',
      utilities: '',
      payroll: '',
      repairAndMaintenance: '',
      mgmtOfEGR: '',
      insurance: '',
      taxes: '',
    },
  },

  tenantInfo: { // --> capex_projections FIX STRUCTURE
    year_1: {
      rentAbatement: '', // missing
      otherAdjustments: '', // missing
      tenant_improvements: '', // fixed
      leasing_commissions: '', // fixed
      capital_reserves: '', // fixed
      misc_capex: '', // fixed
    },
    year_2: {
      rentAbatement: '', // missing
      otherAdjustments: '', // missing
      tenant_improvements: '', // fixed
      leasing_commissions: '', // fixed
      capital_reserves: '', // fixed
      misc_capex: '', // fixed
    },
    year_3: {
      rentAbatement: '', // missing
      otherAdjustments: '', // missing
      tenant_improvements: '', // fixed
      leasing_commissions: '', // fixed
      capital_reserves: '', // fixed
      misc_capex: '', // fixed
    },
    year_4: {
      rentAbatement: '', // missing
      otherAdjustments: '', // missing
      tenant_improvements: '', // fixed
      leasing_commissions: '', // fixed
      capital_reserves: '', // fixed
      misc_capex: '', // fixed
    },
    year_5: {
      rentAbatement: '', // missing
      otherAdjustments: '', // missing
      tenant_improvements: '', // fixed
      leasing_commissions: '', // fixed
      capital_reserves: '', // fixed
      misc_capex: '', // fixed
    },
    year_6: {
      rentAbatement: '', // missing
      otherAdjustments: '', // missing
      tenant_improvements: '', // fixed
      leasing_commissions: '', // fixed
      capital_reserves: '', // fixed
      misc_capex: '', // fixed
    },
    year_7: {
      rentAbatement: '', // missing
      otherAdjustments: '', // missing
      tenant_improvements: '', // fixed
      leasing_commissions: '', // fixed
      capital_reserves: '', // fixed
      misc_capex: '', // fixed
    },
    year_8: {
      rentAbatement: '', // missing
      otherAdjustments: '', // missing
      tenant_improvements: '', // fixed
      leasing_commissions: '', // fixed
      capital_reserves: '', // fixed
      misc_capex: '', // fixed
    },
    year_9: {
      rentAbatement: '', // missing
      otherAdjustments: '', // missing
      tenant_improvements: '', // fixed
      leasing_commissions: '', // fixed
      capital_reserves: '', // fixed
      misc_capex: '', // fixed
    },
    year_10: {
      rentAbatement: '', // missing
      otherAdjustments: '', // missing
      tenant_improvements: '', // fixed
      leasing_commissions: '', // fixed
      capital_reserves: '', // fixed
      misc_capex: '', // fixed
    },
    year_11: {
      rentAbatement: '', // missing
      otherAdjustments: '', // missing
      tenant_improvements: '', // fixed
      leasing_commissions: '', // fixed
      capital_reserves: '', // fixed
      misc_capex: '', // fixed
    },
    year_12: {
      rentAbatement: '', // missing
      otherAdjustments: '', // missing
      tenant_improvements: '', // fixed
      leasing_commissions: '', // fixed
      capital_reserves: '', // fixed
      misc_capex: '', // fixed
    },
    year_13: {
      rentAbatement: '', // missing
      otherAdjustments: '', // missing
      tenant_improvements: '', // fixed
      leasing_commissions: '', // fixed
      capital_reserves: '', // fixed
      misc_capex: '', // fixed
    },
    year_14: {
      rentAbatement: '', // missing
      otherAdjustments: '', // missing
      tenant_improvements: '', // fixed
      leasing_commissions: '', // fixed
      capital_reserves: '', // fixed
      misc_capex: '', // fixed
    },
    year_15: {
      rentAbatement: '', // missing
      otherAdjustments: '', // missing
      tenant_improvements: '', // fixed
      leasing_commissions: '', // fixed
      capital_reserves: '', // fixed
      misc_capex: '', // fixed
    }

  },
  growthRates: { // --> REFACTOR to match cash_flow_projections_yearly
    year_1: {
      vacancyGrowthRate: '',
      incomeGrowthRate: '',
      opexGrowthExcludingTaxesRate: '',
      propertyTaxGrowthRate: '',
      capExGrowthRate: '',
      propertyManagementFeeRate: '',
    },
    year_2: {
      vacancyGrowthRate: '',
      incomeGrowthRate: '',
      opexGrowthExcludingTaxesRate: '',
      propertyTaxGrowthRate: '',
      capExGrowthRate: '',
      propertyManagementFeeRate: '',
    },
    year_3: {
      vacancyGrowthRate: '',
      incomeGrowthRate: '',
      opexGrowthExcludingTaxesRate: '',
      propertyTaxGrowthRate: '',
      capExGrowthRate: '',
      propertyManagementFeeRate: '',
    },
    year_4: {
      vacancyGrowthRate: '',
      incomeGrowthRate: '',
      opexGrowthExcludingTaxesRate: '',
      propertyTaxGrowthRate: '',
      capExGrowthRate: '',
      propertyManagementFeeRate: '',
    },
    year_5: {
      vacancyGrowthRate: '',
      incomeGrowthRate: '',
      opexGrowthExcludingTaxesRate: '',
      propertyTaxGrowthRate: '',
      capExGrowthRate: '',
      propertyManagementFeeRate: '',
    },
    year_6: {
      vacancyGrowthRate: '',
      incomeGrowthRate: '',
      opexGrowthExcludingTaxesRate: '',
      propertyTaxGrowthRate: '',
      capExGrowthRate: '',
      propertyManagementFeeRate: '',
    },
    year_7: {
      vacancyGrowthRate: '',
      incomeGrowthRate: '',
      opexGrowthExcludingTaxesRate: '',
      propertyTaxGrowthRate: '',
      capExGrowthRate: '',
      propertyManagementFeeRate: '',
    },
    year_8: {
      vacancyGrowthRate: '',
      incomeGrowthRate: '',
      opexGrowthExcludingTaxesRate: '',
      propertyTaxGrowthRate: '',
      capExGrowthRate: '',
      propertyManagementFeeRate: '',
    },
    year_9: {
      vacancyGrowthRate: '',
      incomeGrowthRate: '',
      opexGrowthExcludingTaxesRate: '',
      propertyTaxGrowthRate: '',
      capExGrowthRate: '',
      propertyManagementFeeRate: '',
    },
    year_10: {
      vacancyGrowthRate: '',
      incomeGrowthRate: '',
      opexGrowthExcludingTaxesRate: '',
      propertyTaxGrowthRate: '',
      capExGrowthRate: '',
      propertyManagementFeeRate: '',
    },
    year_11: {
      vacancyGrowthRate: '',
      incomeGrowthRate: '',
      opexGrowthExcludingTaxesRate: '',
      propertyTaxGrowthRate: '',
      capExGrowthRate: '',
      propertyManagementFeeRate: '',
    },
    year_12: {
      vacancyGrowthRate: '',
      incomeGrowthRate: '',
      opexGrowthExcludingTaxesRate: '',
      propertyTaxGrowthRate: '',
      capExGrowthRate: '',
      propertyManagementFeeRate: '',
    },
    year_13: {
      vacancyGrowthRate: '',
      incomeGrowthRate: '',
      opexGrowthExcludingTaxesRate: '',
      propertyTaxGrowthRate: '',
      capExGrowthRate: '',
      propertyManagementFeeRate: '',
    },
    year_14: {
      vacancyGrowthRate: '',
      incomeGrowthRate: '',
      opexGrowthExcludingTaxesRate: '',
      propertyTaxGrowthRate: '',
      capExGrowthRate: '',
      propertyManagementFeeRate: '',
    },
    year_15: {
      vacancyGrowthRate: '',
      incomeGrowthRate: '',
      opexGrowthExcludingTaxesRate: '',
      propertyTaxGrowthRate: '',
      capExGrowthRate: '',
      propertyManagementFeeRate: '',
    }

  },

  // Initial state for unitInformation should always have at least one unit
  unitInformation: [
    {
      // Section 1
      unitNumber: '',
      status: '',
      tenantName: '',
      leaseType: '',
      y0MonthlyRent: '',
      y0ProFormaAnnualizedGross: '',
      t12MonthlyRent: '',
      t12ProFormaAnnualizedGross: '',
      proFormaMonthlyRent: '',
      proFormaAnnualizedGross: '',
      leaseFrom: '',
      leaseTo: '',
      monthsRemaining: '',
      amendmentType: '',

      rentableAreaSF: '',
      // section T-1: Core Leasing Information
      parentProperty: '',
      leaseStatus: '',
      tenantAddress: '',
      leaseDocumentUpload: [],
      ridersAddendumsExhibits: [],
      leaseExecutionDate: '',
      leaseCommencementDate: '',
      leaseExpirationDate: '',
      // Section T-2: Premises, Use & Parking
      premisesDescription: '',
      tenantProRataShare: '',
      permittedUse: '',
      prohibitedUses: '',
      tenantExclusiveUse: '',
      parkingAgreement: '',
      numberOfSpaces: '',
      // Section T-3: Financial Obligations
      baseRentSchedule: [],
      rentFreePeriod: '',
      additionalRentTaxes: '',
      additionalRentInsurance: '',
      additionalRentCAM: '',
      expenseCapsSteps: '',
      canTenantContestTaxes: '',
      timePeriod: '',
      securityDeposit: '',
      securityDepositCurrency: '',
      liquidatedDamagesClause: '',
      liquidatedDamagesCurrency: '',
      letterOfCredit: '',
      letterOfCreditCurrency: '',
      liabilityCap: '',
      // Section T-4: Tenant Operations, Maintenance & Signage
      tenantRepairDuty: '',
      hvacRepairReplacement: '',
      tenantInsuranceRequirements: [],
      signageClause: '',
      interferenceWithSignage: '',
      pylonMonumentSignage: '',
      prohibitedUseT4: '',
      // Section T-5: Options and Rights
      tenantPurchaseOption: '',
      tenantPurchaseExerciseNotice: '',
      additionalOptionSpaces: '',
      additionalOptionExerciseNotice: '',
      additionalOptionDefaultAffectsOption: '',
      additionalOptionLeaseAmendmentRequired: '',
      additionalOptionNewProportionateShare: '',
      additionalOptionNewProportionateSharePercentage: '',

      renewalExtensionOptions: [],
      renewalExtensionOptionTerm: '',
      renewalExtensionNoticePeriod: '',
      renewalExtensionRentForOptionTerm: '',

      earlyTerminationRights: '',
      // Section T-6: Legal, Consents, and Default
      consentForAssignment: '',
      standardForConsentAssignment: '',
      timePeriodForApprovalAssignment: '',

      consentForSublease: '',
      standardForConsentSublease: '',
      timePeriodForApprovalSublease: '',

      consentForAlterations: '',
      consentForMajorAlterations: '',
      majorDefinition: '',
      consentForNonMajorAlterations: '',
      nonMajorDefinition: '',


      tenantDefaultConditions: [],
      defaultCurePeriodRent: '',
      defaultCurePeriodOther: '',
      holdoverRent: '',

      landlordDefaultClause: '',
      remediesWaiver: '',

      landlordsDutyToMitigate: '',
      choiceOfLaw: '',
      guarantorEndorser: '',
      guarantorRights: '',

      sndaAttachedToLease: '',


      leaseSubordinationType: '',

      forceMajeureTerms: [],
      eminentDomainClause: '',
      compensationRights: [], // Changed to array for consistency with other checkboxes
      rightToEnterRightOfInspection: '',
      estoppelCertificateRequirements: '',
    },
  ],
  additionalNotes: [],
};

// helper functions
const formatCurrency = (value: any) => { // Added any type for value
  if (typeof value !== 'number' || isNaN(value)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value: any) => { // Added any type for value
  if (typeof value !== 'number' || isNaN(value)) return '0';
  return new Intl.NumberFormat('en-US').format(value);
};

const formatPercent = (value: any) => { // Added any type for value
  if (typeof value !== 'number' || isNaN(value)) return '0.0%';
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value);
};




interface UploadableDocument extends Document {
  uploadStatus?: 'pending' | 'uploading' | 'success' | 'error';
  uploadError?: string | null;
}

// Custom hook for document management
const useDocumentManagement = (propertyId: string | null) => {
  const [localDocuments, setLocalDocuments] = useState<UploadableDocument[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  const uploadDocument = useDocumentUpload();
  const deleteDocument = useDocumentDeletion();
  
  const addDocuments = useCallback((files: File[], category?: string) => {
    if (!propertyId) return [];
    
    const newUploadables: UploadableDocument[] = files.map(file => ({
      id: propertyId,
      name: file.name,
      type: file.type,
      category: category,
      size: file.size,
      uploadDate: new Date(),
      file: file,
      uploadStatus: 'pending'
    }));
    
    setLocalDocuments(prev => [...prev, ...newUploadables]);
    return newUploadables;
  }, [propertyId]);
  
  const uploadDocuments = useCallback(async (documents: UploadableDocument[]) => {
    for (const doc of documents) {
      try {
        setLocalDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, uploadStatus: 'uploading' } : d));
        
        await uploadDocument({
          propertyId: propertyId!,
          file: doc.file,
          documentType: "unit",
          documentLevel: "unit",
          documentCategory: doc.category || "lease"
        });
        
        setLocalDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, uploadStatus: 'success', uploadError: null } : d));
      } catch (error) {
        console.error(`Failed to upload ${doc.name}:`, error);
        const errorMsg = error instanceof Error ? error.message : 'Unknown upload error';
        setLocalDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, uploadStatus: 'error', uploadError: errorMsg } : d));
      }
    }
  }, [propertyId, uploadDocument]);
  
  const removeDocument = useCallback(async (id: string) => {
    try {
      if (propertyId) {
        await deleteDocument(id, propertyId);
      }
      setLocalDocuments(prev => prev.filter(doc => doc.id !== id));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  }, [propertyId, deleteDocument]);
  
  return {
    localDocuments,
    isDragging,
    setIsDragging,
    addDocuments,
    uploadDocuments,
    removeDocument
  };
};

export default function AddUnitDataPage() {
  const router = useRouter();
  const { state: contextState, dispatch } = usePropertyForm(); // Use context
  const { propertyData, propertyId } = contextState
  
  // Use custom document management hook
  const {
    localDocuments,
    isDragging,
    setIsDragging,
    addDocuments,
    uploadDocuments,
    removeDocument
  } = useDocumentManagement(propertyId);
  
  // React Query hook for creating unit details
  const createUnitDetailsMutation = useCreateUnitDetails();


  // Re-introduce local state for form-specific errors
  const [errors, setErrors] = useState<Partial<PropertyData>>({});
  const [formData, setFormData] = useState<Partial<PropertyData>>(contextState.propertyData || initialFormData);
  // Track expanded/collapsed state for each unit (optional, can be removed if not needed)
  const [expandedUnits, setExpandedUnits] = useState<number[]>([0]); // Start with the first unit expanded

  const [apiError, setApiError] = useState<string | null>(null); // Add API error state

  console.log("inside documents/page.tsx!")

  // Update local state if context changes (e.g., navigating back)
  useEffect(() => {
    // If propertyData or propertyId are missing from context, redirect to the add property page
    if (!propertyData || !propertyId) {
      console.warn('Property data or ID missing in context, redirecting.')
      router.push('/operations-dashboard/properties/add/processing');

    }
    // Initialize formData from contextState.propertyData, ensuring unitInformation is an array
    setFormData(prev => ({
      ...contextState.propertyData,
      unitInformation: Array.isArray(contextState.propertyData?.unitInformation)
        ? contextState.propertyData.unitInformation
        : [initialFormData.unitInformation![0]] // Ensure at least one unit is present
    }));

    // Document management is now handled by the custom hook
    

  }, [propertyData, propertyId, contextState.documents, router]);

  

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      await handleFiles(files)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFiles(Array.from(e.target.files))
      e.target.value = ''
    }
  }

  // Removed unused generateLocalId function

  const handleFiles = async (files: File[], category?: string) => {
    if (!propertyId) {
      alert('Cannot upload documents: Property ID is missing.');
      return;
    }

    const newUploadables = addDocuments(files, category);
    await uploadDocuments(newUploadables);
  };

  // Document handling is now managed by the custom hook

  // Using formatFileSize from document.ts hook

  // Helper function to get nested values (iterative)
  const getNestedValue = (obj: any, path: string[]): any => {
    let current = obj;
    for (let i = 0; i < path.length; i++) {
      if (current === undefined || current === null) {
        return undefined;
      }
      current = current[path[i]];
    }
    return current;
  };

  // A more robust deepClone for React state
  // Using structuredClone for better performance
  const deepClone = (obj: any): any => {
    try {
      return structuredClone(obj);
    } catch (error) {
      // Fallback for non-serializable objects
      if (obj === null || typeof obj !== 'object') return obj;
      if (Array.isArray(obj)) return obj.map(item => deepClone(item));

    const clonedObj: { [key: string]: any } = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
    }
  };

  // Modified setNestedValue using the new deepClone
  const setNestedValue = (obj: any, path: string[], val: any): any => {
    // Start with a deep clone of the object
    const newObj = deepClone(obj);

    let current = newObj;
    for (let i = 0; i < path.length; i++) {
      const key = path[i];
      const isLastKey = (i === path.length - 1);
      const isArrayIndex = !isNaN(Number(key)) && String(Number(key)) === key;

      if (isLastKey) {
        if (isArrayIndex && Array.isArray(current)) {
          if (Number(key) >= current.length) {
            for (let j = current.length; j <= Number(key); j++) {
              current.push(undefined);
            }
          }
          current[Number(key)] = val;
        } else if (!isArrayIndex && typeof current === 'object' && current !== null) {
          current[key] = val;
        } else {
          console.error(`Attempted to set value at unexpected path/type (last key): ${path.join('.')}. Current type: ${typeof current}, expected array/object. Key: ${key}, value: ${val}`);
        }
      } else {
        const nextKey = path[i + 1];
        const isNextKeyArrayIndex = !isNaN(Number(nextKey)) && String(Number(nextKey)) === nextKey;

        if (current[key] === undefined || current[key] === null) {
          current[key] = isNextKeyArrayIndex ? [] : {};
        } else if (isNextKeyArrayIndex && !Array.isArray(current[key])) {
          console.warn(`Path segment "${key}" expected to be an array, but found object. Converting.`);
          current[key] = [];
        } else if (!isNextKeyArrayIndex && Array.isArray(current[key])) {
          console.warn(`Path segment "${key}" expected to be an object, but found array. Converting.`);
          current[key] = {};
        }
        current = current[key];
      }
    }
    return newObj;
  };

  // Simplified error clearing
  const clearNestedError = (obj: any, path: string[]): any => {
    if (!obj) return obj;

    try {
      const newErrors = structuredClone(obj);
    let current = newErrors;
      
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (current[key] === undefined || current[key] === null) {
          return obj;
        }
        current = current[key];
      }
      
      const lastKey = path[path.length - 1];
      if (Array.isArray(current)) {
        current.splice(Number(lastKey), 1);
      } else {
        delete current[lastKey];
      }
      
    return newErrors;
    } catch (error) {
      console.error('Error clearing nested error:', error);
      return obj;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', '.'];
    const isNumeric = /[0-9]/.test(e.key);

    if (!isNumeric && !allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
    }
  };

  // Updated handleChange to support indexed unit fields and complex types
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const path = name.split('.'); // e.g., ['unitInformation', '0', 'tenantName']

    setFormData(prevFormData => {
      let valToSet: any = value;

      // Special handling for checkboxes (for multiple selections in an array)
      if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
        // Get the current array value using the full path
        const currentArray = getNestedValue(prevFormData, path) || [];
        if (e.target.checked) {
          valToSet = Array.isArray(currentArray) ? [...currentArray, value] : [value];
        } else {
          valToSet = Array.isArray(currentArray) ? currentArray.filter((item: string) => item !== value) : [];
        }
      }

      const updatedData = setNestedValue(prevFormData, path, valToSet);
      dispatch({ type: 'SET_PROPERTY_DATA', payload: updatedData });
      return updatedData;
    });

    // Clear error for this field when user types
    setErrors(prevErrors => clearNestedError(prevErrors, path));
  };


  // Refactored handleSubmit to use React Query hook
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null); // Clear previous API errors

    try {
      // Prepare data for backend (ensure types match backend expectations)
      // Use data directly from contextState as it's kept up-to-date
      const propertyDataToSend = contextState.propertyData || initialFormData;
      // REMOVE BEFORE PRODUCTION
      console.log("property data to send: ", propertyDataToSend)

      // Ensure unitInformation is an array, even if empty
      const payload = {
        // Basic Information
        basicInformation: propertyData.basicInformation,
        // Property Details
        propertyDetails: propertyData.propertyDetails,
        // Zoning and Easements
        zoningAndEasements: propertyData.zoningAndEasements,
        // Superior Interest Holders
        superiorInterestHolders: propertyData.superiorInterestHolders,
        // Property Financials and Characteristics
        propertyFinancialsAndCharacteristics: propertyData.propertyFinancialsAndCharacteristics,
        // Parking Wide Facilities Insurance Maintenance
        propertyWideFacilitiesInsuranceMaintenance: propertyData.propertyWideFacilitiesInsuranceMaintenance,
        // Acquisition Information
        acquisitionInformation: propertyData.acquisitionInformation,
        // Assumptions
        assumptions: propertyData.assumptions,
        // Cash Flows
        cashFlows: propertyData.cashFlows,
        // Tenant Info
        tenantInfo: propertyData.tenantInfo,
        // Growth Rates
        growthRates: propertyData.growthRates,
        // Unit Information
        unitInformation: propertyData.unitInformation,
        // Additional Notes
        additionalNotes: propertyData.additionalNotes,
      };
      // REMOVE BEFORE PRODUCTION
      console.log("Payload: ", JSON.stringify(payload, null, 2))

      const result = await createUnitDetailsMutation.mutateAsync(payload);
      
      if (result.success) {
        // Unit details were saved successfully
        console.log('Unit details saved successfully. Moving to processing step.');
        router.push('/operations-dashboard/properties/add/processing');
      } else {
        throw new Error(result.error || result.message || 'Failed to save unit details. Invalid response from server.');
      }

    } catch (err) {
      console.error('Failed to save unit details:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setApiError(errorMessage);
    }

    // Handle document uploads
    const uploadsInProgress = localDocuments.some(d => d.uploadStatus === 'uploading');
    if (uploadsInProgress) {
      alert("Please wait for all uploads to complete.");
      return;
    }

    const successfullyUploadedDocs = localDocuments
      .filter(doc => doc.uploadStatus === 'success')
      .map(doc => {
        const { uploadStatus, uploadError, ...restOfDoc } = doc;
        return {
          id: restOfDoc.id,
          name: restOfDoc.name,
          type: restOfDoc.type,
          category: restOfDoc.category,
          size: restOfDoc.size,
          uploadDate: restOfDoc.uploadDate,
          file: restOfDoc.file
        } as Document;
      });

    dispatch({ type: 'SET_DOCUMENTS', payload: successfullyUploadedDocs });
  };

  // Add Unit: append a new unit to the unitInformation array
  const addUnit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData(prev => {
      const newUnit = {
        unitNumber: '',
        status: '',
        tenantName: '',
        leaseType: '',
        y0MonthlyRent: '',
        y0ProFormaAnnualizedGross: '',
        t12MonthlyRent: '',
        t12ProFormaAnnualizedGross: '',
        proFormaMonthlyRent: '',
        proFormaAnnualizedGross: '',
        leaseFrom: '',
        leaseTo: '',
        monthsRemaining: '',
        amendmentType: '',
        rentableAreaSF: '',
        parentProperty: '',
        leaseStatus: '',
        tenantAddress: '',
        leaseDocumentUpload: [],
        ridersAddendumsExhibits: [],
        leaseExecutionDate: '',
        leaseCommencementDate: '',
        leaseExpirationDate: '',
        premisesDescription: '',
        tenantProRataShare: '',
        permittedUse: '',
        prohibitedUses: '',
        tenantExclusiveUse: '',
        parkingAgreement: '',
        numberOfSpaces: '',
        baseRentSchedule: [],
        rentFreePeriod: '',
        additionalRentTaxes: '',
        additionalRentInsurance: '',
        additionalRentCAM: '',
        expenseCapsSteps: '',
        canTenantContestTaxes: '',
        timePeriod: '',
        securityDeposit: '',
        securityDepositCurrency: '',
        liquidatedDamagesClause: '',
        liquidatedDamagesCurrency: '',
        letterOfCredit: '',
        letterOfCreditCurrency: '',
        liabilityCap: '',
        tenantRepairDuty: '',
        hvacRepairReplacement: '',
        tenantInsuranceRequirements: [],
        signageClause: '',
        interferenceWithSignage: '',
        pylonMonumentSignage: '',
        prohibitedUseT4: '',
        tenantPurchaseOption: '',
        tenantPurchaseExerciseNotice: '',
        additionalOptionSpaces: '',
        additionalOptionExerciseNotice: '',
        additionalOptionDefaultAffectsOption: '',
        additionalOptionLeaseAmendmentRequired: '',
        additionalOptionNewProportionateShare: '',
        additionalOptionNewProportionateSharePercentage: '',
        renewalExtensionOptions: [],
        renewalExtensionOptionTerm: '',
        renewalExtensionNoticePeriod: '',
        renewalExtensionRentForOptionTerm: '',
        earlyTerminationRights: '',
        consentForAssignment: '',
        standardForConsentAssignment: '',
        timePeriodForApprovalAssignment: '',
        consentForSublease: '',
        standardForConsentSublease: '',
        timePeriodForApprovalSublease: '',
        consentForAlterations: '',
        consentForMajorAlterations: '',
        majorDefinition: '',
        consentForNonMajorAlterations: '',
        nonMajorDefinition: '',
        tenantDefaultConditions: [],
        defaultCurePeriodRent: '',
        defaultCurePeriodOther: '',
        holdoverRent: '',
        landlordDefaultClause: '',
        remediesWaiver: '',
        landlordsDutyToMitigate: '',
        choiceOfLaw: '',
        guarantorEndorser: '',
        guarantorRights: '',
        sndaAttachedToLease: '',
        leaseSubordinationType: '',
        forceMajeureTerms: [],
        eminentDomainClause: '',
        compensationRights: [], // Ensure this is an array for new units
        rightToEnterRightOfInspection: '',
        estoppelCertificateRequirements: '',
      };
      const updatedUnits = Array.isArray(prev.unitInformation)
        ? [...prev.unitInformation, newUnit]
        : [newUnit];
      const updated = { ...prev, unitInformation: updatedUnits };
      dispatch({ type: 'SET_PROPERTY_DATA', payload: updated });
      // Expand the newly added unit
      setExpandedUnits(prevExpanded => [...prevExpanded, updatedUnits.length - 1]);
      return updated;
    });
  };

  // --- Helper to convert column number to Excel letter (e.g., 0 -> A, 25 -> Z, 26 -> AA) ---
  const colNumToExcelLetter = (colNum) => {
    let letter = '';
    let temp = colNum;
    while (temp >= 0) {
      letter = String.fromCharCode(65 + (temp % 26)) + letter;
      temp = Math.floor(temp / 26) - 1;
    }
    return letter;
  };

  // --- Helper function to flatten data for a single unit (for 'Unit Information' sheet) ---
  const flattenUnitData = (unit) => {
    const flattenedUnit = {};

    const recursiveFlatten = (obj, prefix = '') => {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          const newKey = key; // Keep headers simple as per previous request

          if (typeof value === 'object' && value !== null) {
            if (Array.isArray(value)) {
              // Special handling for arrays of objects (like tenantInsuranceRequirements, baseRentSchedule, renewalExtensionOptions)
              if (key === 'tenantInsuranceRequirements' || key === 'baseRentSchedule' || key === 'renewalExtensionOptions') {
                // Map each object in the array to a JSON string, then stringify the whole array of strings
                // This ensures the entire array structure is preserved and readable
                flattenedUnit[newKey] = JSON.stringify(value.map(item =>
                  (typeof item === 'object' && item !== null) ? JSON.stringify(item) : item
                ));
              } else {
                // For other arrays (e.g., arrays of strings/numbers), join them directly
                flattenedUnit[newKey] = value.map(item =>
                  (typeof item === 'object' && item !== null) ? JSON.stringify(item) : item
                ).join('; ');
              }
            } else {
              // It's a non-array object.
              // Special handling for specific objects (which are not arrays)

              if (key === 'someOtherSingleObjectField') { // Example: if you had 'propertyAddressDetails: {street: '...', city: '...'}'
                flattenedUnit[newKey] = JSON.stringify(value);
              } else {
                // For other nested objects, continue recursive flattening
                recursiveFlatten(value, newKey);
              }
            }
          } else {
            // Scalar value (string, number, boolean, null)
            const lowerNewKey = newKey.toLowerCase();
            const potentialNum = Number(value);

            if (!isNaN(potentialNum) && value !== "") {
              flattenedUnit[newKey] = potentialNum;
            } else if (typeof value === 'string' && (lowerNewKey.includes('date') || lowerNewKey.includes('year'))) {
              try {
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                  flattenedUnit[newKey] = date;
                } else {
                  flattenedUnit[newKey] = value;
                }
              } catch (e) {
                flattenedUnit[newKey] = value;
              }
            } else {
              flattenedUnit[newKey] = (typeof value === 'string' && value.trim() === '') ? '' : value;
            }
          }
        }
      }
    };

    recursiveFlatten(unit, 'Unit');

    return flattenedUnit;
  };

  // --- NEW HELPER: Generates the structured data for the 'Property Summary' sheet ---
  const generatePropertySummarySheetData = (propertyData) => {
    const allRows = [];
    let currentMaxColForSheet = 0; // Track max columns for overall sheet width

    // Helper to format values for Excel. Convert empty strings to null for potential numbers, handle dates.
    const formatValueForExcel = (val, headerName) => {
      if (typeof val === 'string' && val.trim() === '') {
        return null; // Explicitly return null for empty strings, aoa_to_sheet treats it as truly empty
      }

      // Try to convert to number if header suggests it
      const numericKeywords = [
        'price', 'cost', 'investment', 'rent', 'income', 'amount', 'tax', 'gross', 'fees',
        'rate', 'percent', 'sf', 'share', 'num', 'period', 'term', 'discount', 'cap',
        'administrative', 'baseRent', 'insurance', 'marketing', 'mgmtOfEGR', 'otherIncome',
        'payroll', 'recoveryIncome', 'rentAbatement', 'repairAndMaintenance', 'utilities',
        'capitalReserves', 'leasingCommissions', 'miscCapEx', 'otherAdjustments', 'tenantImprovements'
      ];
      if (numericKeywords.some(keyword => headerName.toLowerCase().includes(keyword.toLowerCase()))) {
        const numVal = Number(val);
        return isNaN(numVal) ? null : numVal; // Return null if not a valid number
      }

      // Try to convert to Date object if header suggests it
      const dateKeywords = ['date', 'year built', 'commencement', 'expiration', 'execution'];
      if (dateKeywords.some(keyword => headerName.toLowerCase().includes(keyword.toLowerCase()))) {
        try {
          const date = new Date(String(val)); // Ensure value is a string for Date constructor
          if (!isNaN(date.getTime())) {
            return date; // Return Date object. aoa_to_sheet will handle conversion to Excel serial number.
          }
        } catch (e) {
          // Parsing failed, fall through
        }
      }

      // For arrays, join them as strings
      if (Array.isArray(val)) {
        return val.join('; ');
      }

      return val; // Return original value for everything else
    };

    // Helper to add a section: title, headers, values
    const addSection = (sectionTitle, dataObject, prefix = '', expandArraysAsYears = false) => {
      const headers = [];
      const values = [];
      let sectionCurrentCol = 0; // Track columns within this section

      // Handle 15-year arrays specially
      if (expandArraysAsYears) {
        const yearsData = {};
        const otherFields = {};

        for (const key in dataObject) {
          if (Object.prototype.hasOwnProperty.call(dataObject, key)) {
            if (Array.isArray(dataObject[key])) {
              yearsData[key] = dataObject[key];
            } else {
              otherFields[`${prefix} - ${key}`] = dataObject[key];
            }
          }
        }

        // First add non-array fields
        for (const key in otherFields) {
          headers.push(key);
          values.push(formatValueForExcel(otherFields[key], key));
          sectionCurrentCol++;
        }

        // Then add 15-year array headers and values
        for (let i = 0; i < 15; i++) {
          for (const key in yearsData) {
            if (Object.prototype.hasOwnProperty.call(yearsData, key)) {
              const headerName = `${key} - Year ${i + 1}`;
              headers.push(headerName);
              // Ensure 15-year arrays have 15 elements, fill with null if shorter
              values.push(formatValueForExcel(yearsData[key][i] !== undefined ? yearsData[key][i] : null, headerName));
              sectionCurrentCol++;
            }
          }
        }

      } else { // Standard object flattening
        for (const key in dataObject) {
          if (Object.prototype.hasOwnProperty.call(dataObject, key)) {
            const val = dataObject[key];
            // --- MODIFIED LINE for other sections (including Cash Flow) ---
            // Determine if the prefix should be included for this specific header.
            // For Cash Flow, we'll keep the year prefix but remove the 'Cash Flow - ' section prefix.
            let headerName;
            if (sectionTitle === "Cash Flows") {
              headerName = key; // key already contains "YEAR0 - item", "T12 - item", etc.
            } else {
              headerName = `${prefix} - ${key}`; // Keep prefix for other standard sections like Basic Info
            }

            headers.push(headerName);
            values.push(formatValueForExcel(val, headerName));
            sectionCurrentCol++;
          }
        }
      }

      if (headers.length === 0) return; // Skip if no data for section

      // Update max columns for the overall sheet
      currentMaxColForSheet = Math.max(currentMaxColForSheet, sectionCurrentCol);

      allRows.push([sectionTitle]); // Section title
      allRows.push(headers); // Headers
      allRows.push(values); // Values
      allRows.push([]); // Blank row
    };

    // Main Report Title (Row 0)
    allRows.push(["PROPERTY SUMMARY REPORT"]);
    allRows.push([]); // Blank row after title

    // --- Process each section using the helper ---
    addSection("Basic Property Information", propertyData.basicInformation, "Basic Information");
    addSection("Property Details", propertyData.propertyDetails, "Property Details");
    addSection("Zoning & Easements", propertyData.zoningAndEasements, "Zoning And Easements");
    addSection("Superior Interest Holders", propertyData.superiorInterestHolders, "Superior Interest Holders");
    addSection("Property Financials & Characteristics", propertyData.propertyFinancialsAndCharacteristics, "Property Financials And Characteristics");
    addSection("Acquisition Information", propertyData.acquisitionInformation, "Acquisition Information");
    addSection("Property Wide Facilities, Insurance & Maintenance", propertyData.propertyWideFacilitiesInsuranceMaintenance, "Property Wide Facilities Insurance Maintenance");

    // Assumptions (nested objects)
    const assumptionsCombined = {
      ...(propertyData.assumptions?.financing || {}),
      ...(propertyData.assumptions?.operating || {})
    };
    addSection("Assumptions", assumptionsCombined, "Assumptions");

    // Cash Flows (nested by year)
    const cashFlowsCombined = {};
    if (propertyData.cashFlows) {
      ['year0', 't12', 'proFormaYr1'].forEach(yearKey => {
        if (propertyData.cashFlows[yearKey]) {
          for (const itemKey in propertyData.cashFlows[yearKey]) {
            if (Object.prototype.hasOwnProperty.call(propertyData.cashFlows[yearKey], itemKey)) {
              cashFlowsCombined[`${yearKey.toUpperCase()} - ${itemKey}`] = propertyData.cashFlows[yearKey][itemKey];
            }
          }
        }
      });
    }
    addSection("Cash Flows", cashFlowsCombined, "Cash Flow");

    // Tenant Info (15 years)
    addSection("Tenant Information (Yearly)", propertyData.tenantInfo, "Tenant Information", true);

    // Growth Rates (15 years)
    addSection("Growth Rates (Yearly)", propertyData.growthRates, "Growth Rates", true);

    // Additional Notes (array of strings)
    if (Array.isArray(propertyData.additionalNotes) && propertyData.additionalNotes.length > 0) {
      const notesObject = {
        content: propertyData.additionalNotes.join('\n')
      };
      addSection("Additional Notes", notesObject, "Additional Notes");
    }

    return { rows: allRows, maxCols: currentMaxColForSheet }; // Return maxCols for potential future use, though not used for styling here
  };

  // --- Function to apply styling to a worksheet ---
  const applySheetStyling = (ws, sheetName, stylingMetadata) => {
    // Styles
    const headerStyle = {
      font: { bold: true, sz: 11, color: { rgb: "FFFFFF" } }, // White font
      fill: { patternType: "solid", fgColor: { rgb: "4472C4" } }, // Dark blue background
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
      border: {
        top: { style: "thin", color: { rgb: "BFBFBF" } },
        bottom: { style: "thin", color: { rgb: "BFBFBF" } },
        left: { style: "thin", color: { rgb: "BFBFBF" } },
        right: { style: "thin", color: { rgb: "BFBFBF" } },
      },
    };

    const sectionHeaderStyle = {
      font: { bold: true, sz: 12 },
      fill: { patternType: "solid", fgColor: { rgb: "D9E1F2" } }, // Light blue/grey background
      alignment: { horizontal: "left", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "BFBFBF" } },
        bottom: { style: "thin", color: { rgb: "BFBFBF" } },
        left: { style: "thin", color: { rgb: "BFBFBF" } },
        right: { style: "thin", color: { rgb: "BFBFBF" } },
      },
    };

    const titleStyle = {
      font: { bold: true, sz: 16, color: { rgb: "000000" } }, // Black font
      alignment: { horizontal: "center", vertical: "center" },
      fill: { patternType: "solid", fgColor: { rgb: "ADD8E6" } }, // Light blue background for main title
    };

    const defaultCellStyle = {
      font: { sz: 10 },
      alignment: { horizontal: "left", vertical: "top", wrapText: true },
      border: {
        top: { style: "thin", color: { rgb: "BFBFBF" } },
        bottom: { style: "thin", color: { rgb: "BFBFBF" } },
        left: { style: "thin", color: { rgb: "BFBFBF" } },
        right: { style: "thin", color: { rgb: "BFBFBF" } },
      },
    };

    // Determine the actual range of cells in the worksheet
    const range = ws['!ref'] ? XLSX.utils.decode_range(ws['!ref']) : { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } };

    // Apply default cell styles to all cells within the determined range
    // Important: Only apply default styles to cells that don't already have explicit styling from aoa_to_sheet or other passes
    // The aoa_to_sheet with cellStyles: true will create basic cell objects with t and v, and potentially s.
    for (let R = range.s.r; R <= range.e.r; R++) {
      for (let C = range.s.c; C <= range.e.c; C++) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cellAddress]) {
          ws[cellAddress] = { t: 's', v: '' }; // Ensure cell object exists, default to string type
        }
        // Merge default style. Existing 's' properties should take precedence unless explicitly overridden.
        ws[cellAddress].s = { ...defaultCellStyle, ...(ws[cellAddress].s || {}) };
      }
    }


    // Set column widths based on estimated content or a predefined width
    if (sheetName === 'Property Summary') {
      const colWidths = [];
      const maxCols = range.e.c; // Use actual max column from the sheet for width calculation
      for (let c = 0; c <= maxCols; c++) {
        let wch = 18; // Default width
        if (c === 0) wch = 30; // First column often has longer field names
        // Consider increasing width for columns with potentially long array joins or notes
        const cell = ws[XLSX.utils.encode_cell({ r: 2, c: c })]; // Look at a value cell in the second data row
        if (cell && typeof cell.v === 'string' && cell.v.length > 30) {
          wch = Math.max(wch, 40); // Make it wider if contents are long strings
        }
        colWidths.push({ wch: wch });
      }
      ws['!cols'] = colWidths;
    } else if (sheetName === 'Unit Information') {
      const headers = stylingMetadata.headers; // headers are available in stylingMetadata for Unit Information
      const colWidths = [];
      if (headers) { // Ensure headers exist
        headers.forEach(header => {
          let wch = Math.max(header.length + 2, 15); // +2 for padding, min 15
          if (header.includes('Description') || header.includes('Notes') || header.includes('Address') || header.includes('leaseType') || header.includes('Premises') || header.includes('Use')) {
            wch = 35; // Wider for text-heavy columns
          } else if (header.includes('Date')) {
            wch = 15; // Increased for dates
          } else if (header.includes('Unit - ')) {
            wch = 18; // Default for unit properties
          }
          colWidths.push({ wch: wch });
        });
      }
      ws['!cols'] = colWidths;
    }


    // Apply Main Title Styling and Merges
    if (sheetName === 'Property Summary') {
      const titleCellAddress = XLSX.utils.encode_cell({ r: stylingMetadata.mainTitleRowIdx, c: 0 });
      ws[titleCellAddress] = ws[titleCellAddress] || { t: 's', v: '' }; // Ensure cell exists
      ws[titleCellAddress].s = { ...(ws[titleCellAddress].s || {}), ...titleStyle }; // Merge title style
      ws['!merges'] = ws['!merges'] || [];
      ws['!merges'].push({
        s: { r: stylingMetadata.mainTitleRowIdx, c: 0 },
        e: { r: stylingMetadata.mainTitleRowIdx, c: stylingMetadata.mainTitleColSpan }
      });
    } else if (sheetName === 'Unit Information') {
      const titleCellAddress = XLSX.utils.encode_cell({ r: 0, c: 0 });
      ws[titleCellAddress] = ws[titleCellAddress] || { t: 's', v: '' }; // Ensure cell exists
      ws[titleCellAddress].s = { ...(ws[titleCellAddress].s || {}), ...titleStyle }; // Merge title style
      ws['!merges'] = ws['!merges'] || [];
      const headers = stylingMetadata.headers;
      const lastColIdx = headers && headers.length > 0 ? headers.length - 1 : 0;
      ws['!merges'].push({
        s: { r: 0, c: 0 },
        e: { r: 0, c: lastColIdx }
      });
    }


    // Apply Section Header Styling and Merges for Property Summary sheet
    if (sheetName === 'Property Summary') {
      stylingMetadata.sectionHeaders.forEach(section => {
        const sectionTitleCellAddress = XLSX.utils.encode_cell({ r: section.rowIdx, c: section.startColIdx });
        ws[sectionTitleCellAddress] = ws[sectionTitleCellAddress] || { t: 's', v: '' }; // Ensure cell exists
        ws[sectionTitleCellAddress].s = { ...(ws[sectionTitleCellAddress].s || {}), ...sectionHeaderStyle }; // Merge section header style
        ws['!merges'].push({
          s: { r: section.rowIdx, c: section.startColIdx },
          e: { r: section.rowIdx, c: section.endColIdx } // Merge based on metadata
        });

        // Apply header style to the row *after* the section title
        const headersRowIdx = section.rowIdx + 1;

        // Determine the actual span of headers for this section for accurate styling
        let currentHeaderRowLength = 0;
        // Iterate up to the max column in the sheet to find the last header for the given row
        for (let C = 0; C <= range.e.c; C++) {
          const cell = ws[XLSX.utils.encode_cell({ r: headersRowIdx, c: C })];
          if (cell && (cell.v !== undefined && cell.v !== null && cell.v !== '')) {
            currentHeaderRowLength = C; // Update to the last non-empty column in this header row
          }
        }
        // Ensure currentHeaderRowLength is at least 0 if the row is entirely empty
        currentHeaderRowLength = Math.max(0, currentHeaderRowLength);

        for (let C = 0; C <= currentHeaderRowLength; ++C) {
          const headerCellAddress = XLSX.utils.encode_cell({ r: headersRowIdx, c: C });
          if (ws[headerCellAddress]) { // Ensure cell exists before styling
            ws[headerCellAddress].s = { ...(ws[headerCellAddress].s || {}), ...headerStyle }; // Merge header style
          }
        }
      });

      // Apply number and date formatting to all value rows as determined by stylingMetadata
      stylingMetadata.valueRows.forEach(valueRow => {
        const rowToFormat = valueRow.rowIdx;
        const columnsToFormat = valueRow.columns; // These are the original header names (e.g., "Basic Information - name")

        columnsToFormat.forEach((header, colIndex) => {
          const cellAddress = XLSX.utils.encode_cell({ r: rowToFormat, c: colIndex });
          const cell = ws[cellAddress];

          if (cell) { // Ensure cell exists
            cell.s = cell.s || {}; // Ensure style object exists

            // If aoa_to_sheet detected a number (t:'n') or date (t:'d')
            if (cell.t === 'n') {
              if (header.includes('Rate') || header.includes('Percent') || header.includes('Growth Rates')) {
                cell.s.numFmt = '0.00%';
              } else if (header.includes('Price') || header.includes('Cost') || header.includes('Investment') || header.includes('Rent') || header.includes('Income') || header.includes('Amount') || header.includes('Tax') || header.includes('Gross') || header.includes('Fees')) {
                cell.s.numFmt = '$#,##0.00';
              } else if (header.includes('SF')) {
                cell.s.numFmt = '#,##0';
              } else if (header.includes('Year Built')) { // Specific for year built as a number
                cell.s.numFmt = '0'; // No thousands separator for year
              }
            } else if (cell.t === 'd') { // If it's explicitly a date type from aoa_to_sheet
              cell.s.numFmt = 'm/d/yyyy';
            }
          }
        });
      });

    } else if (sheetName === 'Unit Information') {
      // Apply header styles to the row *after* the main title (row 1)
      const headersRowIdx = 1;
      const headers = stylingMetadata.headers; // From stylingMetadata for Unit Information
      if (headers && headers.length > 0) {
        for (let C = 0; C < headers.length; ++C) {
          const headerCellAddress = XLSX.utils.encode_cell({ r: headersRowIdx, c: C });
          if (ws[headerCellAddress]) { // Ensure cell exists
            ws[headerCellAddress].s = { ...(ws[headerCellAddress].s || {}), ...headerStyle }; // Merge header style
          }
        }
      }

      // Apply number and date formatting to data rows in Unit Information sheet
      const dataRange = ws['!ref'] ? XLSX.utils.decode_range(ws['!ref']) : null;

      // Start from row 2 (after title and headers) up to the last data row
      if (dataRange && dataRange.e.r >= 2) { // Ensure there are actual data rows
        for (let R = 2; R <= dataRange.e.r; R++) {
          const currentHeaders = stylingMetadata.headers; // Headers from flattenUnitData
          if (!currentHeaders) continue;

          for (let C = 0; C < currentHeaders.length; C++) {
            const header = currentHeaders[C];
            const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
            const cell = ws[cellAddress];

            if (cell) { // Ensure cell exists
              cell.s = cell.s || {}; // Ensure style object exists

              if (cell.t === 'n') { // If aoa_to_sheet detected a number
                if (header.includes('Rent') || header.includes('Gross') || header.includes('Deposit') || header.includes('Credit') || header.includes('Commission')) {
                  cell.s.numFmt = '$#,##0.00';
                } else if (header.includes('SF')) {
                  cell.s.numFmt = '#,##0';
                } else if (header.includes('Rate') || header.includes('Share')) { // tenant pro rata share
                  cell.s.numFmt = '0.00%';
                }
              } else if (cell.t === 'd') { // If it's explicitly a date type
                cell.s.numFmt = 'm/d/yyyy';
              }
            }
          }
        }
      }
    }

    // Freeze top rows based on sheet type
    if (sheetName === 'Property Summary') {
      ws['!freeze'] = { xSplit: "0", ySplit: "2", topLeftCell: "A3", activePane: "bottomLeft", state: "frozen" }; // Freeze title (row 0) and first blank row (row 1)
    } else if (sheetName === 'Unit Information') {
      ws['!freeze'] = { xSplit: "0", ySplit: "2", topLeftCell: "A3", activePane: "bottomLeft", state: "frozen" }; // Freeze title (row 0) and headers (row 1)
    }
  };


  const exportSpreadsheet = ({ fileName = 'ariesview_property_report' }) => {

    if (!propertyData) {
      alert("No data to export!");
      return;
    }

    const wb = XLSX.utils.book_new(); // Create a new workbook

    // 1. Create the Main Property Data Sheet
    const { rows: mainPropertyRows } = generatePropertySummarySheetData(propertyData);
    const wsMain = XLSX.utils.aoa_to_sheet(mainPropertyRows);
    XLSX.utils.book_append_sheet(wb, wsMain, 'Property Summary');


    // 2. Create the Unit Information Sheet
    if (propertyData.unitInformation && Array.isArray(propertyData.unitInformation) && propertyData.unitInformation.length > 0) {
      const unitSheetData = propertyData.unitInformation.map(unit => flattenUnitData(unit));

      const unitRows = [];
      unitRows.push(["UNIT DETAILS REPORT"]); // Main Title (Row 0)
      const unitHeaders = Object.keys(unitSheetData[0] || {}); // Get headers from the first unit
      unitRows.push(unitHeaders); // Headers row (Row 1)
      // Map unit data values, ensuring empty objects become empty strings to avoid [object Object]
      unitSheetData.forEach(unit => unitRows.push(Object.values(unit).map(val => (typeof val === 'object' && val !== null && !Array.isArray(val)) ? '' : val)));

      const wsUnits = XLSX.utils.aoa_to_sheet(unitRows);
      XLSX.utils.book_append_sheet(wb, wsUnits, 'Unit Information');
    }

    // Generate the Excel file as a buffer
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Create a Blob from the buffer and save the file
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });

    const dynamicFileName = propertyData.basicInformation?.name ?
      `${fileName}_${propertyData.basicInformation.name.replace(/[^a-zA-Z0-9-]/g, '_')}` :
      fileName;

    saveAs(data, `${dynamicFileName}.xlsx`);
  }

  // Toggle unit expansion
  const toggleUnitExpansion = (index: number) => {
    setExpandedUnits(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };


  console.log("propertydata: ", propertyData)
  if (!propertyData || !propertyId) {
    return <div className="min-h-screen bg-gray-50 flex justify-center items-center">Loading or Redirecting...</div>
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-[#0066cc]">Add New Property</h1>
            <Link
              href="/operations-dashboard"
              className="text-gray-500 hover:text-gray-700"
            >
              Back to Dashboard
            </Link>
          </div>

          <div className="mb-8">
            <div className="flex items-center">
              <div className="relative flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="mt-2 text-sm font-medium text-gray-500">Property Overview</div>
              </div>
              <div className="flex-grow h-0.5 bg-green-500 mx-4"></div>
              <div className="relative flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="mt-2 text-sm font-medium text-gray-500">Upload Documents</div>
              </div>
              <div className="flex-grow h-0.5 bg-green-500 mx-4"></div>
              <div className="relative flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="mt-2 text-sm font-medium text-gray-500">Property Details</div>
              </div>
              <div className="flex-grow h-0.5 bg-green-500 mx-4"></div>
              <div className="relative flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#0066cc] text-white flex items-center justify-center font-bold">4</div>
                <div className="mt-2 text-sm font-medium  text-[#0066cc]">Unit Details</div>
              </div>
              <div className="flex-grow h-0.5 bg-gray-200 mx-4"></div>
              <div className="relative flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold">5</div>
                <div className="mt-2 text-sm font-medium text-gray-500">Processing</div>
              </div>
              <div className="flex-grow h-0.5 bg-gray-200 mx-4"></div>
              <div className="relative flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold">6</div>
                <div className="mt-2 text-sm font-medium text-gray-500">Review</div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Loop through unitInformation to render multiple unit forms */}
          {(formData.unitInformation || []).map((unit, idx) => (
            <div key={idx} className="bg-white shadow-md rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Unit {idx + 1}: {unit.tenantName || 'New Unit'}</h2>
                <button
                  type="button"
                  onClick={() => toggleUnitExpansion(idx)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                  aria-expanded={expandedUnits.includes(idx)}
                  aria-controls={`unit-form-${idx}`}
                >
                  {expandedUnits.includes(idx) ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Conditionally render form content based on expansion state */}
              {expandedUnits.includes(idx) && (
                <div id={`unit-form-${idx}`}>
                  {/* Section 1 */}
                  <div className="mb-8 p-4 rounded-lg border border-slate-200 bg-slate-50">
                    <h3 className="text-lg font-semibold  text-slate-800 mb-4 flex items-center gap-2">Tenant Specific Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                      <div className="md:col-span-1">
                        <label htmlFor={`unitInformation.${idx}.unitNumber`} className="block text-sm font-medium text-gray-700 mb-1">
                          Unit Number
                        </label>
                        <input
                          id={`unitInformation.${idx}.unitNumber`}
                          type="text"
                          name={`unitInformation.${idx}.unitNumber`}
                          value={unit.unitNumber ?? ''}
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                          placeholder="e.g. 1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.status`} className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          id={`unitInformation.${idx}.status`}
                          name={`unitInformation.${idx}.status`}
                          value={unit.status ?? ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select status</option>
                          <option value="Occupied">Occupied</option>
                          <option value="Leased">Leased</option>
                          <option value="Vacant">Vacant</option>
                        </select>
                      </div>
                      <div className="md:col-span-1">
                        <label htmlFor={`unitInformation.${idx}.tenantName`} className="block text-sm font-medium text-gray-700 mb-1">
                          Tenant Name
                        </label>
                        <input
                          id={`unitInformation.${idx}.tenantName`}
                          type="text"
                          name={`unitInformation.${idx}.tenantName`}
                          value={unit.tenantName ?? ''}
                          onChange={handleChange}
                          placeholder="e.g. Tenant A"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.leaseType`} className="block text-sm font-medium text-gray-700 mb-1">
                          Lease Type
                        </label>
                        <select
                          id={`unitInformation.${idx}.leaseType`}
                          name={`unitInformation.${idx}.leaseType`}
                          value={unit.leaseType ?? ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Lease Type</option>
                          <option value="Gross Lease">Gross Lease</option>
                          <option value="Modified Gross Lease">Modified Gross Lease</option>
                          <option value="Net Lease">Net Lease (Single Net Lease, Double Net Lease, Triple Net Lease)</option>
                          <option value="Fixed Term Lease">Fixed Term Lease</option>
                          <option value="Month-to-Month Lease">Month-to-Month Lease</option>
                          <option value="Percentage Lease">Percentage Lease</option>
                          <option value="Absolute NNN">Absolute NNN</option>
                          <option value="Full Service Gross Lease">Full Service Gross Lease</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.y0MonthlyRent`} className="block text-sm font-medium text-gray-700 mb-1">
                          Y0 Monthly Rent ($)
                        </label>
                        <input
                          id={`unitInformation.${idx}.y0MonthlyRent`}
                          type="text"
                          name={`unitInformation.${idx}.y0MonthlyRent`}
                          value={unit.y0MonthlyRent ?? ''}
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                          placeholder="e.g. 53766.5"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.y0ProFormaAnnualizedGross`} className="block text-sm font-medium text-gray-700 mb-1">
                          Y0 Pro Forma Annualized Gross ($)
                        </label>
                        <input
                          id={`unitInformation.${idx}.y0ProFormaAnnualizedGross`}
                          type="text"
                          name={`unitInformation.${idx}.y0ProFormaAnnualizedGross`}
                          value={unit.y0ProFormaAnnualizedGross ?? ''}
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                          placeholder="e.g. 645198"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.t12MonthlyRent`} className="block text-sm font-medium text-gray-700 mb-1">
                          T12 Monthly Rent ($)
                        </label>
                        <input
                          id={`unitInformation.${idx}.t12MonthlyRent`}
                          type="text"
                          name={`unitInformation.${idx}.t12MonthlyRent`}
                          value={unit.t12MonthlyRent ?? ''}
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                          placeholder="e.g. 65166.17 "
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.t12ProFormaAnnualizedGross`} className="block text-sm font-medium text-gray-700 mb-1">
                          T12 Pro Forma Annualized Gross ($)
                        </label>
                        <input
                          id={`unitInformation.${idx}.t12ProFormaAnnualizedGross`}
                          type="text"
                          name={`unitInformation.${idx}.t12ProFormaAnnualizedGross`}
                          value={unit.t12ProFormaAnnualizedGross ?? ''}
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                          placeholder="e.g. 782194 "
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.proFormaMonthlyRent`} className="block text-sm font-medium text-gray-700 mb-1">
                          Pro Forma Monthly Rent ($)
                        </label>
                        <input
                          id={`unitInformation.${idx}.proFormaMonthlyRent`}
                          type="text"
                          name={`unitInformation.${idx}.proFormaMonthlyRent`}
                          value={unit.proFormaMonthlyRent ?? ''}
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                          placeholder="e.g. 65166.17"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.proFormaAnnualizedGross`} className="block text-sm font-medium text-gray-700 mb-1">
                          Pro Forma Annualized Gross ($)
                        </label>
                        <input
                          id={`unitInformation.${idx}.proFormaAnnualizedGross`}
                          type="text"
                          name={`unitInformation.${idx}.proFormaAnnualizedGross`}
                          value={unit.proFormaAnnualizedGross ?? ''}
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                          placeholder="e.g. 782194"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.leaseFrom`} className="block text-sm font-medium text-gray-700 mb-1">
                          Lease From
                        </label>
                        <input
                          id={`unitInformation.${idx}.leaseFrom`}
                          type="date"
                          name={`unitInformation.${idx}.leaseFrom`}
                          value={unit.leaseFrom ?? ''}
                          onChange={handleChange}
                          placeholder="e.g. "
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.leaseTo`} className="block text-sm font-medium text-gray-700 mb-1">
                          Lease To
                        </label>
                        <input
                          id={`unitInformation.${idx}.leaseTo`}
                          type="date"
                          name={`unitInformation.${idx}.leaseTo`}
                          value={unit.leaseTo ?? ''}
                          onChange={handleChange}
                          placeholder="e.g. "
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.monthsRemaining`} className="block text-sm font-medium text-gray-700 mb-1">
                          Months Remaining
                        </label>
                        <input
                          id={`unitInformation.${idx}.monthsRemaining`}
                          type="text"
                          name={`unitInformation.${idx}.monthsRemaining`}
                          value={unit.monthsRemaining ?? ''}
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                          placeholder="e.g. 120"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.amendmentType`} className="block text-sm font-medium text-gray-700 mb-1">
                          Amendment Type
                        </label>
                        <input
                          id={`unitInformation.${idx}.amendmentType`}
                          type="text"
                          name={`unitInformation.${idx}.amendmentType`}
                          value={unit.amendmentType ?? ''}
                          onChange={handleChange}
                          placeholder="e.g. None"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Section T-1: Core Lease Information */}
                  <div className="mb-8 p-4 rounded-lg border border-slate-200 bg-slate-50">
                  <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                    Section T-1: Core Lease Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Parent Property */}
                    <div>
                      <label htmlFor={`unitInformation.${idx}.parentProperty`} className="block text-sm font-medium text-gray-700 mb-1">
                        Parent Property (If Applicable)
                      </label>
                      <input
                        id={`unitInformation.${idx}.parentProperty`}
                        type="text"
                        name={`unitInformation.${idx}.parentProperty`}
                        value={unit.parentProperty ?? ''}
                        onChange={handleChange}
                        placeholder="e.g. Property A"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Lease Status */}
                    <div>
                      <label htmlFor={`unitInformation.${idx}.leaseStatus`} className="block text-sm font-medium text-gray-700 mb-1">
                        Lease Status
                      </label>
                      <select
                        id={`unitInformation.${idx}.leaseStatus`}
                        name={`unitInformation.${idx}.leaseStatus`}
                        value={unit.leaseStatus ?? ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Lease Status</option>
                        <option value="Active">Active</option>
                        <option value="Expired">Expired</option>
                        <option value="Terminated">Terminated</option>
                        <option value="Holdover">Holdover</option>
                      </select>
                    </div>

                    {/* Tenant Address - full width */}
                    <div className="md:col-span-2">
                      <label htmlFor={`unitInformation.${idx}.tenantAddress`} className="block text-sm font-medium text-gray-700 mb-1">
                        Tenant Address
                      </label>
                      <input
                        id={`unitInformation.${idx}.tenantAddress`}
                        type="text"
                        name={`unitInformation.${idx}.tenantAddress`}
                        value={unit.tenantAddress ?? ''}
                        onChange={handleChange}
                        placeholder="e.g. 123 Elm Street, Apt 4B, Los Angeles, CA"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Document Category + Upload - full width */}
                    <div className="md:col-span-2">
                    <label htmlFor={`unitInformation.${idx}.documentCategory`} className="block text-sm font-medium text-gray-700 mb-1">
                      Select Document Category
                    </label>
                    <select
                      id={`unitInformation.${idx}.documentCategory`}
                      value={unit.selectedCategory || ''}
                      onChange={e => {
                        const selected = e.target.value;
                        setFormData(prev => {
                          const updatedUnits = [...(prev.unitInformation || [])];
                          updatedUnits[idx] = {
                            ...updatedUnits[idx],
                            selectedCategory: selected,
                          };
                          return { ...prev, unitInformation: updatedUnits };
                        });
                      }}
                      className="mb-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">-- Select a category --</option>
                      <option value="lease">Lease</option>
                      <option value="inspection">Inspection</option>
                      <option value="tenant_communication">Tenant Communication</option>
                    </select>

                    <label htmlFor={`unitInformation.${idx}.categoryDocumentUpload`} className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Documents
                    </label>
                    
                    {/* Disable drag-drop area if no category */}
                    <div
                      onDragOver={e => {
                        if (!unit.selectedCategory) return;
                        handleDragOver(e);
                      }}
                      onDragLeave={handleDragLeave}
                      onDrop={e => {
                        if (!unit.selectedCategory) return;
                        e.preventDefault();
                        setIsDragging(false);
                        const files = Array.from(e.dataTransfer.files);
                        if (files.length > 0) {
                          setFormData(prev => {
                            const updatedUnits = [...(prev.unitInformation || [])];
                            const key = `${unit.selectedCategory}Files`;
                            const prevFiles = Array.isArray(updatedUnits[idx][key])
                              ? updatedUnits[idx][key]
                              : [];
                            const combinedFiles = [...prevFiles, ...files];
                            updatedUnits[idx] = {
                              ...updatedUnits[idx],
                              [key]: combinedFiles,
                            };
                            return { ...prev, unitInformation: updatedUnits };
                          });
                          handleFiles(files, unit.selectedCategory);
                        }
                      }}
                      className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md
                        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
                        ${!unit.selectedCategory ? 'pointer-events-none opacity-50' : ''}
                      `}
                    >
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor={`unitInformation.${idx}.categoryDocumentUpload`}
                            className={`relative cursor-pointer bg-white rounded-md font-medium text-[#0066cc] hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500
                              ${!unit.selectedCategory ? 'cursor-not-allowed' : ''}
                            `}
                          >
                            <span>Upload files</span>
                            <input
                              id={`unitInformation.${idx}.categoryDocumentUpload`}
                              type="file"
                              multiple
                              name={`unitInformation.${idx}.categoryDocumentUpload`}
                              disabled={!unit.selectedCategory}
                              onChange={e => {
                                if (!unit.selectedCategory) return;
                                const files = e.target.files ? Array.from(e.target.files) : [];
                                if (files.length > 0) {
                                  setFormData(prev => {
                                    const updatedUnits = [...(prev.unitInformation || [])];
                                    const key = `${unit.selectedCategory}Files`;
                                    const prevFiles = Array.isArray(updatedUnits[idx][key])
                                      ? updatedUnits[idx][key]
                                      : [];
                                    const combinedFiles = [...prevFiles, ...files];
                                    updatedUnits[idx] = {
                                      ...updatedUnits[idx],
                                      [key]: combinedFiles,
                                    };
                                    return { ...prev, unitInformation: updatedUnits };
                                  });
                                  handleFiles(files, unit.selectedCategory);
                                }
                                e.target.value = '';
                              }}
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">Multiple files allowed</p>
                      </div>
                    </div>
                  </div>

                    {/* Lease Execution Date */}
                    <div>
                      <label htmlFor={`unitInformation.${idx}.leaseExecutionDate`} className="block text-sm font-medium text-gray-700 mb-1">
                        Lease Execution Date
                      </label>
                      <input
                        id={`unitInformation.${idx}.leaseExecutionDate`}
                        type="date"
                        name={`unitInformation.${idx}.leaseExecutionDate`}
                        value={unit.leaseExecutionDate ?? ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Lease Commencement Date */}
                    <div>
                      <label htmlFor={`unitInformation.${idx}.leaseCommencementDate`} className="block text-sm font-medium text-gray-700 mb-1">
                        Lease Commencement Date
                      </label>
                      <input
                        id={`unitInformation.${idx}.leaseCommencementDate`}
                        type="date"
                        name={`unitInformation.${idx}.leaseCommencementDate`}
                        value={unit.leaseCommencementDate ?? ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Lease Expiration Date */}
                    <div>
                      <label htmlFor={`unitInformation.${idx}.leaseExpirationDate`} className="block text-sm font-medium text-gray-700 mb-1">
                        Lease Expiration Date
                      </label>
                      <input
                        id={`unitInformation.${idx}.leaseExpirationDate`}
                        type="date"
                        name={`unitInformation.${idx}.leaseExpirationDate`}
                        value={unit.leaseExpirationDate ?? ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                  {/* Section T-2: Premises, Use, & Parking */}
                  <div className="mb-8 p-4 rounded-lg border  border-slate-200 bg-slate-50">
                    <h3 className="text-lg font-semibold  text-slate-800 mb-4 flex items-center gap-2">Section T-2: Premises, Use, and Parking</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor={`unitInformation.${idx}.tenantProRataShare`} className="block text-sm font-medium text-gray-700 mb-1">
                          Tenant's Pro Rata Share (%)
                        </label>
                        <input
                          id={`unitInformation.${idx}.tenantProRataShare`}
                          type="text"
                          name={`unitInformation.${idx}.tenantProRataShare`}
                          value={unit.tenantProRataShare ?? ''}
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                          placeholder="e.g. 10"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.rentableAreaSF`} className="block text-sm font-medium text-gray-700 mb-1">
                          Rentable Area (SF)
                        </label>
                        <input
                          id={`unitInformation.${idx}.rentableAreaSF`}
                          type="text"
                          name={`unitInformation.${idx}.rentableAreaSF`}
                          value={unit.rentableAreaSF ?? ''}
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                          placeholder="e.g. 20000"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor={`unitInformation.${idx}.premisesDescription`} className="block text-sm font-medium text-gray-700 mb-1">
                          Premises Description
                        </label>
                        <textarea
                          id={`unitInformation.${idx}.premisesDescription`}
                          name={`unitInformation.${idx}.premisesDescription`}
                          value={unit.premisesDescription ?? ''}
                          onChange={handleChange}
                          rows={2}
                          placeholder="Description of the specific unit leased by the tenant."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                        </textarea>
                      </div>

                      <div className="md:col-span-1">
                        <label htmlFor={`unitInformation.${idx}.permittedUse`} className="block text-sm font-medium text-gray-700 mb-1">
                          Permitted Use
                        </label>
                        <textarea
                          id={`unitInformation.${idx}.permittedUse`}
                          name={`unitInformation.${idx}.permittedUse`}
                          value={unit.permittedUse ?? ''}
                          onChange={handleChange}
                          rows={2}
                          placeholder="Describe what the tenant is allowed to do."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label htmlFor={`unitInformation.${idx}.prohibitedUses`} className="block text-sm font-medium text-gray-700 mb-1">
                          Prohibited Uses
                        </label>
                        <textarea
                          id={`unitInformation.${idx}.prohibitedUses`}
                          name={`unitInformation.${idx}.prohibitedUses`}
                          value={unit.prohibitedUses ?? ''}
                          onChange={handleChange}
                          rows={2}
                          placeholder="List specific restrictions on the tenant's business."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor={`unitInformation.${idx}.tenantExclusiveUse`} className="block text-sm font-medium text-gray-700 mb-1">
                          Tenant Exclusive Use
                        </label>
                        <textarea
                          id={`unitInformation.${idx}.tenantExclusiveUse`}
                          name={`unitInformation.${idx}.tenantExclusiveUse`}
                          value={unit.tenantExclusiveUse ?? ''}
                          onChange={handleChange}
                          rows={2}
                          placeholder="Grant the tenant exclusive right to conduct a certain type of business in the property."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.parkingAgreement`} className="block text-sm font-medium text-gray-700 mb-1">
                          Parking Agreement
                        </label>
                        <select
                          id={`unitInformation.${idx}.parkingAgreement`}
                          name={`unitInformation.${idx}.parkingAgreement`}
                          value={unit.parkingAgreement ?? ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Parking Agreement</option>
                          <option value="All Necessary Parking">All Necessary Parking</option>
                          <option value="Limited Number of Spaces">Limited Number of Spaces</option>
                          <option value="None">None</option>
                        </select>
                        {unit.parkingAgreement === "Limited Number of Spaces" && (
                          <div className="mt-2">
                            <input
                              id={`unitInformation.${idx}.numberOfSpaces`}
                              type="text"
                              name={`unitInformation.${idx}.numberOfSpaces`}
                              value={unit.numberOfSpaces ?? ''}
                              onChange={handleChange}
                              placeholder="Number of Spaces"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Section T-3: Financial Obligations */}
                  <div className="mb-8 p-4 rounded-lg border  border-slate-200 bg-slate-50">
                    <h3 className="text-lg font-semibold  text-slate-800 mb-4 flex items-center gap-2">Section T-3: Financial Obligations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label htmlFor={`unitInformation.${idx}.baseRentSchedule`} className="block text-sm font-medium text-gray-700 mb-1">
                          Base Rent Schedule
                        </label>
                        <div className="space-y-2">
                          {(unit.baseRentSchedule ?? []).map((row: any, rowIdx: number) => (
                            <div key={rowIdx} className="flex gap-2 items-center">
                              <input
                                type="text"
                                placeholder="Period"
                                className="w-1/3 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                value={row.period || ''}
                                onChange={e => {
                                  setFormData(prev => {
                                    const updatedUnits = [...(prev.unitInformation || [])];
                                    const currentUnit = { ...updatedUnits[idx] };
                                    const updatedSchedule = [...(currentUnit.baseRentSchedule || [])];
                                    updatedSchedule[rowIdx] = { ...updatedSchedule[rowIdx], period: e.target.value };
                                    currentUnit.baseRentSchedule = updatedSchedule;
                                    updatedUnits[idx] = currentUnit;
                                    const updatedFormData = { ...prev, unitInformation: updatedUnits };
                                    dispatch({ type: 'SET_PROPERTY_DATA', payload: updatedFormData });
                                    return updatedFormData;
                                  });
                                }}
                              />
                              <input
                                type="text"
                                placeholder="Annual Rent ($)"
                                className="w-1/3 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                value={row.annualRent || ''}
                                onChange={e => {
                                  setFormData(prev => {
                                    const updatedUnits = [...(prev.unitInformation || [])];
                                    const currentUnit = { ...updatedUnits[idx] };
                                    const updatedSchedule = [...(currentUnit.baseRentSchedule || [])];
                                    updatedSchedule[rowIdx] = { ...updatedSchedule[rowIdx], annualRent: e.target.value };
                                    currentUnit.baseRentSchedule = updatedSchedule;
                                    updatedUnits[idx] = currentUnit;
                                    const updatedFormData = { ...prev, unitInformation: updatedUnits };
                                    dispatch({ type: 'SET_PROPERTY_DATA', payload: updatedFormData });
                                    return updatedFormData;
                                  });
                                }}
                                onKeyDown={handleKeyDown}
                              />
                              <input
                                type="text"
                                placeholder="Monthly Rent ($)"
                                className="w-1/3 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                value={row.monthlyRent || ''}
                                onChange={e => {
                                  setFormData(prev => {
                                    const updatedUnits = [...(prev.unitInformation || [])];
                                    const currentUnit = { ...updatedUnits[idx] };
                                    const updatedSchedule = [...(currentUnit.baseRentSchedule || [])];
                                    updatedSchedule[rowIdx] = { ...updatedSchedule[rowIdx], monthlyRent: e.target.value };
                                    currentUnit.baseRentSchedule = updatedSchedule;
                                    updatedUnits[idx] = currentUnit;
                                    const updatedFormData = { ...prev, unitInformation: updatedUnits };
                                    dispatch({ type: 'SET_PROPERTY_DATA', payload: updatedFormData });
                                    return updatedFormData;
                                  });
                                }}
                                onKeyDown={handleKeyDown}
                              />
                              <button
                                type="button"
                                className="ml-2 text-red-500 hover:text-red-700"
                                onClick={() => {
                                  setFormData(prev => {
                                    const updatedUnits = [...(prev.unitInformation || [])];
                                    const currentUnit = { ...updatedUnits[idx] };
                                    const updatedSchedule = [...(currentUnit.baseRentSchedule || [])];
                                    updatedSchedule.splice(rowIdx, 1);
                                    currentUnit.baseRentSchedule = updatedSchedule;
                                    updatedUnits[idx] = currentUnit;
                                    const updatedFormData = { ...prev, unitInformation: updatedUnits };
                                    dispatch({ type: 'SET_PROPERTY_DATA', payload: updatedFormData });
                                    return updatedFormData;
                                  });
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={() => {
                              setFormData(prev => {
                                const updatedUnits = [...(prev.unitInformation || [])];
                                const currentUnit = { ...updatedUnits[idx] };
                                currentUnit.baseRentSchedule = [
                                  ...(currentUnit.baseRentSchedule || []),
                                  { period: '', annualRent: '', monthlyRent: '' },
                                ];
                                updatedUnits[idx] = currentUnit;
                                const updatedFormData = { ...prev, unitInformation: updatedUnits };
                                dispatch({ type: 'SET_PROPERTY_DATA', payload: updatedFormData });
                                return updatedFormData;
                              });
                            }}
                          >
                            Add Row
                          </button>
                        </div>
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.rentFreePeriod`} className="block text-sm font-medium text-gray-700 mb-1">
                          Rent Free Period
                        </label>
                        <input
                          id={`unitInformation.${idx}.rentFreePeriod`}
                          type="text"
                          name={`unitInformation.${idx}.rentFreePeriod`}
                          value={unit.rentFreePeriod ?? ''}
                          onChange={handleChange}
                          placeholder="e.g. 3 months"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.additionalRentTaxes`} className="block text-sm font-medium text-gray-700 mb-1">
                          Additional Rent: Taxes ($)
                        </label>
                        <input
                          id={`unitInformation.${idx}.additionalRentTaxes`}
                          type="text"
                          name={`unitInformation.${idx}.additionalRentTaxes`}
                          value={unit.additionalRentTaxes ?? ''}
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                          placeholder="e.g. 120"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.additionalRentInsurance`} className="block text-sm font-medium text-gray-700 mb-1">
                          Additional Rent: Insurance ($)
                        </label>
                        <input
                          id={`unitInformation.${idx}.additionalRentInsurance`}
                          type="text"
                          name={`unitInformation.${idx}.additionalRentInsurance`}
                          value={unit.additionalRentInsurance ?? ''}
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                          placeholder="e.g. 120"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.additionalRentCAM`} className="block text-sm font-medium text-gray-700 mb-1">
                          Additional Rent: CAM ($)
                        </label>
                        <input
                          id={`unitInformation.${idx}.additionalRentCAM`}
                          type="text"
                          name={`unitInformation.${idx}.additionalRentCAM`}
                          value={unit.additionalRentCAM ?? ''}
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                          placeholder="e.g. 120"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.expenseCapsSteps`} className="block text-sm font-medium text-gray-700 mb-1">
                          Expense Caps/Steps
                        </label>
                        <textarea
                          id={`unitInformation.${idx}.expenseCapsSteps`}
                          name={`unitInformation.${idx}.expenseCapsSteps`}
                          value={unit.expenseCapsSteps ?? ''}
                          onChange={handleChange}
                          placeholder="Describe any caps on controllable expenses, CAM, or expense stops."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.canTenantContestTaxes`} className="block text-sm font-medium text-gray-700 mb-1">
                          Can Tenant Contest Taxes?
                        </label>
                        <select
                          id={`unitInformation.${idx}.canTenantContestTaxes`}
                          name={`unitInformation.${idx}.canTenantContestTaxes`}
                          value={unit.canTenantContestTaxes ?? ''}
                          onChange={handleChange} // Now handled by the general handleChange
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        {unit.canTenantContestTaxes === "Yes" && (
                          <div className="mt-2">
                            <input
                              id={`unitInformation.${idx}.timePeriod`}
                              type="text"
                              name={`unitInformation.${idx}.timePeriod`}
                              value={unit.timePeriod ?? ''}
                              onChange={handleChange}
                              placeholder="Time Period"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label htmlFor={`unitInformation.${idx}.securityDeposit`} className="block text-sm font-medium text-gray-700 mb-1">
                          Security Deposit ($)
                        </label>
                        <select
                          id={`unitInformation.${idx}.securityDeposit`}
                          name={`unitInformation.${idx}.securityDeposit`}
                          value={unit.securityDeposit ?? ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        {unit.securityDeposit === "Yes" && (
                          <div className="mt-2">
                            <input
                              id={`unitInformation.${idx}.securityDepositCurrency`}
                              type="text"
                              name={`unitInformation.${idx}.securityDepositCurrency`}
                              value={unit.securityDepositCurrency ?? ''}
                              onChange={handleChange}
                              onKeyDown={handleKeyDown}
                              placeholder="Security Deposit Currency ($)"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label htmlFor={`unitInformation.${idx}.liquidatedDamagesClause`} className="block text-sm font-medium text-gray-700 mb-1">
                          Liquidated Damages Clause
                        </label>
                        <select
                          id={`unitInformation.${idx}.liquidatedDamagesClause`}
                          name={`unitInformation.${idx}.liquidatedDamagesClause`}
                          value={unit.liquidatedDamagesClause ?? ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        {unit.liquidatedDamagesClause === "Yes" && (
                          <div className="mt-2">
                            <input
                              id={`unitInformation.${idx}.liquidatedDamagesCurrency`}
                              type="text"
                              name={`unitInformation.${idx}.liquidatedDamagesCurrency`}
                              value={unit.liquidatedDamagesCurrency ?? ''}
                              onChange={handleChange}
                              onKeyDown={handleKeyDown}
                              placeholder="Currency ($)"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.letterOfCredit`} className="block text-sm font-medium text-gray-700 mb-1">
                          Letter of Credit
                        </label>
                        <select
                          id={`unitInformation.${idx}.letterOfCredit`}
                          name={`unitInformation.${idx}.letterOfCredit`}
                          value={unit.letterOfCredit ?? ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        {unit.letterOfCredit === "Yes" && (
                          <div className="mt-2">
                            <input
                              id={`unitInformation.${idx}.letterOfCreditCurrency`}
                              type="text"
                              name={`unitInformation.${idx}.letterOfCreditCurrency`}
                              value={unit.letterOfCreditCurrency ?? ''}
                              onChange={handleChange}
                              onKeyDown={handleKeyDown}
                              placeholder="Currency ($)"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.liabilityCap`} className="block text-sm font-medium text-gray-700 mb-1">
                          Liability Cap ($)
                        </label>
                        <input
                          id={`unitInformation.${idx}.liabilityCap`}
                          type="text"
                          name={`unitInformation.${idx}.liabilityCap`}
                          value={unit.liabilityCap ?? ''}
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                          placeholder="e.g. 50,000"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Section T-4: Tenant Operations, Maintenance, and Signage */}
                  <div className="mb-8 p-4 rounded-lg border  border-slate-200 bg-slate-50">
                    <h3 className="text-lg font-semibold  text-slate-800 mb-4 flex items-center gap-2">Section T-4: Tenant Operations, Maintenance, and Signage</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor={`unitInformation.${idx}.tenantRepairDuty`} className="block text-sm font-medium text-gray-700 mb-1">
                          Tenant Repair Duty
                        </label>
                        <textarea
                          id={`unitInformation.${idx}.tenantRepairDuty`}
                          name={`unitInformation.${idx}.tenantRepairDuty`}
                          value={unit.tenantRepairDuty ?? ''}
                          onChange={handleChange}
                          placeholder="Tenant's specific responsibilities."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.hvacRepairReplacement`} className="block text-sm font-medium text-gray-700 mb-1">
                          HVAC Repair/Replacement
                        </label>
                        <textarea
                          id={`unitInformation.${idx}.hvacRepairReplacement`}
                          name={`unitInformation.${idx}.hvacRepairReplacement`}
                          value={unit.hvacRepairReplacement ?? ''}
                          onChange={handleChange}
                          placeholder="Details on HVAC responsibility, including any amortization caps for replacement."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor={`unitInformation.${idx}.tenantInsuranceRequirements`} className="block text-sm font-medium text-gray-700 mb-1">
                          Tenant Insurance Requirements
                        </label>
                        <div className="space-y-2">
                          {(unit.tenantInsuranceRequirements ?? []).map((row: any, rowIdx: number) => (
                            <div key={rowIdx} className="flex gap-2 items-center">
                              <select
                                className="w-1/3 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                value={row.insuranceType || ''}
                                onChange={e => {
                                  setFormData(prev => {
                                    const updatedUnits = [...(prev.unitInformation || [])];
                                    const currentUnit = { ...updatedUnits[idx] };
                                    const updatedRequirements = [...(currentUnit.tenantInsuranceRequirements || [])];
                                    updatedRequirements[rowIdx] = { ...updatedRequirements[rowIdx], insuranceType: e.target.value };
                                    currentUnit.tenantInsuranceRequirements = updatedRequirements;
                                    updatedUnits[idx] = currentUnit;
                                    const updatedFormData = { ...prev, unitInformation: updatedUnits };
                                    dispatch({ type: 'SET_PROPERTY_DATA', payload: updatedFormData });
                                    return updatedFormData;
                                  });
                                }}
                              >
                                <option value="">Select Insurance Type</option>
                                <option value="Public Liability">Public Liability</option>
                                <option value="Property Damage">Property Damage</option>
                                <option value="Worker's Comp">Worker's Comp</option>
                                <option value="Other">Other</option>
                              </select>
                              <input
                                type="text"
                                placeholder="Coverage Amount ($)"
                                className="w-1/3 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                value={row.coverageAmount || ''}
                                onChange={e => {
                                  setFormData(prev => {
                                    const updatedUnits = [...(prev.unitInformation || [])];
                                    const currentUnit = { ...updatedUnits[idx] };
                                    const updatedRequirements = [...(currentUnit.tenantInsuranceRequirements || [])];
                                    updatedRequirements[rowIdx] = { ...updatedRequirements[rowIdx], coverageAmount: e.target.value };
                                    currentUnit.tenantInsuranceRequirements = updatedRequirements;
                                    updatedUnits[idx] = currentUnit;
                                    const updatedFormData = { ...prev, unitInformation: updatedUnits };
                                    dispatch({ type: 'SET_PROPERTY_DATA', payload: updatedFormData });
                                    return updatedFormData;
                                  });
                                }}
                                onKeyDown={handleKeyDown}
                              />

                              <button
                                type="button"
                                className="ml-2 text-red-500 hover:text-red-700"
                                onClick={() => {
                                  setFormData(prev => {
                                    const updatedUnits = [...(prev.unitInformation || [])];
                                    const currentUnit = { ...updatedUnits[idx] };
                                    const updatedRequirements = [...(currentUnit.tenantInsuranceRequirements || [])];
                                    updatedRequirements.splice(rowIdx, 1);
                                    currentUnit.tenantInsuranceRequirements = updatedRequirements;
                                    updatedUnits[idx] = currentUnit;
                                    const updatedFormData = { ...prev, unitInformation: updatedUnits };
                                    dispatch({ type: 'SET_PROPERTY_DATA', payload: updatedFormData });
                                    return updatedFormData;
                                  });
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={() => {
                              setFormData(prev => {
                                const updatedUnits = [...(prev.unitInformation || [])];
                                const currentUnit = { ...updatedUnits[idx] };
                                currentUnit.tenantInsuranceRequirements = [
                                  ...(currentUnit.tenantInsuranceRequirements || []),
                                  { insuranceType: '', coverageAmount: '' },
                                ];
                                updatedUnits[idx] = currentUnit;
                                const updatedFormData = { ...prev, unitInformation: updatedUnits };
                                dispatch({ type: 'SET_PROPERTY_DATA', payload: updatedFormData });
                                return updatedFormData;
                              });
                            }}
                          >
                            Add Row
                          </button>
                        </div>
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.signageClause`} className="block text-sm font-medium text-gray-700 mb-1">
                          Signage Clause
                        </label>
                        <textarea
                          id={`unitInformation.${idx}.signageClause`}
                          name={`unitInformation.${idx}.signageClause`}
                          value={unit.signageClause ?? ''}
                          onChange={handleChange}
                          placeholder="Specifics on the tenant's right to signs."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.prohibitedUseT4`} className="block text-sm font-medium text-gray-700 mb-1">
                          Prohibited Use
                        </label>
                        <input
                          id={`unitInformation.${idx}.prohibitedUseT4`}
                          type="text"
                          name={`unitInformation.${idx}.prohibitedUseT4`}
                          value={unit.prohibitedUseT4 ?? ''}
                          onChange={handleChange}
                          placeholder="List specific restrictions."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.interferenceWithSignage`} className="block text-sm font-medium text-gray-700 mb-1">
                          Interference with Signage
                        </label>
                        <select
                          id={`unitInformation.${idx}.interferenceWithSignage`}
                          name={`unitInformation.${idx}.interferenceWithSignage`}
                          value={unit.interferenceWithSignage ?? ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Signage Interference</option>
                          <option value="Landlord can remove, block, interfere, or tamper with signage">Landlord can remove, block, interfere, or tamper with signage</option>
                          <option value="Landlord cannot remove, block, interfere, or tamper with signage">Landlord cannot remove, block, interfere, or tamper with signage</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.pylonMonumentSignage`} className="block text-sm font-medium text-gray-700 mb-1">
                          Pylon Monument Signage
                        </label>
                        <select
                          id={`unitInformation.${idx}.pylonMonumentSignage`}
                          name={`unitInformation.${idx}.pylonMonumentSignage`}
                          value={unit.pylonMonumentSignage ?? ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  {/* Section T-5: Options and Rights */}
                  <div className="mb-8 p-4 rounded-lg border  border-slate-200 bg-slate-50">
                    <h3 className="text-lg font-semibold  text-slate-800 mb-4 flex items-center gap-2">Section T-5: Options and Rights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label htmlFor={`unitInformation.${idx}.tenantPurchaseOption`} className="block text-sm font-medium text-gray-700 mb-1">
                          Tenant Purchase Option
                        </label>
                        <select
                          id={`unitInformation.${idx}.tenantPurchaseOption`}
                          name={`unitInformation.${idx}.tenantPurchaseOption`}
                          value={unit.tenantPurchaseOption ?? ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        {unit.tenantPurchaseOption === 'Yes' && (
                          <div className="mt-2">
                            <label htmlFor={`unitInformation.${idx}.tenantPurchaseExerciseNotice`} className="block text-sm font-medium text-gray-700 mt-1">
                              Exercise Notice Period
                            </label>
                            <input
                              type="text"
                              id={`unitInformation.${idx}.tenantPurchaseExerciseNotice`}
                              name={`unitInformation.${idx}.tenantPurchaseExerciseNotice`}
                              value={unit.tenantPurchaseExerciseNotice ?? ''}
                              onChange={handleChange}
                              placeholder="e.g. On [DATE] within [NUMBER] of days following notice from landlord"
                              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor={`unitInformation.${idx}.additionalOptionSpaces`} className="block text-sm font-medium text-gray-700 mb-1">
                          Additional Space Option
                        </label>
                        <select
                          id={`unitInformation.${idx}.additionalOptionSpaces`}
                          name={`unitInformation.${idx}.additionalOptionSpaces`}
                          value={unit.additionalOptionSpaces ?? ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        {unit.additionalOptionSpaces === 'Yes' && (
                          <div className="mt-2 gap-4">
                            <div>
                              <label htmlFor={`unitInformation.${idx}.additionalOptionExerciseNotice`} className="block text-sm font-medium text-gray-700 mt-1">
                                Exercise Notice Period
                              </label>
                              <input
                                type="text"
                                id={`unitInformation.${idx}.additionalOptionExerciseNotice`}
                                name={`unitInformation.${idx}.additionalOptionExerciseNotice`}
                                value={unit.additionalOptionExerciseNotice ?? ''}
                                onChange={handleChange}
                                placeholder="e.g. On [DATE] within [NUMBER] of days following notice from landlord"
                                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label htmlFor={`unitInformation.${idx}.additionalOptionDefaultAffectsOption`} className="block text-sm font-medium text-gray-700 mt-1">
                                Default Affects Option?
                              </label>
                              <select
                                id={`unitInformation.${idx}.additionalOptionDefaultAffectsOption`}
                                name={`unitInformation.${idx}.additionalOptionDefaultAffectsOption`}
                                value={unit.additionalOptionDefaultAffectsOption ?? ''}
                                onChange={handleChange}
                                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </select>
                            </div>
                            <div>
                              <label htmlFor={`unitInformation.${idx}.additionalOptionLeaseAmendmentRequired`} className="block text-sm font-medium text-gray-700 mt-1">
                                Lease Amendment Required?
                              </label>
                              <select
                                id={`unitInformation.${idx}.additionalOptionLeaseAmendmentRequired`}
                                name={`unitInformation.${idx}.additionalOptionLeaseAmendmentRequired`}
                                value={unit.additionalOptionLeaseAmendmentRequired ?? ''}
                                onChange={handleChange}
                                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </select>
                            </div>
                            <div>
                              <label htmlFor={`unitInformation.${idx}.additionalOptionNewProportionateShare`} className="block text-sm font-medium text-gray-700 mt-1">
                                New Proportionate Shared?
                              </label>
                              <select
                                id={`unitInformation.${idx}.additionalOptionNewProportionateShare`}
                                name={`unitInformation.${idx}.additionalOptionNewProportionateShare`}
                                value={unit.additionalOptionNewProportionateShare ?? ''}
                                onChange={handleChange}
                                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </select>
                              {unit.additionalOptionNewProportionateShare === "Yes" && (
                                <div className="mt-2">
                                  <input
                                    id={`unitInformation.${idx}.additionalOptionNewProportionateSharePercentage`}
                                    type="text"
                                    name={`unitInformation.${idx}.additionalOptionNewProportionateSharePercentage`}
                                    value={unit.additionalOptionNewProportionateSharePercentage ?? ''}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="New Percentage (%)"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor={`unitInformation.${idx}.renewalExtensionOptions`} className="block text-sm font-medium text-gray-700 mb-1">
                          Renewable Extension Options
                        </label>
                        <div className="space-y-2">
                          {(unit.renewalExtensionOptions ?? []).map((row: any, rowIdx: number) => (
                            <div key={rowIdx} className="flex gap-2 items-center">
                              <input
                                type="text"
                                placeholder='Option Term'
                                className="w-1/3 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                value={row.optionTerm || ''}
                                onChange={e => {
                                  setFormData(prev => {
                                    const updatedUnits = [...(prev.unitInformation || [])];
                                    const currentUnit = { ...updatedUnits[idx] };
                                    const updatedOptions = [...(currentUnit.renewalExtensionOptions || [])];
                                    updatedOptions[rowIdx] = { ...updatedOptions[rowIdx], optionTerm: e.target.value };
                                    currentUnit.renewalExtensionOptions = updatedOptions;
                                    updatedUnits[idx] = currentUnit;
                                    const updatedFormData = { ...prev, unitInformation: updatedUnits };
                                    dispatch({ type: 'SET_PROPERTY_DATA', payload: updatedFormData });
                                    return updatedFormData;
                                  });
                                }}
                              />
                              <input
                                type="text"
                                placeholder='Notice Period'
                                className="w-1/3 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                value={row.noticePeriod || ''}
                                onChange={e => {
                                  setFormData(prev => {
                                    const updatedUnits = [...(prev.unitInformation || [])];
                                    const currentUnit = { ...updatedUnits[idx] };
                                    const updatedOptions = [...(currentUnit.renewalExtensionOptions || [])];
                                    updatedOptions[rowIdx] = { ...updatedOptions[rowIdx], noticePeriod: e.target.value };
                                    currentUnit.renewalExtensionOptions = updatedOptions;
                                    updatedUnits[idx] = currentUnit;
                                    const updatedFormData = { ...prev, unitInformation: updatedUnits };
                                    dispatch({ type: 'SET_PROPERTY_DATA', payload: updatedFormData });
                                    return updatedFormData;
                                  });
                                }}
                              />
                              <input
                                type="text"
                                placeholder="Rent for Option Term"
                                className="w-1/3 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                value={row.rentForOptionTerm || ''}
                                onChange={e => {
                                  setFormData(prev => {
                                    const updatedUnits = [...(prev.unitInformation || [])];
                                    const currentUnit = { ...updatedUnits[idx] };
                                    const updatedOptions = [...(currentUnit.renewalExtensionOptions || [])];
                                    updatedOptions[rowIdx] = { ...updatedOptions[rowIdx], rentForOptionTerm: e.target.value };
                                    currentUnit.renewalExtensionOptions = updatedOptions;
                                    updatedUnits[idx] = currentUnit;
                                    const updatedFormData = { ...prev, unitInformation: updatedUnits };
                                    dispatch({ type: 'SET_PROPERTY_DATA', payload: updatedFormData });
                                    return updatedFormData;
                                  });
                                }}
                              />

                              <button
                                type="button"
                                className="ml-2 text-red-500 hover:text-red-700"
                                onClick={() => {
                                  setFormData(prev => {
                                    const updatedUnits = [...(prev.unitInformation || [])];
                                    const currentUnit = { ...updatedUnits[idx] };
                                    const updatedOptions = [...(currentUnit.renewalExtensionOptions || [])];
                                    updatedOptions.splice(rowIdx, 1);
                                    currentUnit.renewalExtensionOptions = updatedOptions;
                                    updatedUnits[idx] = currentUnit;
                                    const updatedFormData = { ...prev, unitInformation: updatedUnits };
                                    dispatch({ type: 'SET_PROPERTY_DATA', payload: updatedFormData });
                                    return updatedFormData;
                                  });
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={() => {
                              setFormData(prev => {
                                const updatedUnits = [...(prev.unitInformation || [])];
                                const currentUnit = { ...updatedUnits[idx] };
                                currentUnit.renewalExtensionOptions = [
                                  ...(currentUnit.renewalExtensionOptions || []),
                                  { optionTerm: '', noticePeriod: '', rentForOptionTerm: '' },
                                ];
                                updatedUnits[idx] = currentUnit;
                                const updatedFormData = { ...prev, unitInformation: updatedUnits };
                                dispatch({ type: 'SET_PROPERTY_DATA', payload: updatedFormData });
                                return updatedFormData;
                              });
                            }}
                          >
                            Add Row
                          </button>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor={`unitInformation.${idx}.earlyTerminationRights`} className="block text-sm font-medium text-gray-700 mb-1">
                          Early Termination Rights
                        </label>
                        <textarea
                          id={`unitInformation.${idx}.earlyTerminationRights`}
                          name={`unitInformation.${idx}.earlyTerminationRights`}
                          value={unit.earlyTerminationRights ?? ''}
                          onChange={handleChange}
                          placeholder="Describe any rights for either Landlord or Tenant to terminate the lease early."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                    </div>
                  </div>
                  {/* Section T-6: Legal Consents, and Default */}
                  <div className="mb-8 p-4 rounded-lg border  border-slate-200 bg-slate-50">
                    <h3 className="text-lg font-semibold  text-slate-800 mb-4 flex items-center gap-2">Section T-6: Legal Consents, and Default</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor={`unitInformation.${idx}.consentForAssignment`} className="block text-sm font-medium text-gray-700 mb-1">
                          Consent for Assignment
                        </label>
                        <select
                          id={`unitInformation.${idx}.consentForAssignment`}
                          name={`unitInformation.${idx}.consentForAssignment`}
                          value={unit.consentForAssignment ?? ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        {unit.consentForAssignment === 'Yes' && (
                          <div className="mt-2">
                            <div>
                              <label htmlFor={`unitInformation.${idx}.standardForConsentAssignment`} className="block text-sm font-medium text-gray-700 mt-1">
                                Standard for Consent
                              </label>
                              <select
                                id={`unitInformation.${idx}.standardForConsentAssignment`}
                                name={`unitInformation.${idx}.standardForConsentAssignment`}
                                value={unit.standardForConsentAssignment ?? ''}
                                onChange={handleChange}
                                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Select</option>
                                <option value="Sole Discretion">Sole Discretion</option>
                                <option value="May not be Unreasonably Withheld">May not be Unreasonably Withheld</option>
                                <option value="Other">Other</option>

                              </select>

                            </div>
                            <div>
                              <label htmlFor={`unitInformation.${idx}.timePeriodForApprovalAssignment`} className="block text-sm font-medium text-gray-700 mt-1">
                                Time Period for Approval (days)
                              </label>
                              <input
                                type="text"
                                id={`unitInformation.${idx}.timePeriodForApprovalAssignment`}
                                name={`unitInformation.${idx}.timePeriodForApprovalAssignment`}
                                value={unit.timePeriodForApprovalAssignment ?? ''}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                placeholder="e.g. 5"
                                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.consentForSublease`} className="block text-sm font-medium text-gray-700 mb-1">
                          Consent for Sublease
                        </label>
                        <select
                          id={`unitInformation.${idx}.consentForSublease`}
                          name={`unitInformation.${idx}.consentForSublease`}
                          value={unit.consentForSublease ?? ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        {unit.consentForSublease === 'Yes' && (
                          <div className="mt-2">
                            <div>
                              <label htmlFor={`unitInformation.${idx}.standardForConsentSublease`} className="block text-sm font-medium text-gray-700 mt-1">
                                Standard for Consent
                              </label>
                              <select
                                id={`unitInformation.${idx}.standardForConsentSublease`}
                                name={`unitInformation.${idx}.standardForConsentSublease`}
                                value={unit.standardForConsentSublease ?? ''}
                                onChange={handleChange}
                                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Select</option>
                                <option value="Sole Discretion">Sole Discretion</option>
                                <option value="May not be Unreasonably Withheld">May not be Unreasonably Withheld</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                            <div>
                              <label htmlFor={`unitInformation.${idx}.timePeriodForApprovalSublease`} className="block text-sm font-medium text-gray-700 mt-1">
                                Time Period for Approval (days)
                              </label>
                              <input
                                type="text"
                                id={`unitInformation.${idx}.timePeriodForApprovalSublease`}
                                name={`unitInformation.${idx}.timePeriodForApprovalSublease`}
                                value={unit.timePeriodForApprovalSublease ?? ''}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                placeholder="e.g. 5"
                                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.consentForAlterations`} className="block text-sm font-medium text-gray-700 mb-1">
                          Consent for Alterations
                        </label>
                        <select
                          id={`unitInformation.${idx}.consentForAlterations`}
                          name={`unitInformation.${idx}.consentForAlterations`}
                          value={unit.consentForAlterations ?? ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        {unit.consentForAlterations === 'Yes' && (
                          <div className="mt-2">
                            <div>
                              <label htmlFor={`unitInformation.${idx}.consentForMajorAlterations`} className="block text-sm font-medium text-gray-700 mt-1">
                                Consent for Major Alterations
                              </label>
                              <select
                                id={`unitInformation.${idx}.consentForMajorAlterations`}
                                name={`unitInformation.${idx}.consentForMajorAlterations`}
                                value={unit.consentForMajorAlterations ?? ''}
                                onChange={handleChange}
                                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </select>
                              {unit.consentForMajorAlterations === 'Yes' && (
                                <div className="mt-2">
                                  <label htmlFor={`unitInformation.${idx}.majorDefinition`} className="block text-sm font-medium text-gray-700 mt-1">
                                    Major Alteration Definition
                                  </label>
                                  <textarea
                                    id={`unitInformation.${idx}.majorDefinition`}
                                    name={`unitInformation.${idx}.majorDefinition`}
                                    value={unit.majorDefinition ?? ''}
                                    onChange={handleChange}
                                    placeholder="Define what constitutes a 'major' alteration."
                                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                              )}
                            </div>
                            <div>
                              <label htmlFor={`unitInformation.${idx}.consentForNonMajorAlterations`} className="block text-sm font-medium text-gray-700 mt-1">
                                Consent for Non-Major Alterations
                              </label>
                              <select
                                id={`unitInformation.${idx}.consentForNonMajorAlterations`}
                                name={`unitInformation.${idx}.consentForNonMajorAlterations`}
                                value={unit.consentForNonMajorAlterations ?? ''}
                                onChange={handleChange}
                                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </select>
                              {unit.consentForNonMajorAlterations === 'Yes' && (
                                <div className="mt-2">
                                  <label htmlFor={`unitInformation.${idx}.nonMajorDefinition`} className="block text-sm font-medium text-gray-700 mt-1">
                                    Non-Major Alteration Definition
                                  </label>
                                  <textarea
                                    id={`unitInformation.${idx}.nonMajorDefinition`}
                                    name={`unitInformation.${idx}.nonMajorDefinition`}
                                    value={unit.nonMajorDefinition ?? ''}
                                    onChange={handleChange}
                                    placeholder="Define what constitutes a 'non-major' alteration."
                                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.tenantDefaultConditions`} className="block text-sm font-medium text-gray-700 mb-1">
                          Tenant Default Conditions
                        </label>
                        <div className="flex flex-col items-start justify-center gap-1">
                          {[
                            'Failure to pay rent',
                            'Failure to perform',
                            'Insolvency',
                            'Other',
                          ].map((type) => (
                            <label key={type} className="flex flex-row text-gray-700">
                              <input
                                className="my-1 mx-2 block text-sm font-medium text-[#0066cc] mb-1 rounded-sm checked:bg-[#0066cc] border-gray-700"
                                type="checkbox"
                                name={`unitInformation.${idx}.tenantDefaultConditions`}
                                value={type}
                                checked={Array.isArray(unit.tenantDefaultConditions)
                                  ? unit.tenantDefaultConditions.includes(type)
                                  : unit.tenantDefaultConditions === type}
                                onChange={handleChange} // Use the unified handleChange
                              />
                              {type}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.defaultCurePeriodRent`} className="block text-sm font-medium text-gray-700 mb-1">
                          Default Cure Period (Rent)
                        </label>
                        <input
                          id={`unitInformation.${idx}.defaultCurePeriodRent`}
                          type="text"
                          name={`unitInformation.${idx}.defaultCurePeriodRent`}
                          value={unit.defaultCurePeriodRent ?? ''}
                          onChange={handleChange}
                          placeholder="e.g. 10 days"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.defaultCurePeriodOther`} className="block text-sm font-medium text-gray-700 mb-1">
                          Default Cure Period (Other)
                        </label>
                        <input
                          id={`unitInformation.${idx}.defaultCurePeriodOther`}
                          type="text"
                          name={`unitInformation.${idx}.defaultCurePeriodOther`}
                          value={unit.defaultCurePeriodOther ?? ''}
                          onChange={handleChange}
                          placeholder="e.g. 3 days"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.holdoverRent`} className="block text-sm font-medium text-gray-700 mb-1">
                          Holdover Rent
                        </label>
                        <input
                          id={`unitInformation.${idx}.holdoverRent`}
                          type="text"
                          name={`unitInformation.${idx}.holdoverRent`}
                          value={unit.holdoverRent ?? ''}
                          onChange={handleChange}
                          placeholder="e.g. 150% of last paid rent"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor={`unitInformation.${idx}.landlordDefaultClause`} className="block text-sm font-medium text-gray-700 mb-1">
                          Does the lease define Landlord default?
                        </label>
                        <select
                          id={`unitInformation.${idx}.landlordDefaultClause`}
                          name={`unitInformation.${idx}.landlordDefaultClause`}
                          value={unit.landlordDefaultClause ?? ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        {unit.landlordDefaultClause === 'Yes' && (
                          <div className="mt-2">
                            <label htmlFor={`unitInformation.${idx}.remediesWaiver`} className="block text-sm font-medium text-gray-700 mt-1">
                              Is there a waiver of remedies for Landlord default?
                            </label>
                            <select
                              id={`unitInformation.${idx}.remediesWaiver`}
                              name={`unitInformation.${idx}.remediesWaiver`}
                              value={unit.remediesWaiver ?? ''}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Select</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </div>

                        )}
                      </div>

                      <div>
                        <label htmlFor={`unitInformation.${idx}.landlordsDutyToMitigate`} className="block text-sm font-medium text-gray-700 mb-1">
                          Landlord's Duty to Mitigate
                        </label>
                        <select
                          id={`unitInformation.${idx}.landlordsDutyToMitigate`}
                          name={`unitInformation.${idx}.landlordsDutyToMitigate`}
                          value={unit.landlordsDutyToMitigate ?? ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.choiceOfLaw`} className="block text-sm font-medium text-gray-700 mb-1">
                          Choice of Law
                        </label>
                        <select
                          id={`unitInformation.${idx}.choiceOfLaw`}
                          name={`unitInformation.${idx}.choiceOfLaw`}
                          value={unit.choiceOfLaw ?? ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select State</option>
                          <option value="Alabama">Alabama</option>
                          <option value="Alaska">Alaska</option>
                          <option value="Arizona">Arizona</option>
                          <option value="Arkansas">Arkansas</option>
                          <option value="California">California</option>
                          <option value="Colorado">Colorado</option>
                          <option value="Connecticut">Connecticut</option>
                          <option value="Delaware">Delaware</option>
                          <option value="Florida">Florida</option>
                          <option value="Georgia">Georgia</option>
                          <option value="Hawaii">Hawaii</option>
                          <option value="Idaho">Idaho</option>
                          <option value="Illinois">Illinois</option>
                          <option value="Indiana">Indiana</option>
                          <option value="Iowa">Iowa</option>
                          <option value="Kansas">Kansas</option>
                          <option value="Kentucky">Kentucky</option>
                          <option value="Louisiana">Louisiana</option>
                          <option value="Maine">Maine</option>
                          <option value="Maryland">Maryland</option>
                          <option value="Massachusetts">Massachusetts</option>
                          <option value="Michigan">Michigan</option>
                          <option value="Minnesota">Minnesota</option>
                          <option value="Mississippi">Mississippi</option>
                          <option value="Missouri">Missouri</option>
                          <option value="Montana">Montana</option>
                          <option value="Nebraska">Nebraska</option>
                          <option value="Nevada">Nevada</option>
                          <option value="New Hampshire">New Hampshire</option>
                          <option value="New Jersey">New Jersey</option>
                          <option value="New Mexico">New Mexico</option>
                          <option value="New York">New York</option>
                          <option value="North Carolina">North Carolina</option>
                          <option value="North Dakota">North Dakota</option>
                          <option value="Ohio">Ohio</option>
                          <option value="Oklahoma">Oklahoma</option>
                          <option value="Oregon">Oregon</option>
                          <option value="Pennsylvania">Pennsylvania</option>
                          <option value="Rhode Island">Rhode Island</option>
                          <option value="South Carolina">South Carolina</option>
                          <option value="South Dakota">South Dakota</option>
                          <option value="Tennessee">Tennessee</option>
                          <option value="Texas">Texas</option>
                          <option value="Utah">Utah</option>
                          <option value="Vermont">Vermont</option>
                          <option value="Virginia">Virginia</option>
                          <option value="Washington">Washington</option>
                          <option value="West Virginia">West Virginia</option>
                          <option value="Wisconsin">Wisconsin</option>
                          <option value="Wyoming">Wyoming</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.guarantorEndorser`} className="block text-sm font-medium text-gray-700 mb-1">
                          Guarantor/Franchisor Name
                        </label>
                        <input
                          id={`unitInformation.${idx}.guarantorEndorser`}
                          type="text"
                          name={`unitInformation.${idx}.guarantorEndorser`}
                          value={unit.guarantorEndorser ?? ''}
                          onChange={handleChange}
                          placeholder="The name of the guaranteeing entity, if any."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.guarantorRights`} className="block text-sm font-medium text-gray-700 mb-1">
                          Guarantor Rights
                        </label>
                        <textarea
                          id={`unitInformation.${idx}.guarantorRights`}
                          name={`unitInformation.${idx}.guarantorRights`}
                          value={unit.guarantorRights ?? ''}
                          onChange={handleChange}
                          placeholder="Specific rights granted to the guarantor."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.sndaAttachedToLease`} className="block text-sm font-medium text-gray-700 mb-1">
                          SNDA Attached to Lease
                        </label>
                        <select
                          id={`unitInformation.${idx}.sndaAttachedToLease`}
                          name={`unitInformation.${idx}.sndaAttachedToLease`}
                          value={unit.sndaAttachedToLease ?? ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.leaseSubordinationType`} className="block text-sm font-medium text-gray-700 mb-1">
                          Lease Subordination Type
                        </label>
                        <select
                          id={`unitInformation.${idx}.leaseSubordinationType`}
                          name={`unitInformation.${idx}.leaseSubordinationType`}
                          value={unit.leaseSubordinationType ?? ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Subordination Type</option>
                          <option value="Automatic">Automatic</option>
                          <option value="Conditional">Conditional</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.forceMajeureTerms`} className="block text-sm font-medium text-gray-700 mb-1">
                          Force Majeure terms
                        </label>
                        <div className="flex flex-col items-start justify-center gap-1">
                          {[
                            'Acts of God',
                            'Floods',
                            'Fires',
                            'Earthquakes',
                            'Wars',
                            'Pandemics',
                            'Strikes',
                            'Other',
                          ].map((type) => (
                            <label key={type} className="flex flex-row text-gray-700">
                              <input
                                className="my-1 mx-2 block text-sm font-medium text-[#0066cc] mb-1 rounded-sm checked:bg-[#0066cc] border-gray-700"
                                type="checkbox"
                                name={`unitInformation.${idx}.forceMajeureTerms`}
                                value={type}
                                checked={Array.isArray(unit.forceMajeureTerms)
                                  ? unit.forceMajeureTerms.includes(type)
                                  : unit.forceMajeureTerms === type}
                                onChange={handleChange} // Use unified handleChange
                              />
                              {type}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.eminentDomainClause`} className="block text-sm font-medium text-gray-700 mb-1">
                          Eminent Domain Clause
                        </label>
                        <select
                          id={`unitInformation.${idx}.eminentDomainClause`}
                          name={`unitInformation.${idx}.eminentDomainClause`}
                          value={unit.eminentDomainClause ?? ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Domain Clause</option>
                          <option value="Total Taking">Total Taking</option>
                          <option value="Partial Taking">Partial Taking</option>
                          <option value="Condemnation Clause Present">Condemnation Clause Present</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.compensationRights`} className="block text-sm font-medium text-gray-700 mb-1">
                          Compensation Rights
                        </label>
                        <div className="flex flex-col items-start justify-center gap-1">
                          {[
                            'Just Compensation',
                            'Improvements',
                            'Relocation Benefits',
                          ].map((type) => (
                            <label key={type} className="flex flex-row text-gray-700">
                              <input
                                className="my-1 mx-2 block text-sm font-medium text-[#0066cc] mb-1 rounded-sm checked:bg-[#0066cc] border-gray-700"
                                type="checkbox"
                                name={`unitInformation.${idx}.compensationRights`}
                                value={type}
                                checked={Array.isArray(unit.compensationRights)
                                  ? unit.compensationRights.includes(type)
                                  : unit.compensationRights === type}
                                onChange={handleChange} // Use unified handleChange
                              />
                              {type}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.rightToEnterRightOfInspection`} className="block text-sm font-medium text-gray-700 mb-1">
                          Right to Enter Right of Inspection
                        </label>
                        <input
                          id={`unitInformation.${idx}.rightToEnterRightOfInspection`}
                          type="text"
                          name={`unitInformation.${idx}.rightToEnterRightOfInspection`}
                          value={unit.rightToEnterRightOfInspection ?? ''}
                          onChange={handleChange}
                          placeholder="Describe scope and limitaton of the right."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor={`unitInformation.${idx}.estoppelCertificateRequirements`} className="block text-sm font-medium text-gray-700 mb-1">
                          Estoppel Certificate Requirements
                        </label>
                        <input
                          id={`unitInformation.${idx}.estoppelCertificateRequirements`}
                          type="text"
                          name={`unitInformation.${idx}.estoppelCertificateRequirements`}
                          value={unit.estoppelCertificateRequirements ?? ''}
                          onChange={handleChange}
                          placeholder="What are the requirements for issuing an Estoppel Certificate?"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))} {/* End of map for units */}

          <div className="flex justify-center mb-8">
            <button
              type="button"
              onClick={addUnit}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0066cc] hover:bg-[#0055aa] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add New Unit
            </button>
          </div>

          <div className="flex justify-between items-center mt-5">
            <button
              type="button"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={() => exportSpreadsheet({})}
            >
              Export as Spreadsheet
            </button>
          </div>

          <div className="flex justify-between items-center mt-10">
            <Link
              href="/operations-dashboard/properties/add/page3"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back to Property Details
            </Link>

            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0066cc] hover:bg-[#0055aa] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Next: Processing
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
