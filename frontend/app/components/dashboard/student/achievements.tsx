'use client'

import { useState } from 'react'

export default function Achievements() {
    const [certificateType, setCertificateType] = useState('sports')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        const form = e.target as HTMLFormElement
        const formData = new FormData(form)

        // Add additional fields expected by the backend
        formData.set('documentType', 'achievement')

        // Construct title and description based on inputs
        const titleInput = form.querySelector('input[name="title"]') as HTMLInputElement
        // const descInput = form.querySelector('input[name="description"]') as HTMLInputElement // If we add description field

        // For certificates
        formData.set('title', `${certificateType} - ${titleInput?.value || 'Certificate'}`)
        formData.set('description', `Uploaded on ${new Date().toLocaleDateString()}`)

        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/documents/upload`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            })

            if (response.ok) {
                setMessage('Upload successful!')
                form.reset()
            } else {
                const errorData = await response.json()
                setMessage(`Upload failed: ${errorData.message || errorData.error || 'Unknown error'}`)
            }
        } catch (error) {
            console.error('Upload error:', error)
            setMessage('Error uploading file.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">Upload Certificates</h2>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${message.includes('successful') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleUpload} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Certificate Type
                        </label>
                        <select
                            value={certificateType}
                            onChange={(e) => setCertificateType(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="sports">Sports</option>
                            <option value="cultural">Cultural Activities</option>
                            <option value="paper">Paper Presentations</option>
                            <option value="internship">Internships</option>
                            <option value="course">Online Courses (NPTEL, Coursera)</option>
                            <option value="competition">Competitions / Events</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title / Description
                        </label>
                        <input
                            type="text"
                            name="title"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="e.g., First Prize in Inter-college Football"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date of Achievement
                        </label>
                        <input
                            type="date"
                            name="date"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Certificate (PDF/Image)
                        </label>
                        <input
                            type="file"
                            name="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium disabled:bg-gray-400"
                    >
                        {loading ? 'Uploading...' : 'Upload Certificate'}
                    </button>
                </form>
            </div>
        </div>
    )
}
