import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

// Types
export interface IncomeStatementRow {
  label: string;
  values: (number | string)[];
  editable?: boolean;
}

export interface IncomeStatementData {
  rows: IncomeStatementRow[];
}

// Column headers for the income statement table
export const years = [
  "Year 0",
  "T12",
  "Pro Forma (Yr 1)",
  "/SF",
  "Year 1",
  "Year 2",
  "Year 3",
  "Year 4",
  "Year 5",
  "Year 6",
  "Year 7",
  "Year 8",
  "Year 9",
  "Year 10",
  "Year 11",
];

// Utility function to format numbers
export const formatNumber = (v: number | string) => {
  if (typeof v === "string") return v;
  if (Number.isNaN(v)) return "-";
  const opts =
    Math.abs(v) >= 1000 && Number.isInteger(v)
      ? { maximumFractionDigits: 0 }
      : { minimumFractionDigits: 0, maximumFractionDigits: 2 };
  return v.toLocaleString(undefined, opts as Intl.NumberFormatOptions);
};

// Helper function to safely get a value from Flask result
const getVal = (flaskResult: any, key: string): number => {
  const value = flaskResult[key];
  return value ? Number(value) : 0;
};

// Helper function to get projection values from Flask result
const getProjections = (flaskResult: any, key: string): number[] => {
  if (!flaskResult["projections"]) {
    return Array(11).fill(0);
  }

  const projections = flaskResult["projections"][key];

  if (!projections) return Array(11).fill(0);

  // Convert the object of 'Year X' values to a sorted array of numbers
  return Object.keys(projections)
    .sort((a, b) => Number(a.match(/\d+/)?.[0] || 0) - Number(b.match(/\d+/)?.[0] || 0))
    .map(key => Number(projections[key]));
};

