import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "AriesView AI - Private AI for Commercial Real Estate",
  description: "Private, secure AI assistant built specifically for commercial real estate analysis",
};

export default function AriesViewAI() {
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
              AI-Powered CRE Intelligence
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-600 max-w-4xl mx-auto">
              Your private AI assistant for commercial real estate insights and analysis
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="/signin"
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

      {/* Blue section divider */}
      <div className="bg-gradient-to-r from-[#001233] to-[#001845] py-16 text-white">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Beyond Generic AI - Built for CRE Professionals
          </h2>
          <p className="mt-4 text-xl max-w-3xl mx-auto">
            Experience AI designed specifically for commercial real estate analysis and decision-making
          </p>
        </div>
      </div>

      {/* Key features section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#001A41] text-white rounded-lg p-8 shadow-sm">
              <h3 className="text-2xl font-bold mb-4">Completely Private Analysis</h3>
              <p className="text-white/90 text-lg leading-relaxed">
                Your data never leaves your environment. Unlike public AI tools, AriesView AI processes all information locally with full confidentiality.
              </p>
            </div>

            <div className="bg-[#001A41] text-white rounded-lg p-8 shadow-sm">
              <h3 className="text-2xl font-bold mb-4">Document Intelligence</h3>
              <p className="text-white/90 text-lg leading-relaxed">
                Extract critical insights from leases, financial statements, market reports, and other CRE documents with pinpoint accuracy.
              </p>
            </div>

            <div className="bg-[#001A41] text-white rounded-lg p-8 shadow-sm">
              <h3 className="text-2xl font-bold mb-4">Financial Analysis</h3>
              <p className="text-white/90 text-lg leading-relaxed">
                Ask complex questions about your property finances and receive instant analysis, projections, and recommendations.
              </p>
            </div>

            <div className="bg-[#001A41] text-white rounded-lg p-8 shadow-sm">
              <h3 className="text-2xl font-bold mb-4">CRE-Specific Training</h3>
              <p className="text-white/90 text-lg leading-relaxed">
                Unlike general AI, AriesView is trained specifically on commercial real estate concepts, terminology, and industry best practices.
              </p>
            </div>

            <div className="bg-[#001A41] text-white rounded-lg p-8 shadow-sm">
              <h3 className="text-2xl font-bold mb-4">Multi-Document Analysis</h3>
              <p className="text-white/90 text-lg leading-relaxed">
                Compare and analyze multiple documents simultaneously, identifying inconsistencies, opportunities, and patterns across your portfolio.
              </p>
            </div>

            <div className="bg-[#001A41] text-white rounded-lg p-8 shadow-sm">
              <h3 className="text-2xl font-bold mb-4">Personalized Insights</h3>
              <p className="text-white/90 text-lg leading-relaxed">
                The more you use AriesView AI, the more it learns about your portfolio, preferences, and goals to provide increasingly tailored advice.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-[#001233]">
            How Professionals Use AriesView AI
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4 text-[#001233]">Document Analysis & Extraction</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>"Extract all rent escalation clauses from our office leases in the Atlanta portfolio"</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>"Find all non-compete clauses in our retail leases and summarize restrictions"</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>"Identify all maintenance obligations across our industrial property leases"</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4 text-[#001233]">Financial Insights & Analysis</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>"Calculate the IRR for this acquisition based on our projected cash flows"</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>"Compare the cap rates across our multifamily portfolio in different markets"</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>"Analyze our budget vs. actual expenses for the downtown office building in Q2"</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4 text-[#001233]">Due Diligence Acceleration</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>"Review the purchase agreement and identify all contingencies and deadlines"</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>"Analyze all tenant leases and summarize key financial and legal risks"</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>"Validate the seller's financial projections against historical performance data"</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4 text-[#001233]">Portfolio Optimization</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>"Which properties in our portfolio have the lowest performing NOI relative to market?"</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>"Recommend optimization strategies for our underperforming retail assets"</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>"Project the impact of a 50 basis point interest rate increase across our debt portfolio"</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-[#001233] to-[#001845] py-20">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Ready to Transform Your CRE Analysis?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
            Join leading CRE firms using AriesView AI to accelerate their analysis, reduce risks, and make better investment decisions.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/signin"
              className="inline-flex items-center px-8 py-3 rounded-lg bg-white text-[#001233] font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Your Free Trial →
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-3 rounded-lg border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Schedule a Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 