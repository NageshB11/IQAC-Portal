'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, LogIn, Mail, Lock, User, KeyRound } from 'lucide-react'

type UserRole = 'admin' | 'coordinator' | 'faculty' | 'student' | 'sports'

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-slate-950/50 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
            <span className="text-3xl font-bold text-white">IQ</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400 text-sm">Sign in to your account</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Role Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Select Role</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <select
                value={selectedRole || ''}
                onChange={(e) => {
                  setSelectedRole(e.target.value as UserRole)
                  setUseUsername(false)
                  setError('')
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value="" className="bg-slate-900">-- Choose a role --</option>
                <option value="admin" className="bg-slate-900">Admin</option>
                <option value="coordinator" className="bg-slate-900">Coordinator</option>
                <option value="faculty" className="bg-slate-900">Faculty</option>
                <option value="student" className="bg-slate-900">Student</option>
                <option value="sports" className="bg-slate-900">Sports</option>
              </select>
            </div>
          </div>

          {selectedRole === 'coordinator' && (
            <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
              <input
                type="checkbox"
                id="useUsername"
                checked={useUsername}
                onChange={(e) => setUseUsername(e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500/50"
              />
              <label htmlFor="useUsername" className="text-sm text-slate-300 cursor-pointer">
                Login with department username
              </label>
            </div>
          )}

          {/* Username/Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              {selectedRole === 'admin'
                ? 'Username'
                : selectedRole === 'coordinator' && useUsername
                  ? 'Department Username'
                  : 'Email'}
            </label>
            <div className="relative">
              {selectedRole === 'admin' || (selectedRole === 'coordinator' && useUsername) ? (
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              ) : (
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              )}
              <input
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
                      ? 'Enter department username'
                      : 'name@example.com'
                }
                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
            {selectedRole === 'coordinator' && useUsername && (
              <p className="text-xs text-slate-500 mt-1">
                Your department-wise unique username (e.g., COORD_CS_001)
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors hover:underline">
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading || !selectedRole || (selectedRole === 'admin' ? !username : useUsername ? !username : !email) || !password}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-slate-400 text-sm">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
