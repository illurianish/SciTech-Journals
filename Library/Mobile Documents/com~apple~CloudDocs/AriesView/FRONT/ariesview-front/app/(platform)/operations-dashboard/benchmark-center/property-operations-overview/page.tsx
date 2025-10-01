'use client'

import { useState, useEffect } from 'react'
import Sidebar from '../../../components/Sidebar'
import { useRouter } from 'next/navigation'

// Server-friendly skeleton component
function PropertyDashboardSkeleton() {
  return (
    <div className="h-screen w-full bg-gray-100 flex items-center justify-center">
      <div className="text-gray-600">
        <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="ml-2">Loading dashboard...</span>
      </div>
    </div>
  )
}

// Bar Chart Component
function BarChart({ data, title }) {
  const maxValue = Math.max(...data.map(item => item.value))
  const barHeight = 260 // Chart height
  const barWidth = 45 // Width of each bar
  const barSpacing = 15 // Spacing between bars
  const chartWidth = data.length * (barWidth + barSpacing)
  
  return (
    <div className="h-80">
      <h3 className="text-lg font-medium text-gray-700 mb-4">{title}</h3>
      <div className="relative h-full">
        <svg 
          width={chartWidth} 
          height={barHeight}
          className="mx-auto"
        >
          {data.map((item, index) => {
            const height = (item.value / maxValue) * barHeight * 0.9
            return (
              <g key={item.label} transform={`translate(${index * (barWidth + barSpacing)}, 0)`}>
                <rect
                  y={barHeight - height}
                  width={barWidth}
                  height={height}
                  rx={4}
                  fill={item.color}
                  className="transition-all duration-500 ease-in-out hover:opacity-75"
                />
                <text
                  x={barWidth / 2}
                  y={barHeight - height - 10}
                  textAnchor="middle"
                  fill="#4B5563"
                  className="text-xs font-medium"
                >
                  {item.value}
                </text>
                <text
                  x={barWidth / 2}
                  y={barHeight + 15}
                  textAnchor="middle"
                  fill="#4B5563"
                  className="text-xs"
                >
                  {item.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

// Donut Chart Component
function DonutChart({ data, title }) {
  const total = data.reduce((acc, curr) => acc + curr.value, 0)
  const radius = 100
  const strokeWidth = 50
  
  let startAngle = 0
  
  // Calculate segments
  const segments = data.map((item) => {
    const percentage = (item.value / total)
    const angle = percentage * 360
    const endAngle = startAngle + angle
    
    const x1 = radius + radius * Math.sin((startAngle * Math.PI) / 180)
    const y1 = radius - radius * Math.cos((startAngle * Math.PI) / 180)
    const x2 = radius + radius * Math.sin((endAngle * Math.PI) / 180)
    const y2 = radius - radius * Math.cos((endAngle * Math.PI) / 180)
    
    // Determine if the angle is greater than 180 degrees
    const largeArcFlag = angle > 180 ? 1 : 0
    
    const pathData = [
      `M ${radius} ${radius}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ')
    
    const result = { ...item, pathData, percentage, startAngle, endAngle }
    startAngle = endAngle
    return result
  })
  
  return (
    <div className="h-80">
      <h3 className="text-lg font-medium text-gray-700 mb-4">{title}</h3>
      <div className="flex flex-col items-center justify-center h-full">
        <svg 
          width={radius * 2} 
          height={radius * 2}
          viewBox={`0 0 ${radius * 2} ${radius * 2}`}
          className="mb-4"
        >
          {segments.map((segment, i) => (
            <path
              key={segment.label}
              d={segment.pathData}
              fill={segment.color}
              className="transition-all duration-300 ease-in-out hover:opacity-80"
              stroke="#fff"
              strokeWidth="1"
            />
          ))}
          <circle
            cx={radius}
            cy={radius}
            r={radius - strokeWidth}
            fill="white"
          />
        </svg>
        <div className="flex flex-wrap justify-center gap-4">
          {segments.map((segment) => (
            <div key={segment.label} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: segment.color }}
              ></div>
              <span className="text-sm text-gray-700">
                {segment.label} ({segment.percentage.toLocaleString(undefined, {style: 'percent', minimumFractionDigits: 1})}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Horizontal Bar Chart Component
function HorizontalBarChart({ data, title }) {
  const maxValue = Math.max(...data.map(item => item.value))
  const barHeight = 30
  const barSpacing = 15
  const chartHeight = data.length * (barHeight + barSpacing)
  
  return (
    <div className="h-80">
      <h3 className="text-lg font-medium text-gray-700 mb-4">{title}</h3>
      <div className="h-full flex items-center justify-center">
        <svg 
          width="100%" 
          height={chartHeight}
          viewBox={`0 0 400 ${chartHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {data.map((item, index) => {
            const width = (item.value / maxValue) * 300
            const y = index * (barHeight + barSpacing)
            return (
              <g key={item.label} transform={`translate(0, ${y})`}>
                <text
                  x="0"
                  y={barHeight / 2 + 5}
                  fill="#4B5563"
                  className="text-xs font-medium"
                >
                  {item.label}
                </text>
                <rect
                  x="100"
                  y="0"
                  width={width}
                  height={barHeight}
                  rx={4}
                  fill={item.color}
                  className="transition-all duration-500 ease-in-out hover:opacity-75"
                />
                <text
                  x={width + 110}
                  y={barHeight / 2 + 5}
                  fill="#4B5563"
                  className="text-xs font-medium"
                >
                  {item.value.toLocaleString()}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

// Line Chart Component
function LineChart({ data, title }) {
  const maxValue = Math.max(...data.map(point => point.value))
  const chartWidth = 400
  const chartHeight = 200
  const padding = 30
  
  // Create points for the path
  const points = data.map((point, i) => {
    const x = padding + (i / (data.length - 1)) * (chartWidth - padding * 2)
    const y = chartHeight - padding - (point.value / maxValue) * (chartHeight - padding * 2)
    return { x, y, ...point }
  })
  
  // Create the path string
  const pathData = points.map((point, i) => 
    `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ')
  
  return (
    <div className="h-80">
      <h3 className="text-lg font-medium text-gray-700 mb-4">{title}</h3>
      <div className="h-full flex items-center justify-center">
        <svg 
          width="100%" 
          height={chartHeight}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* X and Y axis */}
          <line 
            x1={padding} 
            y1={chartHeight - padding} 
            x2={chartWidth - padding} 
            y2={chartHeight - padding} 
            stroke="#9CA3AF" 
            strokeWidth="1" 
          />
          <line 
            x1={padding} 
            y1={padding} 
            x2={padding} 
            y2={chartHeight - padding} 
            stroke="#9CA3AF" 
            strokeWidth="1" 
          />
          
          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
            className="transition-all duration-500 ease-in-out"
          />
          
          {/* Data points */}
          {points.map((point, i) => (
            <g key={i}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#10B981"
                className="transition-all duration-300 ease-in-out hover:r-6"
              />
              <text
                x={point.x}
                y={chartHeight - padding + 15}
                textAnchor="middle"
                fill="#4B5563"
                className="text-xs"
              >
                {point.label}
              </text>
            </g>
          ))}
          
          {/* Y-axis labels */}
          <text
            x={padding - 10}
            y={padding}
            textAnchor="end"
            fill="#4B5563"
            className="text-xs"
          >
            {maxValue}
          </text>
          <text
            x={padding - 10}
            y={chartHeight - padding}
            textAnchor="end"
            fill="#4B5563"
            className="text-xs"
          >
            0
          </text>
        </svg>
      </div>
    </div>
  )
}

// Client-only component with all interactivity
function PropertyDashboardClient() {
  const router = useRouter()
  const [showSidebar, setShowSidebar] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h')
  const [selectedPropertyType, setSelectedPropertyType] = useState('all')
  const [activeTab, setActiveTab] = useState('overview')

  // Chart data
  const maintenanceTypeData = [
    { label: 'Plumbing', value: 42, color: '#3B82F6' },
    { label: 'Electrical', value: 28, color: '#F59E0B' },
    { label: 'HVAC', value: 35, color: '#8B5CF6' },
    { label: 'Structural', value: 15, color: '#EC4899' }
  ]

  const occupancyTrendData = [
    { label: 'Jan', value: 88 },
    { label: 'Feb', value: 92 },
    { label: 'Mar', value: 89 },
    { label: 'Apr', value: 91 },
    { label: 'May', value: 94 },
    { label: 'Jun', value: 96 },
    { label: 'Jul', value: 95 }
  ]

  const propertyTypeData = [
    { label: 'Commercial', value: 14, color: '#10B981' },
    { label: 'Residential', value: 28, color: '#3B82F6' },
    { label: 'Mixed-Use', value: 8, color: '#F59E0B' }
  ]

  const rentCollectionData = [
    { label: 'On-Time', value: 75, color: '#10B981' },
    { label: '1-15 Days Late', value: 15, color: '#F59E0B' },
    { label: '15+ Days Late', value: 7, color: '#EF4444' },
    { label: 'Unpaid', value: 3, color: '#6B7280' }
  ]
  
  // Maintenance requests data for the table
  const maintenanceData = [
    {
      id: 'M12345',
      type: 'Plumbing',
      property: 'River Street Plaza',
      reportedBy: 'Tenant #103',
      date: 'Jul 14, 2023 (2h ago)',
      status: 'In Progress'
    },
    {
      id: 'M12342',
      type: 'Electrical',
      property: 'Hooksett Retail Center',
      reportedBy: 'Tenant #B12',
      date: 'Jul 14, 2023 (5h ago)',
      status: 'Open'
    },
    {
      id: 'M12339',
      type: 'HVAC',
      property: 'Main Street Complex',
      reportedBy: 'Managing Director',
      date: 'Jul 13, 2023 (Yesterday)',
      status: 'Completed'
    },
    {
      id: 'M12336',
      type: 'Plumbing',
      property: 'Oakwood Plaza',
      reportedBy: 'Tenant #207',
      date: 'Jul 13, 2023 (Yesterday)',
      status: 'In Progress'
    },
    {
      id: 'M12332',
      type: 'Structural',
      property: 'River Street Plaza',
      reportedBy: 'Maintenance Staff',
      date: 'Jul 12, 2023 (2 days ago)',
      status: 'Scheduled'
    }
  ]

  const handleProfileClick = () => {
    router.push('/operations-dashboard?view=profile')
  }

  const handleSettingsClick = () => {
    router.push('/operations-dashboard?view=settings')
  }

  const handleDashboardClick = () => {
    router.push('/operations-dashboard')
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {showSidebar && (
        <Sidebar
          currentPath="/operations-dashboard/benchmark-center/property-operations-overview"
          onProfileClick={handleProfileClick}
          onSettingsClick={handleSettingsClick}
          onDashboardClick={handleDashboardClick}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {/* Enhanced Header with breadcrumbs and actions */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-4 py-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    aria-label="Toggle sidebar"
                    suppressHydrationWarning
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                  <div>
                    <div className="flex items-center text-xs text-gray-500 mb-0.5">
                      <a href="/operations-dashboard" className="hover:text-blue-600 transition-colors">Dashboard</a>
                      <svg className="h-3 w-3 mx-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <a href="/operations-dashboard/benchmark-center" className="hover:text-blue-600 transition-colors">Benchmark Center</a>
                      <svg className="h-3 w-3 mx-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Property Operations Overview</span>
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">Property Operations Overview</h1>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex bg-gray-100 p-0.5 rounded-lg">
                    <select
                      value={selectedTimeframe}
                      onChange={(e) => setSelectedTimeframe(e.target.value)}
                      className="bg-transparent px-2 py-1 border-0 focus:ring-0 text-xs font-medium"
                      aria-label="Select time frame"
                      suppressHydrationWarning
                    >
                      <option value="1d">Today</option>
                      <option value="7d">Last 7 Days</option>
                      <option value="30d">Last 30 Days</option>
                      <option value="90d">Last Quarter</option>
                      <option value="365d">Last Year</option>
                    </select>
                    <div className="border-l border-gray-300 mx-0.5"></div>
                    <select
                      value={selectedPropertyType}
                      onChange={(e) => setSelectedPropertyType(e.target.value)}
                      className="bg-transparent px-2 py-1 border-0 focus:ring-0 text-xs font-medium"
                      aria-label="Select property type"
                      suppressHydrationWarning
                    >
                      <option value="all">All Properties</option>
                      <option value="commercial">Commercial</option>
                      <option value="residential">Residential</option>
                      <option value="mixed">Mixed-Use</option>
                    </select>
                  </div>
                  <button 
                    className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-xs font-medium text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    suppressHydrationWarning
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export Report
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="py-4 px-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Occupancy Rate</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">95.2%</h3>
                  </div>
                  <div className="bg-blue-100 rounded-md p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-green-600 text-xs font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    +2.3%
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Rent Collection</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">92.5%</h3>
                  </div>
                  <div className="bg-green-100 rounded-md p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-green-600 text-xs font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    +1.8%
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Maintenance Tasks</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">24 Open</h3>
                  </div>
                  <div className="bg-yellow-100 rounded-md p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-red-600 text-xs font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    +5
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Net Operating Income</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">$412K</h3>
                  </div>
                  <div className="bg-purple-100 rounded-md p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-green-600 text-xs font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    +8.7%
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`${
                      activeTab === 'overview'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                    suppressHydrationWarning
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('maintenance')}
                    className={`${
                      activeTab === 'maintenance'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                    suppressHydrationWarning
                  >
                    Maintenance
                  </button>
                  <button
                    onClick={() => setActiveTab('financials')}
                    className={`${
                      activeTab === 'financials'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                    suppressHydrationWarning
                  >
                    Financials
                  </button>
                  <button
                    onClick={() => setActiveTab('leasing')}
                    className={`${
                      activeTab === 'leasing'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                    suppressHydrationWarning
                  >
                    Leasing
                  </button>
                </nav>
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeTab === 'overview' && (
                <>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <DonutChart data={propertyTypeData} title="Portfolio by Property Type" />
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <LineChart data={occupancyTrendData} title="Occupancy Rate Trend" />
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <BarChart data={maintenanceTypeData} title="Maintenance Requests by Type" />
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <DonutChart data={rentCollectionData} title="Rent Collection Status" />
                  </div>
                </>
              )}
              
              {activeTab === 'maintenance' && (
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Maintenance Requests</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                          </th>
                          <th scope="col" className="px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th scope="col" className="px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Property
                          </th>
                          <th scope="col" className="px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-1 py-1 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {maintenanceData.map((req) => (
                          <tr key={req.id}>
                            <td className="px-1 py-1 whitespace-nowrap text-xs text-gray-900">
                              #{req.id}
                            </td>
                            <td className="px-1 py-1 whitespace-nowrap">
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                                req.type === 'Plumbing' ? 'bg-blue-100 text-blue-800' :
                                req.type === 'Electrical' ? 'bg-yellow-100 text-yellow-800' :
                                req.type === 'HVAC' ? 'bg-purple-100 text-purple-800' :
                                req.type === 'Structural' ? 'bg-pink-100 text-pink-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {req.type}
                              </span>
                            </td>
                            <td className="px-1 py-1 whitespace-nowrap text-xs text-gray-700">
                              {req.property}
                            </td>
                            <td className="px-1 py-1 whitespace-nowrap text-xs text-gray-500">
                              {req.date}
                            </td>
                            <td className="px-1 py-1 whitespace-nowrap">
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                                req.status === 'Open' ? 'bg-red-100 text-red-800' :
                                req.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                req.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                                req.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {req.status}
                              </span>
                            </td>
                            <td className="px-1 py-1 whitespace-nowrap text-xs">
                              <div className="flex items-center space-x-1 justify-end">
                                <button
                                  className="text-blue-600 hover:text-blue-900"
                                  suppressHydrationWarning
                                  title="View details"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </button>
                                <button
                                  className="text-green-600 hover:text-green-900"
                                  suppressHydrationWarning
                                  title="Mark as completed"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="flex items-center justify-between pt-1 border-t border-gray-200 mt-1">
                    <div className="flex items-center text-xs text-gray-500">
                      <span>Showing 1-5 of 42</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        className="px-1.5 py-0.5 border border-blue-500 bg-blue-50 text-xs font-medium text-blue-700 hover:bg-blue-100 rounded-md"
                        suppressHydrationWarning
                      >
                        1
                      </button>
                      <button
                        className="px-1.5 py-0.5 border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                        suppressHydrationWarning
                      >
                        2
                      </button>
                      <button
                        className="px-1.5 py-0.5 border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                        suppressHydrationWarning
                      >
                        3
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// Main page component with client/server split
export default function PropertyOperationsOverview() {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  return isClient ? <PropertyDashboardClient /> : <PropertyDashboardSkeleton />
} 