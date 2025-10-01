// components/ui/excel/handsontable-helper.ts
export const loadHandsontable = (container: HTMLElement, data: any[][]) => {
  if (typeof window !== 'undefined') {
    // Initialize Handsontable
    const Handsontable = (window as any).Handsontable;
    if (Handsontable) {
      return new Handsontable(container, {
        data: data,
        rowHeaders: true,
        colHeaders: true,
        licenseKey: 'non-commercial-and-evaluation',
        stretchH: 'all',
        width: '100%',
        height: 400,
        contextMenu: true,
        manualColumnResize: true,
        manualRowResize: true
      });
    }
  }
  return null;
};
