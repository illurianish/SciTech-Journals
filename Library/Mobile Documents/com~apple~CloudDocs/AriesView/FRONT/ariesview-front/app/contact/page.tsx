export const metadata = {
  title: "Contact Us - AriesView",
  description: "Get in touch with AriesView for enterprise real estate solutions and support",
};

import Link from "next/link";
import Image from "next/image";
import ContactForm from "./ContactForm";

export default function ContactPage() {
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
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-600 max-w-4xl mx-auto">
              Get in touch with our team to learn more about how AriesView can transform your real estate operations
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information and Form Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="bg-[#001A41] rounded-lg p-8 text-white">
                <h2 className="text-3xl font-bold mb-8">Contact Information</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Headquarters</h3>
                    <p className="text-white/90">472 West Broadway</p>
                    <p className="text-white/90">Boston, MA 02127</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Office Hours</h3>
                    <p className="text-white/90">Monday - Friday: 9:00 AM - 5:00 PM EST</p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold mb-8 text-[#001233]">Send us a Message</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 