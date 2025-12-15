'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import Navbar from '@/app/components/navbar'

type UserRole = 'admin' | 'coordinator' | 'faculty' | 'student'

export default function LoginPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [useUsername, setUseUsername] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole) {
      setError('Please select a user role')
      return
    }

    setLoading(true)
    setError('')

    try {
      const endpoint = selectedRole === 'admin'
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/admin-login`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`

      let payload: any = { password }

      if (selectedRole === 'admin') {
        payload.username = username
      } else if (selectedRole === 'coordinator' && useUsername) {
        payload.username = username
        payload.role = selectedRole
      } else {
        payload.email = email
        payload.role = selectedRole
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Login failed')
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('userRole', selectedRole)

      router.push(`/dashboard/${selectedRole}`)
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600 mb-6">Sign in to your account</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select your role
                </label>
                <select
                  value={selectedRole || ''}
                  onChange={(e) => {
                    setSelectedRole(e.target.value as UserRole)
                    setUseUsername(false)
                    setError('')
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Choose a role --</option>
                  <option value="admin">Admin</option>
                  <option value="coordinator">Coordinator</option>
                  <option value="faculty">Faculty</option>
                  <option value="student">Student</option>
                </select>
              </div>

              {selectedRole === 'coordinator' && (
                <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg">
                  <input
                    type="checkbox"
                    id="useUsername"
                    checked={useUsername}
                    onChange={(e) => setUseUsername(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="useUsername" className="text-sm text-gray-700">
                    Login with department username
                  </label>
                </div>
              )}

              {/* Username/Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {selectedRole === 'admin'
                    ? 'Username'
                    : selectedRole === 'coordinator' && useUsername
                      ? 'Department Username'
                      : 'Email'}
                </label>
                <Input
                  type={selectedRole === 'admin' || (selectedRole === 'coordinator' && useUsername) ? 'text' : 'email'}
                  value={selectedRole === 'admin' || (selectedRole === 'coordinator' && useUsername) ? username : email}
                  onChange={(e) => {
                    if (selectedRole === 'admin' || (selectedRole === 'coordinator' && useUsername)) {
                      setUsername(e.target.value)
                    } else {
                      setEmail(e.target.value)
                    }
                  }}
                  placeholder={
                    selectedRole === 'admin'
                      ? 'Enter username'
                      : selectedRole === 'coordinator' && useUsername
                        ? 'Enter department username (e.g., COORD_CS_001)'
                        : 'Enter email'
                  }
                  className="w-full"
                />
                {selectedRole === 'coordinator' && useUsername && (
                  <p className="text-xs text-gray-500 mt-2">
                    Your department-wise unique username was provided at signup
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full"
                />
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={loading || !selectedRole || (selectedRole === 'admin' ? !username : useUsername ? !username : !email) || !password}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-medium"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Signup Link */}
            <div className="text-center text-gray-600 mt-6">
              <p className="mb-2">Don't have an account?</p>
              <Link
                href="/signup"
                className="inline-block text-blue-600 hover:text-blue-700 font-medium text-lg bg-blue-50 px-6 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                onClick={() => console.log('Signup link clicked')}
              >
                Sign up here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
