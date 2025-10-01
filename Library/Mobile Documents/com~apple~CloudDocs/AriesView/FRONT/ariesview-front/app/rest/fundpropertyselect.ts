import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { useProperties } from './propertyoverview';

// Types
export interface Fund {
  id: string;
  name: string;
}

export interface Property {
  id: string;
  name: string;
  fund?: string | null;
}

export interface FundPropertySelectorProps {
  initialFundId?: string;
  initialPropertyId?: string;
  onSelectionChange: (fundId: string | null, propertyId: string | null) => void;
  onCalculationsComplete: (isLoaded: boolean) => void;
}

// Hook to get funds from properties
export const useFunds = () => {
  const { data: propertiesResponse, isLoading, error } = useProperties();
  
  const funds = useMemo(() => {
    const allProperties = propertiesResponse?.properties || [];
    const fundNames = new Set<string>();
    allProperties.forEach(p => {
      if (p.fund) {
        fundNames.add(p.fund);
      }
    });
    return Array.from(fundNames).sort().map(name => ({ id: name, name: name }));
  }, [propertiesResponse?.properties]);

  return {
    funds,
    isLoading,
    error,
    allProperties: propertiesResponse?.properties || []
  };
};

// Hook to get properties for a specific fund
export const usePropertiesForFund = (selectedFundName: string | null) => {
  const { allProperties } = useFunds();
  
  const availableProperties = useMemo(() => {
    if (!selectedFundName) return [];
    return allProperties.filter(p => (p.fund || null) === selectedFundName);
  }, [selectedFundName, allProperties]);

  return availableProperties;
};

// Hook to handle fund and property selection logic
export const useFundPropertySelection = (
  initialFundId?: string,
  initialPropertyId?: string,
  onSelectionChange?: (fundId: string | null, propertyId: string | null) => void
) => {
  const [selectedFundName, setSelectedFundName] = useState<string | null>(initialFundId || null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(initialPropertyId || null);
  
  const { funds, allProperties } = useFunds();
  const availableProperties = usePropertiesForFund(selectedFundName);
  
  // Use ref to avoid infinite re-renders from onSelectionChange callback
  const onSelectionChangeRef = useRef(onSelectionChange);
  
  // Update ref when callback changes
  useEffect(() => {
    onSelectionChangeRef.current = onSelectionChange;
  }, [onSelectionChange]);

  // Effect to update available properties when selected fund changes or all properties load
  useEffect(() => {
    if (selectedFundName) {
      const propsForFund = allProperties.filter(p => (p.fund || null) === selectedFundName);

      // Check if current or initial property selection is valid for the new fund
      const currentSelectionIsValid = propsForFund.some(p => p.id === selectedPropertyId);
      const initialSelectionIsValid = initialPropertyId ? propsForFund.some(p => p.id === initialPropertyId) : false;

      let nextPropertyId: string | null = null;

      if (currentSelectionIsValid) {
        nextPropertyId = selectedPropertyId; // Keep current if valid
      } else if (initialSelectionIsValid) {
        // If initial prop ID was passed and is valid for this fund, use it
        nextPropertyId = initialPropertyId;
      } else if (propsForFund.length > 0) {
        // Otherwise, default to the first property in the list for this fund
        nextPropertyId = propsForFund[0].id;
      }
      // If no properties for the fund, nextPropertyId remains null

      // Update state and notify parent only if the property ID changes
      if (selectedPropertyId !== nextPropertyId) {
        setSelectedPropertyId(nextPropertyId);
        onSelectionChangeRef.current?.(selectedFundName, nextPropertyId);
      } else {
        // If property hasn't changed, still notify parent about fund potentially changing context
        onSelectionChangeRef.current?.(selectedFundName, selectedPropertyId);
      }

    } else {
      // No fund selected
      if (selectedPropertyId !== null) {
        setSelectedPropertyId(null);
        onSelectionChangeRef.current?.(null, null); // Notify parent
      }
    }
  }, [selectedFundName, allProperties, initialPropertyId, selectedPropertyId]);

  // Set initial fund if provided and valid
  useEffect(() => {
    if (initialFundId && funds.some(f => f.id === initialFundId)) {
      setSelectedFundName(initialFundId);
    }
  }, [initialFundId, funds]);

  const handleFundChange = useCallback((fundName: string) => {
    setSelectedFundName(fundName);
    // Property selection logic is handled in the useEffect above
  }, []);

  const handlePropertyChange = useCallback((propertyId: string) => {
    // Update local state and notify parent
    setSelectedPropertyId(propertyId);
    onSelectionChangeRef.current?.(selectedFundName, propertyId);
  }, [selectedFundName]);

  return {
    selectedFundName,
    selectedPropertyId,
    availableProperties,
    handleFundChange,
    handlePropertyChange
  };
};

// Hook to fetch calculations from Flask API
export const useFetchCalculations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyId: string) => {
      const flaskBackendBaseUrl = process.env.NEXT_PUBLIC_FLASK_SERVICE_URL || 'http://127.0.0.1:5000';

      console.log(`Calling Flask 'calculate' endpoint for property ID: ${propertyId}`);
      const flaskResponse = await fetch(`${flaskBackendBaseUrl}/calculate/${propertyId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: localStorage.getItem("authToken")
        })
      });

      if (!flaskResponse.ok) {
        const errorData = await flaskResponse.json();
        throw new Error(`Server error: ${flaskResponse.status} - ${errorData.error}`);
      }

      const result = await flaskResponse.json();
      console.log('Calculation result received:', result);

      // Store the entire result object in local storage
      localStorage.setItem('financialHubData', JSON.stringify(result));
      console.log('Calculation result stored in local storage.');
      console.log("financialHubData: ", localStorage.getItem('financialHubData'));

      return result;
    },
    onSuccess: (data, propertyId) => {
      // Invalidate related queries if needed
      queryClient.invalidateQueries({ queryKey: ['financial-hub-data', propertyId] });
    },
    onError: (error) => {
      console.error('Error fetching property data from Flask:', error);
      // Optionally, clear the local storage on error
      localStorage.removeItem('financialHubData');
    }
  });
};

// Hook to manage calculations loading state
export const useCalculationsManager = (
  selectedPropertyId: string | null,
  onCalculationsComplete: (isLoaded: boolean) => void
) => {
  const fetchCalculationsMutation = useFetchCalculations();
  const onCalculationsCompleteRef = useRef(onCalculationsComplete);
  const lastPropertyIdRef = useRef<string | null>(null);
  
  // Update ref when callback changes
  useEffect(() => {
    onCalculationsCompleteRef.current = onCalculationsComplete;
  }, [onCalculationsComplete]);

  useEffect(() => {
    // Only run calculation if property ID has actually changed
    if (selectedPropertyId !== lastPropertyIdRef.current) {
      lastPropertyIdRef.current = selectedPropertyId;
      
      if (selectedPropertyId) {
        onCalculationsCompleteRef.current(false);
        fetchCalculationsMutation.mutate(selectedPropertyId, {
          onSettled: () => {
            onCalculationsCompleteRef.current(true);
          }
        });
      } else {
        localStorage.removeItem('financialHubData');
        onCalculationsCompleteRef.current(true);
      }
    }
  }, [selectedPropertyId, fetchCalculationsMutation.mutate]);

  return {
    isCalculating: fetchCalculationsMutation.isPending,
    calculationError: fetchCalculationsMutation.error
  };
};
