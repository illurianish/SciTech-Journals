"use client";

import React, { useState } from 'react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending' | 'inactive';
  lastActive: string;
  permissions: string[];
  avatar: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

const TeamManagementPage = () => {
  const [activeTab, setActiveTab] = useState<'members' | 'roles' | 'invites'>('members');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  // Sample data - in a real app, this would come from your backend
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Marco Rossi',
      email: 'marco.rossi@company.com',
      role: 'Admin',
      status: 'active',
      lastActive: '2024-03-17T10:30:00',
      permissions: ['manage_team', 'manage_properties', 'manage_leases'],
      avatar: 'https://ui-avatars.com/api/?name=Marco+Rossi&background=0D8ABC&color=fff',
    },
    {
      id: '2',
      name: 'Sofia Bianchi',
      email: 'sofia.bianchi@company.com',
      role: 'Managing Director',
      status: 'active',
      lastActive: '2024-03-17T09:15:00',
      permissions: ['manage_properties', 'view_leases'],
      avatar: 'https://ui-avatars.com/api/?name=Sofia+Bianchi&background=2E8B57&color=fff',
    },
  ]);

  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Admin',
      description: 'Full system access and management capabilities',
      permissions: ['manage_team', 'manage_properties', 'manage_leases', 'manage_settings'],
    },
    {
      id: '2',
      name: 'Managing Director',
      description: 'Manage properties and related operations',
      permissions: ['manage_properties', 'view_leases', 'manage_maintenance'],
    },
  ]);

  const handleInviteTeamMember = (email: string, role: string) => {
    // Here you would typically make an API call to send the invitation
    console.log('Inviting team member:', { email, role });
    setShowInviteModal(false);
  };

  const handleCreateRole = (name: string, description: string, permissions: string[]) => {
    // Here you would typically make an API call to create the role
    console.log('Creating role:', { name, description, permissions });
    setShowRoleModal(false);
  };

  const handleUpdateMemberStatus = (memberId: string, status: 'active' | 'inactive') => {
    setTeamMembers(members =>
      members.map(member =>
        member.id === memberId ? { ...member, status } : member
      )
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {[
            { id: 'members', label: 'Team Members' },
            { id: 'roles', label: 'Roles & Permissions' },
            { id: 'invites', label: 'Pending Invites' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'members' | 'roles' | 'invites')}
              className={`${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm`}
              aria-label={`Switch to ${tab.label} tab`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Sections */}
      <div className="p-6">
        {/* Team Members Section */}
        {activeTab === 'members' && (
          <div className="space-y-4">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowInviteModal(true)}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                aria-label="Invite team member"
              >
                Invite Member
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Active
                    </th>
                    <th scope="col" className="relative px-4 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teamMembers.map((member) => (
                    <tr key={member.id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <img className="h-8 w-8 rounded-full" src={member.avatar} alt="" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{member.name}</div>
                            <div className="text-sm text-gray-500">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {member.role}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          member.status === 'active' ? 'bg-green-100 text-green-800' :
                          member.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {new Date(member.lastActive).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleUpdateMemberStatus(member.id, member.status === 'active' ? 'inactive' : 'active')}
                          className="text-blue-600 hover:text-blue-900"
                          aria-label={`${member.status === 'active' ? 'Deactivate' : 'Activate'} ${member.name}'s account`}
                        >
                          {member.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Roles Section */}
        {activeTab === 'roles' && (
          <div className="space-y-4">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowRoleModal(true)}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                aria-label="Create new role"
              >
                Create Role
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {roles.map((role) => (
                <div key={role.id} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900">{role.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{role.description}</p>
                  <div className="mt-3">
                    <h4 className="text-xs font-medium text-gray-900">Permissions</h4>
                    <ul className="mt-2 space-y-1">
                      {role.permissions.map((permission) => (
                        <li key={permission} className="text-xs text-gray-500">
                          • {permission.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4">
                    <button
                      className="text-sm text-blue-600 hover:text-blue-900"
                      aria-label={`Edit ${role.name} role`}
                    >
                      Edit Role
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Invites Section */}
        {activeTab === 'invites' && (
          <div className="space-y-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    No pending invites at this time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Invite Team Member</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="colleague@company.com"
                  aria-label="Email address input"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  aria-label="Select role"
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                  aria-label="Cancel invitation"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleInviteTeamMember('test@example.com', 'admin')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                  aria-label="Send invitation"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Role</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="roleName" className="block text-sm font-medium text-gray-700">
                  Role Name
                </label>
                <input
                  type="text"
                  id="roleName"
                  name="roleName"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., Property Manager"
                  aria-label="Role name input"
                />
              </div>
              <div>
                <label htmlFor="roleDescription" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="roleDescription"
                  name="roleDescription"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Describe the role's responsibilities"
                  aria-label="Role description input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions
                </label>
                <div className="space-y-2">
                  {[
                    'manage_team',
                    'manage_properties',
                    'manage_leases',
                    'view_reports',
                    'manage_settings',
                  ].map((permission) => (
                    <div key={permission} className="flex items-center">
                      <input
                        type="checkbox"
                        id={permission}
                        name={permission}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        aria-label={`Permission for ${permission.split('_').join(' ')}`}
                      />
                      <label htmlFor={permission} className="ml-3 text-sm text-gray-700">
                        {permission.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                  aria-label="Cancel role creation"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleCreateRole('New Role', 'Description', [])}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                  aria-label="Create new role"
                >
                  Create Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagementPage; 