'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ProfileContent() {
  const [isEditing, setIsEditing] = useState(false)
  
  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 sm:p-8 bg-blue-700 text-white">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="h-32 w-32 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold">
              MS
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-bold">Michael Scott</h2>
              <p className="text-blue-100">Managing Director</p>
              <p className="text-blue-100 mt-2">Member since October 2022</p>
              <div className="mt-4">
                <button 
                  onClick={() => setIsEditing(!isEditing)} 
                  className="px-4 py-2 bg-white text-blue-700 rounded-md font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 sm:p-8 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
          
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input 
                    id="firstName"
                    type="text" 
                    defaultValue="Michael" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input 
                    id="lastName"
                    type="text" 
                    defaultValue="Scott" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  id="email"
                  type="email" 
                  defaultValue="michael.scott@ariesview.com" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input 
                  id="jobTitle"
                  type="text" 
                  defaultValue="Managing Director" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter job title"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  id="phoneNumber"
                  type="tel" 
                  defaultValue="(555) 123-4567" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">First Name</p>
                  <p className="mt-1 text-sm text-gray-900">Michael</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Name</p>
                  <p className="mt-1 text-sm text-gray-900">Scott</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="mt-1 text-sm text-gray-900">michael.scott@ariesview.com</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Job Title</p>
                <p className="mt-1 text-sm text-gray-900">Managing Director</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="mt-1 text-sm text-gray-900">(555) 123-4567</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6 sm:p-8 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Created Benchmark: East Coast Market Rents</p>
                <p className="text-sm text-gray-500">2 days ago</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-md flex items-center justify-center text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Analyzed Document: Highland Towers Lease</p>
                <p className="text-sm text-gray-500">4 days ago</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-md flex items-center justify-center text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Added Property: Sunset Plaza</p>
                <p className="text-sm text-gray-500">1 week ago</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 sm:p-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <h4 className="text-sm font-medium text-gray-900">Recent Documents</h4>
              <button className="mt-2 text-sm text-blue-600 hover:text-blue-500 block">
                View All Documents
              </button>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <h4 className="text-sm font-medium text-gray-900">Your Benchmarks</h4>
              <button className="mt-2 text-sm text-blue-600 hover:text-blue-500 block">
                View All Benchmarks
              </button>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <h4 className="text-sm font-medium text-gray-900">Properties</h4>
              <button className="mt-2 text-sm text-blue-600 hover:text-blue-500 block">
                View All Properties
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 