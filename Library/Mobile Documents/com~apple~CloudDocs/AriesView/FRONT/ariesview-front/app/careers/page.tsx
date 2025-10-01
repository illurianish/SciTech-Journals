export const metadata = {
  title: "Careers - AriesView",
  description: "Join our team and help transform real estate analytics",
};

import Link from "next/link";

export default function CareerPage() {
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
              Join Our Team
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-600 max-w-4xl mx-auto">
              Help us transform how real estate professionals make investment decisions with AI-powered analytics
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="#open-positions"
                className="inline-flex items-center px-8 py-3 rounded-lg bg-[#001233] text-white font-semibold hover:bg-[#001845] transition-colors"
              >
                View Open Positions →
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-3 rounded-lg bg-[#1B365D] text-white font-semibold hover:bg-[#264573] transition-colors"
              >
                Contact Us →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Why Work Here section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#001233]">
            Why Work at AriesView?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-[#001A41] rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">Innovation</h3>
                <p className="text-white text-opacity-90">
                  Push the boundaries of what's possible in real estate analytics using cutting-edge AI and machine learning
                </p>
              </div>
            </div>

            <div className="bg-[#001A41] rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">Growth</h3>
                <p className="text-white text-opacity-90">
                  Continuous learning opportunities and career advancement in a rapidly growing company
                </p>
              </div>
            </div>

            <div className="bg-[#001A41] rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">Impact</h3>
                <p className="text-white text-opacity-90">
                  Transform how real estate professionals make decisions with your contributions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div id="open-positions" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-[#001233]">
              Open Positions
            </h2>
            
            {/* Engineering Roles */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-[#001233]">Engineering</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h4 className="text-xl font-bold text-[#001233] mb-3">Frontend Engineer Intern</h4>
                  <p className="text-gray-600 mb-4">
                    Build beautiful, AI-enhanced responsive interfaces using React, Next.js, and TypeScript
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-[#001A41] text-white text-xs font-medium px-2.5 py-0.5 rounded">React</span>
                    <span className="bg-[#001A41] text-white text-xs font-medium px-2.5 py-0.5 rounded">Next.js</span>
                    <span className="bg-[#001A41] text-white text-xs font-medium px-2.5 py-0.5 rounded">TypeScript</span>
                    <span className="bg-[#001A41] text-white text-xs font-medium px-2.5 py-0.5 rounded">AI</span>
                  </div>
                  <Link href="/careers/apply?position=Frontend%20Engineer%20Intern" className="text-[#001233] hover:text-[#001845] font-semibold">
                    Apply Now →
                  </Link>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h4 className="text-xl font-bold text-[#001233] mb-3">Backend Engineer Intern</h4>
                  <p className="text-gray-600 mb-4">
                    Build scalable AI-driven APIs and services using Node.js, Python, and AWS
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-[#001A41] text-white text-xs font-medium px-2.5 py-0.5 rounded">Node.js</span>
                    <span className="bg-[#001A41] text-white text-xs font-medium px-2.5 py-0.5 rounded">Python</span>
                    <span className="bg-[#001A41] text-white text-xs font-medium px-2.5 py-0.5 rounded">AWS</span>
                    <span className="bg-[#001A41] text-white text-xs font-medium px-2.5 py-0.5 rounded">AI</span>
                  </div>
                  <Link href="/careers/apply?position=Backend%20Engineer%20Intern" className="text-[#001233] hover:text-[#001845] font-semibold">
                    Apply Now →
                  </Link>
                </div>
              </div>
            </div>

            {/* Product & Design Roles */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-[#001233]">Product & Design</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h4 className="text-xl font-bold text-[#001233] mb-3">Product Manager Intern</h4>
                  <p className="text-gray-600 mb-4">
                    Lead product strategy and development for our AI analytics platform
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-[#001A41] text-white text-xs font-medium px-2.5 py-0.5 rounded">Strategy</span>
                    <span className="bg-[#001A41] text-white text-xs font-medium px-2.5 py-0.5 rounded">Agile</span>
                    <span className="bg-[#001A41] text-white text-xs font-medium px-2.5 py-0.5 rounded">Research</span>
                    <span className="bg-[#001A41] text-white text-xs font-medium px-2.5 py-0.5 rounded">AI</span>
                  </div>
                  <Link href="/careers/apply?position=Product%20Manager%20Intern" className="text-[#001233] hover:text-[#001845] font-semibold">
                    Apply Now →
                  </Link>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h4 className="text-xl font-bold text-[#001233] mb-3">UI/UX Designer Intern</h4>
                  <p className="text-gray-600 mb-4">
                    Create intuitive AI-powered experiences for our analytics platform
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-[#001A41] text-white text-xs font-medium px-2.5 py-0.5 rounded">Figma</span>
                    <span className="bg-[#001A41] text-white text-xs font-medium px-2.5 py-0.5 rounded">Research</span>
                    <span className="bg-[#001A41] text-white text-xs font-medium px-2.5 py-0.5 rounded">Design</span>
                    <span className="bg-[#001A41] text-white text-xs font-medium px-2.5 py-0.5 rounded">AI</span>
                  </div>
                  <Link href="/careers/apply?position=UI%2FUX%20Designer%20Intern" className="text-[#001233] hover:text-[#001845] font-semibold">
                    Apply Now →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#001233]">
            Don't See the Right Role?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals to join our team
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-3 rounded-lg bg-[#001233] text-white font-semibold hover:bg-[#001845] transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/careers/apply"
              className="inline-flex items-center px-8 py-3 rounded-lg border-2 border-[#001233] text-[#001233] font-semibold hover:bg-gray-50 transition-colors"
            >
              Submit Application
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}