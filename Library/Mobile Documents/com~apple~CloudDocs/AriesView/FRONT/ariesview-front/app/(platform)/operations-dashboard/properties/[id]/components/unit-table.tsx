"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useUnits,
  useUpdateUnitData,
  useCreateUnit,
  STATUS_OPTIONS,
  LEASE_TYPE_OPTIONS,
  AMENDMENT_TYPE_OPTIONS,
  formatCurrencyDetailed,
  formatDate,
  Unit
} from "@/app/rest/unit";



// --- Main Component ---
// Accept propertyId and onUnitChange callback
export function UnitTable({ 
  propertyId, 
  onUnitChange 
}: { 
  propertyId: string,
  onUnitChange?: () => void 
}) { 

  // --- Hooks ---
  const { data: units = [], isLoading, error: fetchError } = useUnits(propertyId);
  const updateUnitMutation = useUpdateUnitData();
  const createUnitMutation = useCreateUnit();

  // --- State Variables ---
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<Partial<Unit>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isAddingUnit, setIsAddingUnit] = useState<boolean>(false);
  const [newUnitData, setNewUnitData] = useState<Partial<Unit>>({
    unitNumber: '',
    status: 'Vacant',
    property_id: propertyId,
    tenantName: '',
    leaseType: LEASE_TYPE_OPTIONS[0],
    monthlyRent: null,
    rentableArea: null,
    leaseFrom: '',
    leaseTo: '',
    amendmentType: AMENDMENT_TYPE_OPTIONS[0],
    securityDeposit: null,
  }); 

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(units.length / itemsPerPage);
  const currentUnits = units.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  );

  // --- Event Handlers ---
  const handleEdit = (unit: Unit) => {
    setEditingUnitId(unit.unitId); // Still use unitId (UUID) to track the *row* being edited
    // Populate editedData with the current unit's values, including unitNumber
    setEditedData({
      unitNumber: unit.unitNumber,
      status: unit.status,
      tenantName: unit.tenantName,
      leaseType: unit.leaseType,
      monthlyRent: unit.monthlyRent,
      annualizedGross: unit.annualizedGross, // Include if needed, though often calculated
      leaseFrom: unit.leaseFrom,
      leaseTo: unit.leaseTo,
      monthsRemaining: unit.monthsRemaining, // Include if needed, though often calculated
      amendmentType: unit.amendmentType,
      securityDeposit: unit.securityDeposit,
      rentableArea: unit.rentableArea
    });
    setSaveError(null); // Clear previous save errors
  };

  const handleCancel = () => {
    setEditingUnitId(null);
    setEditedData({});
    setSaveError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setEditedData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? parseFloat(value) || 0 : value 
    }));
  };
  
  // Handler for Select components
  const handleSelectChange = (name: keyof Unit, value: string) => {
     setEditedData(prev => ({ 
        ...prev, 
        [name]: value 
      }));
  };

  const handleSave = async (unitId: string) => {
    // Basic validation: Ensure unitNumber is not empty
    if (!editedData.unitNumber?.trim()) {
      setSaveError("Unit Number cannot be empty.");
      return;
    }

    // Make sure editedData only contains fields that should be sent
    const payload: Partial<Unit> = {
      unitNumber: editedData.unitNumber,
      status: editedData.status,
      tenantName: editedData.tenantName,
      leaseType: editedData.leaseType,
      monthlyRent: editedData.monthlyRent,
      leaseFrom: editedData.leaseFrom,
      leaseTo: editedData.leaseTo,
      amendmentType: editedData.amendmentType,
      securityDeposit: editedData.securityDeposit,
      rentableArea: editedData.rentableArea,
    };

    try {
      await updateUnitMutation.mutateAsync({ unitId, unitData: payload });
      setEditingUnitId(null);
      setEditedData({});
      setSaveError(null);
      
      // Notify parent component of the change
      if (onUnitChange) {
        onUnitChange();
      }
    } catch (error) {
      console.error("Error updating unit:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error during update.";
      setSaveError(errorMessage);
    }
  };

  // New handler for adding a unit
  const handleAddUnit = () => {
    setIsAddingUnit(true);
    setNewUnitData({
      unitNumber: '', // Initialize explicitly
      status: 'Vacant',
      property_id: propertyId,
      leaseType: LEASE_TYPE_OPTIONS[0],
      amendmentType: AMENDMENT_TYPE_OPTIONS[0],
      tenantName: '', // Initialize explicitly
      monthlyRent: null, // Initialize as null
      rentableArea: null, // Initialize as null
      leaseFrom: '', // Initialize explicitly
      leaseTo: '', // Initialize explicitly
      securityDeposit: null, // Initialize as null
    });
    setSaveError(null);
  };

  // New handler for canceling add unit
  const handleCancelAddUnit = () => {
    setIsAddingUnit(false);
    setNewUnitData({ // Reset state on cancel too
      unitNumber: '',
      status: 'Vacant',
      property_id: propertyId,
      tenantName: '',
      leaseType: '',
      monthlyRent: null,
      rentableArea: null,
      leaseFrom: '',
      leaseTo: '',
      amendmentType: '',
      securityDeposit: null,
    });
    setSaveError(null);
  };

  // New handler for input changes on new unit
  const handleNewUnitInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setNewUnitData(prev => ({
      ...prev,
      // For numbers, store null if empty, otherwise parse float
      [name]: type === 'number' ? (value === '' ? null : parseFloat(value)) : value
    }));
  };
  
  // New handler for select changes on new unit
  const handleNewUnitSelectChange = (name: keyof Unit, value: string) => {
     setNewUnitData(prev => ({ 
        ...prev, 
        [name]: value 
      }));
  };

  // New handler for saving a new unit
  const handleSaveNewUnit = async () => {
    if (!newUnitData.unitNumber) {
      setSaveError("Unit number is required.");
      return;
    }

    try {
      await createUnitMutation.mutateAsync({
        ...newUnitData,
        property_id: propertyId
      });
      
      setIsAddingUnit(false);
      setNewUnitData({
        status: 'Vacant',
        property_id: propertyId
      });
      setSaveError(null);
      
      // Notify parent component of the change
      if (onUnitChange) {
        onUnitChange();
      }
      
    } catch (err) {
      console.error("Error creating unit:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during save.";
      setSaveError(errorMessage);
    }
  };

  // --- Render Logic ---
  // Add loading and fetch error states to render
  if (fetchError) {
     return (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg" role="alert">
          <p><span className="font-bold">Error loading units:</span> {fetchError.message}</p>
        </div>
      );
  }

  // Optional: Add a loading indicator for the initial fetch
  if (isLoading && units.length === 0 && !fetchError) {
      return (
          <div className="p-4 text-center text-gray-500">
              Loading units...
          </div>
      );
  }

  return (
    <div className="w-full border rounded-lg overflow-hidden shadow-sm bg-card">
       {saveError && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-t-lg" role="alert">
          <p><span className="font-bold">Error saving:</span> {saveError}</p>
        </div>
      )}
      
      {/* Add Unit Button */}
      <div className="p-4 flex justify-end">
        <Button 
          onClick={handleAddUnit} 
          disabled={isAddingUnit || isLoading || updateUnitMutation.isPending || createUnitMutation.isPending}
        >
          Add New Unit
        </Button>
      </div>
      
      {/* Add Unit Form */}
      {isAddingUnit && (
        <div className="p-4 border-t border-b">
          <h3 className="text-lg font-medium mb-4">Add New Unit</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Unit Number*</label>
              <Input
                type="text"
                name="unitNumber" // Use camelCase
                value={newUnitData.unitNumber || ''}
                onChange={handleNewUnitInputChange}
                disabled={isLoading || updateUnitMutation.isPending || createUnitMutation.isPending}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select 
                name="status" 
                value={newUnitData.status || 'Vacant'} 
                onValueChange={(value) => handleNewUnitSelectChange('status', value)}
                disabled={isLoading || updateUnitMutation.isPending || createUnitMutation.isPending}
              >
                <SelectTrigger><SelectValue placeholder="Select status..." /></SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tenant Name</label>
              <Input 
                type="text" 
                name="tenantName"
                value={newUnitData.tenantName || ''} 
                onChange={handleNewUnitInputChange} 
                disabled={isLoading || updateUnitMutation.isPending || createUnitMutation.isPending}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Lease Type</label>
              <Select 
                name="leaseType" 
                value={newUnitData.leaseType || ''} 
                onValueChange={(value) => handleNewUnitSelectChange('leaseType', value)}
                disabled={isLoading || updateUnitMutation.isPending || createUnitMutation.isPending}
              >
                <SelectTrigger><SelectValue placeholder="Select type..." /></SelectTrigger>
                <SelectContent>
                  {LEASE_TYPE_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Monthly Rent</label>
              <Input
                type="number"
                name="monthlyRent"
                value={newUnitData.monthlyRent ?? ''} // Use ?? '' for null check
                onChange={handleNewUnitInputChange}
                step="0.01"
                disabled={isLoading || updateUnitMutation.isPending || createUnitMutation.isPending}
                placeholder="0" // Keep placeholder
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rentable Area (SF)</label>
              <Input
                type="number"
                name="rentableArea"
                value={newUnitData.rentableArea ?? ''} // Use ?? '' for null check
                onChange={handleNewUnitInputChange}
                disabled={isLoading || updateUnitMutation.isPending || createUnitMutation.isPending}
                placeholder="0" // Keep placeholder
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Lease From</label>
              <Input 
                type="date" 
                name="leaseFrom"
                value={newUnitData.leaseFrom || ''} 
                onChange={handleNewUnitInputChange} 
                disabled={isLoading || updateUnitMutation.isPending || createUnitMutation.isPending}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Lease To</label>
              <Input 
                type="date" 
                name="leaseTo"
                value={newUnitData.leaseTo || ''} 
                onChange={handleNewUnitInputChange} 
                disabled={isLoading || updateUnitMutation.isPending || createUnitMutation.isPending}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amendment Type</label>
              <Select 
                name="amendmentType" 
                value={newUnitData.amendmentType || ''} 
                onValueChange={(value) => handleNewUnitSelectChange('amendmentType', value)}
                disabled={isLoading || updateUnitMutation.isPending || createUnitMutation.isPending}
              >
                <SelectTrigger><SelectValue placeholder="Select type..." /></SelectTrigger>
                <SelectContent>
                  {AMENDMENT_TYPE_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Security Deposit</label>
              <Input
                type="number"
                name="securityDeposit"
                value={newUnitData.securityDeposit ?? ''} // Use ?? '' for null check
                onChange={handleNewUnitInputChange}
                step="0.01"
                disabled={isLoading || updateUnitMutation.isPending || createUnitMutation.isPending}
                placeholder="0" // Keep placeholder
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              onClick={handleSaveNewUnit}
              disabled={isLoading || updateUnitMutation.isPending || createUnitMutation.isPending || !newUnitData.unitNumber} // Check unitNumber
            >
              {createUnitMutation.isPending ? 'Saving...' : 'Save Unit'}
            </Button>
            <Button variant="outline" onClick={handleCancelAddUnit} disabled={isLoading || updateUnitMutation.isPending || createUnitMutation.isPending}>
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      {/* Units Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-center px-2 py-3">Unit Number</TableHead>
              <TableHead className="text-center px-2 py-3 whitespace-nowrap">Status</TableHead>
              <TableHead className="text-center px-2 py-3">Tenant Name</TableHead>
              <TableHead className="text-center px-2 py-3">Lease Type</TableHead>
              <TableHead className="text-center px-2 py-3">Monthly Rent</TableHead>
              <TableHead className="text-center px-2 py-3">Annualized Gross</TableHead>
              <TableHead className="text-center px-2 py-3">Lease From</TableHead>
              <TableHead className="text-center px-2 py-3">Lease To</TableHead>
              <TableHead className="text-center px-2 py-3">Months Remaining</TableHead>
              <TableHead className="text-center px-2 py-3">Amendment Type</TableHead>
              <TableHead className="text-center px-2 py-3">Security Deposit</TableHead>
              <TableHead className="text-center px-2 py-3">Rentable Area</TableHead>
              <TableHead className="text-center px-2 py-3 whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUnits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={13} className="text-center text-muted-foreground py-8">
                  No units found for this property.
                </TableCell>
              </TableRow>
            ) : (
              currentUnits.map(unit => (
                <TableRow key={unit.unitId}>
                  <TableCell className="max-w-[8rem] text-center">
                    {editingUnitId === unit.unitId ? (
                      <Input
                        type="text"
                        name="unitNumber"
                        value={editedData.unitNumber || ''}
                        onChange={handleInputChange}
                        disabled={isLoading || updateUnitMutation.isPending || createUnitMutation.isPending}
                        className="w-full"
                      />
                    ) : (
                      <span className="truncate" title={unit.unitNumber}>
                        {unit.unitNumber}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {editingUnitId === unit.unitId ? (
                      <Select
                        name="status"
                        value={editedData.status || ''}
                        onValueChange={(value) => handleSelectChange('status', value)}
                        disabled={isLoading || updateUnitMutation.isPending || createUnitMutation.isPending}
                      >
                        <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map(opt => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      unit.status
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {editingUnitId === unit.unitId ? (
                      <Input
                        type="text"
                        name="tenantName"
                        value={editedData.tenantName || ''}
                        onChange={handleInputChange}
                        disabled={isLoading || updateUnitMutation.isPending || createUnitMutation.isPending}
                      />
                    ) : (
                      unit.tenantName || '-'
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {editingUnitId === unit.unitId ? (
                      <Select
                        name="leaseType"
                        value={editedData.leaseType || ''}
                        onValueChange={(value) => handleSelectChange('leaseType', value)}
                        disabled={isLoading || updateUnitMutation.isPending || createUnitMutation.isPending}
                      >
                        <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                        <SelectContent>
                          {LEASE_TYPE_OPTIONS.map(opt => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      unit.leaseType || '-'
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {editingUnitId === unit.unitId ? (
                      <Input
                        type="number"
                        name="monthlyRent"
                        value={editedData.monthlyRent || 0}
                        onChange={handleInputChange}
                        disabled={isLoading || updateUnitMutation.isPending || createUnitMutation.isPending}
                        step="0.01"
                      />
                    ) : (
                      formatCurrencyDetailed(unit.monthlyRent)
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatCurrencyDetailed(unit.annualizedGross || (unit.monthlyRent ? unit.monthlyRent * 12 : 0))}
                  </TableCell>
                  <TableCell className="text-center">
                    {editingUnitId === unit.unitId ? (
                      <Input
                        type="date"
                        name="leaseFrom"
                        value={editedData.leaseFrom || ''}
                        onChange={handleInputChange}
                        disabled={isLoading || updateUnitMutation.isPending || createUnitMutation.isPending}
                      />
                    ) : (
                      formatDate(unit.leaseFrom)
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {editingUnitId === unit.unitId ? (
                      <Input
                        type="date"
                        name="leaseTo"
                        value={editedData.leaseTo || ''}
                        onChange={handleInputChange}
                        disabled={isLoading || updateUnitMutation.isPending || createUnitMutation.isPending}
                      />
                    ) : (
                      formatDate(unit.leaseTo)
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {unit.monthsRemaining || 0}
                  </TableCell>
                  <TableCell className="text-center">
                    {editingUnitId === unit.unitId ? (
                      <Select
                        name="amendmentType"
                        value={editedData.amendmentType || ''}
                        onValueChange={(value) => handleSelectChange('amendmentType', value)}
                        disabled={isLoading || updateUnitMutation.isPending || createUnitMutation.isPending}
                      >
                        <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                        <SelectContent>
                          {AMENDMENT_TYPE_OPTIONS.map(opt => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      unit.amendmentType || '-'
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {editingUnitId === unit.unitId ? (
                      <Input
                        type="number"
                        name="securityDeposit"
                        value={editedData.securityDeposit || 0}
                        onChange={handleInputChange}
                        disabled={isLoading || updateUnitMutation.isPending || createUnitMutation.isPending}
                        step="0.01"
                      />
                    ) : (
                      formatCurrencyDetailed(unit.securityDeposit)
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {editingUnitId === unit.unitId ? (
                      <Input
                        type="number"
                        name="rentableArea"
                        value={editedData.rentableArea || 0}
                        onChange={handleInputChange}
                        disabled={isLoading || updateUnitMutation.isPending || createUnitMutation.isPending}
                      />
                    ) : (
                      unit.rentableArea || '-'
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {editingUnitId === unit.unitId ? (
                      <div className="flex justify-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleSave(unit.unitId)}
                          disabled={isLoading || updateUnitMutation.isPending || createUnitMutation.isPending}
                        >
                          {updateUnitMutation.isPending ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                          disabled={isLoading || updateUnitMutation.isPending || createUnitMutation.isPending}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(unit)}
                        disabled={isLoading || updateUnitMutation.isPending || createUnitMutation.isPending || editingUnitId !== null}
                      >
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination - only show if we have units */}
      {currentUnits.length > 0 && (
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                />
              </PaginationItem>
              
              {/* Simple page numbers - improve with ellipsis for many pages */}
              {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
} 