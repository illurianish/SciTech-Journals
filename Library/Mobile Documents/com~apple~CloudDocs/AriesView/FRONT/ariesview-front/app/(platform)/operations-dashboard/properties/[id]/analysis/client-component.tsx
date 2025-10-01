'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter, notFound } from 'next/navigation'

interface AnalysisData {
  propertyValue: string;
  capRate: string;
  cashFlow: string;
  roi: string;
  occupancyRate: string;
  leaseRenewalRisk: string;
  marketTrends: string[];
  recommendations: string[];
}

// Client Component
export default function AnalysisContent() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;
  
  const [propertyData, setPropertyData] = useState<any>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, we would fetch data from an API
    // For now, we'll simulate loading property data from localStorage
    const storedPropertyData = localStorage.getItem('propertyFormData');
    
    if (storedPropertyData) {
      const parsedData = JSON.parse(storedPropertyData);
      setPropertyData(parsedData);
      
      // Simulate loading analysis data
      setTimeout(() => {
        setAnalysisData(generateMockAnalysis(parsedData));
        setLoading(false);
      }, 1000);
    } else {
      setLoading(false);
    }
  }, [propertyId]);
  
  const generateMockAnalysis = (propertyData: any): AnalysisData => {
    // Generate mock analysis data based on property information
    const purchasePrice = parseFloat(propertyData.purchasePrice) || 5000000;
    const currentValue = parseFloat(propertyData.currentValue) || purchasePrice * 1.05;
    
    return {
      propertyValue: formatCurrency(currentValue),
      capRate: ((Math.random() * 3 + 5).toFixed(2) + '%'), // Random cap rate between 5-8%
      cashFlow: formatCurrency(purchasePrice * 0.08), // 8% of purchase price as annual cash flow
      roi: ((Math.random() * 4 + 6).toFixed(2) + '%'), // Random ROI between 6-10%
      occupancyRate: ((Math.random() * 10 + 85).toFixed(1) + '%'), // Random between 85-95%
      leaseRenewalRisk: Math.random() > 0.5 ? 'Low' : 'Medium',
      marketTrends: [
        "Rental rates in this area have increased 4.2% year-over-year",
        "Vacancy rates are trending downward in this submarket",
        "Property values in this area have appreciated 12% over the last 3 years"
      ],
      recommendations: [
        "Consider renewing leases early to lock in current tenants",
        "Evaluate potential for rental increases based on market conditions",
        "Review operating expenses for potential efficiency improvements",
        "Assess capital improvement needs to maintain competitive positioning"
      ]
    };
  };
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Analysis</h2>
          <p className="text-gray-500">Please wait while we load your property analysis...</p>
        </div>
      </div>
    );
  }
  
  if (!propertyData || !analysisData) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Data Available</h2>
          <p className="text-gray-500 mb-4">We couldn't find property data to analyze. Try adding a property first.</p>
          <Link
            href="/operations-dashboard/properties/add"
            className="px-4 py-2 bg-[#0066cc] text-white rounded-md hover:bg-[#0055aa]"
          >
            Add a Property
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#0066cc]">{propertyData.propertyName} Analysis</h1>
            <p className="text-gray-600">
              {propertyData.address}, {propertyData.city}, {propertyData.state} {propertyData.zip}
            </p>
          </div>
          <Link
            href="/operations-dashboard"
            className="text-gray-500 hover:text-gray-700"
          >
            Back to Dashboard
          </Link>
        </div>
        
        {/* Analysis Overview Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Analysis Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Estimated Property Value</h3>
              <p className="text-2xl font-bold text-[#0066cc]">{analysisData.propertyValue}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Cap Rate</h3>
              <p className="text-2xl font-bold text-[#0066cc]">{analysisData.capRate}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Annual Cash Flow</h3>
              <p className="text-2xl font-bold text-[#0066cc]">{analysisData.cashFlow}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">ROI</h3>
              <p className="text-2xl font-bold text-[#0066cc]">{analysisData.roi}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Occupancy Rate</h3>
              <p className="text-2xl font-bold text-[#0066cc]">{analysisData.occupancyRate}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Lease Renewal Risk</h3>
              <p className="text-2xl font-bold text-[#0066cc]">{analysisData.leaseRenewalRisk}</p>
            </div>
          </div>
        </div>
        
        {/* Market Trends Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Market Trends</h2>
          <div className="space-y-3">
            {analysisData.marketTrends.map((trend, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-[#0066cc]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-gray-600">{trend}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recommendations Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommendations</h2>
          <div className="space-y-3">
            {analysisData.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-[#0066cc]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-gray-600">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between">
          <Link 
            href={`/operations-dashboard/properties/${propertyId}`}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            View Property Details
          </Link>
          
          <Link 
            href="/operations-dashboard"
            className="px-6 py-2 bg-[#0066cc] text-white rounded-md hover:bg-[#0055aa]"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
} 