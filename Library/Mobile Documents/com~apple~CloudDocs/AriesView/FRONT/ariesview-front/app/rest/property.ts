import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from './http';

// Get property endpoint
export function useProperty() {
  return useQuery({
    queryKey: ['property'],
    queryFn: async () => {
      const res = await http.get(`/api/property`);
      return res.data;
    },
  });
}

// Add new property
export function useAddProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await http.post(`/api/property/add`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property'] });
    },
  });
}

// Delete property endpoint
export function useDeleteProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (propertyId: string) => {
      const res = await http.delete(`/api/property/${propertyId}`);
      return res.data;
    },
    onSuccess: () => {
      // Ensure overview screens refresh
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    },
  });
}


// Create property details
export function useCreatePropertyDetails() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (propertyData: any) => {
      const res = await http.post('/api/property/property_details', propertyData);
      return res.data;
    },
    onSuccess: (data) => {
      // Invalidate property-related queries
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      if (data.propertyId) {
        queryClient.invalidateQueries({ queryKey: ['property', data.propertyId] });
      }
    },
  });
}

// Create unit details and finalize property
export function useCreateUnitDetails() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (unitData: any) => {
      const res = await http.post('/api/property_add/unit_add', unitData);
      return res.data;
    },
    onSuccess: (data) => {
      // Invalidate property-related queries
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      if (data.propertyId) {
        queryClient.invalidateQueries({ queryKey: ['property', data.propertyId] });
      }
    },
  });
}
  