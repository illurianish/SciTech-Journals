"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import SummaryDashboard from "@/components/financial/summary/SummaryDashboard";
import FundPropertySelector from "@/components/financial/FundPropertySelector";
import AcquisitionModelTab from "@/components/financial-hub-tabs/AcquisitionModelTab";
import AssumptionsTab from "@/components/financial-hub-tabs/AssumptionsTab";

interface FinancialMetrics {
  grossIncome: number;
  operatingExpenses: number;
  netOperatingIncome: number;
  occupancyRate: number;
  effectiveGrossIncome: number;
}

interface LeaseMetrics {
  period: string;
  months: number;
  baseRent: number;
  expenses: number;
  totalCost: number;
  averageMonthlyCost: number;
  perAnnum: number;
  cumulative: number;
}

interface FinancialDetail {
  period: string;
  baseRent: number;
  rentAbatement: number;
  totalRent: number;
  expenses: {
    baseYearStop: number;
    totalExpenses: number;
  };
}

interface ExpenseCredit {
  tiAllowance: number;
  movingAllowance: number;
  movingExpenses: number;
  totalBuildoutCost: number;
  totalExpensesAndCredits: number;
}

export default function FinancialAnalysisHub() {
  const params = useParams();
  const urlPropertyId = params.id as string;

  // State for selected fund and property
  const [selectedFundId, setSelectedFundId] = useState<string | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    urlPropertyId
  );

  // State for the actual property data being displayed
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Placeholder state for fetched data (replace hardcoded blocks)
  const [propertyDetails, setPropertyDetails] = useState<any>(null);
  const [leaseMetrics, setLeaseMetrics] = useState<LeaseMetrics[]>([]);
  const [financialDetails, setFinancialDetails] = useState<FinancialDetail[]>(
    []
  );
  const [expenseCredits, setExpenseCredits] = useState<ExpenseCredit | null>(
    null
  );

  const [selectedPeriod, setSelectedPeriod] = useState("annual");
  const [activeTab, setActiveTab] = useState("summary");

  // Callback function for the selector component
  const handleSelectionChange = (
    fundId: string | null,
    propertyId: string | null
  ) => {
    console.log("Selection Changed:", { fundId, propertyId });
    setSelectedFundId(fundId);
    setSelectedPropertyId(propertyId);
    setProperty(null);
    setPropertyDetails(null);
    setLeaseMetrics([]);
    setFinancialDetails([]);
    setExpenseCredits(null);
    setIsLoading(true);
  };

  // Effect to fetch data when selectedFundId or selectedPropertyId changes
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedPropertyId || !selectedFundId) {
        setProperty(null);
        setPropertyDetails(null);
        setLeaseMetrics([]);
        setFinancialDetails([]);
        setExpenseCredits(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      console.log(
        `Fetching data for Fund: ${selectedFundId}, Property: ${selectedPropertyId}`
      );

      try {
        // --- Replace with actual API calls ---
        // Example: Fetch property base data
        // const propertyResponse = await fetch(`/api/funds/${selectedFundId}/properties/${selectedPropertyId}`);
        // const propertyData = await propertyResponse.json();
        // setProperty(propertyData);

        // Example: Fetch detailed financial data for the property
        // const detailsResponse = await fetch(`/api/properties/${selectedPropertyId}/financials`);
        // const detailsData = await detailsResponse.json();
        // setPropertyDetails(detailsData.details); // Assuming structure
        // setLeaseMetrics(detailsData.leaseMetrics);
        // setFinancialDetails(detailsData.financialDetails);
        // setExpenseCredits(detailsData.expenseCredits);

        // --- Placeholder data logic (REMOVE THIS IN REAL APP) ---
        // Simulating finding data based on selection (uses placeholder data from selector for now)
        // --- Remove placeholder data import and logic for propertiesData and fundsData ---
        // You should replace this with real API calls or your own placeholder logic as needed.
        setProperty({ name: "Sample Property" });
        setPropertyDetails({
          name: `Sample Property (Sample Details)`,
          address: `123 Sample Property St`,
          landlordProposal: "LANDLORD PROPOSAL",
          city: "Sample City",
          state: "ST",
          zip: "12345",
          country: "US",
          rentableArea: "50,000 SF",
          usableArea: "45,000 SF",
          loadFactor: "11%",
          leaseTerm: "60 months",
          commencementDate: "01/01/2024",
          expirationDate: "12/31/2028",
          tiAllowance: "$25.00 per RSF",
          landlord: `Sample Fund Holdings`,
          buildingClass: "Class B",
          floorSuite: "Various",
          parkingRatio: "4 per 1,000",
          leaseStructure: "NNN",
          renewalOptions: "One (1) Five (5) Year Option",
          expansionRights: "None",
          totalDealCost: "$10,000,000",
          npv: "$8,000,000",
        });
        setLeaseMetrics([
          {
            period: "Average",
            months: 12,
            baseRent: 20,
            expenses: 5,
            totalCost: 25,
            averageMonthlyCost: 104167,
            perAnnum: 1250000,
            cumulative: 0,
          },
        ]);
        setFinancialDetails([
          {
            period: "Average",
            baseRent: 1000000,
            rentAbatement: 0,
            totalRent: 1000000,
            expenses: { baseYearStop: 50000, totalExpenses: 50000 },
          },
        ]);
        setExpenseCredits({
          tiAllowance: 1250000,
          movingAllowance: 50000,
          movingExpenses: 100000,
          totalBuildoutCost: 1250000,
          totalExpensesAndCredits: 50000,
        });
        // --- End Placeholder data logic ---
      } catch (error) {
        console.error("Failed to fetch property data:", error);
        setProperty(null);
        setPropertyDetails(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedFundId, selectedPropertyId]);

  if (isLoading) {
    return <div className="p-6">Loading financial data...</div>;
  }

  if (!selectedPropertyId || !property || !propertyDetails) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center text-sm">
            <Link
              href="/operations-dashboard"
              className="text-blue-600 hover:text-blue-800"
            >
              Dashboard
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <Link
              href="/operations-dashboard/properties"
              className="text-blue-600 hover:text-blue-800"
            >
              Properties
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-600 font-medium">Financial Hub</span>
          </div>
        </div>

        <FundPropertySelector
          initialFundId={null}
          initialPropertyId={urlPropertyId}
          onSelectionChange={handleSelectionChange}
        />
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          Please select a fund and property to view the financial hub.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center text-sm">
          <Link
            href="/operations-dashboard"
            className="text-blue-600 hover:text-blue-800"
          >
            Dashboard
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link
            href="/operations-dashboard/properties"
            className="text-blue-600 hover:text-blue-800"
          >
            Properties
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link
            href={`/operations-dashboard/properties/${selectedPropertyId}`}
            className="text-blue-600 hover:text-blue-800"
          >
            {property.name}
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-600 font-medium">Financial Hub</span>
        </div>

        <div className="flex mt-4 space-x-4 border-b">
          <Link
            href={`/operations-dashboard/properties/${selectedPropertyId}`}
            className="px-4 py-2 text-gray-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600"
          >
            Overview
          </Link>
          <Link
            href={`/operations-dashboard/properties/${selectedPropertyId}/document-hub`}
            className="px-4 py-2 text-gray-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600"
          >
            Document Hub
          </Link>
          <Link
            href={`/operations-dashboard/properties/${selectedPropertyId}/financial-hub`}
            className="px-4 py-2 text-blue-600 border-b-2 border-blue-600 font-medium"
          >
            Financial Hub
          </Link>
          <Link
            href={`/operations-dashboard/properties/${selectedPropertyId}/legal-hub`}
            className="px-4 py-2 text-gray-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600"
          >
            Legal Hub
          </Link>
        </div>
      </div>

      <FundPropertySelector
        initialFundId={selectedFundId}
        initialPropertyId={selectedPropertyId}
        onSelectionChange={handleSelectionChange}
      />

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {propertyDetails.name}
            </h1>
            <p className="text-gray-500">{propertyDetails.address}</p>
            <p className="text-gray-500">
              {propertyDetails.city}, {propertyDetails.state}{" "}
              {propertyDetails.zip}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-600 font-medium">
              {propertyDetails.landlordProposal}
            </p>
            <p className="text-gray-600">Property ID: {selectedPropertyId}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap space-x-4">
          <button
            onClick={() => setActiveTab("summary")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "summary"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Summary Dashboard
          </button>
          <button
            onClick={() => setActiveTab("lease-metrics")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "lease-metrics"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Lease Metrics
          </button>
          <button
            onClick={() => setActiveTab("financial-details")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "financial-details"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Financial Details
          </button>
          <button
            onClick={() => setActiveTab("expenses")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "expenses"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Expenses & Credits
          </button>
          <button
            onClick={() => setActiveTab("acquisition-model")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "acquisition-model"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Acquisition Model
          </button>
          <button
            onClick={() => setActiveTab("assumptions")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "assumptions"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Assumptions
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {activeTab === "summary" && (
          <SummaryDashboard propertyId={selectedPropertyId} />
        )}
        {activeTab === "lease-metrics" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Lease Metrics</h2>
            <pre>{JSON.stringify(leaseMetrics, null, 2)}</pre>
          </div>
        )}
        {activeTab === "financial-details" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Financial Details</h2>
            <pre>{JSON.stringify(financialDetails, null, 2)}</pre>
          </div>
        )}
        {activeTab === "expenses" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Expenses & Credits</h2>
            <pre>{JSON.stringify(expenseCredits, null, 2)}</pre>
          </div>
        )}
        {activeTab === "acquisition-model" && (
          <AcquisitionModelTab propertyId={selectedPropertyId} />
        )}
        {activeTab === "assumptions" && (
          <AssumptionsTab propertyId={selectedPropertyId} />
        )}
      </div>
    </div>
  );
}
