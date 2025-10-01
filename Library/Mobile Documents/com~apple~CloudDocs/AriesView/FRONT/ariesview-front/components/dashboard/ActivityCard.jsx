"use client"

import React from 'react';

function ActivityCard({ title, activities }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
      </header>
      <div className="p-3">
        {/* Activity list */}
        <div className="overflow-x-auto">
          <ul className="my-1">
            {activities.map((activity, index) => (
              <li key={index} className="flex px-2">
                <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 my-2 mr-3">
                  {activity.icon}
                </div>
                <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 py-2">
                  <div className="grow flex justify-between">
                    <div className="self-center">
                      <div className="font-medium text-gray-800 dark:text-gray-100 mb-0.5">{activity.title}</div>
                      {activity.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">{activity.description}</div>
                      )}
                    </div>
                    <div className="shrink-0 self-start ml-2">
                      <span className="font-medium text-gray-400 dark:text-gray-500">{activity.time}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ActivityCard; 