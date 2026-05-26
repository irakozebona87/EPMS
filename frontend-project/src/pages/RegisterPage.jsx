import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'
import Layout from '../components/Layout'

export default function RegisterPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    const body = Object.fromEntries(new FormData(e.target).entries())

    if (typeof body.fullName !== 'string' || body.fullName.trim().length < 3) {
      setError('Full name must be a string of at least 3 characters')
      return
    }
    if (typeof body.username !== 'string' || !/^[A-Za-z]+$/.test(body.username.trim())) {
      setError('Username must contain only letters (no numbers or symbols)')
      return
    }
    if (typeof body.password !== 'string' || body.password.length < 6) {
      setError('Password must be a string of at least 6 characters')
      return
    }
    if (body.password !== body.confirmPassword) {
      setError('Password and confirm password do not match')
      return
    }

    setLoading(true)
    try {
      await api('/auth/register', 'POST', body)
      e.target.reset()
      navigate('/login')
    } catch (err) {
      setError(err?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout title="Create Account">
      <div className="max-w-md mx-auto my-8">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-xl shadow-indigo-950/5 p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4 border border-indigo-100">
              <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">HR Registration</h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">Create a manager account to access system resources.</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Full Name</label>
              <input 
                name="fullName" 
                placeholder="John Doe" 
                className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium placeholder:text-slate-400" 
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Username</label>
              <input 
                name="username" 
                placeholder="johndoe" 
                minLength={3}
                className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium placeholder:text-slate-400" 
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Password</label>
              <input 
                name="password" 
                type="password"
                placeholder="•••••••• (Min 6 chars)" 
                minLength={6}
                className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium placeholder:text-slate-400" 
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Confirm Password</label>
              <input 
                name="confirmPassword" 
                type="password"
                placeholder="••••••••" 
                minLength={6}
                className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium placeholder:text-slate-400" 
                required 
              />
            </div>

            {error ? (
                <div role="alert" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-medium">
                  <svg className="w-5 h-5 text-amber-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M6.938 4h10.124c1.54 0 2.502 1.667 1.732 3L13.732 20c-.77 1.333-2.694 1.333-3.464 0L3.34 7c-.77-1.333.192-3 1.732-3z" />
                  </svg>
                  <span>{error}</span>
                </div>
              ) : null}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Already have an HR account?{' '}
              <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
