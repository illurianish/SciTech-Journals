'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function InvestorReportingPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Investor Reporting</h1>
        <p className="text-gray-600">Access and manage investor communications and reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          href="/operations-dashboard/investor-reporting/performance-reports"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold mb-2">Performance Reports</h2>
          <p className="text-gray-600">View and generate investment performance reports</p>
        </Link>

        <Link 
          href="/operations-dashboard/investor-reporting/distribution-statements"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold mb-2">Distribution Statements</h2>
          <p className="text-gray-600">Access distribution and payment information</p>
        </Link>

        <Link 
          href="/operations-dashboard/investor-reporting/investor-portal"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold mb-2">Investor Portal</h2>
          <p className="text-gray-600">Access personalized investment data and documents</p>
        </Link>
      </div>
    </div>
  )
} 