'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AcquisitionScreeningPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Acquisition Screening</h1>
        <p className="text-gray-600">Analyze potential acquisitions and track investment opportunities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          href="/operations-dashboard/acquisition-screening/deal-screen"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold mb-2">Deal Screen</h2>
          <p className="text-gray-600">Evaluate and screen potential acquisition opportunities</p>
        </Link>

        <Link 
          href="/operations-dashboard/acquisition-screening/investment-criteria"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold mb-2">Investment Criteria</h2>
          <p className="text-gray-600">Set and manage investment parameters and thresholds</p>
        </Link>
      </div>
    </div>
  )
} 