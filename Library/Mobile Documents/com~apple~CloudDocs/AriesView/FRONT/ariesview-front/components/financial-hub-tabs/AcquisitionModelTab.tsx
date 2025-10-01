"use client";

import React, { useEffect, useState } from "react";

interface AcquisitionModelTabProps {
  propertyId: string;
  onImport?: () => void; // optional callback for the Import Data button
}

/* ----------------------------- Year Headers ----------------------------- */
const initialYears = [
  "Year 0",
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

const residualYears = [
  "Year 0",
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
];

const irrYears = [
  "Year 0",
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
];


/* ------------------------------- Data Sets ------------------------------ */
const initialData: Record<string, number[]> = {
  "Purchase Price": [24508462, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  "Upfront CapEx": [250000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  "Due Diligence + Closing Costs": [490169, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  "Total Acquisition Costs": [25248631, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  "Loan Amount": [15930500, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  "Loan Fees": [-159305, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  "Net Loan Funding": [15771195, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  "Effective Gross Revenue": [
    0, 2281500, 2281500, 2281500, 2281500, 2281500, 2509650, 2509650, 2509650,
    2509650, 2760615,
  ],
  "Operating Expenses": [
    0, 688450, 700850, 713498, 726399, 739558, 759825, 773516, 787480, 801724,
    816253,
  ],
  "Net Operating Income": [
    0, 1593050, 1580650, 1568002, 1555101, 1541942, 1749825, 1736135, 1722170,
    1707926, 1693398,
  ],
  "Capital Expenditures": [
    0, 25000, 25500, 276010, 1526530, 27061, 27602, 28154, 28717, 29291, 29877,
  ],
  "Cash Flow From Operations": [
    0, 1568050, 1555150, 1291992, 28571, 1514881, 1722223, 1707980, 1693453,
    1678635, 1663520,
  ],
  "Debt Service": [
    0, 858421, 858421, 858421, 858421, 858421, 858421, 858421, 858421, 858421,
    858421,
  ],
  "Cash Flow after Financing": [
    0, 709630, 696729, 433571, -829850, 656460, 863802, 849560, 835032, 820214,
    805099,
  ],
};

const residualData: Record<string, number[]> = {
  "Cap Rate at Sale (%)": [
    6.5, 6.55, 6.6, 6.65, 6.7, 6.75, 6.8, 6.85, 6.9, 6.95,
  ],
  "Gross Sales Price": [
    24508467, 24132065, 23757608, 23384979, 23014060, 25923337, 25531390,
    25141168, 24752554, 24365432,
  ],
  "Selling Costs": [
    490169, 482641, 475152, 467700, 460281, 518467, 510628, 502823, 495051,
    487309,
  ],
  "Net Sales Proceeds": [
    24018298, 23649424, 23282456, 22917279, 22553778, 25404871, 25020763,
    24638345, 24257503, 23878123,
  ],
  "Net Sales Price PSF": [
    490.17, 482.64, 475.15, 467.7, 460.28, 518.47, 510.63, 502.82, 495.05,
    487.31,
  ],
  "Loan Payoff": [
    15624774, 15308173, 14980312, 14640790, 14289192, 13925089, 13548036,
    13157573, 12753221, 12334489,
  ],
};

const unleveredData: Record<string, number[]> = {
  "Investment Cash Flow": [25248631, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  "Operating Cash Flow": [
    0, 1568050, 1555150, 1291992, 28571, 1514881, 1722223, 1707980, 1693453,
    1678635, 1663520,
  ],
  "Reversion Cash Flow": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23878123],
  "Net Unlevered Cash Flow": [
    -25248631, 1568050, 1555150, 1291992, 28571, 1514881, 1722223, 1707980,
    1693453, 1678635, 25541643,
  ],
};

const leveredData: Record<string, number[]> = {
  "Investment Cash Flow": [9477436, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  "Operating Cash Flow": [
    0, 709630, 696729, 433571, -829850, 656460, 863802, 849560, 835032, 820214,
    805099,
  ],
  "Reversion Cash Flow": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11543635],
  "Net Levered Cash Flow": [
    -9477436, 709630, 696729, 433571, -829850, 656460, 863802, 849560, 835032,
    820214, 12348734,
  ],
};

const summaryData: Record<string, number[]> = {
  "Free and Clear Return (%)": [
    6.21, 6.16, 5.12, 0.11, 6.0, 6.82, 6.76, 6.71, 6.65, 6.59,
  ],
  "Avg. Free and Clear Return (%)": [
    6.21, 6.18, 5.83, 4.4, 4.72, 5.07, 5.31, 5.49, 5.62, 5.71,
  ],
  "Unlevered IRR (%)": [5.2],
  "Unlevered Equity Multiple": [1.52],
  "Cash-on-Cash Return (%)": [
    7.49, 7.35, 4.57, -8.76, 6.93, 9.11, 8.96, 8.81, 8.65, 8.49,
  ],
  "Avg. Cash-on-Cash Return (%)": [
    7.49, 7.42, 6.47, 2.66, 3.52, 4.45, 5.09, 5.56, 5.9, 6.16,
  ],
  "Levered IRR (%)": [7.4],
  "Levered Equity Multiple": [1.77],
  "Debt Coverage Ratio (NOI)": [
    1.86, 1.84, 1.83, 1.81, 1.8, 2.04, 2.02, 2.01, 1.99, 1.97,
  ],
  "Debt Yield (NOI) (%)": [
    10.2, 10.33, 10.47, 10.62, 10.79, 12.57, 12.81, 13.09, 13.39, 13.73,
  ],
};

const irrUnleveredData: Record<string, number[]> = {
  "IRR (%)": [1.34, 3.07, 3.33, 2.22, 2.73, 5.18, 5.18, 5.19, 5.19, 5.2],
  "Net Cash Flow": [
    -25248631, 25586348, 25204574, 24574448, 22945850, 24068660, 27127094,
    26728743, 26331798, 25936137, 25541643,
  ],
};

const irrLeveredData: Record<string, number[]> = {
  "IRR (%)": [-3.95, 1.47, 2.46, -0.57, 1.05, 7.43, 7.42, 7.41, 7.41, 7.4],
  "Net Cash Flow": [
    -9477436, 9103154, 9037980, 8735715, 7446639, 8921046, 12343584, 12322286,
    12315804, 12324495, 12348734,
  ],
};

/* ------------------------------ Formatters ------------------------------ */
const fmtCurrency = (n: number | string) => {
  const num = typeof n === "string" ? parseFloat(n) : n;
  return typeof num === "number" && !Number.isNaN(num)
    ? num.toLocaleString(undefined, { maximumFractionDigits: 0 })
    : "-";
};

const fmtNumber = (n: number | string) => {
  const num = typeof n === "string" ? parseFloat(n) : n;
  return typeof num === "number" && !Number.isNaN(num)
    ? num.toLocaleString(undefined, {
        maximumFractionDigits: 2,
        minimumFractionDigits: Number.isInteger(num) ? 0 : 2,
      })
    : "-";
};

const fmtDecimal = (n: number | string) => {
  const num = typeof n === "string" ? parseFloat(n) : n;
  return typeof num === "number" && !Number.isNaN(num)
    ? num.toLocaleString(undefined, {
      maximumFractionDigits: 4,
      minimumFractionDigits: 2,
    })
    : "-";
};

const fmtPercent = (n: number | string) => {
  const num = typeof n === "string" ? parseFloat(n) : n;
  if (typeof num !== "number" || Number.isNaN(num)) return "-";
  // CRITICAL CHANGE: Round to three decimal places using toFixed(3)
  // after multiplying by 100 to get the percentage value.
  return (num * 100).toFixed(3) + "%";
};

const fmtPercentage = (n: number | string) => {
  const num = typeof n === "string" ? parseFloat(n) : n;
  if (typeof num !== "number" || Number.isNaN(num)) return "-";
  return num.toFixed(2) + "%";
};


/* Renders a grid table for any dataset */
/* Renders a grid table for any dataset */
function DataTable({
  title,
  data,
  headers,
  firstCol = "Line Item",
  isPercentRow = (key: string) => key.includes("%"),
}: {
  title: string;
  data: Record<string, (number | string)[]>;
  headers: string[];
  firstCol?: string;
  isPercentRow?: (key: string) => boolean;
}) {
  return (
    <div className="mb-8">
      <h3 className="text-base font-semibold mb-3 text-gray-900">{title}</h3>
      <table className="min-w-full border border-gray-200 text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-700">
            <th className="p-2 text-left border-b border-gray-200">
              {firstCol}
            </th>
            {headers.map((h) => (
              <th key={h} className="p-2 text-left border-b border-gray-200">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-900">
          {Object.entries(data).map(([rowKey, arr]) => (
            <tr key={rowKey} className="border-b border-gray-100">
              <td className="p-2 font-medium">{rowKey}</td>
              {arr.map((v, i) => (
                <td key={i} className="p-2">
                  <span className="whitespace-nowrap">
                    {/* NEW: Conditional rendering for IRR percentages */}
                    {rowKey === "IRR (%)"
                      ? fmtPercentage(v)
                      : isPercentRow(rowKey)
                      ? fmtPercent(v)
                      : rowKey.includes("PSF")
                      ? fmtDecimal(v)
                      : fmtCurrency(v)}
                    {rowKey.includes("%") ? "" : ""}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface ProcessedData {
  initial: Record<string, (number | string)[]>;
  residual: Record<string, (number | string)[]>;
  unlevered: Record<string, (number | string)[]>;
  levered: Record<string, (number | string)[]>;
  summary: Record<string, (number | string)[]>;
  irrUnlevered: Record<string, (number | string)[]>;
  irrLevered: Record<string, (number | string)[]>;
}

const AcquisitionModelTab: React.FC<AcquisitionModelTabProps> = ({
  propertyId,
  onImport,
}) => {
  const [data, setData] = useState<ProcessedData | null>(null);


  useEffect(() => {
    // Single function to process all data from the raw localStorage JSON
    const processAllData = (parsedData) => {
    const output3Data = parsedData.output3;

    const processInitialData = (keys) => {
      const result = {};
      const yearKeys = [
        "Year 0", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5",
        "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11"
      ];
      keys.forEach((key) => {
        const rowData = output3Data[key];
        if (rowData) {
          result[key] = yearKeys.map((year) => rowData[year]);
        }
      });
      return result;
    };


    // Helper function to process yearly data for various sections
    const processYearlyData = (keys) => {
      const result = {};
      const yearKeys = [
        "Year 0", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5",
        "Year 6", "Year 7", "Year 8", "Year 9", "Year 10"
      ];
      keys.forEach((key) => {
        const rowData = output3Data[key];
        if (rowData) {
          result[key] = yearKeys.map((year) => rowData[year]);
        }
      });
      return result;
    };

    // Helper function to process IRR data which is structured differently
   const processIrrData = (output3Data, categoryPrefix) => {
      const result = { "IRR (%)": [], "Net Cash Flow": [] };
      
      const categoryData = output3Data[categoryPrefix];

      if (!categoryData) {
        return result; // Return empty arrays if the main category is missing
      }
      
      // Iterate from year 0 to 10 to build the cash flow and IRR data rows
      for (let i = 0; i <= 10; i++) {
        const yearKey = `Year ${i}`;
        const yearData = categoryData[yearKey];
        
        if (yearData) {
          // Push the IRR from the 'IRR' key and remove the '%' sign
          const irrValueString = yearData.IRR;
          const irrValue = irrValueString ? parseFloat(irrValueString.replace('%', '')) : null;
          result["IRR (%)"].push(irrValue);

          // Push the Net Cash Flow for the current year (from the key matching the year)
          const netCashFlowValueString = yearData[i];
          const netCashFlowValue = netCashFlowValueString ? parseFloat(netCashFlowValueString) : null;
          result["Net Cash Flow"].push(netCashFlowValue);
        } else {
          // Push null if data for the year is missing
          result["IRR (%)"].push(null);
          result["Net Cash Flow"].push(null);
        }
      }
      return result;
    };


    // New, fixed logic for processing summary data
    const summaryDataProcessed = {};
    const allSummaryKeys = [
      "Free and Clear Return (%)", "Avg. Free and Clear Return (%)",
      "Unlevered IRR (%)", "Unlevered Equity Multiple",
      "Cash-on-Cash Return (%)", "Avg. Cash-on-Cash Return (%)",
      "Levered IRR (%)", "Levered Equity Multiple",
      "Debt Coverage Ratio (NOI)", "Debt Yield (NOI) (%)",
    ];

    allSummaryKeys.forEach((key) => {
      const rawData = output3Data[key];
      if (typeof rawData === "object" && rawData !== null) {
        // Sort the keys numerically to ensure correct order, and filter out 'Year 11'
        const sortedKeys = Object.keys(rawData)
          .filter(k => k !== 'Year 11')
          .filter(k => k !== 'Year 0')
          .sort((a, b) => {
            const yearA = parseInt(a.replace('Year ', ''));
            const yearB = parseInt(b.replace('Year ', ''));
            return yearA - yearB;
          });
        // Use the sorted keys to map to the values
        summaryDataProcessed[key] = sortedKeys.map(k => rawData[k]);
      } else if (rawData !== undefined) {
        // This is for a single value. We wrap it in an array.
        summaryDataProcessed[key] = [rawData];
      }
    });

    return {
      initial: processInitialData([
        "Purchase Price", "Upfront CapEx", "Due Dilligence + Closing Cost", "Total Acquisition Costs",
        "Loan Amount", "Loan Fees", "Net Loan Funding", "Effective Gross Revenue",
        "Operating Expenses", "Net Operating Income", "Capital Expenditures",
        "Cash Flow From Operations", "Debt Service", "Cash Flow after Financing",
      ]),
      residual: processYearlyData([
        "Cap Rate at Sale (%)", "Gross Sales Price", "Selling Costs", "Net Sales Proceeds",
        "Net Sales Price PSF", "Loan Payoff",
      ]),
      unlevered: processYearlyData([
        "Unlevered Investment Cash Flow", "Unlevered Operating Cash Flow",
        "Unlevered Reversion Cash Flow", "Unlevered Net Unlevered Cash Flow",
      ]),
      levered: processYearlyData([
        "Levered Investment Cash Flow", "Levered Operating Cash Flow",
        "Levered Reversion Cash Flow", "Levered Net Unlevered Cash Flow",
      ]),
      summary: summaryDataProcessed,
      irrUnlevered: processIrrData(output3Data, "Unlevered Internal Rate of Return Calculation"),
      irrLevered: processIrrData(output3Data, "Levered Internal Rate of Return Calculation"),
    };
  };

    const storedData = localStorage.getItem("financialHubData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        // This is the line that's causing the problem in the console, but not the code logic
        console.log("Successfully retrieved output3: ", parsedData.output3);

        if (parsedData.output3) {
          const processed = processAllData(parsedData);
          setData(processed);
        } else {
          console.error("Parsed data from localStorage does not contain 'output3'.");
          setData(null);
        }

      } catch (e) {
        console.error("Failed to parse data from localStorage", e);
        setData(null);
      }
    } else {
      setData(null);
    }
  }, [propertyId]);

  // Add a conditional render check to avoid errors with empty data
  if (!data) {
    return <div className="p-4 text-center">Loading data...</div>;
  }

  return (
    <div className="space-y-6 p-1">
      {/* Header + Import */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Acquisition Model</h2>
        <button
          type="button"
          onClick={onImport ?? (() => console.log("Import Data clicked"))}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Import Data
        </button>
      </div>

      // This is the correct way
      <div className="overflow-x-auto bg-white p-4 shadow rounded-lg">
        <DataTable title="Property-Level Cash Flow and Returns" data={data.initial} headers={initialYears} />
        <DataTable title="Residual Cash Flow" data={data.residual} headers={residualYears} />
        <DataTable title="Unlevered Cash Flow and Returns" data={data.unlevered} headers={residualYears} />
        <DataTable title="Levered Cash Flow and Returns" data={data.levered} headers={residualYears} />

        {/* Summary Table */}
        <div className="mb-8">
          <h3 className="text-base font-semibold mb-3 text-gray-900">Summary Metrics</h3>
          <table className="min-w-full border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-700">
                <th className="p-2 text-left border-b border-gray-200">Metric</th>
                <th className="p-2 text-left border-b border-gray-200">Value</th>
              </tr>
            </thead>
            <tbody className="text-gray-900">
              {Object.entries(data.summary).map(([k, v]) => (
                <tr key={k} className="border-b border-gray-100">
                  <td className="p-2 font-medium">{k}</td>
                  <td className="p-2">
                    {/* Updated logic for single-value vs. multi-value rows */}
                    {v.length === 1 ? (
                      k.includes("%") ? fmtPercent(v[0]) : fmtNumber(v[0])
                    ) : (
                      v.map((n, i) => (
                        <React.Fragment key={i}>
                          {i > 0 && ", "}
                          {k.includes("%") ? fmtPercent(n) : fmtNumber(n)}
                        </React.Fragment>
                      ))
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* IRR Tables */}
        <h3 className="text-base font-semibold mb-3 text-gray-900">Internal Rate of Return Calculation</h3>
        <div className="space-y-8">
          <DataTable title="Unlevered IRR" data={data.irrUnlevered} headers={irrYears} firstCol="Unlevered IRR" />
          <DataTable title="Levered IRR" data={data.irrLevered} headers={irrYears} firstCol="Levered IRR" />
        </div>
      </div>
    </div>
  );
};

export default AcquisitionModelTab;
