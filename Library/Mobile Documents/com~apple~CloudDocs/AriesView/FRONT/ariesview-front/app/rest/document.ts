import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import http from './http';

// Types
export interface Document {
  id: string;
  title: string;
  dateCreated: string;
  documentType: string;
  documentCategory?: string;
  size: string;
  createdBy: string;
  url: string | null;
  mimeType: string;
  fundId?: string;
  propertyId?: string;
  unitId?: string;
}

export interface DocumentType {
  id: string;
  name: string;
  level: 'property' | 'unit';
  documents: {
    id: string;
    title: string;
    abstraction: string;
    date: string;
  }[];
}

export interface ExtractedData {
  title: string;
  type: string;
  date: string;
  keyPoints: string[];
  entities: {
    name: string;
    type: string;
    value: string;
  }[];
}

// Utility functions
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export const getDocumentTypeFromMimeType = (mimeType: string): string => {
  if (!mimeType) return 'Other';
  
  if (mimeType.includes('pdf')) return 'PDF';
  if (mimeType.includes('word') || mimeType.includes('docx') || mimeType.includes('doc')) return 'Contract';
  if (mimeType.includes('sheet') || mimeType.includes('excel') || mimeType.includes('xls')) return 'Financial';
  if (mimeType.includes('image')) return 'Image';
  if (mimeType.includes('text')) return 'Text';
  
  return 'Other';
};

// Document transformation utilities
const documentTypes = [
  {
    id: 'ownership',
    name: 'Ownership & Transfer',
    level: 'property' as const,
    documents: []
  },
  {
    id: 'legal-compliance',
    name: 'Legal & Compliance',
    level: 'property' as const,
    documents: []
  },
  {
    id: 'financial-insurance',
    name: 'Financial & Insurance',
    level: 'property' as const,
    documents: []
  },
  {
    id: 'operations-entity',
    name: 'Operations & Entity',
    level: 'property' as const,
    documents: []
  },
  {
    id: 'lease-occupancy',
    name: 'Lease & Occupancy',
    level: 'unit' as const,
    documents: []
  },
  {
    id: 'legal-protections',
    name: 'Legal Protections',
    level: 'unit' as const,
    documents: []
  },
  {
    id: 'unit-ops-finance',
    name: 'Operations & Finance',
    level: 'unit' as const,
    documents: []
  }
];

const categoryToGroupIdMap = {
  Property: {
    insurance: 'Ownership & Transfer',
    financial: 'Financial & Insurance',
    tax: 'Operations & Entity',
    legal: 'Legal & Compliance'
  },
  Unit: {
    lease: 'lease-occupancy',
    inspection: 'legal-protections',
    tenant_communication: 'unit-ops-finance'
  }
};

const formatDate = (isoString: string) => isoString.split('T')[0];

export const transformDocuments = (systemResponse: any): DocumentType[] => {
  const result = JSON.parse(JSON.stringify(documentTypes)); // deep copy

  function addToGroup(doc: any, level: string) {
    const groupId = categoryToGroupIdMap[level as keyof typeof categoryToGroupIdMap]?.[doc.documentCategory.toLowerCase() as keyof any];
    if (!groupId) return;

    const targetGroup = result.find(g => g.id === groupId && g.level.toLowerCase() === level.toLowerCase());
    if (!targetGroup) return;

    targetGroup.documents.push({
      id: doc.id,
      title: doc.title,
      abstraction: '', // abstraction not provided
      date: formatDate(doc.dateCreated)
    });
  }

  systemResponse.propertyDocuments.forEach((doc: any) => addToGroup(doc, 'Property'));
  systemResponse.unitDocuments.forEach((doc: any) => addToGroup(doc, 'Unit'));

  return result;
};

// Get documents for a property
export function useGetDocuments(propertyId: string) {
  return useQuery({
    queryKey: ['documents', propertyId],
    queryFn: async () => {
      const res = await http.get(`/api/documents/properties/${propertyId}/documents`);
      return res.data;
    },
    enabled: !!propertyId,
  });
}

// Get a single document by ID
export function useGetDocument(documentId: string) {
  return useQuery({
    queryKey: ['document', documentId],
    queryFn: async () => {
      const res = await http.get(`/api/documents/${documentId}`);
      return res.data;
    },
    enabled: !!documentId,
  });
}