// Function to create rows from Flask result
export const createRowsFromFlaskResult = (flaskResult: any): IncomeStatementRow[] => {
  console.log("Creating rows from Flask result:", flaskResult);

  return [
    {
      label: "+ Base Rent",
      values: [
        getVal(flaskResult, 'Base Rent Y0'),
        getVal(flaskResult, 'Base Rent T12'),
        getVal(flaskResult, 'Base Rent PF'),
        getVal(flaskResult, 'Base Rent PSF PF'),
        ...getProjections(flaskResult, 'Base Rent'),
      ],
      editable: false,
    },
    {
      label: "+ Recovery Income",
      values: [
        getVal(flaskResult, 'Recovery Income Y0'),
        getVal(flaskResult, 'Recovery Income T12'),
        getVal(flaskResult, 'Recovery Income PF'),
        getVal(flaskResult, 'Recovery Income PSF PF'),
        ...getProjections(flaskResult, 'Recovery Income'),
      ],
      editable: false,
    },
    {
      label: "+ Other Income",
      values: [
        getVal(flaskResult, 'Other Income Y0'),
        getVal(flaskResult, 'Other Income T12'),
        getVal(flaskResult, 'Other Income PF'),
        getVal(flaskResult, 'Other Income PSF PF'),
        ...getProjections(flaskResult, 'Other Income'),
      ],
      editable: false,
    },
    {
      label: "Potential Gross Income",
      values: [
        getVal(flaskResult, 'PGI Y0'),
        getVal(flaskResult, 'PGI T12'),
        getVal(flaskResult, 'PGI PF'),
        getVal(flaskResult, 'PGI PSF PF'),
        ...getProjections(flaskResult, 'PGI'),
      ],
      editable: false,
    },
    {
      label: "- Rent Abatement",
      values: [
        getVal(flaskResult, 'Rent Abatement Y0'),
        getVal(flaskResult, 'Rent Abatement T12'),
        getVal(flaskResult, 'Rent Abatement PF'),
        getVal(flaskResult, 'Rent Abatement PSF PF'),
        ...getProjections(flaskResult, 'Rent Abatement'),
      ],
      editable: false,
    },
    {
      label: "- Vacancy",
      values: [
        getVal(flaskResult, 'Vacancy Y0'),
        getVal(flaskResult, 'Vacancy T12'),
        getVal(flaskResult, 'Vacancy PF'),
        getVal(flaskResult, 'Vacancy PSF PF'),
        ...getProjections(flaskResult, 'Vacancy'),
      ],
      editable: false,
    },
    {
      label: "+/- Other Adjustment",
      values: [
        getVal(flaskResult, 'Other Adjustments Y0'),
        getVal(flaskResult, 'Other Adjustments T12'),
        getVal(flaskResult, 'Other Adjustments PF'),
        getVal(flaskResult, 'Other Adjustments PSF PF'),
        ...Array(11).fill(0), // No projections available in the JSON for this line item
      ],
      editable: false,
    },
    {
      label: "Effective Gross Revenue",
      values: [
        getVal(flaskResult, 'EGR Y0'),
        getVal(flaskResult, 'EGR T12'),
        getVal(flaskResult, 'EGR PF'),
        getVal(flaskResult, 'EGR PSF PF'),
        ...getProjections(flaskResult, 'EGR'),
      ],
      editable: false,
    },
    {
      label: "- Marketing",
      values: [
        getVal(flaskResult, 'Marketing Y0'),
        getVal(flaskResult, 'Marketing T12'),
        getVal(flaskResult, 'Marketing PF'),
        getVal(flaskResult, 'Marketing PSF PF'),
        ...getProjections(flaskResult, 'Marketing'),
      ],
      editable: false,
    },
    {
      label: "- Administrative",
      values: [
        getVal(flaskResult, 'Administrative Y0'),
        getVal(flaskResult, 'Administrative T12'),
        getVal(flaskResult, 'Administrative PF'),
        getVal(flaskResult, 'Administrative PSF PF'),
        ...getProjections(flaskResult, 'Administrative'),
      ],
      editable: false,
    },
    {
      label: "- Utilities",
      values: [
        getVal(flaskResult, 'Utilities Y0'),
        getVal(flaskResult, 'Utilities T12'),
        getVal(flaskResult, 'Utilities PF'),
        getVal(flaskResult, 'Utilities PSF PF'),
        ...getProjections(flaskResult, 'Utilities'),
      ],
      editable: false,
    },
    {
      label: "- Payroll",
      values: [
        getVal(flaskResult, 'Payroll Y0'),
        getVal(flaskResult, 'Payroll T12'),
        getVal(flaskResult, 'Payroll PF'),
        getVal(flaskResult, 'Payroll PSF PF'),
        ...getProjections(flaskResult, 'Payroll'),
      ],
      editable: false,
    },
    {
      label: "- Repair and maintenance",
      values: [
        getVal(flaskResult, 'Maintenance Y0'),
        getVal(flaskResult, 'Maintenance T12'),
        getVal(flaskResult, 'Maintenance PF'),
        getVal(flaskResult, 'Maintenance PSF PF'),
        ...getProjections(flaskResult, 'Maintenance'),
      ],
      editable: false,
    },
    {
      label: "- Mgmt (% of EGR)",
      values: [
        getVal(flaskResult, 'Mgmt Fee Y0'),
        getVal(flaskResult, 'Mgmt Fee T12'),
        getVal(flaskResult, 'Mgmt Fee PF'),
        getVal(flaskResult, 'Mgmt Fee PSF PF'),
        ...getProjections(flaskResult, 'Mgmt Fee'),
      ],
      editable: false,
    },
    {
      label: "- Insurance",
      values: [
        getVal(flaskResult, 'Insurance Y0'),
        getVal(flaskResult, 'Insurance T12'),
        getVal(flaskResult, 'Insurance PF'),
        getVal(flaskResult, 'Insurance PSF PF'),
        ...getProjections(flaskResult, 'Insurance'),
      ],
      editable: false,
    },
    {
      label: "- Taxes",
      values: [
        getVal(flaskResult, 'Taxes Y0'),
        getVal(flaskResult, 'Taxes T12'),
        getVal(flaskResult, 'Taxes PF'),
        getVal(flaskResult, 'Taxes PSF PF'),
        ...getProjections(flaskResult, 'Taxes'),
      ],
      editable: false,
    },
    {
      label: "Operating Expenses",
      values: [
        getVal(flaskResult, 'Opex Y0'),
        getVal(flaskResult, 'Opex T12'),
        getVal(flaskResult, 'Opex PF'),
        getVal(flaskResult, 'Opex PSF PF'),
        ...getProjections(flaskResult, 'Opex'),
      ],
      editable: false,
    },
    {
      label: "Net Operating Income",
      values: [
        getVal(flaskResult, 'Net Operating Income Y0'),
        getVal(flaskResult, 'Net Operating Income T12'),
        getVal(flaskResult, 'Net Operating Income PF'),
        getVal(flaskResult, 'Net Operating Income PSF PF'),
        ...getProjections(flaskResult, 'Net Operating Income'),
      ],
      editable: false,
    },
    {
      label: "- Tenant Improvements",
      values: [
        getVal(flaskResult, 'Tenant Improvement Y0'),
        getVal(flaskResult, 'Tenant Improvement T12'),
        getVal(flaskResult, 'Tenant Improvement PF'),
        getVal(flaskResult, 'Tenant Improvement PSF PF'),
        ...getProjections(flaskResult, 'Tenant Improvement'),
      ],
      editable: false,
    },
    {
      label: "- Leasing Commissions",
      values: [
        getVal(flaskResult, 'Leasing Commissions Y0'),
        getVal(flaskResult, 'Leasing Commissions T12'),
        getVal(flaskResult, 'Leasing Commissions PF'),
        getVal(flaskResult, 'Leasing Commissions PSF PF'),
        ...getProjections(flaskResult, 'Leasing Commissions'),
      ],
      editable: false,
    },
    {
      label: "- Capital Reserves",
      values: [
        getVal(flaskResult, 'Capital Reserves Y0'),
        getVal(flaskResult, 'Capital Reserves T12'),
        getVal(flaskResult, 'Capital Reserves PF'),
        getVal(flaskResult, 'Capital Reserves PSF PF'),
        ...getProjections(flaskResult, 'Capital Reserves'),
      ],
      editable: false,
    },
    {
      label: "- Misc. CapEx",
      values: [
        getVal(flaskResult, 'Misc Capex Y0'),
        getVal(flaskResult, 'Misc Capex T12'),
        getVal(flaskResult, 'Misc Capex PF'),
        getVal(flaskResult, 'Misc Capex PSF PF'),
        ...getProjections(flaskResult, 'Misc Capex'),
      ],
      editable: false,
    },
    {
      label: "Capital Expenditures",
      values: [
        getVal(flaskResult, 'Capital Expenditures Y0'),
        getVal(flaskResult, 'Capital Expenditures T12'),
        getVal(flaskResult, 'Capital Expenditures PF'),
        getVal(flaskResult, 'Capital Expenditures PSF PF'),
        ...getProjections(flaskResult, 'Capital Expenditures'),
      ],
      editable: false,
    },
    {
      label: "Cash Flow From Operations",
      values: [
        getVal(flaskResult, 'CFO Y0'),
        getVal(flaskResult, 'CFO T12'),
        getVal(flaskResult, 'CFO PF'),
        getVal(flaskResult, 'CFO PSF PF'),
        ...getProjections(flaskResult, 'CFO'),
      ],
      editable: false,
    },
    // The following rows are for the percentage and PSF data
    {
      label: "Rent PSF",
      values: [
        getVal(flaskResult, 'Rent PSF Y0'),
        getVal(flaskResult, 'Rent PSF T12'),
        getVal(flaskResult, 'Rent PSF PF'),
        '-',
        ...getProjections(flaskResult, 'Rent PSF'),
      ],
      editable: false,
    },
    {
      label: "Expenses PSF",
      values: [
        getVal(flaskResult, 'Expenses PSF Y0'),
        getVal(flaskResult, 'Expenses PSF T12'),
        getVal(flaskResult, 'Expenses PSF PF'),
        '-', // Not a PSF PF value
        ...getProjections(flaskResult, 'Expenses PSF'),
      ],
      editable: false,
    },
    {
      label: "Expense Recovery %",
      values: [
        getVal(flaskResult, 'Expense Recovery % Y0'),
        getVal(flaskResult, 'Expense Recovery % T12'),
        getVal(flaskResult, 'Expense Recovery % PF'),
        '-', // No PSF PF value
        ...getProjections(flaskResult, 'Expense Recovery %'),
      ],
      editable: false,
    },
    {
      label: "Expense Ratio",
      values: [
        getVal(flaskResult, 'Expense Ratio Y0'),
        getVal(flaskResult, 'Expense Ratio T12'),
        getVal(flaskResult, 'Expense Ratio PF'),
        '-', // No PSF PF value
        ...getProjections(flaskResult, 'Expense Ratio'),
      ],
      editable: false,
    },
    {
      label: "CapEx as % of NOI",
      values: [
        getVal(flaskResult, 'CapEx as % of NOI Y0'),
        getVal(flaskResult, 'CapEx as % of NOI T12'),
        getVal(flaskResult, 'CapEx as % of NOI PF'),
        '-', // No PSF PF value
        ...getProjections(flaskResult, 'CapEx as % of NOI'),
      ],
      editable: false,
    },
    {
      label: "Tax Mill Rate",
      values: [
        getVal(flaskResult, 'Taxes as % of NOI Y0'),
        getVal(flaskResult, 'Taxes as % of NOI T12'),
        getVal(flaskResult, 'Taxes as % of NOI PF'),
        '-', // No PSF PF value
        ...getProjections(flaskResult, 'Taxes as % of NOI'), // No projections available for this line item
      ],
      editable: false,
    },
  ];
};

