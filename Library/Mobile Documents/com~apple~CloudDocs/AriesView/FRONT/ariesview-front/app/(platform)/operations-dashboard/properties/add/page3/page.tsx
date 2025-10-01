
// SECOND TAB ON THE APP PROPERTIES FORM

'use client'

import { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic';
const UnitInformationTable = dynamic(() => import('@/components/UnitInformationTable'), { ssr: false });
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePropertyForm } from '../PropertyFormContext' // Import context hook
import type { PropertyData, Document } from '../PropertyFormContext' // Import type
import { useCreatePropertyDetails } from '@/app/rest/property'
import toast from 'react-hot-toast'



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
    year_0: {
      rentAbatement: '', // missing
      otherAdjustments: '', // missing
      tenant_improvements: '', // fixed
      leasing_commissions: '', // fixed
      capital_reserves: '', // fixed
      misc_capex: '', // fixed
    },
    t12: {
      rentAbatement: '', // missing
      otherAdjustments: '', // missing
      tenant_improvements: '', // fixed
      leasing_commissions: '', // fixed
      capital_reserves: '', // fixed
      misc_capex: '', // fixed
    },
    pro_forma_yr1: {
      rentAbatement: '', // missing
      otherAdjustments: '', // missing
      tenant_improvements: '', // fixed
      leasing_commissions: '', // fixed
      capital_reserves: '', // fixed
      misc_capex: '', // fixed
    },
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


    // rentAbatement: Array(15).fill(''), // missing
    // otherAdjustments: Array(15).fill(''), // missing
    // tenant_improvements: Array(15).fill(''), // fixed
    // leasing_commissions: Array(15).fill(''), // fixed
    // capital_reserves: Array(15).fill(''), // fixed
    // misc_capex: Array(15).fill(''), // fixed

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
const formatCurrency = (value) => {
  if (typeof value !== 'number' || isNaN(value)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value) => {
  if (typeof value !== 'number' || isNaN(value)) return '0';
  return new Intl.NumberFormat('en-US').format(value);
};

const formatPercent = (value) => {
  if (typeof value !== 'number' || isNaN(value)) return '0.0%';
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value);
};


// Using the property details creation hook instead of manual token handling

