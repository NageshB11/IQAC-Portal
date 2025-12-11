'use client'

import { useState, useEffect } from 'react'

export default function DocumentApproval() {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [comments, setComments] = useState('')
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState('pending')

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('token')
      // Fetch ALL documents instead of just pending
      const response = await fetch('http://localhost:5000/api/documents/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to fetch documents')

      const data = await response.json()
      // Transform data to match UI
      const formattedDocs = data.map((d: any) => ({
        id: d._id,
        title: d.title,
        uploadedBy: d.uploadedBy ? `${d.uploadedBy.firstName} ${d.uploadedBy.lastName}` : 'Unknown',
        uploaderRole: d.uploadedBy?.role || 'N/A',
        department: d.department?.name || 'N/A',
        type: d.documentType,
        status: d.status,
        date: new Date(d.createdAt).toLocaleDateString(),
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

  const handleApprove = async (docId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/documents/${docId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ comments })
      })

      if (!response.ok) throw new Error('Failed to approve document')

      // Optimistic update
      setDocuments(documents.map(d => d.id === docId ? { ...d, status: 'approved' } : d))
      setSelectedDocId(null)
      setComments('')
    } catch (err) {
      console.error(err)
      alert('Failed to approve document')
    }
  }

  const handleReject = async (docId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/documents/${docId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ comments })
      })

      if (!response.ok) throw new Error('Failed to reject document')

      // Optimistic update
      setDocuments(documents.map(d => d.id === docId ? { ...d, status: 'rejected' } : d))
      setSelectedDocId(null)
      setComments('')
    } catch (err) {
      console.error(err)
      alert('Failed to reject document')
    }
  }

  if (loading) return <div>Loading documents...</div>
  if (error) return <div className="text-red-600">{error}</div>

  const filteredDocs = filterStatus === 'all' ? documents : documents.filter(d => d.status === filterStatus)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Document Management</h2>
          <p className="text-gray-600 text-sm">Review all faculty & student document submissions</p>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="pending">Pending Review</option>
          <option value="approved">Approved History</option>
          <option value="rejected">Rejected History</option>
          <option value="all">All Documents</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {filteredDocs.length === 0 ? (
            <p className="text-gray-500">No documents found for this filter.</p>
          ) : (
            filteredDocs.map((doc) => (
              <div key={doc.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{doc.title}</h3>
                    <p className="text-sm text-gray-600">
                      By {doc.uploadedBy} - {doc.department}
                      <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs capitalize">
                        {doc.uploaderRole}
                      </span>
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${doc.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    doc.status === 'approved' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                    {doc.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Type: <span className="capitalize font-medium">{doc.type}</span> | Uploaded: {doc.date}
                </p>
                {doc.comments && (
                  <p className="text-sm text-gray-500 italic mb-3">Note: {doc.comments}</p>
                )}

                {doc.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedDocId(doc.id)}
                      className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                    >
                      Review
                    </button>
                  </div>
                )}

                {doc.type === 'achievement' && doc.status === 'approved' && (
                  <div className="mt-2 text-xs text-green-600 font-medium">
                    ✓ Auto-approved achievement
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {selectedDocId && (
          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Review Document</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Add approval comments or feedback..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(selectedDocId)}
                  className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(selectedDocId)}
                  className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                >
                  Reject
                </button>
                <button
                  onClick={() => {
                    setSelectedDocId(null)
                    setComments('')
                  }}
                  className="flex-1 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
