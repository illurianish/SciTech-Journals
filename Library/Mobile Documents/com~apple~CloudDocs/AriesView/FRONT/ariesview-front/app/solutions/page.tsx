"use client";

import React from 'react';

export default function SolutionsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center">Our Solutions</h1>
      
      {/* Solution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        {/* Acquisition Screening */}
        <div className="flex flex-col">
          <div className="bg-navy-900 rounded-lg flex items-center justify-center" style={{ height: "160px" }}>
            <div className="text-white">
              {/* Icon */}
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Existing SVG path */}
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-6">Acquisition Screening</h3>
          <p className="mt-4 text-gray-600">
            Automated ROI Analysis & Market Benchmarking. Initial Risk & Compliance Assessment.
          </p>
          <a href="/acquisition-screening" className="text-blue-600 mt-4 inline-flex items-center">
            Learn more <span className="ml-2">→</span>
          </a>
        </div>

        {/* Due Diligence */}
        <div className="flex flex-col">
          <div className="bg-navy-900 rounded-lg flex items-center justify-center" style={{ height: "160px" }}>
            <div className="text-white">
              {/* Icon */}
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Existing SVG path */}
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-6">Due Diligence</h3>
          <p className="mt-4 text-gray-600">
            AI-Powered Lease Data Extraction. Anomaly Detection & Audit Trail Reporting. Risk Analysis & Scenario Modelling.
          </p>
          <a href="/due-diligence" className="text-blue-600 mt-4 inline-flex items-center">
            Learn more <span className="ml-2">→</span>
          </a>
        </div>

        {/* Asset Management */}
        <div className="flex flex-col">
          <div className="bg-navy-900 rounded-lg flex items-center justify-center" style={{ height: "160px" }}>
            <div className="text-white">
              {/* Icon */}
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Existing SVG path */}
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-6">Asset Management</h3>
          <p className="mt-4 text-gray-600">
            Expense Tracking & Benchmarking. Automated Rent & Lease Compliance Monitoring. Investor Relations & Waterfall Calculations.
          </p>
          <a href="/asset-management" className="text-blue-600 mt-4 inline-flex items-center">
            Learn more <span className="ml-2">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}