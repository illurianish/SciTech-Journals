"use client"

import React from 'react';
import Link from 'next/link';

// Define the action type
/**
 * @typedef {Object} Action
 * @property {string} label - The label for the action button
 * @property {string} href - The URL to navigate to
 * @property {boolean} [primary] - Whether this is a primary action
 * @property {React.ReactNode} [icon] - Optional icon to display
 */

/**
 * Welcome card component for the dashboard
 * @param {Object} props
 * @param {string} props.title - The card title
 * @param {string} [props.subtitle] - Optional subtitle
 * @param {string} props.description - The description text
 * @param {Action[]} [props.actions] - Array of action buttons
 */
function WelcomeCard({ title, subtitle, description, actions = [] }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex flex-col h-full">
        <div className="grow">
          <div className="flex justify-between items-start">
            <header>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{title}</h2>
              {subtitle && (
                <div className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase mb-3">{subtitle}</div>
              )}
            </header>
          </div>
          <div className="mt-2">
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
          </div>
        </div>
        {actions.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {actions.map((action, index) => (
              <Link 
                key={index} 
                href={action.href} 
                className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                  action.primary 
                    ? 'text-white bg-indigo-600 hover:bg-indigo-700' 
                    : 'text-gray-700 bg-white hover:bg-gray-50 border-gray-300'
                }`}
              >
                {action.icon && (
                  <span className="mr-2">{action.icon}</span>
                )}
                {action.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WelcomeCard; 