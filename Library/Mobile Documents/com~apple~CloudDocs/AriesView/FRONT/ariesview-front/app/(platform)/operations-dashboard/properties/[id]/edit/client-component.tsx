'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

interface PropertyDetails {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  type: string;
  size: string;
  yearBuilt: string;
  purchasePrice: string;
  currentValue: string;
  occupancyRate: string;
  annualIncome: string;
  annualExpenses: string;
}

export default function EditClient() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;
  
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Property types for dropdown
  const propertyTypes = [
    'Multifamily',
    'Office',
    'Retail',
    'Industrial',
    'Mixed-Use',
    'Land',
    'Hotel',
    'Other'
  ];
  
  useEffect(() => {
    // Simulate fetching property data from API or localStorage
    const fetchProperty = () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // For now, check if we have the property in localStorage
        const savedProperties = localStorage.getItem('ariesviewProperties');
        if (savedProperties) {
          const parsedProperties = JSON.parse(savedProperties);
          const foundProperty = parsedProperties.find((p: any) => p.id === propertyId);
          
          if (foundProperty) {
            setProperty(foundProperty);
          } else {
            // If not found in localStorage, create mock data
            setProperty({
              id: propertyId,
              name: 'Oakwood Apartments',
              address: '123 Main St',
              city: 'San Francisco',
              state: 'CA',
              zip: '94105',
              type: 'Multifamily',
              size: '45,000 sq ft',
              yearBuilt: '2005',
              purchasePrice: '4,200,000',
              currentValue: '4,500,000',
              occupancyRate: '92',
              annualIncome: '620,000',
              annualExpenses: '310,000'
            });
          }
        } else {
          // No saved properties, create mock data
          setProperty({
            id: propertyId,
            name: 'Oakwood Apartments',
            address: '123 Main St',
            city: 'San Francisco',
            state: 'CA',
            zip: '94105',
            type: 'Multifamily',
            size: '45,000 sq ft',
            yearBuilt: '2005',
            purchasePrice: '4,200,000',
            currentValue: '4,500,000',
            occupancyRate: '92',
            annualIncome: '620,000',
            annualExpenses: '310,000'
          });
        }
      } catch (err) {
        setError('Failed to load property data. Please try again.');
        console.error('Error loading property:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperty();
  }, [propertyId]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (property) {
      setProperty({
        ...property,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!property) return;
    
    try {
      setSaving(true);
      
      // In a real app, this would be an API call to update the property
      // For now, we'll update the property in localStorage
      const savedProperties = localStorage.getItem('ariesviewProperties');
      let updatedProperties = [];
      
      if (savedProperties) {
        const parsedProperties = JSON.parse(savedProperties);
        const propertyIndex = parsedProperties.findIndex((p: any) => p.id === propertyId);
        
        if (propertyIndex !== -1) {
          // Update existing property
          parsedProperties[propertyIndex] = property;
          updatedProperties = parsedProperties;
        } else {
          // Add as new property if not found
          updatedProperties = [...parsedProperties, property];
        }
      } else {
        // No existing properties, create new array
        updatedProperties = [property];
      }
      
      // Save updated properties to localStorage
      localStorage.setItem('ariesviewProperties', JSON.stringify(updatedProperties));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to property detail page after successful save
      router.push(`/operations-dashboard/properties/${propertyId}`);
    } catch (err) {
      setError('Failed to save property. Please try again.');
      console.error('Error saving property:', err);
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Property</h2>
          <p className="text-gray-500">Please wait while we load the property details...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#0066cc] text-white rounded-md hover:bg-[#0055aa]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Property Not Found</h2>
          <p className="text-gray-700 mb-4">The property you're looking for does not exist.</p>
          <Link
            href="/operations-dashboard/properties"
            className="px-4 py-2 bg-[#0066cc] text-white rounded-md hover:bg-[#0055aa]"
          >
            View All Properties
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Link 
              href={`/operations-dashboard/properties/${propertyId}`}
              className="text-[#0066cc] hover:text-[#0055aa] flex items-center mr-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Property
            </Link>
            <h1 className="text-2xl font-bold text-[#0066cc]">Edit Property</h1>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-[#0066cc]">Property Details</h2>
          </div>
          
          <div className="p-6">
            {/* Property Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Property Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={property.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={property.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]"
                    required
                  >
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={property.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={property.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={property.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP
                      </label>
                      <input
                        type="text"
                        id="zip"
                        name="zip"
                        value={property.zip}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                    Size (sq ft)
                  </label>
                  <input
                    type="text"
                    id="size"
                    name="size"
                    value={property.size}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]"
                  />
                </div>
                
                <div>
                  <label htmlFor="yearBuilt" className="block text-sm font-medium text-gray-700 mb-1">
                    Year Built
                  </label>
                  <input
                    type="text"
                    id="yearBuilt"
                    name="yearBuilt"
                    value={property.yearBuilt}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]"
                  />
                </div>
              </div>
            </div>
            
            {/* Financial Information Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Financial Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Purchase Price ($)
                  </label>
                  <input
                    type="text"
                    id="purchasePrice"
                    name="purchasePrice"
                    value={property.purchasePrice}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]"
                  />
                </div>
                
                <div>
                  <label htmlFor="currentValue" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Value ($)
                  </label>
                  <input
                    type="text"
                    id="currentValue"
                    name="currentValue"
                    value={property.currentValue}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]"
                  />
                </div>
                
                <div>
                  <label htmlFor="occupancyRate" className="block text-sm font-medium text-gray-700 mb-1">
                    Occupancy Rate (%)
                  </label>
                  <input
                    type="text"
                    id="occupancyRate"
                    name="occupancyRate"
                    value={property.occupancyRate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]"
                  />
                </div>
                
                <div>
                  <label htmlFor="annualIncome" className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Income ($)
                  </label>
                  <input
                    type="text"
                    id="annualIncome"
                    name="annualIncome"
                    value={property.annualIncome}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]"
                  />
                </div>
                
                <div>
                  <label htmlFor="annualExpenses" className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Expenses ($)
                  </label>
                  <input
                    type="text"
                    id="annualExpenses"
                    name="annualExpenses"
                    value={property.annualExpenses}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0066cc] focus:border-[#0066cc]"
                  />
                </div>
              </div>
            </div>
            
            {/* Buttons */}
            <div className="mt-8 flex justify-end">
              <Link
                href={`/operations-dashboard/properties/${propertyId}`}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-4"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0066cc] text-white rounded-md hover:bg-[#0055aa] flex items-center"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving Changes...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 