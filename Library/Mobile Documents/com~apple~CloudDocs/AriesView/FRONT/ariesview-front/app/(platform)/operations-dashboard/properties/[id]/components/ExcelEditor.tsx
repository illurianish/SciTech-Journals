import React, { useState } from 'react';

interface ExcelEditorProps {
  propertyName: string;
}

const ExcelEditor: React.FC<ExcelEditorProps> = ({ propertyName }) => {
  const [data, setData] = useState<string[][]>([
    ['Month', 'Revenue', 'Expenses', 'Net Income'],
    ['January', '0', '0', '0'],
    ['February', '0', '0', '0'],
    ['March', '0', '0', '0'],
    ['April', '0', '0', '0'],
    ['May', '0', '0', '0'],
    ['June', '0', '0', '0'],
    ['July', '0', '0', '0'],
    ['August', '0', '0', '0'],
    ['September', '0', '0', '0'],
    ['October', '0', '0', '0'],
    ['November', '0', '0', '0'],
    ['December', '0', '0', '0'],
  ]);

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...data];
    newData[rowIndex][colIndex] = value;
    setData(newData);
  };

  const handleSave = () => {
    // In a real app, this would save to your backend
    alert(`Financial data for ${propertyName} has been saved`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Financial Spreadsheet</h3>
        <button
          onClick={handleSave}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          suppressHydrationWarning
        >
          Save Changes
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={`${rowIndex}-${colIndex}`} className="px-4 py-2 whitespace-nowrap">
                    {rowIndex === 0 ? (
                      <div className="text-sm font-medium text-gray-900">{cell}</div>
                    ) : (
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        suppressHydrationWarning
                        aria-label={`${data[0][colIndex]} for ${data[rowIndex][0]}`}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExcelEditor; 