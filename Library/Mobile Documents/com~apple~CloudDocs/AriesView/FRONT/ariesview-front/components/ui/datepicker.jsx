"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"

export function DatePicker({ date, setDate }) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
  
  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen)
  }

  return (
    <div className="relative">
      <div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
        <span className="flex-grow">
          {date ? format(date, "PPP") : "Pick a date"}
        </span>
        <button 
          type="button" 
          onClick={toggleCalendar}
          className="ml-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
        </button>
      </div>
      {isCalendarOpen && (
        <div className="absolute top-full left-0 z-50 mt-2 bg-white dark:bg-gray-900 rounded-md shadow-lg">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate)
              setIsCalendarOpen(false)
            }}
            initialFocus
          />
        </div>
      )}
    </div>
  )
} 