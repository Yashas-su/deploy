import { useEffect, useState } from 'react'
import { BarChart2, TrendingDown, TrendingUp, Lightbulb, AlertTriangle, Info, CheckCircle } from 'lucide-react'
import { Card, SectionHeader, Empty, PageSpinner, ProgressBar, StatTile } from '../../components/UI'
import { fmt } from '../../utils/helpers'
import { walletAPI } from '../../services/api'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'

const SUGGESTION_ICON = {
  warning:  { icon: AlertTriangle, cls: 'text-warn' },
  tip:      { icon: Lightbulb,     cls: 'text-white' },
  insight:  { icon: Info,          cls: 'text-white' },
  positive: { icon: CheckCircle,   cls: 'text-up' },
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#111] border border-[#1f1f1f] rounded-lg px-3 py-2 text-xs">
      <p className="text-[#555]">{label}</p>
      <p className="text-white font-mono font-semibold">{fmt(payload[0].value)}</p>
    </div>
  )
}

export default function ExpenseTrackingPage() {
  const [summary,      setSummary]      = useState(null)   // { totalSpend, avgDaily, savings }
  const [monthly,      setMonthly]      = useState([])     // [{ month, amount }]
  const [categories,   setCategories]   = useState([])     // [{ name, amount, percentage, color }]
  const [suggestions,  setSuggestions]  = useState([])     // [{ type, title, description }]
  const [loading,      setLoading]      = useState(true)

  useEffect(() => {
    const load = async () => {
      /**
       * TODO:
       * const [e, s] = await Promise.all([
       *   walletAPI.getExpenses(),
       *   walletAPI.getAISuggestions(),
       * ])
       * if (e.data) {
       *   setSummary(e.data.summary)
       *   setMonthly(e.data.monthly)
       *   setCategories(e.data.categories)
       * }
       * if (s.data) setSuggestions(s.data)
       */
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-5">
      <h1 className="page-title">Expense Tracking</h1>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatTile label="Total Spend"  value={fmt(summary?.totalSpend ?? 0)} icon={TrendingDown} />
        <StatTile label="Daily Average" value={fmt(summary?.avgDaily ?? 0)}   icon={BarChart2} />
        <StatTile label="Saved"         value={fmt(summary?.savings  ?? 0)}   icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Monthly bar chart */}
        <Card>
          <SectionHeader title="Monthly Spending" />
          {monthly.length === 0 ? (
            <Empty icon={BarChart2} title="No data yet" description="Monthly spending will appear here" />
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={monthly} barSize={24}>
                <XAxis dataKey="month" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" fill="#fff" radius={[4, 4, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Pie chart */}
        <Card>
          <SectionHeader title="By Category" />
          {categories.length === 0 ? (
            <Empty icon={BarChart2} title="No categories yet" />
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={categories} dataKey="amount" nameKey="name"
                  cx="35%" cy="50%" innerRadius={45} outerRadius={70} strokeWidth={0}>
                  {categories.map((c, i) => <Cell key={i} fill={c.color || '#fff'} opacity={0.9} />)}
                </Pie>
                <Tooltip
                  formatter={v => [fmt(v), '']}
                  contentStyle={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: 8, fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Category breakdown */}
      {categories.length > 0 && (
        <Card>
          <SectionHeader title="Category Breakdown" />
          <div className="space-y-4">
            {categories.map(cat => (
              <div key={cat.name}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-white text-xs">{cat.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#555] text-xs">{cat.percentage ?? 0}%</span>
                    <span className="text-white text-xs font-mono font-semibold">{fmt(cat.amount)}</span>
                  </div>
                </div>
                <ProgressBar value={cat.percentage ?? 0} max={100} color={cat.color || '#fff'} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* AI Suggestions */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={14} className="text-[#555]" />
          <p className="section-title">Spending Insights</p>
          <span className="badge-neutral text-[10px]">AI</span>
        </div>
        {suggestions.length === 0 ? (
          <Card><Empty icon={Lightbulb} title="No suggestions yet" description="Insights appear after enough spending data is collected" /></Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {suggestions.map((s, i) => {
              const { icon: Icon, cls } = SUGGESTION_ICON[s.type] || SUGGESTION_ICON.tip
              return (
                <Card key={i}>
                  <div className="flex gap-3">
                    <Icon size={14} className={`${cls} flex-shrink-0 mt-0.5`} />
                    <div>
                      <p className="text-white text-xs font-semibold mb-1">{s.title}</p>
                      <p className="text-[#555] text-xs leading-relaxed">{s.description}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
