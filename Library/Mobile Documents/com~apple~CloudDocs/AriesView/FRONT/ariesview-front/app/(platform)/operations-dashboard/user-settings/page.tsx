"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber: string;
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  twoFactorEnabled: boolean;
}

const UserSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { user } = useAuth();

  // Parse display name into first and last name
  const getNames = () => {
    if (user?.displayName) {
      const nameParts = user.displayName.split(' ');
      if (nameParts.length >= 2) {
        return {
          firstName: nameParts[0],
          lastName: nameParts.slice(1).join(' ')
        };
      }
      return { firstName: user.displayName, lastName: '' };
    }
    return { firstName: '', lastName: '' };
  };

  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    role: 'User',
    phoneNumber: '',
    language: 'English',
    timezone: 'UTC+1 Rome',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    twoFactorEnabled: true,
  });

  // Update profile with Firebase user data when it becomes available
  useEffect(() => {
    if (user) {
      const { firstName, lastName } = getNames();
      setProfile(prevProfile => ({
        ...prevProfile,
        firstName,
        lastName,
        email: user.email || '',
        phoneNumber: user.phoneNumber || '+1 (555) 123-4567'
      }));
    }
  }, [user]);

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Here you would typically save to backend
    console.log('Saving profile:', profile);
  };

  const handleNotificationChange = (type: keyof typeof profile.notifications) => {
    setProfile(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type],
      },
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {['profile', 'security', 'preferences', 'notifications'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm capitalize`}
              aria-label={`Switch to ${tab} settings`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Sections */}
      <div className="p-6">
        {/* Profile Section */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="bg-blue-500 h-16 w-16 rounded-full flex items-center justify-center mr-4 text-white text-xl">
                  <span>{user?.displayName ? `${user.displayName.split(' ')[0]?.[0] || ''}${user.displayName.split(' ')[1]?.[0] || ''}` : 'U'}</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{user?.displayName || 'User Profile'}</h2>
                  <p className="text-sm text-gray-500">{user?.email || 'No email available'}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                aria-label={isEditing ? "Cancel editing profile" : "Edit profile"}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  disabled={!isEditing}
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                  aria-label="First name input"
                  placeholder={user?.displayName ? getNames().firstName : "First Name"}
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  disabled={!isEditing}
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                  aria-label="Last name input"
                  placeholder={user?.displayName ? getNames().lastName : "Last Name"}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  disabled={!isEditing}
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                  aria-label="Email input"
                  placeholder={user?.email || "Email"}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  disabled={!isEditing}
                  value={profile.phoneNumber}
                  onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                  aria-label="Phone number input"
                  placeholder={user?.phoneNumber || "Phone Number"}
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  aria-label="Save profile changes"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        )}

        {/* Security Section */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500">Add an extra layer of security</p>
                </div>
                <button
                  onClick={() => setProfile({ ...profile, twoFactorEnabled: !profile.twoFactorEnabled })}
                  className={`${
                    profile.twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  aria-label="Toggle two-factor authentication"
                >
                  <span
                    className={`${
                      profile.twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Change Password</h3>
                  <p className="text-sm text-gray-500">Update your password</p>
                </div>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                  aria-label="Change password"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preferences Section */}
        {activeTab === 'preferences' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
                <select
                  id="language"
                  value={profile.language}
                  onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  aria-label="Select language"
                >
                  <option>English</option>
                  <option>Italian</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>

              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">Timezone</label>
                <select
                  id="timezone"
                  value={profile.timezone}
                  onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  aria-label="Select timezone"
                >
                  <option>UTC+1 Rome</option>
                  <option>UTC+0 London</option>
                  <option>UTC-5 New York</option>
                  <option>UTC-8 Los Angeles</option>
                  <option>UTC+8 Singapore</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Section */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Notification Channels</h3>
              <div className="space-y-4">
                {Object.entries(profile.notifications).map(([type, enabled]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        {type.charAt(0).toUpperCase() + type.slice(1)} Notifications
                      </span>
                    </div>
                    <button
                      onClick={() => handleNotificationChange(type as keyof typeof profile.notifications)}
                      className={`${
                        enabled ? 'bg-blue-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                      aria-label={`Toggle ${type} notifications`}
                    >
                      <span
                        className={`${
                          enabled ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  aria-label="Current password input"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  aria-label="New password input"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  aria-label="Confirm new password input"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                  aria-label="Cancel password change"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle password change
                    setShowPasswordModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                  aria-label="Confirm password change"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSettingsPage; 