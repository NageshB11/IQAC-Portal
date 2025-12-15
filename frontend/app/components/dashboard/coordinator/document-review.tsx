'use client'

import { useState, useEffect } from 'react'

export default function DocumentReview() {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null)
  const [comments, setComments] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('token')
      // Fetch all department documents instead of just pending
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/documents/department`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to fetch documents')

      const data = await response.json()
      setDocuments(data)
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/documents/${docId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ comments })
      })

      if (!response.ok) throw new Error('Failed to approve document')

      // Update the document in the list
      setDocuments(documents.map(d => d._id === docId ? { ...d, status: 'approved' } : d))
      setSelectedDoc(null)
      setComments('')
    } catch (err) {
      console.error(err)
      alert('Failed to approve document')
    }
  }

  const handleReject = async (docId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/documents/${docId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ comments })
      })

      if (!response.ok) throw new Error('Failed to reject document')

      // Update the document in the list
      setDocuments(documents.map(d => d._id === docId ? { ...d, status: 'rejected' } : d))
      setSelectedDoc(null)
      setComments('')
    } catch (err) {
      console.error(err)
      alert('Failed to reject document')
    }
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
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = title || 'document'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error(err)
      alert('Failed to download document')
    }
  }

  if (loading) return <div>Loading documents...</div>
  if (error) return <div className="text-red-600">{error}</div>

  const filteredDocs = filterStatus === 'all' ? documents : documents.filter(d => d.status === filterStatus)
  const pendingCount = documents.filter(d => d.status === 'pending').length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Department Documents</h2>
          <p className="text-gray-600 text-sm">Faculty & Student submissions | Pending: {pendingCount} | Total: {documents.length}</p>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All Documents</option>
          <option value="pending">Pending Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {filteredDocs.length === 0 ? (
            <p className="text-gray-500">No documents found for this filter.</p>
          ) : (
            filteredDocs.map((doc) => (
              <div key={doc._id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{doc.title}</h3>
                    <p className="text-sm text-gray-600">
                      By {doc.uploadedBy ? `${doc.uploadedBy.firstName} ${doc.uploadedBy.lastName}` : 'Unknown'}
                      {doc.uploadedBy?.role && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs capitalize">
                          {doc.uploadedBy.role}
                        </span>
                      )}
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
                  Type: <span className="capitalize font-medium">{doc.documentType}</span> | {new Date(doc.createdAt).toLocaleDateString()}
                </p>
                {doc.comments && (
                  <p className="text-sm text-gray-500 italic mb-3">Note: {doc.comments}</p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(doc._id, doc.title)}
                    className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                  >
                    Download Document
                  </button>
                  {doc.status === 'pending' && (
                    <button
                      onClick={() => setSelectedDoc(doc._id)}
                      className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                    >
                      Review Document
                    </button>
                  )}
                </div>
                {doc.documentType === 'achievement' && doc.status === 'approved' && (
                  <div className="mt-2 text-xs text-green-600 font-medium">
                    ✓ Auto-approved achievement
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {selectedDoc && (
          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Review & Approve</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={4}
                  placeholder="Add feedback or comments..."
                />
              </div>
              <div className="flex gap-2 flex-col">
                <button
                  onClick={() => handleApprove(selectedDoc)}
                  className="w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(selectedDoc)}
                  className="w-full px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                >
                  Reject
                </button>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="w-full px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition text-sm"
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
