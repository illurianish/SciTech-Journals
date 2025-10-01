"use client";

import React, { useEffect, useState } from "react";
import {
  useFinancialAssumptions,
  useUpdateFinancialAssumptions,
  useImportFinancialData,
  formatDateForInputAssumptions,
  validateFinancialAssumptions,
  defaultFinancialAssumptions,
  type FinancialAssumptions,
  type AssumptionsFormData,
} from "@/app/rest/assumptionstab";

/* ---------- small building blocks ---------- */

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <section className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
      {title}
    </h3>
    {children}
  </section>
);

const Field: React.FC<{
  label: string | React.ReactNode;
  name: string;
  type?: "text" | "number" | "date";
  value: any;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  placeholder?: string;
  right?: React.ReactNode;
}> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  right,
}) => (
  <div className="relative">
    <label className="block text-xs font-medium text-gray-500 mb-1">
      {label}
    </label>
    <input
      name={name}
      type={type}
      value={value ?? ""}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 border rounded focus:ring-blue-500 focus:border-blue-500 text-black"
    />
    {right}
  </div>
);

/* === Import button (matches screenshot) === */
const ImportDataButton: React.FC<{ onClick?: () => void; isLoading?: boolean }> = ({ onClick, isLoading }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={isLoading}
    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg shadow"
  >
    {isLoading ? 'Importing...' : 'Import Data'}
  </button>
);

/* ---------- component ---------- */

interface AssumptionsTabProps {
  propertyId: string;
}

