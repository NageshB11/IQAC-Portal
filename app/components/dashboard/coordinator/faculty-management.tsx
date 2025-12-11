'use client'

import { useState, useEffect } from 'react'

export default function FacultyManagement() {
  const [faculty, setFaculty] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedFaculty, setSelectedFaculty] = useState<any>(null)

  const handleViewFaculty = (faculty: any) => {
    setSelectedFaculty(faculty)
  }

  useEffect(() => {
    fetchFaculty()
  }, [])

  const fetchFaculty = async () => {
    try {
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')
      if (!userStr) throw new Error('User not found')

      const user = JSON.parse(userStr)

      // Fetch all users and filter by department and faculty role
      const response = await fetch('http://localhost:5000/api/users/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to fetch faculty')
      }

      const allUsers = await response.json()

      // Filter faculty by coordinator's department
      const facultyMembers = allUsers.filter((u: any) => {
        const userDeptId = typeof user.department === 'object' ? user.department._id : user.department
        const facultyDeptId = u.department?._id || u.department

        return u.role === 'faculty' &&
          String(facultyDeptId) === String(userDeptId)
      })

      setFaculty(facultyMembers)
    } catch (err: any) {
      setError(err.message || 'Failed to load faculty')
      console.error('Fetch faculty error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading faculty...</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Faculty Members</h2>
          <p className="text-gray-600 text-sm">Manage faculty in your department</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          + Add Faculty
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-gray-700">
              <strong>Note:</strong> Faculty members can register themselves through the signup page.
              This section is for viewing faculty in your department.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Designation</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {faculty.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No faculty members found in your department
                </td>
              </tr>
            ) : (
              faculty.map((f) => (
                <tr key={f._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {f.firstName} {f.lastName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{f.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{f.designation || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${f.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                      {f.isApproved ? 'Active' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => handleViewFaculty(f)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Faculty Details Modal */}
      {selectedFaculty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Faculty Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-gray-900">{selectedFaculty.firstName} {selectedFaculty.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{selectedFaculty.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Designation</p>
                <p className="font-medium text-gray-900">{selectedFaculty.designation || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone Number</p>
                <p className="font-medium text-gray-900">{selectedFaculty.phoneNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-medium text-gray-900">{selectedFaculty.department?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedFaculty.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                  {selectedFaculty.isApproved ? 'Active' : 'Pending'}
                </span>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedFaculty(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
