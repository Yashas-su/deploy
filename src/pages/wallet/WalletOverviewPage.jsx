import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowDownLeft, ArrowUpRight, Plus, RefreshCw,
  Zap, QrCode, SplitSquareHorizontal, Users, Bus,
  BarChart2, Send, Eye, TrendingDown, TrendingUp,
} from 'lucide-react'
import {
  Card, SectionHeader, Button, Tabs, Empty, PageSpinner, ProgressBar
} from '../../components/UI'
import { fmt, fmtDate } from '../../utils/helpers'

const WALLET_ACTIONS = [
  { label: 'UPI Pay', icon: Zap, to: '/wallet/upi' },
  { label: 'Scan QR', icon: QrCode, to: '/wallet/qr' },
  { label: 'Split', icon: SplitSquareHorizontal, to: '/wallet/split' },
  { label: 'Groups', icon: Users, to: '/wallet/groups' },
  { label: 'Transport', icon: Bus, to: '/wallet/transport' },
  { label: 'Expenses', icon: BarChart2, to: '/wallet/expenses' },
  { label: 'Request', icon: Send, to: '/wallet/request' },
  { label: 'Parents', icon: Eye, to: '/wallet/parents' },
]

const TX_TABS = [
  { id: 'all', label: 'All' },
  { id: 'credit', label: 'Money In' },
  { id: 'debit', label: 'Money Out' },
]

export default function WalletOverviewPage() {
  const navigate = useNavigate()

  const [overview, setOverview] = useState(null)
  const [txns, setTxns] = useState([])
  const [tab, setTab] = useState('all')
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token')

        // ✅ 1. GET USER (IMPORTANT)
        const profileRes = await fetch('/api/profile/getme', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const profileData = await profileRes.json()

        const currentUserId = profileData.profile?.userid
        setUserId(currentUserId)

        // ✅ 2. GET BALANCE
        const balanceRes = await fetch('/api/wallet/balance', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const balanceData = await balanceRes.json()

        let balance = balanceData.balance || 0

        // ✅ 3. GET TRANSACTIONS
        const txRes = await fetch('/api/transaction/history', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const txData = await txRes.json()

        let mapped = []
        let income = 0
        let spent = 0

        if (txData.transactions && currentUserId) {
          mapped = txData.transactions.map(tx => {
            const isDebit = String(tx.senderid) === String(currentUserId)

            if (isDebit) spent += tx.amount
            else income += tx.amount

            return {
              id: tx._id,
              amount: tx.amount,
              type: isDebit ? 'debit' : 'credit', // ✅ FIXED
              date: tx.createdAt,
              status: tx.status,
              method: tx.type,
              title: isDebit ? 'Money Sent' : 'Money Received',
            }
          }).reverse()
        }

        setTxns(mapped)

        // ✅ 4. SET OVERVIEW
        setOverview({
          balance,
          totalIncome: income,
          totalSpent: spent,
          monthlySpend: spent,
          monthlyLimit: 1000,
        })

      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const filtered = tab === 'all'
    ? txns
    : txns.filter(t => t.type === tab)

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title">Wallet</h1>
        <p className="text-[#555] text-sm mt-0.5">
          Manage your campus finances
        </p>
      </div>

      {/* Balance */}
      <div className="card rounded-xl overflow-hidden">
        <div className="p-5 border-b border-[#1f1f1f]">
          <p className="text-[#555] text-xs mb-2">Total Balance</p>
          <p className="text-white text-5xl font-mono">
            {fmt(overview?.balance ?? 0)}
          </p>
        </div>

        <div className="grid grid-cols-2 divide-x divide-[#1f1f1f]">
          <div className="p-4 flex items-center gap-3">
            <ArrowDownLeft size={14} className="text-up" />
            <div>
              <p className="text-[#555] text-xs">Income</p>
              <p className="text-white font-mono">
                {fmt(overview?.totalIncome ?? 0)}
              </p>
            </div>
          </div>

          <div className="p-4 flex items-center gap-3">
            <ArrowUpRight size={14} className="text-down" />
            <div>
              <p className="text-[#555] text-xs">Spent</p>
              <p className="text-white font-mono">
                {fmt(overview?.totalSpent ?? 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button icon={Plus} fullWidth>Add Money</Button>
        <Button icon={RefreshCw} fullWidth variant="secondary">
          Transfer
        </Button>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-4 gap-2">
        {WALLET_ACTIONS.map(({ label, icon: Icon, to }) => (
          <button key={to} onClick={() => navigate(to)}
            className="card-interactive flex flex-col items-center gap-2 py-4 rounded-xl">
            <div className="w-9 h-9 bg-[#1f1f1f] flex items-center justify-center rounded-lg">
              <Icon size={16} />
            </div>
            <span className="text-[#888] text-xs">{label}</span>
          </button>
        ))}
      </div>

      {/* Transactions */}
      <Card>
        <SectionHeader title="Transactions" />

        <div className="mb-4">
          <Tabs tabs={TX_TABS} active={tab} onChange={setTab} />
        </div>

        {filtered.length === 0 ? (
          <Empty title="No transactions" />
        ) : (
          <div className="divide-y divide-[#0a0a0a]">
            {filtered.map(tx => {
              const isCredit = tx.type === 'credit'

              return (
                <div key={tx.id} className="flex items-center gap-3 py-3">

                  <div className="w-8 h-8 bg-[#1f1f1f] flex items-center justify-center rounded-lg">
                    {isCredit
                      ? <TrendingUp size={13} className="text-up" />
                      : <TrendingDown size={13} className="text-down" />}
                  </div>

                  <div className="flex-1">
                    <p className="text-white text-xs font-medium">
                      {tx.title}
                    </p>
                    <p className="text-[#555] text-[10px]">
                      {fmtDate(tx.date)} · {tx.method}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className={`text-xs font-mono ${isCredit ? 'text-up' : 'text-white'}`}>
                      {isCredit ? '+' : '-'}{fmt(tx.amount)}
                    </p>
                    <p className="text-[#333] text-[10px]">
                      {tx.status}
                    </p>
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}