import { useEffect, useState } from 'react'
import { Send, CheckCircle, Clock, User, X } from 'lucide-react'
import { Card, SectionHeader, Button, Input, Empty, PageSpinner } from '../../components/UI'
import { fmt, fmtDate } from '../../utils/helpers'
import { walletAPI } from '../../services/api'

export default function RequestMoneyPage() {
  const [contacts,  setContacts]  = useState([])
  const [pending,   setPending]   = useState([])   // outgoing pending requests
  const [received,  setReceived]  = useState([])   // completed / received
  const [selected,  setSelected]  = useState(null)
  const [amount,    setAmount]    = useState('')
  const [reason,    setReason]    = useState('')
  const [loading,   setLoading]   = useState(true)
  const [sending,   setSending]   = useState(false)
  const [sent,      setSent]      = useState(false)

  useEffect(() => {
    const load = async () => {
      /**
       * TODO:
       * const [c, p, r] = await Promise.all([
       *   walletAPI.getContacts(),
       *   walletAPI.getPendingRequests(),   // outgoing
       *   walletAPI.getTransactions({ type: 'credit', category: 'request' }),
       * ])
       * if (c.data) setContacts(c.data)
       * if (p.data) setPending(p.data)
       * if (r.data) setReceived(r.data.transactions || [])
       */
      setLoading(false)
    }
    load()
  }, [])

  const handleSend = async () => {
    if (!selected || !amount || !reason) return
    setSending(true)
    /**
     * TODO:
     * const { data, error } = await walletAPI.requestMoney({
     *   toUserId: selected.id,
     *   amount: Number(amount),
     *   description: reason,
     * })
     * if (error) { alert(error); setSending(false); return }
     */
    setTimeout(() => { setSending(false); setSent(true) }, 800)
  }

  const reset = () => { setSent(false); setSelected(null); setAmount(''); setReason('') }

  if (sent) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Send size={32} className="text-white" />
      <div className="text-center">
        <p className="text-white font-semibold">Request Sent</p>
        <p className="text-[#555] text-sm mt-1">{fmt(Number(amount))} requested from {selected?.name}</p>
        <p className="text-[#333] text-xs mt-0.5">"{reason}"</p>
      </div>
      <Button variant="secondary" onClick={reset}>New Request</Button>
    </div>
  )

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-5">
      <h1 className="page-title">Request Money</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Form */}
        <div className="space-y-4">
          <Card>
            <SectionHeader title="New Request" />
            <div className="space-y-4">
              {/* Contact picker */}
              <div>
                <label className="label">Request from</label>
                {selected ? (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
                    <div className="w-8 h-8 rounded-lg bg-[#1f1f1f] flex items-center justify-center flex-shrink-0">
                      <User size={13} className="text-[#555]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium">{selected.name}</p>
                      <p className="text-[#555] text-[10px] font-mono">{selected.upiId}</p>
                    </div>
                    <button onClick={() => setSelected(null)}>
                      <X size={13} className="text-[#555] hover:text-white" />
                    </button>
                  </div>
                ) : contacts.length === 0 ? (
                  <p className="text-[#333] text-xs p-3 rounded-lg border border-[#1f1f1f]">
                    No contacts yet — contacts appear after transactions
                  </p>
                ) : (
                  <div className="space-y-1 max-h-40 overflow-y-auto border border-[#1f1f1f] rounded-lg p-1">
                    {contacts.map(c => (
                      <button key={c.id} onClick={() => setSelected(c)}
                        className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#1f1f1f] text-left transition-colors">
                        <div className="w-7 h-7 rounded-md bg-[#1f1f1f] flex items-center justify-center flex-shrink-0">
                          <User size={12} className="text-[#555]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-white text-xs">{c.name}</p>
                          <p className="text-[#555] text-[10px] font-mono">{c.upiId}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="label">Amount (₹)</label>
                <input type="number" placeholder="0.00"
                  value={amount} onChange={e => setAmount(e.target.value)}
                  className="input font-mono text-xl text-center" />
              </div>

              <Input label="Reason" placeholder="What's this for?"
                value={reason} onChange={e => setReason(e.target.value)} />

              <Button fullWidth icon={Send} loading={sending}
                disabled={!selected || !amount || !reason}
                onClick={handleSend}>
                Send Request
              </Button>
            </div>
          </Card>
        </div>

        {/* History */}
        <div className="space-y-4">
          <Card>
            <SectionHeader title="Pending" />
            {pending.length === 0 ? (
              <Empty icon={Clock} title="No pending requests" />
            ) : (
              <div className="space-y-2">
                {pending.map((r, i) => (
                  <div key={r.id || i} className="flex items-center gap-3 p-3 rounded-lg bg-[#0a0a0a]">
                    <Clock size={13} className="text-warn flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium">From {r.toName}</p>
                      <p className="text-[#555] text-[10px]">{r.description} · {fmtDate(r.date)}</p>
                    </div>
                    <p className="text-warn font-mono text-sm font-semibold flex-shrink-0">{fmt(r.amount)}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <SectionHeader title="Received" />
            {received.length === 0 ? (
              <Empty icon={CheckCircle} title="No received payments yet" />
            ) : (
              <div className="space-y-2">
                {received.map((r, i) => (
                  <div key={r.id || i} className="flex items-center gap-3 p-3 rounded-lg bg-[#0a0a0a]">
                    <CheckCircle size={13} className="text-up flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium">From {r.fromName}</p>
                      <p className="text-[#555] text-[10px]">{r.description} · {fmtDate(r.date)}</p>
                    </div>
                    <p className="text-up font-mono text-sm font-semibold flex-shrink-0">+{fmt(r.amount)}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
