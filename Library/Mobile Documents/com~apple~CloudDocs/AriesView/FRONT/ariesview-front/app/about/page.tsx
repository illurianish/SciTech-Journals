export const metadata = {
  title: "About AriesView - Real Estate Digital Transformation Solutions",
  description: "Enterprise Asset Management Optimization experts - Transform your real estate operations with our AI-powered analytics platform",
};

import Link from "next/link";

export default function AboutPage() {
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
              Enterprise Transformation<br />for Real Estate Leaders
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-600 max-w-4xl mx-auto">
              Strategic intelligence at scale, powered by AI for better decision making and operational excellence
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-3 rounded-lg bg-[#001233] text-white font-semibold hover:bg-[#001845] transition-colors"
              >
                Schedule a Demo →
              </Link>
              <Link
                href="/signin"
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
            Enterprise Solutions for Every Team
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="bg-[#001A41] rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">Executive Teams</h3>
                <p className="text-white text-opacity-90">
                  Drive strategic growth with enterprise-grade analytics that provide comprehensive portfolio visibility
                </p>
              </div>
            </div>

            <div className="bg-[#001A41] rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">Legal Teams</h3>
                <p className="text-white text-opacity-90">
                  Streamline contract review and compliance monitoring with AI-powered document analysis
                </p>
              </div>
            </div>

            <div className="bg-[#001A41] rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">Acquisition Teams</h3>
                <p className="text-white text-opacity-90">
                  Accelerate deal analysis and due diligence with automated screening and risk assessment
                </p>
              </div>
            </div>

            <div className="bg-[#001A41] rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">Asset Management Teams</h3>
                <p className="text-white text-opacity-90">
                  Optimize portfolio performance with automated reporting and operational analytics
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#001233]">
              Our Mission
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                At AriesView, we're on a mission to transform how institutional real estate investors make decisions. We believe that enterprise-grade analytics should be the foundation of all investment strategy, portfolio optimization, and asset management operations.
              </p>
              <p className="text-gray-600">
                Founded by a team of real estate professionals and data scientists, AriesView was built to address the complex analytics needs of institutional investors. Our platform integrates every aspect of the real estate investment lifecycle.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-[#001233] to-[#001845] py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Begin Your Digital Transformation
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join leading institutions using AriesView to transform their real estate operations
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-3 rounded-lg bg-white text-[#001233] font-semibold hover:bg-gray-100 transition-colors"
            >
              Schedule a Demo
            </Link>
            <Link
              href="/signin"
              className="inline-flex items-center px-8 py-3 rounded-lg border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
