import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Search, Edit, Plus, ChevronDown, Sliders } from "lucide-react";
import dynamic from "next/dynamic";
import { FinancialTemplateEditor } from "@/app/(platform)/operations-dashboard/ask-ai/components/FinancialTemplateEditor";

interface FinancialHubProps {
  propertyId?: string;
  propertyName?: string;
  propertyValue?: number;
  occupancy?: number;
  roi?: number;
}

// Main categories for the financial hub
const MAIN_CATEGORIES = [
  { id: 'property', name: 'Property Analysis' },
  { id: 'financial', name: 'Financial Performance' },
  { id: 'debt', name: 'Debt & Leverage' },
  { id: 'risk', name: 'Risk & Sensitivity' },
  { id: 'acquisition', name: 'Acquisition Analysis' },
  { id: 'other', name: 'Other Analysis' }
];

// Define metrics for each category
const CATEGORY_METRICS = {
  revenue: [
    { id: 'rentPerSf', name: 'Average Rent per Square Foot', defaultValue: 32.50, unit: '$/sf/year' },
    { id: 'occupancyRate', name: 'Occupancy Rate', defaultValue: 92.00, unit: '%' },
    { id: 'rentEscalation', name: 'Annual Rent Escalation', defaultValue: 3.00, unit: '%' },
    { id: 'ancillaryIncome', name: 'Ancillary Income per Unit', defaultValue: 1200.00, unit: '$/year' },
    { id: 'vacancyLoss', name: 'Vacancy Loss', defaultValue: 5.00, unit: '%' }
  ],
  expenses: [
    { id: 'opexPerSf', name: 'Operating Expenses per Square Foot', defaultValue: 12.50, unit: '$/sf/year' },
    { id: 'propertyTaxRate', name: 'Property Tax Rate', defaultValue: 1.25, unit: '%' },
    { id: 'insurancePerSf', name: 'Insurance Cost per Square Foot', defaultValue: 0.85, unit: '$/sf/year' },
    { id: 'maintenancePerUnit', name: 'Annual Maintenance & Repairs per Unit', defaultValue: 2500.00, unit: '$/year' },
    { id: 'capexPerUnit', name: 'Capital Expenditures Reserve per Unit', defaultValue: 1500.00, unit: '$/year' }
  ],
  financing: [
    { id: 'interestRate', name: 'Loan Interest Rate', defaultValue: 5.25, unit: '%' },
    { id: 'ltvRatio', name: 'Loan-to-Value (LTV) Ratio', defaultValue: 75.00, unit: '%' },
    { id: 'amortPeriod', name: 'Amortization Period', defaultValue: 30.00, unit: 'years' },
    { id: 'originationFee', name: 'Origination Fee', defaultValue: 1.00, unit: '%' },
    { id: 'exitCapRate', name: 'Exit Cap Rate', defaultValue: 6.00, unit: '%' }
  ]
};

// Risk analysis tabs - these will be sub-tabs under Risk & Sensitivity
const RISK_TABS = [
  { id: 'risk-assessment', name: 'Risk Assessment' },
  { id: 'stress-testing', name: 'Stress Testing' },
  { id: 'sensitivity-analysis', name: 'Sensitivity Analysis' },
  { id: 'market-exposure', name: 'Market Exposure' }
];

