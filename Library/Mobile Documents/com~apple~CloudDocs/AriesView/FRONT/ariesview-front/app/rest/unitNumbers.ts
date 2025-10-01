import { useQuery } from '@tanstack/react-query';
import http from './http';

export const useAllUnits = (propertyId: string) => {
  return useQuery({
    queryKey: ['all-units', propertyId],
    queryFn: async () => {
      if (!propertyId) throw new Error('Property ID is required');
      const response = await http.get(`/api/unit/property/${propertyId}/all-units`);
      if (response.data.success && Array.isArray(response.data.units)) {
        return response.data.units;
      } else {
        throw new Error('Failed to fetch units');
      }
    },
    enabled: !!propertyId,
  });
};