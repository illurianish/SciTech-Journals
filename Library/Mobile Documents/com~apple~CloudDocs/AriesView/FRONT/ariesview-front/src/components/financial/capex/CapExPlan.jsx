// Not used
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash2, Save, XCircle, PlusCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'; // Added Cell for stacked bar

// --- Helper Functions ---
const formatNumber = (value, style, digits = 2) => {
    if (value === null || typeof value === 'undefined' || isNaN(value)) return 'N/A';
    try {
        const options = {};
        if (style === 'currency') { options.style = 'currency'; options.currency = 'USD'; options.minimumFractionDigits = 0; options.maximumFractionDigits = 0; }
        else if (style === 'percent') { options.style = 'percent'; options.minimumFractionDigits = digits; options.maximumFractionDigits = digits; }
        else if (style === 'integer') { options.minimumFractionDigits = 0; options.maximumFractionDigits = 0; }
        else { options.minimumFractionDigits = digits; options.maximumFractionDigits = digits; }
        return new Intl.NumberFormat('en-US', options).format(value);
    } catch (error) { console.error("CapEx Number Format Error:", error); return String(value); }
};

// --- Data Structures (Conceptual) ---
/*
interface CapExProject {
    id: string;
    name: string;         // Editable
    cost: number | null;    // Editable
    year: number | null;    // Editable (Dropdown)
    notes: string | null;   // Editable
}

interface TenantImprovements {
    ti_allowance_new: number | null;    // Editable $/SF
    ti_allowance_renewal: number | null; // Editable $/SF
    yearly_ti_costs: (number | null)[]; // Calculated
}

interface LeasingCommissions {
    lc_rate_new: number | null;         // Editable %
    lc_rate_renewal: number | null;     // Editable %
    yearly_lc_costs: (number | null)[]; // Calculated
}

interface CapitalReserves {
    reserve_per_sf: number | null;     // Editable
    annual_reserve_amount: number | null; // Calculated
    yearly_cumulative_balance: (number | null)[]; // Calculated
    yearly_reserve_utilization: (number | null)[]; // Calculated from projects
}

interface CapExPlanData {
    property_id: string;
    property_sf: number | null; // Needed for reserve & TI calcs
    years_projected: number;
    projects: CapExProject[];
    tenant_improvements: TenantImprovements;
    leasing_commissions: LeasingCommissions;
    capital_reserves: CapitalReserves;
    // Base data (potentially from Rent Roll/Assumptions)
    lease_expirations_sf: (number | null)[]; // SF expiring each year
    renewal_probabilities: (number | null)[]; // % expected to renew each year
    market_rent_sf_forecast: (number | null)[]; // Needed for LC calcs
    avg_lease_term_years: number | null; // Needed for LC calcs
}

interface YearlyTotals {
    year: number;
    planned_projects: number | null;
    tenant_improvements: number | null;
    leasing_commissions: number | null;
    total_capex: number | null;
    reserve_contribution: number | null;
    reserve_utilization: number | null;
    reserve_ending_balance: number | null;
}
*/

