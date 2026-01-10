'use client'

import { useState, useEffect } from 'react'

export default function MyDocuments() {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Edit state
  const [editingDoc, setEditingDoc] = useState<any>(null)
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    documentType: '',
    file: null as File | null
  })

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')
      if (!userStr) throw new Error('User not found')

      const user = JSON.parse(userStr)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/documents/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to fetch documents')

      const data = await response.json()
      // Backend returns: { _id, title, description, documentType, status, createdAt, updatedAt, comments }
      const formattedDocs = data.map((d: any) => ({
        id: d._id,
        title: d.title,
        description: d.description,
        type: d.documentType,
        status: d.status,
        uploadDate: new Date(d.createdAt).toLocaleDateString(),
        approvalDate: d.status === 'approved' || d.status === 'rejected' ? new Date(d.updatedAt).toLocaleDateString() : null,
        comments: d.comments
      }))

      setDocuments(formattedDocs)
    } catch (err) {
      setError('Failed to load documents')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const filteredDocs = filterStatus === 'all' ? documents : documents.filter(d => d.status === filterStatus)

  const handleResubmit = (docId: string) => {
    // Handle resubmit logic - for now just alert
    alert('Resubmit feature coming soon')
  }

  const handleEdit = (docId: string) => {
    alert('Edit feature coming soon. Please delete and re-upload if you need to change the file.')
  }

  const handleDownload = async (docId: string, title: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/documents/${docId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to download document')

      // Create blob from response
      const blob = await response.blob()

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = title || 'document'
      document.body.appendChild(a)
      a.click()

      // Cleanup
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Failed to download document')
    }
  }

  const handleDelete = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/documents/${docId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to delete document')
      }

      // Optimistic update
      setDocuments(documents.filter(d => d.id !== docId))
      alert('Document deleted successfully')
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Failed to delete document')
    }
  }

  const startEdit = (doc: any) => {
    setEditingDoc(doc)
    setEditForm({
      title: doc.title,
      description: doc.description || '',
      documentType: doc.type,
      file: null
    })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingDoc) return

    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('title', editForm.title)
      formData.append('description', editForm.description)
      formData.append('documentType', editForm.documentType)
      if (editForm.file) {
        formData.append('file', editForm.file)
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/documents/${editingDoc.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to update document')
      }

      alert('Document updated successfully')
      setEditingDoc(null)
      fetchDocuments() // Refresh list
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Failed to update document')
    }
  }

  if (loading) return <div>Loading documents...</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Documents</h2>
          <p className="text-gray-600 text-sm">Track status of all uploaded documents</p>
        </div>

      </div>

      {/* Edit Modal */}
      {editingDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Document</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={editForm.documentType}
                  onChange={(e) => setEditForm({ ...editForm, documentType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="research">Research Paper</option>
                  <option value="attendance">Attendance Report</option>
                  <option value="plan">Curriculum Plan</option>
                  <option value="report">Annual Report</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Replace File (Optional)</label>
                <input
                  type="file"
                  onChange={(e) => setEditForm({ ...editForm, file: e.target.files ? e.target.files[0] : null })}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingDoc(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredDocs.length === 0 ? (
          <p className="text-gray-500 text-center">No documents found.</p>
        ) : (
          filteredDocs.map((doc) => (
            <div key={doc.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{doc.title}</h3>
                  <p className="text-sm text-gray-600">
                    Type: <span className="capitalize font-medium">{doc.type}</span>
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-600">Uploaded</p>
                  <p className="font-medium text-gray-900">{doc.uploadDate}</p>
                </div>
                {doc.approvalDate && (
                  <div>
                    <p className="text-gray-600">Reviewed</p>
                    <p className="font-medium text-gray-900">{doc.approvalDate}</p>
                  </div>
                )}
                {doc.comments && (
                  <div className="md:col-span-3">
                    <p className="text-gray-600">Comments</p>
                    <p className="font-medium text-red-700">{doc.comments}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {doc.status === 'pending' && (
                  <>
                    <button
                      onClick={() => startEdit(doc)}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                    >
                      Delete
                    </button>
                  </>
                )}
                {doc.status === 'rejected' && (
                  <button
                    onClick={() => handleResubmit(doc.id)}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition text-sm"
                  >
                    Resubmit
                  </button>
                )}
                {doc.status === 'approved' && (
                  <button
                    onClick={() => handleDownload(doc.id, doc.title)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                  >
                    Download
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
