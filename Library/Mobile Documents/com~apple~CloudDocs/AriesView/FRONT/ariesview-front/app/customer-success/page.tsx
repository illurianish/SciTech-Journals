import Link from "next/link";

export default function CustomerSuccessPage() {
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
              Customer Success
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-600 max-w-4xl mx-auto">
              How we partner with you to ensure your success with AriesView's real estate analytics platform
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

      {/* Why choose AriesView section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#001233] mb-16">
            Why choose AriesView
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Comprehensive Property Dashboard</h3>
              <p className="text-gray-600">
                Monitor your entire portfolio with at-a-glance metrics. Track occupancy rates, financial performance, and property status from a centralized operations dashboard.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Intelligent Document Management</h3>
              <p className="text-gray-600">
                Manage all property documents with AI-powered insights. Extract key information from leases, financial statements, and contracts with automated document analysis.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Financial Analysis</h3>
              <p className="text-gray-600">
                Leverage AriesView's AI to automatically analyze property financials, track NOI, calculate ROI, and generate financial projections with our comprehensive financial hub.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                  <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                  <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Interactive Data Visualization</h3>
              <p className="text-gray-600">
                Transform complex property data into clear, actionable insights with customizable dashboards and interactive charts for performance metrics, market trends, and benchmarking.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Spreadsheet & Excel Integration</h3>
              <p className="text-gray-600">
                Create and manage financial models with our built-in spreadsheet functionality. Import/export Excel data, use formulas, and collaborate on financial templates in real-time.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AriesView AI Assistant</h3>
              <p className="text-gray-600">
                Ask questions about your portfolio in plain English. Our AI assistant analyzes portfolio metrics, lease performance, operating expenses, and identifies opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#001233] mb-6">Our Approach to Customer Success</h2>
              <p className="text-xl text-gray-600 mb-12">
                At AriesView, we believe that your success is our success. Our customer success team works closely with you from day one to ensure you get the most value from our platform. We're committed to being your partner in real estate analytics, not just another software vendor.
              </p>
              
              <h3 className="text-2xl font-bold text-[#001233] mb-8">How We Support You</h3>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-[#001A41] p-6 rounded-lg">
                  <h4 className="text-xl font-bold text-white mb-3">Personalized Onboarding</h4>
                  <p className="text-white text-opacity-90">
                    Every new customer receives a personalized onboarding experience tailored to your specific needs and use cases. Our team works with you to configure the platform, import your data, and train your team.
                  </p>
                </div>
                
                <div className="bg-[#001A41] p-6 rounded-lg">
                  <h4 className="text-xl font-bold text-white mb-3">Ongoing Training</h4>
                  <p className="text-white text-opacity-90">
                    As your team grows and our platform evolves, we provide ongoing training to ensure everyone stays up to date. From webinars to custom training sessions, we ensure your success.
                  </p>
                </div>
                
                <div className="bg-[#001A41] p-6 rounded-lg">
                  <h4 className="text-xl font-bold text-white mb-3">Technical Support</h4>
                  <p className="text-white text-opacity-90">
                    Our technical support team is available to help with any issues you encounter. With multiple support tiers available, we ensure you get the level of support your business needs.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-[#001233] mb-6">Customer Success Metrics</h3>
              <p className="text-gray-600 mb-8">
                We measure our success by your success. Here are some of the key metrics we track to ensure we're delivering value:
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-[#001233] mb-2">24h</div>
                  <div className="text-gray-600">Average support response time</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-[#001233] mb-2">98%</div>
                  <div className="text-gray-600">Customer satisfaction rate</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-[#001233] mb-2">1 day</div>
                  <div className="text-gray-600">Average time to first value</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 