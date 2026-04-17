import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, GraduationCap, Building, Hash, User, Edit3, Check, X, LogOut } from 'lucide-react'
import { Card, Button, PageSpinner } from '../components/UI'

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [user, setUser] = useState(null)
  const [form, setForm] = useState({})
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const navigate = useNavigate()

  // ✅ FETCH DATA
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/profile/getme', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

        const data = await res.json()

        if (data.profile) {
          setProfile(data.profile)
          setForm(data.profile)
        }

        if (data.user) {
          setUser(data.user)
        }

      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  // ✅ SAVE PROFILE
  const handleSave = async () => {
    setSaving(true)

    try {
      const res = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          phoneno: form.phoneno,
          college: form.college,
          course: form.course,
          year: form.year
        })
      })

      const data = await res.json()

      if (!data.error) {
        setProfile(form)
        setEditing(false)
      }

    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  if (loading) return <PageSpinner />

  const INFO_FIELDS = [
    { key: 'phoneno', label: 'Phone Number', icon: Phone, type: 'tel' },
    { key: 'college', label: 'College', icon: Building, type: 'text' },
    { key: 'course', label: 'Course', icon: GraduationCap, type: 'text' },
    { key: 'year', label: 'Year', icon: Hash, type: 'number' },
  ]

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <h1 className="text-white text-2xl font-semibold">Profile</h1>

      <Card>
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-[#1f1f1f] flex items-center justify-center">
            <User size={24} className="text-[#555]" />
          </div>

          <div className="flex-1">
            <p className="text-white font-semibold text-base">
              {user?.name || 'User Name'}
            </p>

            <p className="text-[#555] text-xs mt-0.5">
              {profile?.course || 'Course'}
            </p>

            <p className="text-[#333] text-xs">
              Year {profile?.year || '—'} · {profile?.college || 'College'}
            </p>
          </div>

          {/* ✅ EDIT TOGGLE */}
          <Button
            size="sm"
            variant="secondary"
            icon={editing ? X : Edit3}
            onClick={() => {
              setEditing(v => !v)
              if (!editing) setForm(profile)
            }}
          >
            {editing ? 'Cancel' : 'Edit'}
          </Button>
        </div>

        {/* ✅ EDITABLE FIELDS */}
        <div className="mt-5 pt-5 border-t border-[#1f1f1f] grid grid-cols-1 sm:grid-cols-2 gap-4">
          {INFO_FIELDS.map(({ key, label, icon: Icon, type }) => (
            <div key={key} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#1f1f1f] flex items-center justify-center mt-0.5">
                <Icon size={13} className="text-[#555]" />
              </div>

              <div className="flex-1">
                <p className="text-[#555] text-xs">{label}</p>

                {editing ? (
                  <input
                    type={type}
                    value={form[key] || ''}
                    onChange={(e) =>
                      setForm(f => ({ ...f, [key]: e.target.value }))
                    }
                    className="input text-xs py-1.5 mt-0.5"
                  />
                ) : (
                  <p className="text-white text-sm mt-0.5">
                    {key === 'year'
                      ? `Year ${profile?.[key] || '—'}`
                      : profile?.[key] || '—'}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ✅ SAVE BUTTON */}
        {editing && (
          <div className="flex gap-2 mt-4">
            <Button loading={saving} icon={Check} onClick={handleSave}>
              Save Changes
            </Button>
            <Button variant="ghost" onClick={() => setEditing(false)}>
              Discard
            </Button>
          </div>
        )}
      </Card>

      <Card>
        <div className="flex justify-between items-center">
          <p className="text-white text-sm">Sign Out</p>
          <Button variant="danger" icon={LogOut} onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Card>
    </div>
  )
}
