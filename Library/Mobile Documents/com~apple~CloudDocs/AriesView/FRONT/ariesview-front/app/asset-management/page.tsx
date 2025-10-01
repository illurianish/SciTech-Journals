export const metadata = {
  title: "Asset Management - Enterprise-Grade Portfolio Optimization | AriesView",
  description: "Enterprise Asset Management Optimization for real estate professionals - Maximize ROI and operational efficiency with our comprehensive platform",
};

import Hero from "@/components/hero-home";
import Cta from "@/components/cta";

export default function AssetManagementPage() {
  return (
    <>
      {/* Hero Section with Product Overview */}
      <div className="pt-32 pb-12 md:pt-40 md:pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Header section */}
          <div className="mx-auto max-w-4xl text-center pb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#001A41] mb-10">
              AI-Driven<br />Asset Management
            </h1>
            
            <p className="text-xl text-[#001A41] text-opacity-80 max-w-3xl mx-auto mb-8">
              AriesView simplifies portfolio oversight, lease management, and financial analytics—powered by AI for smarter real estate operations
            </p>
            
            <div className="flex justify-center space-x-4">
              <a
                className="btn group bg-[#1a365d] text-white shadow-lg hover:bg-[#2a4a7f]"
                href="/signup"
              >
                <span className="relative inline-flex items-center">
                  Start a Free Trial{" "}
                  <span className="ml-1 tracking-normal text-blue-300 transition-transform group-hover:translate-x-0.5">
                    -&gt;
                  </span>
                </span>
              </a>
              <a
                className="btn bg-[#1a365d] text-white shadow-lg hover:bg-[#2a4a7f]"
                href="/contact"
              >
                Contact Sales
              </a>
            </div>
          </div>
          
          {/* Four customer segments grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {/* Segment 1 */}
            <div className="bg-[#001A41] rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">Portfolio Managers</h3>
                <p className="text-white text-opacity-90">
                  Gain comprehensive visibility across your entire portfolio with real-time performance dashboards and automated variance analysis that identifies optimization opportunities instantly.
                </p>
              </div>
            </div>
            
            {/* Segment 2 */}
            <div className="bg-[#001A41] rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">Asset Managers</h3>
                <p className="text-white text-opacity-90">
                  Streamline property operations with AI-powered expense tracking, automated compliance monitoring, and predictive maintenance tools that reduce costs and prevent revenue leakage.
                </p>
              </div>
            </div>
            
            {/* Segment 3 */}
            <div className="bg-[#001A41] rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">Financial Officers</h3>
                <p className="text-white text-opacity-90">
                  Enhance financial oversight with automated waterfall calculations, budget variance tracking, and sophisticated financial modeling that improves accuracy and reduces reporting time.
                </p>
              </div>
            </div>
            
            {/* Segment 4 */}
            <div className="bg-[#001A41] rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">Investor Relations</h3>
                <p className="text-white text-opacity-90">
                  Transform investor communications with automated reporting, secure investor portals, and customizable performance visualizations that build trust and streamline capital raising.
                </p>
              </div>
            </div>
          </div>
          
          {/* Product Suite Overview - DataRobot-inspired tabs/cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#001A41] bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#001A41]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#001A41]">Performance Analytics</h2>
              </div>
              <p className="text-[#001A41] text-opacity-80 mb-4">Real-time dashboards and KPIs to monitor property performance, identify trends, and optimize operations.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#001A41] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-[#001A41] text-opacity-80">Customizable performance dashboards</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#001A41] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-[#001A41] text-opacity-80">Automated variance analysis</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#001A41] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-[#001A41] text-opacity-80">Predictive maintenance modeling</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#001A41] bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#001A41]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#001A41]">Financial Management</h2>
              </div>
              <p className="text-[#001A41] text-opacity-80 mb-4">Comprehensive financial tools for expense tracking, budgeting, and investor distributions.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#001A41] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-[#001A41] text-opacity-80">Automated expense categorization</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#001A41] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-[#001A41] text-opacity-80">Waterfall distribution calculations</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#001A41] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-[#001A41] text-opacity-80">Budget variance tracking</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#001A41] bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#001A41]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#001A41]">Compliance Monitoring</h2>
              </div>
              <p className="text-[#001A41] text-opacity-80 mb-4">Automated tracking of lease compliance, regulatory requirements, and important deadlines.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#001A41] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-[#001A41] text-opacity-80">Lease expiration alerts</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#001A41] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-[#001A41] text-opacity-80">Regulatory compliance tracking</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#001A41] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-[#001A41] text-opacity-80">Document management system</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#001A41] bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#001A41]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#001A41]">Investor Relations</h2>
              </div>
              <p className="text-[#001A41] text-opacity-80 mb-4">Streamline investor communications with automated reporting and secure data access.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#001A41] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-[#001A41] text-opacity-80">Automated investor reporting</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#001A41] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-[#001A41] text-opacity-80">Secure investor portal</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#001A41] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-[#001A41] text-opacity-80">Performance visualization tools</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Business Outcomes Section */}
      <div className="py-16 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#001A41] mb-4">Business Outcomes & ROI</h2>
            <p className="text-xl text-[#001A41] text-opacity-80 max-w-3xl mx-auto">Our platform delivers measurable results across real estate operations</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="text-4xl font-bold text-[#001A41] mb-2">15-20%</div>
              <p className="text-[#001A41] font-medium">Reduction in administrative workload</p>
              <p className="text-[#001A41] text-opacity-70 text-sm mt-2">Through automation and streamlined workflows</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="text-4xl font-bold text-[#001A41] mb-2">7-12%</div>
              <p className="text-[#001A41] font-medium">Increase in NOI</p>
              <p className="text-[#001A41] text-opacity-70 text-sm mt-2">Through leakage prevention and expense optimization</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="text-4xl font-bold text-[#001A41] mb-2">60%</div>
              <p className="text-[#001A41] font-medium">Fewer compliance issues</p>
              <p className="text-[#001A41] text-opacity-70 text-sm mt-2">With automated monitoring and alerts</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Integration Section */}
      <div className="py-16 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#001A41] mb-4">Enterprise Ecosystem Integration</h2>
            <p className="text-xl text-[#001A41] text-opacity-80 max-w-3xl mx-auto">Seamlessly connect with your existing real estate technology stack</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center h-20 border border-gray-100">
              <div className="text-center">
                <p className="font-semibold text-[#001A41]">Yardi</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center h-20 border border-gray-100">
              <div className="text-center">
                <p className="font-semibold text-[#001A41]">MRI</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center h-20 border border-gray-100">
              <div className="text-center">
                <p className="font-semibold text-[#001A41]">RealPage</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center h-20 border border-gray-100">
              <div className="text-center">
                <p className="font-semibold text-[#001A41]">Salesforce</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <a
              className="btn group inline-flex bg-[#001A41] text-white shadow-lg hover:bg-opacity-90 px-6 py-3 rounded-lg"
              href="#0"
            >
              <span className="relative inline-flex items-center">
                Begin Your Transformation{" "}
                <span className="ml-1 tracking-normal text-blue-300 transition-transform group-hover:translate-x-0.5">
                  -&gt;
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>
      
      <Cta />
    </>
  );
} 