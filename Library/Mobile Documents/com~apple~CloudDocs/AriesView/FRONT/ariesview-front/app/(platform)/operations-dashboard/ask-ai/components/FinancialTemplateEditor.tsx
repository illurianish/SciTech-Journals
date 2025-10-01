'use client';

import React, { useRef, useState, useEffect } from 'react';
import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';
import { 
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, 
  List, Table, Calculator, Download, ChevronDown, Copy, Clipboard, 
  FileText, Link, Search, Filter, TrendingUp, Edit, Save, X,
  Type, PlusSquare, Check, Percent, Hash, DollarSign, Calendar,
  LayoutGrid, BarChart2
} from 'lucide-react';

// Register all Handsontable modules
registerAllModules();

interface FinancialTemplateEditorProps {
  initialData?: string[][];
  sheetName?: string;
  onSave?: (data: string[][], title: string, propertyId: string) => void;
}

export function FinancialTemplateEditor({ initialData, sheetName, onSave }: FinancialTemplateEditorProps) {
  // Create a ref to store the HotTable component instance
  const hotTableRef = useRef<any>(null);
  const [title, setTitle] = useState('Financial Template');
  const [selectedProperty, setSelectedProperty] = useState('');
  const [isEditMode, setIsEditMode] = useState(true);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [showFormulaBar, setShowFormulaBar] = useState(false);
  const [formulaInput, setFormulaInput] = useState('');
  const [selectedCellInfo, setSelectedCellInfo] = useState<{row: number, col: number, value: string} | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Add state for active formatting options
  const [activeFontStyle, setActiveFontStyle] = useState<{
    bold: boolean;
    italic: boolean;
    fontSize: string;
  }>({
    bold: false,
    italic: false,
    fontSize: '13px'
  });
  
  // Create an empty 40x40 array for our blank spreadsheet
  const generateEmptyData = () => {
    const rows = 40;
    const cols = 40;
    const data = [];
    
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        row.push('');
      }
      data.push(row);
    }
    
    return data;
  };
  
  const [data, setData] = useState(generateEmptyData());
  
  const getHotInstance = (): Handsontable | null => {
    if (!hotTableRef.current) return null;
    
    try {
      // @ts-ignore
      const hot = hotTableRef.current.hotInstance;
      return hot || null;
    } catch (err) {
      console.error('Failed to get Handsontable instance:', err);
      return null;
    }
  };
  
  // Property options
  const propertyOptions = [
    { id: 'property1', name: 'Hooksett Retail Center' },
    { id: 'property2', name: 'River Street Plaza' },
    { id: 'property3', name: 'Tech Plaza' }
  ];
  
  // Generate sample data
  const generateSampleData = () => {
    const newData = [...generateEmptyData()];
    
    // Add headers
    newData[0][0] = 'Item';
    newData[0][1] = 'Category';
    newData[0][2] = 'Cost';
    newData[0][3] = 'Date';
    newData[0][4] = 'Status';
    
    // Add sample data
    for (let i = 1; i < 10; i++) {
      newData[i][0] = `Item ${i}`;
      newData[i][1] = ['Expense', 'Income', 'Investment'][i % 3];
      newData[i][2] = `$${(Math.random() * 1000).toFixed(2)}`;
      newData[i][3] = `2023-${String(i).padStart(2, '0')}-01`;
      newData[i][4] = ['Pending', 'Completed', 'In Review'][i % 3];
    }
    
    setData(newData);
    const hot = getHotInstance();
    if (hot) {
      hot.loadData(newData);
      hot.render();
    }
  };
  
  // Handle save
  const handleSave = () => {
    if (!selectedProperty) {
      alert('Please select a property first');
      return;
    }
    
    if (onSave) {
      onSave(data, title, selectedProperty);
    }
  };

  // Excel functionality bar handlers
  const applyBold = () => {
    try {
      const hot = getHotInstance();
      if (!hot) return;
      
      const selectedRanges = hot.getSelected();
      if (!selectedRanges || !selectedRanges.length) return;
      
      // Toggle the bold state
      const newBoldState = !activeFontStyle.bold;
      setActiveFontStyle({...activeFontStyle, bold: newBoldState});
      
      console.log('Applying bold formatting, new state:', newBoldState);
      
      for (const range of selectedRanges) {
        const [startRow, startCol, endRow, endCol] = range;
        
        for (let row = Math.min(startRow, endRow); row <= Math.max(startRow, endRow); row++) {
          for (let col = Math.min(startCol, endCol); col <= Math.max(startCol, endCol); col++) {
            // Direct DOM manipulation for immediate visual feedback
            const cell = hot.getCell(row, col);
            if (cell) {
              cell.style.fontWeight = newBoldState ? 'bold' : 'normal';
            }
            
            // Also update cell metadata for persistence
            const cellMeta = hot.getCellMeta(row, col);
            let className = cellMeta.className || '';
            
            if (typeof className === 'string') {
              if (className.includes('htBold')) {
                className = className.replace('htBold', '').trim();
              } else if (newBoldState) {
                className = (className + ' htBold').trim();
              }
              
              hot.setCellMeta(row, col, 'className', className);
              
              // Also set inline style for font-weight in metadata
              let style = cellMeta.style || {};
              style = {...style, fontWeight: newBoldState ? 'bold' : 'normal'};
              hot.setCellMeta(row, col, 'style', style);
            }
          }
        }
      }
      
      hot.render();
    } catch (err) {
      console.error('Failed to apply bold formatting:', err);
    }
  };

  const applyItalic = () => {
    try {
      const hot = getHotInstance();
      if (!hot) {
        console.error('Handsontable instance not found');
        return;
      }
      
      const selectedRanges = hot.getSelected();
      if (!selectedRanges || !selectedRanges.length) {
        console.warn('No cells selected');
        return;
      }
      
      // Toggle the italic state
      const newItalicState = !activeFontStyle.italic;
      setActiveFontStyle({...activeFontStyle, italic: newItalicState});
      
      console.log('Applying italic format to selection', selectedRanges);
      
      for (const range of selectedRanges) {
        const [startRow, startCol, endRow, endCol] = range;
        
        for (let row = Math.min(startRow, endRow); row <= Math.max(startRow, endRow); row++) {
          for (let col = Math.min(startCol, endCol); col <= Math.max(startCol, endCol); col++) {
            // Direct DOM manipulation as a more reliable method
            try {
              const cell = hot.getCell(row, col);
              if (cell) {
                if (newItalicState) {
                  cell.style.fontStyle = 'italic';
                } else {
                  cell.style.fontStyle = 'normal';
                }
              }
              
              // Also update cell metadata for persistence
              const cellMeta = hot.getCellMeta(row, col);
              let className = cellMeta.className || '';
              
              if (typeof className === 'string') {
                if (className.includes('htItalic')) {
                  className = className.replace('htItalic', '').trim();
                } else if (newItalicState) {
                  className = (className + ' htItalic').trim();
                }
                
                hot.setCellMeta(row, col, 'className', className);
                
                // Set inline style property
                let style = cellMeta.style || {};
                style = {...style, fontStyle: newItalicState ? 'italic' : 'normal'};
                hot.setCellMeta(row, col, 'style', style);
              }
            } catch (cellErr) {
              console.error(`Failed to update cell (${row},${col})`, cellErr);
            }
          }
        }
      }
      
      hot.render();
    } catch (err) {
      console.error('Failed to apply italic formatting:', err);
    }
  };

  const setAlignment = (alignment) => {
    const hot = getHotInstance();
    if (!hot) return;
    
    const selected = hot.getSelected();
    if (!selected) return;
    
    hot.batch(() => {
      for (let i = 0; i < selected.length; i++) {
        const [startRow, startCol, endRow, endCol] = selected[i];
        
        for (let row = Math.min(startRow, endRow); row <= Math.max(startRow, endRow); row++) {
          for (let col = Math.min(startCol, endCol); col <= Math.max(startCol, endCol); col++) {
            const cellMeta = hot.getCellMeta(row, col);
            let className = cellMeta.className || '';
            
            if (typeof className === 'string') {
              className = className.replace(/htLeft|htCenter|htRight/g, '').trim();
              className = (className + ' ' + alignment).trim();
              hot.setCellMeta(row, col, 'className', className);
            }
          }
        }
      }
    });
    
    hot.render();
  };

  const formatAsCurrency = () => {
    try {
      const hot = getHotInstance();
      if (!hot) return;
      
      const selectedRanges = hot.getSelected();
      if (!selectedRanges || !selectedRanges.length) return;
      
      for (const range of selectedRanges) {
        const [startRow, startCol, endRow, endCol] = range;
        
        for (let row = Math.min(startRow, endRow); row <= Math.max(startRow, endRow); row++) {
          for (let col = Math.min(startCol, endCol); col <= Math.max(startCol, endCol); col++) {
            const value = hot.getDataAtCell(row, col);
            
            if (value !== null && value !== undefined) {
              let numValue = value;
              
              if (typeof value === 'string') {
                // Remove currency symbols and commas to parse
                numValue = parseFloat(value.replace(/[$,]/g, ''));
              }
              
              if (!isNaN(numValue)) {
                hot.setDataAtCell(row, col, `$${parseFloat(numValue).toFixed(2)}`);
              }
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to format as currency:', err);
    }
  };

  const formatAsPercent = () => {
    try {
      const hot = getHotInstance();
      if (!hot) return;
      
      const selectedRanges = hot.getSelected();
      if (!selectedRanges || !selectedRanges.length) return;
      
      for (const range of selectedRanges) {
        const [startRow, startCol, endRow, endCol] = range;
        
        for (let row = Math.min(startRow, endRow); row <= Math.max(startRow, endRow); row++) {
          for (let col = Math.min(startCol, endCol); col <= Math.max(startCol, endCol); col++) {
            const value = hot.getDataAtCell(row, col);
            
            if (value !== null && value !== undefined) {
              let numValue = value;
              
              if (typeof value === 'string') {
                // Remove percentage symbol to parse
                numValue = parseFloat(value.replace(/%/g, '')) / 100;
              }
              
              if (!isNaN(numValue)) {
                hot.setDataAtCell(row, col, `${(parseFloat(numValue) * 100).toFixed(2)}%`);
              }
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to format as percentage:', err);
    }
  };

  const insertFormula = (formula: string) => {
    try {
      const hot = getHotInstance();
      if (!hot) return;
      
      const selectedRanges = hot.getSelected();
      if (!selectedRanges || !selectedRanges.length) return;
      
      // Use the first cell of the first selection range
      const [row, col] = selectedRanges[0];
      hot.setDataAtCell(row, col, formula);
      setFormulaInput(formula);
    } catch (err) {
      console.error('Failed to insert formula:', err);
    }
  };

  const handleFormulaInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setFormulaInput(e.target.value);
      
      const hot = getHotInstance();
      if (!hot) return;
      
      const selectedRanges = hot.getSelected();
      if (!selectedRanges || !selectedRanges.length) return;
      
      // Use the first cell of the first selection range
      const [row, col] = selectedRanges[0];
      hot.setDataAtCell(row, col, e.target.value);
    } catch (err) {
      console.error('Failed to update cell with formula:', err);
    }
  };

  const toggleEditMode = () => {
    const newEditMode = !isEditMode;
    setIsEditMode(newEditMode);
    
    const hot = getHotInstance();
    if (hot) {
      hot.updateSettings({
        readOnly: !newEditMode
      });
    }
  };

  const handleCopy = () => {
    try {
      const hot = getHotInstance();
      if (!hot) return;
      
      const plugin = hot.getPlugin('copyPaste');
      if (plugin && typeof plugin.copy === 'function') {
        plugin.copy();
      } else {
        console.error('CopyPaste plugin or copy method not available');
        // Fallback to document.execCommand
        document.execCommand('copy');
      }
    } catch (err) {
      console.error('Copy operation failed:', err);
    }
  };

  const handlePaste = () => {
    try {
      const hot = getHotInstance();
      if (!hot) return;
      
      const plugin = hot.getPlugin('copyPaste');
      if (plugin && typeof plugin.paste === 'function') {
        plugin.paste();
      } else {
        console.error('CopyPaste plugin or paste method not available');
        // Fallback to document.execCommand
        document.execCommand('paste');
      }
    } catch (err) {
      console.error('Paste operation failed:', err);
    }
  };

  const exportToCSV = () => {
    const hot = getHotInstance();
    if (!hot) return;
    
    const exportPlugin = hot.getPlugin('exportFile');
    if (exportPlugin) {
      exportPlugin.downloadFile('csv', {
        filename: `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`,
        columnHeaders: true,
        rowHeaders: true
      });
    }
  };

  const insertSumFormula = () => {
    try {
      const hot = getHotInstance();
      if (!hot) return;
      
      const selectedRanges = hot.getSelected();
      if (!selectedRanges || !selectedRanges.length) return;
      
      const [startRow, startCol, endRow, endCol] = selectedRanges[0];
      
      // Ensure correct order of coordinates
      const minRow = Math.min(startRow, endRow);
      const maxRow = Math.max(startRow, endRow);
      const minCol = Math.min(startCol, endCol);
      const maxCol = Math.max(startCol, endCol);
      
      // Create a SUM formula for the selected range
      // Convert column indices to column letters (0 = A, 1 = B, etc.)
      const startColLetter = String.fromCharCode(65 + minCol);
      const endColLetter = String.fromCharCode(65 + maxCol);
      
      // Create the cell references (A1 format)
      const startCellRef = `${startColLetter}${minRow + 1}`;
      const endCellRef = `${endColLetter}${maxRow + 1}`;
      
      const formula = `=SUM(${startCellRef}:${endCellRef})`;
      
      // Place the formula in the cell below the selection
      hot.selectCell(maxRow + 1, minCol);
      hot.setDataAtCell(maxRow + 1, minCol, formula);
      setFormulaInput(formula);
    } catch (err) {
      console.error('Failed to insert SUM formula:', err);
    }
  };

  const insertAverageFormula = () => {
    try {
      const hot = getHotInstance();
      if (!hot) return;
      
      const selectedRanges = hot.getSelected();
      if (!selectedRanges || !selectedRanges.length) return;
      
      const [startRow, startCol, endRow, endCol] = selectedRanges[0];
      
      // Ensure correct order of coordinates
      const minRow = Math.min(startRow, endRow);
      const maxRow = Math.max(startRow, endRow);
      const minCol = Math.min(startCol, endCol);
      const maxCol = Math.max(startCol, endCol);
      
      // Create an AVERAGE formula for the selected range
      // Convert column indices to column letters (0 = A, 1 = B, etc.)
      const startColLetter = String.fromCharCode(65 + minCol);
      const endColLetter = String.fromCharCode(65 + maxCol);
      
      // Create the cell references (A1 format)
      const startCellRef = `${startColLetter}${minRow + 1}`;
      const endCellRef = `${endColLetter}${maxRow + 1}`;
      
      const formula = `=AVERAGE(${startCellRef}:${endCellRef})`;
      
      // Place the formula in the cell below the selection
      hot.selectCell(maxRow + 1, minCol);
      hot.setDataAtCell(maxRow + 1, minCol, formula);
      setFormulaInput(formula);
    } catch (err) {
      console.error('Failed to insert AVERAGE formula:', err);
    }
  };
  
  // Get column letter from index
  const getColumnLetter = (index: number): string => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    if (index < 26) {
      return letters[index];
    } else {
      return getColumnLetter(Math.floor(index / 26) - 1) + letters[index % 26];
    }
  };
  
  // Add function for changing font size
  const applyFontSize = (fontSize: string) => {
    try {
      const hot = getHotInstance();
      if (!hot) return;
      
      const selectedRanges = hot.getSelected();
      if (!selectedRanges || !selectedRanges.length) return;
      
      setActiveFontStyle({...activeFontStyle, fontSize});
      
      console.log('Applying font size:', fontSize);
      
      for (const range of selectedRanges) {
        const [startRow, startCol, endRow, endCol] = range;
        
        for (let row = Math.min(startRow, endRow); row <= Math.max(startRow, endRow); row++) {
          for (let col = Math.min(startCol, endCol); col <= Math.max(startCol, endCol); col++) {
            // Direct DOM manipulation for immediate visual feedback
            const cell = hot.getCell(row, col);
            if (cell) {
              cell.style.fontSize = fontSize;
            }
            
            // Set style with fontSize in metadata
            const cellMeta = hot.getCellMeta(row, col);
            let style = cellMeta.style || {};
            style = {...style, fontSize};
            hot.setCellMeta(row, col, 'style', style);
          }
        }
      }
      
      hot.render();
    } catch (err) {
      console.error('Failed to apply font size:', err);
    }
  };

  // Add a helper function to check if a cell has a specific class
  const cellHasClass = (row: number, col: number, className: string): boolean => {
    try {
      const hot = getHotInstance();
      if (!hot) return false;
      
      const cellMeta = hot.getCellMeta(row, col);
      return cellMeta.className?.includes(className) || false;
    } catch (err) {
      console.error('Failed to check cell class:', err);
      return false;
    }
  };

  // Update the afterSelectionEnd handler to track formatting state
  const updateFormattingState = (row: number, col: number) => {
    try {
      const hot = getHotInstance();
      if (!hot) return;
      
      const cellMeta = hot.getCellMeta(row, col);
      const isBold = cellMeta.className?.includes('htBold') || 
                     (cellMeta.style?.fontWeight === 'bold');
      const isItalic = cellMeta.className?.includes('htItalic') || 
                      (cellMeta.style?.fontStyle === 'italic');
      const fontSize = cellMeta.style?.fontSize || '13px';
      
      setActiveFontStyle({
        bold: isBold,
        italic: isItalic,
        fontSize
      });
    } catch (err) {
      console.error('Failed to update formatting state:', err);
    }
  };

  // Handsontable settings with robust functionality
  const hotSettings = {
    data: data,
    rowHeaders: true,
    colHeaders: true,
    height: 600,
    width: '100%',
    licenseKey: 'non-commercial-and-evaluation',
    contextMenu: true,
    formulas: true,
    manualColumnResize: true,
    manualRowResize: true,
    stretchH: 'all',
    autoColumnSize: true,
    minSpareRows: 0,
    minSpareCols: 0,
    fillHandle: true,
    fixedColumnsLeft: 0,
    comments: true,
    filters: true,
    dropdownMenu: true,
    multiColumnSorting: true,
    manualColumnMove: true,
    manualRowMove: true,
    mergeCells: true,
    columnSummary: true,
    outsideClickDeselects: false,
    persistentState: true,
    search: true,
    readOnly: !isEditMode,
    selectionMode: 'multiple',
    afterChange: (changes: any) => {
      if (changes) {
        console.log('Data changed:', changes);
        // Create a deep copy of the data to update state
        const newData = [...data];
        changes.forEach(([row, prop, oldValue, newValue]: [number, number, any, any]) => {
          newData[row][prop] = newValue;
        });
        setData(newData);
      }
    },
    afterSelectionEnd: (row: number, column: number, row2: number, column2: number) => {
      try {
        // Update selected cell info for formula bar
        const hot = getHotInstance();
        if (hot) {
          const value = hot.getDataAtCell(row, column) || '';
          setSelectedCellInfo({ row, col: column, value: String(value) });
          setFormulaInput(String(value));
          
          // Update formatting state based on selected cell
          updateFormattingState(row, column);
        }
      } catch (err) {
        console.error('Failed to handle selection:', err);
      }
    },
    cells: function(row: number, col: number) {
      return {
        className: '',
        // This allows cell-specific styling
        renderer: function(instance, td, row, col, prop, value, cellProperties) {
          // Call the default text renderer
          Handsontable.renderers.TextRenderer.apply(this, arguments);
          
          // Apply styles from cell metadata
          if (cellProperties.className) {
            Handsontable.dom.addClass(td, cellProperties.className);
          }
          
          if (cellProperties.style) {
            Object.assign(td.style, cellProperties.style);
          }
          
          return td;
        }
      };
    }
  };
  
  // Initialize Handsontable with proper settings
  useEffect(() => {
    const hot = getHotInstance();
    if (hot) {
      console.log('Initializing Handsontable plugins and settings');
      
      // Ensure the CopyPaste plugin is enabled
      const copyPastePlugin = hot.getPlugin('copyPaste');
      if (copyPastePlugin) {
        copyPastePlugin.enablePlugin();
      }
      
      // Make sure formulas plugin is enabled
      const formulasPlugin = hot.getPlugin('formulas');
      if (formulasPlugin) {
        formulasPlugin.enablePlugin();
      }
      
      // Custom cell renderer for styling
      hot.updateSettings({
        readOnly: !isEditMode,
        cells: function(row, col) {
          return {
            renderer: function(instance, td, row, col, prop, value, cellProperties) {
              // Default renderer
              Handsontable.renderers.TextRenderer.apply(this, arguments);
              
              // Apply class names
              if (cellProperties.className) {
                Handsontable.dom.addClass(td, cellProperties.className);
              }
              
              // Apply inline styles
              if (cellProperties.style) {
                Object.assign(td.style, cellProperties.style);
              }
              
              return td;
            }
          };
        }
      });
      
      hot.render();
    }
  }, [isEditMode]);
  
  // Add an additional useEffect for initial setup
  useEffect(() => {
    console.log('Component mounted, setting up Handsontable');
    
    // Ensure hot table is rendered properly
    setTimeout(() => {
      const hot = getHotInstance();
      if (hot) {
        hot.render();
        console.log('Handsontable rendered after mount');
      }
    }, 500);
  }, []);
  
  // Handle search functionality
  const [searchQuery, setSearchQuery] = useState('');

  const performSearch = () => {
    if (!searchQuery.trim()) return;
    
    const hot = getHotInstance();
    if (!hot) return;
    
    const searchPlugin = hot.getPlugin('search');
    if (!searchPlugin) {
      console.error('Search plugin not available');
      return;
    }
    
    try {
      const queryResult = searchPlugin.query(searchQuery);
      
      if (queryResult.length > 0) {
        // Get the first occurrence
        const { row, col } = queryResult[0];
        
        // Select the cell with the found result
        hot.selectCell(row, col);
        
        // Scroll to the found cell
        hot.scrollViewportTo(row, col);
      } else {
        alert('No matches found');
      }
    } catch (err) {
      console.error('Search failed:', err);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Header with title and controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-xl font-semibold"
            placeholder="Template Title"
            aria-label="Template Title"
          />
          
          <select 
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
            aria-label="Select Property"
            title="Select Property"
          >
            <option value="">Select Property</option>
            {propertyOptions.map(property => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={generateSampleData}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Generate Sample Data
          </button>
          
          <button
            onClick={handleSave}
            disabled={!selectedProperty}
            className={`px-3 py-1 rounded-md ${
              !selectedProperty 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Save Template
          </button>
        </div>
      </div>

      {/* Excel Toolbar */}
      <div className="mb-2 bg-gray-100 rounded-t p-1 border border-gray-300 flex flex-col">
        {/* Main Toolbar */}
        <div className="flex items-center justify-between border-b border-gray-300 pb-1">
          <div className="flex items-center">
            {/* File Operations */}
            <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
              <button 
                onClick={toggleEditMode} 
                className={`p-1 rounded ${isEditMode ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                title={isEditMode ? "View Mode" : "Edit Mode"}
              >
                {isEditMode ? <Save size={16} /> : <Edit size={16} />}
              </button>
              <button 
                onClick={handleCopy} 
                className="p-1 rounded hover:bg-gray-200"
                title="Copy"
              >
                <Copy size={16} />
              </button>
              <button 
                onClick={handlePaste} 
                className="p-1 rounded hover:bg-gray-200"
                title="Paste"
                disabled={!isEditMode}
              >
                <Clipboard size={16} />
              </button>
              <button 
                onClick={exportToCSV} 
                className="p-1 rounded hover:bg-gray-200 ml-1"
                title="Export to CSV"
              >
                <Download size={16} />
              </button>
            </div>

            {/* Formatting */}
            <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
              <button 
                onClick={applyBold} 
                className={`p-1 rounded ${activeFontStyle.bold ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                title="Bold"
                disabled={!isEditMode}
              >
                <Bold size={16} />
              </button>
              <button 
                onClick={applyItalic} 
                className={`p-1 rounded ${activeFontStyle.italic ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                title="Italic"
                disabled={!isEditMode}
              >
                <Italic size={16} />
              </button>
              
              {/* Font Size Dropdown */}
              <select
                className="p-1 ml-1 rounded border border-gray-300 text-xs"
                value={activeFontStyle.fontSize}
                onChange={(e) => applyFontSize(e.target.value)}
                disabled={!isEditMode}
                title="Font Size"
              >
                <option value="10px">10px</option>
                <option value="12px">12px</option>
                <option value="13px">13px</option>
                <option value="14px">14px</option>
                <option value="16px">16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
                <option value="24px">24px</option>
              </select>
              
              <button 
                onClick={() => setAlignment('htLeft')} 
                className="p-1 rounded hover:bg-gray-200 ml-1"
                title="Align Left"
                disabled={!isEditMode}
              >
                <AlignLeft size={16} />
              </button>
              <button 
                onClick={() => setAlignment('htCenter')} 
                className="p-1 rounded hover:bg-gray-200"
                title="Align Center"
                disabled={!isEditMode}
              >
                <AlignCenter size={16} />
              </button>
              <button 
                onClick={() => setAlignment('htRight')} 
                className="p-1 rounded hover:bg-gray-200"
                title="Align Right"
                disabled={!isEditMode}
              >
                <AlignRight size={16} />
              </button>
            </div>

            {/* Number Formatting */}
            <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
              <button 
                onClick={formatAsCurrency} 
                className="p-1 rounded hover:bg-gray-200"
                title="Format as Currency"
                disabled={!isEditMode}
              >
                <DollarSign size={16} />
              </button>
              <button 
                onClick={formatAsPercent} 
                className="p-1 rounded hover:bg-gray-200"
                title="Format as Percentage"
                disabled={!isEditMode}
              >
                <Percent size={16} />
              </button>
            </div>

            {/* Formula Tools */}
            <div className="flex items-center">
              <button 
                onClick={insertSumFormula} 
                className="p-1 rounded hover:bg-gray-200 flex items-center"
                title="Sum"
                disabled={!isEditMode}
              >
                <span className="text-xs font-bold mr-1">Σ</span>
                <span className="text-xs">SUM</span>
              </button>
              <button 
                onClick={insertAverageFormula} 
                className="p-1 rounded hover:bg-gray-200 ml-1 flex items-center"
                title="Average"
                disabled={!isEditMode}
              >
                <Calculator size={16} className="mr-1" />
                <span className="text-xs">AVG</span>
              </button>
              <button 
                onClick={() => setShowFormulaBar(!showFormulaBar)} 
                className={`p-1 rounded ml-1 ${showFormulaBar ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                title="Formula Bar"
              >
                <Hash size={16} />
              </button>
            </div>
          </div>

          {/* Right Side Tools */}
          <div className="flex items-center">
            <button 
              onClick={() => setActiveTool(activeTool === 'search' ? null : 'search')} 
              className={`p-1 rounded ${activeTool === 'search' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
              title="Search"
            >
              <Search size={16} />
            </button>
            <button 
              onClick={() => setActiveTool(activeTool === 'filter' ? null : 'filter')} 
              className={`p-1 rounded ml-1 ${activeTool === 'filter' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
              title="Filter"
            >
              <Filter size={16} />
            </button>
            <button 
              onClick={() => setActiveTool(activeTool === 'chart' ? null : 'chart')} 
              className={`p-1 rounded ml-1 ${activeTool === 'chart' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
              title="Charts"
            >
              <BarChart2 size={16} />
            </button>
          </div>
        </div>

        {/* Formula Bar */}
        {showFormulaBar && (
          <div className="flex items-center pt-1">
            <div className="flex items-center bg-gray-200 rounded px-2 py-1 mr-2">
              <span className="text-xs text-gray-600 mr-1">
                {selectedCellInfo ? `${String.fromCharCode(65 + selectedCellInfo.col)}${selectedCellInfo.row + 1}` : 'A1'}
              </span>
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={formulaInput}
                onChange={handleFormulaInputChange}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                placeholder="Enter formula or value"
                disabled={!isEditMode}
              />
            </div>
            <button 
              onClick={() => setShowFormulaBar(false)} 
              className="p-1 ml-1 text-gray-500 hover:text-gray-700"
              title="Close Formula Bar"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Active Tool Panel */}
        {activeTool === 'search' && (
          <div className="flex items-center pt-1">
            <input
              type="text"
              placeholder="Search in spreadsheet..."
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && performSearch()}
            />
            <button 
              className="ml-1 px-2 py-1 bg-blue-600 text-white rounded text-sm"
              onClick={performSearch}
            >
              Find
            </button>
            <button 
              onClick={() => setActiveTool(null)} 
              className="p-1 ml-1 text-gray-500 hover:text-gray-700"
              title="Close Search"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {activeTool === 'filter' && (
          <div className="flex items-center pt-1">
            <span className="text-sm text-gray-600">
              Select a column and click filter in the column header to filter data
            </span>
            <button 
              onClick={() => setActiveTool(null)} 
              className="p-1 ml-1 text-gray-500 hover:text-gray-700"
              title="Close Filter Panel"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {activeTool === 'chart' && (
          <div className="flex items-center pt-1">
            <span className="text-sm text-gray-600 mr-2">
              Select data to visualize:
            </span>
            <button className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm mr-1">
              Bar Chart
            </button>
            <button className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm mr-1">
              Line Chart
            </button>
            <button className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm">
              Pie Chart
            </button>
            <button 
              onClick={() => setActiveTool(null)} 
              className="p-1 ml-auto text-gray-500 hover:text-gray-700"
              title="Close Chart Panel"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>
      
      {/* Spreadsheet container */}
      <div className="border border-gray-300 rounded overflow-hidden">
        <HotTable ref={hotTableRef} settings={hotSettings} />
      </div>
      
      {/* Status bar */}
      <div className="flex justify-between items-center text-xs text-gray-500 mt-2 bg-gray-100 p-1 rounded-b border border-t-0 border-gray-300">
        <span className="text-blue-600">
          Tip: Use arrow keys to navigate, Shift+Arrow for selection, Ctrl+C/Ctrl+V for copy/paste
        </span>
        <div className="flex items-center">
          {selectedCellInfo && (
            <span className="mr-2">
              Cell: {String.fromCharCode(65 + selectedCellInfo.col)}{selectedCellInfo.row + 1}
            </span>
          )}
          <span>
            {isEditMode ? "Edit Mode" : "View Mode"}
          </span>
        </div>
      </div>

      <style jsx global>{`
        .htBold {
          font-weight: bold;
        }
        .htItalic {
          font-style: italic;
        }
        .htLeft {
          text-align: left;
        }
        .htCenter {
          text-align: center;
        }
        .htRight {
          text-align: right;
        }
      `}</style>
    </div>
  );
}

export default FinancialTemplateEditor; 