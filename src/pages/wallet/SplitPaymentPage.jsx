import { useEffect, useState } from 'react'
import { CheckCircle, User, Calculator } from 'lucide-react'
import { Card, SectionHeader, Button, Input, Empty } from '../../components/UI'
import { fmt } from '../../utils/helpers'
import clsx from 'clsx'

export default function SplitPaymentPage() {
  const [amount, setAmount] = useState('')
  const [desc, setDesc] = useState('')
  const [contacts, setContacts] = useState([])
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    // 🔥 STATIC CONTACTS
    setContacts([
      { id: "1", name: "Rahul", upiId: "rahul@upi" },
      { id: "2", name: "Ananya", upiId: "ananya@upi" },
      { id: "3", name: "Vikram", upiId: "vikram@upi" },
      { id: "4", name: "Priya", upiId: "priya@upi" },
    ])
  }, [])

  const toggle = (id) => {
    setSelected(s =>
      s.includes(id) ? s.filter(x => x !== id) : [...s, id]
    )
  }

  const total = Number(amount) || 0
  const count = selected.length + 1
  const perPerson = count > 0 ? total / count : 0

  const handleSend = () => {
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 800)
  }

  if (sent) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <CheckCircle size={36} className="text-up" />
      <div className="text-center">
        <p className="text-white font-semibold">Requests Sent</p>
        <p className="text-[#555] text-sm mt-1">
          {selected.length} people · {fmt(perPerson)} each
        </p>
      </div>
      <Button
        variant="secondary"
        onClick={() => {
          setSent(false)
          setAmount('')
          setDesc('')
          setSelected([])
        }}
      >
        New Split
      </Button>
    </div>
  )

  return (
    <div className="space-y-5">
      <h1 className="page-title">Split Payment</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* FORM */}
        <div className="space-y-4">
          <Card>
            <SectionHeader title="Bill Details" />

            <div className="space-y-4">
              <input
                type="number"
                placeholder="Amount ₹"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="input text-center text-xl"
              />

              <Input
                label="Description"
                placeholder="Dinner, trip, etc"
                value={desc}
                onChange={e => setDesc(e.target.value)}
              />
            </div>
          </Card>

          {/* SUMMARY */}
          {amount && selected.length > 0 && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Calculator size={13} />
                <p className="section-title">Split Summary</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="font-mono">{fmt(total)}</span>
                </div>

                <div className="flex justify-between">
                  <span>People</span>
                  <span>{count}</span>
                </div>

                <div className="flex justify-between font-semibold">
                  <span>Each pays</span>
                  <span>{fmt(perPerson)}</span>
                </div>
              </div>

              <Button
                fullWidth
                className="mt-4"
                loading={loading}
                disabled={!desc}
                onClick={handleSend}
              >
                Send Requests
              </Button>
            </Card>
          )}
        </div>

        {/* CONTACTS */}
        <Card>
          <SectionHeader title="Select People" />

          {contacts.length === 0 ? (
            <Empty icon={User} title="No contacts" />
          ) : (
            <div className="space-y-1">
              {contacts.map(c => {
                const sel = selected.includes(c.id)

                return (
                  <button
                    key={c.id}
                    onClick={() => toggle(c.id)}
                    className={clsx(
                      'w-full flex items-center gap-3 p-3 rounded-lg text-left border',
                      sel
                        ? 'bg-[#1a1a1a] border-[#2a2a2a]'
                        : 'hover:bg-[#111]'
                    )}
                  >
                    <User size={14} />

                    <div className="flex-1">
                      <p className="text-white text-xs">{c.name}</p>
                      <p className="text-[#555] text-[10px]">{c.upiId}</p>
                    </div>

                    {sel && <CheckCircle size={14} className="text-white" />}
                  </button>
                )
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}