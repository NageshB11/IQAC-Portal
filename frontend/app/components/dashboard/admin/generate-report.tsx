'use client'

import { useState, useEffect } from 'react'

export default function GenerateReport() {
    const [academicYear, setAcademicYear] = useState('')
    const [department, setDepartment] = useState('')
    const [activityType, setActivityType] = useState('')
    const [reportFormat, setReportFormat] = useState<string[]>([])
    const [departments, setDepartments] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        fetchDepartments()
    }, [])

    const fetchDepartments = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/departments`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setDepartments(data)
            }
        } catch (error) {
            console.error('Error fetching departments:', error)
        }
    }

    const handleFormatChange = (format: string) => {
        setReportFormat(prev => {
            if (prev.includes(format)) {
                return prev.filter(f => f !== format)
            } else {
                return [...prev, format]
            }
        })
    }

    const handleGenerateReport = async () => {
        if (!academicYear || !activityType || reportFormat.length === 0) {
            setMessage('Please fill all required fields')
            return
        }

        setLoading(true)
        setMessage('')

        try {
            const token = localStorage.getItem('token')
            const params = new URLSearchParams({
                academicYear,
                activityType,
                ...(department && { department })
            })

            // Generate reports for each selected format
            for (const format of reportFormat) {
                let url = ''
                let fileExtension = ''

                if (format === 'pdf') {
                    url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/reports/generate?${params}`
                    fileExtension = 'pdf'
                } else if (format === 'excel') {
                    url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/excel-reports/generate-excel?${params}`
                    fileExtension = 'xlsx'
                }

                const response = await fetch(url, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })

                if (response.ok) {
                    // Get the blob from response
                    const blob = await response.blob()

                    // Create download link
                    const downloadUrl = window.URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = downloadUrl
                    a.download = `IQAC_Report_${activityType}_${academicYear}.${fileExtension}`
                    document.body.appendChild(a)
                    a.click()

                    // Cleanup
                    window.URL.revokeObjectURL(downloadUrl)
                    document.body.removeChild(a)
                } else {
                    const error = await response.json()
                    setMessage(`Error generating ${format.toUpperCase()}: ${error.message}`)
                    setLoading(false)
                    return
                }
            }

            setMessage(`Report${reportFormat.length > 1 ? 's' : ''} generated successfully!`)
        } catch (error) {
            console.error('Error generating report:', error)
            setMessage('Failed to generate report')
        } finally {
            setLoading(false)
        }
    }

    const currentYear = new Date().getFullYear()
    const academicYears = Array.from({ length: 10 }, (_, i) => {
        const year = currentYear - i
        return `${year}-${year + 1}`
    })

    const activityTypes = [
        { value: 'research', label: 'Research Publications' },
        { value: 'professional-development', label: 'Professional Development (FDP/STTP)' },
        { value: 'institutional-events', label: 'Workshops/Seminars/Conferences Conducted' },
        { value: 'courses', label: 'Courses Taught' },
        { value: 'events', label: 'Events Organized' },
        { value: 'student-achievements', label: 'Student Achievements' },
        { value: 'student-career', label: 'Student Career Progression' },
        { value: 'sports-achievements', label: 'Sports Achievements' },
        { value: 'all-faculty', label: 'All Faculty Activities' },
        { value: 'all-student', label: 'All Student Activities' },
        { value: 'comprehensive', label: 'Comprehensive Report (All Data)' }
    ]

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Generate Report</h2>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <div className="space-y-6">
                    {/* Academic Year Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Academic Year <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={academicYear}
                            onChange={(e) => setAcademicYear(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Academic Year</option>
                            {academicYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    {/* Department Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Department <span className="text-gray-400">(Optional - Leave blank for all departments)</span>
                        </label>
                        <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Departments</option>
                            {departments.map(dept => (
                                <option key={dept._id} value={dept._id}>
                                    {dept.name} ({dept.code})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Activity Type Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Activity Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={activityType}
                            onChange={(e) => setActivityType(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Activity Type</option>
                            {activityTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Report Format Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Report Format <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={reportFormat.includes('pdf')}
                                    onChange={() => handleFormatChange('pdf')}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-gray-700">PDF Format</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={reportFormat.includes('excel')}
                                    onChange={() => handleFormatChange('excel')}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-gray-700">Excel Format</span>
                            </label>
                        </div>
                    </div>

                    {/* Generate Button */}
                    <div className="pt-4">
                        <button
                            onClick={handleGenerateReport}
                            disabled={loading}
                            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating Report...
                                </span>
                            ) : (
                                '📊 Generate Report'
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Information Panel */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-3">ℹ️ Report Information</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                    <li>• Reports will include all activities for the selected academic year</li>
                    <li>• PDF format provides a formatted, printable document</li>
                    <li>• Excel format allows for further data analysis</li>
                    <li>• You can select both formats to generate multiple reports</li>
                    <li>• Comprehensive reports may take longer to generate</li>
                    <li>• Department filter is optional - leave blank to include all departments</li>
                </ul>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Report Types Available</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="text-2xl mb-2">📚</div>
                        <h4 className="font-semibold text-gray-900">Faculty Activities</h4>
                        <p className="text-sm text-gray-600">Research, FDP, Courses, Events</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="text-2xl mb-2">🏆</div>
                        <h4 className="font-semibold text-gray-900">Student Activities</h4>
                        <p className="text-sm text-gray-600">Achievements, Career Progression</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="text-2xl mb-2">📊</div>
                        <h4 className="font-semibold text-gray-900">Comprehensive</h4>
                        <p className="text-sm text-gray-600">Complete institutional report</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
