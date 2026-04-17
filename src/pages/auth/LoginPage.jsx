import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, CreditCard, ArrowRight } from 'lucide-react'
import { Input, Button } from '../../components/UI'

const API_BASE = import.meta.env.VITE_API_URL || ''

export default function LoginPage() {
  const [show, setShow]   = useState(false)
  const [form, setForm]   = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) { setError('All fields are required'); return }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || data.error || 'Invalid credentials')
        return
      }
      localStorage.setItem('token', data.token)
      navigate('/home')
    } catch (err) {
      setError('Network error — please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-3">
            <CreditCard size={20} className="text-black" />
          </div>
          <h1 className="text-white text-xl font-semibold">CampusWallet</h1>
          <p className="text-[#555] text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="card p-6 space-y-4">
          {error && (
            <div className="bg-red-950 border border-red-900 rounded-lg px-3 py-2 text-red-400 text-xs">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email / Roll Number"
              type="email"
              icon={Mail}
              placeholder="you@college.edu"
              value={form.email}
              onChange={set('email')}
            />
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555] pointer-events-none" />
                <input
                  type={show ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set('password')}
                  className="input pl-9 pr-9"
                />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-white">
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button type="button" className="text-[#555] text-xs hover:text-white">Forgot password?</button>
            </div>

            <Button type="submit" fullWidth loading={loading} icon={ArrowRight} iconPos="right">
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center text-[#555] text-xs mt-4">
          New student?{' '}
          <Link to="/register" className="text-white hover:underline">Create account</Link>
        </p>
      </div>
    </div>
  )
}