// Hook to load data from localStorage
export const useIncomeStatementFromStorage = () => {
  return useCallback(() => {
    try {
      const storedData = localStorage.getItem('financialHubData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const flaskResult = parsedData.output2;

        console.log('Successfully retrieved output2 from localStorage:', flaskResult);

        const newRows = createRowsFromFlaskResult(flaskResult);
        return newRows;
      } else {
        console.warn('No financialHubData found in localStorage.');
        return [];
      }
    } catch (err) {
      console.error('Error parsing data from localStorage:', err);
      return [];
    }
  }, []);
};

// Hook to fetch data from Flask API
export const useIncomeStatementFromAPI = (propertyId: string) => {
  return useQuery({
    queryKey: ['income-statement', propertyId],
    queryFn: async () => {
      if (!propertyId) {
        throw new Error('Property ID is required');
      }

      console.log(`Fetching income statement data for property: ${propertyId}`);
      const flaskBackendBaseUrl = process.env.NEXT_PUBLIC_FLASK_SERVICE_URL;
      console.log("authToken: ", localStorage.getItem("authToken"));
      console.log(`Calling Flask Output 2 (Income Statement Summary) API... for property id: ${propertyId}`);
      
      try {
        const flaskResponse = await fetch(`${flaskBackendBaseUrl}/output2/${propertyId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idToken: localStorage.getItem("authToken")
          })
        });
        
        if (!flaskResponse.ok) {
          const errorData = await flaskResponse.json();
          console.error('Flask API Output 2 (Income Statement Summary) Error Response:', errorData);
          throw new Error(`Flask API Output 2 (Income Statement Summary) HTTP error! Status: ${flaskResponse.status}, Message: ${errorData.error || flaskResponse.statusText}`);
        }

        const flaskResult = await flaskResponse.json();
        console.log('Successfully received Output 2 (Income Statement Summary) from Flask:', flaskResult);

        const newRows = createRowsFromFlaskResult(flaskResult);
        return newRows;
      } catch (error) {
        console.error('Error calling Flask Output 2 (Income Statement Summary) API:', error);
        throw error;
      }
    },
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    retryDelay: 1000,
  });
};

// Hook to update row data
export const useUpdateIncomeStatementRow = () => {
  return useCallback((rows: IncomeStatementRow[], rowIdx: number, colIdx: number, value: string | number) => {
    return rows.map((row, rIdx) =>
      rIdx === rowIdx
        ? {
          ...row,
          values: row.values.map((v, cIdx) =>
            cIdx === colIdx ? (value === "" ? 0 : Number(value)) : v
          ),
        }
        : row
    );
  }, []);
};
