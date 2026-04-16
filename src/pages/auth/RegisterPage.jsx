import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Hash, ArrowRight, CreditCard, Phone, BookOpen, Calendar, Building2, MapPin, Tag, ImageIcon } from 'lucide-react'
import { Input, Button } from '../../components/UI'

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', rollno: '',
    college: '', course: '', year: '',
    section: '', address: '', image: '',
    password: '', confirm: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name)     e.name     = 'Required'
    if (!form.email)    e.email    = 'Required'
    if (!form.rollno)   e.rollno   = 'Required'
    if (!form.phone)    e.phone    = 'Required'
    else if (!/^\d{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit number'
    if (!form.college)  e.college  = 'Required'
    if (!form.course)   e.course   = 'Required'
    if (!form.year)     e.year     = 'Required'
    if (!form.section)  e.section  = 'Required'
    if (!form.address)  e.address  = 'Required'
    if (form.password.length < 8) e.password = 'Min 8 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
      name:     form.name,
  email:    form.email,
  password: form.password,
  section:  form.section,
  college:  form.college,
  phoneno:  form.phone,
  rollno:   form.rollno,
  address:  form.address,
  course:   form.course,
  image:    form.image,
  year:     parseInt(form.year)   // ← converts "1st Year" string to int
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrors({ form: data.message || data.error || 'Registration failed' })
        return
      }

      localStorage.setItem('token', data.token)
      navigate('/home')
    } catch (err) {
      setErrors({ form: 'Network error — please try again' })
    } finally {
      setLoading(false)
    }
  }

  const YEAR_OPTIONS = ['1', '2', '3', '4', '5']

  const fields = [
    { key: 'name',    label: 'Full Name',     icon: User,      type: 'text',  placeholder: 'Your full name' },
    { key: 'email',   label: 'College Email',  icon: Mail,      type: 'email', placeholder: 'you@college.edu' },
    { key: 'phone',   label: 'Phone Number',   icon: Phone,     type: 'tel',   placeholder: '10-digit mobile number' },
    { key: 'college', label: 'College',        icon: Building2, type: 'text',  placeholder: 'e.g. IIT Bombay' },
    { key: 'course',  label: 'Course',         icon: BookOpen,  type: 'text',  placeholder: 'e.g. B.Tech CSE' },
    { key: 'rollno',  label: 'Roll Number',    icon: Hash,      type: 'text',  placeholder: 'e.g. CS2021042' },
    { key: 'section', label: 'Section',        icon: Tag,       type: 'text',  placeholder: 'e.g. A' },
    { key: 'address', label: 'Address',        icon: MapPin,    type: 'text',  placeholder: 'e.g. Hostel Block B' },
    { key: 'image',   label: 'Profile Image URL', icon: ImageIcon, type: 'url', placeholder: 'https://...' },
  ]

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-3">
            <CreditCard size={20} className="text-black" />
          </div>
          <h1 className="text-white text-xl font-semibold">Create Account</h1>
          <p className="text-[#555] text-sm mt-1">Join CampusWallet today</p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-3">

            {errors.form && (
              <div className="bg-red-950 border border-red-900 rounded-lg px-3 py-2 text-red-400 text-xs">
                {errors.form}
              </div>
            )}

            {fields.map(({ key, label, icon, type, placeholder }) => (
              <Input key={key} label={label} icon={icon} type={type} placeholder={placeholder}
                value={form[key]} onChange={set(key)} error={errors[key]} />
            ))}

            {/* Year of Study — dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#888] font-medium">Year of Study</label>
              <div className="relative">
                <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555] pointer-events-none" />
                <select
                  value={form.year}
                  onChange={set('year')}
                  className={`w-full bg-[#111] border ${errors.year ? 'border-red-500' : 'border-[#222]'} rounded-lg pl-9 pr-3 py-2.5 text-sm text-white appearance-none focus:outline-none focus:border-[#444] transition-colors`}
                >
                  <option value="" disabled>Select year</option>
                  {YEAR_OPTIONS.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] pointer-events-none text-xs">▾</span>
              </div>
              {errors.year && <p className="text-red-500 text-xs">{errors.year}</p>}
            </div>

            <Input label="Password" icon={Lock} type="password" placeholder="Min 8 characters"
              value={form.password} onChange={set('password')} error={errors.password} />
            <Input label="Confirm Password" icon={Lock} type="password" placeholder="Re-enter password"
              value={form.confirm} onChange={set('confirm')} error={errors.confirm} />

            <div className="pt-1">
              <Button type="submit" fullWidth loading={loading} icon={ArrowRight} iconPos="right">
                Create Account
              </Button>
            </div>
          </form>
        </div>

        <p className="text-center text-[#555] text-xs mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}