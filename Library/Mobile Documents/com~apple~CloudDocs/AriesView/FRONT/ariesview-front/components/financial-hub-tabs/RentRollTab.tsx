"use client";

import React, { useEffect, useState } from "react";

interface RentRow {
  unit: string;
  year0: string;
  t12: string;
  proForma: string;
}

interface RentTotals {
  year0: number;
  t12: number;
  proForma: number;
}

type Props = {
  propertyId: string;
  onImport?: () => void; // hook to wire Import Data if needed
};

const RentRollTab: React.FC<Props> = ({ propertyId, onImport }) => {
  // initial rows (same as your current)
  // const initialRows: RentRow[] = [
  //   { unit: "Unit 1", year0: "645198", t12: "782198", proForma: "782198" },
  //   { unit: "Unit 2", year0: "322597.2", t12: "322597.2", proForma: "322597" },
  //   { unit: "Unit 3", year0: "258085.2", t12: "258085.2", proForma: "258085" },
  //   { unit: "Unit 4", year0: "387120", t12: "387120", proForma: "387120" },
  //   ...Array.from({ length: 10 }, (_, i) => ({
  //     unit: `Unit ${i + 5}`,
  //     year0: "",
  //     t12: "",
  //     proForma: "",
  //   })),
  // ];

  // const [rows, setRows] = useState<RentRow[]>(initialRows);
  // const [sum, setSum] = useState({ year0: 0, t12: 0, proForma: 0 });

  const [rows, setRows] = useState<RentRow[]>([]);
  const [sum, setSum] = useState<RentTotals>({ year0: 0, t12: 0, proForma: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRentRollDataFromLocalStorage = () => {
      setIsLoading(true);
      setError(null);
      try {
        const storedData = localStorage.getItem('financialHubData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          const rentRollData = parsedData.output5_rentroll;
          const totalsData = parsedData.output5_total;

          const mappedRows = rentRollData.map((row: any) => ({
            unit: row.Unit.toString(),
            year0: row['Year 0'].toString(),
            t12: row.T12.toString(),
            proForma: row['Pro Forma Year 1'].toString(),
          }));

          setRows(mappedRows);
          setSum({
            year0: totalsData['Year 0'],
            t12: totalsData.T12,
            proForma: totalsData['Pro Forma Year 1'],
          });

          console.log("Successfully loaded rent roll data from localStorage.");
        } else {
          setError('No saved data found in localStorage.');
          setRows([]); // Clear rows if no data is found
          setSum({ year0: 0, t12: 0, proForma: 0 });
        }
      } catch (err) {
        console.error("Error parsing data from localStorage:", err);
        setError("Failed to load data. The data format may be invalid.");
      } finally {
        setIsLoading(false);
      }
    };

    if (propertyId) {
      loadRentRollDataFromLocalStorage();
    }
  }, [propertyId]);

  const handleChange = (
    idx: number,
    field: keyof Pick<RentRow, "year0" | "t12" | "proForma">,
    val: string
  ) => {
    setRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, [field]: val } : r))
    );
  };

  const currency = (n: number) =>
    n.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  return (
    <div className="space-y-6 p-1">
      {/* Header + Import (blue) */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Rent Roll</h2>
        <button
          type="button"
          onClick={onImport ?? (() => { })}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Import Data
        </button>
      </div>

      <div className="bg-white p-4 shadow rounded-lg overflow-x-auto">
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Rent Roll Table
        </h3>

        <table className="min-w-full text-sm border border-gray-200">
          <thead>
            <tr className="bg-gray-50 text-gray-700">
              <th className="p-2 text-left border border-gray-200 w-40">
                UNIT
              </th>
              <th className="p-2 text-left border border-gray-200 w-48">
                YEAR 0
              </th>
              <th className="p-2 text-left border border-gray-200 w-48">T12</th>
              <th className="p-2 text-left border border-gray-200 w-56">
                PRO FORMA (YR 1)
              </th>
            </tr>
          </thead>

          <tbody className="text-gray-900">
            {rows.map((row, idx) => (
              <tr key={row.unit}>
                <td className="p-2 border border-gray-200 font-medium">
                  {row.unit}
                </td>

                <td className="p-2 border border-gray-200">
                  <input
                    type="number"
                    inputMode="decimal"
                    value={row.year0}
                    onChange={(e) => handleChange(idx, "year0", e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-left text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="0"
                  />
                </td>

                <td className="p-2 border border-gray-200">
                  <input
                    type="number"
                    inputMode="decimal"
                    value={row.t12}
                    onChange={(e) => handleChange(idx, "t12", e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-left text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="0"
                  />
                </td>

                <td className="p-2 border border-gray-200">
                  <input
                    type="number"
                    inputMode="decimal"
                    value={row.proForma}
                    onChange={(e) =>
                      handleChange(idx, "proForma", e.target.value)
                    }
                    className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-left text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="0"
                  />
                </td>
              </tr>
            ))}

            {/* SUM row */}
            <tr className="bg-gray-50">
              <td className="p-2 border border-gray-200 font-semibold">SUM</td>
              <td className="p-2 border border-gray-200 font-semibold">
                {sum.year0 ? currency(sum.year0) : "$0"}
              </td>
              <td className="p-2 border border-gray-200 font-semibold">
                {sum.t12 ? currency(sum.t12) : "$0"}
              </td>
              <td className="p-2 border border-gray-200 font-semibold">
                {sum.proForma ? currency(sum.proForma) : "$0"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RentRollTab;
