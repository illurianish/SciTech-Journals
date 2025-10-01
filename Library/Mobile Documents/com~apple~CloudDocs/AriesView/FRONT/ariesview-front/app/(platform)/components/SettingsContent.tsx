'use client'

import { useState } from 'react'

export default function SettingsContent() {
  const [activeTab, setActiveTab] = useState('account')
  
  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Settings</h2>
          </div>
          <nav className="p-4">
            <ul className="space-y-1">
              <li>
                <button 
                  onClick={() => setActiveTab('account')} 
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'account' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  Account
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('notifications')} 
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'notifications' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  Notifications
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('appearance')} 
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'appearance' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  Appearance
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('security')} 
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'security' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  Security
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('api')} 
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'api' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  API Access
                </button>
              </li>
            </ul>
          </nav>
        </div>
        
        <div className="flex-1 bg-white shadow rounded-lg overflow-hidden">
          {activeTab === 'account' && (
            <div>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Account Settings</h2>
                <p className="mt-1 text-sm text-gray-500">Manage your account information and preferences.</p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input 
                        id="firstName"
                        type="text" 
                        defaultValue="Michael" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input 
                        id="lastName"
                        type="text" 
                        defaultValue="Scott" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Email Address</h3>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input 
                      id="email"
                      type="email" 
                      defaultValue="michael.scott@ariesview.com" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Time Zone</h3>
                  <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                      Time Zone
                    </label>
                    <select 
                      id="timezone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      aria-label="Select time zone"
                    >
                      <option>(GMT-05:00) Eastern Time (US & Canada)</option>
                      <option>(GMT-06:00) Central Time (US & Canada)</option>
                      <option>(GMT-07:00) Mountain Time (US & Canada)</option>
                      <option>(GMT-08:00) Pacific Time (US & Canada)</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Language</h3>
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <select 
                      id="language"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      aria-label="Select language"
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'notifications' && (
            <div>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Notification Settings</h2>
                <p className="mt-1 text-sm text-gray-500">Manage how and when you want to be notified.</p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Email Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Document Analysis Completion</p>
                        <p className="text-xs text-gray-500">Receive an email when document analysis is complete</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input 
                          type="checkbox" 
                          id="document-analysis" 
                          defaultChecked 
                          className="sr-only"
                          aria-label="Toggle document analysis notifications"
                          title="Toggle document analysis notifications"
                        />
                        <label 
                          htmlFor="document-analysis"
                          className="block h-6 rounded-full cursor-pointer bg-blue-600"
                        >
                          <span className="absolute left-0 top-0 w-6 h-6 rounded-full bg-white shadow inset-y-0 left-0 transform"></span>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Benchmark Updates</p>
                        <p className="text-xs text-gray-500">Receive updates when benchmarks are modified</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input 
                          type="checkbox" 
                          id="benchmark-updates" 
                          defaultChecked 
                          className="sr-only"
                          aria-label="Toggle benchmark update notifications"
                          title="Toggle benchmark update notifications"
                        />
                        <label 
                          htmlFor="benchmark-updates"
                          className="block h-6 rounded-full cursor-pointer bg-blue-600"
                        >
                          <span className="absolute left-0 top-0 w-6 h-6 rounded-full bg-white shadow inset-y-0 left-0 transform"></span>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Property Status Changes</p>
                        <p className="text-xs text-gray-500">Receive notifications when property status changes</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input 
                          type="checkbox" 
                          id="property-status" 
                          className="sr-only"
                          aria-label="Toggle property status notifications"
                          title="Toggle property status notifications"
                        />
                        <label 
                          htmlFor="property-status"
                          className="block h-6 rounded-full cursor-pointer bg-gray-300"
                        >
                          <span className="absolute left-0 top-0 w-6 h-6 rounded-full bg-white shadow inset-y-0 left-0 transform"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Notification Frequency</h3>
                  <div>
                    <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Digest Frequency
                    </label>
                    <select 
                      id="frequency"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      aria-label="Select email digest frequency"
                    >
                      <option>Immediately</option>
                      <option>Daily Digest</option>
                      <option>Weekly Digest</option>
                      <option>Monthly Digest</option>
                    </select>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'appearance' && (
            <div>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Appearance Settings</h2>
                <p className="mt-1 text-sm text-gray-500">Customize how AriesView looks for you.</p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Theme</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="border border-gray-200 p-4 rounded-md text-center bg-white cursor-pointer ring-2 ring-blue-500">
                      <div className="w-full h-12 bg-white border border-gray-200 rounded-md mb-2"></div>
                      <span className="text-sm font-medium text-gray-900">Light</span>
                    </div>
                    <div className="border border-gray-200 p-4 rounded-md text-center cursor-pointer">
                      <div className="w-full h-12 bg-gray-900 rounded-md mb-2"></div>
                      <span className="text-sm font-medium text-gray-900">Dark</span>
                    </div>
                    <div className="border border-gray-200 p-4 rounded-md text-center cursor-pointer">
                      <div className="w-full h-12 bg-gradient-to-r from-white to-gray-900 rounded-md mb-2"></div>
                      <span className="text-sm font-medium text-gray-900">System</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Accent Color</h3>
                  <div className="grid grid-cols-6 gap-4">
                    <div className="h-8 w-8 bg-blue-600 rounded-full cursor-pointer ring-2 ring-offset-2 ring-blue-600"></div>
                    <div className="h-8 w-8 bg-purple-600 rounded-full cursor-pointer"></div>
                    <div className="h-8 w-8 bg-green-600 rounded-full cursor-pointer"></div>
                    <div className="h-8 w-8 bg-red-600 rounded-full cursor-pointer"></div>
                    <div className="h-8 w-8 bg-orange-600 rounded-full cursor-pointer"></div>
                    <div className="h-8 w-8 bg-gray-600 rounded-full cursor-pointer"></div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Font Size</h3>
                  <div>
                    <label htmlFor="font-size" className="block text-sm font-medium text-gray-700 mb-1">
                      Size
                    </label>
                    <select
                      id="font-size"
                      className="form-select w-full"
                      defaultValue="Medium"
                      aria-label="Font size selection"
                    >
                      <option value="Small">Small</option>
                      <option value="Medium">Medium</option>
                      <option value="Large">Large</option>
                      <option value="Extra Large">Extra Large</option>
                    </select>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'security' && (
            <div>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
                <p className="mt-1 text-sm text-gray-500">Manage your account security and authentication settings.</p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input 
                        id="current-password"
                        type="password" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your current password"
                      />
                    </div>
                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input 
                        id="new-password"
                        type="password" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your new password"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input 
                        id="confirm-password"
                        type="password" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Confirm your new password"
                      />
                    </div>
                    <div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Enable Two-Factor Authentication</p>
                      <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        id="two-factor" 
                        className="sr-only"
                        aria-label="Toggle two-factor authentication"
                        title="Toggle two-factor authentication"
                      />
                      <label 
                        htmlFor="two-factor"
                        className="block h-6 rounded-full cursor-pointer bg-gray-300"
                      >
                        <span className="absolute left-0 top-0 w-6 h-6 rounded-full bg-white shadow inset-y-0 left-0 transform"></span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Session Management</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Current Session</p>
                        <p className="text-xs text-gray-500">Windows 10 • Chrome • New York, USA</p>
                        <p className="text-xs text-gray-500">Started: Oct 18, 2023 10:42 AM</p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Mobile Session</p>
                        <p className="text-xs text-gray-500">iOS • Safari • New York, USA</p>
                        <p className="text-xs text-gray-500">Last active: Oct 17, 2023 3:15 PM</p>
                      </div>
                      <button className="text-sm text-red-600 hover:text-red-500">
                        Revoke
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'api' && (
            <div>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">API Access</h2>
                <p className="mt-1 text-sm text-gray-500">Manage your API keys and access to AriesView data.</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="bg-yellow-50 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">API access requires approval</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>Please contact your administrator to gain access to the API functionality. This requires special permissions.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">API Keys</h3>
                  <p className="text-sm text-gray-500 mb-4">You don't have any API keys yet. Create one to get started.</p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" disabled>
                    Generate API Key
                  </button>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Documentation</h3>
                  <div className="p-4 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-700">Learn how to integrate with AriesView using our API documentation.</p>
                    <button className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500 block">
                      View API Documentation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 