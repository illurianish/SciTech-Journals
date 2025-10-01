'use client';

import React, { useState, useRef, useEffect } from 'react';
import { faker } from '@faker-js/faker';
// Import the Handsontable integration helpers
import { useHandsontable, loadHandsontable } from './handsontable-integration';

interface ExcelEditorProps {
  onSave: (data: Array<Array<string>>, title: string, propertyId: string) => void;
}

// Define our row type
interface Row {
  id: string;
  [key: string]: any;
}

// Define column types
const titles = ['Dr.', 'Mr.', 'Mrs.', 'Miss', 'Ms.'] as const;

// Cell formatting options interface
interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  fontFamily?: string;
  format?: 'text' | 'number' | 'currency' | 'percentage' | 'date';
}

// Cell data with style
interface CellData {
  value: string;
  style?: CellStyle;
}

// Generate column letters (A-Z, AA-AZ, etc.)
const generateColumnLetters = (count: number): string[] => {
  const letters: string[] = [];
  
  for (let i = 0; i < count; i++) {
    if (i < 26) {
      // A-Z
      letters.push(String.fromCharCode(65 + i));
    } else {
      // AA, AB, etc.
      const firstChar = String.fromCharCode(65 + Math.floor((i - 26) / 26));
      const secondChar = String.fromCharCode(65 + ((i - 26) % 26));
      letters.push(firstChar + secondChar);
    }
  }
  
  return letters;
};

// Create column headers for the sheet
const COLUMN_LETTERS = generateColumnLetters(40);

