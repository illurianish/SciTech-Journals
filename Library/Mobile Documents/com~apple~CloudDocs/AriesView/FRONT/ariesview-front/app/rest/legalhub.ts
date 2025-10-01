import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import http from './http';

// --- Types ---
export interface PropertyLegalData {
  coreInfo: {
    propertyNameIdentifier: string | null;
    propertyAddress: string | null;
    landlordName: string | null;
    landlordAddress: string | null;
    totalLeasableSquareFeet: number | null;
    zoningCode: string | null;
    easementTypes: string[];
    numberOfSuperiorInterestHolders: number | null;
    listOfSuperiorInterestHolders: string | null;
  };
  sectionP2: {
    parkingFacilitiesDescription: string | null;
    landlordGeneralRepairDuty: string | null;
    landlordsInsurancePolicies: string | null;
  };
}

export interface PropertyLegalFormData {
  name: string;
  address: string;
  landlordName: string;
  landlordAddress: string;
  leasableSqFt: string;
  zoning: string;
  easements: string[];
  numSuperiorHolders: string;
  listSuperiorHolders: string;
  parkingFacilitiesDescription: string;
  landlordGeneralRepairDuty: string;
  landlordsInsurancePolicies: string;
  files: File[];
}

// --- Constants ---
export const ZONING_OPTIONS = [
  "Commercial",
  "Office Zones",
  "Retail Zones",
  "Mixed-Use Zones",
  "Industrial Zones",
] as const;

export const EASEMENT_OPTIONS = [
  "Easement by Necessity",
  "Easement by Prescription",
  "Easement by Condemnation",
  "Easement by Estoppel",
  "Easement by Grant",
] as const;

// --- Utility Functions ---
export const positiveInt = (v: string): string => {
  return v.replace(/[^0-9]/g, "").replace(/^0+(?=\d)/, "");
};

export const formatFileName = (name: string): string => {
  return name.replace(/[^a-z0-9-_]+/gi, "_");
};

// --- Hooks ---
export const usePropertyLegalData = (propertyId: string) => {
  return useQuery({
    queryKey: ['property-legal-data', propertyId],
    queryFn: async () => {
      if (!propertyId) {
        throw new Error("Property ID is missing.");
      }

      const response = await http.get(`/api/property/${propertyId}`);
      
      if (!response.data) {
        throw new Error('No data received from server.');
      }

      const p = response.data?.property ?? response.data;
      
      if (!p) {
        throw new Error('Property data not found.');
      }

      return {
        name: p.name ?? "",
        address: p.address ?? "",
        leasableSqFt: p.square_footage != null ? String(p.square_footage) : "",
        landlordName: p.landlord_name ?? p.landlordName ?? "",
        landlordAddress: p.landlord_address ?? p.landlordAddress ?? "",
        zoning: p.zoning_code ?? p.zoningCode ?? "",
        easements: p.easement_types ?? p.easementTypes ?? [],
        numSuperiorHolders: p.num_superior_holders != null
          ? String(p.num_superior_holders)
          : p.numberOfSuperiorInterestHolders != null
          ? String(p.numberOfSuperiorInterestHolders)
          : "",
        listSuperiorHolders: p.list_superior_holders ?? p.listOfSuperiorInterestHolders ?? "",
        parkingFacilitiesDescription: p.parking_facilities_description ?? p.parkingFacilitiesDescription ?? "",
        landlordGeneralRepairDuty: p.landlord_general_repair_duty ?? p.landlordGeneralRepairDuty ?? "",
        landlordsInsurancePolicies: p.landlords_insurance_policies ?? p.landlordsInsurancePolicies ?? "",
        files: [] as File[]
      };
    },
    enabled: !!propertyId,
  });
};

