'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronsUpDown, X, Filter, ArrowUp, ArrowDown, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils"
import CommercialPortfolioHeatmap from './CommercialPortfolioHeatmap';
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
// Add Recharts imports
import { 
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer 
} from 'recharts';

// Placeholder for your actual authentication hook
// import { useAuth } from '@/hooks/use-auth'; // Example import
const useAuth = () => ({ userId: 'user-123', isLoading: false }); // Placeholder implementation

// --- Types --- 
interface PropertyMonthlyData {
  month: string; // e.g., 'Jan', 'Feb'
  income: number;
  expenses: number;
  budgetIncome: number;
  budgetExpenses: number;
  // Add other monthly metrics if needed
}

interface PropertyARDetails {
  '<30': number;
  '30-60': number;
  '60-90': number;
  '>90': number;
}

interface PropertyUnitStats {
  type: string;
  occupied: number;
  vacant: number;
}

interface Property {
  id: string;
  name: string;
  location: string;
  type: string; // Office, Multifamily, Retail etc.
  fund: string;
  status: string;
  value?: number;
  noi?: number; // Often calculated, but can be stored
  occupancy?: number; // Percentage
  income?: number; // Placeholder for aggregated income used in KpiCard
  expenses?: number; // Placeholder for aggregated expenses used in KpiCard
  ownerDistribution?: number; // Placeholder 
  vacanciesCount?: number; // Placeholder 
  lateRentAmount?: number; // Placeholder 

  // Detailed data for charts (placeholders)
  monthlyData?: PropertyMonthlyData[]; 
  arDetails?: PropertyARDetails;
  unitStats?: PropertyUnitStats[];
  // Add placeholders for lease expirations, move-ins/outs if needed
}

interface AggregatedChartData {
  financialRatios: any[]; // Define specific type later
  budgetVsActual: { 
    rentalIncome: any[]; // Define specific type later
    supplies: any[];
    waterSewer: any[];
    utilities: any[];
  };
  unitsByType: any[]; // Define specific type later
  arAging: any[]; // Define specific type later
  leasesExpiring: any[]; // Define specific type later
  vacancies: any[]; // Define specific type later
  moveInOut: any[]; // Define specific type later
}

interface FilteredDashboardData extends DashboardData {
  // Aggregated KPIs needed for cards
  totalIncome: number | null;
  totalExpenses: number | null;
  totalOwnerDistribution: number | null;
  totalVacancies: number | null;
  totalLateRent: number | null;
  // Add NOI Margin
  noiMargin: number | null;

  // Add placeholder change values for KPIs
  totalIncomeChange: number | null;
  totalExpensesChange: number | null;
  ownerDistributionChange: number | null;
  totalVacanciesChange: number | null;
  lateRentChange: number | null;
  noiMarginChange: number | null;

  // Aggregated data structures for charts
  chartsData: AggregatedChartData;
}

interface DashboardData {
  totalPortfolioValue: number | null;
  portfolioValueChange: number | null;
  occupancyRate: number | null;
  occupancyRateChange: number | null;
  noi: number | null;
  noiChange: number | null;
  leasingActivity: any; // Replace with specific type
  properties: Property[];
  budgetActualTrend: any; // Replace with specific type
  heatmapGrid?: number[][]; // Make heatmap optional/calculated
}

// Reduced FilterField type
type FilterField = 'Funds' | 'Properties'; 

// Define months array needed for placeholder data generation
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// --- API/Data Fetching Simulation --- 