export default function PropertyDetailsPage() {
  const router = useRouter();
  const { state: contextState, dispatch } = usePropertyForm(); // Use context
  const { propertyData, propertyId } = contextState
  
  // Use the property details creation hook
  const createPropertyDetailsMutation = useCreatePropertyDetails();


  // Re-introduce local state for form-specific errors
  const [errors, setErrors] = useState<Partial<PropertyData>>({});
  const [formData, setFormData] = useState<Partial<PropertyData>>(contextState.propertyData || initialFormData);

  const [apiError, setApiError] = useState<string | null>(null); // Add API error state

  console.log("inside documents/page.tsx!")

  // Update local state if context changes (e.g., navigating back)
  useEffect(() => {
    if (!propertyData || !propertyId) {
      console.warn('Property data or ID missing in context, redirecting.')
      router.push('/operations-dashboard/properties/add')
    }


  }, [propertyData, propertyId, router]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', '.'];
    const isNumeric = /[0-9]/.test(e.key);

    if (!isNumeric && !allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;


    // Helper to set nested value in formData
    function setNestedValue(obj: any, path: string[], val: any) {
      if (path.length === 1) {
        obj[path[0]] = val;
        return obj;
      }
      const key = path[0];
      if (obj[key] === undefined || obj[key] === null) {
        // If next key is a number, create array, else object
        obj[key] = isNaN(Number(path[1])) ? {} : [];
      }
      obj[key] = setNestedValue({ ...obj[key] }, path.slice(1), val);
      return obj;
    }

    // Helper to clear nested error
    function clearNestedError(obj: any, path: string[]): any {
      if (!obj) return obj;
      if (path.length === 1) {
        const { [path[0]]: _, ...rest } = obj;
        return rest;
      }
      const key = path[0];
      if (obj[key]) {
        obj[key] = clearNestedError(obj[key], path.slice(1));
      }
      return obj;
    }

    // Split name by dot for nested keys
    const path = name.split('.');
    // Update formData
    const updatedData = setNestedValue({ ...formData }, path, value);
    setFormData(updatedData);
    // Dispatch update to context immediately
    dispatch({ type: 'SET_PROPERTY_DATA', payload: updatedData });

    // Clear error for this field when user types
    let updatedErrors = errors;
    if (errors) {
      updatedErrors = clearNestedError({ ...errors }, path);
      setErrors(updatedErrors);
    }
  };

  // Handle form submission using the hook
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null); // Clear previous API errors

    try {
      // Prepare data for backend (ensure types match backend expectations)
      // Use data directly from contextState as it's kept up-to-date
      const propertyData = contextState.propertyData || initialFormData;
      // REMOVE BEFORE PRODUCTION
      console.log("property data: ", contextState.propertyData)
      console.log("zoningAndEasements: ", contextState.propertyData?.zoningAndEasements)
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
          // Acquisition Information
          acquisitionInformation: propertyData.acquisitionInformation,
          // Assumptions
          assumptions: propertyData.assumptions,
          // Cash Flows
          cashFlows: propertyData.cashFlows,
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

      const result = await createPropertyDetailsMutation.mutateAsync(payload);
      
      if (result.success) {
        // Property details were saved successfully
        // Use propertyId from context since backend doesn't return it from this endpoint
        console.log(`Property details saved for ID: ${contextState.propertyId}. Moving to unit details step.`);
        toast.success('Property details saved successfully!');
        router.push(`/operations-dashboard/properties/add/page4`);
      } else {
        throw new Error(result.error || result.message || 'Failed to save property details. Invalid response from server.');
      }

    } catch (err) {
      console.error('Failed to add property:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setApiError(errorMessage);
      toast.error(`Failed to save property details: ${errorMessage}`);
    }
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
                <div className="w-10 h-10 rounded-full bg-[#0066cc] text-white flex items-center justify-center font-bold">3</div>
                <div className="mt-2 text-sm font-medium  text-[#0066cc]">Property Details</div>
              </div>
              <div className="flex-grow h-0.5 bg-gray-200 mx-4"></div>
              <div className="relative flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold">4</div>
                <div className="mt-2 text-sm font-medium text-gray-500">Unit Details</div>
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
          {/* Zoning and Easements */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Zoning and Easements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label htmlFor="zoning_code" className="block text-sm font-medium text-gray-700 mb-1">
                    Zoning Code
                  </label>
                  <select
                    id="zoning_code"
                    name="zoningAndEasements.zoning_code"
                    value={formData.zoningAndEasements?.zoning_code ?? ''}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.zoningAndEasements?.zoning_code ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]`}
                  >
                    <option value="">Select Zoning Code</option>
                    <option value="Multifamily">Commercial Zones</option>
                    <option value="Office">Office Zones</option>
                    <option value="Retail">Retail Zones</option>
                    <option value="Industrial">Mixed-Use Zones</option>
                    <option value="Hotel">Industrial Zones</option>
                    <option value="Mixed-Use">General Zoning</option>
                  </select>
                  {errors.zoningAndEasements?.zoning_code && <p className="mt-1 text-sm text-red-600">{errors.zoningAndEasements?.zoning_code}</p>}
                </div>
                <div>
                  <label htmlFor="easement_type" className="block text-sm font-medium text-gray-700 mb-1">Easement Type</label>
                  <div className="flex flex-col items-start justify-center gap-1" id="easement_type">
                    {[
                      'Easement by Necessity',
                      'Easement by Prescription',
                      'Easement by Condemnation',
                      'Express Easement',
                    ].map((type) => (
                      <label key={type} className="flex flex-row text-gray-700">
                        <input
                          className="my-1 mx-2 block text-sm font-medium text-[#0066cc] mb-1 rounded-sm checked:bg-[#0066cc] border-gray-700"
                          type="checkbox"
                          name="zoningAndEasements.easement_type"
                          value={type}
                          checked={formData.zoningAndEasements?.easement_type
                            ? formData.zoningAndEasements.easement_type.split(', ').includes(type)
                            : false}
                          onChange={(e) => {
                            let newValue;
                            if (e.target.checked) {
                              newValue = Array.isArray(formData.zoningAndEasements?.easement_type)
                                ? [...formData.zoningAndEasements.easement_type.split(', ').filter(Boolean), type].join(', ')
                                : formData.zoningAndEasements?.easement_type
                                  ? `${formData.zoningAndEasements.easement_type}, ${type}`
                                  : type;
                            } else {
                              newValue = Array.isArray(formData.zoningAndEasements?.easement_type)
                                ? formData.zoningAndEasements.easement_type.split(', ').filter((t) => t !== type).join(', ')
                                : formData.zoningAndEasements?.easement_type
                                  ? formData.zoningAndEasements.easement_type.split(', ').filter((t) => t !== type).join(', ')
                                  : '';
                            }
                            const updated = {
                              ...formData,
                              zoningAndEasements: {
                                ...formData.zoningAndEasements,
                                easement_type: newValue,
                              },
                            };
                            setFormData(updated);
                            dispatch({ type: 'SET_PROPERTY_DATA', payload: updated });
                          }}
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                  {errors.zoningAndEasements?.easement_type && <p className="mt-1 text-sm text-red-600">{errors.zoningAndEasements?.easement_type}</p>}
                </div>
              </div>
            </div>
          </div>


          {/* Superior Interest Holders */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Superior Interest Holders</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="superiorInterestHolders.num_superior_interest_holders" className="block text-sm font-medium text-gray-700 mb-1">
                    # of Superior Interest Holders
                  </label>
                  <input
                    type="text"
                    id="zip"
                    name="superiorInterestHolders.num_superior_interest_holders"
                    value={formData.superiorInterestHolders?.num_superior_interest_holders ?? ''}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className={`w-full px-3 py-2 border ${errors.superiorInterestHolders?.num_superior_interest_holders ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]`}
                    placeholder="e.g. 2"
                  />
                  {errors.superiorInterestHolders?.num_superior_interest_holders && <p className="mt-1 text-sm text-red-600">{errors.superiorInterestHolders.num_superior_interest_holders}</p>}
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="list_superior_interest_holders" className="block text-sm font-medium text-gray-700 mb-1">
                    List Superior Interest Holders
                  </label>
                  <input
                    type="text"
                    id="zip"
                    name="superiorInterestHolders.list_superior_interest_holders"
                    value={formData.superiorInterestHolders?.list_superior_interest_holders ?? ''}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.superiorInterestHolders?.list_superior_interest_holders ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]`}
                    placeholder="e.g. Bank of America, Jane Doe"
                  />
                  {errors.superiorInterestHolders?.list_superior_interest_holders && <p className="mt-1 text-sm text-red-600">{errors.superiorInterestHolders.list_superior_interest_holders}</p>}
                </div>
              </div>
            </div>

          </div>


          {/* Property Financials and Characteristics */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Property Financials and Characteristics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="propertyFinancialsAndCharacteristics.analysis_start" className="block text-sm font-medium text-gray-700 mb-1">
                    Analysis Start Date
                  </label>
                  <input
                    type="date"
                    id="propertyFinancialsAndCharacteristics.analysis_start"
                    name="propertyFinancialsAndCharacteristics.analysis_start"
                    value={formData.propertyFinancialsAndCharacteristics?.analysis_start ?? ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]"
                  />
                </div>
                <div>
                  <label htmlFor="propertyFinancialsAndCharacteristics.analysis_period" className="block text-sm font-medium text-gray-700 mb-1">
                    Analysis Period (years)
                  </label>
                  <input
                    type="text"
                    id="propertyFinancialsAndCharacteristics.analysis_period"
                    name="propertyFinancialsAndCharacteristics.analysis_period"
                    value={formData.propertyFinancialsAndCharacteristics?.analysis_period ?? ''}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]"
                    placeholder="e.g. 5 "
                  />
                </div>
                <div>
                  <label htmlFor="propertyFinancialsAndCharacteristics.exit_valuation_noi" className="block text-sm font-medium text-gray-700 mb-1">
                    Exit Valuation NOI
                  </label>
                  <input
                    type="text"
                    id="propertyFinancialsAndCharacteristics.exit_valuation_noi"
                    name="propertyFinancialsAndCharacteristics.exit_valuation_noi"
                    value={formData.propertyFinancialsAndCharacteristics?.exit_valuation_noi ?? ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]"
                    placeholder="e.g. T12"
                  />
                </div>
                <div>
                  <label htmlFor="propertyFinancialsAndCharacteristics.exit_cap_rate_growth" className="block text-sm font-medium text-gray-700 mb-1">
                    Exit Cap Rate Growth (bps)
                  </label>
                  <input
                    type="text"
                    id="propertyFinancialsAndCharacteristics.exit_cap_rate_growth"
                    name="propertyFinancialsAndCharacteristics.exit_cap_rate_growth"
                    value={formData.propertyFinancialsAndCharacteristics?.exit_cap_rate_growth ?? ''}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]"
                    placeholder="e.g. 5"
                  />
                </div>
                <div>
                  <label htmlFor="propertyFinancialsAndCharacteristics.market_cap_rate" className="block text-sm font-medium text-gray-700 mb-1">
                    Market Cap Rate (%)
                  </label>
                  <input
                    type="text"
                    id="propertyFinancialsAndCharacteristics.market_cap_rate"
                    name="propertyFinancialsAndCharacteristics.market_cap_rate"
                    value={formData.propertyFinancialsAndCharacteristics?.market_cap_rate ?? ''}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]"
                    placeholder="e.g. 6.5"
                  />
                </div>
                <div>
                  <label htmlFor="propertyFinancialsAndCharacteristics.discount_rate" className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Rate (%)
                  </label>
                  <input
                    type="text"
                    id="propertyFinancialsAndCharacteristics.discount_rate"
                    name="propertyFinancialsAndCharacteristics.discount_rate"
                    value={formData.propertyFinancialsAndCharacteristics?.discount_rate ?? ''}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]"
                    placeholder="e.g. 7.5"
                  />
                </div>
              </div>
            </div>
          </div>


          {/* Acquisition Information */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Acquisition Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="acquisitionInformation.purchase_price_method" className="block text-sm font-medium text-gray-700 mb-1">
                    Purchase Price Method
                  </label>
                  <input
                    type="text"
                    id="acquisitionInformation.purchase_price_method"
                    name="acquisitionInformation.purchase_price_method"
                    value={formData.acquisitionInformation?.purchase_price_method ?? ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]"
                    placeholder="e.g. Manual Input"
                  />
                </div>
                <div>
                  <label htmlFor="acquisitionInformation.upfront_capex" className="block text-sm font-medium text-gray-700 mb-1">
                    Upfront CapEx
                  </label>
                  <input
                    type="text"
                    id="acquisitionInformation.upfront_capex"
                    name="acquisitionInformation.upfront_capex"
                    value={formData.acquisitionInformation?.upfront_capex ?? ''}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]"
                    placeholder="e.g. 250000"
                  />
                </div>
                <div>
                  <label htmlFor="acquisitionInformation.due_diligence_costs" className="block text-sm font-medium text-gray-700 mb-1">
                    Due Dilligence + Closing Cost (%)
                  </label>
                  <input
                    type="text"
                    id="acquisitionInformation.due_diligence_costs"
                    name="acquisitionInformation.due_diligence_costs"
                    value={formData.acquisitionInformation?.due_diligence_costs ?? ''}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]"
                    placeholder="e.g. 2"
                  />
                </div>
                <div>
                  <label htmlFor="acquisitionInformation.selling_cost_at_exit" className="block text-sm font-medium text-gray-700 mb-1">
                    Selling Cost at Exit (%)
                  </label>
                  <input
                    type="text"
                    id="acquisitionInformation.selling_cost_at_exit"
                    name="acquisitionInformation.selling_cost_at_exit"
                    value={formData.acquisitionInformation?.selling_cost_at_exit ?? ''}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]"
                    placeholder="e.g. 2"
                  />
                </div>
                <div>
                  <label htmlFor="acquisitionInformation.purchase_price" className="block text-sm font-medium text-gray-700 mb-1">
                    Set Purchase Price if Manual Input
                  </label>
                  <input
                    type="text"
                    id="acquisitionInformation.purchase_price"
                    name="acquisitionInformation.purchase_price"
                    value={formData.acquisitionInformation?.purchase_price ?? ''}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]"
                    placeholder="e.g. 6500000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Assumptions */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Assumptions</h2>
              {/* Financing Assumptions */}
              <div className="mb-8 p-4 rounded-lg border border-slate-200 bg-slate-50">
                <h3 className="text-lg font-semibold  text-slate-800 mb-4 flex items-center gap-2">Financing Assumptions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="interest_rate_fin_assumptions" className="block text-sm font-medium text-gray-700 mb-1">
                      Interest Rate (%)
                    </label>
                    <input
                      id="interest_rate_fin_assumptions"
                      type="text"
                      name="assumptions.financing.interest_rate_fin_assumptions"
                      value={formData.assumptions?.financing?.interest_rate_fin_assumptions ?? ''}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      placeholder="e.g. 4.5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="years_interest_only" className="block text-sm font-medium text-gray-700 mb-1">
                      Years I/O (Interest-Only)
                    </label>
                    <input
                      id="years_interest_only"
                      type="text"
                      name="assumptions.financing.years_interest_only"
                      value={formData.assumptions?.financing?.years_interest_only ?? ''}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      placeholder="e.g. 1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="amortization_period" className="block text-sm font-medium text-gray-700 mb-1">
                      Amortization Period (Years)
                    </label>
                    <input
                      id="amortization_period"
                      type="text"
                      name="assumptions.financing.amortization_period"
                      value={formData.assumptions?.financing?.amortization_period ?? ''}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      placeholder="e.g. 1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="loan_term" className="block text-sm font-medium text-gray-700 mb-1">
                      Loan Term (years)
                    </label>
                    <input
                      id="loan_term"
                      type="text"
                      name="assumptions.financing.loan_term"
                      value={formData.assumptions?.financing?.loan_term ?? ''}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      placeholder="e.g. 1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="loan_to_value" className="block text-sm font-medium text-gray-700 mb-1">
                      Loan To Value (%)
                    </label>
                    <input
                      id="loan_to_value"
                      type="text"
                      name="assumptions.financing.loan_to_value"
                      value={formData.assumptions?.financing?.loan_to_value ?? ''}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      placeholder="e.g. 2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="lender_fees" className="block text-sm font-medium text-gray-700 mb-1">
                      Lender Fees (%)
                    </label>
                    <input
                      id="lender_fees"
                      type="text"
                      name="assumptions.financing.lender_fees"
                      value={formData.assumptions?.financing?.lender_fees ?? ''}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      placeholder="e.g. 4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                </div>
              </div>
            </div>
            {/* Operating Assumptions */}
            <div className="mb-8 p-4 rounded-lg border  border-slate-200 bg-slate-50">
              <h3 className="text-lg font-semibold  text-slate-800 mb-4 flex items-center gap-2">Operating Assumptions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="vacancy_rate" className="block text-sm font-medium text-gray-700 mb-1">
                    Vacancy Rate (%)
                  </label>
                  <input
                    id="vacancy_rate"
                    type="text"
                    name="assumptions.operating.vacancy_rate"
                    value={formData.assumptions?.operating?.vacancy_rate ?? ''}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. 3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]"
                  />
                </div>
                <div>
                  <label htmlFor="management_fee" className="block text-sm font-medium text-gray-700 mb-1">
                    Management Fee (%)
                  </label>
                  <input
                    id="management_fee"
                    type="text"
                    name="assumptions.operating.management_fee"
                    value={formData.assumptions?.operating?.management_fee ?? ''}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. 4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]"
                  />
                </div>

              </div>
            </div>
          </div>

          {/* Cash Flow Historical Data Inputs (Year 0, T12, Pro Forma Yr 1) */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-700 mb-6">Cash Flow Historical Data Inputs</h2>
              <p className="text-slate-500 mb-6">Enter historical and pro forma (Year 1) cash flow data. Default values are 0.</p>
              {/* Example table structure, you may want to refactor for dynamic categories */}
              <div
                className="overflow-x-auto rounded-lg shadow-sm border border-slate-200"
                onPaste={e => {
                  // Find the input that triggered the paste
                  const active = document.activeElement;
                  if (!active || !active.getAttribute) return;
                  const name = active.getAttribute('name');
                  // name should be like cashFlows.year_0.baseRent
                  const match = name && name.match(/^cashFlows\.(year_0|t12|pro_forma_yr1)\.(\w+)$/);
                  if (!match) return;
                  const startCol = ['year_0', 't12', 'pro_forma_yr1'].indexOf(match[1]);
                  const categories = [
                    'baseRent',
                    'recoveryIncome',
                    'otherIncome',
                    'rentAbatement',
                    'vacancyAmount',
                    'marketing',
                    'administrative',
                    'utilities',
                    'payroll',
                    'repairAndMaintenance',
                    'mgmtOfEGR',
                    'insurance',
                    'taxes',
                  ];
                  const startRow = categories.indexOf(match[2]);
                  if (startCol === -1 || startRow === -1) return;
                  const clipboard = e.clipboardData.getData('text');
                  const rows = clipboard.trim().split(/\r?\n/);
                  // Enhanced sanitize: remove commas, trim, and strip non-numeric except . and -
                  const sanitize = (val) => {
                    if (!val) return '';
                    // Remove commas, trim, then remove all except digits, dot, minus
                    return val.replace(/,/g, '').trim().replace(/[^0-9.\-]/g, '');
                  };
                  if (rows.length > 0) {
                    const newCashFlows = { ...formData.cashFlows };
                    rows.forEach((row, i) => {
                      const rowIdx = startRow + i;
                      if (rowIdx >= categories.length) return;
                      const cols = row.split('\t');
                      for (let j = 0; j < cols.length && (startCol + j) < 3; j++) {
                        const colIdx = startCol + j;
                        const key = categories[rowIdx];
                        const val = sanitize(cols[j]);
                        if (colIdx === 0 && newCashFlows.year_0 && key in newCashFlows.year_0) newCashFlows.year_0[key] = val;
                        if (colIdx === 1 && newCashFlows.t12 && key in newCashFlows.t12) newCashFlows.t12[key] = val;
                        if (colIdx === 2 && newCashFlows.pro_forma_yr1 && key in newCashFlows.pro_forma_yr1) newCashFlows.pro_forma_yr1[key] = val;
                      }
                    });
                    setFormData(prev => ({ ...prev, cashFlows: newCashFlows }));
                    e.preventDefault();
                  }
                }}
              >
                <table className="w-full text-sm text-left text-slate-700">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-100">
                    <tr>
                      <th scope="col" className="px-4 py-3 sticky left-0 bg-slate-100 z-10 w-48">Category</th>
                      <th scope="col" className="px-4 py-3 text-center w-32">Year 0</th>
                      <th scope="col" className="px-4 py-3 text-center w-32">T12</th>
                      <th scope="col" className="px-4 py-3 text-center w-32">Pro Forma (Yr 1)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {[
                      { key: 'baseRent', label: '+ Base Rent ($)' },
                      { key: 'recoveryIncome', label: ' + Recovery Income ($)' },
                      { key: 'otherIncome', label: '+ Other Income ($)' },
                      { key: 'rentAbatement', label: '- Rent Abatement ($)' },
                      { key: 'vacancyAmount', label: '- Vacancy Amount ($)' },
                      { key: 'marketing', label: '- Marketing ($)' },
                      { key: 'administrative', label: '- Administrative ($)' },
                      { key: 'utilities', label: '- Utilities ($)' },
                      { key: 'payroll', label: '- Payroll ($)' },
                      { key: 'repairAndMaintenance', label: '- Repair & Maintenance ($)' },
                      { key: 'mgmtOfEGR', label: '- Mgmt of EGR ($)' },
                      { key: 'insurance', label: '- Insurance ($)' },
                      { key: 'taxes', label: '- Taxes ($)' },
                    ].map((category) => (
                      <tr key={category.key}>
                        <th scope="row" className="px-4 py-2 font-medium whitespace-nowrap sticky left-0 bg-white z-10">{category.label}</th>
                        <td className="px-2 py-1 text-center">
                          <input
                            type="text"
                            name={`cashFlows.year_0.${category.key}`}
                            value={formData.cashFlows?.year_0?.[category.key] ?? 0}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            placeholder="0"
                            className="w-24 p-1 border rounded-md text-center focus:ring-blue-500 focus:border-blue-500 placeholder:text-center"
                          />
                        </td>
                        <td className="px-2 py-1 text-center">
                          <input
                            type="text"
                            name={`cashFlows.t12.${category.key}`}
                            value={formData.cashFlows?.t12?.[category.key] ?? 0}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            placeholder="0"
                            className="w-24 p-1 border rounded-md text-center focus:ring-blue-500 focus:border-blue-500 placeholder:text-center"
                          />
                        </td>
                        <td className="px-2 py-1 text-center">
                          <input
                            type="text"
                            name={`cashFlows.pro_forma_yr1.${category.key}`}
                            value={formData.cashFlows?.pro_forma_yr1?.[category.key] ?? 0}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            placeholder="0"
                            className="w-24 p-1 border rounded-md text-center focus:ring-blue-500 focus:border-blue-500 placeholder:text-center"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Tenant Information Section */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-700 mb-6">Tenant Profile</h2>
              <p className="text-slate-500 mb-6">
                Enter tenant profiles for all years, including T12 and Pro Forma. Default values are 0.
              </p>

              <div
                className="overflow-x-auto rounded-lg shadow-sm border border-slate-200"
                onPaste={e => {
                  const active = document.activeElement;
                  if (!active || !active.getAttribute) return;
                  const name = active.getAttribute('name');

                  // This regex is now more flexible to match any year key, not just year_1 through year_15
                  const match = name && name.match(/^tenantInfo\.([a-zA-Z0-9_]+)\.(\w+)$/);
                  if (!match) return;

                  const startYearKey = match[1]; // e.g., 'year_0', 't12', 'pro_forma_yr1', or 'year_1'
                  const startCategory = match[2];

                  const categories = [
                    'rentAbatement',
                    'otherAdjustments',
                    'tenant_improvements',
                    'leasing_commissions',
                    'capital_reserves',
                    'misc_capex'
                  ];

                  const startRow = categories.indexOf(startCategory);

                  // Validate that the starting category is one of the recognized categories
                  if (startRow === -1) return;

                  const clipboard = e.clipboardData.getData('text');
                  const rows = clipboard.trim().split(/\r?\n/);

                  // Sanitize function remains the same
                  const sanitize = (val) => {
                    if (!val) return '';
                    return String(val).replace(/,/g, '').trim().replace(/[^0-9.\-]/g, '');
                  };

                  if (rows.length > 0) {
                    e.preventDefault();
                    const newTenantInfo = { ...formData.tenantInfo };
                    // Get all year keys dynamically to handle new columns like 'year_0' and 't12'
                    const allYearKeys = Object.keys(newTenantInfo);
                    const startYearIndex = allYearKeys.indexOf(startYearKey);

                    rows.forEach((row, i) => {
                      const currentRowIndex = startRow + i;
                      if (currentRowIndex >= categories.length) return;

                      const cols = row.split('\t');
                      cols.forEach((col, j) => {
                        const currentYearIndex = startYearIndex + j;
                        // Ensure we stay within the available years
                        if (currentYearIndex >= allYearKeys.length) return;

                        const yearKey = allYearKeys[currentYearIndex];
                        const categoryKey = categories[currentRowIndex];

                        // Ensure the year object exists
                        if (!newTenantInfo[yearKey]) {
                          newTenantInfo[yearKey] = {};
                        }
                        newTenantInfo[yearKey][categoryKey] = sanitize(col);
                      });
                    });

                    setFormData(prev => ({ ...prev, tenantInfo: newTenantInfo }));
                  }
                }}
              >
                <table className="w-full text-sm text-left text-slate-700">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-100">
                    <tr>
                      <th scope="col" className="px-4 py-3 sticky left-0 bg-slate-100 z-10">Category</th>
                      {/* Dynamically generate headers from the object keys */}
                      {Object.keys(formData.tenantInfo).map(yearKey => (
                        <th key={yearKey} scope="col" className="px-4 py-3 text-center">
                          {/* Format the key for display, e.g., 'year_1' -> 'Year 1', 't12' -> 'T12' */}
                          {yearKey.replace(/_/g, ' ').toUpperCase()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {[
                      { name: 'rentAbatement', label: '- Rent Abatement ($)' },
                      { name: 'otherAdjustments', label: '+/- Other Adjustments ($)' },
                      { name: 'tenant_improvements', label: '- Tenant Improvements ($)' },
                      { name: 'leasing_commissions', label: '- Leasing Commissions ($)' },
                      { name: 'capital_reserves', label: '- CapEx Reserves ($)' },
                      { name: 'misc_capex', label: '- Misc. CapEx ($)' }
                    ].map(category => (
                      <tr key={category.name}>
                        <th scope="row" className="px-4 py-2 font-medium text-slate-900 whitespace-nowrap sticky left-0 bg-white z-10">
                          {category.label}
                        </th>
                        {/* Dynamically generate data cells for each year */}
                        {Object.keys(formData.tenantInfo).map(yearKey => (
                          <td key={`${category.name}-${yearKey}`} className="px-2 py-1 text-center">
                            <input
                              id={`tenantInfo.${yearKey}.${category.name}`}
                              type="text"
                              name={`tenantInfo.${yearKey}.${category.name}`}
                              // Value is accessed dynamically using the year key
                              value={formData.tenantInfo?.[yearKey]?.[category.name] ?? ''}
                              onChange={handleChange}
                              onKeyDown={handleKeyDown}
                              placeholder="0"
                              className="w-20 p-1 border rounded-md text-center focus:ring-blue-500 focus:border-blue-500 placeholder:text-center"
                              data-type="number"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>



          {/* Annual Projections Section */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-700 mb-6">Annual Projections</h2>
              <p className="text-slate-500 mb-6">Enter annual growth rates for up to 15 years. Default values are 0%.</p>

              <div
                className="overflow-x-auto rounded-lg shadow-sm border border-slate-200"
                onPaste={e => {
                  const active = document.activeElement;
                  if (!active || !active.getAttribute) return;
                  const name = active.getAttribute('name');

                  // The name format is now growthRates.year_X.categoryName (e.g., growthRates.year_1.vacancyGrowthRate)
                  const match = name && name.match(/^growthRates\.year_(\d+)\.(\w+)$/);
                  if (!match) return;

                  const startYearIndex = parseInt(match[1], 10);      // Extracts the year index (e.g., '1')
                  const startCategoryKey = match[2];                 // Extracts the category key (e.g., 'vacancyGrowthRate')

                  const categories = [ // This array defines the display order of categories in the table
                    'vacancyGrowthRate',
                    'incomeGrowthRate',
                    'opexGrowthExcludingTaxesRate',
                    'propertyTaxGrowthRate',
                    'capExGrowthRate',
                    'propertyManagementFeeRate',
                  ];

                  // Determine the starting row index based on the category of the active input
                  const startRowIndex = categories.indexOf(startCategoryKey);

                  // Validate extracted indices: startYearIndex should be between 1 and 15
                  if (startRowIndex === -1 || isNaN(startYearIndex) || startYearIndex < 1 || startYearIndex > 15) return; // Corrected validation

                  const clipboard = e.clipboardData.getData('text');
                  const rows = clipboard.trim().split(/\r?\n/);

                  const sanitize = (val) => {
                    if (!val) return '';
                    // Remove commas, trim, then remove all except digits, dot, minus
                    return val.replace(/,/g, '').trim().replace(/[^0-9.\-]/g, '');
                  };

                  if (rows.length > 0) {
                    // Create a shallow copy of growthRates to begin modifications
                    const newGrowthRates = { ...formData.growthRates };

                    rows.forEach((row, i) => { // 'i' is the vertical offset (row) from the starting cell
                      const currentRowCategoryIndex = startRowIndex + i;
                      if (currentRowCategoryIndex >= categories.length) return; // Ensure we stay within defined categories

                      const currentCategoryKey = categories[currentRowCategoryIndex]; // The category for the current row of pasted data

                      const cols = row.split('\t');
                      for (let j = 0; j < cols.length; j++) { // Corrected: j starts from 0
                        const currentYearAbsoluteIndex = startYearIndex + j; // startYearIndex is 1-indexed, j is 0-indexed offset
                        // Ensure we stay within the 15 years displayed by the table (Year 1 to Year 15)
                        if (currentYearAbsoluteIndex > 15) continue; // Corrected: max year is 15

                        const yearKey = `year_${currentYearAbsoluteIndex}`; // e.g., year_1, year_2

                        // Ensure the year object exists within newGrowthRates, initializing if necessary
                        if (!newGrowthRates[yearKey]) {
                          newGrowthRates[yearKey] = {};
                        }
                        // Assign the sanitized value to the correct category property within the year object
                        newGrowthRates[yearKey][currentCategoryKey] = sanitize(cols[j]);
                      }
                    });

                    setFormData(prev => ({ ...prev, growthRates: newGrowthRates }));
                    e.preventDefault();
                  }
                }}
              >
                <table className="w-full text-sm text-left text-slate-700">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-100">
                    <tr>
                      <th scope="col" className="px-4 py-3 sticky left-0 bg-slate-100 z-10">Category</th>
                      {Array.from({ length: 15 }, (_, yearIndex) => ( // yearIndex 0-14
                        <th key={yearIndex} scope="col" className="px-4 py-3 text-center">Year {yearIndex + 1}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {[
                      { name: 'vacancyGrowthRate', label: 'Vacancy Growth Rate (%)' },
                      { name: 'incomeGrowthRate', label: 'Income Growth Rate (%)' },
                      { name: 'opexGrowthExcludingTaxesRate', label: 'Opex Growth Excl. Taxes Rate (%)' },
                      { name: 'propertyTaxGrowthRate', label: 'Property Tax Growth Rate (%)' },
                      { name: 'capExGrowthRate', label: 'CapEx Growth Rate (%)' },
                      { name: 'propertyManagementFeeRate', label: 'Property Mgmt Fee Rate (%)' }
                    ].map(category => (
                      <tr key={category.name}>
                        <th scope="row" className="px-4 py-2 font-medium text-slate-900 whitespace-nowrap sticky left-0 bg-white z-10">
                          {category.label}
                        </th>
                        {Array.from({ length: 15 }, (_, yearIndex) => ( // 'yearIndex' here represents the year (0-14)
                          <td key={`${category.name}-${yearIndex}`} className="px-2 py-1 text-center">
                            <input
                              // Update ID and Name to match the new structure: growthRates.year_X.categoryName (X is 1-15)
                              id={`growthRates.year_${yearIndex + 1}.${category.name}`} // Corrected: yearIndex + 1
                              type="text"
                              name={`growthRates.year_${yearIndex + 1}.${category.name}`} // Corrected: yearIndex + 1
                              // Update Value access to match the new structure (X is 1-15)
                              value={formData.growthRates?.[`year_${yearIndex + 1}`]?.[category.name] ?? ''} // Corrected: yearIndex + 1
                              onChange={handleChange}
                              onKeyDown={handleKeyDown}
                              placeholder="0"
                              className="w-20 p-1 border rounded-md text-center focus:ring-blue-500 focus:border-blue-500 placeholder:text-center"
                              data-type="number"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Error display for growth rates */}
              {errors.growthRates && Object.keys(errors.growthRates).length > 0 && (
                <div className="mt-2 text-red-500 text-xs">
                  {Object.values(errors.growthRates).map((errorMsg, idx) => (
                    <p key={idx}>{errorMsg as string}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Notes</h2>
              <div>
                <textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  value={formData.additionalNotes ?? ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]"
                  placeholder="Enter any additional information about the property..."
                ></textarea>
              </div>
            </div>

            {/* API Error Display */}
            {apiError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
                <strong>Error:</strong> {apiError}
              </div>
            )}


          </div>
          <div className="flex justify-between items-center mt-10">
            <Link
              href="/operations-dashboard/properties/add/page2/"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back to Documents
            </Link>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={createPropertyDetailsMutation.isPending}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0066cc] hover:bg-[#0055aa] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createPropertyDetailsMutation.isPending ? 'Saving...' : 'Next: Unit Level Details'}
            </button>
          </div>

        </form>
      </div>
    </div>
    // </div>
  )
}
