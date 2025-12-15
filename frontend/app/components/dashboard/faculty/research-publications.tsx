'use client'

import { useState, useEffect } from 'react'

interface ResearchPublication {
  _id: string
  title: string
  authors: string
  journalConference: string
  publicationType: string
  publicationDate: string
  doi?: string
  issn?: string
  isbn?: string
  impactFactor?: number
  indexing?: string[]
  citationCount: number
  documentUrl?: string
  status: string
  createdAt: string
}

export default function ResearchPublications() {
  const [publications, setPublications] = useState<ResearchPublication[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    journalConference: '',
    publicationType: 'journal',
    publicationDate: '',
    doi: '',
    issn: '',
    isbn: '',
    impactFactor: '',
    indexing: [] as string[],
    citationCount: '0',
    file: null as File | null
  })

  useEffect(() => {
    fetchPublications()
  }, [])

  const fetchPublications = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/faculty-activities/research`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setPublications(data)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to fetch publications')
      }
    } catch (error) {
      console.error('Error fetching publications:', error)
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    const token = localStorage.getItem('token')
    const data = new FormData()

    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'file' && value) {
        data.append('document', value as File)
      } else if (key === 'indexing') {
        data.append(key, JSON.stringify(value))
      } else if (value !== null && value !== '') {
        data.append(key, value.toString())
      }
    })

    try {
      const url = editingId
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/faculty-activities/research/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/faculty-activities/research`

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      })

      const responseData = await response.json()

      if (response.ok) {
        setSuccess(editingId ? 'Publication updated successfully!' : 'Publication added successfully!')
        fetchPublications()
        resetForm()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(responseData.message || 'Failed to save publication')
      }
    } catch (error) {
      console.error('Error saving publication:', error)
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this publication?')) return

    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/faculty-activities/research/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        setSuccess('Publication deleted successfully!')
        fetchPublications()
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (error) {
      console.error('Error deleting publication:', error)
      setError('Failed to delete publication')
    }
  }

  const handleEdit = (publication: ResearchPublication) => {
    setEditingId(publication._id)
    setFormData({
      title: publication.title,
      authors: publication.authors,
      journalConference: publication.journalConference,
      publicationType: publication.publicationType,
      publicationDate: publication.publicationDate.split('T')[0],
      doi: publication.doi || '',
      issn: publication.issn || '',
      isbn: publication.isbn || '',
      impactFactor: publication.impactFactor?.toString() || '',
      indexing: publication.indexing || [],
      citationCount: publication.citationCount.toString(),
      file: null
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      authors: '',
      journalConference: '',
      publicationType: 'journal',
      publicationDate: '',
      doi: '',
      issn: '',
      isbn: '',
      impactFactor: '',
      indexing: [],
      citationCount: '0',
      file: null
    })
    setEditingId(null)
    setShowForm(false)
    setError('')
  }

  const handleIndexingChange = (value: string) => {
    const current = formData.indexing
    if (current.includes(value)) {
      setFormData({ ...formData, indexing: current.filter(i => i !== value) })
    } else {
      setFormData({ ...formData, indexing: [...current, value] })
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Research Publications</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          {showForm ? 'Cancel' : '+ Add Publication'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'Add'} Publication</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Authors *</label>
                <input
                  type="text"
                  value={formData.authors}
                  onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Comma separated names"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Journal/Conference *</label>
                <input
                  type="text"
                  value={formData.journalConference}
                  onChange={(e) => setFormData({ ...formData, journalConference: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Publication Type *</label>
                <select
                  value={formData.publicationType}
                  onChange={(e) => setFormData({ ...formData, publicationType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="journal">Journal</option>
                  <option value="conference">Conference</option>
                  <option value="book">Book</option>
                  <option value="chapter">Book Chapter</option>
                  <option value="patent">Patent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Publication Date *</label>
                <input
                  type="date"
                  value={formData.publicationDate}
                  onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">DOI</label>
                <input
                  type="text"
                  value={formData.doi}
                  onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ISSN/ISBN</label>
                <input
                  type="text"
                  value={formData.issn || formData.isbn}
                  onChange={(e) => setFormData({ ...formData, issn: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Impact Factor</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.impactFactor}
                  onChange={(e) => setFormData({ ...formData, impactFactor: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Citation Count</label>
                <input
                  type="number"
                  value={formData.citationCount}
                  onChange={(e) => setFormData({ ...formData, citationCount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Indexing</label>
                <div className="flex flex-wrap gap-3">
                  {['scopus', 'sci', 'web-of-science', 'ugc-care'].map(idx => (
                    <label key={idx} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.indexing.includes(idx)}
                        onChange={() => handleIndexingChange(idx)}
                        className="mr-2"
                      />
                      <span className="text-sm capitalize">{idx.replace('-', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Document (PDF)</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Saving...' : (editingId ? 'Update' : 'Add')} Publication
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Journal/Conference</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Citations</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {publications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No publications added yet. Click "Add Publication" to get started.
                  </td>
                </tr>
              ) : (
                publications.map((pub) => (
                  <tr key={pub._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{pub.title}</div>
                      <div className="text-xs text-gray-500">{pub.authors}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 capitalize">{pub.publicationType}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{pub.journalConference}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(pub.publicationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{pub.citationCount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${pub.status === 'approved' ? 'bg-green-100 text-green-700' :
                          pub.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                        {pub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(pub)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(pub._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
