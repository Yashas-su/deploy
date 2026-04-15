import { useEffect, useState } from 'react'
import { Eye, Shield, TrendingDown, TrendingUp, AlertTriangle, ArrowDownLeft } from 'lucide-react'
import { Card, SectionHeader, Empty, PageSpinner, ProgressBar, StatTile } from '../../components/UI'
import { fmt } from '../../utils/helpers'
import { walletAPI } from '../../services/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#111] border border-[#1f1f1f] rounded-lg px-3 py-2 text-xs">
      <p className="text-[#555]">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-mono">{p.name}: {fmt(p.value)}</p>
      ))}
    </div>
  )
}

export default function ParentsTrackingPage() {
  const [data,    setData]    = useState(null)   // { totalSent, totalSpent, savings, weekly: [], categories: [] }
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // walletAPI.getParentInsights().then(r => { if (r.data) setData(r.data); setLoading(false) })
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

      {/* Privacy notice */}
      <Card>
        <div className="flex items-start gap-3">
          <Shield size={14} className="text-white flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white text-xs font-semibold">What parents see</p>
            <p className="text-[#555] text-xs mt-0.5 leading-relaxed">
              This dashboard shares aggregated spending totals and category breakdowns with your registered parent
              contact. Individual transaction details are not shared. Manage sharing in Profile → Settings.
            </p>
          </div>
        </div>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <StatTile label="Sent by Parents" value={fmt(data?.totalSent   ?? 0)} icon={ArrowDownLeft} />
        <StatTile label="Total Spent"     value={fmt(data?.totalSpent  ?? 0)} icon={TrendingDown} />
        <StatTile label="Unspent"         value={fmt(data?.savings     ?? 0)} icon={TrendingUp} />
      </div>

      {/* Weekly chart */}
      <Card>
        <SectionHeader title="Weekly: Received vs Spent" />
        {!data?.weekly?.length ? (
          <Empty title="No data yet" />
        ) : (
          <>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={data.weekly} barGap={3} barSize={16}>
                <XAxis dataKey="week" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={v => `₹${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="received" fill="#fff"      radius={[4,4,0,0]} name="Received" opacity={0.7} />
                <Bar dataKey="spent"    fill="#ef4444"   radius={[4,4,0,0]} name="Spent"    opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2 justify-center">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-white opacity-70" />
                <span className="text-[#555] text-xs">Received</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-down" />
                <span className="text-[#555] text-xs">Spent</span>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Category breakdown */}
      <Card>
        <SectionHeader title="Where Money Goes" />
        {!data?.categories?.length ? (
          <Empty title="No categories yet" />
        ) : (
          <div className="space-y-4">
            {data.categories.map(cat => (
              <div key={cat.name}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-white text-xs">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#555] text-xs">{cat.percentage ?? 0}%</span>
                    <span className="text-white font-mono text-xs font-semibold">{fmt(cat.amount)}</span>
                  </div>
                </div>
                <ProgressBar value={cat.percentage ?? 0} max={100} color="#fff" />
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Alert placeholder — comes from backend */}
      {data?.alert && (
        <Card>
          <div className="flex items-start gap-3">
            <AlertTriangle size={14} className="text-warn flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-warn text-xs font-semibold">Spending Alert</p>
              <p className="text-[#555] text-xs mt-0.5">{data.alert}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
