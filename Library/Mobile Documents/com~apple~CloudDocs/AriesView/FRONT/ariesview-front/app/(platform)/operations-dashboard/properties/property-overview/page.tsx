'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import PropertyImageThumbnail from './components/PropertyImageThumbnail'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash2 } from "lucide-react"
import { useRouter } from 'next/navigation'
import { 
  useProperties, 
  useDeleteProperty, 
  useDashboardSummary,
  formatCurrency,
  filterProperties,
  groupPropertiesByFund,
  getUniqueFunds,
  getStatusBadgeStyle,
} from '@/app/rest/resources'

// Local type definitions
interface Property {
  id: string;
  name: string;
  address: string;
  status: string;
  property_type: string;
  acquisition_date?: string | null;
  acquisition_price?: number | null;
  market_value?: number | null;
  square_footage?: number | null;
  year_built?: number | null;
  notes?: string | null;
  created_at: string;
  updated_at?: string | null;
  user_ref_id: string;
  image?: string;
  category?: string;
  fund?: string;
  units?: number;
  occupancy?: number;
  roi?: number;
  value?: number;
}

interface DashboardSummary {
  propertiesUnderManagement: number;
  unitsUnderManagement: number;
  propertiesUnderEvaluation: number;
  propertiesForLiquidation: number;
  totalMarketValue: number;
}

interface VisibleSectionsState {
  [key: string]: boolean;
}

