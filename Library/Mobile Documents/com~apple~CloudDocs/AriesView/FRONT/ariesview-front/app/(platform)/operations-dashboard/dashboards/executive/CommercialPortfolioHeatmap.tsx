import React from 'react';

// Helper function to get property names from IDs
const getPropertyNames = (selectedIds: Set<string>, availableProps: { value: string; label: string }[]): string => {
  if (selectedIds.size === 0) return "All Properties";
  const names = Array.from(selectedIds)
    .map(id => availableProps.find(p => p.value === id)?.label ?? id)
    .slice(0, 3); // Limit to first 3 names for brevity
  let nameString = names.join(', ');
  if (selectedIds.size > 3) {
    nameString += `, +${selectedIds.size - 3} more`;
  }
  return nameString;
};

// Helper function to format selected funds
const getFundNames = (selectedFunds: Set<string>): string => {
   if (selectedFunds.size === 0) return "All Funds";
   const names = Array.from(selectedFunds).slice(0, 3);
   let nameString = names.join(', ');
    if (selectedFunds.size > 3) {
        nameString += `, +${selectedFunds.size - 3} more`;
    }
   return nameString;
}

interface CommercialPortfolioHeatmapProps {
  selectedFunds: Set<string>;
  selectedProperties: Set<string>;
  availableProperties: { value: string; label: string }[];
}

