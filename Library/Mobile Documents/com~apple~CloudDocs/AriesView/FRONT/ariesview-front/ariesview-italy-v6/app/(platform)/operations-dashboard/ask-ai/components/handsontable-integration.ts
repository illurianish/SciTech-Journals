/**
 * Handsontable Integration Helper for ExcelEditor
 * 
 * This file provides utilities to enhance the ExcelEditor component
 * with Handsontable features
 */

import { useEffect, useRef } from 'react';
import { Row } from './ExcelEditor';

// Define interfaces for Handsontable
declare global {
  interface Window {
    Handsontable: any;
  }
}

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
      for (let j = 0; j < 10; j++) {
        const colKey = String.fromCharCode(65 + j); // A-J
        const cellValue = row[colKey];
        
        if (typeof cellValue === 'object' && cellValue !== null) {
          rowData.push(cellValue.value || '');
        } else {
          rowData.push(cellValue || '');
        }
      }
      return rowData;
    });

    // Initialize Handsontable
    hotInstance.current = new window.Handsontable(containerRef.current, {
      data,
      rowHeaders: rows.map(row => row.id),
      colHeaders: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      height: '100%',
      width: '100%',
      licenseKey: 'non-commercial-and-evaluation',
      afterChange: (changes: any) => {
        if (!changes) return;
        
        // Update our row data structure when cells change
        const newRows = [...rows];
        changes.forEach(([rowIndex, colIndex, oldValue, newValue]: [number, number, any, any]) => {
          const colKey = String.fromCharCode(65 + colIndex);
          const row = newRows[rowIndex];
          
          // If the cell has styling, preserve it
          if (typeof row[colKey] === 'object' && row[colKey] !== null) {
            row[colKey] = {
              ...row[colKey],
              value: newValue
            };
          } else {
            row[colKey] = newValue;
          }
        });
        
        onRowsChange(newRows);
      },
      // Merge user options
      ...options
    });

    // Clean up
    return () => {
      if (hotInstance.current) {
        hotInstance.current.destroy();
      }
    };
  }, [containerRef, options]);

  return hotInstance;
};

/**
 * Load Handsontable scripts and styles dynamically
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
    link.href = '/css/handsontable/handsontable.full.min.css';
    document.head.appendChild(link);

    // Load JS
    const script = document.createElement('script');
    script.src = '/js/handsontable/handsontable.full.min.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Handsontable'));
    document.head.appendChild(script);
  });
};
