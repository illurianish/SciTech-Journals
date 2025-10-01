'use client';

import { useState, useRef, Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Search, Edit, Plus, ChevronDown } from "lucide-react";
import dynamic from 'next/dynamic';

const HandsontableExcel = dynamic(() => import('./HandsontableExcel'), {
  ssr: false,
  loading: () => <div className="p-4 text-center">Loading spreadsheet...</div>
});

// Main categories for the residential financial hub
const MAIN_CATEGORIES = [
  { id: 'rental', name: 'Rental Performance', icon: 'R' },
  { id: 'financial', name: 'Financial Statements', icon: 'F' },
  { id: 'investment', name: 'Investment Analysis', icon: 'I' },
  { id: 'market', name: 'Market Analysis', icon: 'M' }
];

// Sub-categories for each main category
const SUB_CATEGORIES = {
  rental: [
    { id: 'overview', name: 'Portfolio Overview' },
    { id: 'rent-roll', name: 'Rent Roll' },
    { id: 'vacancy', name: 'Vacancy Analysis' },
    { id: 'lease-terms', name: 'Lease Terms' },
    { id: 'tenant-history', name: 'Tenant History' },
    { id: 'rental-comps', name: 'Rental Comparables' },
    { id: 'tenant-satisfaction', name: 'Tenant Satisfaction' },
    { id: 'maintenance-requests', name: 'Maintenance Requests' }
  ],
  financial: [
    { id: 'income-statement', name: 'Income Statement' },
    { id: 'cash-flow', name: 'Cash Flow' },
    { id: 'net-cash-flow', name: 'Net Cash Flow' },
    { id: 'expense-breakdown', name: 'Expense Breakdown' },
    { id: 'capital-expenditures', name: 'Capital Expenditures' },
    { id: 'budget-variance', name: 'Budget vs. Actual' },
    { id: 'financial-ratios', name: 'Financial Ratios' },
    { id: 'forecasting', name: 'Financial Forecasting' }
  ],
  investment: [
    { id: 'summary', name: 'Investment Summary' },
    { id: 'returns', name: 'Returns Analysis' },
    { id: 'historical', name: 'Historical Performance' },
    { id: 'appreciation', name: 'Appreciation Analysis' },
    { id: 'leverage', name: 'Leverage Analysis' },
    { id: 'scenarios', name: 'Scenario Analysis' },
    { id: 'exit-strategies', name: 'Exit Strategies' },
    { id: 'tax-benefits', name: 'Tax Benefits' }
  ],
  market: [
    { id: 'neighborhood', name: 'Neighborhood Analysis' },
    { id: 'demographics', name: 'Demographics' },
    { id: 'pricing-trends', name: 'Pricing Trends' },
    { id: 'demand-analysis', name: 'Demand Analysis' },
    { id: 'competition', name: 'Competition' },
    { id: 'economic-indicators', name: 'Economic Indicators' },
    { id: 'development-activity', name: 'Development Activity' },
    { id: 'market-forecast', name: 'Market Forecast' }
  ]
};

interface ResidentialFinancialHubProps {
  propertyId?: string;
  propertyName?: string;
  propertyValue?: number;
  occupancy?: number;
  roi?: number;
}