// Add new document
export function useAddDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ propertyId, formData }: { propertyId: string; formData: FormData }) => {
      const res = await http.post(`/api/documents/properties/${propertyId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents', variables.propertyId] });
    },
  });
}

// Update document
export function useUpdateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ documentId, data }: { documentId: string; data: any }) => {
      const res = await http.put(`/api/documents/${documentId}`, data);
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['document', variables.documentId] });
      // Also invalidate the documents list if we have the propertyId
      if (data.propertyId) {
        queryClient.invalidateQueries({ queryKey: ['documents', data.propertyId] });
      }
    },
  });
}

// Delete document
export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ documentId, propertyId }: { documentId: string; propertyId: string }) => {
      const res = await http.delete(`/api/documents/${documentId}`);
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents', variables.propertyId] });
      queryClient.removeQueries({ queryKey: ['document', variables.documentId] });
    },
  });
}

// Get document preview URL
export function useGetDocumentPreview(documentId: string) {
  return useQuery({
    queryKey: ['document-preview', documentId],
    queryFn: async () => {
      const res = await http.get(`/api/documents/${documentId}/preview`);
      return res.data;
    },
    enabled: !!documentId,
  });
}

// Analyze document with AI
export function useAnalyzeDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ documentId }: { documentId: string }) => {
      const res = await http.post(`/api/documents/${documentId}/analyze`);
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['document', variables.documentId] });
    },
  });
}

// Hook for document filtering and search
export const useDocumentFilters = () => {
  return useCallback((documents: Document[], filters: {
    searchQuery: string;
    filterType: string;
    selectedFund?: string;
    selectedProperty?: string;
  }) => {
    return documents.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) || 
                            doc.documentType.toLowerCase().includes(filters.searchQuery.toLowerCase());
      const matchesFilter = filters.filterType === 'all' || doc.documentType.toLowerCase() === filters.filterType.toLowerCase();
      const matchesFund = !filters.selectedFund || doc.fundId === filters.selectedFund;
      const matchesProperty = !filters.selectedProperty || doc.propertyId === filters.selectedProperty;
      return matchesSearch && matchesFilter && matchesFund && matchesProperty;
    });
  }, []);
};

// Hook for document level filtering
export const useDocumentLevelFilter = () => {
  return useCallback((documents: Document[], documentLevel: 'property' | 'unit') => {
    return documents.filter(doc => {
      if (documentLevel === 'property') {
        return doc.propertyId && !doc.unitId;
      } else {
        return doc.unitId;
      }
    });
  }, []);
};

// Hook for document type grouping
export const useDocumentTypeGrouping = () => {
  return useCallback((documents: Document[]) => {
    const propertyLevelTypes = documents.filter((doc) => doc.propertyId && !doc.unitId);
    const unitLevelTypes = documents.filter((doc) => doc.unitId);
    
    return {
      propertyLevelTypes,
      unitLevelTypes
    };
  }, []);
};

// Hook for document preview handling
export const useDocumentPreview = () => {
  return useCallback((doc: Document) => {
    if (!doc.url) {
      throw new Error("Preview URL is not available for this document.");
    }
    return {
      url: doc.url,
      title: doc.title,
      mimeType: doc.mimeType
    };
  }, []);
};

// Hook for document upload with drag and drop
export const useDocumentUpload = () => {
  const addDocumentMutation = useAddDocument();
  
  return useCallback(async ({
    propertyId,
    file,
    documentType,
    documentLevel,
    documentCategory
  }: {
    propertyId: string;
    file: File;
    documentType: string;
    documentLevel: string;
    documentCategory: string;
  }) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);
    formData.append('documentLevel', documentLevel);
    formData.append('documentCategory', documentCategory);

    return addDocumentMutation.mutateAsync({
      propertyId,
      formData
    });
  }, [addDocumentMutation]);
};

// Hook for document deletion with confirmation
export const useDocumentDeletion = () => {
  const deleteDocumentMutation = useDeleteDocument();
  
  return useCallback(async (documentId: string, propertyId: string) => {
    if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return false;
    }
    
    try {
      await deleteDocumentMutation.mutateAsync({ documentId, propertyId });
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }, [deleteDocumentMutation]);
};

// Hook for document save from analysis
export const useDocumentSaveFromAnalysis = () => {
  const queryClient = useQueryClient();
  
  return useCallback((doc: any, propertyId: string) => {
    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      title: doc.title,
      dateCreated: new Date().toISOString().split('T')[0],
      documentType: doc.documentType || 'Legal',
      size: doc.size || '2.4 MB',
      createdBy: 'AI Analyzer',
      url: null,
      mimeType: doc.mimeType || 'application/pdf',
      propertyId: propertyId
    };
    
    // Invalidate documents query to refresh the list
    queryClient.invalidateQueries({ queryKey: ['documents', propertyId] });
    
    return newDocument;
  }, [queryClient]);
};

// Hook for document extraction completion
export const useDocumentExtraction = () => {
  const queryClient = useQueryClient();
  
  return useCallback((data: ExtractedData, propertyId: string) => {
    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      title: data.title,
      dateCreated: data.date,
      documentType: data.type,
      size: '0.5 MB',
      createdBy: 'AI Extractor',
      url: null,
      mimeType: '',
      propertyId: propertyId
    };
    
    // Invalidate documents query to refresh the list
    queryClient.invalidateQueries({ queryKey: ['documents', propertyId] });
    
    return newDocument;
  }, [queryClient]);
};