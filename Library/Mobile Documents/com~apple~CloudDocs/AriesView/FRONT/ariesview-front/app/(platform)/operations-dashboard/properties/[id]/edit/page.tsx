'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation' // Import useParams
import { getAuth, onAuthStateChanged, getIdToken } from "firebase/auth" 
import { app } from "@/app/firebase/config.ts" 
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

// Define structure for property data (match backend schema/frontend needs)
interface PropertyFormData {
  name: string;
  address: string;
  status: string;
  propertyType: string;
  acquisitionDate?: string | null;
  acquisitionPrice?: number | string | null;
  marketValue?: number | string | null;
  squareFootage?: number | string | null;
  yearBuilt?: number | string | null;
  units?: number | string | null;
  fund?: string | null;
  notes?: string | null;
  occupancy?: number | string | null;
}

// Helper to get Firebase token (reuse)
async function getFirebaseAuthToken(): Promise<string | null> {
    const auth = getAuth(app);
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe();
        if (user) {
            try {
            const token = await getIdToken(user, true);
            resolve(token);
            } catch (error) {
            console.error("Error getting Firebase token:", error);
            reject(new Error("Could not get Firebase ID token."));
            }
        } else {
            resolve(null);
        }
        }, (error) => {
            reject(error);
        });
    });
}

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams(); // Get route parameters
  const propertyId = params?.id as string; // Extract property ID

  const [formData, setFormData] = useState<Partial<PropertyFormData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing property data on mount
  useEffect(() => {
    if (!propertyId) {
      setError("Property ID not found in URL.");
      setIsLoading(false);
      return;
    }

    const fetchProperty = async () => {
      setIsLoading(true);
      setError(null);
      let token: string | null = null;
      try {
        token = await getFirebaseAuthToken();
        if (!token) throw new Error("Authentication required.");

        const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const response = await fetch(`${backendUrl}/api/property/${propertyId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch property: ${response.status}`);
        }

        const result = await response.json();
        if (result.success && result.property) {
          // Map backend data (snake_case?) to frontend form state (camelCase)
          // Ensure dates are formatted YYYY-MM-DD for input type=date
           const fetchedData: Partial<PropertyFormData> = {
                name: result.property.name || '',
                address: result.property.address || '',
                status: result.property.status || '',
                propertyType: result.property.property_type || '', // Map property_type
                acquisitionDate: result.property.acquisition_date ? result.property.acquisition_date.split('T')[0] : '',
                acquisitionPrice: result.property.acquisition_price || '',
                marketValue: result.property.market_value || '',
                squareFootage: result.property.square_footage || '',
                yearBuilt: result.property.year_built || '',
                units: result.property.units || '',
                fund: result.property.fund || '',
                notes: result.property.notes || '',
                occupancy: result.property.occupancy || ''
            };
          setFormData(fetchedData);
        } else {
          throw new Error(result.error || "Invalid data received.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "Failed to load property data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null); // Clear error on change
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    let token: string | null = null;

    try {
      token = await getFirebaseAuthToken();
      if (!token) throw new Error("Authentication required.");

      // Prepare payload (map form state back to backend expected format)
      const payload = {
          name: formData.name,
          address: formData.address,
          status: formData.status,
          propertyType: formData.propertyType,
          acquisitionDate: formData.acquisitionDate || null,
          acquisitionPrice: formData.acquisitionPrice ? parseFloat(formData.acquisitionPrice as string) : null,
          marketValue: formData.marketValue ? parseFloat(formData.marketValue as string) : null,
          squareFootage: formData.squareFootage ? parseInt(formData.squareFootage as string, 10) : null,
          yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt as string, 10) : null,
          units: formData.units ? parseInt(formData.units as string, 10) : null,
          fund: formData.fund || null,
          notes: formData.notes || null,
          occupancy: formData.occupancy ? parseFloat(formData.occupancy as string) : null,
      };

      const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(`${backendUrl}/api/property/${propertyId}`, {
        method: 'PUT', // Use PUT for update
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to update property: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        console.log("Property updated successfully!");
        // Redirect back to the property OVERVIEW page
        router.push(`/operations-dashboard/properties/property-overview`);
      } else {
        throw new Error(result.error || "Failed to update property.");
      }

    } catch (err) {
      console.error("Submit error:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Loading/Error states
  if (isLoading) {
    return <div className="p-8 text-center">Loading property data...</div>;
  }

  // Render Form
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Edit Property: {formData.name || '...'}</h1>
            <Link 
              href={`/operations-dashboard/properties/${propertyId}`} 
              className="text-sm text-blue-600 hover:underline"
            >
              Back to Property Details
            </Link>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded" role="alert">
              <p><span className="font-bold">Error:</span> {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
             {/* Property Name */}
             <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Property Name</Label>
                <Input 
                    id="name" 
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    required
                    className="w-full"
                />
             </div>

             {/* Address */}
             <div>
                <Label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</Label>
                <Textarea 
                    id="address" 
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    required
                    rows={2}
                    className="w-full"
                />
             </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status */}
                <div>
                    <Label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</Label>
                    <Select name="status" value={formData.status || ''} onValueChange={(value) => handleChange({ target: { name: 'status', value } } as any)} required>
                        <SelectTrigger id="status"><SelectValue placeholder="Select status..." /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="owned">Owned</SelectItem>
                            <SelectItem value="evaluation">Evaluation</SelectItem>
                            <SelectItem value="liquidation">For Disposition</SelectItem>
                            <SelectItem value="sold">Sold</SelectItem>
                            {/* Add other relevant statuses */}
                        </SelectContent>
                    </Select>
                </div>

                {/* Property Type */}
                <div>
                    <Label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">Property Type</Label>
                     <Select name="propertyType" value={formData.propertyType || ''} onValueChange={(value) => handleChange({ target: { name: 'propertyType', value } } as any)} required>
                        <SelectTrigger id="propertyType"><SelectValue placeholder="Select type..." /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Residential">Residential</SelectItem>
                            <SelectItem value="Commercial">Commercial</SelectItem>
                            <SelectItem value="Industrial">Industrial</SelectItem>
                            <SelectItem value="Land">Land</SelectItem>
                            {/* Add other relevant types */}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Acquisition Date */}
                 <div>
                    <Label htmlFor="acquisitionDate" className="block text-sm font-medium text-gray-700 mb-1">Acquisition Date</Label>
                    <Input 
                        id="acquisitionDate" 
                        name="acquisitionDate"
                        type="date"
                        value={formData.acquisitionDate || ''}
                        onChange={handleChange}
                        className="w-full"
                    />
                 </div>
                 {/* Year Built */}
                 <div>
                    <Label htmlFor="yearBuilt" className="block text-sm font-medium text-gray-700 mb-1">Year Built</Label>
                    <Input 
                        id="yearBuilt" 
                        name="yearBuilt"
                        type="number"
                        value={formData.yearBuilt || ''}
                        onChange={handleChange}
                        className="w-full"
                        placeholder="e.g., 1995"
                    />
                 </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Acquisition Price */}
                <div>
                    <Label htmlFor="acquisitionPrice" className="block text-sm font-medium text-gray-700 mb-1">Acquisition Price ($)</Label>
                    <Input 
                        id="acquisitionPrice" 
                        name="acquisitionPrice"
                        type="number"
                        step="0.01"
                        value={formData.acquisitionPrice || ''}
                        onChange={handleChange}
                        className="w-full"
                        placeholder="e.g., 500000"
                    />
                </div>
                {/* Market Value */}
                <div>
                    <Label htmlFor="marketValue" className="block text-sm font-medium text-gray-700 mb-1">Market Value ($)</Label>
                    <Input 
                        id="marketValue" 
                        name="marketValue"
                        type="number"
                        step="0.01"
                        value={formData.marketValue || ''}
                        onChange={handleChange}
                        className="w-full"
                        placeholder="e.g., 650000"
                    />
                </div>
                 {/* Fund */}
                 <div>
                    <Label htmlFor="fund" className="block text-sm font-medium text-gray-700 mb-1">Fund</Label>
                    <Input 
                        id="fund" 
                        name="fund"
                        value={formData.fund || ''}
                        onChange={handleChange}
                        className="w-full"
                        placeholder="e.g., AriesView Fund I"
                    />
                 </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Square Footage */} 
                <div>
                    <Label htmlFor="squareFootage" className="block text-sm font-medium text-gray-700 mb-1">Square Footage (Sq Ft)</Label>
                    <Input 
                        id="squareFootage" 
                        name="squareFootage"
                        type="number"
                        value={formData.squareFootage || ''}
                        onChange={handleChange}
                        className="w-full"
                        placeholder="e.g., 2500"
                    />
                </div>
                {/* Units */} 
                 <div>
                    <Label htmlFor="units" className="block text-sm font-medium text-gray-700 mb-1">Number of Units</Label>
                    <Input 
                        id="units" 
                        name="units"
                        type="number"
                        value={formData.units || ''}
                        onChange={handleChange}
                        className="w-full"
                        placeholder="e.g., 10"
                    />
                 </div>
                  {/* Occupancy */}
                 <div>
                    <Label htmlFor="occupancy" className="block text-sm font-medium text-gray-700 mb-1">Occupancy (%)</Label>
                    <Input 
                        id="occupancy" 
                        name="occupancy"
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={formData.occupancy || ''}
                        onChange={handleChange}
                        className="w-full"
                        placeholder="e.g., 95.5"
                    />
                 </div>
            </div>

             {/* Notes */}
             <div>
                <Label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</Label>
                <Textarea 
                    id="notes" 
                    name="notes"
                    rows={4}
                    value={formData.notes || ''}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Add any relevant notes about the property..."
                />
             </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={isSubmitting || isLoading}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 