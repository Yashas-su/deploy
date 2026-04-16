import { useEffect, useState } from 'react'
import { Send, CheckCircle, Clock, User, X } from 'lucide-react'
import { Card, SectionHeader, Button, Input, Empty, PageSpinner } from '../../components/UI'
import { fmt, fmtDate } from '../../utils/helpers'

export default function RequestMoneyPage() {
  const [contacts, setContacts] = useState([])
  const [pending, setPending] = useState([])
  const [received, setReceived] = useState([])
  const [selected, setSelected] = useState(null)
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    // 🔥 STATIC REALISTIC DATA
    setContacts([
      { id: "1", name: "Dad", upiId: "dad@upi" },
      { id: "2", name: "Mom", upiId: "mom@upi" },
      { id: "3", name: "Roommate", upiId: "roomie@upi" },
    ])

    setPending([
      {
        id: "p1",
        toName: "Dad",
        amount: 2000,
        description: "Books purchase",
        date: "2026-04-10",
      },
    ])

    setReceived([
      {
        id: "r1",
        fromName: "Mom",
        amount: 1500,
        description: "Groceries",
        date: "2026-04-05",
      },
      {
        id: "r2",
        fromName: "Dad",
        amount: 3000,
        description: "Monthly allowance",
        date: "2026-04-01",
      },
    ])

    setLoading(false)
  }, [])

  const handleSend = async () => {
    if (!selected || !amount || !reason) return

    setSending(true)

    // 🔥 FAKE SEND
    setTimeout(() => {
      setPending(prev => [
        {
          id: Date.now().toString(),
          toName: selected.name,
          amount: Number(amount),
          description: reason,
          date: new Date().toISOString(),
        },
        ...prev
      ])

      setSending(false)
      setSent(true)
    }, 800)
  }

  const reset = () => {
    setSent(false)
    setSelected(null)
    setAmount('')
    setReason('')
  }

  if (sent) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Send size={32} className="text-white" />
      <div className="text-center">
        <p className="text-white font-semibold">Request Sent</p>
        <p className="text-[#555] text-sm mt-1">
          {fmt(Number(amount))} requested from {selected?.name}
        </p>
        <p className="text-[#333] text-xs mt-0.5">"{reason}"</p>
      </div>
      <Button variant="secondary" onClick={reset}>
        New Request
      </Button>
    </div>
  )

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-5">
      <h1 className="page-title">Request Money</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* FORM */}
        <div className="space-y-4">
          <Card>
            <SectionHeader title="New Request" />

            <div className="space-y-4">
              {/* Contact Picker */}
              <div>
                <label className="label">Request from</label>

                {selected ? (
                  <div className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                    <User size={14} />
                    <div className="flex-1">
                      <p className="text-white text-xs">{selected.name}</p>
                      <p className="text-[#555] text-[10px]">{selected.upiId}</p>
                    </div>
                    <button onClick={() => setSelected(null)}>
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 border rounded-lg p-1 max-h-40 overflow-y-auto">
                    {contacts.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setSelected(c)}
                        className="w-full text-left p-2 hover:bg-[#1f1f1f] rounded"
                      >
                        <p className="text-white text-xs">{c.name}</p>
                        <p className="text-[#555] text-[10px]">{c.upiId}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <input
                type="number"
                placeholder="Amount ₹"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="input text-center"
              />

              <Input
                label="Reason"
                value={reason}
                onChange={e => setReason(e.target.value)}
              />

              <Button
                fullWidth
                icon={Send}
                loading={sending}
                disabled={!selected || !amount || !reason}
                onClick={handleSend}
              >
                Send Request
              </Button>
            </div>
          </Card>
        </div>

        {/* HISTORY */}
        <div className="space-y-4">
          <Card>
            <SectionHeader title="Pending" />

            {pending.length === 0 ? (
              <Empty title="No pending requests" />
            ) : (
              pending.map(p => (
                <div key={p.id} className="flex justify-between p-3">
                  <div>
                    <p className="text-white text-xs">To {p.toName}</p>
                    <p className="text-[#555] text-[10px]">
                      {p.description} · {fmtDate(p.date)}
                    </p>
                  </div>
                  <span className="text-warn font-mono">
                    {fmt(p.amount)}
                  </span>
                </div>
              ))
            )}
          </Card>

          <Card>
            <SectionHeader title="Received" />

            {received.length === 0 ? (
              <Empty title="No received yet" />
            ) : (
              received.map(r => (
                <div key={r.id} className="flex justify-between p-3">
                  <div>
                    <p className="text-white text-xs">From {r.fromName}</p>
                    <p className="text-[#555] text-[10px]">
                      {r.description} · {fmtDate(r.date)}
                    </p>
                  </div>
                  <span className="text-up font-mono">
                    +{fmt(r.amount)}
                  </span>
                </div>
              ))
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}