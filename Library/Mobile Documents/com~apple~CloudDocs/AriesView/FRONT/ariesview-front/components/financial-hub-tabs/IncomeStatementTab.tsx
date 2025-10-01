import React, { useEffect, useState } from "react";
import {
  years,
  formatNumber,
  useIncomeStatementFromStorage,
  useIncomeStatementFromAPI,
  useUpdateIncomeStatementRow,
  type IncomeStatementRow,
} from "@/app/rest/incomestatement";



type IncomeStatementTabProps = {
  propertyId: string;
  onImport?: () => void;
  onPdfUpload?: (file: File) => void;
}

const IncomeStatementTab: React.FC<IncomeStatementTabProps> = ({ propertyId, onImport, onPdfUpload }) => {
  const [rows, setRows] = useState<IncomeStatementRow[]>([]);
  
  // Use the new hooks
  const loadDataFromStorage = useIncomeStatementFromStorage();
  const { data: apiData, isLoading, error } = useIncomeStatementFromAPI(propertyId);
  const updateRow = useUpdateIncomeStatementRow();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onPdfUpload) onPdfUpload(file);
  };

  const handleInputChange = (rowIdx: number, colIdx: number, value: string | number) => {
    const updatedRows = updateRow(rows, rowIdx, colIdx, value);
    setRows(updatedRows);
  };

  // Load data from localStorage on mount
  useEffect(() => {
    if (propertyId) {
      const storageData = loadDataFromStorage();
      if (storageData.length > 0) {
        setRows(storageData);
      }
    }
  }, [propertyId, loadDataFromStorage]);

  // Update rows when API data is available
  useEffect(() => {
    if (apiData && apiData.length > 0) {
      setRows(apiData);
    }
  }, [apiData]);

  return (
    <div className="space-y-6 p-1">
      {/* Top right Import (blue) */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Income Statement
        </h2>
        <button
          type="button"
          onClick={onImport ?? (() => { })}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Import Data
        </button>
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="p-4 text-center text-gray-600">
          Loading income statement data...
        </div>
      )}

      {error && (
        <div className="p-4 text-center text-red-600 bg-red-50 border border-red-200 rounded">
          Error loading income statement data: {error.message}
        </div>
      )}

      {/* Upload card with blue buttons */}
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center">
        <div className="text-3xl leading-none mb-2">📄</div>
        <div className="font-medium text-gray-900">
          Upload PDF to auto-generate table
        </div>
        <p className="text-sm text-gray-500 mb-3">
          Upload your income statement PDF to automatically extract and format
          data.
        </p>
        <div className="flex items-center justify-center gap-3">
          <label className="cursor-pointer inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
            Select File
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFile}
            />
          </label>
          <button
            type="button"
            onClick={() => { }}
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Extract Data
          </button>
        </div>
      </div>

      {/* Table with full grid + left-aligned numerics */}
      <div className="overflow-x-auto bg-white p-4 shadow rounded-lg">
        <h3 className="text-base font-semibold mb-3 text-gray-900">
          Simple Acquisition Model for Office‑Retail‑Industrial
        </h3>

        <table className="min-w-full text-sm border border-gray-200">
          <thead>
            <tr className="bg-gray-50 text-gray-700">
              <th className="p-2 text-left border border-gray-200">
                Line Item
              </th>
              {years.map((y) => (
                <th key={y} className="p-2 text-left border border-gray-200">
                  {y}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={row.label} className="border-b">
                <td className="p-2 font-medium whitespace-nowrap">
                  {row.label}
                </td>
                {row.values.map((value, colIdx) => {
                  const cellClass = "w-20 px-2 py-1 border rounded text-right text-black bg-white font-semibold";
                  return (
                    <td key={colIdx} className="p-1">
                      <span className={cellClass}>{formatNumber(value)}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
            {/* {rows.map((row, rowIdx) => (
              <tr key={row.label} className="border-b">
                <td className="p-2 font-medium whitespace-nowrap">
                  {row.label}
                </td>
                {row.values.map((v, i) => (
                  <td key={i} className="p-2 border border-gray-200">
                    <span className="whitespace-nowrap">{fmt(v)}</span>
                  </td>
                ))}
              </tr>
            ))} */}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default IncomeStatementTab;

