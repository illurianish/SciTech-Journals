'use client';

import { useState, useEffect, FormEvent, Suspense } from 'react';
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from 'next/navigation';
import { submitJobApplication } from '../../services/api';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  linkedIn: string;
  portfolio: string;
  skills: string;
  experience: string;
  message: string;
  resumeFile?: File | null;
}

// Component that uses useSearchParams
function ApplyPageContent() {
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    position: 'General Application',
    linkedIn: '',
    portfolio: '',
    skills: '',
    experience: '',
    message: '',
    resumeFile: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Set the position from URL parameter if available
  useEffect(() => {
    const positionParam = searchParams.get('position');
    if (positionParam) {
      setFormData(prev => ({
        ...prev,
        position: positionParam
      }));
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, resumeFile: e.target.files[0] });
      console.log('Resume file selected:', e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.skills) {
      setSubmitError('Name, email, and technical skills are required.');
      setIsSubmitting(false);
      return;
    }
    // Also check for resume file on frontend before sending
    if (!formData.resumeFile) {
        setSubmitError('Resume file is required. Please select a file.');
        setIsSubmitting(false);
        return;
    }

    try {
      // Map form fields to exactly match backend expected field names
      const apiData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || '',
        position: formData.position,
        linkedinProfile: formData.linkedIn || '', 
        portfolioUrl: formData.portfolio || '',   
        technicalSkills: formData.skills, // Note: Backend expects 'name', 'email', 'position' for validation, not skills
        relevantExperience: formData.experience || '', 
        additionalInfo: formData.message || '',
        resumeFile: formData.resumeFile
      };
      
      console.log('>>> Frontend: Submitting apiData:', apiData);
      console.log('>>> Frontend: Resume file selected:', apiData.resumeFile?.name, apiData.resumeFile?.size);
      
      // Use imported service to submit application
      try {
        const result = await submitJobApplication(apiData);
        console.log('Application submitted successfully!', result);
        
        if (result.success) {
          // Show success message with application ID
          setSubmitSuccess(true);
          
          // Reset form after successful submission
          setFormData({
            fullName: '',
            email: '',
            phone: '',
            position: 'General Application',
            linkedIn: '',
            portfolio: '',
            skills: '',
            experience: '',
            message: '',
            resumeFile: null
          });
        } else {
          setSubmitError('Failed to submit application. Please try again.');
        }
      } catch (error) {
        console.error('Error submitting application:', error);
        setSubmitError(error instanceof Error ? error.message : 'Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError('There was an error submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
          </div>
          
          {/* Main content */}
          <div className="max-w-2xl mx-auto">
            {submitSuccess ? (
              <div className="bg-green-50 border border-green-200 p-8 rounded-lg text-center">
                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <h2 className="text-2xl font-bold text-green-800 mb-4">Application Submitted!</h2>
                <p className="text-green-700 mb-6">Thank you for your interest in joining AriesView. We have received your application and will review it shortly.</p>
                <Link href="/careers" className="btn bg-[#001A41] hover:bg-opacity-70 text-white px-6 py-2 rounded">
                  Return to Careers
                </Link>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-700 mb-6">
                      {submitError}
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-[#001A41]">Personal Information</h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fullName">
                        Full Name *
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="form-input w-full py-2 px-3 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                        Email Address *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-input w-full py-2 px-3 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="form-input w-full py-2 px-3 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-[#001A41]">Professional Information</h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="position">
                        Position *
                      </label>
                      <select
                        id="position"
                        name="position"
                        required
                        value={formData.position}
                        onChange={handleInputChange}
                        className="form-select w-full py-2 px-3 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
                      >
                        <option value="General Application">General Application</option>
                        <option value="Frontend Engineer">Frontend Engineer</option>
                        <option value="Backend Engineer">Backend Engineer</option>
                        <option value="AI/ML Engineer">AI/ML Engineer</option>
                        <option value="Product Manager">Product Manager</option>
                        <option value="UI/UX Designer">UI/UX Designer</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="linkedIn">
                        LinkedIn Profile
                      </label>
                      <input
                        id="linkedIn"
                        name="linkedIn"
                        type="url"
                        placeholder="https://linkedin.com/in/yourprofile"
                        value={formData.linkedIn}
                        onChange={handleInputChange}
                        className="form-input w-full py-2 px-3 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="portfolio">
                        Portfolio/GitHub URL
                      </label>
                      <input
                        id="portfolio"
                        name="portfolio"
                        type="url"
                        placeholder="https://github.com/yourusername"
                        value={formData.portfolio}
                        onChange={handleInputChange}
                        className="form-input w-full py-2 px-3 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="resumeFile">
                        Resume/CV
                      </label>
                      <div className="mt-1">
                        <input
                          id="resumeFile"
                          name="resumeFile"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Accepted formats: PDF, DOC, DOCX (Max 5MB)
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-[#001A41]">Technical Skills & Experience</h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="skills">
                        Technical Skills *
                      </label>
                      <textarea
                        id="skills"
                        name="skills"
                        required
                        value={formData.skills}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="List your relevant skills, technologies, and expertise"
                        className="form-textarea w-full py-2 px-3 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="experience">
                        Relevant Experience
                      </label>
                      <textarea
                        id="experience"
                        name="experience"
                        rows={4}
                        value={formData.experience}
                        onChange={handleInputChange}
                        placeholder="Briefly describe your most relevant experience"
                        className="form-textarea w-full py-2 px-3 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="message">
                        Additional Information
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Include any additional information you'd like us to know"
                        className="form-textarea w-full py-2 px-3 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn w-full py-3 bg-[#001A41] text-white rounded hover:bg-opacity-70 transition duration-200 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-500 text-center mt-4">
                    By submitting this application, you agree to our <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link> and <Link href="/terms-of-service" className="text-blue-600 hover:underline">Terms of Service</Link>.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Main component with Suspense boundary
export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading application form...</div>}>
      <ApplyPageContent />
    </Suspense>
  );
} 