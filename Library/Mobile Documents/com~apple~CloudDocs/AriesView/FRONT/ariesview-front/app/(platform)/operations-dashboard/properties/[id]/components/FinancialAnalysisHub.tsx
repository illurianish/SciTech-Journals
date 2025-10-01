"use client";

import React, { useState, useEffect, useCallback } from "react";
// Remove useParams import as we won't rely on it for property ID here
// import { useParams } from 'next/navigation';

// Import the selector component
// import FundPropertySelector from "./financial/FundPropertySelector";

import FundPropertySelector from "../../../../../../components/financial/FundPropertySelector";

// Import tab components (assuming they will be created)
import SummaryDashboardTab from "../../../../../../components/financial-hub-tabs/SummaryDashboardTab";
import RentRollTab from "../../../../../../components/financial-hub-tabs/RentRollTab";
import IncomeStatementTab from "../../../../../../components/financial-hub-tabs/IncomeStatementTab";
import AcquisitionModelTab from "../../../../../../components/financial-hub-tabs/AcquisitionModelTab";
import AssumptionsTab from "../../../../../../components/financial-hub-tabs/AssumptionsTab";

// Define tab names type for better type safety
type FinancialTab =
  | "Summary Dashboard"
  | "Rent Roll"
  | "Income Statement"
  | "Acquisition Model"
  | "Assumptions";

export default function FinancialAnalysisHub() {
  const [activeTab, setActiveTab] = useState<FinancialTab>("Assumptions");
  // Remove params usage
  // const params = useParams();
  // const propertyId = params?.id as string; // Assuming the property ID is in the route param `id`

  // Add state for selection
  const [selectedFundId, setSelectedFundId] = useState<string | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null
  );
  const [isCalculationsLoaded, setIsCalculationsLoaded] = useState(false);

  // Optional: Add a top-level loading state if needed, or let tabs manage their own.
  // const [isLoading, setIsLoading] = useState(false);

  // Callback for the selector
  const handleSelectionChange = useCallback(
    (fundId: string | null, propertyId: string | null) => {
      console.log("Base Financial Hub Selection Changed:", {
        fundId,
        propertyId,
      });
      setSelectedFundId(fundId);
      setSelectedPropertyId(propertyId);
      // Reset active tab or trigger data refresh if necessary
      setActiveTab("Summary Dashboard"); // Go back to summary on new property select
      // setIsLoading(true); // if using top-level loading
    },
    []
  );

  const handleCalculationsComplete = useCallback((isLoaded: boolean) => {
    setIsCalculationsLoaded(isLoaded);
  }, []);

  const tabs: FinancialTab[] = [
    "Assumptions",
    "Rent Roll",
    "Summary Dashboard",
    "Income Statement",
    "Acquisition Model",
  ];

  // Helper function to render the active tab component
  const renderTabContent = () => {
    if (!selectedPropertyId || !isCalculationsLoaded) {
      return (
        <div className="p-4 text-center text-gray-500">
          Select a property above to view details.
        </div>
      );
    }
    switch (activeTab) {
      case "Summary Dashboard":
        return <SummaryDashboardTab propertyId={selectedPropertyId} />;
      case "Rent Roll":
        return <RentRollTab propertyId={selectedPropertyId} />;
      case "Income Statement":
        return <IncomeStatementTab propertyId={selectedPropertyId} />;
      case "Acquisition Model":
        return <AcquisitionModelTab propertyId={selectedPropertyId} />;
      case "Assumptions":
        return <AssumptionsTab propertyId={selectedPropertyId} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 p-4 space-y-4">
      {/* Title - Matches the dark blue theme of the sidebar #0f172a */}
      <div className="bg-[#0f172a] text-white p-3 rounded-t-md shadow-md">
        <h1 className="text-lg font-semibold">
          AriesView Financial Analysis Hub
        </h1>
      </div>

      {/* Fund and Property Selector */}
      <FundPropertySelector
        // Set initial values to null or undefined as there's no ID from URL
        initialFundId={undefined}
        initialPropertyId={undefined}
        onSelectionChange={handleSelectionChange}
        onCalculationsComplete={handleCalculationsComplete}
      />

      {/* Conditionally render tabs and content based on selection */}
      {selectedPropertyId ? (
        <div className="flex flex-col flex-grow min-h-0">
          {" "}
          {/* Added min-h-0 for flex-grow */}
          {/* Tab Bar - Styled with dark blue theme */}
          <div className="flex border-b border-gray-300 bg-gray-50 shadow-sm flex-shrink-0">
            {" "}
            {/* Added flex-shrink-0 */}
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 text-sm font-medium transition-colors duration-150 
                  ${
                    activeTab === tab
                      ? "border-b-2 border-[#0f172a] text-[#0f172a] bg-white" // Active tab style
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-200" // Inactive tab style
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* Tab Content Area */}
          <div className="flex-grow bg-white p-4 rounded-b-md shadow overflow-auto">
            {renderTabContent()}
          </div>
        </div>
      ) : (
        // Placeholder when no property is selected
        <div className="flex-grow bg-white p-6 rounded-md shadow text-center text-gray-500">
          Please select a Fund and Property above to view financial details.
        </div>
      )}
    </div>
  );
}
