import { useEffect, useState } from 'react'
import { Eye, Shield, TrendingDown, TrendingUp, AlertTriangle, ArrowDownLeft } from 'lucide-react'
import { Card, SectionHeader, Empty, PageSpinner, ProgressBar, StatTile } from '../../components/UI'
import { fmt } from '../../utils/helpers'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#111] border border-[#1f1f1f] rounded-lg px-3 py-2 text-xs">
      <p className="text-[#555]">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-mono">
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  )
}

export default function ParentsTrackingPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 🔥 STATIC REALISTIC PARENT VIEW DATA
    const staticData = {
      totalSent: 25000,
      totalSpent: 18500,
      savings: 6500,

      weekly: [
        { week: "W1", received: 5000, spent: 4200 },
        { week: "W2", received: 7000, spent: 5500 },
        { week: "W3", received: 6000, spent: 4800 },
        { week: "W4", received: 7000, spent: 6000 },
      ],

      categories: [
        { name: "Food", amount: 6500, percentage: 35 },
        { name: "Transport", amount: 3000, percentage: 16 },
        { name: "Shopping", amount: 4000, percentage: 22 },
        { name: "Subscriptions", amount: 2000, percentage: 11 },
        { name: "Others", amount: 3000, percentage: 16 },
      ],

      alert: "Spending has increased by 15% compared to last month. Monitor discretionary expenses."
    }

    setData(staticData)
    setLoading(false)
  }, [])

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <h1 className="page-title">Parent View</h1>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#1f1f1f] border border-[#2a2a2a]">
          <Eye size={11} className="text-[#555]" />
          <span className="text-[#555] text-xs">Read-only</span>
        </div>
      </div>

      {/* Privacy */}
      <Card>
        <div className="flex gap-3">
          <Shield size={14} className="text-white mt-0.5" />
          <div>
            <p className="text-white text-xs font-semibold">What parents see</p>
            <p className="text-[#555] text-xs mt-1">
              Only summary data is shared. Individual transactions are private.
            </p>
          </div>
        </div>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <StatTile label="Sent" value={fmt(data.totalSent)} icon={ArrowDownLeft} />
        <StatTile label="Spent" value={fmt(data.totalSpent)} icon={TrendingDown} />
        <StatTile label="Saved" value={fmt(data.savings)} icon={TrendingUp} />
      </div>

      {/* Weekly Chart */}
      <Card>
        <SectionHeader title="Weekly: Received vs Spent" />
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data.weekly}>
            <XAxis dataKey="week" tick={{ fill: '#555', fontSize: 11 }} />
            <YAxis tick={{ fill: '#555', fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="received" fill="#fff" name="Received" />
            <Bar dataKey="spent" fill="#ef4444" name="Spent" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Categories */}
      <Card>
        <SectionHeader title="Where Money Goes" />
        <div className="space-y-4">
          {data.categories.map(cat => (
            <div key={cat.name}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white">{cat.name}</span>
                <span className="text-white font-mono">{fmt(cat.amount)}</span>
              </div>
              <ProgressBar value={cat.percentage} max={100} color="#fff" />
            </div>
          ))}
        </div>
      </Card>

      {/* Alert */}
      <Card>
        <div className="flex gap-3">
          <AlertTriangle size={14} className="text-warn mt-0.5" />
          <div>
            <p className="text-warn text-xs font-semibold">Spending Alert</p>
            <p className="text-[#555] text-xs mt-1">{data.alert}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}