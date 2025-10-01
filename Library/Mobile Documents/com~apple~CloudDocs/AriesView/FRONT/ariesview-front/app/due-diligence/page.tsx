export const metadata = {
  title: "Due Diligence - AriesView",
  description: "Comprehensive property assessment and risk evaluation",
};

import Hero from "@/components/hero-home";
import Cta from "@/components/cta";

export default function DueDiligencePage() {
  return (
    <>
      <div className="pt-32 pb-12 md:pt-40 md:pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-4xl text-center pb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#001A41] mb-10">
              AI-Driven<br />Due Diligence
            </h1>
            <p className="text-xl text-[#001A41] text-opacity-80 max-w-3xl mx-auto mb-8">
              AriesView accelerates property assessment, risk evaluation, and compliance verification—powered by AI for smarter investment decisions
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
          
          {/* Main content */}
          <div className="max-w-3xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[#001A41] mb-4">Streamline Your Due Diligence Process</h2>
              <p className="text-[#001A41] text-opacity-80 mb-6">
                AriesView's Due Diligence tools transform the property evaluation process with AI-powered data extraction, comprehensive analysis, and automated reporting. Our platform helps you conduct thorough assessments in a fraction of the time, reducing risk and increasing confidence in your investment decisions.
              </p>
              
              <h3 className="text-2xl font-bold text-[#001A41] mb-3 mt-8">Key Features</h3>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="text-xl font-bold text-[#001A41] mb-2">AI-Powered Data Extraction</h4>
                  <p className="text-[#001A41] text-opacity-80">
                    Our advanced AI technology automatically extracts critical information from lease documents, financial statements, and property reports. Save hours of manual review and reduce the risk of human error with intelligent document processing.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="text-xl font-bold text-[#001A41] mb-2">Anomaly Detection</h4>
                  <p className="text-[#001A41] text-opacity-80">
                    Quickly identify inconsistencies and potential issues in property data. Our system flags unusual patterns in financial statements, lease terms, and property performance metrics, helping you spot problems before they impact your investment.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="text-xl font-bold text-[#001A41] mb-2">Scenario Modeling</h4>
                  <p className="text-[#001A41] text-opacity-80">
                    Test different investment scenarios to understand potential outcomes. Our platform allows you to model various economic conditions, occupancy rates, and property improvements to assess risk and optimize your investment strategy.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="text-xl font-bold text-[#001A41] mb-2">Comprehensive Due Diligence Checklists</h4>
                  <p className="text-[#001A41] text-opacity-80">
                    Ensure nothing is overlooked with our customizable due diligence checklists. Track progress, assign tasks to team members, and maintain a complete audit trail of your due diligence process for each property.
                  </p>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-[#001A41] mb-3 mt-8">Benefits</h3>
              <ul className="list-disc pl-6 space-y-2 text-[#001A41] text-opacity-80">
                <li>Reduce due diligence time by up to 70% with automated data extraction</li>
                <li>Minimize investment risk with thorough property assessment</li>
                <li>Identify potential issues early in the acquisition process</li>
                <li>Make more informed decisions with comprehensive property analysis</li>
                <li>Maintain consistent due diligence standards across all investments</li>
                <li>Create detailed due diligence reports for investors and stakeholders</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <Cta />
    </>
  );
} 