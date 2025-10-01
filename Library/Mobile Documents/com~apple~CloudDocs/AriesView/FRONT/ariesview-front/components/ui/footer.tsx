"use client";
import Link from "next/link";
import Logo from "./logo";

export default function Footer({ border = false }: { border?: boolean }) {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-12 pb-8 md:pt-16 md:pb-12 border-t border-gray-200">
          {/* 1st block - About/Logo */}
          <div className="md:col-span-4 lg:col-span-5">
            <div className="mb-4">
              <Logo />
            </div>
            {/* Social links */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">Follow us</h4>
              <ul className="flex space-x-4">
                <li>
                  <Link
                    className="flex items-center justify-center text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-full p-2 transition duration-150 ease-in-out"
                    href="https://x.com/AriesView"
                    aria-label="Twitter"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      className="h-5 w-5 fill-current"
                      viewBox="0 0 32 32"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m13.063 9 3.495 4.475L20.601 9h2.454l-5.359 5.931L24 23h-4.938l-3.866-4.893L10.771 23H8.316l5.735-6.342L8 9h5.063Zm-.74 1.347h-1.457l8.875 11.232h1.36l-8.778-11.232Z"></path>
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link
                    className="flex items-center justify-center text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-full p-2 transition duration-150 ease-in-out"
                    href="https://www.linkedin.com/company/ariesview"
                    aria-label="LinkedIn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      className="h-5 w-5 fill-current"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-8 lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Products column */}
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-4">Products</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                    href="/products/ariesview-ai"
                  >
                    AriesView AI
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                    href="/products/document-management"
                  >
                    Document Management Hub
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                    href="/products/financial-analysis"
                  >
                    Financial Analysis Hub
                  </Link>
                </li>
              </ul>
            </div>

            {/* Solutions column */}
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-4">Solutions</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                    href="/solutions/acquisition-screening"
                  >
                    Acquisition Screening
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                    href="/solutions/due-diligence"
                  >
                    Due Diligence
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                    href="/solutions/asset-management"
                  >
                    Asset Management
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company column */}
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                    href="/about"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                    href="/customer-success"
                  >
                    Customer Success
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                    href="/careers"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                    href="/contact"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom footer - copyright and legal */}
        <div className="py-4 border-t border-gray-200 md:flex md:items-center md:justify-between">
          <div className="text-sm text-gray-600 mr-4">
            &copy; {new Date().getFullYear()} AriesView. All rights reserved.
          </div>
          <div className="flex flex-wrap space-x-4 text-sm pt-3 md:pt-0">
            <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
