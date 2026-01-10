'use client'

import { useState, useEffect } from 'react'

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
  })

  // Edit State
  const [editingDept, setEditingDept] = useState<any>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    code: '',
    description: '',
  })

  // Department Detail View State
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null)
  const [detailView, setDetailView] = useState<'menu' | 'faculty' | 'student' | 'students'>('menu')
  const [facultyData, setFacultyData] = useState<any[]>([])
  const [studentFeedback, setStudentFeedback] = useState<any[]>([])
  const [studentsData, setStudentsData] = useState<any[]>([])
  const [detailLoading, setDetailLoading] = useState(false)

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/departments/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to fetch departments')

      const data = await response.json()
      setDepartments(data)
    } catch (err) {
      setError('Failed to load departments')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/departments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create department')
      }

      alert('Department created successfully!')
      fetchDepartments()
      setFormData({ name: '', code: '', description: '' })
      setShowAddForm(false)
    } catch (err: any) {
      console.error(err)
      alert(`Failed to create department: ${err.message}`)
    }
  }

  const startEdit = (dept: any, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering department click
    setEditingDept(dept)
    setEditForm({
      name: dept.name,
      code: dept.code,
      description: dept.description || ''
    })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingDept) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/departments/${editingDept._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      })

      if (!response.ok) throw new Error('Failed to update department')

      alert('Department updated successfully')
      setEditingDept(null)
      fetchDepartments()
    } catch (err) {
      console.error(err)
      alert('Failed to update department')
    }
  }

  const handleDepartmentClick = (dept: any) => {
    setSelectedDepartment(dept)
    setDetailView('menu')
  }

  const fetchFacultyDocuments = async () => {
    if (!selectedDepartment) return
    setDetailLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/departments/${selectedDepartment._id}/faculty-documents`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to fetch faculty documents')

      const data = await response.json()
      setFacultyData(data)
      setDetailView('faculty')
    } catch (err) {
      console.error(err)
      alert('Failed to load faculty documents')
    } finally {
      setDetailLoading(false)
    }
  }

  const fetchStudentFeedback = async () => {
    if (!selectedDepartment) return
    setDetailLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/departments/${selectedDepartment._id}/student-feedback`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to fetch student feedback')

      const data = await response.json()
      setStudentFeedback(data)
      setDetailView('student')
    } catch (err) {
      console.error(err)
      alert('Failed to load student feedback')
    } finally {
      setDetailLoading(false)
    }
  }

  const fetchStudents = async () => {
    if (!selectedDepartment) return
    setDetailLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/departments/${selectedDepartment._id}/students`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to fetch students')

      const data = await response.json()
      setStudentsData(data)
      setDetailView('students')
    } catch (err) {
      console.error(err)
      alert('Failed to load students')
    } finally {
      setDetailLoading(false)
    }
  }

  const closeDepartmentDetail = () => {
    setSelectedDepartment(null)
    setDetailView('menu')
    setFacultyData([])
    setStudentFeedback([])
  }

  if (loading) return <div>Loading departments...</div>
  if (error) return <div className="text-red-600">{error}</div>

  // Department Detail View
  if (selectedDepartment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={closeDepartmentDetail}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            ← Back to Departments
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{selectedDepartment.name}</h2>
            <p className="text-gray-600 text-sm">Code: {selectedDepartment.code}</p>
          </div>
        </div>

        {detailView === 'menu' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={fetchFacultyDocuments}
              className="bg-white rounded-lg shadow-md p-8 border-l-4 border-blue-600 hover:shadow-lg transition text-left"
            >
              <div className="text-4xl mb-4">👨‍🏫</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Faculty Documents</h3>
              <p className="text-gray-600">View faculty members and their uploaded documents</p>
            </button>

            <button
              onClick={fetchStudents}
              className="bg-white rounded-lg shadow-md p-8 border-l-4 border-orange-600 hover:shadow-lg transition text-left"
            >
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Students</h3>
              <p className="text-gray-600">View all students in this department</p>
            </button>

            <button
              onClick={fetchStudentFeedback}
              className="bg-white rounded-lg shadow-md p-8 border-l-4 border-green-600 hover:shadow-lg transition text-left"
            >
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Student Feedback</h3>
              <p className="text-gray-600">View feedback submitted by students</p>
            </button>
          </div>
        )}

        {detailLoading && (
          <div className="text-center py-8">Loading...</div>
        )}

        {detailView === 'faculty' && !detailLoading && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Faculty Document Uploads</h3>
              <button
                onClick={() => setDetailView('menu')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
              >
                ← Back
              </button>
            </div>

            {facultyData.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No faculty members found in this department.</p>
            ) : (
              <div className="space-y-6">
                {facultyData.map((faculty) => (
                  <div key={faculty._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">
                          {faculty.firstName} {faculty.lastName}
                        </h4>
                        <p className="text-sm text-gray-600">{faculty.email}</p>
                        <p className="text-sm text-gray-600">Designation: {faculty.designation}</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {faculty.documentCount} Documents
                      </span>
                    </div>

                    {faculty.documents.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-sm font-semibold text-gray-700 mb-2">Uploaded Documents:</h5>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Upload Date</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {faculty.documents.map((doc: any) => (
                                <tr key={doc._id}>
                                  <td className="px-4 py-2 text-sm text-gray-900">{doc.title}</td>
                                  <td className="px-4 py-2 text-sm text-gray-600 capitalize">{doc.documentType}</td>
                                  <td className="px-4 py-2 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${doc.status === 'approved' ? 'bg-green-100 text-green-700' :
                                      doc.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                      }`}>
                                      {doc.status}
                                    </span>
                                  </td>
                                  <td className="px-4 py-2 text-sm text-gray-600">
                                    {new Date(doc.createdAt).toLocaleDateString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {detailView === 'student' && !detailLoading && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Student Feedback</h3>
              <button
                onClick={() => setDetailView('menu')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
              >
                ← Back
              </button>
            </div>

            {studentFeedback.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No student feedback found for this department.</p>
            ) : (
              <div className="space-y-4">
                {studentFeedback.map((feedback) => (
                  <div key={feedback._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {feedback.studentId?.firstName} {feedback.studentId?.lastName}
                        </h4>
                        <p className="text-sm text-gray-600">{feedback.studentId?.email}</p>
                        {feedback.studentId?.enrollmentNumber && (
                          <p className="text-sm text-gray-600">Enrollment: {feedback.studentId.enrollmentNumber}</p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-gray-700">{feedback.feedback || feedback.message || 'No feedback text'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {detailView === 'students' && !detailLoading && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Students List</h3>
              <button
                onClick={() => setDetailView('menu')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
              >
                ← Back
              </button>
            </div>

            {studentsData.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No students found in this department.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment No.</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {studentsData.map((student) => (
                      <tr key={student._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.enrollmentNumber || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.phoneNumber || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${student.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {student.isApproved ? 'Active' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  // Main Department List View
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Departments</h2>
          <p className="text-gray-600 text-sm">Manage departments and coordinators</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {showAddForm ? 'Cancel' : '+ Add Department'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleAddDepartment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Department Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Department Code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Description (Optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Modal */}
      {editingDept && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Department</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department Code</label>
                <input
                  type="text"
                  value={editForm.code}
                  onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingDept(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {departments.length === 0 ? (
          <p className="text-gray-500 col-span-4 text-center">No departments found.</p>
        ) : (
          departments.map((dept) => (
            <div
              key={dept._id}
              onClick={() => handleDepartmentClick(dept)}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600 cursor-pointer hover:shadow-lg transition flex flex-col h-full"
            >
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{dept.name}</h3>
                <p className="text-sm text-gray-600 mb-3">Code: {dept.code}</p>

                {/* Badges */}
                <div className="flex gap-2 mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    👨‍🏫 {dept.stats?.faculty || 0} Faculty
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    🎓 {dept.stats?.students || 0} Students
                  </span>
                </div>

                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-semibold">Coordinator:</span> {dept.coordinator ? `${dept.coordinator.firstName} ${dept.coordinator.lastName}` : 'Not Assigned'}
                </p>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{dept.description}</p>
              </div>

              <button
                onClick={(e) => startEdit(dept, e)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition text-sm font-medium"
              >
                Edit Details
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