// Example data templates for each tab and sub-tab
const TAB_TEMPLATES = {
  'property-overview': [
    ['Property Overview', 'Value', 'Notes'],
    ['Total Square Footage', '105,000', ''],
    ['Class', 'A', 'Floor to ceiling, Parking 2 per 1,000'],
    ['Year Built', '2013', ''],
    ['Location', 'River Street', 'Prime downtown location'],
    ['Occupancy Rate', '92%', 'Current as of 2024']
  ],
  'property-specifications': [
    ['Building Specifications', 'Details', 'Status'],
    ['Construction Type', 'Steel Frame', 'Excellent'],
    ['Floor Plate', '25,000 SF', 'Efficient'],
    ['Ceiling Height', '12 feet', 'Above Market'],
    ['HVAC System', 'Central', 'Recently Upgraded'],
    ['Elevators', '6 High-Speed', 'Modernized 2022']
  ],
  'property-location': [
    ['Location Metrics', 'Score', 'Details'],
    ['Walk Score', '95', "Walker's Paradise"],
    ['Transit Score', '92', 'Excellent Transit'],
    ['Bike Score', '88', 'Very Bikeable'],
    ['Demographics', 'A+', 'High Income Area'],
    ['Market Position', 'Prime', 'CBD Location']
  ],
  'property-amenities': [
    ['Amenity', 'Description', 'Status'],
    ['Fitness Center', '3,000 SF', 'Operational'],
    ['Conference Center', '2,500 SF', 'Recently Updated'],
    ['Parking Garage', '350 Spaces', 'Secured Access'],
    ['Roof Deck', '5,000 SF', 'Tenant Exclusive'],
    ['Bike Storage', '100 Spaces', 'Available']
  ],
  'financial-performance': [
    ['Performance Metrics', '2023', '2024', '2025', '2026'],
    ['Revenue', '$2,500,000', '$2,575,000', '$2,652,250', '$2,731,818'],
    ['Operating Expenses', '$950,000', '$973,750', '$998,094', '$1,023,046'],
    ['NOI', '$1,550,000', '$1,601,250', '$1,654,156', '$1,708,772'],
    ['Cap Rate', '6.0%', '6.0%', '6.1%', '6.2%']
  ],
  'financial-cashflow': [
    ['Cash Flow Analysis', 'Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
    ['Operating Cash Flow', '$387,500', '$395,250', '$403,155', '$411,218'],
    ['CapEx Reserve', '($50,000)', '($50,000)', '($50,000)', '($50,000)'],
    ['Debt Service', '($246,913)', '($246,913)', '($246,913)', '($246,913)'],
    ['Net Cash Flow', '$90,587', '$98,337', '$106,242', '$114,305']
  ],
  'financial-operating': [
    ['Operating Statement', '2023', '2024 (P)', 'Variance', '% Change'],
    ['Rental Income', '$2,300,000', '$2,369,000', '$69,000', '3.0%'],
    ['Other Income', '$200,000', '$206,000', '$6,000', '3.0%'],
    ['Total Income', '$2,500,000', '$2,575,000', '$75,000', '3.0%'],
    ['Operating Expenses', '($950,000)', '($973,750)', '($23,750)', '2.5%']
  ],
  'financial-projections': [
    ['5-Year Projection', '2024', '2025', '2026', '2027', '2028'],
    ['NOI', '$1,601,250', '$1,654,156', '$1,708,772', '$1,765,147', '$1,823,327'],
    ['Cap Rate', '6.00%', '6.10%', '6.20%', '6.30%', '6.40%'],
    ['Property Value', '$26,687,500', '$27,117,311', '$27,560,839', '$28,018,206', '$28,489,484']
  ],
  'debt-structure': [
    ['Debt Structure', 'Current', 'Market', 'Variance'],
    ['Principal Balance', '$15,000,000', '-', '-'],
    ['Interest Rate', '5.25%', '5.50%', '-0.25%'],
    ['Term Remaining', '8.5 years', '-', '-'],
    ['Payment Type', 'P&I', '-', '-'],
    ['Prepayment Penalty', 'Yes', '-', 'Yield Maintenance']
  ],
  'debt-coverage': [
    ['Coverage Metrics', 'Current', 'Required', 'Status'],
    ['DSCR', '1.25x', '1.20x', 'Pass'],
    ['DSCR (Stressed)', '1.15x', '1.10x', 'Pass'],
    ['Debt Yield', '10.5%', '9.0%', 'Pass'],
    ['LTV', '75%', '80%', 'Pass']
  ],
  'debt-amortization': [
    ['Period', 'Payment', 'Principal', 'Interest', 'Balance'],
    ['Current', '$987,654', '$567,890', '$419,764', '$15,000,000'],
    ['Year 1', '$3,950,616', '$2,321,560', '$1,629,056', '$12,678,440'],
    ['Year 2', '$3,950,616', '$2,443,441', '$1,507,175', '$10,235,000']
  ],
  'risk-assessment': [
    ['Risk Category', 'Score', 'Threshold', 'Status'],
    ['Market Risk', '3.5', '4.0', 'Good'],
    ['Credit Risk', '2.8', '3.0', 'Good'],
    ['Interest Rate Risk', '4.2', '4.0', 'Warning'],
    ['Operational Risk', '2.5', '3.0', 'Good']
  ],
  'risk-stress-testing': [
    ['Scenario', 'NOI Impact', 'Value Impact', 'DSCR Impact'],
    ['Base Case', '-', '-', '-'],
    ['Recession (-10%)', '-15%', '-20%', '1.15x'],
    ['Severe (-20%)', '-25%', '-30%', '1.05x'],
    ['Recovery (+10%)', '+12%', '+15%', '1.45x']
  ],
  'risk-sensitivity-analysis': [
    ['Variable', 'Low Impact', 'Base Case', 'High Impact'],
    ['Rental Rate', '-10%', '$30/SF', '+10%'],
    ['Occupancy', '85%', '92%', '95%'],
    ['Expenses', '+15%', 'Base', '-10%'],
    ['Interest Rate', '+2%', '5.25%', '-1%']
  ],
  'risk-market-exposure': [
    ['Market Factor', 'Exposure Level', 'Market Average', 'Status'],
    ['Tenant Industry', 'Moderate', 'High', 'Good'],
    ['Geographic', 'Low', 'Moderate', 'Good'],
    ['Economic Cycle', 'High', 'High', 'Monitor'],
    ['Competition', 'Moderate', 'High', 'Good']
  ],
  'acquisition-valuation': [
    ['Valuation Metrics', 'Current', 'Market', 'Variance'],
    ['Purchase Price', '$23,913,790', '$24,000,000', '-0.36%'],
    ['Price per SF', '$227.75', '$228.57', '-0.36%'],
    ['Cap Rate', '6.00%', '5.75%', '+0.25%'],
    ['IRR (5-yr)', '15.5%', '15.0%', '+0.50%']
  ],
  'acquisition-comparables': [
    ['Comparable', 'Price/SF', 'Cap Rate', 'Year Built'],
    ['Property A', '$230', '5.75%', '2015'],
    ['Property B', '$225', '5.90%', '2012'],
    ['Property C', '$235', '5.65%', '2016'],
    ['Subject', '$228', '6.00%', '2013']
  ],
  'acquisition-due-diligence': [
    ['Category', 'Status', 'Due Date', 'Notes'],
    ['Physical Inspection', 'Complete', '2024-02-15', 'No major issues'],
    ['Environmental', 'In Progress', '2024-03-01', 'Phase I complete'],
    ['Title Review', 'Complete', '2024-02-10', 'Clean title'],
    ['Lease Review', 'In Progress', '2024-03-15', '80% complete']
  ],
  'other-environmental': [
    ['Environmental Metrics', 'Score', 'Target', 'Status'],
    ['Energy Efficiency', '85/100', '80/100', 'Exceeds'],
    ['Water Usage', '78/100', '75/100', 'Exceeds'],
    ['Waste Management', '90/100', '85/100', 'Exceeds'],
    ['Carbon Footprint', '82/100', '80/100', 'Exceeds']
  ],
  'other-market-analysis': [
    ['Market Indicator', 'Current', 'YoY Change', 'Outlook'],
    ['Vacancy Rate', '8.5%', '-1.2%', 'Positive'],
    ['Absorption', '250,000 SF', '+15%', 'Stable'],
    ['Rent Growth', '3.2%', '+0.5%', 'Positive'],
    ['New Supply', '500,000 SF', '-25%', 'Positive']
  ],
  'other-tenant-analysis': [
    ['Metric', 'Current', 'Target', 'Status'],
    ['Credit Quality', 'BBB+', 'BBB', 'Exceeds'],
    ['Industry Diversity', '0.85', '0.80', 'Good'],
    ['Avg Lease Term', '5.5 yrs', '5.0 yrs', 'Good'],
    ['Retention Rate', '85%', '80%', 'Exceeds']
  ],
  'other-operational': [
    ['Metric', 'Current', 'Budget', 'Variance'],
    ['Work Orders/mo', '45', '50', '+10%'],
    ['Response Time', '4.2 hrs', '8.0 hrs', '+47.5%'],
    ['PM Completion', '98%', '95%', '+3.0%'],
    ['Tenant Satisfaction', '4.5/5.0', '4.0/5.0', '+12.5%']
  ]
} as const;

// Define sub-tabs for each main category
const CATEGORY_SUBTABS = {
  property: [
    { id: 'overview', name: 'Property Overview' },
    { id: 'specifications', name: 'Specifications' },
    { id: 'location', name: 'Location Analysis' },
    { id: 'amenities', name: 'Amenities & Features' }
  ],
  financial: [
    { id: 'performance', name: 'Performance Metrics' },
    { id: 'cashflow', name: 'Cash Flow Analysis' },
    { id: 'operating', name: 'Operating Statements' },
    { id: 'projections', name: 'Financial Projections' }
  ],
  debt: [
    { id: 'structure', name: 'Debt Structure' },
    { id: 'coverage', name: 'Coverage Analysis' },
    { id: 'amortization', name: 'Amortization Schedule' },
    { id: 'refinancing', name: 'Refinancing Scenarios' }
  ],
  risk: [
    { id: 'risk-assessment', name: 'Risk Assessment' },
    { id: 'stress-testing', name: 'Stress Testing' },
    { id: 'sensitivity-analysis', name: 'Sensitivity Analysis' },
    { id: 'market-exposure', name: 'Market Exposure' }
  ],
  acquisition: [
    { id: 'valuation', name: 'Valuation Analysis' },
    { id: 'comparables', name: 'Market Comparables' },
    { id: 'due-diligence', name: 'Due Diligence' },
    { id: 'investment-returns', name: 'Investment Returns' }
  ],
  other: [
    { id: 'environmental', name: 'Environmental' },
    { id: 'market-analysis', name: 'Market Analysis' },
    { id: 'tenant-analysis', name: 'Tenant Analysis' },
    { id: 'operational', name: 'Operational Metrics' }
  ]
};

export default function EnhancedFinancialHub({
  propertyId,
  propertyName = "522 River St",
  propertyValue = 5200000,
  occupancy = 92,
  roi = 7.2
}: FinancialHubProps) {
  const [activeMainCategory, setActiveMainCategory] = useState("property");
  const [activeSubTab, setActiveSubTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [timelineYear, setTimelineYear] = useState(2024);
  const [isProjected, setIsProjected] = useState(false);
  const [showAdjustments, setShowAdjustments] = useState(true);
  
  // Financial adjustment parameters with default values
  const defaultAdjustments = {
    capRate: 6.0,
    vacancyRate: 5.0,
    rentGrowth: 3.0,
    expenseGrowth: 2.5,
    interestRate: 5.25,
    expenseRatio: 38.0,
    ltvRatio: 75.0,
    dscr: 1.25,
    marketVolatility: 12.0,
    interestRateRisk: 2.0,
    // Add risk range fields
    capRateMin: 5.0,
    capRateMax: 7.0,
    rentGrowthMin: 1.5,
    rentGrowthMax: 4.5,
    vacancyRateMin: 3.0,
    vacancyRateMax: 8.0,
    expenseGrowthMin: 1.5,
    expenseGrowthMax: 3.5,
    expenseRatioMin: 32.0,
    expenseRatioMax: 45.0,
    interestRateMin: 4.5,
    interestRateMax: 6.5,
    ltvRatioMin: 65.0,
    ltvRatioMax: 85.0,
    dscrMin: 1.15,
    dscrMax: 1.45,
    marketVolatilityMin: 8.0,
    marketVolatilityMax: 18.0,
    interestRateRiskMin: 1.0,
    interestRateRiskMax: 3.5
  };
  
  const [adjustments, setAdjustments] = useState(defaultAdjustments);
  // Add state for risk analysis
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Validate adjustments on component mount
  useEffect(() => {
    // Check if any adjustment values are NaN and reset them to defaults
    const hasInvalidValues = Object.entries(adjustments).some(
      ([key, value]) => isNaN(value)
    );
    
    if (hasInvalidValues) {
      console.warn('Found invalid adjustment values, resetting to defaults');
      setAdjustments({...defaultAdjustments});
    }
  }, []);

  // Calculate impact values based on adjustments
  const calculatedValues = {
    projectedNOI: 330851,
    estimatedValue: 5314183,
    cashFlow: 96642,
    cashOnCash: 5.68
  };

  // Update projected values when adjustments change
  useEffect(() => {
    // In a real app, this would recalculate based on the adjustments
    // For now we'll just use the static values
  }, [adjustments]);

  // Handle category change
  const handleMainCategoryChange = (category: string) => {
    setActiveMainCategory(category);
    // Set default sub-tab for the new category
    setActiveSubTab(CATEGORY_SUBTABS[category][0].id);
  };

  // Handle adjustment change
  const handleAdjustmentChange = (key: string, value: number) => {
    // Check if value is a valid number
    if (isNaN(value)) {
      console.warn(`Invalid value for ${key}: ${value}`);
      return; // Don't update state with invalid values
    }
    
    // Format to 2 decimal places
    const formattedValue = Number(value.toFixed(2));
    
    setAdjustments(prev => ({
      ...prev,
      [key]: formattedValue
    }));
  };

  // Handle timeline year change
  const handleTimelineYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const year = parseInt(e.target.value);
    // Ensure the year is within valid range
    if (year >= 2020 && year <= 2054) {
      setTimelineYear(year);
      setIsProjected(year > 2023);
    }
  };

  // Handle risk analysis
  const handleRunRiskAnalysis = () => {
    setIsAnalyzing(true);
    // Simulate processing delay
    setTimeout(() => {
      // In a real app, this would perform risk calculations based on min/max ranges
      console.log('Running risk analysis with parameters:', adjustments);
      setIsAnalyzing(false);
    }, 1000);
  };

  // Get current template based on main category and sub-tab
  const getCurrentTemplate = () => {
    const templateKey = `${activeMainCategory}-${activeSubTab}`;
    return TAB_TEMPLATES[templateKey] || TAB_TEMPLATES[activeMainCategory];
  };

  return (
    <div className="relative flex">
      {/* Main Financial Hub Content */}
      <div className="bg-white shadow rounded-lg p-6 flex-grow overflow-hidden">
        {/* Header with Property Details and Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
            <div>Size: 105,000 SF</div>
            <div>Tenants: 12</div>
            <div>Class: A</div>
            <div>Year Built: 2013</div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-1">
            {MAIN_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleMainCategoryChange(category.id)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                  activeMainCategory === category.id
                    ? 'bg-white text-blue-600 border-t border-l border-r border-gray-200'
                    : 'text-gray-500 hover:text-gray-700 bg-gray-50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-tabs for current category */}
        <div className="mb-4 border-b border-gray-200">
          <div className="flex space-x-1">
            {CATEGORY_SUBTABS[activeMainCategory].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-3 py-2 text-sm font-medium ${
                  activeSubTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 