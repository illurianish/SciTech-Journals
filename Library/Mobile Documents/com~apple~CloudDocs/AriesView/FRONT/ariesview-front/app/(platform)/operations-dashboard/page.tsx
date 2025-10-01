'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OperationsDashboard() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the home page
    router.push('/operations-dashboard/home')
  }, [router])

  return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-pulse text-gray-500">Redirecting to home page...</div>
    </div>
  )
} 