export const metadata = {
  title: "Real Estate Asset Managers - AriesView",
  description: "Optimize property performance efficiently",
};

import Link from "next/link";

export default function AssetManagers() {
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
              Asset Management Platform
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-600 max-w-4xl mx-auto">
              Streamline your property operations with AI-powered insights and automated workflows
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="/signup"
                className="inline-flex items-center px-8 py-3 rounded-lg bg-[#001233] text-white font-semibold hover:bg-[#001845] transition-colors"
              >
                Start a Free Trial →
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-3 rounded-lg bg-[#1B365D] text-white font-semibold hover:bg-[#264573] transition-colors"
              >
                Contact Sales →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#001233]">
            Optimize Property Performance
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-[#001A41] rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">Property Overview</h3>
                <p className="text-white text-opacity-90">
                  Comprehensive property metrics, occupancy tracking, and performance analytics in one dashboard
                </p>
              </div>
            </div>

            <div className="bg-[#001A41] rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">Lease Management</h3>
                <p className="text-white text-opacity-90">
                  Track lease expirations, monitor tenant performance, and streamline renewal processes
                </p>
              </div>
            </div>

            <div className="bg-[#001A41] rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">OpEx Analysis</h3>
                <p className="text-white text-opacity-90">
                  Monitor operating expenses, identify cost-saving opportunities, and benchmark against market standards
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#001233]">
                  Real-time Property Insights
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-[#001233]">Lease Expiration Tracking</h3>
                      <p className="text-gray-600">Stay ahead of lease renewals with automated tracking and notifications for upcoming expirations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-[#001233]">Performance Metrics</h3>
                      <p className="text-gray-600">Monitor key performance indicators including occupancy rates, NOI, and operating expenses</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Occupancy Rate</p>
                    <p className="text-2xl font-bold text-[#001233]">92.8%</p>
                    <p className="text-sm text-green-600">↑ 1.2% vs last month</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">NOI</p>
                    <p className="text-2xl font-bold text-[#001233]">$2.4M</p>
                    <p className="text-sm text-green-600">↑ 3.5% vs last month</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">OpEx per sq.ft</p>
                    <p className="text-2xl font-bold text-[#001233]">$15.75</p>
                    <p className="text-sm text-green-600">↓ 2.1% vs benchmark</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Lease Renewals</p>
                    <p className="text-2xl font-bold text-[#001233]">4</p>
                    <p className="text-sm text-orange-600">Due in 30 days</p>
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
            Ready to Transform Your Property Management?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join leading asset managers using AriesView to optimize property performance
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-3 rounded-lg bg-white text-[#001233] font-semibold hover:bg-gray-100 transition-colors"
            >
              Schedule a Demo
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center px-8 py-3 rounded-lg border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 