export default function PropertyOverview() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFund, setSelectedFund] = useState('all')
  const [visibleSections, setVisibleSections] = useState<VisibleSectionsState>({})
  const router = useRouter();
  
  // Use the new hooks
  const { data: propertiesdata, isLoading, error } = useProperties();
  const { data: summaryData, isLoading: loadingSummary } = useDashboardSummary();
  const deletePropertyMutation = useDeleteProperty();
  
  // Extract properties array from the response data
  const properties: Property[] = propertiesdata?.properties || [];
  const summary = summaryData?.summary || null;

  // Initialize visibleSections based on fetched funds when properties change
  useEffect(() => {
    if (properties.length > 0) {
      const initialSections: VisibleSectionsState = {}
      const fundsInData = new Set<string>()
      properties.forEach((p: Property) => {
        const fundKey = p.fund || 'Uncategorized' 
        if (!fundsInData.has(fundKey)) {
            initialSections[fundKey] = true 
            fundsInData.add(fundKey)
        }
      })
      setVisibleSections(initialSections)
    }
  }, [properties])

  // Get unique funds from fetched data
  const funds = getUniqueFunds(properties);

  // Filter properties based on selected filter, fund, and search query
  const filteredProperties = filterProperties(properties, searchQuery, selectedFilter, selectedFund);

  // Group properties by fund
  const propertiesByFund = groupPropertiesByFund(filteredProperties);

  // Calculate portfolio metrics
  const relevantProperties = selectedFund === 'all'
    ? filteredProperties
    : filteredProperties.filter(p => (p.fund || 'Uncategorized') === selectedFund)

  // --- Filtering Logic for table view ---
  const relevantPropertiesTable = useMemo(() => {
    if (selectedFund === 'all') {
      return properties
    } else {
      return properties.filter(p => p.fund === selectedFund)
    }
  }, [properties, selectedFund])

  const toggleSection = (section: string) => {
    setVisibleSections(prev => ({
      ...prev,
      [section]: !(prev[section] ?? true)
    }))
  }

  // --- Delete Property Handler ---
  const handleDeleteProperty = async (propertyIdToDelete: string, propertyName: string) => {
    // Simple browser confirmation
    if (!window.confirm(`Are you sure you want to delete "${propertyName}"? This action cannot be undone.`)) {
        return;
    }

    try {
        await deletePropertyMutation.mutateAsync(propertyIdToDelete);
        console.log(`Property ${propertyIdToDelete} deleted successfully.`);
    } catch (err) {
        console.error('Failed to delete property:', err);
        // The mutation will handle the error state automatically
    }
  };

  // --- GridView Component ---
  const GridView = ({ properties }: { properties: Property[] }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {properties.map((property) => (
        <div key={property.id} className="bg-white rounded-lg shadow overflow-hidden flex flex-col relative">
          {deletePropertyMutation.isPending && deletePropertyMutation.variables === property.id && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <span className="ml-2 text-sm text-red-600">Deleting...</span>
            </div>
          )}
          <Link href={`/operations-dashboard/properties/${property.id}`} className="block hover:opacity-90 transition-opacity">
             <PropertyImageThumbnail propertyId={property.id} altText={property.name} className="w-full h-48 object-cover" />
          </Link>
          <div className="p-4 flex-grow flex flex-col justify-between">
            <div>
                <Link href={`/operations-dashboard/properties/${property.id}`} className="block">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate" title={property.name}>{property.name}</h3>
                </Link>
                <p className="text-sm text-gray-500 mb-2 truncate" title={property.address}>{property.address}</p>
                <p className="text-sm text-gray-600 mb-1">Type: {property.property_type || 'N/A'}</p>
                <p className="text-sm mb-3">
                  Status:
                  <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeStyle(property.status)}`}>
                    {property.status || 'N/A'}
                  </span>
                </p>
            </div>
            <div className="border-t pt-3 mt-3">
                 <p className="text-sm text-gray-500 mb-1">Market Value: {formatCurrency(property.market_value)}</p>
                 <p className="text-sm text-gray-500 mb-3">Fund: {property.fund || 'N/A'}</p>
                {/* Action Links */}
                <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Link 
                            href={`/operations-dashboard/properties/${property.id}/financial-hub`} 
                            className="text-sm text-indigo-600 hover:text-indigo-900 font-medium inline-flex items-center"
                        >
                            Financial Hub
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </Link>
                        <Link
                            href={`/operations-dashboard/properties/${property.id}/edit`}
                            className="text-sm text-gray-600 hover:text-gray-900 font-medium inline-flex items-center"
                        >
                            Edit
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </div>
                    <button
                        onClick={() => handleDeleteProperty(property.id, property.name)}
                        disabled={deletePropertyMutation.isPending && deletePropertyMutation.variables === property.id}
                        className="text-sm text-red-600 hover:text-red-900 font-medium inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete Property"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
             </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Main Return
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen text-gray-600">Loading properties...</div>
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Check if it's an authentication error but the user is still logged in
    if (errorMessage.includes('Authentication failed') || errorMessage.includes('Authentication required')) {
      return <div className="flex flex-col justify-center items-center min-h-screen p-4 text-center">
        <h2 className="text-xl font-semibold mb-2">Session Expired</h2>
        <p className="text-sm mb-4">Your session has expired. Please log in again.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh Page
        </button>
      </div>
    }
    
    return <div className="flex flex-col justify-center items-center min-h-screen text-red-600 p-4 text-center">
      <h2 className="text-xl font-semibold mb-2">Error Loading Properties</h2>
      <p className="text-sm mb-4">{errorMessage}</p>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Retry
      </button>
    </div>
  }

  // Show empty state if there are no properties
  if (properties.length === 0 && !isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen w-full p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Property Overview</h1>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  Manage and monitor your real estate portfolio
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Link
                  href="/operations-dashboard/properties/add"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Property
                </Link>
              </div>
            </div>
          </header>
          
          {/* Empty state content */}
          <div className="bg-white rounded-lg shadow-md p-8 py-12 text-center">
            <div className="mx-auto mb-4 h-16 w-16 text-gray-400">
              {/* Placeholder Icon */} 
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Yet</h3>
            <p className="text-gray-500 mb-6">You haven't added any properties to your portfolio.</p>
            <Link
              href="/operations-dashboard/properties/add"
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-3 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                 <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Your First Property
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // *** Main Return Statement Starts Here ***
  return (
    <div className="bg-gray-50 min-h-screen w-full p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 sm:mb-8">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
             <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Property Overview</h1>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                    {selectedFund === 'all' 
                    ? 'Manage and monitor your entire real estate portfolio'
                    : `Viewing properties in ${selectedFund}`}
                </p>
             </div>
             {/* Add Property Button */}
             <div className="mt-4 sm:mt-0">
                <Link
                  href="/operations-dashboard/properties/add"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Property
                </Link>
             </div>
           </div>
        </header>
        
        {/* === Portfolio Summary Cards === */}
        {loadingSummary ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 animate-pulse">
            {/* Placeholder cards for loading state */}
            {[...Array(3)].map((_, i) => (
                 <div key={i} className="bg-white rounded-lg shadow p-4 md:p-5 border-l-4 border-gray-300 overflow-hidden">
                     <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                     <div className="h-6 bg-gray-300 rounded w-1/2 mb-3"></div>
                     <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
            ))}
          </div>
        ) : summary ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 mb-8">
            {/* Card 1: Properties Under Management */}
            <div className="bg-white rounded-lg shadow p-4 md:p-5 border-l-4 border-blue-500 overflow-hidden">
              <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">
                Properties Under Management
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{summary.propertiesUnderManagement}</h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-2">
                  Across all funds
              </p>
            </div>
            {/* Card 2: Units Under Management */}
            <div className="bg-white rounded-lg shadow p-4 md:p-5 border-l-4 border-green-500 overflow-hidden">
              <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Units Under Management</p>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{summary.unitsUnderManagement?.toLocaleString() ?? 'N/A'}</h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-2">
                  Across all funds
              </p>
            </div>
            {/* Card 3: Properties for Liquidation/Sale */}
            <div className="bg-white rounded-lg shadow p-4 md:p-5 border-l-4 border-red-500 overflow-hidden"> 
              <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">For Disposition</p>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{summary.propertiesForLiquidation}</h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-2">
                  Across all funds
              </p>
            </div>
          </div>
        ) : (
           <div className="p-6 mb-8 text-center text-gray-500 bg-white rounded-lg shadow">No summary data available.</div>
        )}
        
                 {/* Delete Error Display */}
         {deletePropertyMutation.error && (
             <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-center" role="alert">
                 <div>
                     <p><span className="font-bold">Delete Error:</span> {deletePropertyMutation.error.message}</p>
                 </div>
                 <button onClick={() => deletePropertyMutation.reset()} className="text-red-700 hover:text-red-900 text-xl font-bold">&times;</button>
             </div>
         )}
        
        {/* Filters and Controls */} 
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
             {/* Search Input */} 
             <div className="w-full sm:flex-1">
                  <div className="relative">
                     <input
                         type="text"
                         placeholder="Search properties..."
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                         suppressHydrationWarning
                     />
                     <div className="absolute left-3 top-2.5 text-gray-400">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                         <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                         </svg>
                     </div>
                 </div>
             </div>
             {/* Other Controls */} 
             <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
                 {/* Fund Selector */} 
                 <select
                     id="fund-selector"
                     aria-label="Select Fund"
                     value={selectedFund}
                     onChange={(e) => setSelectedFund(e.target.value)}
                     className="px-3 sm:px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     suppressHydrationWarning
                     >
                     {funds.map(fund => (
                         <option key={fund} value={fund}>
                         {fund === 'all' ? 'All Funds' : fund}
                         </option>
                     ))}
                 </select>
                 {/* Status Filter */} 
                 <select
                     id="status-filter"
                     aria-label="Filter by Status"
                     value={selectedFilter}
                     onChange={(e) => setSelectedFilter(e.target.value)}
                     className="px-3 sm:px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     suppressHydrationWarning
                 >
                     <option value="all">All Statuses</option>
                     <option value="Active">Active</option>
                     <option value="Owned">Owned</option>
                     <option value="Under Evaluation">Under Evaluation</option>
                     <option value="Pending">Pending</option>
                     <option value="For Liquidation">For Liquidation</option>
                 </select>
                 {/* View Mode Selector */} 
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                      <button
                         onClick={() => setViewMode('grid')}
                         className={`px-2 sm:px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                         aria-label="Grid view"
                         suppressHydrationWarning
                      >
                          {/* Grid Icon SVG */}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                             <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                         </svg>
                      </button>
                      <button
                         onClick={() => setViewMode('list')}
                         className={`px-2 sm:px-3 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                         aria-label="List view"
                         suppressHydrationWarning
                      >
                          {/* List Icon SVG */}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                             <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                         </svg>
                      </button>
                  </div>
             </div>
         </div>

        {/* --- Properties Display Area --- */}
        <div className="mt-8">
          {filteredProperties.length === 0 && !isLoading ? (
            <div className="text-center py-12 text-gray-500">
              No properties found matching your criteria.
            </div>
          ) : (
            <> 
                {/* Conditionally render based on viewMode */} 
                {viewMode === 'list' ? (
                  // *** THIS IS THE CORRECTED LIST VIEW TABLE STRUCTURE ***
                  <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                            {/* Headers matching screenshot 2 + Links */}
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fund</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Occupancy</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {/* Iterate through funds and properties */}
                                                         {relevantPropertiesTable.map(property => (
                                 <tr key={property.id} className={`hover:bg-gray-50 ${deletePropertyMutation.isPending && deletePropertyMutation.variables === property.id ? 'opacity-50' : ''}`}>
                                    {/* Property Name/Address/Image */} 
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <PropertyImageThumbnail 
                                                    propertyId={property.id} 
                                                    altText={property.name}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <Link href={`/operations-dashboard/properties/${property.id}`} className="text-sm font-medium text-gray-900 truncate max-w-xs hover:text-blue-600" title={property.name}>
                                                    {property.name}
                                                </Link>
                                                <div className="text-sm text-gray-500 truncate max-w-xs" title={property.address}>{property.address}</div>
                                            </div>
                                        </div>
                                    </td>
                                    {/* Fund */} 
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.fund || 'N/A'}</td>
                                    {/* Type */} 
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.property_type || 'N/A'}</td>
                                    {/* Units */} 
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{property.units ?? 'N/A'}</td>
                                    {/* Occupancy */} 
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{property.occupancy !== null && property.occupancy !== undefined ? `${property.occupancy}%` : 'N/A'}</td>
                                    {/* Status */} 
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadgeStyle(property.status)}`}>
                                            {property.status || 'N/A'}
                                        </span>
                                    </td>
                                    {/* Value */} 
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{formatCurrency(property.market_value)}</td>
                                    {/* Actions Dropdown */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                        <DropdownMenu>
                                                                                         <DropdownMenuTrigger asChild>
                                                 <Button variant="ghost" className="h-8 w-8 p-0" disabled={deletePropertyMutation.isPending && deletePropertyMutation.variables === property.id}>
                                                     <span className="sr-only">Open menu</span>
                                                     <MoreHorizontal className="h-4 w-4" />
                                                 </Button>
                                             </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => router.push(`/operations-dashboard/properties/${property.id}/edit`)}>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => router.push(`/operations-dashboard/properties/${property.id}`)}>
                                                    View Details
                                                </DropdownMenuItem>
                                                 <DropdownMenuSeparator />
                                                                                                 <DropdownMenuItem 
                                                    onClick={() => handleDeleteProperty(property.id, property.name)} 
                                                    disabled={deletePropertyMutation.isPending && deletePropertyMutation.variables === property.id}
                                                    className="text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-700"
                                                 >
                                                    {deletePropertyMutation.isPending && deletePropertyMutation.variables === property.id ? 'Deleting...' : 'Delete Property'}
                                                 </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                  </div>
                ) : (
                    // Render GridView when viewMode is 'grid'
                     <GridView properties={filteredProperties} />
                )}
            </>
          )}
        </div>
        {/* --- End Properties Display Area --- */}
      </div>
    </div>
  );
}