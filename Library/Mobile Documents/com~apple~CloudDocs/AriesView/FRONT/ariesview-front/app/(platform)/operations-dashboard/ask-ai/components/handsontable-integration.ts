/**
 * Handsontable Integration Helper for ExcelEditor
 * 
 * This file provides utilities to enhance the ExcelEditor component
 * with Handsontable features
 */

import { useEffect, useRef } from 'react';

// Define interfaces for Handsontable
declare global {
  interface Window {
    Handsontable: any;
  }
}

// Row interface matching ExcelEditor
interface Row {
  id: string;
  [key: string]: any;
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

// Create column headers for the sheet (40 columns)
const COLUMN_LETTERS = generateColumnLetters(40);

/**
 * Hook to initialize Handsontable on a container element
 */
export const useHandsontable = (
  containerRef: React.RefObject<HTMLDivElement>,
  rows: Row[],
  onRowsChange: (newRows: Row[]) => void,
  options: any = {}
) => {
  const hotInstance = useRef<any>(null);

  useEffect(() => {
    // Skip if Handsontable is not loaded or container not ready
    if (!window.Handsontable || !containerRef.current) return;

    // Convert rows data to format expected by Handsontable
    const data = rows.map(row => {
      const rowData: any[] = [];
      // Skip 'id' column since it's handled separately
      for (let j = 0; j < COLUMN_LETTERS.length; j++) {
        const colKey = COLUMN_LETTERS[j];
        const cellValue = row[colKey];
        
        if (typeof cellValue === 'object' && cellValue !== null) {
          rowData.push(cellValue.value || '');
        } else {
          rowData.push(cellValue || '');
        }
      }
      return rowData;
    });

    // Define custom cell renderer to handle formatted cells
    const cellRenderer = function(instance: any, td: HTMLElement, row: number, col: number, prop: any, value: any, cellProperties: any) {
      // Get the original data from our rows state to access styling
      const colKey = COLUMN_LETTERS[col];
      const originalCell = rows[row]?.[colKey];
      
      // Clear existing content and styles
      td.innerHTML = value || '';
      td.style.fontWeight = 'normal';
      td.style.fontStyle = 'normal';
      td.style.textDecoration = 'none';
      td.style.textAlign = 'left';
      td.style.fontFamily = 'inherit';
      
      // Apply styling if cell has style information
      if (typeof originalCell === 'object' && originalCell !== null && originalCell.style) {
        const { style } = originalCell;
        
        if (style.bold) td.style.fontWeight = 'bold';
        if (style.italic) td.style.fontStyle = 'italic';
        if (style.underline) td.style.textDecoration = 'underline';
        if (style.textAlign) td.style.textAlign = style.textAlign;
        if (style.fontFamily) td.style.fontFamily = style.fontFamily;
        
        // Format values based on cell format
        if (style.format === 'currency' && !isNaN(parseFloat(value))) {
          td.innerHTML = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(value));
        } else if (style.format === 'percentage' && !isNaN(parseFloat(value))) {
          td.innerHTML = new Intl.NumberFormat('en-US', { style: 'percent' }).format(parseFloat(value) / 100);
        } else if (style.format === 'number' && !isNaN(parseFloat(value))) {
          td.innerHTML = new Intl.NumberFormat('en-US').format(parseFloat(value));
        } else if (style.format === 'date' && value) {
          try {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              td.innerHTML = date.toLocaleDateString();
            }
          } catch (e) {
            // Keep original value if date parsing fails
          }
        }
      }
      
      return td;
    };

    // Initialize Handsontable with basic options
    const defaultOptions = {
      data,
      rowHeaders: rows.map(row => row.id),
      colHeaders: COLUMN_LETTERS,
      height: '100%',
      width: '100%',
      licenseKey: 'non-commercial-and-evaluation',
      stretchH: 'all',
      manualColumnResize: true, 
      manualRowResize: true,
      contextMenu: true,
      comments: true,
      fillHandle: true,
      copyPaste: true,
      colWidths: 80,
      rowHeights: 24,
      renderer: cellRenderer,
      autoColumnSize: {
        samplingRatio: 0.1
      },
      autoRowSize: {
        syncLimit: 100
      },
      afterChange: (changes: any) => {
        if (!changes) return;
        
        // Update our row data structure when cells change
        const newRows = [...rows];
        changes.forEach(([rowIndex, colIndex, oldValue, newValue]: [number, number, any, any]) => {
          if (rowIndex >= newRows.length) return;
          
          const colKey = COLUMN_LETTERS[colIndex];
          const row = newRows[rowIndex];
          
          // If the cell has styling, preserve it
          if (typeof row[colKey] === 'object' && row[colKey] !== null) {
            newRows[rowIndex] = {
              ...row,
              [colKey]: {
                ...row[colKey],
                value: newValue
              }
            };
          } else {
            newRows[rowIndex] = {
              ...row,
              [colKey]: newValue
            };
          }
        });
        
        onRowsChange(newRows);
      }
    };

    // Merge user options with default options
    const mergedOptions = { ...defaultOptions, ...options };

    // Initialize Handsontable
    hotInstance.current = new window.Handsontable(containerRef.current, mergedOptions);

    // Clean up
    return () => {
      if (hotInstance.current) {
        hotInstance.current.destroy();
      }
    };
  }, [containerRef, rows, onRowsChange, options]);

  return hotInstance;
};

/**
 * Load Handsontable scripts and styles dynamically from CDN
 */
export const loadHandsontable = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Skip if already loaded
    if (window.Handsontable) {
      resolve();
      return;
    }

    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/handsontable@latest/dist/handsontable.full.min.css';
    document.head.appendChild(link);

    // Load JS
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/handsontable@latest/dist/handsontable.full.min.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Handsontable'));
    document.head.appendChild(script);
  });
};