// Replace with your actual API call to fetch dashboard data for a specific user
async function fetchDashboardDataForUser(userId: string): Promise<DashboardData> {
  console.log(`Fetching dashboard data for user: ${userId}...`);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600)); 

  // In a real API, this data would be pre-filtered based on userId access rights
  // Here, we simulate by returning data that *could* belong to the user
  // EXPANDED with placeholder details
  const allProperties: Property[] = [
     { 
       id: 'prop1', name: '522 River St', location: 'Boston, MA', type: 'Office', fund: 'Core Fund I', status: 'Performing', 
       value: 55_000_000, noi: 1_100_000, occupancy: 98.5, 
       income: 2_500_000, expenses: 1_400_000, ownerDistribution: 150_000, vacanciesCount: 1, lateRentAmount: 500,
       // Placeholder chart data for prop1
       monthlyData: months.map(m => ({month: m, income: 180000 + Math.random()*20000, expenses: 100000 + Math.random()*15000, budgetIncome: 200000, budgetExpenses: 110000})),
       arDetails: { '<30': 5000, '30-60': 1500, '60-90': 500, '>90': 100 },
       unitStats: [{type: 'Office Suite A', occupied: 50, vacant: 1}, {type: 'Office Suite B', occupied: 40, vacant: 0}],
     },
     { 
       id: 'prop2', name: 'Highland Towers', location: 'Cambridge, MA', type: 'Multifamily', fund: 'Core Fund I', status: 'Performing', 
       value: 72_000_000, noi: 1_500_000, occupancy: 96.2, 
       income: 3_200_000, expenses: 1_700_000, ownerDistribution: 200_000, vacanciesCount: 5, lateRentAmount: 2500,
       // Placeholder chart data for prop2
       monthlyData: months.map(m => ({month: m, income: 250000 + Math.random()*25000, expenses: 120000 + Math.random()*20000, budgetIncome: 260000, budgetExpenses: 130000})),
       arDetails: { '<30': 8000, '30-60': 3500, '60-90': 1500, '>90': 1000 },
       unitStats: [
         { type: '1BR', occupied: 80, vacant: 2 }, 
         { type: '2BR', occupied: 120, vacant: 3 },
         { type: '3BR', occupied: 50, vacant: 0 }
       ],
     },
     { 
       id: 'prop3', name: 'Sunset Gardens', location: 'Somerville, MA', type: 'Mixed-Use', fund: 'Value-Add Fund II', status: 'Watch', 
       value: 35_000_000, noi: 650_000, occupancy: 88.0, 
       income: 1_800_000, expenses: 1_150_000, ownerDistribution: 80_000, vacanciesCount: 10, lateRentAmount: 8000,
        // Placeholder chart data for prop3
       monthlyData: months.map(m => ({month: m, income: 140000 + Math.random()*10000, expenses: 90000 + Math.random()*10000, budgetIncome: 150000, budgetExpenses: 95000})),
       arDetails: { '<30': 4000, '30-60': 6500, '60-90': 2500, '>90': 5000 },
       unitStats: [{type: 'Retail A', occupied: 10, vacant: 1}, {type: '2BR', occupied: 40, vacant: 9}],
    },
     { 
       id: 'prop4', name: 'Metropolitan Plaza', location: 'Boston, MA', type: 'Retail', fund: 'Value-Add Fund II', status: 'Performing', 
       value: 28_500_000, noi: 550_000, occupancy: 92.1, 
       income: 1_200_000, expenses: 650_000, ownerDistribution: 90_000, vacanciesCount: 3, lateRentAmount: 1200,
       // Placeholder chart data for prop4
       monthlyData: months.map(m => ({month: m, income: 90000 + Math.random()*10000, expenses: 50000 + Math.random()*5000, budgetIncome: 100000, budgetExpenses: 55000})),
       arDetails: { '<30': 6000, '30-60': 1000, '60-90': 200, '>90': 0 },
       unitStats: [{type: 'Retail Space', occupied: 20, vacant: 3}],
     },
     { 
       id: 'prop5', name: 'Lakeside Villas', location: 'Newton, MA', type: 'Multifamily', fund: 'Opportunistic Fund III', status: 'Watch', 
       value: 28_000_000, noi: 400_000, occupancy: 94.0, 
       income: 950_000, expenses: 550_000, ownerDistribution: 50_000, vacanciesCount: 8, lateRentAmount: 5500,
       // Placeholder chart data for prop5
       monthlyData: months.map(m => ({month: m, income: 70000 + Math.random()*10000, expenses: 40000 + Math.random()*8000, budgetIncome: 80000, budgetExpenses: 45000})),
       arDetails: { '<30': 3000, '30-60': 2500, '60-90': 3000, '>90': 2000 },
       unitStats: [{type: '1BR', occupied: 40, vacant: 4}, {type: '2BR', occupied: 60, vacant: 4}],
     }
  ];
  
  // Simulate user having access to specific properties/funds (replace with real logic)
  const userAccessiblePropertyIds = ['prop1', 'prop2', 'prop4', 'prop5'];
  const userProperties = allProperties.filter(p => userAccessiblePropertyIds.includes(p.id));

  // Simulate calculating KPIs based *only* on user-accessible properties
  const totalPortfolioValue = userProperties.reduce((sum, p) => sum + (p.value ?? 0), 0);
  const noi = userProperties.reduce((sum, p) => sum + (p.noi ?? 0), 0);
  const occupancyRate = userProperties.length > 0 
      ? userProperties.reduce((sum, p) => sum + (p.occupancy ?? 0), 0) / userProperties.length
      : 0;

  return {
    totalPortfolioValue: totalPortfolioValue,
    portfolioValueChange: 0.025, // Example change for this user subset
    occupancyRate: occupancyRate,
    occupancyRateChange: 0.011, // Example change
    noi: noi,
    noiChange: -0.005, // Example change
    leasingActivity: { labels: ['Q1', 'Q2', 'Q3', 'Q4'], datasets: [{ label: 'New Leases', data: [30, 25, 35, 29] }, { label: 'Renewals', data: [70, 80, 68, 85] }] }, // Example data
    properties: userProperties, // Crucially, only return properties the user can see
    budgetActualTrend: { // Example budget data for this user subset
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        { label: 'Actual NOI', data: [480, 520, 510, 550, 530, 560, 580], borderColor: 'rgba(54, 162, 235, 1)', backgroundColor: 'rgba(54, 162, 235, 0.1)', fill: true, tension: 0.4 },
        { label: 'Budget NOI', data: [500, 510, 520, 530, 540, 550, 560], borderColor: 'rgba(255, 99, 132, 1)', borderDash: [5, 5], fill: false, tension: 0.4 }
      ]
    },
  };
}