// --- Calculation Logic ---
const recalculateCapEx = (inputData) => {
    if (!inputData) return null;
    const data = JSON.parse(JSON.stringify(inputData)); // Deep copy
    const years = data.years_projected;
    const propertySF = data.property_sf ?? 0;
    const currentYear = new Date().getFullYear();

    // Ensure arrays exist and have the correct length
    const ensureArrayLength = (arr, length, fillValue = null) => {
        if (!arr || arr.length !== length) {
            return Array(length).fill(fillValue);
        }
        return arr;
    };
    data.lease_expirations_sf = ensureArrayLength(data.lease_expirations_sf, years, 0);
    data.renewal_probabilities = ensureArrayLength(data.renewal_probabilities, years, 0.7); // Default 70% renewal
    data.market_rent_sf_forecast = ensureArrayLength(data.market_rent_sf_forecast, years, 30); // Placeholder rent

    // 1. Planned Projects - Summarize by year
    const yearlyPlannedCosts = Array(years).fill(0);
    data.projects.forEach(p => {
        if (p.year && p.cost && p.year >= currentYear && p.year < currentYear + years) {
            const yearIndex = p.year - currentYear;
            yearlyPlannedCosts[yearIndex] += p.cost;
        }
    });

    // 2. Tenant Improvements - Simplified Placeholder Calc
    const tiNew = data.tenant_improvements.ti_allowance_new ?? 0;
    const tiRenewal = data.tenant_improvements.ti_allowance_renewal ?? 0;
    data.tenant_improvements.yearly_ti_costs = Array(years).fill(0);
    for (let i = 0; i < years; i++) {
        const expiringSF = data.lease_expirations_sf[i] ?? 0;
        const renewalProb = data.renewal_probabilities[i] ?? 0;
        const renewingSF = expiringSF * renewalProb;
        const newLeaseSF = expiringSF * (1 - renewalProb); // Simplified - ignores vacancy fill
        data.tenant_improvements.yearly_ti_costs[i] = (newLeaseSF * tiNew) + (renewingSF * tiRenewal);
    }

    // 3. Leasing Commissions - Simplified Placeholder Calc
    const lcNewRate = data.leasing_commissions.lc_rate_new ?? 0;
    const lcRenewalRate = data.leasing_commissions.lc_rate_renewal ?? 0;
    const avgLeaseTerm = data.avg_lease_term_years ?? 5; // Placeholder term
    data.leasing_commissions.yearly_lc_costs = Array(years).fill(0);
    for (let i = 0; i < years; i++) {
        const expiringSF = data.lease_expirations_sf[i] ?? 0;
        const renewalProb = data.renewal_probabilities[i] ?? 0;
        const renewingSF = expiringSF * renewalProb;
        const newLeaseSF = expiringSF * (1 - renewalProb);
        const marketRent = data.market_rent_sf_forecast[i] ?? 0; // Simplified: use market rent for both
        
        const newLeaseValue = newLeaseSF * marketRent * avgLeaseTerm;
        const renewalLeaseValue = renewingSF * marketRent * avgLeaseTerm; // Simplification: assumes renewal rent = market
        
        data.leasing_commissions.yearly_lc_costs[i] = (newLeaseValue * lcNewRate) + (renewalLeaseValue * lcRenewalRate);
    }
    
    // 4. Capital Reserves
    const reservePerSF = data.capital_reserves.reserve_per_sf ?? 0;
    data.capital_reserves.annual_reserve_amount = reservePerSF * propertySF;
    data.capital_reserves.yearly_cumulative_balance = Array(years).fill(0);
    data.capital_reserves.yearly_reserve_utilization = [...yearlyPlannedCosts]; // Utilization = planned costs for now
    let currentReserveBalance = 0; // Assume starts at 0
    for (let i = 0; i < years; i++) {
        currentReserveBalance += data.capital_reserves.annual_reserve_amount;
        currentReserveBalance -= data.capital_reserves.yearly_reserve_utilization[i];
        data.capital_reserves.yearly_cumulative_balance[i] = currentReserveBalance;
    }

    // 5. Calculate Yearly Totals for display and chart
    data.yearly_totals = [];
    for (let i = 0; i < years; i++) {
        const year = currentYear + i;
        const planned = yearlyPlannedCosts[i] ?? 0;
        const ti = data.tenant_improvements.yearly_ti_costs[i] ?? 0;
        const lc = data.leasing_commissions.yearly_lc_costs[i] ?? 0;
        const reserveCont = data.capital_reserves.annual_reserve_amount ?? 0;
        const reserveUtil = data.capital_reserves.yearly_reserve_utilization[i] ?? 0;
        const reserveEnd = data.capital_reserves.yearly_cumulative_balance[i] ?? 0;
        
        data.yearly_totals.push({
            year: year,
            planned_projects: planned,
            tenant_improvements: ti,
            leasing_commissions: lc,
            total_capex: planned + ti + lc,
            reserve_contribution: reserveCont,
            reserve_utilization: reserveUtil,
            reserve_ending_balance: reserveEnd,
        });
    }

    return data;
};