export const useSavePropertyLegalData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ propertyId, formData }: { propertyId: string; formData: PropertyLegalFormData }) => {
      const payload = {
        coreInfo: {
          propertyNameIdentifier: formData.name || null,
          propertyAddress: formData.address || null,
          landlordName: formData.landlordName || null,
          landlordAddress: formData.landlordAddress || null,
          totalLeasableSquareFeet: formData.leasableSqFt ? Number(formData.leasableSqFt) : null,
          zoningCode: formData.zoning || null,
          easementTypes: formData.easements,
          numberOfSuperiorInterestHolders: formData.numSuperiorHolders
            ? Number(formData.numSuperiorHolders)
            : null,
          listOfSuperiorInterestHolders: formData.listSuperiorHolders || null,
        },
        sectionP2: {
          parkingFacilitiesDescription: formData.parkingFacilitiesDescription || null,
          landlordGeneralRepairDuty: formData.landlordGeneralRepairDuty || null,
          landlordsInsurancePolicies: formData.landlordsInsurancePolicies || null,
        },
      };

      const form = new FormData();
      form.append("payload", JSON.stringify(payload));
      formData.files.forEach((f) => form.append("documents", f));

      const response = await http.post(`/api/legal/${propertyId}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to save property legal data');
      }

      return response.data;
    },
    onSuccess: (_, { propertyId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['property-legal-data', propertyId] });
    },
  });
};

export const useExportPropertyLegalPdf = () => {
  return useMutation({
    mutationFn: async ({ propertyId, formData }: { propertyId: string; formData: PropertyLegalFormData }) => {
      const payload = {
        coreInfo: {
          propertyNameIdentifier: formData.name || null,
          propertyAddress: formData.address || null,
          landlordName: formData.landlordName || null,
          landlordAddress: formData.landlordAddress || null,
          totalLeasableSquareFeet: formData.leasableSqFt ? Number(formData.leasableSqFt) : null,
          zoningCode: formData.zoning || null,
          easementTypes: formData.easements,
          numberOfSuperiorInterestHolders: formData.numSuperiorHolders
            ? Number(formData.numSuperiorHolders)
            : null,
          listOfSuperiorInterestHolders: formData.listSuperiorHolders || null,
        },
        sectionP2: {
          parkingFacilitiesDescription: formData.parkingFacilitiesDescription || null,
          landlordGeneralRepairDuty: formData.landlordGeneralRepairDuty || null,
          landlordsInsurancePolicies: formData.landlordsInsurancePolicies || null,
        },
        propertyDocuments: formData.files.map((f) => ({ name: f.name, size: f.size })),
      };

      const response = await http.post(`/api/legal/${propertyId}/export`, payload, {
        responseType: 'blob',
      });

      return response.data;
    },
  });
};

// --- Property Legal Form Hook ---
export const usePropertyLegalForm = (propertyId: string) => {
  const { data: initialData, isLoading, error } = usePropertyLegalData(propertyId);
  const saveMutation = useSavePropertyLegalData();
  const exportMutation = useExportPropertyLegalPdf();
  
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<PropertyLegalFormData>({
    name: "",
    address: "",
    landlordName: "",
    landlordAddress: "",
    leasableSqFt: "",
    zoning: "",
    easements: [],
    numSuperiorHolders: "",
    listSuperiorHolders: "",
    parkingFacilitiesDescription: "",
    landlordGeneralRepairDuty: "",
    landlordsInsurancePolicies: "",
    files: [],
  });

  const snapshotRef = useRef<PropertyLegalFormData | null>(null);

  // Initialize form data when initial data is loaded
  const initializeFormData = useCallback((data: PropertyLegalFormData) => {
    setFormData(data);
    snapshotRef.current = { ...data };
  }, []);

  // Update form data when initial data changes
  if (initialData && !snapshotRef.current) {
    initializeFormData(initialData);
  }

  const takeSnapshot = useCallback(() => {
    snapshotRef.current = { ...formData };
  }, [formData]);

  const restoreSnapshot = useCallback(() => {
    if (snapshotRef.current) {
      setFormData(snapshotRef.current);
    }
  }, []);

  const toggleEasement = useCallback((value: string) => {
    setFormData(prev => ({
      ...prev,
      easements: prev.easements.includes(value) 
        ? prev.easements.filter(v => v !== value) 
        : [...prev.easements, value]
    }));
  }, []);

  const easementSummary = useCallback(() => {
    if (formData.easements.length === 0) return "Select easements…";
    if (formData.easements.length <= 2) return formData.easements.join(", ");
    return `${formData.easements.slice(0, 2).join(", ")} +${formData.easements.length - 2} more`;
  }, [formData.easements]);

  const handleSave = useCallback(async () => {
    try {
      await saveMutation.mutateAsync({ propertyId, formData });
      setEditing(false);
      takeSnapshot(); // saved state becomes new baseline
      return true;
    } catch (error) {
      console.error("Save failed:", error);
      return false;
    }
  }, [propertyId, formData, saveMutation, takeSnapshot]);

  const handleExportPdf = useCallback(async () => {
    try {
      const blob = await exportMutation.mutateAsync({ propertyId, formData });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${formatFileName(formData.name || "legal-hub")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error("Export PDF failed:", error);
      return false;
    }
  }, [propertyId, formData, exportMutation]);

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      address: "",
      landlordName: "",
      landlordAddress: "",
      leasableSqFt: "",
      zoning: "",
      easements: [],
      numSuperiorHolders: "",
      listSuperiorHolders: "",
      parkingFacilitiesDescription: "",
      landlordGeneralRepairDuty: "",
      landlordsInsurancePolicies: "",
      files: [],
    });
  }, []);

  const startEditing = useCallback(() => {
    takeSnapshot();
    setEditing(true);
  }, [takeSnapshot]);

  const cancelEditing = useCallback(() => {
    restoreSnapshot();
    setEditing(false);
  }, [restoreSnapshot]);

  return {
    // State
    formData,
    setFormData,
    editing,
    isLoading,
    error,
    
    // Mutations
    saveMutation,
    exportMutation,
    
    // Actions
    handleSave,
    handleExportPdf,
    resetForm,
    startEditing,
    cancelEditing,
    toggleEasement,
    
    // Computed
    easementSummary: easementSummary(),
    disabled: !editing,
  };
};
