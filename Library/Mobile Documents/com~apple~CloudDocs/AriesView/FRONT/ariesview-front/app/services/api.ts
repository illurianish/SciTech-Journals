// Read the base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Optional: Add a check or default
// Updated check to throw an error if the environment variable is not set
if (!API_BASE_URL) {
  console.error("FATAL ERROR: NEXT_PUBLIC_BASE_URL environment variable is not set.");
  // Throw an error to prevent the application from proceeding with an invalid API URL
  throw new Error("Configuration Error: NEXT_PUBLIC_BASE_URL is not defined. Please check environment variables."); 
}

// Contact form submission function
export const submitContactForm = async (formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  // Validate required fields
  if (!formData.name || !formData.email || !formData.message) {
    throw new Error('Missing required fields: name, email, and message are required');
  }
  
  try {
    console.log('Submitting contact form with data:', formData);
    
    // Direct API call to Azure backend
    const response = await fetch(`${API_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin,
      },
      body: JSON.stringify(formData),
    });
    
    // Parse response
    const responseText = await response.text();
    
    // Check if the response is JSON before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      // If not JSON, throw an error with the response text (might be HTML error page)
      throw new Error(`Expected JSON response, but received ${contentType || 'unknown content type'}. Response body: ${responseText}`);
    }
    
    if (!responseText.trim()) {
      throw new Error('Empty JSON response from server');
    }
    
    const data = JSON.parse(responseText);
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to send message');
    }
    
    return {
      success: true,
      message: data.message || 'Message sent successfully',
      id: data.id,
      timestamp: data.timestamp
    };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};

// Job application submission with file upload support
export const submitJobApplication = async (formData: {
  fullName: string;
  email: string;
  position: string;
  technicalSkills: string;  
  phone?: string;
  linkedinProfile?: string; 
  portfolioUrl?: string;    
  relevantExperience?: string; 
  additionalInfo?: string;  
  resumeFile?: File | null;
}) => {
  // Validate required fields
  if (!formData.fullName || !formData.email || !formData.position || !formData.technicalSkills) {
    throw new Error('Missing required fields: fullName, email, position, and technicalSkills are required');
  }
  
  try {
    // Using FormData to support file uploads
    const apiFormData = new FormData();
    
    // Add all text fields to FormData
    apiFormData.append('fullName', formData.fullName);
    apiFormData.append('email', formData.email);
    apiFormData.append('position', formData.position);
    apiFormData.append('technicalSkills', formData.technicalSkills);
    
    // Add optional fields if they exist
    if (formData.phone) apiFormData.append('phone', formData.phone);
    if (formData.linkedinProfile) apiFormData.append('linkedinProfile', formData.linkedinProfile);
    if (formData.portfolioUrl) apiFormData.append('portfolioUrl', formData.portfolioUrl);
    if (formData.relevantExperience) apiFormData.append('relevantExperience', formData.relevantExperience);
    if (formData.additionalInfo) apiFormData.append('additionalInfo', formData.additionalInfo);
    
    // Add resume file if available
    if (formData.resumeFile) {
      apiFormData.append('resumeFile', formData.resumeFile);
      console.log('Uploading resume file:', formData.resumeFile.name);
    }
    
    console.log('Submitting job application with resume file:', !!formData.resumeFile);
    
    // Direct API call to Azure backend - CORRECTED ENDPOINT
    const response = await fetch(`${API_BASE_URL}/api/application/submit`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Origin': window.location.origin,
        // No Content-Type header as browser will set it with boundary for FormData
      },
      body: apiFormData,
    });
    
    // Process response
    const responseText = await response.text();
    
    // Check if the response is JSON before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      // If not JSON, throw an error with the response text (might be HTML error page)
      throw new Error(`Expected JSON response, but received ${contentType || 'unknown content type'}. Response body: ${responseText}`);
    }
    
    if (!responseText.trim()) {
      throw new Error('Empty JSON response from server');
    }
    
    const data = JSON.parse(responseText);
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to submit application');
    }
    
    return {
      success: data.success,
      message: data.message || 'Application submitted successfully',
      applicationId: data.applicationId,
      timestamp: data.timestamp
    };
  } catch (error) {
    console.error('Error submitting job application:', error);
    throw error;
  }
}; 