// --- Helper Functions --- 
// ... (formatPercentageChange, formatCurrency, extractState remain the same) ...
const formatPercentageChange = (change: number | null | undefined) => {
  if (change === null || change === undefined) return <span className="text-gray-500">N/A</span>;
  const sign = change > 0 ? '+' : '';
  const color = change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-gray-500';
  const icon = change > 0 ? 
    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" /> : 
    <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />;

  return (
    <span className={`${color} flex items-center`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
        {icon}
      </svg>
      {sign}{(Math.abs(change) * 100).toFixed(1)}%
    </span>
  );
};

// Helper to format currency (simplified) - updated to handle larger numbers better for placeholders
const formatCurrency = (value: number | undefined | null, decimals = 0): string => {
  if (value === null || value === undefined) return 'N/A';
  // Keep full number formatting for these examples
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
};

// Helper to extract State from location string (simple example)
const extractState = (location: string | undefined): string | null => {
  if (!location) return null;
  const parts = location.split(', ');
  return parts.length > 1 ? parts[parts.length - 1] : null;
};

// Helper function to get property names from IDs (similar to Heatmap component)
const getDisplayPropertyNames = (selectedIds: Set<string>, availableProps: { value: string; label: string }[]): string => {
  if (selectedIds.size === 0) return "All";
  const names = Array.from(selectedIds)
    .map(id => availableProps.find(p => p.value === id)?.label ?? id)
    .slice(0, 2); // Limit to first 2 names for brevity in this context
  let nameString = names.join(', ');
  if (selectedIds.size > 2) {
    nameString += `, +${selectedIds.size - 2} more`;
  }
  return nameString;
};

// Helper function to format selected funds (similar to Heatmap component)
const getDisplayFundNames = (selectedFunds: Set<string>): string => {
   if (selectedFunds.size === 0) return "All";
   const names = Array.from(selectedFunds).slice(0, 2); // Limit to first 2
   let nameString = names.join(', ');
    if (selectedFunds.size > 2) {
        nameString += `, +${selectedFunds.size - 2} more`;
    }
   return nameString;
}

// Helper component for KPI cards - Updated to show change context
const KpiCard = ({ title, value, isCurrency = true, changeValue, comparisonPeriod }) => {
  // Format main value
  const formattedValue = typeof value === 'number' && isCurrency 
    ? formatCurrency(value) 
    : (value !== null && value !== undefined ? value.toString() : 'N/A'); // Handle non-currency numbers/strings

  // Only show change context if value is non-zero/valid and change details are provided
  const isValidValue = value !== null && value !== undefined && value !== 0 && value !== '0' && value !== '0.0%'; // Add more zero checks if needed
  const showChange = isValidValue && changeValue !== null && changeValue !== undefined && comparisonPeriod;
  
  return (
    <Card className="rounded-lg shadow-md border border-gray-200 p-4 bg-white text-center hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="p-0 pb-1">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 pt-1">
        <p className={`text-2xl font-bold text-slate-900`}>{formattedValue}</p>
        {/* Display change % and comparison period if available */} 
        {showChange ? (
          <div className="flex items-center justify-center mt-1 text-xs"> {/* Smaller text */}
            {formatPercentageChange(changeValue)} 
            <span className="text-gray-500 ml-1">vs {comparisonPeriod}</span>
          </div>
        ) : (
           <div className="h-5 mt-1"></div> // Placeholder div to maintain height when no change shown
        )}
      </CardContent>
    </Card>
  );
};

// --- Financial Dashboard Component Code (Integrated) --- 

// Custom circular progress component (Integrated from provided code)
const CircularProgress = ({ value, title, subtext, colorFunc }: { value: number, title: string, subtext: string, colorFunc: (value: number) => string }) => {
    const radius = 50;
    const strokeWidth = 10;
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    // Adjust offset calculation for potentially negative values if needed, using Math.abs for visual progress
    const progress = Math.min(100, Math.abs(value)); // Cap progress at 100%
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    
    return (
      <div className="flex flex-col items-center p-2">
        <div className="text-sm font-semibold mb-1 h-10 flex items-center justify-center text-center">{title}</div> {/* Ensure consistent height */}
        <div className="text-xs text-gray-500 mb-2 h-8 text-center">{subtext}</div> {/* Ensure consistent height */}
        <div className="relative">
          <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
            <circle
              stroke="#e0e0e0"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <circle
              stroke={colorFunc(value)} // Use original value for color logic
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.35s' }} // Add transition
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>
          <div 
            className="absolute inset-0 flex items-center justify-center font-bold text-lg"
            style={{ color: colorFunc(value) }} // Use original value for color logic
          >
            {value > 0 ? '+' : ''}{value}%
          </div>
        </div>
      </div>
    );
  };

// Budget vs Actual Chart Component (Integrated from provided code)
const BudgetVsActualChart = ({ data, max }: { data: any[], max: number }) => {
    // Local formatCurrency specific to this chart if needed, or use the global one
    const formatTick = (value: number) => {
        if (value === 0) return '$0';
        return `$${(value / 1000).toFixed(0)}K`;
    };

    const formatTooltipValue = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
      <div className="flex flex-col h-full">
        <div className="flex-grow">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 5, left: -25, bottom: 0 }} // Adjusted margins
              barSize={16}
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" hide={true} />
              <YAxis 
                domain={[0, max]} 
                tickFormatter={formatTick}
                width={40} // Adjust width if needed
                fontSize={10}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip formatter={formatTooltipValue} cursor={{fill: 'rgba(206, 206, 206, 0.2)'}} />
              <Bar dataKey="actual" fill="#888" radius={[4, 4, 0, 0]}> {/* Add radius */}
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.actualColor} />
                ))}
              </Bar>
              {/* Line for budget */}
              <Line type="monotone" dataKey="budget" stroke="#6b7280" strokeWidth={2} dot={false} strokeDasharray="5 5" name="Budget" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

