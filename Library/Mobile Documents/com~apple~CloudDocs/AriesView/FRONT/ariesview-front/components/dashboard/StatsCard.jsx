"use client"

import React from 'react';

function StatsCard({ title, value, description = '', icon, change, changeType = 'positive' }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">{title}</div>
          <div className="flex items-start">
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">{value}</div>
            {change && (
              <div className={`text-sm font-medium px-1.5 rounded-full ${
                changeType === 'positive' 
                  ? 'text-green-700 bg-green-500/20' 
                  : 'text-red-700 bg-red-500/20'
              }`}>
                {changeType === 'positive' ? '+' : ''}{change}
              </div>
            )}
          </div>
          {description && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</div>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export default StatsCard; 