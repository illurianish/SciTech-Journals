# Handsontable Integration with Excel-like Editor

This document provides instructions for enhancing the Excel-like functionality in the Financial Template Editor by integrating Handsontable.

## Overview

Handsontable is a powerful JavaScript data grid component with spreadsheet-like features. The files have been copied to:

- Main library: /public/js/handsontable/ and /public/css/handsontable/
- Plugins: /app/(platform)/operations-dashboard/ask-ai/components/excel-grid/plugins/
- Utilities: /app/(platform)/operations-dashboard/ask-ai/components/excel-grid/utils/
- Integration helper: /app/(platform)/operations-dashboard/ask-ai/components/handsontable-integration.ts

## Integration Options

### Option 1: Full Replacement

Replace the current DataGrid implementation with Handsontable for a more complete Excel-like experience:

1. Open \ExcelEditor.tsx\
2. Import the integration helper:
   `	ypescript
   import { useHandsontable, loadHandsontable } from './handsontable-integration';
   `

3. Add a useEffect to load Handsontable:
   `	ypescript
   useEffect(() => {
     loadHandsontable().catch(error => {
       console.error('Failed to load Handsontable:', error);
     });
   }, []);
   `

4. Replace the DataGrid component with a div that will be used for Handsontable:
   `	sx
   <div 
     ref={gridWrapperRef}
     className="flex-1 relative group outline-none focus:ring-2 focus:ring-blue-500"
     tabIndex={0}
   >
     <div ref={dataGridRef} style={{ height: '100%', width: '100%' }}></div>
   </div>
   `

5. Use the Handsontable hook:
   `	ypescript
   useHandsontable(dataGridRef, rows, handleRowsChange, {
     // Additional options
     contextMenu: true,
     filters: true,
     formulas: true,
     mergeCells: true,
     columnSorting: true
   });
   `

### Option 2: Enhanced Integration

Keep the existing DataGrid implementation but enhance it with specific Handsontable features:

1. Create custom components that use specific Handsontable plugins
2. Import and use these components within your existing DataGrid setup

### Option 3: Hybrid Approach

Use React-specific components from the Handsontable ecosystem:

1. Install the official React wrapper for Handsontable:
   `
   npm install @handsontable/react
   `

2. Use the HotTable component in your ExcelEditor

## Recommended Features to Enable

- **Autofill**: Excel-like drag-to-fill functionality
- **Context Menu**: Right-click menu for common operations
- **Copy/Paste**: Enhanced clipboard operations
- **Formulas**: Basic formula support
- **Merge Cells**: Cell merging capabilities
- **Nested Headers**: Group related columns
- **Filters**: Data filtering
- **Undo/Redo**: Operation history

## License Considerations

Be aware that Handsontable has a non-commercial license included. For commercial use, a proper license would need to be purchased.