const CommercialPortfolioHeatmap = ({ 
  selectedFunds, 
  selectedProperties, 
  availableProperties 
}: CommercialPortfolioHeatmapProps) => {
  // NOTE: The data generation below is STATIC placeholder data.
  // In a real application, this component should receive the *actual filtered data* 
  // based on selectedFunds/selectedProperties as props, or fetch it dynamically.

  // Data for the 20 units (Static Example)
  const units = Array.from({ length: 20 }, (_, i) => `Unit ${i + 1}`);
  
  // Key financial and performance metrics institutional investors prioritize
  const metrics = [
    "NOI Yield (%)",
    "Occupancy Rate (%)",
    "Tenant Credit Rating",
    "Lease Expiration Risk",
    "Rent per Sq Ft vs Market",
    "Cap Rate Trend",
    "Expense Ratio",
    "Revenue Growth YoY (%)",
    "Tenant Retention",
    "CapEx Requirements"
  ];

  // More realistic data patterns based on typical strip mall dynamics
  const generateRealisticValue = (metric: string, unitIndex: number) => {
    const conditions = [
      { condition: "Critical", color: "#E53E3E" },   // 1: Red
      { condition: "At Risk", color: "#F6AD55" },    // 2: Orange
      { condition: "Neutral", color: "#F6E05E" },    // 3: Yellow
      { condition: "Stable", color: "#68D391" },     // 4: Light green
      { condition: "Optimal", color: "#38A169" }     // 5: Green
    ];

    let qualityScore: number;
    const rand = Math.random(); // Random number between 0 and 1

    // Special handling for consistently problematic units (e.g., Unit 7 and 14)
    if (unitIndex === 6 || unitIndex === 13) { 
      if (rand > 0.80) qualityScore = 4; // 20% Stable
      else if (rand > 0.50) qualityScore = 3; // 30% Neutral
      else if (rand > 0.20) qualityScore = 2; // 30% At Risk
      else qualityScore = 1; // 20% Critical
    } else {
      // General units: Mostly green, but more random
      if (rand > 0.85) qualityScore = 5; // 15% Optimal
      else if (rand > 0.50) qualityScore = 4; // 35% Stable
      else if (rand > 0.20) qualityScore = 3; // 30% Neutral
      else if (rand > 0.05) qualityScore = 2; // 15% At Risk
      else qualityScore = 1; // 5% Critical
    }

    // Some metrics have inverted scales (lower is better)
    const invertedMetrics = ["Expense Ratio", "Lease Expiration Risk", "CapEx Requirements"];
    if (invertedMetrics.includes(metric)) {
      qualityScore = 6 - qualityScore; // Invert the score (1 becomes 5, 5 becomes 1)
    }

    // Ensure score is within bounds (1-5)
    const finalScore = Math.max(1, Math.min(5, qualityScore));
    
    return conditions[finalScore - 1];
  };
  
  // Create the data matrix with realistic values (Static Example)
  const data = metrics.map(metric => {
    return {
      metric,
      units: units.map((_, index) => generateRealisticValue(metric, index))
    };
  });
  
  // Legend for conditions
  const legend = [
    { condition: "Critical", color: "#E53E3E" },   // Red
    { condition: "At Risk", color: "#F6AD55" },    // Orange
    { condition: "Neutral", color: "#F6E05E" },    // Yellow
    { condition: "Stable", color: "#68D391" },     // Light green
    { condition: "Optimal", color: "#38A169" }     // Green
  ];
  
  // Format values for display with the appropriate metrics (Static Example)
  const getMetricValue = (metric, condition) => {
    const conditionIndex = legend.findIndex(item => item.condition === condition.condition);
    const score = conditionIndex + 1;
    
    // Adjust scores based on metric type
    switch(metric) {
      case "NOI Yield (%)":
        return `${(3 + score * 1.2).toFixed(1)}%`;
      case "Occupancy Rate (%)":
        // For occupancy, always show a percentage value
        return `${Math.min(100, 80 + score * 5)}%`;
      case "Tenant Credit Rating":
        const ratings = ["CCC", "B", "BB", "BBB", "A"];
        return ratings[conditionIndex];
      case "Lease Expiration Risk":
        return score === 5 ? "5+ yrs" : score === 4 ? "3-5 yrs" : score === 3 ? "2-3 yrs" : score === 2 ? "1-2 yrs" : "<1 yr";
      case "Rent per Sq Ft vs Market":
        return `${(score - 3) * 15}%`;
      case "Cap Rate Trend":
        return score > 3 ? "↑" : score < 3 ? "↓" : "→";
      case "Expense Ratio":
        return `${Math.max(25, 55 - score * 5)}%`;
      case "Revenue Growth YoY (%)":
        return `${(score * 2 - 6).toFixed(1)}%`;
      case "Tenant Retention":
        return `${60 + score * 8}%`;
      case "CapEx Requirements":
        const capexLevels = ["High", "Above Avg", "Average", "Low", "Minimal"];
        return capexLevels[conditionIndex];
      default:
        return condition.condition;
    }
  };

  const displayFunds = getFundNames(selectedFunds);
  const displayProperties = getPropertyNames(selectedProperties, availableProperties);
  
  // If no properties are selected, show a placeholder message instead of the heatmap
  if (selectedProperties.size === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md font-sans text-center text-gray-500">
        <h2 className="text-xl font-semibold mb-4">Portfolio Heatmap</h2>
        <p>Select properties from the filter above to view the heatmap.</p>
      </div>
    );
  }
  
  return (
    // Use Card component for consistency
    <div className="bg-white p-6 rounded-lg shadow-md font-sans">
      {/* Heatmap Title - Removed filter status text */}
      <div className="mb-4 pb-2 border-b border-gray-300">
        <h2 className="text-2xl font-bold text-gray-800">Portfolio Heatmap</h2>
      </div>
      
      {/* Legend */} 
      <div className="flex bg-gray-50 p-3 rounded mb-4 shadow-sm">
        <div className="text-sm font-semibold mr-4">Performance Legend:</div>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {legend.map((item, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-3 h-3 mr-1.5 rounded-sm" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-xs font-medium text-gray-700">{item.condition}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Heat Map */} 
      <div className="overflow-x-auto bg-white rounded border border-gray-200">
        <div className="min-w-max">
          {/* Header for unit numbers */} 
          <div className="flex border-b border-gray-200 bg-gray-100 sticky top-0 z-10">
            <div className="w-48 p-3 font-semibold text-gray-700 flex-shrink-0"></div> {/* Metric Column Header */} 
            {units.map((unit, index) => (
              <div 
                key={index} 
                className="w-20 p-2 font-semibold text-xs text-gray-700 border-l border-gray-200 text-center flex-shrink-0"
              >
                {unit}
              </div>
            ))}
          </div>
          
          {/* Rows for each metric */} 
          {data.map((row, rowIndex) => (
            <div key={rowIndex} className={`flex ${rowIndex % 2 !== 0 ? 'bg-gray-50' : 'bg-white'}`}>
              <div className="w-48 p-3 font-medium text-sm text-gray-700 border-b border-gray-200 flex-shrink-0 sticky left-0 bg-inherit z-5">
                {row.metric}
              </div>
              {row.units.map((cell, cellIndex) => (
                <div 
                  key={cellIndex} 
                  className="w-20 p-1 border-l border-b border-gray-200 flex-shrink-0"
                >
                  <div 
                    className="h-10 flex items-center justify-center rounded text-center"
                    style={{ backgroundColor: cell.color }}
                    title={`${row.metric} for ${units[cellIndex]}: ${cell.condition}`}
                  >
                    <span className="text-xs font-bold text-white text-shadow-sm px-0.5">
                      {getMetricValue(row.metric, cell)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Key Insights (Optional - keep if relevant to static/dynamic data) */} 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-gray-50 p-4 rounded shadow-sm border border-gray-200">
          <h3 className="text-base font-semibold text-gray-800 border-b pb-2 mb-2">Investment Highlights</h3>
          <ul className="text-sm space-y-1 text-gray-700">
            <li className="flex items-start">
              <div className="w-3 h-3 mt-1 mr-2 bg-green-500 rounded-sm flex-shrink-0"></div>
              <span>Portfolio maintains 96% average occupancy across 18 of 20 units</span>
            </li>
            <li className="flex items-start">
              <div className="w-3 h-3 mt-1 mr-2 bg-green-500 rounded-sm flex-shrink-0"></div>
              <span>Above-market rents (avg +8.2%) with 92% tenant retention rate</span>
            </li>
            <li className="flex items-start">
              <div className="w-3 h-3 mt-1 mr-2 bg-green-500 rounded-sm flex-shrink-0"></div>
              <span>Strong credit tenants (BBB+ avg) with minimal CapEx required</span>
            </li>
          </ul>
        </div>
        <div className="bg-gray-50 p-4 rounded shadow-sm border border-gray-200">
          <h3 className="text-base font-semibold text-gray-800 border-b pb-2 mb-2">Risk Factors</h3>
          <ul className="text-sm space-y-1 text-gray-700">
            <li className="flex items-start">
              <div className="w-3 h-3 mt-1 mr-2 bg-red-500 rounded-sm flex-shrink-0"></div>
              <span>Unit 7 shows persistently low occupancy (85%) and high expense ratio</span>
            </li>
            <li className="flex items-start">
              <div className="w-3 h-3 mt-1 mr-2 bg-red-500 rounded-sm flex-shrink-0"></div>
              <span>Unit 14 requires significant CapEx with lease expiring in 12 months</span>
            </li>
            <li className="flex items-start">
              <div className="w-3 h-3 mt-1 mr-2 bg-yellow-500 rounded-sm flex-shrink-0"></div>
              <span>Units 4, 14 and 17 showing flat revenue growth compared to portfolio</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CommercialPortfolioHeatmap; 