// Financial Dashboard Component (Integrated from provided code)
const FinancialDashboard = () => {
  // Financial Ratio data
  const financialRatioData = [
    { 
      title: "Rent / Op Exp Ratio", 
      subtext: "Rental Income / Operating Income",
      value: -45, 
      color: (value: number) => value < 0 ? "#ef5350" : "#4CAF50"
    },
    { 
      title: "Op Exp / Total Exp Ratio", 
      subtext: "Operating Expense / Total Expense",
      value: 122, 
      color: (value: number) => value > 100 ? "#ef5350" : "#4CAF50" // Example logic
    },
    { 
      title: "Rent / Op Income Ratio", 
      subtext: "Rental Income / Operating Income",
      value: 77, // Made positive for variety 
      color: (value: number) => value < 80 ? "#FFC107" : "#4CAF50" // Example logic
    },
  ];
  
  // Budget vs Actual data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Simplified data for demonstration
  const rentalIncomeData = months.map(m => ({ month: m, actual: Math.random() * 5000 + 10000, budget: 15000, actualColor: Math.random() > 0.6 ? '#4CAF50' : Math.random() > 0.3 ? '#FFC107' : '#ef5350' }));
  const suppliesData = months.map(m => ({ month: m, actual: Math.random() * 7000 + 3000, budget: 10000, actualColor: Math.random() > 0.6 ? '#4CAF50' : Math.random() > 0.3 ? '#FFC107' : '#ef5350' }));
  const waterSewerData = months.map(m => ({ month: m, actual: Math.random() * 8000 + 2000, budget: 10000, actualColor: Math.random() > 0.6 ? '#4CAF50' : Math.random() > 0.3 ? '#FFC107' : '#ef5350' }));
  const utilitiesData = months.map(m => ({ month: m, actual: Math.random() * 9000 + 1000, budget: 10000, actualColor: Math.random() > 0.6 ? '#4CAF50' : Math.random() > 0.3 ? '#FFC107' : '#ef5350' }));
  
  // Units by Type data
  const unitsTypeData = [
    { type: '4BR 2BA', occupied: 150, vacant: 25 },
    { type: '3BR 2BA', occupied: 280, vacant: 40 },
    { type: '3BR 1BA', occupied: 180, vacant: 30 },
    { type: '2BR 1BA', occupied: 350, vacant: 65 },
    { type: '1BR 1BA', occupied: 650, vacant: 75 },
  ];
  
  // A/R Aging data
  const arAgingData = [
    { name: '< 30 Days', value: 101000, color: '#4CAF50' },
    { name: '< 60 Days', value: 263000, color: '#FFC107' },
    { name: '< 90 Days', value: 124000, color: '#FF9800' },
    { name: '> 90 Days', value: 782000, color: '#ef5350' },
  ];
  
  // Leases Expiring data
  const leasesExpiringData = [
    { period: '7 Days', count: 12 },
    { period: '30 Days', count: 35 },
    { period: '60 Days', count: 53 },
    { period: '90 Days', count: 94 },
  ];
  
  // Vacancies data
  const vacanciesData = [
    { name: 'Occupied', value: 1400, color: '#4b5563' }, // Darker Gray
    { name: 'Available', value: 127, color: '#FFC107' },
    { name: 'Inactive', value: 53, color: '#ef5350' },
  ];
  
  // Move In/Move Out data
  const moveData = months.map(m => ({
      month: m,
      moveOuts: Math.floor(Math.random() * 40 + 10),
      moveIns: Math.floor(Math.random() * 40 + 10)
  }));
  
  // Convert units data for horizontal bar chart
  const unitsByTypeChartData = unitsTypeData.map(item => ({
    name: item.type,
    occupied: item.occupied,
    vacant: item.vacant,
  })).reverse(); // Reverse to match the image order
  
  // Use global formatCurrency defined earlier if available and suitable
  // Otherwise, keep this local version:
  const formatChartCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="flex flex-col bg-gray-50 p-0 mt-6"> {/* Remove padding here, apply in cards */}
      
      {/* Financial Ratios */}
      <Card className="mb-6 rounded-lg shadow-md border border-gray-200"> {/* Consistent Card Styling */}
          <CardHeader> 
              <CardTitle>Financial Ratios</CardTitle>
          </CardHeader>
          <CardContent className="p-4"> {/* Consistent Padding */}
            <div className="flex flex-wrap justify-around gap-4"> 
              {financialRatioData.map((ratio, index) => (
                <div key={index} className="p-2 min-w-[160px]"> {/* Adjusted min-width */}
                  <CircularProgress 
                    value={ratio.value} 
                    title={ratio.title} 
                    subtext={ratio.subtext} 
                    colorFunc={ratio.color} 
                  />
                </div>
              ))}
            </div>
          </CardContent>
      </Card>
      
      {/* Budget vs Actual */}
      <Card className="mb-6 rounded-lg shadow-md border border-gray-200">
        <CardHeader>
           <CardTitle>Budget vs Actual</CardTitle>
        </CardHeader>
        <CardContent className="p-4"> {/* Consistent Padding */}
          <div className="grid grid-cols-1 gap-y-4">
            {[ 
              { title: "Rental Income", data: rentalIncomeData, max: 20000 },
              { title: "Supplies & Materials", data: suppliesData, max: 15000 },
              { title: "Total Water and Sewer", data: waterSewerData, max: 15000 },
              { title: "Utilities", data: utilitiesData, max: 18000 }
            ].map(chart => (
              <div key={chart.title} className="flex border-b border-gray-200 pb-2 last:border-b-0">
                  <div className="w-40 text-sm font-medium pr-2 flex items-center shrink-0">{chart.title}</div> {/* Added shrink-0 */}
                  <div className="flex-grow h-24"> {/* Standardized height */}
                      <BudgetVsActualChart data={chart.data} max={chart.max} />
                  </div>
              </div>
            ))}
            {/* Add Month Labels Row */}
            <div className="flex mt-1">
                <div className="w-40 shrink-0"></div> {/* Spacer */}
                <div className="flex-grow flex justify-between pl-1 pr-3"> {/* Adjusted padding */}
                  {months.map((month, index) => (
                      <div key={index} className="text-xs text-gray-500 flex-1 text-center">{month}</div>
                  ))}
                </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid for remaining charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Units by Type */}
        <Card className="rounded-lg shadow-md border border-gray-200"> 
            <CardHeader>
               <CardTitle>Units by Type</CardTitle>
            </CardHeader>
            <CardContent className="p-4"> {/* Consistent Padding */}
              <div className="text-xs flex mb-2">
                <div className="flex items-center mr-4">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                  <span>Vacant</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-700 mr-1"></div>
                  <span>Occupied</span>
                </div>
              </div>
              <div className="h-64"> {/* Standardized height */}
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={unitsByTypeChartData}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" fontSize={10} axisLine={false} tickLine={false}/>
                    <YAxis dataKey="name" type="category" fontSize={10} width={60} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="occupied" stackId="a" fill="#4b5563" name="Occupied" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="vacant" stackId="a" fill="#FFC107" name="Vacant" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
        </Card>
        
        {/* A/R Aging */}
        <Card className="rounded-lg shadow-md border border-gray-200">
            <CardHeader>
                <CardTitle>A/R Aging</CardTitle>
            </CardHeader>
            <CardContent className="p-4"> {/* Consistent Padding */}
              <div className="h-64"> {/* Standardized height */}
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={arAgingData}
                    layout="horizontal"
                    margin={{ top: 5, right: 20, left: 5, bottom: 0 }} // Adjusted margins
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                    <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis 
                      type="number" 
                      domain={[0, 'auto']} 
                      tickFormatter={(value) => `$${(value/1000).toFixed(0)}K`} 
                      fontSize={10}
                      axisLine={false}
                      tickLine={false}
                      width={40}
                    />
                    <Tooltip formatter={formatChartCurrency} cursor={{fill: 'rgba(206, 206, 206, 0.2)'}}/>
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}> 
                      {arAgingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
        </Card>
        
        {/* Vacancies */} 
        <Card className="rounded-lg shadow-md border border-gray-200">
            <CardHeader>
                <CardTitle>Vacancies</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex items-center justify-center h-64"> {/* Consistent Padding & Height */}
               <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                   <Pie
                       data={vacanciesData}
                       cx="50%"
                       cy="50%"
                       innerRadius={60} 
                       outerRadius={90} 
                       fill="#8884d8"
                       paddingAngle={5}
                       dataKey="value"
                   >
                       {vacanciesData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                   </Pie>
                   <Tooltip formatter={(value: number) => `${value} Units`} />
                   {/* Adjusted Legend styling */}
                   <Legend 
                       layout="vertical" 
                       verticalAlign="middle" 
                       align="right" 
                       iconType="circle" 
                       wrapperStyle={{ paddingLeft: '10px' }} // Add padding to legend
                       formatter={(value, entry: any) => { // Type entry explicitly
                           const { color, payload } = entry;
                           return <span style={{ color: color }} className="text-sm"><span className="font-medium">{payload.name}</span> ({payload.value})</span>;
                       }}
                   />
                   </PieChart>
               </ResponsiveContainer>
            </CardContent>
        </Card>
        
        {/* Leases Expiring */}
        <Card className="rounded-lg shadow-md border border-gray-200">
             <CardHeader>
                <CardTitle>Leases Expiring</CardTitle>
            </CardHeader>
            <CardContent className="p-4"> {/* Consistent Padding */}
                <div className="grid grid-cols-2 gap-4 h-64 items-stretch"> {/* Use items-stretch */}
                    {leasesExpiringData.map((item, index) => (
                    <div key={index} className="flex flex-col justify-center items-center border rounded p-4 h-full bg-gray-50"> {/* Ensure full height */}
                        <div className="text-sm text-gray-600 mb-1">Next {item.period}</div>
                        <div className="text-3xl font-bold text-slate-900">{item.count}</div> {/* Changed text-4xl to text-3xl */}
                    </div>
                    ))}
                </div>
            </CardContent>
        </Card>
        
        {/* Move In/Move Out */} 
        <Card className="md:col-span-2 rounded-lg shadow-md border border-gray-200"> 
            <CardHeader>
                <CardTitle>Move In / Move Out</CardTitle>
            </CardHeader>
            <CardContent className="p-4"> {/* Consistent Padding */}
                <div className="text-xs flex mb-2">
                    <div className="flex items-center mr-4">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                    <span>Move Outs</span>
                    </div>
                    <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-700 mr-1"></div>
                    <span>Move Ins</span>
                    </div>
                </div>
                <div className="h-64"> {/* Standardized height */}
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={moveData}
                        margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                        <XAxis dataKey="month" fontSize={10} axisLine={false} tickLine={false}/>
                        <YAxis domain={[0, 'auto']} fontSize={10} axisLine={false} tickLine={false} width={30}/>
                        <Tooltip />
                        <Legend verticalAlign="top" height={30}/>
                        <Bar dataKey="moveOuts" fill="#FFC107" name="Move Outs" radius={[4, 4, 0, 0]}/>
                        <Bar dataKey="moveIns" fill="#4b5563" name="Move Ins" radius={[4, 4, 0, 0]}/>
                    </BarChart>
                    </ResponsiveContainer>
                </div>
             </CardContent>
        </Card>
      </div>
    </div>
  );
};

