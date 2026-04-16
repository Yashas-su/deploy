import { useEffect, useState } from 'react'
import { Zap, ChevronRight, CheckCircle, User } from 'lucide-react'
import { Card, SectionHeader, Button, Input, Empty } from '../../components/UI'
import { fmt } from '../../utils/helpers'

const QUICK_AMOUNTS = [50, 100, 200, 500]

export default function UPIPaymentPage() {
  const [upi, setUpi] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [contacts, setContacts] = useState([])
  const [step, setStep] = useState('form')
  const [loading, setLoading] = useState(false)
  const [txnId, setTxnId] = useState('')

  useEffect(() => {
    // future: fetch contacts
  }, [])

  const handleVerify = async () => {
    if (!upi || !amount) return alert('Enter details')
    if (Number(amount) <= 0) return alert('Enter valid amount')

    setStep('confirm')
  }

  const handlePay = async () => {
    setLoading(true)

    try {
      const res = await fetch('/api/transaction/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          phoneno: upi,                 // 🔥 mapping UPI → phone
          amount: Number(amount),
          type: 'upi',
        })
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || 'Payment failed')
        setLoading(false)
        return
      }

      // ✅ success
      setTxnId(data.transactionId || '—')
      setStep('success')

    } catch (err) {
      console.error(err)
      alert('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setStep('form')
    setUpi('')
    setAmount('')
    setNote('')
    setTxnId('')
  }

  // ✅ SUCCESS SCREEN
  if (step === 'success') return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-16 h-16 rounded-full border border-[#1f1f1f] flex items-center justify-center">
        <CheckCircle size={28} className="text-up" />
      </div>

      <div className="text-center">
        <p className="text-white text-lg font-semibold">Payment Sent</p>
        <p className="text-[#555] text-sm mt-1">
          {fmt(Number(amount))} to {upi}
        </p>
        {note && (
          <p className="text-[#333] text-xs mt-1">
            "{note}"
          </p>
        )}
      </div>

      <p className="text-[#333] text-xs font-mono">
        Txn ID: {txnId}
      </p>

      <Button variant="secondary" onClick={reset}>
        New Payment
      </Button>
    </div>
  )

  // ✅ CONFIRM SCREEN
  if (step === 'confirm') return (
    <div className="max-w-sm mx-auto space-y-4">
      <h1 className="page-title">Confirm Payment</h1>

      <Card>
        <div className="space-y-4">
          <div className="text-center py-4 border-b border-[#1f1f1f]">
            <p className="text-[#555] text-xs mb-1">Paying to</p>
            <p className="text-white font-semibold">{upi}</p>
          </div>

          <div className="flex justify-between">
            <span className="text-[#555]">Amount</span>
            <span className="text-white font-mono text-xl">
              {fmt(Number(amount))}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#555]">Note</span>
            <span className="text-[#888]">
              {note || '—'}
            </span>
          </div>

          <div className="pt-2 space-y-2">
            <Button
              fullWidth
              loading={loading}
              onClick={handlePay}
              icon={Zap}
            >
              Pay {fmt(Number(amount))}
            </Button>

            <Button
              fullWidth
              variant="ghost"
              onClick={() => setStep('form')}
            >
              Back
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )

  // ✅ MAIN FORM
  return (
    <div className="space-y-5">
      <h1 className="page-title">UPI Payment</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Form */}
        <Card>
          <SectionHeader title="Enter Details" />

          <div className="space-y-4">
            <Input
              label="UPI ID / Phone"
              placeholder="name@upi or 9876543210"
              value={upi}
              onChange={e => setUpi(e.target.value)}
            />

            <div>
              <label className="label">Amount (₹)</label>

              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="input font-mono text-xl text-center"
              />

              <div className="flex gap-2 mt-2">
                {QUICK_AMOUNTS.map(a => (
                  <button
                    key={a}
                    onClick={() => setAmount(String(a))}
                    className="flex-1 py-1.5 rounded-lg bg-[#1f1f1f] text-[#888] text-xs hover:bg-[#2a2a2a] hover:text-white"
                  >
                    ₹{a}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Note (optional)"
              placeholder="What's this for?"
              value={note}
              onChange={e => setNote(e.target.value)}
            />

            <Button
              fullWidth
              size="lg"
              onClick={handleVerify}
              disabled={!upi || !amount}
              icon={Zap}
            >
              Continue
            </Button>
          </div>
        </Card>

        {/* Contacts */}
        <Card>
          <SectionHeader title="Recent Contacts" />

          {contacts.length === 0 ? (
            <Empty
              icon={User}
              title="No contacts yet"
              description="Your recent payments will appear here"
            />
          ) : (
            <div className="space-y-1">
              {contacts.map(c => (
                <button
                  key={c.id}
                  onClick={() => setUpi(c.upiId)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#1f1f1f]"
                >
                  <User size={13} />
                  <div>
                    <p>{c.name}</p>
                    <p>{c.upiId}</p>
                  </div>
                  <ChevronRight size={13} />
                </button>
              ))}
            </div>
          )}
        </Card>

      </div>
    </div>
  )
}