'use client';

import { useState } from 'react'
import Link from 'next/link'

export default function BenchmarkCenterPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Benchmark Center</h1>
        <p className="text-gray-600">Compare performance metrics against industry standards</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          href="/operations-dashboard/benchmark-center/babson-noi"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold mb-2">Babson LLC NOI</h2>
          <p className="text-gray-600">Net Operating Income analysis for Babson properties</p>
        </Link>

        {/* Additional benchmark cards can be added here */}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
            <h3 className="font-medium mb-1">Create New Benchmark</h3>
            <p className="text-sm text-gray-600">Set up a new performance benchmark</p>
          </button>
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
            <h3 className="font-medium mb-1">Import Data</h3>
            <p className="text-sm text-gray-600">Import external benchmark data</p>
          </button>
        </div>
      </div>
    </div>
  )
} 