const ExcelEditor: React.FC<ExcelEditorProps> = ({ onSave }) => {
  const [title, setTitle] = useState('Financial Template');
  const [selectedProperty, setSelectedProperty] = useState('');
  const [activeCell, setActiveCell] = useState<{rowIdx: number, colIdx: number} | null>(null);
  const [activeCellStyle, setActiveCellStyle] = useState<CellStyle>({});
  const [selectedRange, setSelectedRange] = useState<{
    startRow: number, 
    startCol: number, 
    endRow: number, 
    endCol: number
  } | null>(null);
  const gridWrapperRef = useRef<HTMLDivElement>(null);
  const dataGridRef = useRef<HTMLDivElement>(null);

  // Initialize with empty rows
  const createRows = (): Row[] => {
    const rows: Row[] = [];
    
    for (let i = 1; i <= 40; i++) {
      const row: Row = { id: i.toString() };
      
      for (let j = 0; j < COLUMN_LETTERS.length; j++) {
        const colKey = COLUMN_LETTERS[j];
        row[colKey] = '';
      }
      
      rows.push(row);
    }
    
    return rows;
  };

  const [rows, setRows] = useState<Row[]>(createRows());

  // Load Handsontable
  useEffect(() => {
    loadHandsontable().catch(error => {
      console.error("Failed to load Handsontable:", error);
    });
  }, []);

  // Initialize Handsontable
  const hotInstance = useHandsontable(dataGridRef, rows, setRows, {
    contextMenu: true,
    filters: true,
    mergeCells: true,
    columnSorting: true,
    colHeaders: COLUMN_LETTERS,
    rowHeaders: true,
    manualColumnResize: true,
    manualRowResize: true,
    fixedColumnsLeft: 2,
    fixedRowsTop: 1,
    fillHandle: true,
    autoWrapRow: true,
    autoWrapCol: true,
    afterSelection: (row: number, col: number, row2: number, col2: number) => {
      if (col < 0) return; // Skip row headers
      const colKey = COLUMN_LETTERS[col];
      setActiveCell({ rowIdx: row, colIdx: col });

      if (row !== row2 || col !== col2) {
        // Range selection
        setSelectedRange({
          startRow: row,
          startCol: col,
          endRow: row2,
          endCol: col2
        });
      }

      // Get current cell style
      const cellValue = rows[row]?.[colKey];
      if (typeof cellValue === 'object' && cellValue !== null) {
        setActiveCellStyle(cellValue.style || {});
      } else {
        setActiveCellStyle({});
      }
    }
  });

  // Generate sample data
  const generateSampleData = () => {
    const newRows: Row[] = [];
    
    for (let i = 1; i <= 40; i++) {
      const row: Row = { id: i.toString() };
      
      // Set values for the first 10 columns for demo purposes
      row["A"] = faker.person.firstName();
      row["B"] = faker.person.lastName();
      row["C"] = faker.helpers.arrayElement(titles);
      row["D"] = faker.company.name();
      row["E"] = '$' + faker.finance.amount({ min: 1000, max: 10000, dec: 2 });
      row["F"] = faker.date.past().toLocaleDateString();
      row["G"] = faker.internet.email();
      row["H"] = faker.location.city();
      row["I"] = faker.location.state();
      row["J"] = faker.phone.number();
      
      // Initialize remaining columns as empty
      for (let j = 10; j < COLUMN_LETTERS.length; j++) {
        const colKey = COLUMN_LETTERS[j];
        row[colKey] = '';
      }
      
      newRows.push(row);
    }
    
    setRows(newRows);
  };

  // Convert rows to 2D array for saving
  const convertRowsToArray = (): string[][] => {
    const columns = ['', ...COLUMN_LETTERS];
    const result: string[][] = [columns];
    
    rows.forEach((row) => {
      const rowArray = [row.id];
      
      for (let i = 1; i < columns.length; i++) {
        const colKey = columns[i];
        const cellValue = row[colKey];
        
        if (typeof cellValue === 'object' && cellValue !== null) {
          rowArray.push(cellValue.value);
        } else {
          rowArray.push(cellValue as string || '');
        }
      }
      
      result.push(rowArray);
    });
    
    return result;
  };

  // Save the template
  const handleSave = () => {
    if (!selectedProperty) {
      alert('Please select a property');
      return;
    }
    onSave(convertRowsToArray(), title, selectedProperty);
  };

  // Add a new row
  const handleAddRow = () => {
    const newRowId = (rows.length + 1).toString();
    
    const newRow: Row = { id: newRowId };
    for (let j = 0; j < COLUMN_LETTERS.length; j++) {
      const colKey = COLUMN_LETTERS[j];
      newRow[colKey] = '';
    }
    
    setRows([...rows, newRow]);
    
    // Update Handsontable
    if (hotInstance.current) {
      hotInstance.current.loadData([...rows, newRow]);
    }
  };

  // Clear the entire sheet
  const handleClearSheet = () => {
    if (confirm('Are you sure you want to clear the entire sheet?')) {
      const emptyRows = createRows();
      setRows(emptyRows);
      setActiveCell(null);
      setSelectedRange(null);
      
      // Update Handsontable
      if (hotInstance.current) {
        hotInstance.current.loadData(emptyRows);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-white p-4 rounded-lg shadow-md">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-xl font-semibold"
            placeholder="Template Title"
            aria-label="Template title"
          />
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded"
            aria-label="Select property"
          >
            <option value="">Select Property</option>
            <option value="property1">Property 1</option>
            <option value="property2">Property 2</option>
            <option value="property3">Property 3</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={generateSampleData}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            aria-label="Generate sample data"
          >
            Generate Sample Data
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedProperty}
            className="px-3 py-1 rounded-md transition-colors"
            aria-label="Save template"
          >
            Save Template
          </button>
        </div>
      </div>

      {/* Toolbar section - simplified */}
      <div className="flex items-center gap-1 py-1 px-2 border border-gray-200 rounded-md bg-gray-50">
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={handleAddRow}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title="Add Row"
            aria-label="Add row"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={handleClearSheet}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title="Clear Sheet"
            aria-label="Clear sheet"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Excel Grid */}
      <div 
        ref={gridWrapperRef}
        className="flex-1 h-[600px] border border-gray-300 rounded-md overflow-hidden"
        tabIndex={0}
      >
        <div ref={dataGridRef} style={{ height: '100%', width: '100%' }}></div>
      </div>

      <div className="text-xs text-gray-500 mt-2">
        {activeCell ? `Active Cell: ${activeCell}` : 'No cell selected'}
        {' • '}
        {selectedRange ? `Selected Range: ${selectedRange}` : ''}
        {' • '}
        {selectedProperty ? `Property: ${selectedProperty}` : 'No property selected'}
      </div>
    </div>
  );
};

export default ExcelEditor;
