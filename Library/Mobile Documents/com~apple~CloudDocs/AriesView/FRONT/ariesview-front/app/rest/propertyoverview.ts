import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from './http';

// Get dashboard summary
export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: async () => {
      const res = await http.get('/api/dashboard/summary');
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get properties (re-export from property.ts for convenience)
export function useProperties() {
  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const res = await http.get('/api/property');
      return res.data;
    },
  });
}

// Delete property (re-export from property.ts for convenience)
export function useDeleteProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (propertyId: string) => {
      const res = await http.delete(`/api/property/${propertyId}`);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate both properties and dashboard summary
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    },
  });
}

// Utility functions
export const formatCurrency = (value: number | null | undefined) => {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

export const formatNumber = (value: number | null | undefined) => {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US').format(value);
};

export const formatPercent = (value: number | null | undefined) => {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

// Filter properties based on criteria
export const filterProperties = (
  properties: any[],
  searchQuery: string,
  selectedFilter: string,
  selectedFund: string
): any[] => {
  return properties.filter(property => {
    // Status filter
    if (selectedFilter !== 'all' && property.status !== selectedFilter) return false;
    
    // Fund filter
    if (selectedFund !== 'all' && (property.fund || 'Uncategorized') !== selectedFund) return false;

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const nameMatch = property.name?.toLowerCase().includes(query);
      const addressMatch = property.address?.toLowerCase().includes(query);
      const typeMatch = property.property_type?.toLowerCase().includes(query);
      const fundMatch = property.fund?.toLowerCase().includes(query);
      return nameMatch || addressMatch || typeMatch || fundMatch;
    }
    
    return true;
  });
};

// Group properties by fund
export const groupPropertiesByFund = (properties: any[]): { [key: string]: any[] } => {
  const grouped: { [key: string]: any[] } = {};
  
  properties.forEach(property => {
    const fundKey = property.fund || 'Uncategorized';
    if (!grouped[fundKey]) {
      grouped[fundKey] = [];
    }
    grouped[fundKey].push(property);
  });
  
  return grouped;
};

// Get unique funds from properties
export const getUniqueFunds = (properties: any[]): string[] => {
  const funds = new Set<string>();
  properties.forEach(property => {
    if (property.fund) {
      funds.add(property.fund);
    }
  });
  return ['all', ...Array.from(funds)];
};

// Calculate portfolio metrics
export const calculatePortfolioMetrics = (properties: any[]) => {
  const totalProperties = properties.length;
  const totalValue = properties.reduce((sum, property) => sum + (property.market_value || 0), 0);
  const totalUnits = properties.reduce((sum, property) => sum + (property.units || 0), 0);
  
  const statusCounts = properties.reduce((acc, property) => {
    const status = property.status || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  return {
    totalProperties,
    totalValue,
    totalUnits,
    statusCounts,
  };
};

// Get status badge styling
export const getStatusBadgeStyle = (status: string) => {
  switch (status) {
    case 'Active':
    case 'Owned':
      return 'bg-green-100 text-green-800';
    case 'Under Evaluation':
      return 'bg-yellow-100 text-yellow-800';
    case 'Pending':
      return 'bg-orange-100 text-orange-800';
    case 'For Liquidation':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Get property image
export function usePropertyImage(propertyId: string) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  return useQuery({
    queryKey: ['property-image', propertyId, token ?? ''],
    queryFn: async () => {
      if (!propertyId) {
        throw new Error('Property ID is required');
      }
      
      try {
        const res = await http.get(`/api/property/${propertyId}/image`, { responseType: 'blob' });
        const imageBlob = res.data as Blob;
        return URL.createObjectURL(imageBlob);
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 404) {
          throw new Error('Image not found');
        }
        throw new Error(`Failed to fetch image: ${status ?? 'unknown error'}`);
      }
    },
    enabled: !!propertyId && Boolean(token),
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry for 404 errors (image doesn't exist)
      if (error.message === 'Image not found') {
        return false;
      }
      return failureCount < 2;
    },
  });
}
