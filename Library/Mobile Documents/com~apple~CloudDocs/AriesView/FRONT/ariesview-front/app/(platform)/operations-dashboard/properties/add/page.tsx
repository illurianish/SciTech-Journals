// FIRST TAB OF THE ADD PROPERTIES FORM (PROPERTY OVERVIEW)

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePropertyForm } from './PropertyFormContext'
import type { Document, PropertyData } from './PropertyFormContext'
import { useAddProperty } from '@/app/rest'


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
    square_footage: '', // fixed, net rentable area (sf)
    psf: '', // fixed, replacement cost (psf)
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
      loan_to_value: '', // fixed, ltv
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



export default function PropertyOverviewPage() {
  const router = useRouter()
  const { state: contextState, dispatch } = usePropertyForm()
  const [isDragging, setIsDragging] = useState(false)
  const [errors, setErrors] = useState<Partial<PropertyData>>({});
  const { propertyData, propertyId } = contextState
  
  // Use the useAddProperty hook
  const addPropertyMutation = useAddProperty()
  


  // Local state for the tag input field
  const [currentTag, setCurrentTag] = useState('');

  // Basic Information section moved to here
  // Initialize form state from context or use initialFormData

  const [formData, setFormData] = useState<Partial<PropertyData>>(
    contextState.propertyData || initialFormData
  );

  // Update local state if context changes (e.g., navigating back)
  useEffect(() => {
    if (contextState.propertyData) {
      setFormData(contextState.propertyData);
    }
  }, [contextState.propertyData]);

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

  // Tag functions updated for nested structure
  const addTag = () => {
    const trimmedTag = currentTag.trim();
    if (!trimmedTag) return;
    const tags = formData.propertySummary?.tags || [];
    if (!tags.includes(trimmedTag)) {
      const updatedTags = [...tags, trimmedTag];
      const updatedData = {
        ...formData,
        basicInformation: {
          ...formData.basicInformation,
          tags: updatedTags,
        },
      };
      setFormData(updatedData);
      dispatch({ type: 'SET_PROPERTY_DATA', payload: updatedData });
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const tags = formData.basicInformation?.tags || [];
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    const updatedData = {
      ...formData,
      basicInformation: {
        ...formData.basicInformation,
        tags: updatedTags,
      },
    };
    setFormData(updatedData);
    dispatch({ type: 'SET_PROPERTY_DATA', payload: updatedData });
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PropertyData> = {};
    newErrors.basicInformation = {};

    // Basic Information
    if (!formData.basicInformation.name?.trim()) newErrors.basicInformation.name = 'Property name is required';
    if (!formData.basicInformation.propertyType) newErrors.basicInformation.propertyType = 'Property type is required';
    if (!formData.basicInformation.status) newErrors.basicInformation.status = 'Property status is required';
    if (!formData.basicInformation.address?.trim()) newErrors.basicInformation.address = 'Address is required';
    if (!formData.basicInformation.city?.trim()) newErrors.basicInformation.city = 'City is required';
    if (!formData.basicInformation.state?.trim()) newErrors.basicInformation.state = 'State is required';
    if (!formData.basicInformation.zipcode?.trim()) newErrors.basicInformation.zipcode = 'ZIP code is required';


    if (Object.keys(newErrors.basicInformation).length === 0) {
      delete newErrors.basicInformation;
    }

    // REMOVE BEFORE PRODUCTION
    console.log("newerrors: ", newErrors)

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop if validation fails
    }

    // Prepare data for backend
    const propertyData = contextState.propertyData || initialFormData;
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

    try {
      const result = await addPropertyMutation.mutateAsync(payload);
      
      if (result.success && result.propertyId) {
        // Property was created successfully, dispatch ID to context
        dispatch({ type: 'SET_PROPERTY_ID', payload: result.propertyId });
        
        // Move to the next step in the wizard
        console.log(`Property created with ID: ${result.propertyId}. Moving to documents step.`);
        router.push(`/operations-dashboard/properties/add/page2`);
      } else {
        throw new Error(result.error || result.message || 'Failed to add property. Invalid response from server.');
      }
    } catch (err) {
      console.error('Failed to add property:', err);
      // The mutation will handle the error state automatically
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-[#0066cc]">Upload Documents</h1>
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
                <div className="w-10 h-10 rounded-full bg-[#0066cc] text-white flex items-center justify-center font-bold">1</div>
                <div className="mt-2 text-sm font-medium text-[#0066cc]">Property Overview</div>
              </div>
              <div className="flex-grow h-0.5 bg-gray-200 mx-4"></div>
              <div className="relative flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold">2</div>
                <div className="mt-2 text-sm font-medium text-gray-500">Upload Documents</div>
              </div>
              <div className="flex-grow h-0.5 bg-gray-200 mx-4"></div>
              <div className="relative flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold">3</div>
                <div className="mt-2 text-sm font-medium text-gray-500">Property Details</div>
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

        {/* Property Status Section */}
        <div className="mb-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Property Status*</h2>
          <p className="text-sm text-gray-600 mb-4">Is this a new property under evaluation, an existing property you already own, or one marked for liquidation?</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-all ${formData.basicInformation?.status === 'evaluation'
                ? 'border-[#0066cc] bg-blue-50 shadow-sm'
                : 'border-gray-200 hover:border-gray-300'
                }`}
              onClick={() => handleChange({ target: { name: 'basicInformation.status', value: 'evaluation' } } as any)}
            >
              <div className="flex items-start mb-2">
                <input
                  type="radio"
                  id="statusEvaluation"
                  name="basicInformation.status"
                  value="evaluation"
                  checked={formData.basicInformation?.status === 'evaluation'}
                  onChange={handleChange}
                  className="mt-1 mr-2 flex-shrink-0"
                />
                <div>
                  <label htmlFor="statusEvaluation" className="font-medium text-gray-800 block mb-1">
                    New Property for Evaluation
                  </label>
                  <p className="text-sm text-gray-600">
                    This property is being considered for potential investment
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`border rounded-lg p-4 cursor-pointer transition-all ${formData.basicInformation?.status === 'owned'
                ? 'border-[#0066cc] bg-blue-50 shadow-sm'
                : 'border-gray-200 hover:border-gray-300'
                }`}
              onClick={() => handleChange({ target: { name: 'basicInformation.status', value: 'owned' } } as any)}
            >
              <div className="flex items-start mb-2">
                <input
                  type="radio"
                  id="statusOwned"
                  name="basicInformation.status"
                  value="owned"
                  checked={formData.basicInformation?.status === 'owned'}
                  onChange={handleChange}
                  className="mt-1 mr-2 flex-shrink-0"
                />
                <div>
                  <label htmlFor="statusOwned" className="font-medium text-gray-800 block mb-1">
                    Existing Owned Property
                  </label>
                  <p className="text-sm text-gray-600">
                    This property is already part of your portfolio
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`border rounded-lg p-4 cursor-pointer transition-all ${formData.basicInformation?.status === 'liquidation'
                ? 'border-[#0066cc] bg-blue-50 shadow-sm'
                : 'border-gray-200 hover:border-gray-300'
                }`}
              onClick={() => handleChange({ target: { name: 'basicInformation.status', value: 'liquidation' } } as any)}
            >
              <div className="flex items-start mb-2">
                <input
                  type="radio"
                  id="statusLiquidation"
                  name="basicInformation.status"
                  value="liquidation"
                  checked={formData.basicInformation?.status === 'liquidation'}
                  onChange={handleChange}
                  className="mt-1 mr-2 flex-shrink-0"
                />
                <div>
                  <label htmlFor="statusLiquidation" className="font-medium text-gray-800 block mb-1">
                    For Disposition
                  </label>
                  <p className="text-sm text-gray-600">
                    This property is marked for disposition/sale
                  </p>
                </div>
              </div>
            </div>
          </div>
          {errors.basicInformation?.status && <p className="mt-2 text-sm text-red-600">{errors.basicInformation.status}</p>}
        </div>

        {/* Basic Information */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Property Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="basicInformation.name"
                  value={formData.basicInformation?.name ?? ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.basicInformation?.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]`}
                  placeholder="e.g. Oakwood Apartments"
                />
                {errors.basicInformation?.name && <p className="mt-1 text-sm text-red-600">{errors.basicInformation.name}</p>}
              </div>
              <div>
                <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type*
                </label>
                <select
                  id="propertyType"
                  name="basicInformation.propertyType"
                  value={formData.basicInformation?.propertyType ?? ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.basicInformation?.propertyType ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]`}
                >
                  <option value="">Select property type</option>
                  <option value="Multifamily">Multifamily</option>
                  <option value="Office">Office</option>
                  <option value="Retail">Retail</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Mixed-Use">Mixed-Use</option>
                  <option value="Other">Other</option>
                </select>
                {errors.basicInformation?.propertyType && <p className="mt-1 text-sm text-red-600">{errors.basicInformation.propertyType}</p>}
              </div>

              {/* Portfolio/Folder Selection */}
              <div className="md:col-span-2">
                <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700 mb-1">
                  Add to Portfolio/Fund
                </label>
                <select
                  id="portfolio"
                  name="basicInformation.fund"
                  value={formData.basicInformation?.fund ?? ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]"
                >
                  <option value="">Select portfolio or fund</option>
                  <option value="AriesView Fund I">AriesView Fund I</option>
                  <option value="create">+ Create New Fund</option>
                </select>
              </div>

              {/* Tags */}
              <div className="md:col-span-2">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (For grouping and filtering)
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="tags"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    className="w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]"
                    placeholder="Add tags (e.g., high-value, renovated, core)"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300"
                  >
                    Add
                  </button>
                </div>
                {formData.basicInformation?.tags && formData.basicInformation.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.basicInformation.tags?.map((tag, index) => (
                      <div key={index} className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Address */}
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address*
                </label>
                <input
                  type="text"
                  id="address"
                  name="basicInformation.address"
                  value={formData.basicInformation?.address ?? ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.basicInformation?.address ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]`}
                  placeholder="e.g. 123 Main Street"
                />
                {errors.basicInformation?.address && <p className="mt-1 text-sm text-red-600">{errors.basicInformation.address}</p>}
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City*
                </label>
                <input
                  type="text"
                  id="city"
                  name="basicInformation.city"
                  value={formData.basicInformation?.city ?? ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.basicInformation?.city ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]`}
                  placeholder="e.g. San Francisco"
                />
                {errors.basicInformation?.city && <p className="mt-1 text-sm text-red-600">{errors.basicInformation.city}</p>}
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  State*
                </label>
                <input
                  type="text"
                  id="state"
                  name="basicInformation.state"
                  value={formData.basicInformation?.state ?? ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.basicInformation?.state ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]`}
                  placeholder="e.g. CA"
                />
                {errors.basicInformation?.state && <p className="mt-1 text-sm text-red-600">{errors.basicInformation.state}</p>}
              </div>
              <div>
                <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code*
                </label>
                <input
                  type="text"
                  id="zipcode"
                  name="basicInformation.zipcode"
                  value={formData.basicInformation?.zipcode ?? ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.basicInformation?.zip ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]`}
                  placeholder="e.g. 94105"
                />
                {errors.basicInformation?.zip && <p className="mt-1 text-sm text-red-600">{errors.basicInformation.zip}</p>}
              </div>

            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Property Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="year_built" className="block text-sm font-medium text-gray-700 mb-1">
                  Year Built
                </label>
                <input
                  type="text"
                  id="year_built"
                  name="propertyDetails.year_built"
                  value={formData.propertyDetails?.year_built ?? ''}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className={`w-full px-3 py-2 border ${errors.propertyDetails?.year_built ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]`}
                  placeholder="e.g. 2005"
                />
                {errors.propertyDetails?.year_built && <p className="mt-1 text-sm text-red-600">{errors.propertyDetails.year_built}</p>}
              </div>
              <div>
                <label htmlFor="square_footage" className="block text-sm font-medium text-gray-700 mb-1">
                  Net Rentable Area (SF)
                </label>
                <input
                  type="text"
                  id="square_footage"
                  name="propertyDetails.square_footage"
                  value={formData.propertyDetails?.square_footage ?? ''}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className={`w-full px-3 py-2 border ${errors.propertyDetails?.square_footage ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]`}
                  placeholder="e.g. 50000 "
                />
                {errors.propertyDetails?.square_footage && <p className="mt-1 text-sm text-red-600">{errors.propertyDetails.sf}</p>}
              </div>
              <div>
                <label htmlFor="psf" className="block text-sm font-medium text-gray-700 mb-1">
                  Replacement Cost (PSF)
                </label>
                <input
                  type="text"
                  id="psf"
                  name="propertyDetails.psf"
                  value={formData.propertyDetails?.psf ?? ''}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className={`w-full px-3 py-2 border ${errors.propertyDetails?.psf ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]`}
                  placeholder="e.g. 400 "
                />
                {errors.propertyDetails?.square_footage && <p className="mt-1 text-sm text-red-600">{errors.propertyDetails.sf}</p>}
              </div>
              <div>
                <label htmlFor="area_unit" className="block text-sm font-medium text-gray-700 mb-1">
                  Area Unit
                </label>
                <input
                  type="text"
                  id="area_unit"
                  name="propertyDetails.area_unit"
                  value={formData.propertyDetails?.area_unit ?? ''}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className={`w-full px-3 py-2 border ${errors.propertyDetails?.area_unit ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]`}
                  placeholder="e.g. 50"
                />
                {errors.propertyDetails?.area_unit && <p className="mt-1 text-sm text-red-600">{errors.propertyDetails.area_unit}</p>}
              </div>
              <div>
                <label htmlFor="units" className="block text-sm font-medium text-gray-700 mb-1">
                  # of Units
                </label>
                <input
                  type="text"
                  id="units"
                  name="propertyDetails.units"
                  value={formData.propertyDetails?.units ?? ''}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className={`w-full px-3 py-2 border ${errors.propertyDetails?.units ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]`}
                  placeholder="e.g. 50"
                />
                {errors.propertyDetails?.units && <p className="mt-1 text-sm text-red-600">{errors.propertyDetails.units}</p>}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="landlord_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Landlord Name
                </label>
                <input
                  type="text"
                  id="landlord_name"
                  name="propertyDetails.landlord_name"
                  value={formData.propertyDetails?.landlord_name ?? ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.propertyDetails?.landlord_name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]`}
                  placeholder="e.g. John Doe LLC"
                />
                {errors.propertyDetails?.landlord_name && <p className="mt-1 text-sm text-red-600">{errors.propertyDetails.landlord_name}</p>}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="landlord_address" className="block text-sm font-medium text-gray-700 mb-1">
                  Landlord Address
                </label>
                <input
                  type="text"
                  id="landlord_address"
                  name="propertyDetails.landlord_address"
                  value={formData.propertyDetails?.landlord_address ?? ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.propertyDetails?.landlord_address ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]`}
                  placeholder="e.g. 456 Oak Avenue, San Francisco, CA 94105"
                />
                {errors.propertyDetails?.landlord_name && <p className="mt-1 text-sm text-red-600">{errors.propertyDetails.landlord_name}</p>}
              </div>
            </div>

          </div>
        </div>

        {/* Parking Wide Facilities and Insurance Maintenance */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Property Wide Facilities & Insurance Maintenance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="parking_facilities_description" className="block text-sm font-medium text-gray-700 mb-1">
                  Parking Facilities Description
                </label>
                <textarea
                  id="parking_facilities_description"
                  name="propertyWideFacilitiesInsuranceMaintenance.parking_facilities_description"
                  value={formData.propertyWideFacilitiesInsuranceMaintenance?.parking_facilities_description ?? ''}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-3 py-2 border ${errors.propertyWideFacilitiesInsuranceMaintenance?.parking_facilities_description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]`}
                  placeholder="e.g. On-site parking lot, underground garage, street parking"
                />
                {errors.propertyWideFacilitiesInsuranceMaintenance?.parking_facilities_description && <p className="mt-1 text-sm text-red-600">{errors.propertyWideFacilitiesInsuranceMaintenance.parking_facilities_description}</p>}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="landlord_repairs_facilities" className="block text-sm font-medium text-gray-700 mb-1">
                  Landlord's General Repair Duties
                </label>
                <textarea
                  id="landlord_repairs_facilities"
                  name="propertyWideFacilitiesInsuranceMaintenance.landlord_repairs_facilities"
                  value={formData.propertyWideFacilitiesInsuranceMaintenance?.landlord_repairs_facilities ?? ''}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-3 py-2 border ${errors.propertyWideFacilitiesInsuranceMaintenance?.landlord_repairs_facilities ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]`}
                  placeholder="e.g. Responsible roof, structural components, common areas"
                />
                {errors.propertyWideFacilitiesInsuranceMaintenance?.landlord_repairs_facilities && <p className="mt-1 text-sm text-red-600">{errors.propertyWideFacilitiesInsuranceMaintenance.landlord_repairs_facilities}</p>}
              </div>
              <div>
                <label htmlFor="landlord_insurance" className="block text-sm font-medium text-gray-700 mb-1">Landlord's Insurance Policies</label>
                <div className="flex flex-col items-start justify-center gap-1" id="landlord_insurance">
                  {[
                    'General Liability',
                    'Commercial Property',
                    'Business Interruption',
                    'Excess Liability',
                    'Comprehensive',
                  ].map((policy) => (
                    <label key={policy} className="flex flex-row text-gray-700">
                      <input
                        className="my-1 mx-2 block text-sm font-medium text-[#0066cc] mb-1 rounded-sm checked:bg-[#0066cc] border-gray-700"
                        type="checkbox"
                        name="propertyWideFacilitiesInsuranceMaintenance.landlord_insurance"
                        value={policy}
                        checked={Array.isArray(formData.propertyWideFacilitiesInsuranceMaintenance?.landlord_insurance)
                          ? formData.propertyWideFacilitiesInsuranceMaintenance.landlord_insurance.includes(policy)
                          : formData.propertyWideFacilitiesInsuranceMaintenance?.landlord_insurance === policy}
                        onChange={(e) => {
                          let newValue;
                          if (Array.isArray(formData.propertyWideFacilitiesInsuranceMaintenance?.landlord_insurance)) {
                            if (e.target.checked) {
                              newValue = [...formData.propertyWideFacilitiesInsuranceMaintenance.landlord_insurance, policy];
                            } else {
                              newValue = formData.propertyWideFacilitiesInsuranceMaintenance.landlord_insurance.filter((p) => p !== policy);
                            }
                          } else {
                            newValue = e.target.checked ? [policy] : [];
                          }
                          const updated = {
                            ...formData,
                            propertyWideFacilitiesInsuranceMaintenance: {
                              ...formData.propertyWideFacilitiesInsuranceMaintenance,
                              landlord_insurance: newValue,
                            },
                          };
                          setFormData(updated);
                          dispatch({ type: 'SET_PROPERTY_DATA', payload: updated });
                        }}
                      />
                      {policy}
                    </label>
                  ))}
                </div>
                {errors.propertyWideFacilitiesInsuranceMaintenance?.landlord_insurance && <p className="mt-1 text-sm text-red-600">{errors.propertyWideFacilitiesInsuranceMaintenance?.landlord_insurance}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {addPropertyMutation.error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg" role="alert">
            <p><span className="font-bold">Error:</span> {addPropertyMutation.error.message}</p>
          </div>
        )}

        <div className="flex justify-between items-center mt-10">
          <Link
            href="/operations-dashboard"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </Link>

          <button
            type="button"
            disabled={addPropertyMutation.isPending}
            onClick={handleSubmit}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0066cc] hover:bg-[#0055aa] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addPropertyMutation.isPending ? 'Saving...' : 'Save and Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}
