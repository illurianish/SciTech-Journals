export const metadata = {
  title: "Acquisition Screening - AriesView",
  description: "AI-powered acquisition screening and analysis for real estate investments",
};

import Link from "next/link";

export default function AcquisitionScreeningPage() {
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
              Acquisition Screening
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-600 max-w-4xl mx-auto">
              Make data-driven investment decisions with our AI-powered acquisition screening platform
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
            <div className="bg-[#001A41] rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">Automated ROI Analysis</h3>
                <p className="text-white text-opacity-90">
                  Instantly calculate potential returns and investment metrics with our AI-powered analytics
                </p>
              </div>
            </div>

            <div className="bg-[#001A41] rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">Property Analysis</h3>
                <p className="text-white text-opacity-90">
                  Comprehensive property analysis including financials, occupancy, and historical performance
                </p>
              </div>
            </div>

            <div className="bg-[#001A41] rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">Risk Assessment</h3>
                <p className="text-white text-opacity-90">
                  Evaluate potential risks and compliance requirements with our automated assessment tools
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* AI-Powered Analysis */}
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="flex items-start mb-4">
                <div className="rounded-full bg-[#001A41] p-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#001233] ml-4">AI-Powered Analysis</h3>
              </div>
              <p className="text-gray-600 mb-4">Advanced algorithms that instantly evaluate potential returns on investment properties with comprehensive projections.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Cash flow projections
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Cap rate analysis
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  IRR calculations
                </li>
              </ul>
            </div>

            {/* Market Intelligence */}
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="flex items-start mb-4">
                <div className="rounded-full bg-[#001A41] p-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#001233] ml-4">Market Intelligence</h3>
              </div>
              <p className="text-gray-600 mb-4">Real-time market data integrated directly into your analysis workflow for better decision making.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Rental rate trends
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Occupancy forecasts
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Economic indicators
                </li>
              </ul>
            </div>

            {/* Risk Assessment */}
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="flex items-start mb-4">
                <div className="rounded-full bg-[#001A41] p-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#001233] ml-4">Risk Assessment</h3>
              </div>
              <p className="text-gray-600 mb-4">Comprehensive risk evaluation tools to identify potential issues before they impact your investment.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Property condition analysis
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Market volatility metrics
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Regulatory compliance factors
                </li>
              </ul>
            </div>

            {/* Pipeline Management */}
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="flex items-start mb-4">
                <div className="rounded-full bg-[#001A41] p-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#001233] ml-4">Pipeline Management</h3>
              </div>
              <p className="text-gray-600 mb-4">Enterprise-grade tools to organize, prioritize, and track multiple acquisition opportunities simultaneously.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Deal tracking dashboard
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Collaborative workflows
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Approval routing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Business Outcomes Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#001233]">Business Outcomes & ROI</h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Our platform delivers measurable results for investment teams
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#001233] mb-2">80%</div>
              <div className="text-sm text-gray-600">Reduction in analysis time</div>
              <div className="text-xs text-gray-500 mt-1">Through automated financial modeling</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#001233] mb-2">62%</div>
              <div className="text-sm text-gray-600">Fewer investment surprises</div>
              <div className="text-xs text-gray-500 mt-1">Through comprehensive pre-acquisition assessment</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#001233] mb-2">4x</div>
              <div className="text-sm text-gray-600">More opportunities evaluated</div>
              <div className="text-xs text-gray-500 mt-1">Without increasing staff</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#001233] mb-2">26%</div>
              <div className="text-sm text-gray-600">Improved forecast accuracy</div>
              <div className="text-xs text-gray-500 mt-1">In investment performance predictions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#001233]">Enterprise Ecosystem Integration</h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Seamlessly connect with your existing real estate technology stack
          </p>
          <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-lg w-48 text-center">
              <div className="text-xl font-semibold text-[#001233]">Yardi</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg w-48 text-center">
              <div className="text-xl font-semibold text-[#001233]">MRI</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg w-48 text-center">
              <div className="text-xl font-semibold text-[#001233]">RealPage</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg w-48 text-center">
              <div className="text-xl font-semibold text-[#001233]">Salesforce</div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Preview */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#001233]">
                  Streamline Your Acquisition Process
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Our platform helps you make faster, more informed investment decisions by automating key aspects of the acquisition screening process:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-600">Automated financial modeling and ROI calculations</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-600">Historical performance analysis and trends</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-600">Comprehensive risk and compliance assessment</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Average Time Saved</p>
                    <p className="text-2xl font-bold text-[#001233]">75%</p>
                    <p className="text-sm text-green-600">Per screening</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Data Points Analyzed</p>
                    <p className="text-2xl font-bold text-[#001233]">1000+</p>
                    <p className="text-sm text-green-600">Per property</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Market Coverage</p>
                    <p className="text-2xl font-bold text-[#001233]">95%</p>
                    <p className="text-sm text-green-600">Major markets</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">ROI Accuracy</p>
                    <p className="text-2xl font-bold text-[#001233]">98%</p>
                    <p className="text-sm text-green-600">Confidence rate</p>
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
            Ready to Transform Your Acquisition Process?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join leading institutions using AriesView to make better investment decisions
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