// --- Component --- 
export default function ExecutiveDashboard() {
  const router = useRouter();
  const { userId, isLoading: isAuthLoading } = useAuth(); // Use your auth hook

  // --- State for fetched data, loading, error --- 
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // --- Filter State (Reduced) --- 
  const [selectedFunds, setSelectedFunds] = useState<Set<string>>(new Set());
  const [selectedProperties, setSelectedProperties] = useState<Set<string>>(new Set());

  // --- Date Range State --- 
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Default to start of current month
    to: new Date(), // Default to today
  });

  // --- Fetch Data on Mount or when UserID changes --- 
  useEffect(() => {
    if (userId) { // Only fetch if we have a user ID
      setIsLoading(true);
      // TODO: Pass date range to fetch function when API supports it
      fetchDashboardDataForUser(userId) 
        .then(data => {
          setDashboardData(data);
          setError(null);
        })
        .catch(err => {
          console.error("Error fetching dashboard data:", err);
          setError(err instanceof Error ? err : new Error('Failed to load data'));
          setDashboardData(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [userId]); // Add `date` to dependency array if fetch depends on it

  // --- Derive available filter options from fetched, user-specific data (Reduced) --- 
  const filterOptions = useMemo(() => {
    if (!dashboardData) {
      return { Funds: [], Properties: [] }; // Only Funds and Properties
    }
    const funds = Array.from(new Set(dashboardData.properties.map(p => p.fund))).sort().map(f => ({ value: f, label: f }));
    const properties = dashboardData.properties.map(p => ({ value: p.id, label: p.name })).sort((a, b) => a.label.localeCompare(b.label));
    return { Funds: funds, Properties: properties };
  }, [dashboardData]); 

  const availableFunds = filterOptions.Funds;
  const availableProperties = filterOptions.Properties;

  // --- Filter Data based on selections (Refactored for dynamic KPIs & Charts) --- 
  const filteredData = useMemo((): FilteredDashboardData | null => {
    if (!dashboardData) return null;

    const { properties: allUserProperties, ...baseData } = dashboardData;

    // Filter properties based on BOTH fund and property selections
    const filteredProperties = allUserProperties.filter(p => 
        (selectedFunds.size === 0 || selectedFunds.has(p.fund)) &&
        (selectedProperties.size === 0 || selectedProperties.has(p.id))
    );

    // --- Initial State: No properties selected --- 
    if (selectedProperties.size === 0) {
      // Return base structure with 0s/nulls and empty chart data
      return {
        ...baseData,
        properties: [], // No properties to display in lists/tables
        totalPortfolioValue: 0,
        occupancyRate: 0,
        noi: 0,
        totalIncome: 0,
        totalExpenses: 0,
        totalOwnerDistribution: 0,
        totalVacancies: 0,
        totalLateRent: 0,
        noiMargin: 0, 
        // Set placeholder changes to null in zero state
        totalIncomeChange: null,
        totalExpensesChange: null,
        ownerDistributionChange: null,
        totalVacanciesChange: null,
        lateRentChange: null,
        noiMarginChange: null,
        // Define empty/zero state for all chart data structures
        chartsData: {
          financialRatios: [], 
          budgetVsActual: { rentalIncome: [], supplies: [], waterSewer: [], utilities: [] },
          unitsByType: [], 
          arAging: [],
          leasesExpiring: [],
          vacancies: [],
          moveInOut: []
        }
      };
    }

    // --- Filtered State: Calculate aggregates --- 
    const calculated = {
      totalPortfolioValue: filteredProperties.reduce((sum, p) => sum + (p.value ?? 0), 0),
      noi: filteredProperties.reduce((sum, p) => sum + (p.noi ?? 0), 0),
      occupancyRate: filteredProperties.length > 0 
          ? filteredProperties.reduce((sum, p) => sum + (p.occupancy ?? 0), 0) / filteredProperties.length
          : 0,
      totalIncome: filteredProperties.reduce((sum, p) => sum + (p.income ?? 0), 0),
      totalExpenses: filteredProperties.reduce((sum, p) => sum + (p.expenses ?? 0), 0),
      totalOwnerDistribution: filteredProperties.reduce((sum, p) => sum + (p.ownerDistribution ?? 0), 0),
      totalVacancies: filteredProperties.reduce((sum, p) => sum + (p.vacanciesCount ?? 0), 0),
      totalLateRent: filteredProperties.reduce((sum, p) => sum + (p.lateRentAmount ?? 0), 0),
    };

    // Calculate NOI Margin
    const noiMargin = (calculated.totalIncome && calculated.totalIncome !== 0) 
      ? (calculated.noi / calculated.totalIncome) * 100 
      : 0; // Handle division by zero or zero income

    // *** Placeholder Change Data ***
    // In a real app, this should come from the API or be calculated based on historical data
    const placeholderChanges = {
        totalIncomeChange: 0.04, // Example: +4.0%
        totalExpensesChange: -0.015, // Example: -1.5%
        ownerDistributionChange: 0.05, // Example: +5.0%
        totalVacanciesChange: -0.1, // Example: -10.0%
        lateRentChange: 0.02, // Example: +2.0%
        noiMarginChange: 0.011 // Example: +1.1%
    };

    // --- Aggregate Chart Data (Placeholder Logic - Needs Real Implementation) --- 
    // This requires significant logic based on how you want to aggregate complex data.
    // Example: Aggregate A/R details
    const aggregatedAr = filteredProperties.reduce((acc, p) => {
        acc['<30'] += p.arDetails?.['<30'] ?? 0;
        acc['30-60'] += p.arDetails?.['30-60'] ?? 0;
        acc['60-90'] += p.arDetails?.['60-90'] ?? 0;
        acc['>90'] += p.arDetails?.['>90'] ?? 0;
        return acc;
    }, { '<30': 0, '30-60': 0, '60-90': 0, '>90': 0 });

    const aggregatedArDataForChart = [
      { name: '< 30 Days', value: aggregatedAr['<30'], color: '#4CAF50' },
      { name: '30-60 Days', value: aggregatedAr['30-60'], color: '#FFC107' }, // Corrected label
      { name: '60-90 Days', value: aggregatedAr['60-90'], color: '#FF9800' }, // Corrected label
      { name: '> 90 Days', value: aggregatedAr['>90'], color: '#ef5350' },
    ];
    
    // Example: Aggregate Unit Stats (simple sum for demo)
    const aggregatedUnitStats = filteredProperties.reduce((acc, p) => {
        (p.unitStats ?? []).forEach(stat => {
            const existing = acc.find(s => s.type === stat.type);
            if (existing) {
                existing.occupied += stat.occupied;
                existing.vacant += stat.vacant;
            } else {
                acc.push({ ...stat });
            }
        });
        return acc;
    }, [] as PropertyUnitStats[]); // Initial value as empty typed array

     const aggregatedUnitsByTypeForChart = aggregatedUnitStats.map(item => ({
        name: item.type,
        occupied: item.occupied,
        vacant: item.vacant,
    })).reverse();

    // Placeholder: Aggregate Budget vs Actual (complex - just using first property for now)
    const firstPropMonthly = filteredProperties[0]?.monthlyData ?? [];
    const aggregatedBvA = {
        rentalIncome: firstPropMonthly.map(d => ({...d, budget: d.budgetIncome, actual: d.income, actualColor: d.income < d.budgetIncome*0.9 ? '#ef5350' : d.income > d.budgetIncome*1.1 ? '#4CAF50' : '#FFC107'})),
        supplies: [], // TODO: Implement aggregation
        waterSewer: [], // TODO: Implement aggregation
        utilities: [] // TODO: Implement aggregation
    };

    // Placeholder: Aggregate Vacancies (simple sum for demo)
    const totalOccupied = aggregatedUnitStats.reduce((sum, s) => sum + s.occupied, 0);
    const totalVacant = aggregatedUnitStats.reduce((sum, s) => sum + s.vacant, 0);
    const aggregatedVacanciesData = [
        { name: 'Occupied', value: totalOccupied, color: '#4b5563' },
        { name: 'Available', value: totalVacant, color: '#FFC107' }, // Simplification: assuming all vacant are available
        // { name: 'Inactive', value: 0, color: '#ef5350' }, // Need inactive data if required
    ];

    // TODO: Implement aggregation for other charts (Financial Ratios, Leases, Move In/Out)

    const aggregatedChartsData: AggregatedChartData = {
        financialRatios: [], // Placeholder
        budgetVsActual: aggregatedBvA, 
        unitsByType: aggregatedUnitsByTypeForChart,
        arAging: aggregatedArDataForChart,
        leasesExpiring: [], // Placeholder
        vacancies: aggregatedVacanciesData, 
        moveInOut: [] // Placeholder
    };
    
    return {
      ...baseData, // Includes original portfolioValueChange etc.
      properties: filteredProperties, // Pass the filtered list itself
      ...calculated, // Add calculated aggregated KPIs
      noiMargin: noiMargin, // Add calculated NOI Margin
      ...placeholderChanges, // Add placeholder change values
      chartsData: aggregatedChartsData // Add aggregated chart data
    };
  }, [dashboardData, selectedFunds, selectedProperties]);

  // Handle property click
  const handlePropertyClick = (propertyId: string) => {
    router.push(`/operations-dashboard/properties/${propertyId}`);
  };

  // --- Filter Interaction Functions --- 
  const toggleFilter = (setter: React.Dispatch<React.SetStateAction<Set<string>>>, value: string) => {
    setter(prev => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      // console.log("Current Set:", next); // Keep for debugging if needed
      return next;
    });
  };
  
  const clearFilter = (setter: React.Dispatch<React.SetStateAction<Set<string>>>, value: string, event?: React.MouseEvent) => {
    event?.stopPropagation(); // Prevent badge click from propagating if event is passed
     setter(prev => {
      const next = new Set(prev);
      next.delete(value);
      return next;
    });
  };

  // --- Render Loading/Error States --- 
  if (isAuthLoading || isLoading) {
    return <div className="p-8 text-center">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">Error loading data: {error.message}</div>;
  }

  const data = filteredData; 
  if (!data) {
     return <div className="p-8 text-center">No dashboard data available for this user.</div>;
  }
  
  const totalActiveFilters = selectedFunds.size + selectedProperties.size;

  // --- Filter Rendering Logic --- 
  const renderFilterPopover = (
    filterType: FilterField,
    options: { value: string; label: string }[],
    selectedSet: Set<string>,
    setter: React.Dispatch<React.SetStateAction<Set<string>>>
  ) => {
    return (
      <Popover key={filterType}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-[200px] justify-between"
            disabled={options.length === 0} // Disable if no options derived for user
          >
            {filterType} {selectedSet.size > 0 ? `(${selectedSet.size})` : ''}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandInput placeholder={`Search ${filterType}...`} />
            <CommandList>
              <CommandEmpty>No {filterType.toLowerCase()} found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedSet.has(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label} // Use label for searching
                      onSelect={() => toggleFilter(setter, option.value)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {selectedSet.size > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => setter(new Set())} // Clear all for this filter
                      className="justify-center text-center text-red-500 cursor-pointer"
                    >
                      Clear Selection
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  // --- Main Component Return --- 
  return (
    <div className="px-6 py-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4"> 
        <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>
        {/* Optional: Display User ID or Name */} 
        {/* {userId && <span className="text-sm text-gray-500">User: {userId}</span>} */} 
      </div>

      {/* --- Filter Controls (Reduced) --- */} 
      <div className="mb-6">
         <div className="flex flex-wrap items-center gap-3"> 
            {/* Date Range Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[260px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} - {" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            {/* Existing Filters */}
            {renderFilterPopover('Funds', availableFunds, selectedFunds, setSelectedFunds)}
            {renderFilterPopover('Properties', availableProperties, selectedProperties, setSelectedProperties)}
         </div>
         {/* Display Active Filters Text */} 
         {(selectedFunds.size > 0 || selectedProperties.size > 0) && (
           <div className="mt-2 text-sm text-gray-600">
              <span className="font-semibold">Filtering by:</span> 
              Fund(s): <span className="font-medium text-gray-800">{getDisplayFundNames(selectedFunds)}</span> | 
              Property(ies): <span className="font-medium text-gray-800">{getDisplayPropertyNames(selectedProperties, availableProperties)}</span>
           </div>
         )}
      </div>
      
      {/* --- Top Row KPIs (Portfolio Value, Occupancy, NOI) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Column 1: Total Portfolio Value - Centered */}
        <Card className="rounded-lg shadow-md border border-gray-200"> 
          <CardHeader className="text-center"> 
            <CardTitle>Total Portfolio Value</CardTitle>
          </CardHeader>
           <CardContent className="text-center"> 
             <p className="text-3xl font-bold text-slate-900">{formatCurrency(data.totalPortfolioValue)}</p>
             {/* Only show change if value is not 0 */}
             {(data.totalPortfolioValue !== 0) && (
               <div className="flex items-center justify-center mt-2 text-sm"> 
                 {formatPercentageChange(data.portfolioValueChange)} 
                 <span className="text-gray-500 ml-2">vs last quarter</span>
               </div>
             )}
             {(data.totalPortfolioValue === 0) && <div className="h-5 mt-2"></div>} {/* Placeholder for height */}
           </CardContent>
        </Card>
        
        {/* Column 2: Occupancy Rate - Centered */}
        <Card className="rounded-lg shadow-md border border-gray-200">
          <CardHeader className="text-center"> 
            <CardTitle>Occupancy Rate</CardTitle>
          </CardHeader>
           <CardContent className="text-center"> 
             <p className="text-3xl font-bold text-slate-900">{data.occupancyRate?.toFixed(1)}%</p>
             {/* Only show change if value is not 0 */}
             {(data.occupancyRate !== 0) && (
               <div className="flex items-center justify-center mt-2 text-sm"> 
                  {formatPercentageChange(data.occupancyRateChange)} 
                 <span className="text-gray-500 ml-2">vs last month</span>
               </div>
             )}
             {(data.occupancyRate === 0) && <div className="h-5 mt-2"></div>} {/* Placeholder for height */} 
           </CardContent>
        </Card>
        
        {/* Column 3: Net Operating Income - Centered */}
        <Card className="rounded-lg shadow-md border border-gray-200"> 
          <CardHeader className="text-center"> 
            <CardTitle>Net Operating Income</CardTitle>
          </CardHeader>
           <CardContent className="text-center"> 
             <p className="text-3xl font-bold text-slate-900">{formatCurrency(data.noi)}</p>
             {/* Only show change if value is not 0 */}
             {(data.noi !== 0) && (
               <div className="flex items-center justify-center mt-2 text-sm"> 
                  {formatPercentageChange(data.noiChange)} 
                  <span className="text-gray-500 ml-2">vs last quarter</span>
               </div>
             )}
             {(data.noi === 0) && <div className="h-5 mt-2"></div>} {/* Placeholder for height */} 
           </CardContent>
        </Card>
      </div>
      
      {/* --- Second Row KPI Grid (now 3-wide) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <KpiCard title="Rent Income" value={data.totalIncome ?? 0} isCurrency={true} changeValue={data.totalIncomeChange} comparisonPeriod="last month" />
        <KpiCard title="Operating Expenses" value={data.totalExpenses ?? 0} isCurrency={true} changeValue={data.totalExpensesChange} comparisonPeriod="last month" /> 
        <KpiCard title="NOI Margin (%)" value={`${(data.noiMargin ?? 0).toFixed(1)}%`} isCurrency={false} changeValue={data.noiMarginChange} comparisonPeriod="last month" />
        <KpiCard title="Owner Distribution" value={data.totalOwnerDistribution ?? 0} isCurrency={true} changeValue={data.ownerDistributionChange} comparisonPeriod="last quarter" />
        <KpiCard title="Vacancies" value={data.totalVacancies ?? 0} isCurrency={false} changeValue={data.totalVacanciesChange} comparisonPeriod="last month" />
        <KpiCard title="Late Rent" value={data.totalLateRent ?? 0} isCurrency={true} changeValue={data.lateRentChange} comparisonPeriod="last month" />
      </div>
      
      {/* Commercial Portfolio Heatmap Section */} 
      <div className="mt-8"> 
        <CommercialPortfolioHeatmap 
            selectedFunds={selectedFunds}
            selectedProperties={selectedProperties}
            availableProperties={availableProperties}
        />
          </div>

      {/* Render Integrated Financial Dashboard */} 
      <FinancialDashboard />
          
    </div>
  );
} 