'use client'

import { useState, useEffect } from 'react'

export default function StudentProfile() {
    const [user, setUser] = useState<any>(null)
    const [formData, setFormData] = useState({
        address: '',
        contact: '',
        photo: '',
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:5000/api/users/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            if (response.ok) {
                const data = await response.json()
                setUser(data)
                setFormData({
                    address: data.address || '',
                    contact: data.phoneNumber || '',
                    photo: data.photo || '',
                })
                // Update local storage user data as well
                localStorage.setItem('user', JSON.stringify(data))
            }
        } catch (error) {
            console.error('Error fetching profile:', error)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    phoneNumber: formData.contact,
                    address: formData.address,
                    photo: formData.photo,
                }),
            })

            if (response.ok) {
                const data = await response.json()
                setUser(data.user)
                localStorage.setItem('user', JSON.stringify(data.user))
                setMessage('Profile updated successfully!')
                setTimeout(() => setMessage(''), 3000)
            } else {
                setMessage('Failed to update profile.')
            }
        } catch (error) {
            console.error('Error updating profile:', error)
            setMessage('Error updating profile.')
        } finally {
            setLoading(false)
        }
    }

    if (!user) return <div>Loading...</div>

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h2>

            {message && (
                <div className={`mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                    {message}
                </div>
            )}

            <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {formData.photo ? (
                        <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-4xl text-gray-400">👤</span>
                    )}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">{user.firstName} {user.lastName}</h3>
                    <p className="text-gray-500">{user.email}</p>
                    <p className="text-gray-500 capitalize">{user.role}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Number
                    </label>
                    <input
                        type="tel"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="+91 98765 43210"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                    </label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Enter your permanent address"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Photo URL (Optional)
                    </label>
                    <input
                        type="text"
                        name="photo"
                        value={formData.photo}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="https://example.com/photo.jpg"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Note: For this demo, please provide a direct image URL.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium disabled:bg-gray-400"
                >
                    {loading ? 'Updating...' : 'Save Changes'}
                </button>
            </form>
        </div>
    )
}
