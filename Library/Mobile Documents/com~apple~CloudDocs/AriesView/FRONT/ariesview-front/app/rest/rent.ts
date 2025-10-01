import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from './http';

// Types
export interface RentRollUnit {
  id: string;
  unit_number: string;
  square_feet: number;
  property_id: string;
}

export interface RentRollLease {
  id: string;
  unit_id: string;
  tenant_name: string;
  lease_start: string;
  lease_end: string;
  base_rent: number;
  rent_escalation: number;
  recovery_type: 'NNN' | 'Modified Gross' | 'Gross';
  reimburse_percent: number;
  renewal_probability: number;
  market_rent: number;
}

export interface RentRollRow {
  lease_id: string;
  unit_id: string;
  unit_number: string;
  square_feet: number;
  tenant_name: string;
  lease_start: string;
  lease_end: string;
  base_rent: number;
  rent_escalation: number;
  recovery_type: string;
  reimburse_percent: number;
  renewal_probability: number;
  market_rent: number;
}

export interface RentRollData {
  units: RentRollUnit[];
  leases: RentRollLease[];
}

// Hooks
export function useRentRoll(propertyId: string) {
  return useQuery({
    queryKey: ['rent-roll', propertyId],
    queryFn: async () => {
      if (!propertyId) {
        throw new Error('Property ID is required');
      }
      const res = await http.get(`/api/property/${propertyId}/rent-roll`);
      return res.data;
    },
    enabled: !!propertyId,
  });
}

export function useUpdateUnit() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ unitId, unitData }: { unitId: string; unitData: Partial<RentRollUnit> }) => {
      const res = await http.put(`/api/units/${unitId}`, unitData);
      return res.data;
    },
    onSuccess: (_, { unitId }) => {
      queryClient.invalidateQueries({ queryKey: ['rent-roll'] });
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
  });
}

export function useUpdateLease() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ leaseId, leaseData }: { leaseId: string; leaseData: Partial<RentRollLease> }) => {
      const res = await http.put(`/api/leases/${leaseId}`, leaseData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rent-roll'] });
      queryClient.invalidateQueries({ queryKey: ['leases'] });
    },
  });
}

export function useDeleteLease() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (leaseId: string) => {
      const res = await http.delete(`/api/leases/${leaseId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rent-roll'] });
      queryClient.invalidateQueries({ queryKey: ['leases'] });
    },
  });
}

export function useAddUnit() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ propertyId, unitData }: { propertyId: string; unitData: Omit<RentRollUnit, 'id'> }) => {
      const res = await http.post(`/api/property/${propertyId}/units`, unitData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rent-roll'] });
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
  });
}

export function useAddLease() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ unitId, leaseData }: { unitId: string; leaseData: Omit<RentRollLease, 'id'> }) => {
      const res = await http.post(`/api/units/${unitId}/leases`, leaseData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rent-roll'] });
      queryClient.invalidateQueries({ queryKey: ['leases'] });
    },
  });
}

// Utility Functions
export function calculateAnnualRent(baseRent: number, squareFeet: number): number {
  return baseRent * squareFeet * 12;
}

export function calculateTotalSqFt(rentRollData: RentRollRow[]): number {
  return rentRollData.reduce((total, row) => total + (row.square_feet || 0), 0);
}

export function calculateAverageRentPerSqFt(rentRollData: RentRollRow[]): number {
  if (rentRollData.length === 0) return 0;
  
  const totalRent = rentRollData.reduce((sum, row) => sum + (row.base_rent || 0), 0);
  const totalSqFt = calculateTotalSqFt(rentRollData);
  
  return totalSqFt > 0 ? totalRent / totalSqFt : 0;
}

export function calculateOccupancy(rentRollData: RentRollRow[]): number {
  if (rentRollData.length === 0) return 0;
  
  const occupiedUnits = rentRollData.filter(row => row.tenant_name && row.tenant_name.trim() !== '').length;
  return (occupiedUnits / rentRollData.length) * 100;
}

export function calculateWALT(rentRollData: RentRollRow[]): number {
  if (rentRollData.length === 0) return 0;
  
  const now = new Date();
  let totalWeightedMonths = 0;
  let totalRent = 0;
  
  rentRollData.forEach(row => {
    if (row.lease_end) {
      const endDate = new Date(row.lease_end);
      const monthsRemaining = Math.max(0, (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
      const annualRent = calculateAnnualRent(row.base_rent, row.square_feet);
      
      totalWeightedMonths += monthsRemaining * annualRent;
      totalRent += annualRent;
    }
  });
  
  return totalRent > 0 ? totalWeightedMonths / totalRent : 0;
}

export function calculateLeaseExpirationData(rentRollData: RentRollRow[]): number[] {
  const now = new Date();
  const yearlyExpirations = new Array(10).fill(0);
  
  rentRollData.forEach(row => {
    if (row.lease_end) {
      const endDate = new Date(row.lease_end);
      const yearsFromNow = Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
      
      if (yearsFromNow >= 0 && yearsFromNow < 10) {
        yearlyExpirations[yearsFromNow]++;
      }
    }
  });
  
  const totalUnits = rentRollData.length;
  return yearlyExpirations.map(count => totalUnits > 0 ? (count / totalUnits) * 100 : 0);
}

export function calculateProjectedRent(rentRollData: RentRollRow[], year: number): number {
  const now = new Date();
  let projectedRent = 0;
  
  rentRollData.forEach(row => {
    if (row.lease_end) {
      const endDate = new Date(row.lease_end);
      const yearsFromNow = Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
      
      if (yearsFromNow >= year) {
        // Lease is still active
        const annualRent = calculateAnnualRent(row.base_rent, row.square_feet);
        const escalationFactor = Math.pow(1 + (row.rent_escalation || 0), year);
        projectedRent += annualRent * escalationFactor;
      } else {
        // Lease expired, use market rent
        const annualMarketRent = calculateAnnualRent(row.market_rent || row.base_rent, row.square_feet);
        projectedRent += annualMarketRent;
      }
    }
  });
  
  return projectedRent;
}

// Formatting Functions
export function formatCurrency(amount: number, perSqFt: boolean = false): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: perSqFt ? 2 : 0,
  });
  
  return formatter.format(amount) + (perSqFt ? '/SF' : '');
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatDateForInput(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}
