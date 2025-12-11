'use client'

import { useState } from 'react'

export default function DocumentUpload() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    documentType: 'research',
    file: null as File | null,
  })
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        file: e.target.files[0],
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const data = new FormData()
      data.append('title', formData.title)
      data.append('description', formData.description)
      data.append('documentType', formData.documentType)
      if (formData.file) {
        data.append('file', formData.file)
      }

      const response = await fetch('http://localhost:5000/api/documents/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || 'Upload failed')
      }

      setUploadSuccess(true)
      setFormData({
        title: '',
        description: '',
        documentType: 'research',
        file: null,
      })
      setTimeout(() => setUploadSuccess(false), 3000)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to upload document')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Document</h2>

            {uploadSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                ✓ Document uploaded successfully!
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter document title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                <select
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="research">Research Paper</option>
                  <option value="attendance">Attendance Report</option>
                  <option value="plan">Curriculum Plan</option>
                  <option value="report">Annual Report</option>
                  <option value="achievement">Achievement</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={4}
                  placeholder="Add description or notes about the document"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    required
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="text-5xl mb-2">📄</div>
                    <p className="text-gray-700 font-medium">Click to upload or drag and drop</p>
                    <p className="text-gray-500 text-sm">PDF, DOC, DOCX (Max 10MB)</p>
                    {formData.file && (
                      <p className="text-purple-600 font-medium mt-2">✓ {formData.file.name}</p>
                    )}
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading || !formData.file}
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload Document'}
              </button>
            </form>
          </div>
        </div>

        {/* Guidelines */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Guidelines</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-900">File Format</p>
              <p className="text-xs text-gray-600 mt-1">PDF, DOC, DOCX supported</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">File Size</p>
              <p className="text-xs text-gray-600 mt-1">Maximum 10 MB</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Review Time</p>
              <p className="text-xs text-gray-600 mt-1">Usually 2-3 working days</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Required Info</p>
              <p className="text-xs text-gray-600 mt-1">Title, type, and description</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
