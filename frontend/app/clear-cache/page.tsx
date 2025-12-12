'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ClearCachePage() {
    const router = useRouter()

    useEffect(() => {
        // Clear all localStorage
        localStorage.clear()

        // Clear all sessionStorage
        sessionStorage.clear()

        // Show confirmation
        alert('✓ All cached data cleared! You will be redirected to login page.')

        // Redirect to login
        router.push('/login')
    }, [router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="text-4xl mb-4">🔄</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Clearing Cache...</h1>
                <p className="text-gray-600">Please wait while we clear all cached data.</p>
            </div>
        </div>
    )
}