export default function ResidentialFinancialHub({
  propertyId,
  propertyName,
  propertyValue,
  occupancy,
  roi
}: ResidentialFinancialHubProps) {
  const [activeMainCategory, setActiveMainCategory] = useState('rental');
  const [activeSubCategory, setActiveSubCategory] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Summary metrics state
  const [summaryMetrics] = useState({
    purchasePrice: propertyValue ? `$${propertyValue.toLocaleString()}` : '$3,250,000',
    noi: '$215,000',
    capRate: '6.6%',
    cashOnCash: '8.2%'
  });

  // Use a different ref for each category to prevent conflicts
  const rentalExcelRef = useRef<any>(null);
  const financialExcelRef = useRef<any>(null);
  const investmentExcelRef = useRef<any>(null);
  const marketExcelRef = useRef<any>(null);
  
  // Get the current active ref based on category
  const getCurrentRef = () => {
    switch (activeMainCategory) {
      case 'rental': return rentalExcelRef;
      case 'financial': return financialExcelRef;
      case 'investment': return investmentExcelRef;
      case 'market': return marketExcelRef;
      default: return rentalExcelRef;
    }
  };

  // Function to get initial data for sheets
  const getInitialDataForSheet = (sheetId: string) => {
    console.log("Getting data for sheet ID:", sheetId);
    // Placeholder data - would be replaced with actual data in a real implementation
    const initialData: Record<string, any[][]> = {
      // Example data for rental performance
      'overview': [
        ['Residential Portfolio Overview', 'Value', 'Notes'],
        ['Property Name', propertyName || 'West Broadway 502', ''],
        ['Address', '502 West Broadway', 'Boston, MA 02127'],
        ['Property Type', 'Residential', 'Multi-family'],
        ['Year Built', '1998', 'Renovated in 2018'],
        ['Square Footage', '28,500', ''],
        ['Number of Units', '42', ''],
        ['Occupancy Rate', occupancy ? `${occupancy}%` : '96%', ''],
        ['Property Value', propertyValue ? `$${propertyValue.toLocaleString()}` : '$3,250,000', ''],
        ['Purchase Date', 'June 10, 2021', ''],
        ['Annual ROI', roi ? `${roi}%` : '8.2%', '']
      ],
      
      'rent-roll': [
        ['Unit', 'Type', 'Tenant', 'Move-in Date', 'Lease End', 'Monthly Rent', 'Status'],
        ['101', 'Studio', 'Sara Johnson', '01/15/2022', '01/14/2023', '$1,250', 'Current'],
        ['102', '1-BR', 'Mike Chen', '03/01/2022', '02/28/2023', '$1,650', 'Current'],
        ['103', '1-BR', 'Emma Wilson', '04/10/2022', '04/09/2023', '$1,650', 'Current'],
        ['104', '2-BR', 'James & Maria Rodriguez', '02/15/2022', '02/14/2023', '$2,200', 'Current'],
        ['105', 'Studio', 'David Kim', '12/01/2022', '11/30/2023', '$1,300', 'Current'],
        ['106', '1-BR', 'VACANT', '', '', '$1,700', 'Vacant'],
        ['107', '2-BR', 'Thomas & Lisa Brown', '08/15/2022', '08/14/2023', '$2,250', 'Current'],
        ['108', '2-BR', 'Nicole Garcia', '05/01/2022', '04/30/2023', '$2,200', 'Past Due']
      ],
      
      'vacancy': [
        ['Vacancy Analysis', 'Current Month', 'Previous Month', '3-Month Avg', 'YTD Avg'],
        ['Vacancy Rate', '4.8%', '2.4%', '3.2%', '3.5%'],
        ['Average Days Vacant', '21', '18', '20', '22'],
        ['Turnover Rate', '4.8%', '7.1%', '5.6%', '4.2%'],
        ['Lost Rental Income', '$3,400', '$1,650', '$2,867', '$2,450'],
        ['', '', '', '', ''],
        ['Vacancy by Unit Type', 'Total Units', 'Vacant Units', 'Vacancy Rate', 'Avg. Days Vacant'],
        ['Studio', '10', '0', '0.0%', '0'],
        ['1-Bedroom', '18', '1', '5.6%', '21'],
        ['2-Bedroom', '12', '0', '0.0%', '0'],
        ['3-Bedroom', '2', '1', '50.0%', '35']
      ],
      
      // Financial Statements
      'income-statement': [
        ['Income Statement', 'Current Month', 'Previous Month', 'YTD', 'Annual Budget'],
        ['INCOME', '', '', '', ''],
        ['Rental Income', '$72,550', '$71,200', '$435,300', '$870,600'],
        ['Other Income', '$3,250', '$3,100', '$19,500', '$39,000'],
        ['Total Income', '$75,800', '$74,300', '$454,800', '$909,600'],
        ['', '', '', '', ''],
        ['EXPENSES', '', '', '', ''],
        ['Property Management', '$6,064', '$5,944', '$36,384', '$72,768'],
        ['Maintenance & Repairs', '$4,500', '$3,850', '$25,500', '$54,000'],
        ['Utilities', '$3,200', '$3,100', '$19,200', '$38,400'],
        ['Insurance', '$2,500', '$2,500', '$15,000', '$30,000'],
        ['Property Taxes', '$7,500', '$7,500', '$45,000', '$90,000'],
        ['Other Expenses', '$2,250', '$2,100', '$13,500', '$27,000'],
        ['Total Expenses', '$26,014', '$24,994', '$154,584', '$312,168'],
        ['', '', '', '', ''],
        ['Net Operating Income', '$49,786', '$49,306', '$300,216', '$597,432']
      ],
      
      'net-cash-flow': [
        ['Net Cash Flow', 'Current Month', 'Previous Month', 'YTD', 'Projected Annual'],
        ['Net Operating Income', '$49,786', '$49,306', '$300,216', '$597,432'],
        ['Mortgage Payment', '$18,500', '$18,500', '$111,000', '$222,000'],
        ['Capital Expenditures', '$5,000', '$2,500', '$35,000', '$60,000'],
        ['Other Financing Costs', '$750', '$750', '$4,500', '$9,000'],
        ['Net Cash Flow', '$25,536', '$27,556', '$149,716', '$306,432'],
        ['Cash-on-Cash Return', '9.4%', '10.2%', '8.8%', '9.1%']
      ],
      
      'expense-breakdown': [
        ['Expense Category', 'Current Month', 'YTD', '% of Total Expenses', 'Per Unit/Month'],
        ['Property Management', '$6,064', '$36,384', '23.5%', '$144'],
        ['Maintenance & Repairs', '$4,500', '$25,500', '16.5%', '$107'],
        ['Utilities', '$3,200', '$19,200', '12.4%', '$76'],
        ['Insurance', '$2,500', '$15,000', '9.7%', '$60'],
        ['Property Taxes', '$7,500', '$45,000', '29.1%', '$179'],
        ['Administrative', '$1,200', '$7,200', '4.7%', '$29'],
        ['Marketing', '$800', '$4,800', '3.1%', '$19'],
        ['Other Expenses', '$250', '$1,500', '1.0%', '$6'],
        ['Total Expenses', '$26,014', '$154,584', '100.0%', '$619']
      ],
      
      // Investment Analysis
      'returns': [
        ['Return Metrics', 'Current', '1-Year Ago', 'At Purchase', 'Market Avg'],
        ['Capitalization Rate', '6.8%', '6.4%', '6.2%', '6.0%'],
        ['Cash-on-Cash Return', '9.2%', '8.8%', '8.2%', '7.5%'],
        ['Gross Rent Multiplier', '8.5', '8.8', '9.2', '9.0'],
        ['Internal Rate of Return', '14.5%', '13.8%', 'N/A', '12.0%'],
        ['Equity Multiple', '1.45', '1.32', '1.0', 'N/A'],
        ['Total Return on Investment', '18.2%', '16.5%', 'N/A', '15.0%'],
        ['', '', '', '', ''],
        ['Annualized Returns', '1-Year', '3-Year', '5-Year', 'Since Purchase'],
        ['Appreciation', '5.2%', '4.8%', 'N/A', '4.2%'],
        ['Income Return', '9.2%', '8.9%', 'N/A', '8.5%'],
        ['Total Return', '14.4%', '13.7%', 'N/A', '12.7%']
      ],
      
      // Market Analysis
      'demographics': [
        ['Demographic Metrics', 'Property Zip Code', 'City Average', 'Metro Area', 'Trend'],
        ['Population Growth', '2.3%', '1.8%', '1.5%', 'Increasing'],
        ['Median Household Income', '$78,500', '$72,300', '$68,200', 'Increasing'],
        ['Median Age', '34.2', '36.8', '38.5', 'Stable'],
        ['Unemployment Rate', '3.8%', '4.2%', '4.5%', 'Decreasing'],
        ['Education (Bachelor\'s+)', '48.2%', '42.7%', '38.9%', 'Increasing'],
        ['Renter vs. Owner Occupied', '65% / 35%', '55% / 45%', '40% / 60%', 'More Renters'],
        ['Average Household Size', '2.1', '2.3', '2.5', 'Stable'],
        ['Median Commute Time', '27 min', '32 min', '35 min', 'Improving']
      ],
      
      'pricing-trends': [
        ['Rental Price Trends', 'Current', '6 Months Ago', '1 Year Ago', '3 Years Ago'],
        ['Studio - Average Rent', '$1,275', '$1,225', '$1,150', '$1,050'],
        ['1-BR - Average Rent', '$1,675', '$1,625', '$1,550', '$1,425'],
        ['2-BR - Average Rent', '$2,225', '$2,150', '$2,050', '$1,900'],
        ['3-BR - Average Rent', '$2,850', '$2,775', '$2,650', '$2,450'],
        ['Overall Average Rent', '$1,840', '$1,780', '$1,700', '$1,575'],
        ['Year-over-Year Growth', '8.2%', '7.5%', '7.9%', '5.8%'],
        ['', '', '', '', ''],
        ['Property Value Trends', 'Current', '1 Year Ago', '3 Years Ago', '5 Years Ago'],
        ['Property Value', '$3,250,000', '$3,090,000', '$2,800,000', '$2,500,000'],
        ['Value per Unit', '$77,380', '$73,570', '$66,670', '$59,520'],
        ['Value per Sq Ft', '$114', '$108', '$98', '$88'],
        ['Year-over-Year Growth', '5.2%', '4.8%', '4.0%', '3.8%']
      ]
    };

    // Fallback for any sheet ID not defined
    const result = initialData[sheetId] || [['No data available for ' + sheetId]];
    console.log("Returning data for sheet:", result);
    return result;
  };

  // Handle saving Excel sheets
  const handleSaveExcelSheet = (data: any[][], sheetName: string, sheetId: string) => {
    console.log(`Saving ${sheetName} data:`, data);
  };

  // Get current sub-categories based on active main category
  const currentSubCategories = SUB_CATEGORIES[activeMainCategory as keyof typeof SUB_CATEGORIES] || [];

  // Reset sub-category when main category changes
  const handleMainCategoryChange = (value: string) => {
    setActiveMainCategory(value);
    
    // Set appropriate default subcategory for each main category
    if (value === 'financial') {
      setActiveSubCategory('income-statement');
    } else {
      const defaultSubCategory = SUB_CATEGORIES[value as keyof typeof SUB_CATEGORIES]?.[0]?.id || '';
      setActiveSubCategory(defaultSubCategory);
    }
  };

  // Function to handle edit button click
  const handleEditClick = () => {
    const currentRef = getCurrentRef();
    if (currentRef.current) {
      currentRef.current.toggleEditMode();
    }
  };

  // Function to handle export button click
  const handleExportClick = () => {
    const currentRef = getCurrentRef();
    if (currentRef.current) {
      currentRef.current.exportToExcel();
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header with Search */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Residential Financial Hub</h1>
        <div>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search financial data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Main Category Tabs */}
      <Tabs value={activeMainCategory} onValueChange={handleMainCategoryChange} className="w-full">
        <TabsList className="w-full grid grid-cols-4 gap-2 bg-white p-1 h-auto">
          {MAIN_CATEGORIES.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="flex items-center gap-3 py-4 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activeMainCategory === category.id ? 'bg-blue-600' : 'bg-gray-400'
              }`}>
                <span className="text-white font-bold">{category.icon}</span>
              </div>
              <span className="font-medium">{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Sub-category selection */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Select financial information:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {currentSubCategories.map((subCategory) => (
              <Button
                key={subCategory.id}
                variant={activeSubCategory === subCategory.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveSubCategory(subCategory.id)}
                className="justify-start text-left"
              >
                {subCategory.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between bg-gray-50 border-b">
              <CardTitle>{currentSubCategories.find(sc => sc.id === activeSubCategory)?.name || 'Financial Data'}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleEditClick}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" onClick={handleExportClick}>
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div style={{ height: '500px' }}>
                <Suspense fallback={<div className="p-4 text-center">Loading spreadsheet...</div>}>
                  <HandsontableExcel
                    ref={getCurrentRef()}
                    data={getInitialDataForSheet(activeSubCategory)}
                    sheetName={currentSubCategories.find(sc => sc.id === activeSubCategory)?.name || 'Financial Data'}
                    onSave={(data) => handleSaveExcelSheet(
                      data,
                      currentSubCategories.find(sc => sc.id === activeSubCategory)?.name || 'Financial Data',
                      activeSubCategory
                    )}
                  />
                </Suspense>
              </div>
            </CardContent>
          </Card>
        </div>
      </Tabs>
    </div>
  );
} 