"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useUnitMixSummary,
  useUnitMixData,
  formatCurrencyDetailed,
  formatNumber,
  Unit
} from "@/app/rest/unit";

// Define summary data structure
interface UnitMixItem {
  type: string;
  unitCount: number;
  totalRentableSf: number;
  avgSf: number;
  avgRentSf: number;
}

export function UnitMixSummaryTable({ propertyId, updateTrigger = 0 }: { propertyId: string, updateTrigger?: number }) {
  const { data: units = [], isLoading, error } = useUnitMixSummary(propertyId);
  const calculateUnitMix = useUnitMixData(units);
  const { unitMixData, totals } = calculateUnitMix();

  if (error) {
    return (
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Unit Mix</h3>
        <div className="border-b-2 border-gray-300 mb-4"></div>
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg" role="alert">
          <p><span className="font-bold">Error loading unit mix:</span> {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8"> 
      <h3 className="text-xl font-semibold mb-2">Unit Mix</h3>
      <div className="border-b-2 border-gray-300 mb-4"></div>
      <div className="w-full border rounded-lg overflow-hidden shadow-sm bg-card">
        <Table className="text-sm"> 
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-center">Type</TableHead>
              <TableHead className="text-center">Unit Count</TableHead>
              <TableHead className="text-center">Total Rentable SF</TableHead>
              <TableHead className="text-center">Avg SF</TableHead>
              <TableHead className="text-center">Avg Rent/SF</TableHead>
            </TableRow>
          </TableHeader>
          {isLoading ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                  Loading unit mix data...
                </TableCell>
              </TableRow>
            </TableBody>
          ) : unitMixData.length > 0 ? (
            <TableBody>
              {unitMixData.map((item) => (
                <TableRow key={item.type}> 
                  <TableCell className="font-medium text-center">{item.type}</TableCell>
                  <TableCell className="text-center">{formatNumber(item.unitCount)}</TableCell>
                  <TableCell className="text-center">{formatNumber(item.totalRentableSf)}</TableCell>
                  <TableCell className="text-center">{formatNumber(item.avgSf)}</TableCell>
                  <TableCell className="text-center">{formatCurrencyDetailed(item.avgRentSf)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                  No units available to calculate mix data.
                </TableCell>
              </TableRow>
            </TableBody>
          )}
          {unitMixData.length > 0 && (
            <TableFooter className="bg-muted/50">
              <TableRow>
                <TableCell className="font-bold text-center">Total</TableCell>
                <TableCell className="font-bold text-center">{formatNumber(totals.unitCount)}</TableCell>
                <TableCell className="font-bold text-center">{formatNumber(totals.totalRentableSf)}</TableCell>
                <TableCell className="font-bold text-center">{formatNumber(totals.avgSf)}</TableCell>
                <TableCell className="font-bold text-center">{formatCurrencyDetailed(totals.avgRentSf)}</TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
    </div>
  );
} 