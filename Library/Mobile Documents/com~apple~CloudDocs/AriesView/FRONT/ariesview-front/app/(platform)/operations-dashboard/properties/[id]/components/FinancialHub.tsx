import { useState, useRef, Suspense, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Search, Edit, Plus, ChevronDown } from "lucide-react";
import dynamic from 'next/dynamic';

const HandsontableExcel = dynamic(() => import('./HandsontableExcel'), {
  ssr: false,
  loading: () => <div className="p-4 text-center">Loading spreadsheet...</div>
});

// Main categories for the financial hub
const MAIN_CATEGORIES = [
  { id: 'property', name: 'Property Analysis', icon: 'P' },
  { id: 'financial', name: 'Financial Statements', icon: 'F' },
  { id: 'acquisition', name: 'Acquisition Analysis', icon: 'A' },
  { id: 'tax', name: 'Tax Planning', icon: 'T' }
];

// Sub-categories for each main category
const SUB_CATEGORIES = {
  property: [
    { id: 'overview', name: 'Overview' },
    { id: 'income', name: 'Income' },
    { id: 'expenses', name: 'Expenses' },
    { id: 'financing', name: 'Financing' },
    { id: 'market', name: 'Market' },
    { id: 'metrics', name: 'Performance Metrics' },
    { id: 'valuation', name: 'Property Valuation' },
    { id: 'units', name: 'Unit Analysis' }
  ],
  financial: [
    { id: 'income-statement', name: 'Income Statement' },
    { id: 'balance-sheet', name: 'Balance Sheet' },
    { id: 'cash-flow', name: 'Cash Flow' },
    { id: 'budget', name: 'Budget' },
    { id: 'variance', name: 'Variance Analysis' },
    { id: 'ratio-analysis', name: 'Financial Ratios' },
    { id: 'profit-loss', name: 'Profit & Loss' },
    { id: 'forecasting', name: 'Financial Forecasting' }
  ],
  acquisition: [
    { id: 'summary', name: 'Summary' },
    { id: 'investment', name: 'Investment' },
    { id: 'returns', name: 'Returns' },
    { id: 'scenarios', name: 'Scenarios' },
    { id: 'comparables', name: 'Comparables' },
    { id: 'due-diligence', name: 'Due Diligence' },
    { id: 'financing-options', name: 'Financing Options' },
    { id: 'risk-assessment', name: 'Risk Assessment' }
  ],
  tax: [
    { id: 'projections', name: 'Projections' },
    { id: 'depreciation', name: 'Depreciation' },
    { id: 'deductions', name: 'Deductions' },
    { id: 'planning', name: 'Planning' },
    { id: 'compliance', name: 'Compliance' },
    { id: 'optimization', name: 'Tax Optimization' },
    { id: 'entity-structure', name: 'Entity Structure' },
    { id: 'capital-gains', name: 'Capital Gains Planning' }
  ]
};

