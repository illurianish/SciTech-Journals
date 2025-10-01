'use client';

import { useState, useMemo } from 'react';
import Sidebar from '../../../components/Sidebar'; // Note: Ensure this path is correct for your project
import { useRouter } from 'next/navigation';

export default function DealAnalyzerPage() {
  const [showSidebar, setShowSidebar] = useState(true);
  const router = useRouter();
  
  // Form state for all inputs
  const [formData, setFormData] = useState({
    address: '',
    purchasePrice: 180000,
    closingCostsPercentage: 2.00,
    repairCosts: 10000,
    arv: 215000,
    downPaymentPercentage: 20.0,
    interestRate: 3.25,
    mortgageLength: 30,
    fees: 0,
    monthlyRent: 2200,
    otherIncome: 0,
    numUnits: 4,
    propertyTax: 150,
    propertyInsurance: 100,
    maintenanceRepairs: 5.00,
    capex: 5.00,
    propertyManagement: 0,
    vacancy: 3.00,
    sewer: 0,
    water: 0,
    lawnSnow: 50,
    garbage: 50,
    electric: 0,
    gas: 0,
    hoa: 25,
    otherExpenses: 0,
    pmiEnabled: true
  });

  // Derived calculations using useMemo for efficiency
  const calculations = useMemo(() => {
    const loanAmount = formData.purchasePrice * (1 - formData.downPaymentPercentage / 100);
    const monthlyRate = formData.interestRate / 100 / 12;
    const numPayments = formData.mortgageLength * 12;
    
    const mortgagePayment = numPayments > 0 ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) / (Math.pow(1 + monthlyRate, numPayments) - 1) : 0;
    
    const monthlyIncome = formData.monthlyRent + formData.otherIncome;
    
    let mortgageInsurance = 0;
    if (formData.pmiEnabled && formData.downPaymentPercentage < 20) {
      mortgageInsurance = (loanAmount * 0.005) / 12; // 0.5% annual PMI rate
    }
    
    const maintenanceAmount = (monthlyIncome * formData.maintenanceRepairs) / 100;
    const capexAmount = (monthlyIncome * formData.capex) / 100;
    const propertyMgmtAmount = (monthlyIncome * formData.propertyManagement) / 100;
    const vacancyAmount = (monthlyIncome * formData.vacancy) / 100;
    const monthlyExpenses = mortgagePayment + mortgageInsurance + formData.propertyTax + formData.propertyInsurance + 
                           maintenanceAmount + capexAmount + propertyMgmtAmount + vacancyAmount +
                           formData.sewer + formData.water + formData.lawnSnow + formData.garbage +
                           formData.electric + formData.gas + formData.hoa + formData.otherExpenses;
    
    const netCfpu = monthlyIncome - monthlyExpenses;
    
    const downPayment = formData.purchasePrice * (formData.downPaymentPercentage / 100);
    const closingCosts = formData.purchasePrice * (formData.closingCostsPercentage / 100);
    const totalCashNeeded = downPayment + closingCosts + formData.repairCosts + formData.fees;
    
    const annualRent = monthlyIncome * 12;
    const annualOperatingExpenses = (monthlyExpenses - mortgagePayment - mortgageInsurance) * 12;
    const noi = annualRent - annualOperatingExpenses;

    const annualCashFlow = netCfpu * 12;
    const cashOnCash = totalCashNeeded > 0 ? (annualCashFlow / totalCashNeeded) * 100 : 0;
    
    const capRate = formData.purchasePrice > 0 ? (noi / formData.purchasePrice) * 100 : 0;
    
    const onePercentRule = formData.purchasePrice > 0 ? (monthlyIncome / formData.purchasePrice) * 100 : 0;

    return {
      monthlyIncome,
      monthlyExpenses,
      totalCashNeeded,
      noi,
      netCfpu,
      cashOnCash,
      capRate,
      onePercentRule,
      mortgagePayment,
      mortgageInsurance
    };
  }, [formData]);

  // --- Handlers ---
  const handleProfileClick = () => router.push('/operations-dashboard?view=profile');
  const handleSettingsClick = () => router.push('/operations-dashboard?view=settings');
  const handleDashboardClick = () => router.push('/operations-dashboard');
  const handleToggleSidebar = () => setShowSidebar(!showSidebar);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // --- Formatters ---
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  const formatNumber = (num: number) => num.toLocaleString('en-US');

  // --- UI Helpers ---
  const getMetricColor = (value: number, type: 'percentage' | 'currency' | 'ratio') => {
    if (type === 'percentage') return value >= 10 ? 'text-green-600' : value >= 5 ? 'text-yellow-600' : 'text-red-600';
    if (type === 'currency') return value >= 0 ? 'text-green-600' : 'text-red-600';
    if (type === 'ratio') return value >= 1 ? 'text-green-600' : 'text-red-600';
    return 'text-gray-900';
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {showSidebar && (
        <Sidebar 
          currentPath="/operations-dashboard/acquisition-screening/deal-screen"
          onProfileClick={handleProfileClick}
          onSettingsClick={handleSettingsClick}
          onDashboardClick={handleDashboardClick}
          onToggleSidebar={handleToggleSidebar}
        />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="w-full">
            {/* --- Header Section --- */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Deal Analyzer</h1>
              <p className="text-gray-600 mb-4">
                Quickly and easily analyze a prospective rental property, calculating cash flow and other key metrics.
              </p>
              <hr className="mb-4" />
              
              <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
                <div className="flex-1">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Property Address</label>
                  <input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter Property Address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/2 sm:w-auto">
                    <i className="fas fa-save mr-2"></i>Save
                  </button>
                  <div className="relative w-1/2 sm:w-auto">
                    <button className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      Saved Deals <i className="fas fa-angle-down ml-2"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Key Metrics Cards --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Monthly Income</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(calculations.monthlyIncome)}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Monthly Expenses</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(calculations.monthlyExpenses)}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Total Cash Needed</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(calculations.totalCashNeeded)}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Net Operating Income</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(calculations.noi)}</p>
              </div>
            </div>

            {/* --- Return Metrics Cards --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Net CFPU</p>
                <p className={`text-3xl font-bold ${getMetricColor(calculations.netCfpu, 'currency')}`}>
                  {formatCurrency(calculations.netCfpu)}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Cash-on-Cash Return</p>
                <p className={`text-3xl font-bold ${getMetricColor(calculations.cashOnCash, 'percentage')}`}>
                  {calculations.cashOnCash.toFixed(2)}%
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Purchase Cap Rate</p>
                <p className={`text-3xl font-bold ${getMetricColor(calculations.capRate, 'percentage')}`}>
                  {calculations.capRate.toFixed(2)}%
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">1% Rule</p>
                <p className={`text-3xl font-bold ${getMetricColor(calculations.onePercentRule, 'ratio')}`}>
                  {calculations.onePercentRule.toFixed(2)}%
                </p>
              </div>
            </div>

            {/* --- Purchase & Financing Details --- */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Purchase & Financing Details</h2>
              <hr className="mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">$</span>
                    <input type="text" value={formatNumber(formData.purchasePrice)} onChange={(e) => handleInputChange('purchasePrice', parseInt(e.target.value.replace(/,/g, '')) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Closing Costs</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">%</span>
                    <input type="number" step="0.01" value={formData.closingCostsPercentage} onChange={(e) => handleInputChange('closingCostsPercentage', parseFloat(e.target.value) || 0)} className="w-full flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <span className="inline-flex items-center justify-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 min-w-[75px]">{formatCurrency(formData.purchasePrice * (formData.closingCostsPercentage / 100))}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Repair Costs</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">$</span>
                    <input type="text" value={formatNumber(formData.repairCosts)} onChange={(e) => handleInputChange('repairCosts', parseInt(e.target.value.replace(/,/g, '')) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">After-Repair Value (ARV)</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">$</span>
                    <input type="text" value={formatNumber(formData.arv)} onChange={(e) => handleInputChange('arv', parseInt(e.target.value.replace(/,/g, '')) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">%</span>
                    <input type="number" step="0.01" value={formData.downPaymentPercentage} onChange={(e) => handleInputChange('downPaymentPercentage', parseFloat(e.target.value) || 0)} className="w-full flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <span className="inline-flex items-center justify-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 min-w-[75px]">{formatCurrency(formData.purchasePrice * (formData.downPaymentPercentage / 100))}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">%</span>
                    <input type="number" step="0.01" value={formData.interestRate} onChange={(e) => handleInputChange('interestRate', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mortgage Length</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">Years</span>
                    <input type="number" value={formData.mortgageLength} onChange={(e) => handleInputChange('mortgageLength', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Other Fees</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">$</span>
                    <input type="text" value={formatNumber(formData.fees)} onChange={(e) => handleInputChange('fees', parseInt(e.target.value.replace(/,/g, '')) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Monthly Revenue --- */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Revenue</h2>
              <hr className="mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gross Monthly Rent</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">$</span>
                    <input type="text" value={formatNumber(formData.monthlyRent)} onChange={(e) => handleInputChange('monthlyRent', parseInt(e.target.value.replace(/,/g, '')) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Other Monthly Income</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">$</span>
                    <input type="text" value={formatNumber(formData.otherIncome)} onChange={(e) => handleInputChange('otherIncome', parseInt(e.target.value.replace(/,/g, '')) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Units</label>
                  <input type="number" value={formData.numUnits} onChange={(e) => handleInputChange('numUnits', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
              </div>
            </div>

            {/* --- Monthly Expenses --- */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Expenses</h2>
              <hr className="mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mortgage Payment</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-500">$</span>
                    <input type="text" value={calculations.mortgagePayment.toFixed(2)} disabled className="w-full px-3 py-2 border border-gray-300 rounded-r-md bg-gray-100 text-gray-600"/>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Mortgage Ins. (PMI)</span>
                    <input type="checkbox" checked={formData.pmiEnabled} onChange={(e) => handleInputChange('pmiEnabled', e.target.checked)} className="form-checkbox h-4 w-4 text-blue-600 rounded"/>
                  </div>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-500">$</span>
                    <input type="text" value={calculations.mortgageInsurance.toFixed(2)} disabled className="w-full px-3 py-2 border border-gray-300 rounded-r-md bg-gray-100 text-gray-600"/>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Taxes</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">$</span>
                    <input type="text" value={formatNumber(formData.propertyTax)} onChange={(e) => handleInputChange('propertyTax', parseInt(e.target.value.replace(/,/g, '')) || 0)} className="w-full flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <span className="inline-flex items-center justify-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 min-w-[85px]">{formatCurrency(formData.propertyTax * 12)}/yr</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Insurance</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">$</span>
                    <input type="text" value={formatNumber(formData.propertyInsurance)} onChange={(e) => handleInputChange('propertyInsurance', parseInt(e.target.value.replace(/,/g, '')) || 0)} className="w-full flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <span className="inline-flex items-center justify-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 min-w-[85px]">{formatCurrency(formData.propertyInsurance * 12)}/yr</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance & Repairs</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">%</span>
                    <input type="number" step="0.01" value={formData.maintenanceRepairs} onChange={(e) => handleInputChange('maintenanceRepairs', parseFloat(e.target.value) || 0)} className="w-full flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <span className="inline-flex items-center justify-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 min-w-[85px]">{formatCurrency((calculations.monthlyIncome * formData.maintenanceRepairs) / 100)}/mo</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Capital Expenditures</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">%</span>
                    <input type="number" step="0.01" value={formData.capex} onChange={(e) => handleInputChange('capex', parseFloat(e.target.value) || 0)} className="w-full flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <span className="inline-flex items-center justify-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 min-w-[85px]">{formatCurrency((calculations.monthlyIncome * formData.capex) / 100)}/mo</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Management</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">%</span>
                    <input type="number" step="0.01" value={formData.propertyManagement} onChange={(e) => handleInputChange('propertyManagement', parseFloat(e.target.value) || 0)} className="w-full flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <span className="inline-flex items-center justify-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 min-w-[85px]">{formatCurrency((calculations.monthlyIncome * formData.propertyManagement) / 100)}/mo</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vacancy</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">%</span>
                    <input type="number" step="0.01" value={formData.vacancy} onChange={(e) => handleInputChange('vacancy', parseFloat(e.target.value) || 0)} className="w-full flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <span className="inline-flex items-center justify-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 min-w-[85px]">{formatCurrency((calculations.monthlyIncome * formData.vacancy) / 100)}/mo</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sewer</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">$</span>
                    <input type="text" value={formatNumber(formData.sewer)} onChange={(e) => handleInputChange('sewer', parseInt(e.target.value.replace(/,/g, '')) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Water</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">$</span>
                    <input type="text" value={formatNumber(formData.water)} onChange={(e) => handleInputChange('water', parseInt(e.target.value.replace(/,/g, '')) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lawn/Snow</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">$</span>
                    <input type="text" value={formatNumber(formData.lawnSnow)} onChange={(e) => handleInputChange('lawnSnow', parseInt(e.target.value.replace(/,/g, '')) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Garbage</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">$</span>
                    <input type="text" value={formatNumber(formData.garbage)} onChange={(e) => handleInputChange('garbage', parseInt(e.target.value.replace(/,/g, '')) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Electric</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">$</span>
                    <input type="text" value={formatNumber(formData.electric)} onChange={(e) => handleInputChange('electric', parseInt(e.target.value.replace(/,/g, '')) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gas</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">$</span>
                    <input type="text" value={formatNumber(formData.gas)} onChange={(e) => handleInputChange('gas', parseInt(e.target.value.replace(/,/g, '')) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">HOA Fees</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">$</span>
                    <input type="text" value={formatNumber(formData.hoa)} onChange={(e) => handleInputChange('hoa', parseInt(e.target.value.replace(/,/g, '')) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Other Expenses</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">$</span>
                    <input type="text" value={formatNumber(formData.otherExpenses)} onChange={(e) => handleInputChange('otherExpenses', parseInt(e.target.value.replace(/,/g, '')) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}