// --- Sample Data Generation ---
const generateSampleCapExData = (propertyId) => {
    const years = 10;
    const currentYear = new Date().getFullYear();
    const propertySF = 75000 + Math.random() * 50000;

    // Simulate some lease expirations
    const leaseExpirationsSF = Array.from({ length: years }, () => propertySF * (0.05 + Math.random() * 0.15)); // 5-20% expiring per year

    let sample = {
        property_id: propertyId,
        property_sf: Math.round(propertySF),
        years_projected: years,
        projects: [
            { id: 'proj-1', name: 'Roof Replacement', cost: 150000, year: currentYear + 1, notes: 'Complete replacement needed' },
            { id: 'proj-2', name: 'HVAC Upgrade (Units 10-15)', cost: 75000, year: currentYear + 3, notes: 'Replace aging units' },
            { id: 'proj-3', name: 'Parking Lot Repaving', cost: 50000, year: currentYear + 5, notes: 'Sealcoating and restriping' },
        ],
        tenant_improvements: {
            ti_allowance_new: 25 + Math.random() * 15, // $25-40 /SF
            ti_allowance_renewal: 10 + Math.random() * 10, // $10-20 /SF
            yearly_ti_costs: [], // Calculated
        },
        leasing_commissions: {
            lc_rate_new: 0.04 + Math.random() * 0.02, // 4-6%
            lc_rate_renewal: 0.02 + Math.random() * 0.01, // 2-3%
            yearly_lc_costs: [], // Calculated
        },
        capital_reserves: {
            reserve_per_sf: 0.75 + Math.random() * 0.75, // $0.75 - $1.50 /SF
            annual_reserve_amount: null, // Calculated
            yearly_cumulative_balance: [], // Calculated
            yearly_reserve_utilization: [], // Calculated
        },
        // Base data placeholders
        lease_expirations_sf: leaseExpirationsSF,
        renewal_probabilities: Array.from({ length: years }, () => 0.6 + Math.random() * 0.2), // 60-80%
        market_rent_sf_forecast: Array.from({ length: years }, (_, i) => (30 + Math.random() * 5) * Math.pow(1.025, i)), // Simple rent growth
        avg_lease_term_years: 5 + Math.floor(Math.random() * 3),
        yearly_totals: [], // Calculated
    };

    sample = recalculateCapEx(sample);
    return sample;
};