export default function FinancialHub() {
  const [activeMainCategory, setActiveMainCategory] = useState('property');
  const [activeSubCategory, setActiveSubCategory] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Summary metrics state
  const [summaryMetrics] = useState({
    purchasePrice: '$5,200,000',
    noi: '$312,000',
    capRate: '6.0%',
    cashOnCash: '7.2%'
  });

  // Property details state
  const [propertyDetails] = useState({
    name: 'River Street Plaza',
    address: '522 River St',
    cityStateZip: 'Boston, MA 02126',
    purchaseDate: 'Mar 15, 2023',
    propertyType: 'Multi-Family',
    yearBuilt: '1992',
    units: '28',
    fund: 'Babson Real Estate Fund I'
  });

  // Use a different ref for each category to prevent conflicts
  const incomeExcelRef = useRef<any>(null);
  const expensesExcelRef = useRef<any>(null);
  const financingExcelRef = useRef<any>(null);
  const marketExcelRef = useRef<any>(null);
  const financialExcelRef = useRef<any>(null);
  const acquisitionExcelRef = useRef<any>(null);
  const taxExcelRef = useRef<any>(null);
  
  // Get the current active ref based on category
  const getCurrentRef = () => {
    switch (activeMainCategory) {
      case 'property':
        switch (activeSubCategory) {
          case 'income': return incomeExcelRef;
          case 'expenses': return expensesExcelRef;
          case 'financing': return financingExcelRef;
          case 'market': return marketExcelRef;
          default: return incomeExcelRef;
        }
      case 'financial': return financialExcelRef;
      case 'acquisition': return acquisitionExcelRef;
      case 'tax': return taxExcelRef;
      default: return incomeExcelRef;
    }
  };

  // Function to get initial data for sheets
  const getInitialDataForSheet = (sheetId: string) => {
    console.log("Getting data for sheet ID:", sheetId);
    const initialData = {
      'net-cash-flow': [
        ['Net Cash Flow for All Properties', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025', 'Total'],
        ['Income', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['Rents', '$12,500', '$12,500', '$12,500', '$12,500', '$12,750', '$12,750', '$12,750', '$12,750', '$12,750', '$12,750', '$12,750', '$12,750', '$150,000'],
        ['Section 8 Rents', '$2,400', '$2,400', '$2,400', '$2,400', '$2,400', '$2,400', '$2,400', '$2,400', '$2,400', '$2,400', '$2,400', '$2,400', '$28,800'],
        ['Short Term Rents', '$1,800', '$2,100', '$2,500', '$2,800', '$3,200', '$3,500', '$3,200', '$2,800', '$2,100', '$1,800', '$1,800', '$1,800', '$29,400'],
        ['Pet Fees', '$250', '$250', '$250', '$250', '$250', '$250', '$250', '$250', '$250', '$250', '$250', '$250', '$3,000'],
        ['Tenant Pass-Throughs', '$180', '$180', '$180', '$180', '$180', '$180', '$180', '$180', '$180', '$180', '$180', '$180', '$2,160'],
        ['Insurance Proceeds', '$0', '$0', '$0', '$0', '$0', '$3,500', '$0', '$0', '$0', '$0', '$0', '$0', '$3,500'],
        ['Cleaning & Other Upsells', '$150', '$150', '$150', '$150', '$150', '$150', '$150', '$150', '$150', '$150', '$150', '$150', '$1,800'],
        ['Total Rental Income', '$17,280', '$17,580', '$17,980', '$18,280', '$18,930', '$22,730', '$18,930', '$18,530', '$17,830', '$17,530', '$17,530', '$17,530', '$218,660'],
        ['General Income', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['Application Fees', '$125', '$75', '$100', '$50', '$75', '$100', '$125', '$50', '$75', '$25', '$25', '$50', '$875'],
        ['Late Fees', '$75', '$100', '$50', '$75', '$50', '$25', '$75', '$100', '$50', '$75', '$50', '$25', '$750'],
        ['Laundry', '$320', '$310', '$330', '$315', '$325', '$340', '$330', '$320', '$310', '$300', '$300', '$300', '$3,800'],
        ['Storage', '$175', '$175', '$175', '$175', '$175', '$175', '$175', '$175', '$175', '$175', '$175', '$175', '$2,100'],
        ['Parking', '$250', '$250', '$250', '$250', '$250', '$250', '$250', '$250', '$250', '$250', '$250', '$250', '$3,000'],
        ['Stessa Interest', '$12', '$12', '$13', '$13', '$13', '$14', '$14', '$14', '$15', '$15', '$15', '$15', '$165'],
        ['Misc Interest', '$5', '$5', '$5', '$5', '$5', '$5', '$5', '$5', '$5', '$5', '$5', '$5', '$60'],
        ['Stessa Cash Back', '$18', '$15', '$22', '$19', '$17', '$23', '$20', '$16', '$18', '$21', '$14', '$17', '$220'],
        ['Total Other Income', '$980', '$942', '$945', '$902', '$910', '$932', '$994', '$930', '$898', '$866', '$834', '$837', '$10,970'],
        ['Total Income', '$18,260', '$18,522', '$18,925', '$19,182', '$19,840', '$23,662', '$19,924', '$19,460', '$18,728', '$18,396', '$18,364', '$18,367', '$229,630'],
        ['Operating Expenses', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['General Admin & Other', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['Advertising', '$50', '$50', '$75', '$75', '$100', '$100', '$75', '$75', '$50', '$50', '$50', '$50', '$800'],
        ['Background & Credit Checks', '$35', '$25', '$35', '$20', '$25', '$35', '$40', '$25', '$25', '$15', '$15', '$20', '$315'],
        ['Travel', '$0', '$0', '$150', '$0', '$0', '$0', '$200', '$0', '$0', '$150', '$0', '$0', '$500'],
        ['Mileage', '$45', '$35', '$60', '$40', '$35', '$45', '$55', '$40', '$35', '$50', '$30', '$35', '$505'],
        ['Meals', '$30', '$25', '$45', '$25', '$30', '$35', '$40', '$30', '$25', '$35', '$20', '$25', '$365'],
        ['Office Supplies & Postage', '$25', '$20', '$25', '$20', '$25', '$30', '$25', '$20', '$25', '$20', '$25', '$20', '$280'],
        ['Software Subscriptions', '$75', '$75', '$75', '$75', '$75', '$75', '$75', '$75', '$75', '$75', '$75', '$75', '$900'],
        ['HOA Dues', '$350', '$350', '$350', '$350', '$350', '$350', '$350', '$350', '$350', '$350', '$350', '$350', '$4,200'],
        ['Bank Fees', '$15', '$15', '$15', '$15', '$15', '$15', '$15', '$15', '$15', '$15', '$15', '$15', '$180'],
        ['Education', '$0', '$0', '$250', '$0', '$0', '$0', '$0', '$0', '$250', '$0', '$0', '$0', '$500'],
        ['Gifts', '$0', '$0', '$0', '$0', '$0', '$100', '$0', '$0', '$0', '$0', '$0', '$125', '$225'],
        ['Licenses', '$0', '$0', '$0', '$250', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$250'],
        ['Rent Concessions', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$250', '$0', '$0', '$0', '$250'],
        ['Total Admin & Other', '$625', '$595', '$1,080', '$870', '$655', '$785', '$875', '$630', '$1,100', '$760', '$580', '$715', '$9,270'],
        ['General Legal & Professional', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['Legal', '$0', '$0', '$0', '$500', '$0', '$0', '$0', '$0', '$0', '$750', '$0', '$0', '$1,250'],
        ['Accounting', '$250', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$1,200', '$1,450'],
        ['Court Fees', '$0', '$0', '$0', '$150', '$0', '$0', '$0', '$0', '$0', '$175', '$0', '$0', '$325'],
        ['Eviction Fees', '$0', '$0', '$0', '$300', '$0', '$0', '$0', '$0', '$0', '$450', '$0', '$0', '$750'],
        ['Inspections', '$0', '$150', '$0', '$0', '$0', '$150', '$0', '$0', '$0', '$150', '$0', '$0', '$450'],
        ['Surveys', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0'],
        ['Appraisals', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0'],
        ['Total Legal & Professional', '$250', '$150', '$0', '$950', '$0', '$150', '$0', '$0', '$0', '$1,525', '$0', '$1,200', '$4,225'],
        ['General Insurance', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['Rental Dwelling', '$420', '$420', '$420', '$420', '$420', '$420', '$420', '$420', '$420', '$420', '$420', '$420', '$5,040'],
        ['Rental Condo', '$180', '$180', '$180', '$180', '$180', '$180', '$180', '$180', '$180', '$180', '$180', '$180', '$2,160'],
        ['Flood', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0'],
        ['Hurricane', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0'],
        ['Earthquake', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0'],
        ['Liability', '$75', '$75', '$75', '$75', '$75', '$75', '$75', '$75', '$75', '$75', '$75', '$75', '$900'],
        ['Umbrella', '$50', '$50', '$50', '$50', '$50', '$50', '$50', '$50', '$50', '$50', '$50', '$50', '$600'],
        ['Total Insurance', '$725', '$725', '$725', '$725', '$725', '$725', '$725', '$725', '$725', '$725', '$725', '$725', '$8,700'],
        ['General Management Fees', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['Property Management', '$1,385', '$1,407', '$1,438', '$1,457', '$1,507', '$1,807', '$1,513', '$1,479', '$1,425', '$1,399', '$1,397', '$1,398', '$17,612'],
        ['Service Calls', '$80', '$45', '$110', '$65', '$50', '$140', '$70', '$55', '$85', '$60', '$40', '$55', '$855'],
        ['Leasing Commissions', '$500', '$250', '$375', '$0', '$250', '$375', '$500', '$250', '$0', '$0', '$250', '$0', '$2,750'],
        ['Booking & Platform Fees', '$90', '$105', '$125', '$140', '$160', '$175', '$160', '$140', '$105', '$90', '$90', '$90', '$1,470'],
        ['Total Management Fees', '$2,055', '$1,807', '$2,048', '$1,662', '$1,967', '$2,497', '$2,243', '$1,924', '$1,615', '$1,549', '$1,777', '$1,543', '$22,687'],
        ['General Repairs & Maintenance', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['Cleaning & Janitorial', '$225', '$225', '$225', '$225', '$225', '$225', '$225', '$225', '$225', '$225', '$225', '$225', '$2,700'],
        ['Painting', '$0', '$0', '$0', '$850', '$0', '$0', '$0', '$0', '$750', '$0', '$0', '$0', '$1,600'],
        ['Electrical Repairs', '$0', '$0', '$150', '$0', '$0', '$0', '$175', '$0', '$0', '$0', '$0', '$125', '$450'],
        ['Plumbing Repairs', '$0', '$275', '$0', '$0', '$0', '$200', '$0', '$0', '$0', '$180', '$0', '$0', '$655'],
        ['HVAC Repairs', '$0', '$0', '$0', '$420', '$0', '$0', '$0', '$350', '$0', '$0', '$0', '$0', '$770'],
        ['Appliance Repairs', '$0', '$150', '$0', '$0', '$175', '$0', '$0', '$0', '$0', '$125', '$0', '$0', '$450'],
        ['Roof Repairs', '$0', '$0', '$0', '$0', '$0', '$450', '$0', '$0', '$0', '$0', '$0', '$0', '$450'],
        ['Door & Window Repairs', '$0', '$0', '$175', '$0', '$0', '$0', '$0', '$0', '$0', '$150', '$0', '$0', '$325'],
        ['Other Repairs', '$75', '$50', '$125', '$85', '$60', '$90', '$70', '$65', '$55', '$80', '$45', '$50', '$850'],
        ['Security, Locks & Keys', '$40', '$25', '$35', '$30', '$25', '$45', '$35', '$30', '$20', '$25', '$15', '$25', '$350'],
        ['Pest', '$80', '$80', '$80', '$80', '$80', '$80', '$80', '$80', '$80', '$80', '$80', '$80', '$960'],
        ['Gardening & Landscaping', '$250', '$250', '$250', '$275', '$275', '$275', '$275', '$275', '$250', '$250', '$250', '$250', '$3,125'],
        ['Snow Removal', '$150', '$100', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$100', '$150', '$500'],
        ['Pool & Spa', '$120', '$120', '$150', '$150', '$180', '$180', '$180', '$150', '$150', '$120', '$0', '$0', '$1,500'],
        ['R&M Supplies', '$75', '$65', '$85', '$70', '$65', '$80', '$75', '$65', '$60', '$70', '$55', '$60', '$825'],
        ['R&M Permits & Inspections', '$0', '$0', '$0', '$0', '$0', '$175', '$0', '$0', '$0', '$0', '$0', '$0', '$175'],
        ['Labor', '$150', '$125', '$175', '$160', '$135', '$190', '$155', '$140', '$130', '$165', '$120', '$130', '$1,775'],
        ['Linens, Soaps, & Other Consumables', '$60', '$60', '$70', '$75', '$85', '$90', '$85', '$75', '$65', '$60', '$60', '$60', '$845'],
        ['Total Repairs & Maintenance', '$1,225', '$1,525', '$1,520', '$2,420', '$1,305', '$2,080', '$1,355', '$1,455', '$1,785', '$1,530', '$950', '$1,155', '$18,305'],
        ['General Taxes', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['Property Taxes', '$1,250', '$1,250', '$1,250', '$1,250', '$1,250', '$1,250', '$1,250', '$1,250', '$1,250', '$1,250', '$1,250', '$1,250', '$15,000'],
        ['Special Assessments', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0'],
        ['City, State, & Local Taxes', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0'],
        ['Short Term Occupancy Taxes', '$90', '$105', '$125', '$140', '$160', '$175', '$160', '$140', '$105', '$90', '$90', '$90', '$1,470'],
        ['Federal Taxes', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0'],
        ['Tax Licenses & Registrations', '$0', '$0', '$0', '$0', '$150', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$150'],
        ['Total Taxes', '$1,340', '$1,355', '$1,375', '$1,390', '$1,560', '$1,425', '$1,410', '$1,390', '$1,355', '$1,340', '$1,340', '$1,340', '$16,620'],
        ['General Utilities', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['Gas', '$180', '$160', '$125', '$95', '$75', '$70', '$75', '$90', '$125', '$165', '$185', '$190', '$1,535'],
        ['Electric', '$220', '$210', '$225', '$240', '$290', '$325', '$335', '$290', '$250', '$225', '$215', '$220', '$3,045'],
        ['Gas & Electric', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0'],
        ['Garbage & Recycling', '$95', '$95', '$95', '$95', '$95', '$95', '$95', '$95', '$95', '$95', '$95', '$95', '$1,140'],
        ['Telephone, Cable & Internet', '$150', '$150', '$150', '$150', '$150', '$150', '$150', '$150', '$150', '$150', '$150', '$150', '$1,800'],
        ['Water & Sewer', '$165', '$160', '$170', '$175', '$190', '$210', '$225', '$195', '$185', '$175', '$170', '$165', '$2,185'],
        ['Heating Oil', '$120', '$95', '$70', '$0', '$0', '$0', '$0', '$0', '$65', '$95', '$115', '$125', '$685'],
        ['Total Utilities', '$930', '$870', '$835', '$755', '$800', '$850', '$880', '$820', '$870', '$905', '$930', '$945', '$10,390'],
        ['Total Operating Expenses', '$7,150', '$7,027', '$7,583', '$8,772', '$7,012', '$8,512', '$7,488', '$6,944', '$7,450', '$8,334', '$6,302', '$7,623', '$90,197'],
        ['Net Operating Income', '$11,110', '$11,495', '$11,342', '$10,410', '$12,828', '$15,150', '$12,436', '$12,516', '$11,278', '$10,062', '$12,062', '$10,744', '$139,433'],
        ['Mortgage & Loan Expenses', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['Mortgage Payment', '$3,500', '$3,500', '$3,500', '$3,500', '$3,500', '$3,500', '$3,500', '$3,500', '$3,500', '$3,500', '$3,500', '$3,500', '$42,000'],
        ['Mortgage Interest', '$2,800', '$2,795', '$2,790', '$2,785', '$2,780', '$2,775', '$2,770', '$2,765', '$2,760', '$2,755', '$2,750', '$2,745', '$33,270'],
        ['Mortgage Principal', '$700', '$705', '$710', '$715', '$720', '$725', '$730', '$735', '$740', '$745', '$750', '$755', '$8,730'],
        ['Other Loan Payment', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0'],
        ['Other Interest', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0'],
        ['Other Principal', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0'],
        ['Private Mortgage Insurance (PMI)', '$175', '$175', '$175', '$175', '$175', '$175', '$175', '$175', '$175', '$175', '$175', '$175', '$2,100'],
        ['Total Mortgages & Loans', '$3,675', '$3,675', '$3,675', '$3,675', '$3,675', '$3,675', '$3,675', '$3,675', '$3,675', '$3,675', '$3,675', '$3,675', '$44,100'],
        ['Capital Expenses', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['New Roof', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0'],
        ['New Appliances', '$0', '$0', '$0', '$1,200', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$1,200'],
        ['New HVAC', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$4,500', '$0', '$0', '$0', '$0', '$4,500'],
        ['New Flooring & Carpet', '$0', '$0', '$0', '$0', '$0', '$2,800', '$0', '$0', '$0', '$0', '$0', '$0', '$2,800'],
        ['New Doors & Windows', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$1,500', '$0', '$0', '$0', '$1,500'],
        ['New Landscaping', '$0', '$0', '$1,800', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$1,800'],
        ['New Plumbing & Electrical', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$1,200', '$0', '$1,200'],
        ['New Furniture & Equipment', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$750', '$750'],
        ['Remodeling', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0'],
        ['Total Capital Expenses', '$0', '$0', '$1,800', '$1,200', '$0', '$2,800', '$0', '$4,500', '$1,500', '$0', '$1,200', '$750', '$13,750'],
        ['Net Cash Flow', '$7,435', '$7,820', '$5,867', '$5,535', '$9,153', '$8,675', '$8,761', '$4,341', '$6,103', '$6,387', '$7,187', '$6,319', '$81,583'],
        ['Transfers', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['General Security Deposits', '$0', '$500', '$0', '$0', '$500', '$0', '$0', '$500', '$0', '$0', '$0', '$0', '$1,500'],
        ['Security Deposit Interest', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0'],
        ['General Transfers', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0'],
        ['Credit Card Payments', '$150', '$125', '$175', '$140', '$160', '$180', '$165', '$145', '$130', '$145', '$120', '$135', '$1,770'],
        ['Owner Distributions', '$7,000', '$7,000', '$5,000', '$5,000', '$8,000', '$8,000', '$8,000', '$3,500', '$5,500', '$6,000', '$6,500', '$6,000', '$75,500'],
        ['Owner Contributions', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0'],
        ['General Escrow Payments', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0'],
        ['Property Tax Escrows', '$250', '$250', '$250', '$250', '$250', '$250', '$250', '$250', '$250', '$250', '$250', '$250', '$3,000'],
        ['Insurance Escrows', '$125', '$125', '$125', '$125', '$125', '$125', '$125', '$125', '$125', '$125', '$125', '$125', '$1,500'],
        ['PMI Escrows', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0'],
        ['HOA Escrows', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0'],
        ['Down Payments', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0'],
        ['Taxes to Remit', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0'],
        ['Total Transfers', '$7,525', '$8,000', '$5,550', '$5,515', '$9,035', '$8,555', '$8,540', '$4,520', '$6,005', '$6,520', '$6,995', '$6,510', '$83,270'],
        ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['Report Created: March 29, 2025 at 8:38 AM PDT', '', '', '', '', '', '', '', '', '', '', '', '', '']
      ],
      'income': [
        ['Income Statement', '2023', '2022', 'Change', '2024 (Proj.)'],
        ['Revenue', '', '', '', ''],
        ['Rental Income - Residential', '$1,560,000', '$1,450,000', '7.6%', '$1,680,000'],
        ['Rental Income - Parking', '$48,000', '$45,000', '6.7%', '$50,000'],
        ['Other Income', '$35,000', '$32,000', '9.4%', '$38,000'],
        ['Gross Potential Income', '$1,643,000', '$1,527,000', '7.6%', '$1,768,000'],
        ['', '', '', '', ''],
        ['Less:', '', '', '', ''],
        ['Vacancy Loss', '($82,150)', '($91,620)', '-10.3%', '($70,720)'],
        ['Concessions', '($16,430)', '($15,270)', '7.6%', '($17,680)'],
        ['Bad Debt', '($8,215)', '($7,635)', '7.6%', '($8,840)'],
        ['Effective Gross Income', '$1,536,205', '$1,412,475', '8.8%', '$1,670,760'],
        ['', '', '', '', ''],
        ['Operating Expenses', '', '', '', ''],
        ['Property Management', '($76,810)', '($70,624)', '8.8%', '($83,538)'],
        ['Maintenance & Repairs', '($153,621)', '($141,248)', '8.8%', '($167,076)'],
        ['Utilities', '($92,172)', '($84,749)', '8.8%', '($100,246)'],
        ['Property Tax', '($184,345)', '($169,497)', '8.8%', '($200,491)'],
        ['Insurance', '($46,086)', '($42,374)', '8.8%', '($50,123)'],
        ['Marketing', '($15,362)', '($14,125)', '8.8%', '($16,708)'],
        ['Administrative', '($30,724)', '($28,250)', '8.8%', '($33,415)'],
        ['Total Operating Expenses', '($599,120)', '($550,867)', '8.8%', '($651,597)'],
        ['', '', '', '', ''],
        ['Net Operating Income (NOI)', '$937,085', '$861,608', '8.8%', '$1,019,163'],
        ['NOI Margin', '61.0%', '61.0%', '0.0%', '61.0%']
      ],
      'expenses': [
        ['Expense Analysis', '2023', '2022', 'Change', '2024 (Proj.)'],
        ['Operating Expenses', '', '', '', ''],
        ['Property Management', '$76,810', '$70,624', '8.8%', '$83,538'],
        ['Maintenance & Repairs', '$153,621', '$141,248', '8.8%', '$167,076'],
        ['Utilities Breakdown:', '', '', '', ''],
        ['- Electricity', '$36,869', '$33,899', '8.8%', '$40,098'],
        ['- Water/Sewer', '$27,652', '$25,425', '8.8%', '$30,074'],
        ['- Gas', '$27,652', '$25,425', '8.8%', '$30,074'],
        ['Total Utilities', '$92,172', '$84,749', '8.8%', '$100,246'],
        ['', '', '', '', ''],
        ['Fixed Expenses', '', '', '', ''],
        ['Property Tax', '$184,345', '$169,497', '8.8%', '$200,491'],
        ['Insurance Breakdown:', '', '', '', ''],
        ['- Property Insurance', '$36,869', '$33,899', '8.8%', '$40,098'],
        ['- Liability Insurance', '$9,217', '$8,475', '8.8%', '$10,025'],
        ['Total Insurance', '$46,086', '$42,374', '8.8%', '$50,123'],
        ['', '', '', '', ''],
        ['Administrative', '', '', '', ''],
        ['Marketing', '$15,362', '$14,125', '8.8%', '$16,708'],
        ['Office Expenses', '$15,362', '$14,125', '8.8%', '$16,708'],
        ['Professional Fees', '$15,362', '$14,125', '8.8%', '$16,708'],
        ['Total Administrative', '$46,086', '$42,374', '8.8%', '$50,123'],
        ['', '', '', '', ''],
        ['Total Operating Expenses', '$599,120', '$550,867', '8.8%', '$651,597'],
        ['Per Unit Per Year', '$21,397', '$19,674', '8.8%', '$23,271'],
        ['Per SF Per Year', '$12.48', '$11.48', '8.8%', '$13.57']
      ],
      'financing': [
        ['Financing Analysis', 'Current', 'At Purchase', 'Change', 'Notes'],
        ['Loan Details', '', '', '', ''],
        ['Principal Balance', '$3,900,000', '$4,000,000', '-2.5%', 'Amortizing'],
        ['Interest Rate', '4.50%', '4.50%', '0.0%', 'Fixed Rate'],
        ['Annual Debt Service', '$285,000', '$285,000', '0.0%', 'Monthly: $23,750'],
        ['Loan Term', '30 years', '30 years', '-', 'Original Term'],
        ['Term Remaining', '27.3 years', '28 years', '-2.5%', '327 months left'],
        ['', '', '', '', ''],
        ['Annual Costs', '', '', '', ''],
        ['Principal Payment', '$109,500', '$107,000', '2.3%', 'Increasing yearly'],
        ['Interest Payment', '$175,500', '$178,000', '-1.4%', 'Decreasing yearly'],
        ['Total Debt Service', '$285,000', '$285,000', '0.0%', 'Fixed payment'],
        ['', '', '', '', ''],
        ['Key Metrics', '', '', '', ''],
        ['Property Value', '$5,200,000', '$5,200,000', '0.0%', 'Recent Appraisal'],
        ['LTV Ratio', '75.0%', '76.9%', '-2.5%', 'Max: 80%'],
        ['DSCR', '1.46', '1.38', '5.8%', 'Min Required: 1.25'],
        ['Debt Yield', '10.6%', '9.8%', '8.2%', 'Strong performance']
      ],
      'market': [
        ['Market Analysis', 'Subject', 'Market Avg', 'Variance', 'Submarket'],
        ['Rental Rates ($/SF/Year)', '', '', '', ''],
        ['Studio', '$32.50', '$31.00', '4.8%', '$31.50'],
        ['1 Bedroom', '$30.00', '$28.50', '5.3%', '$29.00'],
        ['2 Bedroom', '$27.50', '$26.00', '5.8%', '$26.50'],
        ['3 Bedroom', '$25.00', '$23.50', '6.4%', '$24.00'],
        ['Average Rate', '$28.75', '$27.25', '5.5%', '$27.75'],
        ['', '', '', '', ''],
        ['Occupancy Rates', '', '', '', ''],
        ['Studio', '95%', '92%', '3.3%', '93%'],
        ['1 Bedroom', '96%', '93%', '3.2%', '94%'],
        ['2 Bedroom', '94%', '91%', '3.3%', '92%'],
        ['3 Bedroom', '92%', '89%', '3.4%', '90%'],
        ['Overall Occupancy', '94.3%', '91.3%', '3.3%', '92.3%'],
        ['', '', '', '', ''],
        ['Market Metrics', '', '', '', ''],
        ['Cap Rate', '6.0%', '5.8%', '3.4%', '5.9%'],
        ['Price per Unit', '$185,714', '$175,000', '6.1%', '$180,000'],
        ['Price per SF', '$325', '$315', '3.2%', '$320'],
        ['', '', '', '', ''],
        ['Demographics (1 Mile)', '', '', '', ''],
        ['Population', '25,000', '-', '-', 'Growing'],
        ['Median Income', '$75,000', '$72,000', '4.2%', '$73,500'],
        ['Employment Rate', '96%', '94%', '2.1%', '95%'],
        ['Population Growth', '2.3%', '1.8%', '27.8%', '2.0%']
      ],
      'investment': [
        ['Investment Analysis', 'Amount', 'Per Unit', 'Per SF', 'Notes'],
        ['Acquisition', '', '', '', ''],
        ['Purchase Price', '$5,200,000', '$185,714', '$325.00', '28 units'],
        ['Closing Costs', '$156,000', '$5,571', '$9.75', '3% of price'],
        ['Initial CapEx', '$450,000', '$16,071', '$28.13', 'Renovations'],
        ['Total Investment', '$5,806,000', '$207,357', '$362.88', ''],
        ['', '', '', '', ''],
        ['Financing', '', '', '', ''],
        ['Loan Amount', '$3,900,000', '$139,286', '$243.75', '75% LTV'],
        ['Equity Required', '$1,906,000', '$68,071', '$119.13', '25% down + costs'],
        ['', '', '', '', ''],
        ['Returns (Year 1)', '', '', '', ''],
        ['NOI', '$937,085', '$33,467', '$58.57', ''],
        ['Cash Flow', '$652,085', '$23,289', '$40.76', 'Before debt service'],
        ['Cap Rate', '6.0%', '-', '-', 'Based on purchase'],
        ['Cash on Cash', '7.2%', '-', '-', 'Unleveraged'],
        ['IRR (5-year proj)', '15.8%', '-', '-', 'With disposition']
      ],
      'returns': [
        ['5-Year Projections', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
        ['Operations', '', '', '', '', ''],
        ['Gross Income', '$1,643,000', '$1,692,290', '$1,743,059', '$1,795,351', '$1,849,211'],
        ['Vacancy Loss', '($82,150)', '($84,615)', '($87,153)', '($89,768)', '($92,461)'],
        ['Effective Income', '$1,560,850', '$1,607,676', '$1,655,906', '$1,705,583', '$1,756,751'],
        ['Operating Expenses', '($599,120)', '($617,094)', '($635,606)', '($654,675)', '($674,315)'],
        ['NOI', '$937,085', '$965,198', '$994,153', '$1,023,978', '$1,054,697'],
        ['', '', '', '', '', ''],
        ['Debt Service', '($285,000)', '($285,000)', '($285,000)', '($285,000)', '($285,000)'],
        ['Capital Expenditures', '($50,000)', '($51,500)', '($53,045)', '($54,636)', '($56,275)'],
        ['Net Cash Flow', '$602,085', '$628,698', '$656,108', '$684,342', '$713,422'],
        ['', '', '', '', '', ''],
        ['Returns', '', '', '', '', ''],
        ['Cash on Cash', '7.2%', '7.5%', '7.8%', '8.2%', '8.5%'],
        ['Cumulative Cash Flow', '$602,085', '$1,230,783', '$1,886,891', '$2,571,233', '$3,284,655'],
        ['Property Value', '$5,200,000', '$5,356,000', '$5,516,680', '$5,682,180', '$5,852,646'],
        ['Equity Multiple', '1.07x', '1.15x', '1.23x', '1.32x', '1.41x']
      ],
      'balance-sheet': [
        ['Balance Sheet', 'As of Dec 31, 2023', 'As of Dec 31, 2022', 'Change', 'Notes'],
        ['Assets', '', '', '', ''],
        ['Current Assets:', '', '', '', ''],
        ['Cash and Cash Equivalents', '$250,000', '$225,000', '11.1%', 'Operating accounts'],
        ['Accounts Receivable', '$45,000', '$42,000', '7.1%', 'Net of allowances'],
        ['Prepaid Expenses', '$35,000', '$32,000', '9.4%', 'Insurance & property tax'],
        ['Total Current Assets', '$330,000', '$299,000', '10.4%', ''],
        ['', '', '', '', ''],
        ['Fixed Assets:', '', '', '', ''],
        ['Land', '$1,040,000', '$1,040,000', '0.0%', '20% of purchase price'],
        ['Building', '$4,160,000', '$4,160,000', '0.0%', '80% of purchase price'],
        ['Improvements', '$450,000', '$350,000', '28.6%', 'Renovations'],
        ['Less: Accumulated Depreciation', '($189,091)', '($94,545)', '100.0%', 'Straight-line'],
        ['Net Fixed Assets', '$5,460,909', '$5,455,455', '0.1%', ''],
        ['', '', '', '', ''],
        ['Other Assets:', '', '', '', ''],
        ['Security Deposits Held', '$84,000', '$84,000', '0.0%', 'Tenant deposits'],
        ['Loan Costs (Net)', '$45,000', '$48,000', '-6.3%', 'Being amortized'],
        ['Total Other Assets', '$129,000', '$132,000', '-2.3%', ''],
        ['', '', '', '', ''],
        ['Total Assets', '$5,919,909', '$5,886,455', '0.6%', ''],
        ['', '', '', '', ''],
        ['Liabilities & Equity', '', '', '', ''],
        ['Current Liabilities:', '', '', '', ''],
        ['Accounts Payable', '$35,000', '$32,000', '9.4%', 'Trade payables'],
        ['Accrued Expenses', '$25,000', '$23,000', '8.7%', 'Various accruals'],
        ['Security Deposits', '$84,000', '$84,000', '0.0%', 'Tenant deposits'],
        ['Total Current Liabilities', '$144,000', '$139,000', '3.6%', ''],
        ['', '', '', '', ''],
        ['Long-term Liabilities:', '', '', '', ''],
        ['Mortgage Payable', '$3,900,000', '$4,000,000', '-2.5%', '30-year term'],
        ['Total Long-term Liabilities', '$3,900,000', '$4,000,000', '-2.5%', ''],
        ['', '', '', '', ''],
        ['Total Liabilities', '$4,044,000', '$4,139,000', '-2.3%', ''],
        ['', '', '', '', ''],
        ['Equity:', '', '', '', ''],
        ['Partner Capital', '$1,906,000', '$1,906,000', '0.0%', 'Initial investment'],
        ['Retained Earnings', '($30,091)', '($158,545)', '-81.0%', 'Cumulative earnings'],
        ['Total Equity', '$1,875,909', '$1,747,455', '7.4%', ''],
        ['', '', '', '', ''],
        ['Total Liabilities & Equity', '$5,919,909', '$5,886,455', '0.6%', '']
      ],
      'income-statement': [
        ['Income Statement', '2023', '2022', 'Change', '2024 (Proj.)'],
        ['Revenue', '', '', '', ''],
        ['Rental Income - Residential', '$1,560,000', '$1,450,000', '7.6%', '$1,680,000'],
        ['Rental Income - Parking', '$48,000', '$45,000', '6.7%', '$50,000'],
        ['Other Income', '$35,000', '$32,000', '9.4%', '$38,000'],
        ['Gross Potential Income', '$1,643,000', '$1,527,000', '7.6%', '$1,768,000'],
        ['', '', '', '', ''],
        ['Less:', '', '', '', ''],
        ['Vacancy Loss', '($82,150)', '($91,620)', '-10.3%', '($70,720)'],
        ['Concessions', '($16,430)', '($15,270)', '7.6%', '($17,680)'],
        ['Bad Debt', '($8,215)', '($7,635)', '7.6%', '($8,840)'],
        ['Effective Gross Income', '$1,536,205', '$1,412,475', '8.8%', '$1,670,760'],
        ['', '', '', '', ''],
        ['Operating Expenses', '', '', '', ''],
        ['Property Management', '($76,810)', '($70,624)', '8.8%', '($83,538)'],
        ['Maintenance & Repairs', '($153,621)', '($141,248)', '8.8%', '($167,076)'],
        ['Utilities', '($92,172)', '($84,749)', '8.8%', '($100,246)'],
        ['Property Tax', '($184,345)', '($169,497)', '8.8%', '($200,491)'],
        ['Insurance', '($46,086)', '($42,374)', '8.8%', '($50,123)'],
        ['Marketing', '($15,362)', '($14,125)', '8.8%', '($16,708)'],
        ['Administrative', '($30,724)', '($28,250)', '8.8%', '($33,415)'],
        ['Total Operating Expenses', '($599,120)', '($550,867)', '8.8%', '($651,597)'],
        ['', '', '', '', ''],
        ['Net Operating Income (NOI)', '$937,085', '$861,608', '8.8%', '$1,019,163'],
        ['NOI Margin', '61.0%', '61.0%', '0.0%', '61.0%']
      ],
      'cash-flow': [
        ['Cash Flow Statement', '2023', '2022', 'Change', '2024 (Proj.)'],
        ['Operating Activities', '', '', '', ''],
        ['Net Operating Income', '$937,085', '$861,608', '8.8%', '$1,019,163'],
        ['Non-Cash Adjustments:', '', '', '', ''],
        ['Depreciation & Amortization', '$94,546', '$94,545', '0.0%', '$94,546'],
        ['Changes in Working Capital:', '', '', '', ''],
        ['(Increase)/Decrease in Accounts Receivable', '($3,000)', '($5,000)', '-40.0%', '($2,000)'],
        ['(Increase)/Decrease in Prepaid Expenses', '($3,000)', '$2,000', '-250.0%', '($1,500)'],
        ['Increase/(Decrease) in Accounts Payable', '$3,000', '($2,000)', '-250.0%', '$1,500'],
        ['Increase/(Decrease) in Accrued Expenses', '$2,000', '$1,000', '100.0%', '$1,000'],
        ['Net Cash from Operating Activities', '$1,030,631', '$952,153', '8.2%', '$1,112,709'],
        ['', '', '', '', ''],
        ['Investing Activities', '', '', '', ''],
        ['Capital Expenditures', '($100,000)', '($95,000)', '5.3%', '($110,000)'],
        ['Building Improvements', '($50,000)', '($35,000)', '42.9%', '($45,000)'],
        ['Net Cash from Investing Activities', '($150,000)', '($130,000)', '15.4%', '($155,000)'],
        ['', '', '', '', ''],
        ['Financing Activities', '', '', '', ''],
        ['Principal Payments on Mortgage', '($100,000)', '($95,000)', '5.3%', '($105,000)'],
        ['Interest Payments', '($175,500)', '($178,000)', '-1.4%', '($172,000)'],
        ['Distributions to Owners', '($600,000)', '($500,000)', '20.0%', '($700,000)'],
        ['Net Cash from Financing Activities', '($875,500)', '($773,000)', '13.3%', '($977,000)'],
        ['', '', '', '', ''],
        ['Net Change in Cash', '$5,131', '$49,153', '-89.6%', '($19,291)'],
        ['Beginning Cash Balance', '$245,000', '$195,847', '25.1%', '$250,131'],
        ['Ending Cash Balance', '$250,131', '$245,000', '2.1%', '$230,840']
      ],
      'budget': [
        ['Annual Budget', '2024 Budget', '2023 Actual', 'Variance', 'Notes'],
        ['Revenue', '', '', '', ''],
        ['Rental Income - Residential', '$1,680,000', '$1,560,000', '7.7%', 'Assumes 3% rent increase'],
        ['Rental Income - Parking', '$50,000', '$48,000', '4.2%', 'Assumes full occupancy'],
        ['Other Income', '$38,000', '$35,000', '8.6%', 'Includes laundry & fees'],
        ['Gross Potential Income', '$1,768,000', '$1,643,000', '7.6%', ''],
        ['', '', '', '', ''],
        ['Less:', '', '', '', ''],
        ['Vacancy Loss', '($70,720)', '($82,150)', '-13.9%', 'Assumes 4% vacancy rate'],
        ['Concessions', '($17,680)', '($16,430)', '7.6%', 'New resident specials'],
        ['Bad Debt', '($8,840)', '($8,215)', '7.6%', 'Based on historical rate'],
        ['Effective Gross Income', '$1,670,760', '$1,536,205', '8.8%', ''],
        ['', '', '', '', ''],
        ['Operating Expenses', '', '', '', ''],
        ['Property Management', '($83,538)', '($76,810)', '8.8%', '5% of EGI'],
        ['Maintenance & Repairs', '($150,000)', '($153,621)', '-2.4%', 'Reduced due to recent updates'],
        ['Utilities', '($100,246)', '($92,172)', '8.8%', 'Utility increases expected'],
        ['Property Tax', '($200,491)', '($184,345)', '8.8%', 'Assessed value increase'],
        ['Insurance', '($50,123)', '($46,086)', '8.8%', 'Policy renewal with increase'],
        ['Marketing', '($16,708)', '($15,362)', '8.8%', 'Digital campaigns increase'],
        ['Administrative', '($33,415)', '($30,724)', '8.8%', 'Includes software costs'],
        ['Total Operating Expenses', '($634,521)', '($599,120)', '5.9%', ''],
        ['', '', '', '', ''],
        ['Net Operating Income (NOI)', '$1,036,239', '$937,085', '10.6%', ''],
        ['', '', '', '', ''],
        ['Capital Expenditures', '', '', '', ''],
        ['Unit Renovations', '($75,000)', '($50,000)', '50.0%', '5 units planned'],
        ['Common Area Improvements', '($40,000)', '($25,000)', '60.0%', 'Lobby renovation'],
        ['Building Systems', '($35,000)', '($25,000)', '40.0%', 'HVAC upgrades'],
        ['Total CapEx', '($150,000)', '($100,000)', '50.0%', '']
      ],
      'variance': [
        ['Variance Analysis', 'YTD Actual', 'YTD Budget', 'Variance ($)', 'Variance (%)', 'Notes'],
        ['Revenue', '', '', '', '', ''],
        ['Rental Income - Residential', '$780,000', '$800,000', '($20,000)', '-2.5%', 'Slightly below target'],
        ['Rental Income - Parking', '$24,000', '$23,000', '$1,000', '4.3%', 'Better than expected'],
        ['Other Income', '$17,500', '$18,000', '($500)', '-2.8%', 'Lower fee collection'],
        ['Gross Potential Income', '$821,500', '$841,000', '($19,500)', '-2.3%', ''],
        ['', '', '', '', '', ''],
        ['Less:', '', '', '', '', ''],
        ['Vacancy Loss', '($41,075)', '($33,640)', '($7,435)', '22.1%', 'Higher vacancies Q2'],
        ['Concessions', '($8,215)', '($8,410)', '$195', '-2.3%', 'Fewer move-in specials needed'],
        ['Bad Debt', '($4,108)', '($4,205)', '$97', '-2.3%', 'Improved tenant screening'],
        ['Effective Gross Income', '$768,102', '$794,745', '($26,643)', '-3.4%', ''],
        ['', '', '', '', '', ''],
        ['Operating Expenses', '', '', '', '', ''],
        ['Property Management', '($38,405)', '($39,737)', '$1,332', '-3.4%', 'Tied to EGI'],
        ['Maintenance & Repairs', '($78,000)', '($75,000)', '($3,000)', '4.0%', 'HVAC repairs in Q2'],
        ['Utilities', '($51,000)', '($48,000)', '($3,000)', '6.3%', 'Increased water costs'],
        ['Property Tax', '($92,173)', '($92,173)', '$0', '0.0%', 'On budget'],
        ['Insurance', '($23,043)', '($23,043)', '$0', '0.0%', 'On budget'],
        ['Marketing', '($8,500)', '($7,500)', '($1,000)', '13.3%', 'New digital campaign'],
        ['Administrative', '($15,362)', '($16,000)', '$638', '-4.0%', 'Cost savings'],
        ['Total Operating Expenses', '($306,483)', '($301,453)', '($5,030)', '1.7%', ''],
        ['', '', '', '', '', ''],
        ['Net Operating Income (NOI)', '$461,619', '$493,292', '($31,673)', '-6.4%', 'Action plan in progress'],
        ['', '', '', '', '', ''],
        ['Key Metrics', '', '', '', '', ''],
        ['NOI Margin', '60.1%', '62.1%', '-2.0%', '-3.2%', ''],
        ['Expense Ratio', '39.9%', '37.9%', '2.0%', '5.3%', '']
      ],
      'summary': [
        ['Acquisition Summary', 'Value', 'Per Unit', 'Per SF', 'Notes'],
        ['Property Details', '', '', '', ''],
        ['Purchase Price', '$5,200,000', '$185,714', '$325.00', '28 units, 16,000 SF'],
        ['Purchase Date', 'Mar 15, 2023', '', '', ''],
        ['Property Type', 'Multi-Family', '', '', 'Class B'],
        ['Location', 'Boston, MA', '', '', 'Growing submarket'],
        ['Building Age', '31 years', '', '', 'Built 1992, renovated 2015'],
        ['', '', '', '', ''],
        ['Financial Metrics', '', '', '', ''],
        ['Year 1 NOI', '$937,085', '$33,467', '$58.57', 'Stabilized'],
        ['Cap Rate', '6.0%', '', '', 'Market average: 5.8%'],
        ['Going-in Cap Rate', '5.85%', '', '', 'Before improvements'],
        ['Cash-on-Cash Return', '7.2%', '', '', 'Year 1'],
        ['IRR (5-Year)', '15.8%', '', '', 'With disposition'],
        ['Equity Multiple', '1.85x', '', '', '5-year hold'],
        ['', '', '', '', ''],
        ['Investment Structure', '', '', '', ''],
        ['Total Capitalization', '$5,806,000', '$207,357', '$362.88', 'Including closing costs'],
        ['Debt', '$3,900,000', '$139,286', '$243.75', '75% LTV, 4.5% interest'],
        ['Equity', '$1,906,000', '$68,071', '$119.13', 'Single investor'],
        ['', '', '', '', ''],
        ['Business Plan', '', '', '', ''],
        ['Strategy', 'Value-Add', '', '', 'Moderate renovation'],
        ['Hold Period', '5 years', '', '', 'Target disposition: 2028'],
        ['Exit Cap Rate', '5.75%', '', '', 'Conservative projection'],
        ['Projected Exit Value', '$5,997,000', '$214,179', '$374.81', 'Based on NOI growth']
      ],
      'scenarios': [
        ['Investment Scenarios', 'Base Case', 'Optimistic', 'Conservative', 'Notes'],
        ['Assumptions', '', '', '', ''],
        ['Rental Growth (Annual)', '3.0%', '4.5%', '2.0%', 'Market average: 3.2%'],
        ['Expense Growth (Annual)', '2.5%', '2.0%', '3.0%', 'Inflation expectations'],
        ['Vacancy Rate', '4.0%', '3.0%', '5.0%', 'Current: 4.2%'],
        ['Exit Cap Rate', '5.75%', '5.5%', '6.0%', 'Current: 6.0%'],
        ['Renovation Cost', '$450,000', '$400,000', '$500,000', '$16K/unit average'],
        ['', '', '', '', ''],
        ['5-Year Projections', '', '', '', ''],
        ['Year 5 NOI', '$1,058,000', '$1,146,000', '$978,000', ''],
        ['Exit Value', '$18,397,000', '$20,836,000', '$16,300,000', 'Based on exit cap'],
        ['Total Cash Flow', '$2,684,000', '$3,157,000', '$2,247,000', '5-year cumulative'],
        ['', '', '', '', ''],
        ['Returns', '', '', '', ''],
        ['IRR', '15.8%', '19.4%', '12.6%', 'Target: 15%+'],
        ['Equity Multiple', '1.85x', '2.14x', '1.62x', 'Target: 1.8x+'],
        ['Average Cash Yield', '7.8%', '9.1%', '6.5%', 'Years 1-5'],
        ['', '', '', '', ''],
        ['Risk Factors', '', '', '', ''],
        ['Market Risk', 'Medium', 'Low', 'High', 'Boston market stability'],
        ['Execution Risk', 'Medium', 'Low', 'Medium', 'Renovation complexity'],
        ['Interest Rate Risk', 'Low', 'Low', 'High', 'Fixed rate debt in place']
      ],
      'comparables': [
        ['Comparable Properties', 'Subject', 'Comp 1', 'Comp 2', 'Comp 3', 'Comp 4'],
        ['Property Details', '', '', '', '', ''],
        ['Address', '522 River St', '450 Main St', '78 Commonwealth', '221 Beacon St', '118 Newbury St'],
        ['Property Type', 'Multi-Family', 'Multi-Family', 'Multi-Family', 'Multi-Family', 'Multi-Family'],
        ['Year Built', '1992', '1995', '1988', '2001', '1986'],
        ['Units', '28', '32', '24', '36', '22'],
        ['Total SF', '16,000', '18,400', '13,900', '21,600', '12,100'],
        ['Avg Unit Size (SF)', '571', '575', '579', '600', '550'],
        ['', '', '', '', '', ''],
        ['Transaction Details', '', '', '', '', ''],
        ['Sale Date', 'Mar 2023', 'Jan 2023', 'Nov 2022', 'Aug 2022', 'May 2022'],
        ['Sale Price', '$5,200,000', '$5,650,000', '$4,450,000', '$7,200,000', '$3,850,000'],
        ['Price per Unit', '$185,714', '$176,563', '$185,417', '$200,000', '$175,000'],
        ['Price per SF', '$325', '$307', '$320', '$333', '$318'],
        ['Cap Rate', '6.0%', '5.8%', '5.9%', '5.6%', '6.1%'],
        ['', '', '', '', '', ''],
        ['Income/Expenses (per Unit)', '', '', '', '', ''],
        ['Annual Income', '$55,393', '$52,969', '$53,750', '$58,333', '$51,364'],
        ['Expenses', '$21,925', '$20,594', '$20,417', '$22,222', '$19,773'],
        ['NOI', '$33,467', '$32,375', '$33,333', '$36,111', '$31,591'],
        ['', '', '', '', '', ''],
        ['Notes', 'Value-add opportunity', 'Recent renovation', 'Older finishes', 'Premium location', 'Smaller units']
      ],
      'projections': [
        ['Tax Projections', '2023', '2024', '2025', '2026', '2027'],
        ['Income', '', '', '', '', ''],
        ['Rental Income', '$1,560,000', '$1,606,800', '$1,655,004', '$1,704,654', '$1,755,794'],
        ['Other Income', '$83,000', '$85,490', '$88,055', '$90,696', '$93,417'],
        ['Total Income', '$1,643,000', '$1,692,290', '$1,743,059', '$1,795,350', '$1,849,211'],
        ['', '', '', '', '', ''],
        ['Deductible Expenses', '', '', '', '', ''],
        ['Operating Expenses', '$599,120', '$617,094', '$635,606', '$654,675', '$674,315'],
        ['Mortgage Interest', '$175,500', '$172,000', '$168,500', '$165,000', '$161,500'],
        ['Property Tax', '$184,345', '$189,875', '$195,572', '$201,439', '$207,482'],
        ['Insurance', '$46,086', '$47,469', '$48,893', '$50,360', '$51,870'],
        ['', '', '', '', '', ''],
        ['Depreciation', '', '', '', '', ''],
        ['Building (27.5 years)', '$151,273', '$151,273', '$151,273', '$151,273', '$151,273'],
        ['Land Improvements (15 years)', '$34,667', '$34,667', '$34,667', '$34,667', '$34,667'],
        ['Personal Property (5 years)', '$10,400', '$16,640', '$10,000', '$6,000', '$3,600'],
        ['Total Depreciation', '$196,340', '$202,580', '$195,940', '$191,940', '$189,540'],
        ['', '', '', '', '', ''],
        ['Taxable Income', '', '', '', '', ''],
        ['Net Operating Income', '$937,085', '$965,198', '$994,153', '$1,023,978', '$1,054,697'],
        ['Less: Interest', '($175,500)', '($172,000)', '($168,500)', '($165,000)', '($161,500)'],
        ['Less: Depreciation', '($196,340)', '($202,580)', '($195,940)', '($191,940)', '($189,540)'],
        ['Taxable Income', '$565,245', '$590,618', '$629,713', '$667,038', '$703,657'],
        ['', '', '', '', '', ''],
        ['Estimated Tax (21%)', '$118,701', '$124,030', '$132,240', '$140,078', '$147,768']
      ],
      'depreciation': [
        ['Depreciation Schedule', 'Cost Basis', 'Recovery Period', 'Method', '2023', '2024', '2025', '2026', '2027'],
        ['Building Components', '', '', '', '', '', '', '', ''],
        ['Building Shell', '$4,160,000', '27.5 years', 'Straight Line', '$151,273', '$151,273', '$151,273', '$151,273', '$151,273'],
        ['', '', '', '', '', '', '', '', ''],
        ['Land Improvements', '', '', '', '', '', '', '', ''],
        ['Parking Lot', '$150,000', '15 years', 'Straight Line', '$10,000', '$10,000', '$10,000', '$10,000', '$10,000'],
        ['Landscaping', '$75,000', '15 years', 'Straight Line', '$5,000', '$5,000', '$5,000', '$5,000', '$5,000'],
        ['Fencing', '$45,000', '15 years', 'Straight Line', '$3,000', '$3,000', '$3,000', '$3,000', '$3,000'],
        ['Swimming Pool', '$125,000', '15 years', 'Straight Line', '$8,333', '$8,333', '$8,333', '$8,333', '$8,333'],
        ['Site Lighting', '$125,000', '15 years', 'Straight Line', '$8,333', '$8,333', '$8,333', '$8,333', '$8,333'],
        ['Total Land Improvements', '$520,000', '', '', '$34,667', '$34,667', '$34,667', '$34,667', '$34,667'],
        ['', '', '', '', '', '', '', '', ''],
        ['Personal Property', '', '', '', '', '', '', '', ''],
        ['Appliances', '$28,000', '5 years', 'MACRS', '$5,600', '$8,960', '$5,376', '$3,226', '$1,936'],
        ['Flooring', '$15,000', '5 years', 'MACRS', '$3,000', '$4,800', '$2,880', '$1,728', '$1,037'],
        ['Window Treatments', '$9,000', '5 years', 'MACRS', '$1,800', '$2,880', '$1,728', '$1,037', '$622'],
        ['Total Personal Property', '$52,000', '', '', '$10,400', '$16,640', '$9,984', '$5,991', '$3,595'],
        ['', '', '', '', '', '', '', '', ''],
        ['Total Depreciation', '$4,732,000', '', '', '$196,340', '$202,580', '$195,924', '$191,931', '$189,535']
      ],
      'deductions': [
        ['Deductions Analysis', '2023', 'Allowable', 'Disallowed', 'Notes'],
        ['Operating Expenses', '', '', '', ''],
        ['Property Management', '$76,810', '$76,810', '$0', 'Fully deductible'],
        ['Repairs & Maintenance', '$153,621', '$153,621', '$0', 'Ordinary & necessary'],
        ['Utilities', '$92,172', '$92,172', '$0', 'Fully deductible'],
        ['Insurance', '$46,086', '$46,086', '$0', 'Fully deductible'],
        ['Marketing', '$15,362', '$15,362', '$0', 'Fully deductible'],
        ['Administrative', '$30,724', '$30,724', '$0', 'Fully deductible'],
        ['Total Operating Expenses', '$414,775', '$414,775', '$0', ''],
        ['', '', '', '', ''],
        ['Taxes', '', '', '', ''],
        ['Property Tax', '$184,345', '$169,497', '$0', 'Fully deductible'],
        ['', '', '', '', ''],
        ['Interest', '', '', '', ''],
        ['Mortgage Interest', '$175,500', '$175,500', '$0', 'Business interest'],
        ['', '', '', '', ''],
        ['Depreciation & Amortization', '', '', '', ''],
        ['Building Depreciation', '$151,273', '$151,273', '$0', '27.5-year SL'],
        ['Land Improvements', '$34,667', '$34,667', '$0', '15-year SL'],
        ['Personal Property', '$10,400', '$10,400', '$0', '5-year MACRS'],
        ['Loan Costs Amortization', '$3,000', '$3,000', '$0', 'Amortized over loan term'],
        ['Total Depreciation & Amortization', '$199,340', '$199,340', '$0', ''],
        ['', '', '', '', ''],
        ['Capital Expenditures', '', '', '', ''],
        ['Renovation Costs', '$100,000', '$0', '$100,000', 'Must be capitalized'],
        ['Equipment Purchases', '$25,000', '$0', '$25,000', 'Must be capitalized'],
        ['Total Capital Expenditures', '$125,000', '$0', '$125,000', ''],
        ['', '', '', '', ''],
        ['Total Deductions', '$1,098,960', '$973,960', '$125,000', '']
      ],
      'planning': [
        ['Tax Planning Strategies', 'Strategy', 'Potential Benefit', 'Implementation', 'Notes'],
        ['Cost Segregation', 'Accelerate depreciation by identifying components with shorter recovery periods', '$75,000 - $125,000 NPV', 'Engage cost segregation specialist', 'Most effective for new purchases'],
        ['', '', '', '', ''],
        ['1031 Exchange', 'Defer capital gains tax by exchanging for like-kind property', '$300,000 - $500,000 tax deferral', 'Identify replacement property within 45 days', 'Consider for exit strategy'],
        ['', '', '', '', ''],
        ['Bonus Depreciation', 'Take 100% depreciation on eligible property in year placed in service', '$50,000 - $75,000 first-year benefit', 'Apply to qualifying property', 'Phase-down begins after 2022'],
        ['', '', '', '', ''],
        ['Expense vs. Capitalize', 'Properly classify repairs as expenses rather than improvements', '$15,000 - $25,000 annually', 'Document repair nature of work', 'Must meet IRS requirements'],
        ['', '', '', '', ''],
        ['Operating Structure', 'Optimize entity structure for tax efficiency', 'Varies based on circumstances', 'Consider LLC vs. Partnership', 'Review annually'],
        ['', '', '', '', ''],
        ['Qualified Business Income Deduction', 'Take advantage of 20% pass-through deduction', '$25,000 - $40,000 annually', 'Structure to maximize QBI', 'Subject to income limitations'],
        ['', '', '', '', ''],
        ['Opportunity Zone Investment', 'Defer and potentially reduce capital gains', 'Up to 15% reduction in deferred gain', 'Reinvest gains within 180 days', 'Long-term investment required'],
        ['', '', '', '', ''],
        ['Annual Gift Tax Exclusion', 'Transfer property interests to family members', '$16,000 per recipient annually', 'Structured gifting program', 'Estate planning benefit'],
        ['', '', '', '', ''],
        ['Timing of Income/Expenses', 'Accelerate expenses, defer income at year-end', '$10,000 - $20,000 timing benefit', 'December planning', 'Cash method taxpayers']
      ],
      'compliance': [
        ['Tax Compliance Calendar', 'Deadline', 'Filing Requirement', 'Notes', 'Status'],
        ['January 31', 'Issue Form 1099-MISC to vendors', 'Required for payments of $600+', 'Complete'],
        ['', '', '', '', ''],
        ['February 28', 'File Form 1099-MISC with IRS (paper)', 'Summary of all 1099s issued', 'Complete'],
        ['', '', '', '', ''],
        ['March 15', 'Partnership Tax Return (Form 1065)', 'Can request 6-month extension', 'Complete'],
        ['', '', '', '', ''],
        ['March 31', 'File Form 1099-MISC with IRS (electronic)', 'Required if filing 250+ forms', 'Complete'],
        ['', '', '', '', ''],
        ['April 15', 'Estimated Tax Payment (Q1)', 'For partners/members', 'Complete'],
        ['', '', '', '', ''],
        ['June 15', 'Estimated Tax Payment (Q2)', 'For partners/members', 'Complete'],
        ['', '', '', '', ''],
        ['September 15', 'Extended Partnership Return Due', 'Final deadline with extension', 'N/A'],
        ['September 15', 'Estimated Tax Payment (Q3)', 'For partners/members', 'Upcoming'],
        ['', '', '', '', ''],
        ['October 15', 'Extended Individual Returns Due', 'For partners/members', 'Upcoming'],
        ['', '', '', '', ''],
        ['December 31', 'Year-end tax planning', 'Income/expense timing decisions', 'Upcoming'],
        ['January 15', 'Estimated Tax Payment (Q4)', 'For partners/members', 'Upcoming'],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['Document Retention', 'Policy', '', '', ''],
        ['Tax Returns', 'Permanent', '', '', ''],
        ['Supporting Documents', '7 years', '', '', ''],
        ['Property Records', 'Until disposal + 7 years', '', '', '']
      ],
      'metrics': [
        ['Performance Metrics', 'Current', 'Previous Year', 'Change', 'Industry Avg'],
        ['Cap Rate', '6.2%', '5.8%', '+0.4%', '5.9%'],
        ['Cash on Cash Return', '7.4%', '7.1%', '+0.3%', '7.0%'],
        ['Gross Rent Multiplier', '9.8', '10.2', '-0.4', '10.0'],
        ['Debt Service Coverage Ratio', '1.42', '1.35', '+0.07', '1.30'],
        ['Operating Expense Ratio', '38.5%', '40.2%', '-1.7%', '42.0%'],
        ['Break-even Ratio', '74.3%', '76.1%', '-1.8%', '75.0%'],
        ['Price per Square Foot', '$245', '$231', '+$14', '$239'],
        ['Net Operating Income per Unit', '$9,650', '$9,120', '+$530', '$9,200']
      ],
      'valuation': [
        ['Property Valuation Methods', 'Value', 'Date', 'Notes'],
        ['Income Approach (Cap Rate)', '$5,200,000', '2023-09-15', 'Based on 6.2% cap rate'],
        ['Comparable Sales Approach', '$5,350,000', '2023-09-15', 'Based on 4 comparable properties'],
        ['Replacement Cost Approach', '$5,100,000', '2023-09-15', 'Land: $1.2M, Improvements: $3.9M'],
        ['Gross Rent Multiplier', '$5,280,000', '2023-09-15', 'Based on GRM of 9.8'],
        ['Discounted Cash Flow Analysis', '$5,425,000', '2023-09-15', '10-year projection, 8% discount rate'],
        ['Final Appraised Value', '$5,275,000', '2023-09-15', 'Weighted average of approaches'],
        ['', '', '', ''],
        ['Value-Add Opportunities', 'Potential Value Increase', 'Required Investment', 'ROI'],
        ['Renovation of Common Areas', '$150,000', '$65,000', '130%'],
        ['Unit Upgrades', '$275,000', '$125,000', '120%'],
        ['Energy Efficiency Improvements', '$80,000', '$50,000', '60%']
      ],
      'units': [
        ['Unit Analysis', 'Studio', '1-Bedroom', '2-Bedroom', '3-Bedroom', 'Total'],
        ['Number of Units', '4', '12', '10', '2', '28'],
        ['Average Size (sq ft)', '500', '750', '1,050', '1,400', '850'],
        ['Monthly Rent (avg)', '$1,250', '$1,650', '$2,100', '$2,800', '$1,800'],
        ['Rent per Sq Ft', '$2.50', '$2.20', '$2.00', '$2.00', '$2.12'],
        ['Occupancy Rate', '100%', '95%', '90%', '100%', '94%'],
        ['Annual Revenue', '$60,000', '$226,440', '$226,800', '$67,200', '$580,440'],
        ['', '', '', '', '', ''],
        ['Tenant Analysis', '', '', '', '', ''],
        ['Average Lease Term', '12 months', '14 months', '16 months', '18 months', '14.5 months'],
        ['Renewal Rate', '60%', '70%', '75%', '90%', '71%'],
        ['Average Tenant Stay', '1.8 years', '2.2 years', '2.5 years', '3.2 years', '2.3 years']
      ],
      'ratio-analysis': [
        ['Financial Ratios', 'Current', 'Previous Year', 'Change', 'Target'],
        ['Profitability Ratios', '', '', '', ''],
        ['Net Profit Margin', '35.2%', '32.8%', '+2.4%', '35.0%'],
        ['Return on Investment', '7.4%', '7.1%', '+0.3%', '8.0%'],
        ['Return on Equity', '12.8%', '12.1%', '+0.7%', '15.0%'],
        ['Gross Operating Income', '$580,440', '$552,000', '+$28,440', '$600,000'],
        ['', '', '', '', ''],
        ['Liquidity Ratios', '', '', '', ''],
        ['Current Ratio', '2.8', '2.5', '+0.3', '3.0'],
        ['Quick Ratio', '2.5', '2.2', '+0.3', '2.5'],
        ['Operating Cash Flow Ratio', '1.8', '1.6', '+0.2', '2.0'],
        ['', '', '', '', ''],
        ['Efficiency Ratios', '', '', '', ''],
        ['Operating Expense Ratio', '38.5%', '40.2%', '-1.7%', '38.0%'],
        ['Turnover Ratio', '5.2%', '6.0%', '-0.8%', '5.0%'],
        ['', '', '', '', ''],
        ['Leverage Ratios', '', '', '', ''],
        ['Debt-to-Equity', '0.65', '0.70', '-0.05', '0.60'],
        ['Loan-to-Value', '58.2%', '62.0%', '-3.8%', '55.0%'],
        ['Interest Coverage Ratio', '3.2', '2.9', '+0.3', '3.5']
      ],
      'profit-loss': [
        ['Profit & Loss Statement', '2023', '2022', 'Change', '% Change'],
        ['Revenue', '', '', '', ''],
        ['Rental Income', '$580,440', '$552,000', '$28,440', '5.2%'],
        ['Other Income', '$32,500', '$28,800', '$3,700', '12.8%'],
        ['Total Revenue', '$612,940', '$580,800', '$32,140', '5.5%'],
        ['', '', '', '', ''],
        ['Operating Expenses', '', '', '', ''],
        ['Property Management', '$30,647', '$29,040', '$1,607', '5.5%'],
        ['Maintenance & Repairs', '$48,400', '$52,300', '-$3,900', '-7.5%'],
        ['Utilities', '$24,500', '$23,200', '$1,300', '5.6%'],
        ['Insurance', '$18,400', '$17,200', '$1,200', '7.0%'],
        ['Property Taxes', '$72,000', '$69,600', '$2,400', '3.4%'],
        ['Marketing', '$6,500', '$7,200', '-$700', '-9.7%'],
        ['Administrative', '$15,600', '$15,200', '$400', '2.6%'],
        ['Other Expenses', '$9,800', '$10,200', '-$400', '-3.9%'],
        ['Total Operating Expenses', '$225,847', '$223,940', '$1,907', '0.9%'],
        ['', '', '', '', ''],
        ['Net Operating Income', '$387,093', '$356,860', '$30,233', '8.5%'],
        ['', '', '', '', ''],
        ['Debt Service', '$175,000', '$175,000', '$0', '0.0%'],
        ['Depreciation', '$86,000', '$86,000', '$0', '0.0%'],
        ['', '', '', '', ''],
        ['Net Income', '$126,093', '$95,860', '$30,233', '31.5%']
      ],
      'forecasting': [
        ['Financial Forecast', '2023 (Actual)', '2024 (Projected)', '2025 (Projected)', '2026 (Projected)', '2027 (Projected)'],
        ['Revenue', '', '', '', '', ''],
        ['Rental Income', '$580,440', '$603,658', '$627,804', '$652,916', '$679,033'],
        ['Other Income', '$32,500', '$34,125', '$35,831', '$37,623', '$39,504'],
        ['Total Revenue', '$612,940', '$637,783', '$663,635', '$690,539', '$718,537'],
        ['', '', '', '', '', ''],
        ['Operating Expenses', '', '', '', '', ''],
        ['Property Management', '$30,647', '$31,889', '$33,182', '$34,527', '$35,926'],
        ['Maintenance & Repairs', '$48,400', '$49,852', '$51,348', '$52,888', '$54,475'],
        ['Utilities', '$24,500', '$25,480', '$26,499', '$27,559', '$28,661'],
        ['Insurance', '$18,400', '$19,320', '$20,286', '$21,300', '$22,365'],
        ['Property Taxes', '$72,000', '$74,880', '$77,875', '$80,990', '$84,230'],
        ['Other Expenses', '$31,900', '$33,176', '$34,503', '$35,883', '$37,318'],
        ['Total Operating Expenses', '$225,847', '$234,597', '$243,693', '$253,147', '$262,975'],
        ['', '', '', '', '', ''],
        ['Net Operating Income', '$387,093', '$403,186', '$419,942', '$437,392', '$455,562'],
        ['', '', '', '', '', ''],
        ['Debt Service', '$175,000', '$175,000', '$175,000', '$175,000', '$175,000'],
        ['', '', '', '', '', ''],
        ['Cash Flow Before Taxes', '$212,093', '$228,186', '$244,942', '$262,392', '$280,562'],
        ['Cash-on-Cash Return', '7.4%', '7.9%', '8.5%', '9.1%', '9.7%'],
        ['', '', '', '', '', ''],
        ['Assumptions', '', '', '', '', ''],
        ['Rent Increase', '', '4.0%', '4.0%', '4.0%', '4.0%'],
        ['Expense Increase', '', '3.8%', '3.8%', '3.9%', '3.9%'],
        ['Occupancy Rate', '94%', '95%', '95%', '96%', '96%']
      ],
      'due-diligence': [
        ['Due Diligence Checklist', 'Status', 'Date Completed', 'Notes', 'Responsible Party'],
        ['Legal Documentation', '', '', '', ''],
        ['Title Report & Insurance', 'Complete', '2023-02-15', 'Clear title, no encumbrances', 'Title Company'],
        ['Property Survey', 'Complete', '2023-02-10', 'No boundary issues identified', 'Engineering Firm'],
        ['Zoning Compliance', 'Complete', '2023-02-05', 'Property zoned R-3, compliant', 'Legal Team'],
        ['Permits & Approvals', 'Complete', '2023-02-20', 'All permits in order', 'Legal Team'],
        ['', '', '', '', ''],
        ['Physical Inspection', '', '', '', ''],
        ['Building Condition', 'Complete', '2023-01-25', 'Good condition, minor repairs needed', 'Inspector'],
        ['Environmental Phase I', 'Complete', '2023-01-20', 'No environmental issues', 'Env. Consultant'],
        ['Roof Inspection', 'Complete', '2023-01-22', 'Roof has 8+ years remaining life', 'Roofing Specialist'],
        ['HVAC Systems', 'Complete', '2023-01-23', 'All units functioning, 2 need service', 'HVAC Technician'],
        ['Plumbing & Electrical', 'Complete', '2023-01-24', 'Up to code, no major issues', 'Inspector'],
        ['', '', '', '', ''],
        ['Financial Review', '', '', '', ''],
        ['Rent Roll Verification', 'Complete', '2023-02-01', 'All leases verified', 'Managing Director'],
        ['Historical Financials', 'Complete', '2023-02-02', '3 years reviewed, consistent performance', 'Accountant'],
        ['Property Tax Assessment', 'Complete', '2023-02-03', 'No pending reassessments', 'Tax Consultant'],
        ['Insurance Quotes', 'Complete', '2023-02-05', 'Coverage secured at market rates', 'Insurance Broker'],
        ['', '', '', '', ''],
        ['Market Analysis', '', '', '', ''],
        ['Rental Comps', 'Complete', '2023-01-15', 'Current rents are 5% below market', 'Broker'],
        ['Sales Comps', 'Complete', '2023-01-16', 'Purchase price is fair market value', 'Appraiser'],
        ['Demographic Trends', 'Complete', '2023-01-17', 'Strong population growth in area', 'Analyst'],
        ['Employment Trends', 'Complete', '2023-01-18', 'Major employer expanding nearby', 'Analyst']
      ],
      'financing-options': [
        ['Financing Options', 'Amount', 'Interest Rate', 'Term', 'Monthly Payment', 'Closing Costs', 'LTV', 'Notes'],
        ['Conventional Loan', '$3,450,000', '5.25%', '30 years', '$19,038', '$43,000', '65%', 'Selected option'],
        ['Agency Loan (Fannie Mae)', '$3,500,000', '5.10%', '30 years', '$19,020', '$52,500', '66%', 'Requires additional reporting'],
        ['Commercial Bank A', '$3,400,000', '5.40%', '25 years', '$20,519', '$38,000', '64%', 'Local relationship'],
        ['Commercial Bank B', '$3,550,000', '5.35%', '30 years', '$19,836', '$48,000', '67%', 'Recourse required'],
        ['Credit Union', '$3,300,000', '5.15%', '30 years', '$18,015', '$35,000', '62%', 'Limited to $3.3M'],
        ['Private Lender', '$3,700,000', '6.25%', '25 years', '$24,400', '$25,000', '70%', 'Higher interest rate'],
        ['Seller Financing', '$1,000,000', '4.75%', '10 years', '$10,436', '$5,000', '19%', 'Second position'],
        ['', '', '', '', '', '', '', ''],
        ['Loan Structure', '', '', '', '', '', '', ''],
        ['First Mortgage', '$3,450,000', '5.25%', '30 years', '$19,038', '', '65%', 'Conventional Loan'],
        ['Second Mortgage', '$800,000', '4.75%', '10 years', '$8,349', '', '15%', 'Seller Financing'],
        ['Equity', '$1,050,000', '', '', '', '', '20%', 'Investor Capital']
      ],
      'risk-assessment': [
        ['Risk Assessment', 'Probability', 'Impact', 'Risk Score', 'Mitigation Strategy'],
        ['Market Risks', '', '', '', ''],
        ['Rental Market Decline', 'Medium', 'High', '7.5', 'Diversify tenant base, competitive pricing'],
        ['Economic Downturn', 'Low', 'High', '6.0', 'Maintain cash reserves, conservative underwriting'],
        ['Interest Rate Increase', 'High', 'Medium', '7.0', 'Fixed-rate financing, interest rate cap'],
        ['Neighborhood Decline', 'Low', 'Medium', '4.5', 'Investment in community engagement'],
        ['', '', '', '', ''],
        ['Property Risks', '', '', '', ''],
        ['Deferred Maintenance', 'Medium', 'Medium', '6.0', 'Thorough inspection, repair reserve'],
        ['Major System Failure', 'Low', 'High', '6.0', 'Regular inspections, warranty contracts'],
        ['Natural Disaster', 'Low', 'High', '6.0', 'Comprehensive insurance, disaster planning'],
        ['Environmental Issues', 'Very Low', 'Very High', '5.0', 'Phase I assessment, remediation plan'],
        ['', '', '', '', ''],
        ['Financial Risks', '', '', '', ''],
        ['Loan Default', 'Low', 'Very High', '7.0', 'Debt coverage ratio >1.4, cash reserves'],
        ['Operating Cost Increases', 'Medium', 'Medium', '6.0', 'Energy efficiency, vendor contracts'],
        ['Tax Reassessment', 'Medium', 'Medium', '6.0', 'Appeal strategy, budget contingency'],
        ['', '', '', '', ''],
        ['Operational Risks', '', '', '', ''],
        ['Tenant Default', 'Medium', 'Medium', '6.0', 'Strict screening, security deposits'],
        ['Property Management Issues', 'Low', 'Medium', '4.5', 'Performance metrics, management oversight'],
        ['Legal Compliance', 'Low', 'High', '6.0', 'Legal review, compliance audits'],
        ['Vacancy Increase', 'Medium', 'High', '7.5', 'Marketing plan, tenant retention programs']
      ],
      'optimization': [
        ['Tax Optimization Strategies', 'Annual Savings', 'Implementation Cost', 'Complexity', 'Notes'],
        ['Cost Segregation Study', '$35,000', '$8,500', 'Medium', 'Accelerate depreciation deductions'],
        ['1031 Exchange Planning', '$120,000', '$15,000', 'High', 'Defer capital gains on property sale'],
        ['Energy Efficiency Credits', '$12,500', '$5,000', 'Low', 'Section 179D deductions'],
        ['Entity Restructuring', '$18,000', '$7,500', 'High', 'LLC to S-Corp conversion analysis'],
        ['Operating Expense Review', '$8,500', '$3,000', 'Low', 'Reclassify capital to operating expenses'],
        ['Repair Regulation Analysis', '$15,000', '$4,500', 'Medium', 'Maximize immediate deductions'],
        ['State & Local Tax Planning', '$6,500', '$2,500', 'Medium', 'Optimize SALT deductions'],
        ['', '', '', '', ''],
        ['Passive Activity Analysis', '', '', '', ''],
        ['Real Estate Professional Status', '$22,000', '$3,500', 'Medium', 'Requires 750+ hours annually'],
        ['Material Participation Tests', '$18,000', '$3,000', 'Medium', 'Document activity carefully'],
        ['Grouping Activities', '$8,500', '$2,500', 'Low', 'Combine properties as one activity'],
        ['', '', '', '', ''],
        ['Timing Strategies', '', '', '', ''],
        ['Income/Expense Timing', '$5,500', '$1,500', 'Low', 'Year-end planning opportunities'],
        ['Installment Sales', '$15,000', '$3,500', 'Medium', 'Spread gain recognition over time'],
        ['Opportunity Zone Investment', '$45,000', '$10,000', 'High', 'Defer & reduce capital gains']
      ],
      'entity-structure': [
        ['Entity Structure Analysis', 'LLC', 'S-Corporation', 'Partnership', 'C-Corporation', 'REIT'],
        ['Liability Protection', 'Excellent', 'Excellent', 'Limited', 'Excellent', 'Excellent'],
        ['Tax Treatment', 'Pass-Through', 'Pass-Through', 'Pass-Through', 'Double Taxation', 'Special Rules'],
        ['Self-Employment Tax', 'Yes on Active', 'Salary Only', 'Yes on Active', 'N/A', 'N/A'],
        ['Complexity/Cost', 'Low', 'Medium', 'Medium', 'High', 'Very High'],
        ['Investor Flexibility', 'High', 'Limited', 'High', 'Medium', 'High'],
        ['', '', '', '', '', ''],
        ['Current Structure', 'LLC', '', '', '', ''],
        ['Annual Filing Costs', '$1,200', '', '', '', ''],
        ['State Filing Requirements', 'Annual Report', '', '', '', ''],
        ['', '', '', '', '', ''],
        ['Recommended Structure', 'LLC', '', '', '', ''],
        ['Recommended Changes', 'Create Series LLC for Multiple Properties', '', '', '', ''],
        ['Implementation Timeline', 'Q1 2024', '', '', '', ''],
        ['Implementation Costs', '$4,500', '', '', '', ''],
        ['Annual Savings', '$8,500', '', '', '', ''],
        ['', '', '', '', '', ''],
        ['Special Considerations', '', '', '', '', ''],
        ['Multiple State Operations', 'Register in Each State', '', '', '', ''],
        ['Foreign Investors', 'Consider Blocker Corp', '', '', '', ''],
        ['Estate Planning', 'Create Gifting Structure', '', '', '', '']
      ],
      'capital-gains': [
        ['Capital Gains Planning', 'Strategy', 'Potential Tax Savings', 'Requirements', 'Timeline'],
        ['1031 Exchange', 'Defer taxes by exchanging for like-kind property', '$280,000', 'Identify within 45 days, close within 180 days', 'Plan 6+ months ahead'],
        ['Opportunity Zone Investment', 'Defer and reduce taxes by investing in QOZ', '$120,000 - $200,000', 'Invest within 180 days, hold for 10+ years', 'Need exit by 2047'],
        ['Installment Sale', 'Spread gain recognition over multiple years', '$45,000 - $70,000', 'Buyer makes payments over time', 'Immediate implementation'],
        ['Charitable Remainder Trust', 'Donate property to CRT, receive income stream', '$150,000 - $300,000', 'Irrevocable gift, partial income interest', '3+ months setup'],
        ['Delaware Statutory Trust', 'Fractional interest in institutional property', '$280,000 (as 1031)', 'Replacement property must be DST interest', '1-2 months setup'],
        ['', '', '', '', ''],
        ['Basis Calculation', 'Amount', 'Date', 'Documentation', ''],
        ['Original Purchase Price', '$3,200,000', '2015-06-15', 'Purchase Contract', ''],
        ['Capital Improvements', '$520,000', '2015-2023', 'Invoices & Receipts', ''],
        ['Depreciation Taken', '($795,000)', '2015-2023', 'Tax Returns', ''],
        ['Adjusted Basis', '$2,925,000', '2023-09-15', 'CPA Calculation', ''],
        ['', '', '', '', ''],
        ['Estimated Sale Analysis', 'Amount', 'Rate', 'Tax', ''],
        ['Projected Sale Price', '$5,800,000', '', '', ''],
        ['Adjusted Basis', '$2,925,000', '', '', ''],
        ['Taxable Gain', '$2,875,000', '', '', ''],
        ['Depreciation Recapture', '$795,000', '25%', '$198,750', ''],
        ['Long-Term Capital Gains', '$2,080,000', '20%', '$416,000', ''],
        ['Net Investment Income Tax', '$2,875,000', '3.8%', '$109,250', ''],
        ['State Taxes', '$2,875,000', '5%', '$143,750', ''],
        ['Total Estimated Tax', '', '', '$867,750', '']
      ]
    };

    // Add other spreadsheet templates as needed...

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
        <h1 className="text-2xl font-bold text-gray-900">Financial Hub</h1>
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

        {/* Summary Metrics - Show for all categories */}
        <TabsContent value="property">
          {/* Existing Property Analysis Content */}
          {activeSubCategory === 'overview' && (
            <Card className="mt-6">
              <CardHeader className="flex flex-row items-center justify-between bg-gray-50 border-b">
                <CardTitle>Property Overview</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
        </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-x-16 gap-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Property Details</h3>
                    <div className="grid grid-cols-2 gap-y-4">
                      <div className="text-gray-500">Property Name:</div>
                      <div>{propertyDetails.name}</div>
                      <div className="text-gray-500">Address:</div>
                      <div>{propertyDetails.address}</div>
                      <div className="text-gray-500">City, State, ZIP:</div>
                      <div>{propertyDetails.cityStateZip}</div>
                      <div className="text-gray-500">Purchase Date:</div>
                      <div>{propertyDetails.purchaseDate}</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Additional Information</h3>
                    <div className="grid grid-cols-2 gap-y-4">
                      <div className="text-gray-500">Property Type:</div>
                      <div>{propertyDetails.propertyType}</div>
                      <div className="text-gray-500">Year Built:</div>
                      <div>{propertyDetails.yearBuilt}</div>
                      <div className="text-gray-500">Units:</div>
                      <div>{propertyDetails.units}</div>
                      <div className="text-gray-500">Fund:</div>
                      <div>{propertyDetails.fund}</div>
                  </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {activeSubCategory === 'income' && (
            <Card className="mt-6">
              <CardHeader className="flex flex-row items-center justify-between bg-gray-50 border-b">
                <CardTitle>Income Analysis</CardTitle>
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
              <CardContent className="p-6">
                <Suspense fallback={<div className="p-4 text-center">Loading spreadsheet...</div>}>
                  <HandsontableExcel
                    key={`income-${Date.now()}`}
                    ref={incomeExcelRef}
                    data={getInitialDataForSheet('income')}
                    sheetName="Income Analysis"
                    onSave={(data) => handleSaveExcelSheet(data, 'Income Analysis', 'income')}
                  />
                </Suspense>
              </CardContent>
            </Card>
          )}
          {activeSubCategory === 'expenses' && (
            <Card className="mt-6">
              <CardHeader className="flex flex-row items-center justify-between bg-gray-50 border-b">
                <CardTitle>Expenses Analysis</CardTitle>
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
              <CardContent className="p-6">
                <Suspense fallback={<div className="p-4 text-center">Loading spreadsheet...</div>}>
                  <HandsontableExcel
                    key={`expenses-${Date.now()}`}
                    ref={expensesExcelRef}
                    data={getInitialDataForSheet('expenses')}
                    sheetName="Expenses Analysis"
                    onSave={(data) => handleSaveExcelSheet(data, 'Expenses Analysis', 'expenses')}
                  />
                </Suspense>
              </CardContent>
            </Card>
          )}
          {activeSubCategory === 'financing' && (
            <Card className="mt-6">
              <CardHeader className="flex flex-row items-center justify-between bg-gray-50 border-b">
                <CardTitle>Financing Analysis</CardTitle>
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
              <CardContent className="p-6">
                <Suspense fallback={<div className="p-4 text-center">Loading spreadsheet...</div>}>
                  <HandsontableExcel
                    key={`financing-${Date.now()}`}
                    ref={financingExcelRef}
                    data={getInitialDataForSheet('financing')}
                    sheetName="Financing Analysis"
                    onSave={(data) => handleSaveExcelSheet(data, 'Financing Analysis', 'financing')}
                  />
                </Suspense>
              </CardContent>
            </Card>
          )}
          {activeSubCategory === 'market' && (
            <Card className="mt-6">
              <CardHeader className="flex flex-row items-center justify-between bg-gray-50 border-b">
                <CardTitle>Market Analysis</CardTitle>
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
              <CardContent className="p-6">
                <Suspense fallback={<div className="p-4 text-center">Loading spreadsheet...</div>}>
                  <HandsontableExcel
                    key={`market-${Date.now()}`}
                    ref={marketExcelRef}
                    data={getInitialDataForSheet('market')}
                    sheetName="Market Analysis"
                    onSave={(data) => handleSaveExcelSheet(data, 'Market Analysis', 'market')}
                  />
                </Suspense>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="financial">
          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between bg-gray-50 border-b">
              <CardTitle>{currentSubCategories.find(c => c.id === activeSubCategory)?.name || 'Financial Statements'}</CardTitle>
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
            <CardContent className="p-6">
              <Suspense fallback={<div className="p-4 text-center">Loading spreadsheet...</div>}>
                <HandsontableExcel
                  key={`${activeSubCategory}-${Date.now()}`}
                  ref={financialExcelRef}
                  data={getInitialDataForSheet(activeSubCategory)}
                  sheetName={currentSubCategories.find(c => c.id === activeSubCategory)?.name || ''}
                  onSave={(data) => handleSaveExcelSheet(data, activeSubCategory, activeSubCategory)}
                />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="acquisition">
          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between bg-gray-50 border-b">
              <CardTitle>{currentSubCategories.find(c => c.id === activeSubCategory)?.name || 'Acquisition Analysis'}</CardTitle>
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
            <CardContent className="p-6">
              <Suspense fallback={<div className="p-4 text-center">Loading spreadsheet...</div>}>
                <HandsontableExcel
                  key={`${activeSubCategory}-${Date.now()}`}
                  ref={acquisitionExcelRef}
                  data={getInitialDataForSheet(activeSubCategory)}
                  sheetName={currentSubCategories.find(c => c.id === activeSubCategory)?.name || ''}
                  onSave={(data) => handleSaveExcelSheet(data, activeSubCategory, activeSubCategory)}
                />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax">
          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between bg-gray-50 border-b">
              <CardTitle>{currentSubCategories.find(c => c.id === activeSubCategory)?.name || 'Tax Planning'}</CardTitle>
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
            <CardContent className="p-6">
              <Suspense fallback={<div className="p-4 text-center">Loading spreadsheet...</div>}>
                <HandsontableExcel
                  key={`${activeSubCategory}-${Date.now()}`}
                  ref={taxExcelRef}
                  data={getInitialDataForSheet(activeSubCategory)}
                  sheetName={currentSubCategories.find(c => c.id === activeSubCategory)?.name || ''}
                  onSave={(data) => handleSaveExcelSheet(data, activeSubCategory, activeSubCategory)}
                />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 