'use client'

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useFunds,
  useFundPropertySelection,
  useCalculationsManager,
  type FundPropertySelectorProps
} from '../../app/rest/fundpropertyselect';

export default function FundPropertySelector({ 
  initialFundId, 
  initialPropertyId, 
  onSelectionChange, 
  onCalculationsComplete 
}: FundPropertySelectorProps) {
  // Use hooks for data and state management
  const { funds, isLoading, error } = useFunds();
  
  const {
    selectedFundName,
    selectedPropertyId,
    availableProperties,
    handleFundChange,
    handlePropertyChange
  } = useFundPropertySelection(initialFundId, initialPropertyId, onSelectionChange);

  // Manage calculations loading
  const { isCalculating, calculationError } = useCalculationsManager(selectedPropertyId, onCalculationsComplete);

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">Loading funds and properties...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error loading selection data: {error.message}</div>;
  }

  if (calculationError) {
    return <div className="p-4 text-center text-red-500">Error loading calculations: {calculationError.message}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
      <div className="w-full sm:flex-1">
        <label htmlFor="fund-select" className="block text-sm font-medium text-gray-700 mb-1">
          Select Fund
        </label>
        <Select value={selectedFundName ?? ''} onValueChange={handleFundChange}>
          <SelectTrigger id="fund-select" className="w-full">
            <SelectValue placeholder="Select a fund..." />
          </SelectTrigger>
          <SelectContent>
            {funds.length === 0 && <SelectItem value="loading" disabled>Loading funds...</SelectItem>}
            {funds.map((fund) => (
              <SelectItem key={fund.id} value={fund.id}>
                {fund.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:flex-1">
        <label htmlFor="property-select" className="block text-sm font-medium text-gray-700 mb-1">
          Select Property
        </label>
        <Select
          value={selectedPropertyId ?? ''}
          onValueChange={handlePropertyChange}
          disabled={!selectedFundName || availableProperties.length === 0}
        >
          <SelectTrigger id="property-select" className="w-full">
            <SelectValue placeholder={!selectedFundName ? "Select a fund first..." : availableProperties.length === 0 ? "No properties in fund..." : "Select a property..."} />
          </SelectTrigger>
          <SelectContent>
            {availableProperties.length === 0 && selectedFundName && <SelectItem value="loading" disabled>No properties found</SelectItem>}
            {availableProperties.map((property) => (
              <SelectItem key={property.id} value={property.id}>
                {property.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 