'use client'

import { useState } from 'react'

export default function Achievements() {
    const [activeTab, setActiveTab] = useState('certificates')
    const [certificateType, setCertificateType] = useState('sports')
    const [careerType, setCareerType] = useState('placement')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        const form = e.target as HTMLFormElement
        const formData = new FormData(form)

        // Add additional fields expected by the backend
        formData.set('documentType', activeTab === 'certificates' ? 'achievement' : 'career')

        // Construct title and description based on inputs
        const titleInput = form.querySelector('input[name="title"]') as HTMLInputElement
        // const descInput = form.querySelector('input[name="description"]') as HTMLInputElement // If we add description field

        // For certificates
        if (activeTab === 'certificates') {
            formData.set('title', `${certificateType} - ${titleInput?.value || 'Certificate'}`)
            formData.set('description', `Uploaded on ${new Date().toLocaleDateString()}`)
        } else {
            // For career
            const type = careerType === 'placement' ? 'Placement' : 'Higher Studies'
            formData.set('title', `${type} - ${titleInput?.value || 'Details'}`)
            formData.set('description', `Career progression details`)
        }

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
                <div className="flex space-x-4 border-b border-gray-200 mb-6">
                    <button
                        onClick={() => setActiveTab('certificates')}
                        className={`pb-2 px-4 font-medium transition ${activeTab === 'certificates'
                            ? 'border-b-2 border-orange-600 text-orange-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Upload Certificates
                    </button>
                    <button
                        onClick={() => setActiveTab('career')}
                        className={`pb-2 px-4 font-medium transition ${activeTab === 'career'
                            ? 'border-b-2 border-orange-600 text-orange-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Career Progression
                    </button>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${message.includes('successful') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                        {message}
                    </div>
                )}

                {activeTab === 'certificates' && (
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
                )}

                {activeTab === 'career' && (
                    <form onSubmit={handleUpload} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Progression Type
                            </label>
                            <div className="flex space-x-4">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        value="placement"
                                        checked={careerType === 'placement'}
                                        onChange={(e) => setCareerType(e.target.value)}
                                        className="text-orange-600 focus:ring-orange-500"
                                    />
                                    <span>Placement</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        value="higher-studies"
                                        checked={careerType === 'higher-studies'}
                                        onChange={(e) => setCareerType(e.target.value)}
                                        className="text-orange-600 focus:ring-orange-500"
                                    />
                                    <span>Higher Studies</span>
                                </label>
                            </div>
                        </div>

                        {careerType === 'placement' ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="e.g., Google"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Package (LPA)
                                    </label>
                                    <input
                                        type="number"
                                        name="package"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="e.g., 12"
                                        required
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        University / Institution Name
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="e.g., Stanford University"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Course / Program
                                    </label>
                                    <input
                                        type="text"
                                        name="program"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="e.g., MS in Computer Science"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Offer Letter / Admission Letter
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
                            {loading ? 'Submitting...' : 'Submit Details'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
