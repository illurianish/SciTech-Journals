'use client';

import React, { useState, useRef } from 'react';
import { submitContactForm } from '../services/api';

const ContactForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null as string | null
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Validate all fields and return whether the form is valid
  const validateForm = () => {
    let isValid = true;
    const errors = { name: '', email: '', message: '' };
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }
    
    // Message validation
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Stop default form submission behavior
    
    // Reset any previous submission state
    setStatus({ submitting: false, success: false, error: null });
    
    // Validate form first
    if (!validateForm()) {
      console.log('Form validation failed on button click', formErrors);
      // Scroll to the first error
      const firstErrorField = document.querySelector('.border-red-500');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return; // Stop here if validation fails
    }
    
    // If validation passes, manually trigger form submission
    if (formRef.current) {
      handleSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Double-check validation as an extra safety measure
    if (!validateForm()) {
      console.log('Form validation failed on submission', formErrors);
      return;
    }
    
    console.log('Starting contact form submission...');
    setStatus({ submitting: true, success: false, error: null });
    
    try {
      // Use the service function for API call
      const result = await submitContactForm({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });
      
      console.log('Contact form submission result:', result);
      
      // Success handling
      setStatus({
        submitting: false,
        success: true,
        error: null
      });
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setStatus({
        submitting: false,
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred when sending your message. Please try again.'
      });
    }
  };
  
  return (
    <>
      {/* General error message at the top when validation fails */}
      {(formErrors.name || formErrors.email || formErrors.message) && (
        <div className="p-4 mb-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p className="font-bold">Please fix the following errors:</p>
          <ul className="list-disc ml-5">
            {formErrors.name && <li>{formErrors.name}</li>}
            {formErrors.email && <li>{formErrors.email}</li>}
            {formErrors.message && <li>{formErrors.message}</li>}
          </ul>
        </div>
      )}
    
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Your name"
            required
          />
          {formErrors.name && (
            <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
            placeholder="your@email.com"
            required
          />
          {formErrors.email && (
            <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="How can we help?"
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className={`w-full px-4 py-2 border ${formErrors.message ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Your message..."
            required
          ></textarea>
          {formErrors.message && (
            <p className="mt-1 text-sm text-red-600">{formErrors.message}</p>
          )}
        </div>
        
        <button
          onClick={handleButtonClick}
          type="button" // Change to button to prevent default form submission
          disabled={status.submitting}
          className="w-full px-6 py-3 bg-[#001233] text-white font-semibold rounded-lg hover:bg-[#001845] transition-colors disabled:opacity-70"
        >
          {status.submitting ? 'Sending...' : 'Send Message'}
        </button>
        
        {status.success && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-center">
            <h3 className="font-bold text-lg mb-2">Message Sent!</h3>
            <p>Thank you for your message. We will get back to you soon.</p>
          </div>
        )}
        
        {status.error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            {status.error}
          </div>
        )}
        
        <div className="text-xs text-gray-500 mt-2">
          * Required fields
        </div>
      </form>
    </>
  );
};

export default ContactForm; 