'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ActionCenter() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the property edit page
    router.push('/operations-dashboard/properties/add')
  }, [router])

  return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-pulse text-gray-500">Redirecting to property edit...</div>
    </div>
  )
} 