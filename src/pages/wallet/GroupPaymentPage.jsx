import { useEffect, useState } from 'react'
import { Users, Plus, ChevronRight, CheckCircle } from 'lucide-react'
import {
  Card,
  SectionHeader,
  Button,
  Input,
  Empty,
  PageSpinner
} from '../../components/UI'
import clsx from 'clsx'

export default function GroupPaymentPage() {
  const [groups, setGroups] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)

  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')

  const [selMembers, setSelMembers] = useState([])
  const [manualPhones, setManualPhones] = useState([])
  const [phoneInput, setPhoneInput] = useState('')

  const [creating, setCreating] = useState(false)

  // ✅ FETCH GROUPS + CONTACTS
  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token')

        // 🔥 FETCH GROUPS
        const gRes = await fetch('/api/group', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const gData = await gRes.json()

        console.log('GROUP API RAW:', gData)

        // ✅ SAFE EXTRACTION
        const groupArray = gData?.group?.group || []

        // ✅ NORMALIZE MEMBERS
        const formattedGroups = groupArray.map(g => ({
          id: g._id,
          name: g.name,
          members: (g.members || []).map(m => m.userid) // flatten
        }))

        console.log('FORMATTED GROUPS:', formattedGroups)

        setGroups(formattedGroups)

        // 🔥 FETCH CONTACTS
        const cRes = await fetch('/api/profile/contacts', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const cData = await cRes.json()

        if (cData?.contacts) {
          setContacts(cData.contacts)
        }

      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  // ✅ SELECT CONTACT
  const toggleMember = (phoneno) => {
    setSelMembers(prev =>
      prev.includes(phoneno)
        ? prev.filter(p => p !== phoneno)
        : [...prev, phoneno]
    )
  }

  // ✅ ADD PHONE
  const addPhone = () => {
    if (!phoneInput) return

    if (!/^\d{10}$/.test(phoneInput)) {
      return alert('Enter valid 10-digit number')
    }

    if (
      manualPhones.includes(phoneInput) ||
      selMembers.includes(phoneInput)
    ) {
      return alert('Already added')
    }

    setManualPhones(prev => [...prev, phoneInput])
    setPhoneInput('')
  }

  const removePhone = (num) => {
    setManualPhones(prev => prev.filter(p => p !== num))
  }

  // ✅ CREATE GROUP
  const handleCreate = async () => {
    const allPhones = [...selMembers, ...manualPhones]

    if (!newName || allPhones.length === 0) {
      return alert('Enter name and members')
    }

    setCreating(true)

    try {
      const res = await fetch('/api/group/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: newName,
          phoneno: allPhones
        })
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || 'Failed')
        return
      }

      // ✅ ADD NEW GROUP
      setGroups(prev => [
        ...prev,
        {
          id: data.group._id,
          name: data.group.name,
          members: (data.group.members || []).map(m => m.userid)
        }
      ])

      // RESET
      setShowNew(false)
      setNewName('')
      setSelMembers([])
      setManualPhones([])
      setPhoneInput('')

    } catch (err) {
      console.error(err)
      alert('Error creating group')
    } finally {
      setCreating(false)
    }
  }

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="page-title">Group Payments</h1>

        <Button size="sm" icon={Plus} onClick={() => setShowNew(v => !v)}>
          {showNew ? 'Cancel' : 'New Group'}
        </Button>
      </div>

      {/* CREATE GROUP */}
      {showNew && (
        <Card>
          <SectionHeader title="Create Group" />

          <div className="space-y-4">

            <Input
              label="Group Name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
            />

            {/* CONTACTS */}
            <div>
              <label className="label">Select Contacts</label>

              {contacts.length === 0 ? (
                <p className="text-xs text-[#555]">No contacts</p>
              ) : (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {contacts.map(c => {
                    const selected = selMembers.includes(c.phoneno)

                    return (
                      <button
                        key={c.phoneno}
                        onClick={() => toggleMember(c.phoneno)}
                        className={clsx(
                          'flex items-center gap-2 p-2 rounded-lg border',
                          selected
                            ? 'bg-[#1f1f1f] border-[#2a2a2a]'
                            : 'border-[#111]'
                        )}
                      >
                        <Users size={12} />

                        <div className="text-left">
                          <p className="text-white text-xs">{c.name}</p>
                          <p className="text-[#555] text-[10px]">{c.phoneno}</p>
                        </div>

                        {selected && (
                          <CheckCircle size={12} className="ml-auto" />
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* MANUAL PHONE */}
            <div>
              <label className="label">Add Phone</label>

              <div className="flex gap-2">
                <input
                  value={phoneInput}
                  onChange={e => setPhoneInput(e.target.value)}
                  className="input text-xs"
                  placeholder="9876543210"
                />
                <Button size="sm" onClick={addPhone}>Add</Button>
              </div>

              {manualPhones.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {manualPhones.map(p => (
                    <div key={p} className="px-2 py-1 bg-[#1f1f1f] rounded text-xs flex gap-1">
                      {p}
                      <button onClick={() => removePhone(p)}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                fullWidth
                loading={creating}
                onClick={handleCreate}
                disabled={!newName || (selMembers.length + manualPhones.length === 0)}
              >
                Create Group
              </Button>

              <Button variant="ghost" onClick={() => setShowNew(false)}>
                Cancel
              </Button>
            </div>

          </div>
        </Card>
      )}

      {/* GROUP LIST */}
      <div>
        <p className="text-xs text-[#555] mb-2">Your Groups</p>

        {groups.length === 0 ? (
          <Card>
            <Empty
              icon={Users}
              title="No groups yet"
              description="Create one to start splitting"
            />
          </Card>
        ) : (
          <div className="space-y-2">
            {groups.map(g => (
              <Card key={g.id}>
                <div className="flex items-center gap-4">

                  <div className="w-10 h-10 bg-[#1f1f1f] rounded-lg flex items-center justify-center">
                    <Users size={16} />
                  </div>

                  <div className="flex-1">
                    <p className="text-white text-sm">{g.name}</p>
                    <p className="text-[#555] text-xs">
                      {g.members.length} members
                    </p>
                  </div>

                  <ChevronRight size={14} className="text-[#333]" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}