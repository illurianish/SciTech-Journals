import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import http from './http';

// --- Types ---
export interface Unit {
  unitId: string;
  unitNumber: string;
  status: string;
  tenantName: string;
  leaseType: string;
  monthlyRent: number;
  annualizedGross: number;
  leaseFrom: string;
  leaseTo: string;
  monthsRemaining: number;
  amendmentType: string;
  securityDeposit: number;
  rentableArea: number;
  property_id?: string;
}

export interface UnitInformation {
  id: number;
  unitNumber: number;
  status: string;
  tenantName: string;
  leaseType: string;
  y0MonthlyRent: number;
  y0AnnualizedGross: number;
  t12MonthlyRent: number;
  t12AnnualizedGross: number;
  proformaMonthlyRent: number;
  proformaAnnualizedGross: number;
  leaseFrom: string;
  leaseTo: string;
  remainingTerm: number;
  amendmentType: string;
  securityDeposit: number;
  rentableArea: number;
}

export interface UnitMixItem {
  type: string;
  unitCount: number;
  totalRentableSf: number;
  avgSf: number;
  avgRentSf: number;
}

// --- Constants ---
export const STATUS_OPTIONS = ["Occupied", "Vacant", "Maintenance"];
export const LEASE_TYPE_OPTIONS = ["Retail Net Lease", "Retail Gross Lease", "Office Net Lease", "Office Gross Lease", "Other"];
export const AMENDMENT_TYPE_OPTIONS = ["Original Lease", "Renewal", "Amendment", "Extension", "Other"];

// --- Utility Functions ---
export const formatCurrencyDetailed = (value: number | null | undefined): string => {
  if (value === null || value === undefined || !Number.isFinite(value)) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return 'N/A';
  return value.toLocaleString();
};

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (e) {
    return 'Invalid Date';
  }
};

export const calculateMonthsRemaining = (endDateString: string | null | undefined): number => {
  if (!endDateString) return 0;
  try {
    const endDate = new Date(endDateString);
    const today = new Date();
    
    const monthDiff = (endDate.getFullYear() - today.getFullYear()) * 12 + 
                      (endDate.getMonth() - today.getMonth());
    
    return Math.max(0, monthDiff);
  } catch (e) {
    return 0;
  }
};

export const calculateRemainingTerm = (leaseFrom: string, leaseTo: string): number => {
  if (!leaseFrom || !leaseTo) return 0;
  const from = new Date(leaseFrom);
  const to = new Date(leaseTo);
  if (isNaN(from.getTime()) || isNaN(to.getTime())) return 0;
  const months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  return Math.max(0, months);
};

// --- Hooks ---
export const useUnits = (propertyId: string) => {
  return useQuery({
    queryKey: ['units', propertyId],
    queryFn: async () => {
      if (!propertyId) {
        throw new Error("Property ID is missing.");
      }

      const response = await http.get(`/api/unit/property/${propertyId}`);
      
      if (response.data.success && Array.isArray(response.data.units)) {
        // Process units to calculate months remaining and ensure unitNumber is present
        return response.data.units.map((unit: any) => ({
          unitId: unit.unitId,
          unitNumber: unit.unitNumber || unit.unit_number || '',
          status: unit.status,
          tenantName: unit.tenantName,
          leaseType: unit.leaseType,
          monthlyRent: unit.monthlyRent,
          annualizedGross: unit.annualizedGross || (unit.monthlyRent ? unit.monthlyRent * 12 : 0),
          leaseFrom: unit.leaseFrom,
          leaseTo: unit.leaseTo,
          monthsRemaining: calculateMonthsRemaining(unit.leaseTo),
          amendmentType: unit.amendmentType,
          securityDeposit: unit.securityDeposit,
          rentableArea: unit.rentableArea,
          property_id: unit.property_id
        }));
      } else {
        throw new Error('Invalid data format received from server.');
      }
    },
    enabled: !!propertyId,
  });
};

export const useUnitMixSummary = (propertyId: string) => {
  return useQuery({
    queryKey: ['unit-mix-summary', propertyId],
    queryFn: async () => {
      if (!propertyId) {
        throw new Error("Property ID is missing.");
      }

      const response = await http.get(`/api/property/${propertyId}/units/mix-summary`);
      
      if (response.data.success && Array.isArray(response.data.units)) {
        return response.data.units;
      } else {
        throw new Error('Invalid data format received from server.');
      }
    },
    enabled: !!propertyId,
  });
};

export const useUpdateUnitData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ unitId, unitData }: { unitId: string; unitData: Partial<Unit> }) => {
      const response = await http.patch(`/api/unit/${unitId}`, unitData);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to update unit');
      }
      
      return response.data.unit;
    },
    onSuccess: (updatedUnit, { unitId }) => {
      // Update the unit in cache with recalculated months remaining
      const processedUnit = {
        ...updatedUnit,
        monthsRemaining: calculateMonthsRemaining(updatedUnit.leaseTo)
      };

      queryClient.setQueryData(['units'], (oldData: Unit[] | undefined) => {
        if (!oldData) return [processedUnit];
        return oldData.map(unit => unit.unitId === unitId ? processedUnit : unit);
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['units'] });
      queryClient.invalidateQueries({ queryKey: ['unit-mix-summary'] });
    },
  });
};