// --- Main Component ---
const CapExPlan = ({ propertyId }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for inline editing of projects
    const [editingProjectId, setEditingProjectId] = useState(null);
    const [editedProjectData, setEditedProjectData] = useState(null);

    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: data?.years_projected ?? 10 }, (_, i) => currentYear + i);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        setEditingProjectId(null); // Clear edits
        console.log(`Fetching CapEx plan for property: ${propertyId}`);
        try {
            const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;
            const response = await fetch(`${backendUrl}/api/financial/capex/${propertyId}`);

            if (!response.ok) {
                console.warn(`API fetch failed (${response.status}), using sample CapEx data for property ${propertyId}`);
                const sampleData = generateSampleCapExData(propertyId);
                setData(sampleData);
            } else {
                const result = await response.json();
                if (!result.success || !result.data) {
                    console.error('API Error: Invalid CapEx data format', result);
                    const sampleData = generateSampleCapExData(propertyId);
                    setData(sampleData);
                    setError(result.error || 'API returned unsuccessful or invalid data, using sample data.');
                } else {
                    let fetchedData = result.data;
                    // TODO: Validate fetched data structure
                    fetchedData.property_id = propertyId;
                    fetchedData.years_projected = fetchedData.years_projected || 10;
                    // Ensure base data arrays exist if needed for recalc
                    fetchedData = recalculateCapEx(fetchedData); // Recalculate based on fetched inputs
                    setData(fetchedData);
                    setError(null);
                }
            }
        } catch (err) {
            console.error('Error in fetchData process (CapEx):', err);
            setError(`Fetch error: ${err.message}. Using sample data.`);
            const sampleData = generateSampleCapExData(propertyId);
            setData(sampleData);
        } finally {
            setLoading(false);
        }
    }, [propertyId]);

    useEffect(() => {
        if (propertyId) {
            fetchData();
        } else {
            setData(null);
            setError("No property selected.");
            setLoading(false);
        }
    }, [propertyId, fetchData]);

    // --- Input Handlers (Non-Project) ---
    const handleGeneralInputChange = (section, field, value) => {
        setData(prevData => {
            if (!prevData) return null;
            const newData = JSON.parse(JSON.stringify(prevData));
            const sectionData = newData[section];
            if (!sectionData) return newData; // Should not happen if initialized

            let processedValue = null;
            if (typeof value === 'string') {
                processedValue = value === '' ? null : parseFloat(value);
                if (isNaN(processedValue)) processedValue = null;
            } else {
                processedValue = value; // Already a number? (Unlikely from input)
            }

            // Handle percentages
            if ((section === 'leasing_commissions' && (field === 'lc_rate_new' || field === 'lc_rate_renewal'))) {
                 if (processedValue !== null) processedValue /= 100;
            }
            
            sectionData[field] = processedValue;
            return recalculateCapEx(newData); // Recalculate everything
        });
        // TODO: Add debounced save logic here
    };

    // --- CRUD Handlers for Projects ---
    const handleEditProjectClick = (project) => {
        setEditingProjectId(project.id);
        setEditedProjectData({ ...project });
    };

    const handleCancelProjectClick = () => {
        setEditingProjectId(null);
        setEditedProjectData(null);
    };

    const handleSaveProjectClick = async () => {
        if (!editedProjectData || !editingProjectId) return;
        console.log(`Saving project: ${editingProjectId}`, editedProjectData);
        // TODO: API Call to PUT/PATCH project

        setData(prevData => {
            if (!prevData) return null;
            const updatedProjects = prevData.projects.map(p => 
                p.id === editingProjectId ? { ...editedProjectData } : p
            );
            const newData = { ...prevData, projects: updatedProjects };
            return recalculateCapEx(newData);
        });
        handleCancelProjectClick();
    };

    const handleDeleteProjectClick = async (projectId) => {
        if (!confirm("Are you sure you want to delete this project?")) return;
        console.log(`Deleting project: ${projectId}`);
         // TODO: API Call to DELETE project

        setData(prevData => {
            if (!prevData) return null;
            const updatedProjects = prevData.projects.filter(p => p.id !== projectId);
            const newData = { ...prevData, projects: updatedProjects };
             return recalculateCapEx(newData);
        });
    };
    
    const handleAddProjectClick = () => {
         console.log("Adding new project");
         // TODO: Open a modal or add a temporary row for new project entry
         const newProjectId = `new-${Date.now()}`;
         const newProject = { id: newProjectId, name: '', cost: null, year: currentYear, notes: '' };
         setData(prevData => {
             if (!prevData) return null;
             const newData = {
                 ...prevData,
                 projects: [...prevData.projects, newProject]
             };
             // Don't recalculate yet, wait for save/input
             return newData;
         });
         // Immediately enter edit mode for the new row
         setEditingProjectId(newProjectId);
         setEditedProjectData(newProject);
    };
    
    const handleProjectInputChange = (e) => {
        const { name, value, type } = e.target;
        setEditedProjectData(prev => {
            if (!prev) return null;
             let processedValue = value;
            if (type === 'number' || name === 'cost' || name === 'year') {
                processedValue = value === '' ? null : parseInt(value, 10); // Cost/Year likely integers
                if (isNaN(processedValue)) processedValue = null;
            }
            return { ...prev, [name]: processedValue };
        });
    };
    
     const handleProjectSelectChange = (value) => {
         setEditedProjectData(prev => {
            if (!prev) return null;
             const yearVal = value ? parseInt(value, 10) : null;
            return { ...prev, year: yearVal };
        });
     };
     
     const handleProjectNotesChange = (e) => {
         const { name, value } = e.target;
          setEditedProjectData(prev => {
            if (!prev) return null;
            return { ...prev, [name]: value };
        });
     };

    // --- Loading & Error States ---
    if (loading) return <div className="p-4 text-center">Loading CapEx Plan...</div>;
    if (error && !data) return <div className="p-4 text-center text-red-500">Error: {error}</div>;
    if (!data) return <div className="p-4 text-center text-gray-500">No CapEx data available.</div>;

    // --- Render Component ---
    const { projects, tenant_improvements, leasing_commissions, capital_reserves, yearly_totals } = data;
    const propertySF = data.property_sf || 1;
    
    // Prepare data for stacked bar chart
    const chartData = yearly_totals.map(yt => ({
        year: yt.year,
        'Planned Projects': yt.planned_projects ?? 0,
        'Tenant Improvements': yt.tenant_improvements ?? 0,
        'Leasing Commissions': yt.leasing_commissions ?? 0,
    }));
    const stackColors = { 'Planned Projects': '#8884d8', 'Tenant Improvements': '#82ca9d', 'Leasing Commissions': '#ffc658' };

    return (
        <div className="space-y-8 p-1">
            {error && <div className="p-3 mb-4 text-center text-orange-700 bg-orange-100 border border-orange-300 rounded-md">Warning: {error}</div>}
            
            <h2 className="text-xl font-semibold text-gray-800">Capital Expenditure Plan</h2>

            {/* --- Planned Projects Section --- */}
            <section className="bg-white p-4 shadow rounded-lg">
                 <div className="flex justify-between items-center mb-4">
                     <h3 className="text-lg font-semibold text-gray-700">Planned Capital Projects</h3>
                     <Button onClick={handleAddProjectClick} size="sm"><PlusCircle size={16} className="mr-1"/> Add Project</Button>
                 </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-2/5">Project Name</TableHead>
                            <TableHead className="w-1/5">Cost</TableHead>
                            <TableHead className="w-1/5">Year</TableHead>
                            <TableHead className="w-2/5">Notes</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {projects?.length === 0 && (
                            <TableRow><TableCell colSpan={5} className="text-center py-4 text-gray-500">No planned projects added.</TableCell></TableRow>
                        )}
                        {projects?.map((proj) => {
                            const isEditing = editingProjectId === proj.id;
                            const displayData = isEditing ? editedProjectData : proj;
                            return (
                                <TableRow key={proj.id} className={isEditing ? "bg-blue-50" : ""}>
                                    <TableCell>{isEditing ? <Input name="name" value={displayData?.name ?? ''} onChange={handleProjectInputChange} /> : displayData?.name}</TableCell>
                                    <TableCell>{isEditing ? <Input name="cost" type="number" value={displayData?.cost ?? ''} onChange={handleProjectInputChange} className="text-blue-600" inputMode="numeric" /> : formatNumber(displayData?.cost, 'currency')}</TableCell>
                                    <TableCell>{isEditing ? (
                                        <Select name="year" value={displayData?.year?.toString() ?? ''} onValueChange={handleProjectSelectChange}>
                                            <SelectTrigger className="text-blue-600"><SelectValue placeholder="Year..." /></SelectTrigger>
                                            <SelectContent>
                                                {yearOptions.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    ) : displayData?.year}</TableCell>
                                    <TableCell>{isEditing ? <Textarea name="notes" value={displayData?.notes ?? ''} onChange={handleProjectNotesChange} rows={1} className="text-blue-600" /> : displayData?.notes}</TableCell>
                                    <TableCell>
                                        <div className="flex space-x-1">
                                        {isEditing ? (
                                            <>
                                                <Button variant="ghost" size="icon" onClick={handleSaveProjectClick} className="text-green-600 h-8 w-8"><Save size={16}/></Button>
                                                <Button variant="ghost" size="icon" onClick={handleCancelProjectClick} className="text-gray-500 h-8 w-8"><XCircle size={16}/></Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button variant="ghost" size="icon" onClick={() => handleEditProjectClick(proj)} className="text-blue-600 h-8 w-8"><Edit size={16}/></Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteProjectClick(proj.id)} className="text-red-600 h-8 w-8"><Trash2 size={16}/></Button>
                                            </>
                                        )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </section>

            {/* --- TI & LC Assumptions Section --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <section className="bg-white p-4 shadow rounded-lg space-y-3">
                     <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-2">Tenant Improvements</h3>
                     <div className="flex items-center justify-between">
                         <Label htmlFor="ti_allowance_new" className="text-sm text-gray-600">TI Allowance (New) $/SF:</Label>
                         <Input id="ti_allowance_new" type="number" value={tenant_improvements?.ti_allowance_new?.toFixed(2) ?? ''} onChange={(e) => handleGeneralInputChange('tenant_improvements', 'ti_allowance_new', e.target.value)} className="w-24 h-8 text-sm text-blue-600 font-medium text-right border-blue-200 focus:border-blue-500 focus:ring-blue-500" step="0.01" inputMode="numeric" />
                     </div>
                     <div className="flex items-center justify-between">
                         <Label htmlFor="ti_allowance_renewal" className="text-sm text-gray-600">TI Allowance (Renewal) $/SF:</Label>
                         <Input id="ti_allowance_renewal" type="number" value={tenant_improvements?.ti_allowance_renewal?.toFixed(2) ?? ''} onChange={(e) => handleGeneralInputChange('tenant_improvements', 'ti_allowance_renewal', e.target.value)} className="w-24 h-8 text-sm text-blue-600 font-medium text-right border-blue-200 focus:border-blue-500 focus:ring-blue-500" step="0.01" inputMode="numeric" />
                     </div>
                 </section>
                 <section className="bg-white p-4 shadow rounded-lg space-y-3">
                     <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-2">Leasing Commissions</h3>
                     <div className="flex items-center justify-between">
                         <Label htmlFor="lc_rate_new" className="text-sm text-gray-600">LC Rate (New) %:</Label>
                         <Input id="lc_rate_new" type="number" value={(leasing_commissions?.lc_rate_new * 100)?.toFixed(2) ?? ''} onChange={(e) => handleGeneralInputChange('leasing_commissions', 'lc_rate_new', e.target.value)} className="w-24 h-8 text-sm text-blue-600 font-medium text-right border-blue-200 focus:border-blue-500 focus:ring-blue-500" step="0.01" placeholder="%" inputMode="numeric"/>
                     </div>
                     <div className="flex items-center justify-between">
                         <Label htmlFor="lc_rate_renewal" className="text-sm text-gray-600">LC Rate (Renewal) %:</Label>
                         <Input id="lc_rate_renewal" type="number" value={(leasing_commissions?.lc_rate_renewal * 100)?.toFixed(2) ?? ''} onChange={(e) => handleGeneralInputChange('leasing_commissions', 'lc_rate_renewal', e.target.value)} className="w-24 h-8 text-sm text-blue-600 font-medium text-right border-blue-200 focus:border-blue-500 focus:ring-blue-500" step="0.01" placeholder="%" inputMode="numeric"/>
                     </div>
                 </section>
             </div>

             {/* --- Capital Reserves Section --- */}
             <section className="bg-white p-4 shadow rounded-lg space-y-3">
                 <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-2">Capital Reserves</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                     <div className="flex items-center justify-between">
                         <Label htmlFor="reserve_per_sf" className="text-sm text-gray-600">Annual Reserve $/SF:</Label>
                         <Input id="reserve_per_sf" type="number" value={capital_reserves?.reserve_per_sf?.toFixed(2) ?? ''} onChange={(e) => handleGeneralInputChange('capital_reserves', 'reserve_per_sf', e.target.value)} className="w-24 h-8 text-sm text-blue-600 font-medium text-right border-blue-200 focus:border-blue-500 focus:ring-blue-500" step="0.01" inputMode="numeric"/>
                     </div>
                     <div className="flex items-center justify-between">
                         <span className="text-sm text-gray-600">Calculated Annual Reserve:</span>
                         <span className="text-sm font-medium text-gray-900">{formatNumber(capital_reserves?.annual_reserve_amount, 'currency')}</span>
                     </div>
                 </div>
             </section>

            {/* --- Yearly Totals & Chart Section --- */}
            <section className="bg-white p-4 shadow rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Yearly Capital Costs & Reserves Summary</h3>
                <div className="overflow-x-auto mb-6">
                    <Table className="min-w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="sticky left-0 bg-gray-50 z-10 w-[180px]">Item</TableHead>
                                {yearly_totals?.map(yt => <TableHead key={yt.year} className="w-[120px]">{yt.year}</TableHead>)}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             <TableRow className="bg-gray-100 font-semibold"><TableCell colSpan={(yearly_totals?.length ?? 0) + 1} className="sticky left-0 bg-gray-100 z-10">Capital Costs</TableCell></TableRow>
                            <TableRow>
                                <TableCell className="sticky left-0 bg-white z-10">Planned Projects</TableCell>
                                {yearly_totals?.map(yt => <TableCell key={yt.year}>{formatNumber(yt.planned_projects, 'currency')}</TableCell>)}
                            </TableRow>
                            <TableRow>
                                <TableCell className="sticky left-0 bg-white z-10">Tenant Improvements</TableCell>
                                {yearly_totals?.map(yt => <TableCell key={yt.year}>{formatNumber(yt.tenant_improvements, 'currency')}</TableCell>)}
                            </TableRow>
                            <TableRow>
                                <TableCell className="sticky left-0 bg-white z-10">Leasing Commissions</TableCell>
                                {yearly_totals?.map(yt => <TableCell key={yt.year}>{formatNumber(yt.leasing_commissions, 'currency')}</TableCell>)}
                            </TableRow>
                            <TableRow className="font-bold bg-blue-100">
                                <TableCell className="sticky left-0 bg-blue-100 z-10">Total Capital Costs</TableCell>
                                {yearly_totals?.map(yt => <TableCell key={yt.year}>{formatNumber(yt.total_capex, 'currency')}</TableCell>)}
                            </TableRow>
                            <TableRow className="bg-gray-100 font-semibold mt-4"><TableCell colSpan={(yearly_totals?.length ?? 0) + 1} className="sticky left-0 bg-gray-100 z-10">Capital Reserves</TableCell></TableRow>
                             <TableRow>
                                <TableCell className="sticky left-0 bg-white z-10">Annual Contribution</TableCell>
                                {yearly_totals?.map(yt => <TableCell key={yt.year}>{formatNumber(yt.reserve_contribution, 'currency')}</TableCell>)}
                            </TableRow>
                             <TableRow>
                                <TableCell className="sticky left-0 bg-white z-10">Reserve Utilization (Projects)</TableCell>
                                {yearly_totals?.map(yt => <TableCell key={yt.year}>({formatNumber(yt.reserve_utilization, 'currency')})</TableCell>)}
                            </TableRow>
                            <TableRow className="font-semibold bg-gray-50">
                                <TableCell className="sticky left-0 bg-gray-50 z-10">Ending Reserve Balance</TableCell>
                                {yearly_totals?.map(yt => <TableCell key={yt.year}>{formatNumber(yt.reserve_ending_balance, 'currency')}</TableCell>)}
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Stacked Bar Chart */}
                <h4 className="text-md font-medium text-gray-800 mb-3">Total Capital Costs by Category</h4>
                <div style={{ width: '100%', height: 300 }}>
                     <ResponsiveContainer>
                        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis tickFormatter={(value) => formatNumber(value, 'currency')} />
                            <Tooltip formatter={(value) => formatNumber(value, 'currency')} />
                            <Legend />
                            {Object.entries(stackColors).map(([key, color]) => (
                                <Bar key={key} dataKey={key} stackId="a" fill={color} />
                            ))}
                        </BarChart>
                     </ResponsiveContainer>
                 </div>
            </section>

        </div>
    );
}

export default CapExPlan; 