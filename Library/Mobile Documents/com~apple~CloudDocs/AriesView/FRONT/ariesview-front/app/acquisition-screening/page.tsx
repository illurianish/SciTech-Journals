export const metadata = {
  title: "Acquisition Screening - Real Estate Digital Transformation Solutions | AriesView",
  description: "Advanced Property Analysis Platform for Enterprise - Transform your investment evaluation process with AI-powered screening tools",
};

import Link from "next/link";

export default function AcquisitionScreeningPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-[#F8F9FF] pt-32 pb-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/background-pattern.svg')] opacity-10"></div>
        </div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-[1200px] mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-[#001233] leading-tight">
              AI-Driven<br />Acquisition Screening
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-600 max-w-4xl mx-auto">
              AriesView simplifies investment evaluation, property analysis, and risk assessment—powered by AI for smarter acquisition decisions
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
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* User Segments Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Acquisition Directors */}
            <div className="bg-[#001A41] rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">Acquisition Directors</h3>
                <p className="text-white text-opacity-90">
                  Streamline your deal pipeline with AI-powered screening tools that automatically identify high-potential properties matching your investment criteria and strategy.
                </p>
              </div>
            </div>

            {/* Financial Analysts */}
            <div className="bg-[#001A41] rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">Financial Analysts</h3>
                <p className="text-white text-opacity-90">
                  Accelerate financial modeling with automated data extraction, intelligent cash flow projections, and sensitivity analysis tools that deliver institutional-grade underwriting.
                </p>
              </div>
            </div>

            {/* Market Researchers */}
            <div className="bg-[#001A41] rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">Market Researchers</h3>
                <p className="text-white text-opacity-90">
                  Access comprehensive market intelligence with demographic trends, competitive analysis, and predictive rent forecasts powered by machine learning algorithms.
                </p>
              </div>
            </div>

            {/* Investment Committee */}
            <div className="bg-[#001A41] rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">Investment Committee</h3>
                <p className="text-white text-opacity-90">
                  Make confident decisions with standardized investment packages, risk assessment scorecards, and scenario modeling that clearly communicates opportunity and risk.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* AI-Powered Analysis */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#001A41] bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#001A41]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#001A41]">AI-Powered Analysis</h2>
              </div>
              <p className="text-[#001A41] text-opacity-80 mb-4">Advanced algorithms that instantly evaluate potential returns on investment properties with comprehensive projections.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#001A41] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-[#001A41] text-opacity-80">Cash flow projections</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#001A41] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-[#001A41] text-opacity-80">Cap rate analysis</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#001A41] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-[#001A41] text-opacity-80">IRR calculations</span>
                </li>
              </ul>
            </div>

            {/* Market Intelligence */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#001A41] bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#001A41]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#001A41]">Market Intelligence</h2>
              </div>
              <p className="text-[#001A41] text-opacity-80 mb-4">Real-time market data integrated directly into your analysis workflow for better decision making.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#001A41] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-[#001A41] text-opacity-80">Rental rate trends</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#001A41] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-[#001A41] text-opacity-80">Occupancy forecasts</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#001A41] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-[#001A41] text-opacity-80">Economic indicators</span>
                </li>
              </ul>
            </div>

            {/* Risk Assessment */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#001A41] bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#001A41]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#001A41]">Risk Assessment</h2>
              </div>
              <p className="text-[#001A41] text-opacity-80 mb-4">Comprehensive risk evaluation tools to identify potential issues before they impact your investment.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#001A41] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-[#001A41] text-opacity-80">Property condition analysis</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#001A41] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-[#001A41] text-opacity-80">Market volatility metrics</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#001A41] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-[#001A41] text-opacity-80">Regulatory compliance factors</span>
                </li>
              </ul>
            </div>

            {/* Pipeline Management */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#001A41] bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#001A41]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#001A41]">Pipeline Management</h2>
              </div>
              <p className="text-[#001A41] text-opacity-80 mb-4">Enterprise-grade tools to organize, prioritize, and track multiple acquisition opportunities simultaneously.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#001A41] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-[#001A41] text-opacity-80">Deal tracking dashboard</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#001A41] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-[#001A41] text-opacity-80">Collaborative workflows</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#001A41] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-[#001A41] text-opacity-80">Approval routing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Business Outcomes Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#001A41] mb-4">Business Outcomes & ROI</h2>
            <p className="text-xl text-[#001A41] text-opacity-80 max-w-3xl mx-auto">Our platform delivers measurable results for investment teams</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="text-4xl font-bold text-[#001A41] mb-2">80%</div>
              <p className="text-[#001A41] font-medium">Reduction in analysis time</p>
              <p className="text-[#001A41] text-opacity-70 text-sm mt-2">Through automated financial modeling</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="text-4xl font-bold text-[#001A41] mb-2">62%</div>
              <p className="text-[#001A41] font-medium">Fewer investment surprises</p>
              <p className="text-[#001A41] text-opacity-70 text-sm mt-2">Through comprehensive pre-acquisition assessment</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="text-4xl font-bold text-[#001A41] mb-2">4x</div>
              <p className="text-[#001A41] font-medium">More opportunities evaluated</p>
              <p className="text-[#001A41] text-opacity-70 text-sm mt-2">Without increasing staff</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="text-4xl font-bold text-[#001A41] mb-2">26%</div>
              <p className="text-[#001A41] font-medium">Improved forecast accuracy</p>
              <p className="text-[#001A41] text-opacity-70 text-sm mt-2">In investment performance predictions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Partners */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#001A41] mb-4">Enterprise Ecosystem Integration</h2>
            <p className="text-xl text-[#001A41] text-opacity-80 max-w-3xl mx-auto">Seamlessly connect with your existing real estate technology stack</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center p-6 bg-white rounded-xl shadow-sm">
              <span className="text-xl font-bold text-[#001A41]">Yardi</span>
            </div>
            <div className="flex items-center justify-center p-6 bg-white rounded-xl shadow-sm">
              <span className="text-xl font-bold text-[#001A41]">MRI</span>
            </div>
            <div className="flex items-center justify-center p-6 bg-white rounded-xl shadow-sm">
              <span className="text-xl font-bold text-[#001A41]">RealPage</span>
            </div>
            <div className="flex items-center justify-center p-6 bg-white rounded-xl shadow-sm">
              <span className="text-xl font-bold text-[#001A41]">Salesforce</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#001A41]">
            Ready to Transform Your Acquisition Process?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join leading institutions using AriesView to make better investment decisions
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-3 rounded-lg bg-[#001233] text-white font-semibold hover:bg-[#001845] transition-colors"
            >
              Schedule Demo
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center px-8 py-3 rounded-lg border-2 border-[#001233] text-[#001233] font-semibold hover:bg-gray-50 transition-colors"
            >
              Try For Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 