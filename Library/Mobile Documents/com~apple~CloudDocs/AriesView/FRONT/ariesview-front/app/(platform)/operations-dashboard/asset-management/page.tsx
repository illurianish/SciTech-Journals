'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AssetManagementPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Asset Management</h1>
        <p className="text-gray-600">Manage your property portfolio and view performance analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          href="/operations-dashboard/properties"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold mb-2">Properties</h2>
          <p className="text-gray-600">View and manage your property portfolio</p>
        </Link>

        <Link 
          href="/operations-dashboard/dashboards"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold mb-2">AriesView Dashboard</h2>
          <p className="text-gray-600">Access comprehensive performance analytics</p>
        </Link>

        <Link 
          href="/operations-dashboard/custom-dashboards"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold mb-2">Customized Dashboard</h2>
          <p className="text-gray-600">Create and view custom analytics dashboards</p>
        </Link>
      </div>
    </div>
  )
} 