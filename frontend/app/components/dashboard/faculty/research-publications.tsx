'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
    documentUrl: '',
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
      documentUrl: publication.documentUrl || '',
      file: null
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
      documentUrl: '',
      file: null
    })
    setEditingId(null)
    setShowForm(false)
    setError('')
  }

  if (loading) return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  )

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Research Publications</h2>
          <p className="text-gray-500 mt-1">Manage your research portfolio and scholarly works</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-sm ${showForm
            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            : 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-purple-200'
            }`}
        >
          {showForm ? 'Cancel' : (
            <>
              <span>+</span> Add Publication
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3"
          >
            <span className="text-xl">⚠️</span>
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-3"
          >
            <span className="text-xl">✅</span>
            {success}
          </motion.div>
        )}

        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                {editingId ? '✏️ Edit' : '✨ Add New'} Publication
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Paper Title <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                      placeholder="Enter the full title of your publication"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Authors <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={formData.authors}
                      onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                      placeholder="e.g. Smith J., Doe A."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Journal/Conference Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={formData.journalConference}
                      onChange={(e) => setFormData({ ...formData, journalConference: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                      placeholder="e.g. IEEE Transactions on..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Publication Type <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        value={formData.publicationType}
                        onChange={(e) => setFormData({ ...formData, publicationType: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none appearance-none cursor-pointer"
                        required
                      >
                        <option value="journal">Journal Article</option>
                        <option value="conference">Conference Paper</option>
                        <option value="book">Book</option>
                        <option value="chapter">Book Chapter</option>
                        <option value="patent">Patent</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                        ▼
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Publication Date <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      value={formData.publicationDate}
                      onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">DOI (Optional)</label>
                    <input
                      type="text"
                      value={formData.doi}
                      onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none font-mono text-sm"
                      placeholder="10.xxxx/xxxxx"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">ISSN/ISBN (Optional)</label>
                    <input
                      type="text"
                      value={formData.issn || formData.isbn}
                      onChange={(e) => setFormData({ ...formData, issn: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none font-mono text-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Resources (Optional)</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="url"
                          value={formData.documentUrl}
                          onChange={(e) => setFormData({ ...formData, documentUrl: e.target.value })}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-sm"
                          placeholder="Paste Link (URL) here..."
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400 font-medium">OR</span>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 transition-all cursor-pointer"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Provide a direct link to the publication OR upload a PDF copy.</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-purple-200"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                        Saving...
                      </span>
                    ) : (editingId ? 'Update Publication' : 'Save Publication')}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-all border border-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-6">
        {publications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Publications Yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">Start building your research portfolio by adding your journal articles, conference papers, and book chapters.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition shadow-lg shadow-purple-200"
            >
              Add Your First Publication
            </button>
          </div>
        ) : (
          publications.map((pub) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={pub._id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-100 transition-all group"
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide
                      ${pub.publicationType === 'journal' ? 'bg-blue-100 text-blue-700' :
                        pub.publicationType === 'conference' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-700'}`}>
                      {pub.publicationType}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      🗓 {new Date(pub.publicationDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-purple-700 transition-colors">
                    {pub.title}
                  </h3>

                  <div className="text-sm text-gray-600 flex flex-wrap gap-y-1 gap-x-4">
                    <span className="flex items-center gap-1">
                      <span className="text-gray-400">By:</span>
                      <span className="font-medium">{pub.authors}</span>
                    </span>
                    <span className="flex items-center gap-1 text-gray-400">|</span>
                    <span className="font-medium text-gray-800 italic">{pub.journalConference}</span>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    {pub.doi && (
                      <a href={`https://doi.org/${pub.doi.replace('doi:', '')}`} target="_blank" rel="noopener noreferrer"
                        className="text-xs bg-gray-50 hover:bg-yellow-50 text-gray-600 hover:text-yellow-700 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors flex items-center gap-1">
                        🔗 DOI: {pub.doi}
                      </a>
                    )}
                    {pub.documentUrl && (
                      <a href={pub.documentUrl} target="_blank" rel="noopener noreferrer"
                        className="text-xs bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-700 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors flex items-center gap-1">
                        📄 View Document
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-2 min-w-[100px] justify-end">
                  <button
                    onClick={() => handleEdit(pub)}
                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pub._id)}
                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