export const useCreateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (unitData: Partial<Unit> & { property_id: string }) => {
      const response = await http.post('/api/unit', unitData);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to create unit');
      }
      
      return response.data.unit;
    },
    onSuccess: (newUnit) => {
      // Process the new unit to include calculated months remaining
      const processedUnit = {
        ...newUnit,
        monthsRemaining: calculateMonthsRemaining(newUnit.leaseTo)
      };

      queryClient.setQueryData(['units'], (oldData: Unit[] | undefined) => {
        if (!oldData) return [processedUnit];
        return [...oldData, processedUnit];
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['units'] });
      queryClient.invalidateQueries({ queryKey: ['unit-mix-summary'] });
    },
  });
};

export const useDeleteUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (unitId: string) => {
      const response = await http.delete(`/api/unit/${unitId}`);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to delete unit');
      }
      
      return response.data;
    },
    onSuccess: (_, unitId) => {
      queryClient.setQueryData(['units'], (oldData: Unit[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter(unit => unit.unitId !== unitId);
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['units'] });
      queryClient.invalidateQueries({ queryKey: ['unit-mix-summary'] });
    },
  });
};

// --- Unit Mix Calculation Hook ---
export const useUnitMixData = (units: Unit[]) => {
  return useCallback(() => {
    if (units.length === 0) {
      return {
        unitMixData: [],
        totals: {
          unitCount: 0,
          totalRentableSf: 0,
          avgSf: 0,
          avgRentSf: 0,
        }
      };
    }

    // Group units by lease type
    const groupedByType = units.reduce((acc, unit) => {
      const type = unit.leaseType || 'Other';
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(unit);
      return acc;
    }, {} as Record<string, Unit[]>);

    // Calculate summary data for each type
    const unitMixData = Object.entries(groupedByType).map(([type, typeUnits]) => {
      const unitCount = typeUnits.length;
      const totalRentableSf = typeUnits.reduce((sum, unit) => sum + (Number(unit.rentableArea) || 0), 0);
      const avgSf = unitCount > 0 ? Math.round(totalRentableSf / unitCount) : 0;
      
      const totalMonthlyRent = typeUnits.reduce((sum, unit) => sum + (Number(unit.monthlyRent) || 0), 0);
      const avgRentSf = (Number.isFinite(totalMonthlyRent) && Number.isFinite(totalRentableSf) && totalRentableSf > 0)
        ? parseFloat((totalMonthlyRent / totalRentableSf).toFixed(2))
        : NaN;
      
      return {
        type,
        unitCount,
        totalRentableSf,
        avgSf,
        avgRentSf
      };
    });

    // Calculate totals
    const totalUnitCount = units.length;
    const totalRentableSf = units.reduce((sum, unit) => sum + (Number(unit.rentableArea) || 0), 0);
    const totalAvgSf = totalUnitCount > 0 ? Math.round(totalRentableSf / totalUnitCount) : 0;
    
    const totalMonthlyRent = units.reduce((sum, unit) => sum + (Number(unit.monthlyRent) || 0), 0);
    const totalAvgRentSf = (Number.isFinite(totalMonthlyRent) && Number.isFinite(totalRentableSf) && totalRentableSf > 0)
      ? parseFloat((totalMonthlyRent / totalRentableSf).toFixed(2))
      : NaN;

    return {
      unitMixData,
      totals: {
        unitCount: totalUnitCount,
        totalRentableSf,
        avgSf: totalAvgSf,
        avgRentSf: totalAvgRentSf,
      }
    };
  }, [units]);
};

// --- Unit Information Table Hooks ---
export const useUnitInformationTable = (initialUnits: UnitInformation[] = []) => {
  const [units, setUnits] = useState<UnitInformation[]>(initialUnits);

  const handleChange = useCallback((idx: number, field: keyof UnitInformation, value: any) => {
    setUnits(prevUnits => prevUnits.map((unit, i) => {
      if (i !== idx) return unit;
      let updated = { ...unit, [field]: value };
      if (field === 'leaseFrom' || field === 'leaseTo') {
        updated.remainingTerm = calculateRemainingTerm(updated.leaseFrom, updated.leaseTo);
      }
      return updated;
    }));
  }, []);

  const handleAdd = useCallback(() => {
    const nextId = units.length > 0 ? Math.max(...units.map(u => u.id || 0)) + 1 : 1;
    setUnits(prevUnits => [
      ...prevUnits,
      {
        id: nextId,
        unitNumber: nextId,
        status: 'Occupied',
        tenantName: '',
        leaseType: '',
        y0MonthlyRent: 0,
        y0AnnualizedGross: 0,
        t12MonthlyRent: 0,
        t12AnnualizedGross: 0,
        proformaMonthlyRent: 0,
        proformaAnnualizedGross: 0,
        leaseFrom: '',
        leaseTo: '',
        remainingTerm: 0,
        amendmentType: '',
        securityDeposit: 0,
        rentableArea: 0,
      },
    ]);
  }, [units.length]);

  const handleDelete = useCallback((idx: number) => {
    setUnits(prevUnits => prevUnits.filter((_, i) => i !== idx));
  }, []);

  const summaryCalculations = useCallback(() => {
    const totalProformaMonthlyRent = units.reduce((sum, u) => sum + (parseFloat(u.proformaMonthlyRent as any) || 0), 0);
    const totalRemainingTerm = units.reduce((sum, u) => sum + (parseInt(u.remainingTerm as any) || 0), 0);
    
    return {
      totalProformaMonthlyRent,
      totalRemainingTerm
    };
  }, [units]);

  return {
    units,
    setUnits,
    handleChange,
    handleAdd,
    handleDelete,
    summaryCalculations: summaryCalculations()
  };
};
