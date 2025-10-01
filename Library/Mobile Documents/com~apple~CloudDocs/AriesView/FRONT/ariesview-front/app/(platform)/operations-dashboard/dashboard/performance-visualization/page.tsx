'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PerformanceVisualization() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the custom views page
    router.push('/operations-dashboard/properties/custom-views')
  }, [router])

  return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-pulse text-gray-500">Redirecting to custom views...</div>
    </div>
  )
} 