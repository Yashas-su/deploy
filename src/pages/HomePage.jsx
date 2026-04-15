import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Wallet, GraduationCap, Zap, QrCode, Send, BarChart2,
  ArrowRight, TrendingDown, TrendingUp, Bell,
} from 'lucide-react'
import { Card, StatTile, SectionHeader, Empty, PageSpinner, ProgressBar } from '../components/UI'
import { fmt, fmtDate } from '../utils/helpers'

// Quick action tiles
const QUICK_ACTIONS = [
  { label: 'UPI Pay',  icon: Zap,      to: '/wallet/upi' },
  { label: 'Scan QR',  icon: QrCode,   to: '/wallet/qr' },
  { label: 'Request',  icon: Send,     to: '/wallet/request' },
  { label: 'Expenses', icon: BarChart2,to: '/wallet/expenses' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [wallet, setWallet] = useState(null)
  const [academics, setAcademics] = useState(null)
  const [txns, setTxns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token")

        const res = await fetch('/api/wallet/balance', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` // ✅ token added
          }
        })

        const data = await res.json()
        console.log("Wallet API response:", data) // debug

        setWallet(data)

      } catch (err) {
        console.error('Failed to fetch wallet:', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="text-[#555] text-sm mt-0.5">
          Welcome back, <span className="text-[#888]">Student</span>
        </p>
      </div>

      {/* Wallet balance */}
      <div
        onClick={() => navigate('/wallet')}
        className="card-interactive rounded-xl p-5 border border-[#1f1f1f] cursor-pointer group"
      >
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-2 text-[#555]">
            <Wallet size={14} />
            <span className="text-xs">Campus Wallet</span>
          </div>
          <ArrowRight size={14} className="text-[#333] group-hover:text-white transition-colors" />
        </div>

        <div className="mb-5">
          <p className="text-[#555] text-xs mb-1">Available Balance</p>
          <p className="text-white text-4xl font-semibold font-mono">
            {fmt(wallet?.balance ?? 0)}
          </p>
          <p className="text-[#333] text-xs font-mono mt-1">
            {wallet?.walletId || 'Wallet ID'}
          </p>
        </div>

        <div className="flex gap-6 pt-4 border-t border-[#1f1f1f]">
          <div>
            <p className="text-[#555] text-xs">Income</p>
            <p className="text-white text-sm font-semibold font-mono mt-0.5">
              {fmt(wallet?.totalIncome ?? 0)}
            </p>
          </div>
          <div>
            <p className="text-[#555] text-xs">Spent</p>
            <p className="text-white text-sm font-semibold font-mono mt-0.5">
              {fmt(wallet?.totalSpent ?? 0)}
            </p>
          </div>
          <div>
            <p className="text-[#555] text-xs">This Month</p>
            <p className="text-white text-sm font-semibold font-mono mt-0.5">
              {fmt(wallet?.monthlySpend ?? 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-2">
        {QUICK_ACTIONS.map(({ label, icon: Icon, to }) => (
          <button key={to}
            onClick={() => navigate(to)}
            className="card-interactive flex flex-col items-center gap-2 py-4 px-2 rounded-xl"
          >
            <div className="w-9 h-9 rounded-lg bg-[#1f1f1f] flex items-center justify-center">
              <Icon size={16} className="text-white" />
            </div>
            <span className="text-[#888] text-xs">{label}</span>
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile label="CGPA" value={academics?.cgpa ?? '—'} icon={GraduationCap} />
        <StatTile label="SGPA" value={academics?.sgpa ?? '—'} icon={TrendingUp} />
        <StatTile label="Attendance" value={academics?.attendance ? `${academics.attendance}%` : '—'} />
        <StatTile label="Spent Today" value={fmt(wallet?.todaySpend ?? 0)} icon={TrendingDown} />
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Transactions */}
        <div className="lg:col-span-2">
          <Card>
            <SectionHeader
              title="Recent Transactions"
              action={
                <button onClick={() => navigate('/wallet')}
                  className="text-[#555] hover:text-white text-xs flex items-center gap-1"
                >
                  View all <ArrowRight size={11} />
                </button>
              }
            />
            {txns.length === 0 ? (
              <Empty title="No transactions yet" />
            ) : (
              <div className="space-y-0 divide-y divide-[#111]">
                {txns.map((tx, i) => (
                  <TxRow key={tx.id || i} tx={tx} />
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Budget + Notice */}
        <div className="space-y-4">
          <Card>
            <SectionHeader title="Monthly Budget" />
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#888]">Spent</span>
                <span className="text-white font-mono">{fmt(wallet?.monthlySpend ?? 0)}</span>
              </div>
              <ProgressBar value={wallet?.monthlySpend ?? 0} max={wallet?.monthlyLimit ?? 1} color="#fff" />
              <div className="flex justify-between text-xs">
                <span className="text-[#555]">Limit</span>
                <span className="text-[#555] font-mono">{fmt(wallet?.monthlyLimit ?? 0)}</span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Bell size={13} className="text-warn" />
              <p className="text-warn text-xs font-medium">Latest Notice</p>
            </div>
            <p className="text-[#555] text-xs">No announcements</p>
            <button
              onClick={() => navigate('/academics/announcements')}
              className="mt-3 text-[#555] hover:text-white text-xs flex items-center gap-1"
            >
              View all <ArrowRight size={11} />
            </button>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Transaction Row
function TxRow({ tx }) {
  const isCredit = tx.type === 'credit'

  return (
    <div className="flex items-center gap-3 py-3">
      <div className="w-8 h-8 rounded-lg bg-[#1f1f1f] flex items-center justify-center">
        {isCredit
          ? <TrendingUp size={14} className="text-up" />
          : <TrendingDown size={14} className="text-down" />
        }
      </div>
      <div className="flex-1">
        <p className="text-white text-xs font-medium">{tx.title || '—'}</p>
        <p className="text-[#555] text-[10px]">{fmtDate(tx.date)}</p>
      </div>
      <p className={`text-xs font-semibold font-mono ${isCredit ? 'text-up' : 'text-white'}`}>
        {isCredit ? '+' : '-'}{fmt(tx.amount)}
      </p>
    </div>
  )
}