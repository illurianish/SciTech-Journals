export const metadata = {
  title: "Asset Management - AriesView",
  description: "Enterprise asset management platform for real estate portfolios",
};

import Link from "next/link";

export default function AssetManagementPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <div className="relative bg-[#F8F9FF] pt-6 md:pt-8 pb-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/background-pattern.svg')] opacity-10"></div>
        </div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-[1200px] mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-[#001233] leading-tight">
              Asset Management
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-600 max-w-4xl mx-auto">
              Optimize your portfolio performance with our comprehensive asset management platform
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-3 rounded-lg bg-[#001233] text-white font-semibold hover:bg-[#001845] transition-colors"
              >
                Schedule Demo →
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center px-8 py-3 rounded-lg bg-[#1B365D] text-white font-semibold hover:bg-[#264573] transition-colors"
              >
                Try For Free →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#001233]">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1: Leasing Strategy */}
            <div className="bg-[#001A41] rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">Leasing Strategy</h3>
                <p className="text-white text-opacity-90">
                  Track leasing performance, rent rolls, and term expirations across your portfolio. Monitor occupancy trends and tenant exposure without needing manual updates.
                </p>
              </div>
            </div>

            {/* Card 2: Budget Oversight */}
            <div className="bg-[#001A41] rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">Budget Oversight</h3>
                <p className="text-white text-opacity-90">
                  View operating budgets, actuals, and capital plans in one place. Instantly access financial performance dashboards to ensure assets stay on target.
                </p>
              </div>
            </div>

            {/* Card 3: Hold/Sell Decisions */}
            <div className="bg-[#001A41] rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">Hold/Sell Decisions</h3>
                <p className="text-white text-opacity-90">
                  Analyze asset performance, market comps, and IRR projections to support informed decisions on when to hold, sell, or refinance—backed by real-time data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#001233]">Portfolio Performance</h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Track and optimize key performance indicators across your portfolio
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#001233] mb-2">15%</div>
              <div className="text-sm text-gray-600">NOI Improvement</div>
              <div className="text-xs text-gray-500 mt-1">Average portfolio increase</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#001233] mb-2">30%</div>
              <div className="text-sm text-gray-600">Cost Reduction</div>
              <div className="text-xs text-gray-500 mt-1">In operational expenses</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#001233] mb-2">95%</div>
              <div className="text-sm text-gray-600">Occupancy Rate</div>
              <div className="text-xs text-gray-500 mt-1">Portfolio average</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#001233] mb-2">24/7</div>
              <div className="text-sm text-gray-600">Portfolio Monitoring</div>
              <div className="text-xs text-gray-500 mt-1">Real-time analytics</div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#001233]">
                  Benefits
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <div>
                      <h3 className="text-lg font-semibold text-[#001233] mb-2">Increased Efficiency</h3>
                      <p className="text-gray-600">Automate routine tasks and streamline operations</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <div>
                      <h3 className="text-lg font-semibold text-[#001233] mb-2">Better Decision Making</h3>
                      <p className="text-gray-600">Data-driven insights for portfolio optimization</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <div>
                      <h3 className="text-lg font-semibold text-[#001233] mb-2">Enhanced Reporting</h3>
                      <p className="text-gray-600">Comprehensive reporting and analytics tools</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold text-[#001233] mb-6">Platform Features</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-600">Real-time performance tracking</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-600">Automated financial reporting</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-600">Tenant portal integration</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-600">Maintenance request tracking</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-[#001233] to-[#001845] py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Optimize Your Portfolio?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join leading institutions using AriesView to transform their asset management
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-3 rounded-lg bg-white text-[#001233] font-semibold hover:bg-gray-100 transition-colors"
            >
              Schedule Demo
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center px-8 py-3 rounded-lg border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Try For Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 