const AssumptionsTab: React.FC<AssumptionsTabProps> = ({ propertyId }) => {
  const [fields, setFields] = useState<AssumptionsFormData>(defaultFinancialAssumptions);

  // Use the new hooks
  const { 
    data: assumptionsData, 
    isLoading, 
    error 
  } = useFinancialAssumptions(propertyId);
  
  const updateAssumptionsMutation = useUpdateFinancialAssumptions();
  const importDataMutation = useImportFinancialData();

  // Initialize fields when data loads
  useEffect(() => {
    if (assumptionsData) {
      setFields((prev) => ({ ...prev, ...assumptionsData }));
    }
  }, [assumptionsData]);

  // Debug logging
  console.log('AssumptionsTab - fields:', fields);
  console.log('AssumptionsTab - assumptionsData:', assumptionsData);
  console.log('AssumptionsTab - isLoading:', isLoading);
  console.log('AssumptionsTab - error:', error);

  // Ensure we have fields data, fallback to defaults if needed
  const displayFields = fields || defaultFinancialAssumptions;

  const onImport = async () => {
    try {
      // This would typically involve file upload or data selection
      // For now, we'll just show an alert
      alert("Import Data clicked - this would open file upload or data selection");
      
      // Example of how the import would work:
      // await importDataMutation.mutateAsync({
      //   propertyId,
      //   importData: { /* imported data */ }
      // });
    } catch (err) {
      console.error('Error importing data:', err);
      alert('Error importing data: ' + (err as Error).message);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFields((p: any) => ({
      ...p,
      [name]:
        type === "number"
          ? value === ""
            ? ""
            : Number(value)
          : name === "analysisStart"
          ? formatDateForInputAssumptions(value) || value
          : value,
    }));
  };

  const handleSave = async () => {
    try {
             // Validate data before saving
       const errors = validateFinancialAssumptions(displayFields);
       if (errors.length > 0) {
         alert('Validation errors:\n' + errors.join('\n'));
         return;
       }

       await updateAssumptionsMutation.mutateAsync({
         propertyId,
         assumptionsData: displayFields,
       });

      alert('Assumptions saved successfully!');
    } catch (err) {
      console.error('Error saving assumptions:', err);
      alert('Error saving assumptions: ' + (err as Error).message);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading Assumptions…</div>;
  }

  return (
    <div className="space-y-6 p-1">
      {/* header row with Import button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Assumptions</h2>
        <div className="flex space-x-2">
          <ImportDataButton 
            onClick={onImport} 
            isLoading={importDataMutation.isPending}
          />
          <button
            onClick={handleSave}
            disabled={updateAssumptionsMutation.isPending}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-lg shadow"
          >
            {updateAssumptionsMutation.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded">
          Error: {error.message}
        </div>
      )}

      {/* Property Summary */}
      <Card title="Property Summary">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Field
             label="Property Name"
             name="propertyName"
             value={displayFields.propertyName}
             onChange={handleChange}
           />
           <Field
             label="Property Type"
             name="propertyType"
             value={displayFields.propertyType}
             onChange={handleChange}
           />
           <Field
             label="Status"
             name="status"
             value={displayFields.status}
             onChange={handleChange}
           />
           <Field
             label="Fund"
             name="fund"
             value={displayFields.fund}
             onChange={handleChange}
           />
           <Field
             label="Tags (comma separated)"
             name="tags"
             value={displayFields.tags}
             onChange={handleChange}
           />
           <Field
             label="Address"
             name="address"
             value={displayFields.address}
             onChange={handleChange}
           />
           <Field
             label="City"
             name="city"
             value={displayFields.city}
             onChange={handleChange}
           />
           <Field
             label="State"
             name="state"
             value={displayFields.state}
             onChange={handleChange}
           />
           <Field
             label="Zip Code"
             name="zipcode"
             value={displayFields.zipcode}
             onChange={handleChange}
           />
        </div>
      </Card>

      {/* Property Details */}
      <Card title="Property Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Field
             label="Year Built"
             name="yearBuilt"
             type="number"
             value={displayFields.yearBuilt}
             onChange={handleChange}
           />
           <Field
             label="Square Footage"
             name="squareFootage"
             type="number"
             value={displayFields.squareFootage}
             onChange={handleChange}
           />
           <Field
             label="PSF"
             name="psf"
             type="number"
             value={displayFields.psf}
             onChange={handleChange}
           />
           <Field
             label="Area Unit"
             name="areaUnit"
             value={displayFields.areaUnit}
             onChange={handleChange}
           />
           <Field
             label="Units"
             name="units"
             type="number"
             value={displayFields.units}
             onChange={handleChange}
           />
           <Field
             label="Landlord Name"
             name="landlordName"
             value={displayFields.landlordName}
             onChange={handleChange}
           />
           <Field
             label="Landlord Address"
             name="landlordAddress"
             value={displayFields.landlordAddress}
             onChange={handleChange}
           />
        </div>
      </Card>

      {/* Facilities / Insurance */}
      <Card title="Property‑Wide Facilities, Insurance & Maintenance">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Field
             label="Parking Facilities Description"
             name="parkingFacilitiesDescription"
             value={displayFields.parkingFacilitiesDescription}
             onChange={handleChange}
           />
           <Field
             label="Landlord Repairs Facilities"
             name="landlordRepairsFacilities"
             value={displayFields.landlordRepairsFacilities}
             onChange={handleChange}
           />
           <Field
             label="Landlord Insurance"
             name="landlordInsurance"
             value={displayFields.landlordInsurance}
             onChange={handleChange}
           />
        </div>
      </Card>

      {/* Zoning & Easements */}
      <Card title="Zoning and Easements">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Field
             label="Zoning Code"
             name="zoningCode"
             value={displayFields.zoningCode}
             onChange={handleChange}
           />
           <Field
             label="Easement Type"
             name="easementType"
             value={displayFields.easementType}
             onChange={handleChange}
           />
        </div>
      </Card>

      {/* Superior Interest Holders */}
      <Card title="Superior Interest Holders">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Field
             label="Number of Superior Interest Holders"
             name="numSuperiorInterestHolders"
             type="number"
             value={displayFields.numSuperiorInterestHolders}
             onChange={handleChange}
           />
           <div>
             <label className="block text-xs font-medium text-gray-500 mb-1">
               List of Superior Interest Holders
             </label>
             <textarea
               name="listSuperiorInterestHolders"
               value={displayFields.listSuperiorInterestHolders ?? ""}
               onChange={handleChange}
               rows={3}
               className="w-full px-3 py-2 border rounded focus:ring-blue-500 focus:border-blue-500 text-black"
             />
           </div>
        </div>
      </Card>

      {/* Property Financials */}
      <Card title="Property Financials and Characteristics">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Field
             label="Analysis Start"
             name="analysisStart"
             type="date"
             value={
               displayFields.analysisStart
                 ? formatDateForInputAssumptions(displayFields.analysisStart)
                 : ""
             }
             onChange={handleChange}
           />
           <Field
             label="Analysis Period"
             name="analysisPeriod"
             type="number"
             value={displayFields.analysisPeriod}
             onChange={handleChange}
           />
           <Field
             label="Exit Valuation NOI"
             name="exitValuationNOI"
             value={displayFields.exitValuationNOI}
             onChange={handleChange}
           />
           <Field
             label="Exit Cap Rate Growth/Yr"
             name="exitCapRateGrowth"
             value={displayFields.exitCapRateGrowth}
             onChange={handleChange}
           />
           <Field
             label="Market Cap Rate Yr. 1 (%)"
             name="marketCapRateYr1"
             type="number"
             value={displayFields.marketCapRateYr1}
             onChange={handleChange}
             placeholder="e.g., 6.5"
           />
           <Field
             label="Discount Rate (%)"
             name="discountRate"
             type="number"
             value={displayFields.discountRate}
             onChange={handleChange}
             placeholder="e.g., 7.5"
           />
        </div>
      </Card>

      {/* Acquisition Info */}
      <Card title="Acquisition Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Purchase Price Method
            </label>
                         <select
               name="purchasePriceMethod"
               value={displayFields.purchasePriceMethod}
               onChange={handleChange}
               className="w-full px-3 py-2 border rounded focus:ring-blue-500 focus:border-blue-500 text-black"
             >
               <option>Manual Input</option>
               <option>Auto</option>
             </select>
           </div>
           <Field
             label="Upfront CapEx ($)"
             name="upfrontCapEx"
             type="number"
             value={displayFields.upfrontCapEx}
             onChange={handleChange}
           />
           <Field
             label="Due Diligence + Closing Cost (%)"
             name="dueDiligenceClosingCost"
             type="number"
             value={displayFields.dueDiligenceClosingCost}
             onChange={handleChange}
           />
           <Field
             label="Selling Cost (at Exit) (%)"
             name="sellingCostAtExit"
             type="number"
             value={displayFields.sellingCostAtExit}
             onChange={handleChange}
           />
           <Field
             label="Set Purchase Price"
             name="setPurchasePrice"
             type="number"
             value={displayFields.setPurchasePrice}
             onChange={handleChange}
           />
        </div>
      </Card>

      {/* Financing Assumptions */}
      <Card title="Financing Assumptions">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Field
             label="Interest Rate (%)"
             name="financingInterestRate"
             type="number"
             value={displayFields.financingInterestRate}
             onChange={handleChange}
           />
           <Field
             label="Years I/O"
             name="financingYearsIO"
             type="number"
             value={displayFields.financingYearsIO}
             onChange={handleChange}
           />
           <Field
             label="Amo. Period (years)"
             name="financingAmoPeriod"
             type="number"
             value={displayFields.financingAmoPeriod}
             onChange={handleChange}
           />
           <Field
             label="Term (years)"
             name="financingTerm"
             type="number"
             value={displayFields.financingTerm}
             onChange={handleChange}
           />
           <Field
             label="LTV (%)"
             name="financingLTV"
             type="number"
             value={displayFields.financingLTV}
             onChange={handleChange}
           />
           <Field
             label="Lender Fees (%)"
             name="financingLenderFees"
             type="number"
             value={displayFields.financingLenderFees}
             onChange={handleChange}
           />
        </div>
      </Card>

      {/* Operating Assumptions */}
      <Card title="Operating Assumptions">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Field
             label="Vacancy Rate (%)"
             name="operatingVacancy"
             type="number"
             value={displayFields.operatingVacancy}
             onChange={handleChange}
           />
           <Field
             label="Management Fee (%)"
             name="managementFee"
             type="number"
             value={displayFields.managementFee}
             onChange={handleChange}
           />
        </div>
      </Card>
    </div>
  );
};

export default AssumptionsTab;
