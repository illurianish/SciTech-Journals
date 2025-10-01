"use client"

import React from 'react';
import Image from 'next/image';

function TableCard({ title, data, columns }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
      </header>      
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            {/* Table header */}
            <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
              <tr>
                {columns.map((column, index) => (
                  <th key={index} className="p-2 whitespace-nowrap">
                    <div className={`font-semibold ${column.align === 'center' ? 'text-center' : 'text-left'}`}>{column.title}</div>
                  </th>
                ))}
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="p-2 whitespace-nowrap">
                      {column.type === 'image' ? (
                        <div className="flex items-center">
                          <div className="w-10 h-10 shrink-0 mr-2 sm:mr-3 relative bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            {row[column.key] ? (
                              <Image 
                                className="rounded-full" 
                                src={row[column.key]} 
                                alt={row.name || 'Image'} 
                                width={40}
                                height={40}
                                style={{ objectFit: 'cover' }}
                              />
                            ) : (
                              <span className="text-gray-400 text-xs">{row.name?.charAt(0) || '?'}</span>
                            )}
                          </div>
                          <div className="font-medium text-gray-800 dark:text-gray-100">{row.name}</div>
                        </div>
                      ) : column.type === 'currency' ? (
                        <div className={`${column.align === 'center' ? 'text-center' : 'text-left'} font-medium text-green-500`}>
                          {row[column.key]}
                        </div>
                      ) : column.type === 'emoji' ? (
                        <div className="text-lg text-center">{row[column.key]}</div>
                      ) : (
                        <div className={column.align === 'center' ? 'text-center' : 'text-left'}>
                          {row[column.key]}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TableCard; 