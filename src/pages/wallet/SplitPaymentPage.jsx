import { useEffect, useState } from 'react'
import { CheckCircle, User, Calculator } from 'lucide-react'
import { Card, SectionHeader, Button, Input, Empty } from '../../components/UI'
import { fmt } from '../../utils/helpers'
import { walletAPI } from '../../services/api'
import clsx from 'clsx'

export default function SplitPaymentPage() {
  const [amount,   setAmount]   = useState('')
  const [desc,     setDesc]     = useState('')
  const [contacts, setContacts] = useState([])   // from API
  const [selected, setSelected] = useState([])
  const [loading,  setLoading]  = useState(false)
  const [sent,     setSent]     = useState(false)

  useEffect(() => {
    // walletAPI.getContacts().then(r => { if (r.data) setContacts(r.data) })
  }, [])

  const toggle = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  const total  = Number(amount) || 0
  const count  = selected.length + 1   // +1 for self
  const perPerson = count > 1 ? total / count : total

  const handleSend = async () => {
    setLoading(true)
    /**
     * TODO:
     * const { data, error } = await walletAPI.splitCreate({
     *   amount: total,
     *   description: desc,
     *   memberIds: selected,
     * })
     * if (error) { alert(error); setLoading(false); return }
     */
    setTimeout(() => { setLoading(false); setSent(true) }, 800)
  }

  if (sent) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <CheckCircle size={36} className="text-up" />
      <div className="text-center">
        <p className="text-white font-semibold">Requests Sent</p>
        <p className="text-[#555] text-sm mt-1">
          {selected.length} {selected.length === 1 ? 'person' : 'people'} · {fmt(perPerson)} each
        </p>
      </div>
      <Button variant="secondary" onClick={() => { setSent(false); setAmount(''); setDesc(''); setSelected([]) }}>
        New Split
      </Button>
    </div>
  )

  return (
    <div className="space-y-5">
      <h1 className="page-title">Split Payment</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Form */}
        <div className="space-y-4">
          <Card>
            <SectionHeader title="Bill Details" />
            <div className="space-y-4">
              <div>
                <label className="label">Total Amount (₹)</label>
                <input type="number" placeholder="0.00"
                  value={amount} onChange={e => setAmount(e.target.value)}
                  className="input font-mono text-2xl text-center" />
              </div>
              <Input label="Description"
                placeholder="Dinner, movie tickets, groceries…"
                value={desc} onChange={e => setDesc(e.target.value)} />
            </div>
          </Card>

          {/* Summary */}
          {amount && selected.length > 0 && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Calculator size={13} className="text-[#555]" />
                <p className="section-title">Split Summary</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#555]">Total</span>
                  <span className="text-white font-mono">{fmt(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#555]">People (incl. you)</span>
                  <span className="text-white">{count}</span>
                </div>
                <div className="border-t border-[#1f1f1f] pt-2 flex justify-between">
                  <span className="text-[#888]">Each pays</span>
                  <span className="text-white text-lg font-semibold font-mono">{fmt(perPerson)}</span>
                </div>
              </div>
              <Button fullWidth className="mt-4" loading={loading}
                disabled={!desc} onClick={handleSend}>
                Send Requests
              </Button>
            </Card>
          )}
        </div>

        {/* Contacts */}
        <Card>
          <SectionHeader title="Select People"
            action={selected.length > 0 && (
              <span className="text-[#888] text-xs">{selected.length} selected</span>
            )}
          />
          {contacts.length === 0 ? (
            <Empty icon={User} title="No contacts"
              description="Contacts from your transaction history will appear here" />
          ) : (
            <div className="space-y-1">
              {contacts.map(c => {
                const sel = selected.includes(c.id)
                return (
                  <button key={c.id} onClick={() => toggle(c.id)}
                    className={clsx('w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left border',
                      sel ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'border-transparent hover:bg-[#111]')}>
                    <div className="w-8 h-8 rounded-lg bg-[#1f1f1f] flex items-center justify-center flex-shrink-0">
                      <User size={13} className="text-[#555]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">{c.name}</p>
                      <p className="text-[#555] text-[10px] font-mono truncate">{c.upiId}</p>
                    </div>
                    <div className={clsx('w-4 h-4 rounded border flex items-center justify-center transition-all',
                      sel ? 'bg-white border-white' : 'border-[#2a2a2a]')}>
                      {sel && <CheckCircle size={10} className="text-black" />}
                    </div>
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
