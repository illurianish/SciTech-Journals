'use client';

import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';
import { Button } from '@/components/ui/button';
import { 
  Download, Edit, Save, Copy, Clipboard, Plus, Trash2, ChevronDown,
  AlignLeft, AlignCenter, AlignRight, Grid, Table, Bold, Italic,
  Underline, Search, DollarSign, Percent, Calculator,
  Hash, Calendar, FileText, Type
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface HandsontableExcelProps {
  sheetName: string;
  data: any[][];
  onSave?: (data: any[][], sheetName: string) => void;
}

const HandsontableExcel = forwardRef<any, HandsontableExcelProps>(({ 
  sheetName, 
  data: initialData, 
  onSave 
}, ref) => {
  // Ensure data is an array of arrays and has at least 40 rows and 40 columns
  const ensureDataFormat = (inputData: any[][] | null | undefined): any[][] => {
    if (!inputData || !Array.isArray(inputData) || inputData.length === 0) {
      // Create a 40x40 empty grid
      return Array(40).fill(null).map(() => Array(40).fill(''));
    }
    
    // Make sure each row is an array
    const processedData = inputData.map(row => Array.isArray(row) ? row : [row]);
    
    // Ensure each row has at least 40 columns
    const paddedData = processedData.map(row => {
      if (row.length < 40) {
        return [...row, ...Array(40 - row.length).fill('')];
      }
      return row;
    });
    
    // Ensure there are at least 40 rows
    if (paddedData.length < 40) {
      const emptyRows = Array(40 - paddedData.length).fill(null).map(() => Array(40).fill(''));
      return [...paddedData, ...emptyRows];
    }
    
    return paddedData;
  };
  
  const [data, setData] = useState<any[][]>(ensureDataFormat(initialData));
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [showFormulaBar, setShowFormulaBar] = useState(false);
  const [formulaInput, setFormulaInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [activeFontStyle, setActiveFontStyle] = useState({
    bold: false,
    italic: false,
    fontSize: '13px'
  });
  
  const hotTableRef = useRef<HotTable>(null);
  const hotSettings = useRef<Handsontable.GridSettings>({
    // We'll set our Handsontable settings here to make them accessible throughout the component
    licenseKey: 'non-commercial-and-evaluation',
    rowHeaders: true,
    colHeaders: true,
    contextMenu: true,
    copyPaste: true,
    comments: true,
    mergeCells: true,
    manualColumnResize: true,
    manualRowResize: true,
    formulas: true,
    filters: true,
    dropdownMenu: true,
    multiColumnSorting: true,
    manualColumnMove: true,
    manualRowMove: true,
    columnSummary: true,
    search: true,
    persistentState: true,
    outsideClickDeselects: false,
    undo: true,
    fillHandle: true,
    enterBeginsEditing: true,
    enterMoves: { row: 1, col: 0 },
    tabMoves: { row: 0, col: 1 },
    beforeKeyDown: (e) => {
      const hot = hotTableRef.current?.hotInstance;
      if (!hot) return;
      
      // Allow clipboard keyboard shortcuts to work
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.stopImmediatePropagation();
        const plugin = hot.getPlugin('copyPaste');
        if (plugin) plugin.copy();
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'v' && isEditMode) {
        e.stopImmediatePropagation();
        const plugin = hot.getPlugin('copyPaste');
        if (plugin) plugin.paste();
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'x' && isEditMode) {
        e.stopImmediatePropagation();
        const plugin = hot.getPlugin('copyPaste');
        if (plugin && plugin.cut) plugin.cut();
      }
      
      // Merge/unmerge cells with Ctrl+M
      if ((e.ctrlKey || e.metaKey) && e.key === 'm' && isEditMode) {
        e.stopImmediatePropagation();
        const plugin = hot.getPlugin('mergeCells');
        if (plugin) {
          const selected = hot.getSelected();
          if (selected) {
            const [startRow, startCol, endRow, endCol] = selected[0];
            plugin.toggleMerge(startRow, startCol, endRow, endCol);
            hot.render();
          }
        }
      }
    },
    cells: function(row: number, col: number) {
      return {
        className: '',
        // This allows cell-specific styling
        renderer: function(instance: any, td: HTMLTableCellElement, row: number, col: number, 
                          prop: string, value: any, cellProperties: any) {
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
  });

  // Update data when props change
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setData(ensureDataFormat(initialData));
    }
  }, [initialData]);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    toggleEditMode: () => {
      setIsEditMode(!isEditMode);
    },
    exportToExcel: () => {
      const hot = hotTableRef.current?.hotInstance;
      if (!hot) return;
      
      const exportPlugin = hot.getPlugin('exportFile');
      if (exportPlugin) {
        exportPlugin.downloadFile('csv', {
          filename: `${sheetName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`,
          columnHeaders: true,
          rowHeaders: true
        });
      } else {
        alert('Export feature is not available');
      }
    },
    handleSave: () => {
      const hot = hotTableRef.current?.hotInstance;
      if (!hot) return;
      
      const currentData = hot.getData() || data;
      if (onSave) {
        onSave(currentData, sheetName);
      }
    }
  }));

  // Get Handsontable instance
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

  // Excel toolbar functions
  const handleCopy = () => {
    const hot = getHotInstance();
    if (!hot) return;
    
    const plugin = hot.getPlugin('copyPaste');
    if (plugin) {
      plugin.copy();
    }
  };

  const handlePaste = () => {
    const hot = getHotInstance();
    if (!hot) return;
    
    const plugin = hot.getPlugin('copyPaste');
    if (plugin) {
      plugin.paste();
    }
  };

  const handleAddRow = () => {
    const hot = getHotInstance();
    if (!hot) return;
    
    const selection = hot.getSelected();
    if (selection) {
      const row = selection[0][0];
      hot.alter('insert_row', row + 1);
    } else {
      hot.alter('insert_row', hot.countRows());
    }
  };

  const handleAddColumn = () => {
    const hot = getHotInstance();
    if (!hot) return;
    
    const selection = hot.getSelected();
    if (selection) {
      const col = selection[0][1];
      hot.alter('insert_col', col + 1);
    } else {
      hot.alter('insert_col', hot.countCols());
    }
  };

  const handleRemoveRow = () => {
    const hot = getHotInstance();
    if (!hot || !selectedCell) return;
    
    hot.alter('remove_row', selectedCell[0]);
  };

  const handleRemoveColumn = () => {
    const hot = getHotInstance();
    if (!hot || !selectedCell) return;
    
    hot.alter('remove_col', selectedCell[1]);
  };

  const handleAlignment = (alignment: 'htLeft' | 'htCenter' | 'htRight') => {
    const hot = getHotInstance();
    if (!hot || !selectedCell) return;
    
    const selectedRanges = hot.getSelected();
    if (!selectedRanges || !selectedRanges.length) return;

    for (const range of selectedRanges) {
      const [startRow, startCol, endRow, endCol] = range;
      
      for (let row = Math.min(startRow, endRow); row <= Math.max(startRow, endRow); row++) {
        for (let col = Math.min(startCol, endCol); col <= Math.max(startCol, endCol); col++) {
          const meta = hot.getCellMeta(row, col);
          // Remove any existing alignment classes
          let className = (meta.className || '').replace(/htLeft|htCenter|htRight/g, '').trim();
          // Add the new alignment class
          className = `${className} ${alignment}`.trim();
          hot.setCellMeta(row, col, 'className', className);
        }
      }
    }
    
    hot.render();
  };

  // New formatting functions from FinancialTemplateEditor
  const applyBold = () => {
    try {
      const hot = getHotInstance();
      if (!hot) return;
      
      const selectedRanges = hot.getSelected();
      if (!selectedRanges || !selectedRanges.length) return;
      
      // Toggle the bold state
      const newBoldState = !activeFontStyle.bold;
      setActiveFontStyle({...activeFontStyle, bold: newBoldState});
      
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
      
      hot.render();
    } catch (err) {
      console.error('Failed to apply bold formatting:', err);
    }
  };

  const applyItalic = () => {
    try {
      const hot = getHotInstance();
      if (!hot) return;
      
      const selectedRanges = hot.getSelected();
      if (!selectedRanges || !selectedRanges.length) return;
      
      // Toggle the italic state
      const newItalicState = !activeFontStyle.italic;
      setActiveFontStyle({...activeFontStyle, italic: newItalicState});
      
      for (const range of selectedRanges) {
        const [startRow, startCol, endRow, endCol] = range;
        
        for (let row = Math.min(startRow, endRow); row <= Math.max(startRow, endRow); row++) {
          for (let col = Math.min(startCol, endCol); col <= Math.max(startCol, endCol); col++) {
            // Direct DOM manipulation as a more reliable method
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
        }
      }
      
      hot.render();
    } catch (err) {
      console.error('Failed to apply italic formatting:', err);
    }
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
            
            if (value !== null && value !== undefined && value !== '') {
              const numValue = parseFloat(String(value).replace(/[$,]/g, ''));
              
              if (!isNaN(numValue)) {
                // Format as currency
                const formatter = new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 2
                });
                
                hot.setDataAtCell(row, col, formatter.format(numValue));
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
            
            if (value !== null && value !== undefined && value !== '') {
              const strValue = String(value).replace(/[%]/g, '');
              const numValue = parseFloat(strValue);
              
              if (!isNaN(numValue)) {
                // Format as percentage
                let formattedValue;
                if (numValue > 1 && !strValue.includes('.')) {
                  // If the value is greater than 1 and doesn't have a decimal point,
                  // assume it's already a percentage (e.g., 25 should become 25%)
                  formattedValue = numValue + '%';
                } else {
                  // Otherwise, convert decimal to percentage (e.g., 0.25 should become 25%)
                  formattedValue = (numValue * 100).toFixed(2) + '%';
                }
                
                hot.setDataAtCell(row, col, formattedValue);
              }
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to format as percentage:', err);
    }
  };

  // Insert formula functions
  const insertSumFormula = () => {
    try {
      const hot = getHotInstance();
      if (!hot) return;
      
      const selectedRanges = hot.getSelected();
      if (!selectedRanges || !selectedRanges.length) return;
      
      const range = selectedRanges[0];
      let [startRow, startCol, endRow, endCol] = range;
      
      // Ensure start coordinates are less than end coordinates
      if (startRow > endRow) [startRow, endRow] = [endRow, startRow];
      if (startCol > endCol) [startCol, endCol] = [endCol, startCol];
      
      // Get column letters for the range
      const startColLetter = getColumnLetter(startCol);
      const endColLetter = getColumnLetter(endCol);
      
      // Create the SUM formula
      const formula = `=SUM(${startColLetter}${startRow + 1}:${endColLetter}${endRow + 1})`;
      
      // Insert the formula in the cell below the selection
      const maxRow = endRow + 1;
      const minCol = startCol;
      
      hot.setDataAtCell(maxRow, minCol, formula);
      setFormulaInput(formula);
    } catch (err) {
      console.error('Failed to insert SUM formula:', err);
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

  // Handle formula input change
  const handleFormulaInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormulaInput(e.target.value);
    
    const hot = getHotInstance();
    if (!hot || !selectedCell) return;
    
    hot.setDataAtCell(selectedCell[0], selectedCell[1], e.target.value);
  };

  // Apply formula to selected cell
  const applyFormula = () => {
    const hot = getHotInstance();
    if (!hot || !selectedCell) return;
    
    hot.setDataAtCell(selectedCell[0], selectedCell[1], formulaInput);
  };

  // Search functionality
  const performSearch = () => {
    if (!searchQuery) return;
    
    const hot = getHotInstance();
    if (!hot) return;
    
    const searchPlugin = hot.getPlugin('search');
    const queryResult = searchPlugin.query(searchQuery);
    
    if (queryResult.length > 0) {
      // Select the first result
      const { row, col } = queryResult[0];
      hot.selectCell(row, col);
      hot.scrollViewportTo(row, col);
    } else {
      alert('No results found');
    }
  };

  // Handle cell selection
  const handleAfterSelectionEnd = (row: number, column: number) => {
    setSelectedCell([row, column]);
    
    // Update formula input
    const hot = getHotInstance();
    if (hot) {
      const value = hot.getDataAtCell(row, column) || '';
      setFormulaInput(String(value));
      
      // Update formatting state based on selected cell
      updateFormattingState(row, column);
    }
  };

  // Update formatting state
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

  // Add clipboard event listeners for enhanced copy/paste support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const hot = getHotInstance();
      if (!hot) return;
      
      // Check if the keyboard event target is within the component or if the component has focus
      const isHotSelected = document.activeElement === document.querySelector('.excel-container') ||
                           document.activeElement?.closest('.excel-container') !== null;
      
      if (!isHotSelected) return;
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        const plugin = hot.getPlugin('copyPaste');
        if (plugin) plugin.copy();
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'v' && isEditMode) {
        const plugin = hot.getPlugin('copyPaste');
        if (plugin) plugin.paste();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEditMode]);

  return (
    <div className="excel-editor">
      {/* Excel-like toolbar */}
      <div className="excel-toolbar bg-gray-100 p-2 rounded-t flex items-center space-x-2 border border-gray-200">
        <div className="toolbar-section">
          <Button 
            variant={isEditMode ? "outline" : "ghost"} 
            size="sm" 
            onClick={() => setIsEditMode(!isEditMode)}
            title={isEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}
          >
            {isEditMode ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="toolbar-divider h-6 w-px bg-gray-300 mx-1"></div>
        
        <div className="toolbar-section flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCopy}
            title="Copy"
            disabled={!isEditMode}
          >
            <Copy className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handlePaste}
            title="Paste"
            disabled={!isEditMode}
          >
            <Clipboard className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="toolbar-divider h-6 w-px bg-gray-300 mx-1"></div>
        
        <div className="toolbar-section flex space-x-1">
          <Button 
            variant={activeFontStyle.bold ? "outline" : "ghost"} 
            size="sm" 
            onClick={applyBold}
            title="Bold"
            disabled={!isEditMode}
          >
            <Bold className="h-4 w-4" />
          </Button>
          
          <Button 
            variant={activeFontStyle.italic ? "outline" : "ghost"} 
            size="sm" 
            onClick={applyItalic}
            title="Italic"
            disabled={!isEditMode}
          >
            <Italic className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="toolbar-divider h-6 w-px bg-gray-300 mx-1"></div>
        
        <div className="toolbar-section flex space-x-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={!isEditMode}>
              <Button variant="ghost" size="sm" title="Insert">
                <Plus className="h-4 w-4" />
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Insert</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleAddRow}>
                <Grid className="h-4 w-4 mr-2" />
                Row
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAddColumn}>
                <Table className="h-4 w-4 mr-2" />
                Column
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={insertSumFormula}>
                <Calculator className="h-4 w-4 mr-2" />
                Sum Formula
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={!isEditMode || !selectedCell}>
              <Button variant="ghost" size="sm" title="Delete">
                <Trash2 className="h-4 w-4" />
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Delete</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleRemoveRow}>
                <Grid className="h-4 w-4 mr-2" />
                Row
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRemoveColumn}>
                <Table className="h-4 w-4 mr-2" />
                Column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="toolbar-divider h-6 w-px bg-gray-300 mx-1"></div>
        
        <div className="toolbar-section flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleAlignment('htLeft')}
            title="Align Left"
            disabled={!isEditMode || !selectedCell}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleAlignment('htCenter')}
            title="Align Center"
            disabled={!isEditMode || !selectedCell}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleAlignment('htRight')}
            title="Align Right"
            disabled={!isEditMode || !selectedCell}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="toolbar-divider h-6 w-px bg-gray-300 mx-1"></div>
        
        <div className="toolbar-section flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={formatAsCurrency}
            title="Format as Currency"
            disabled={!isEditMode || !selectedCell}
          >
            <DollarSign className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={formatAsPercent}
            title="Format as Percentage"
            disabled={!isEditMode || !selectedCell}
          >
            <Percent className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="toolbar-divider h-6 w-px bg-gray-300 mx-1"></div>
        
        <div className="toolbar-section mr-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowSearch(!showSearch)}
            title="Search"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="toolbar-section ml-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => ref.current?.exportToExcel()}
            title="Export"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Formula bar */}
      {showFormulaBar && selectedCell && (
        <div className="flex items-center bg-white p-2 border-l border-r border-gray-200">
          <div className="text-xs text-gray-500 mr-2 min-w-[80px]">
            {getColumnLetter(selectedCell[1])}{selectedCell[0] + 1}:
          </div>
          <Input
            className="flex-1 h-8 text-sm"
            value={formulaInput}
            onChange={handleFormulaInputChange}
            onKeyDown={(e) => e.key === 'Enter' && applyFormula()}
          />
          <Button
            variant="outline"
            size="sm"
            className="ml-2"
            onClick={applyFormula}
            disabled={!isEditMode}
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {/* Search bar */}
      {showSearch && (
        <div className="flex items-center bg-white p-2 border-l border-r border-gray-200">
          <Input
            className="flex-1 h-8 text-sm"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && performSearch()}
          />
          <Button
            variant="outline"
            size="sm"
            className="ml-2"
            onClick={performSearch}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {/* Edit mode indicator */}
      {isEditMode && (
        <div className="bg-blue-50 text-blue-800 text-xs p-1 border-l border-r border-gray-200">
          Edit mode is enabled. Click cells to edit and press Enter to confirm changes.
        </div>
      )}
      
      {/* The Handsontable component */}
      <div className="excel-container border-l border-r border-b rounded-b overflow-auto" style={{ height: '500px' }}>
        <HotTable
          ref={hotTableRef}
          settings={hotSettings.current}
          data={data}
          width="100%"
          height="100%"
          readOnly={!isEditMode}
          stretchH="all"
          allowInsertRow={isEditMode}
          allowInsertColumn={isEditMode}
          allowRemoveRow={isEditMode}
          allowRemoveColumn={isEditMode}
          afterSelectionEnd={(row, column) => handleAfterSelectionEnd(row, column)}
          afterChange={(changes) => {
            if (changes && onSave && isEditMode) {
              ref.current?.handleSave();
            }
          }}
          minRows={40}
          minCols={40}
          minSpareRows={0}
          minSpareCols={0}
        />
      </div>
      
      <div className="flex mt-2 justify-between">
        <div className="text-xs text-gray-500">
          <p>
            Use arrow keys to navigate, Tab to move right, Shift+Tab to move left.
            {isEditMode && " Press F2, Enter, or click a cell to edit."}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFormulaBar(!showFormulaBar)}
            title={showFormulaBar ? "Hide Formula Bar" : "Show Formula Bar"}
          >
            <Calculator className="h-4 w-4 mr-1" />
            {showFormulaBar ? "Hide Formula" : "Show Formula"}
          </Button>
        </div>
      </div>

      <style jsx global>{`
        .handsontable {
          font-size: 13px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .handsontable .htDimmed {
          color: #6b7280;
        }
        .handsontable th {
          background-color: #f3f4f6;
          font-weight: 600;
          color: #374151;
        }
        .handsontable tbody tr:nth-child(even) td {
          background-color: #f9fafb;
        }
        .handsontable .htLeft {
          text-align: left;
        }
        .handsontable .htCenter {
          text-align: center;
        }
        .handsontable .htRight {
          text-align: right;
        }
        .handsontable .htBold {
          font-weight: bold;
        }
        .handsontable .htItalic {
          font-style: italic;
        }
      `}</style>
    </div>
  );
});

HandsontableExcel.displayName = 'HandsontableExcel';

export default HandsontableExcel; 