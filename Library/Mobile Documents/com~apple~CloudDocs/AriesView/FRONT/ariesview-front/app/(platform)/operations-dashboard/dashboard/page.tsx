'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the property overview page
    router.push('/operations-dashboard/properties/property-overview')
  }, [router])

  return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-pulse text-gray-500">Redirecting to property overview...</div>
    </div>
  )
} 