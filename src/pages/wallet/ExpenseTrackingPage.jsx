import { useEffect, useState } from 'react'
import { BarChart2, TrendingDown, TrendingUp, Lightbulb, AlertTriangle, Info, CheckCircle } from 'lucide-react'
import { Card, SectionHeader, Empty, PageSpinner, ProgressBar, StatTile } from '../../components/UI'
import { fmt } from '../../utils/helpers'
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
  const [summary, setSummary] = useState(null)
  const [monthly, setMonthly] = useState([])
  const [categories, setCategories] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 🔥 STATIC REALISTIC EXPENSE DATA
    setSummary({
      totalSpend: 18500,
      avgDaily: 620,
      savings: 4500,
    })

    setMonthly([
      { month: "Jan", amount: 12000 },
      { month: "Feb", amount: 15000 },
      { month: "Mar", amount: 18500 },
      { month: "Apr", amount: 17000 },
    ])

    setCategories([
      { name: "Food", amount: 6500, percentage: 35, color: "#22c55e" },
      { name: "Transport", amount: 3000, percentage: 16, color: "#3b82f6" },
      { name: "Shopping", amount: 4000, percentage: 22, color: "#eab308" },
      { name: "Subscriptions", amount: 2000, percentage: 11, color: "#a855f7" },
      { name: "Others", amount: 3000, percentage: 16, color: "#888" },
    ])

    setSuggestions([
      {
        type: "warning",
        title: "High spending on food",
        description: "You spent 35% of your budget on food. Try reducing outside orders."
      },
      {
        type: "tip",
        title: "Optimize subscriptions",
        description: "You have multiple subscriptions. Consider cancelling unused ones."
      },
      {
        type: "insight",
        title: "Spending increased this month",
        description: "Your expenses increased by 12% compared to last month."
      },
      {
        type: "positive",
        title: "Good savings habit",
        description: "You saved ₹4500 this month. Keep it up!"
      }
    ])

    setLoading(false)
  }, [])

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-5">
      <h1 className="page-title">Expense Tracking</h1>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <StatTile label="Total Spend" value={fmt(summary.totalSpend)} icon={TrendingDown} />
        <StatTile label="Daily Average" value={fmt(summary.avgDaily)} icon={BarChart2} />
        <StatTile label="Saved" value={fmt(summary.savings)} icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Bar Chart */}
        <Card>
          <SectionHeader title="Monthly Spending" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthly}>
              <XAxis dataKey="month" tick={{ fill: '#555', fontSize: 11 }} />
              <YAxis tick={{ fill: '#555', fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" fill="#fff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart */}
        <Card>
          <SectionHeader title="By Category" />
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={categories} dataKey="amount" nameKey="name"
                cx="35%" cy="50%" innerRadius={45} outerRadius={70}>
                {categories.map((c, i) => (
                  <Cell key={i} fill={c.color} />
                ))}
              </Pie>
              <Tooltip formatter={v => [fmt(v), '']} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Breakdown */}
      <Card>
        <SectionHeader title="Category Breakdown" />
        <div className="space-y-4">
          {categories.map(cat => (
            <div key={cat.name}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white">{cat.name}</span>
                <span className="text-white font-mono">{fmt(cat.amount)}</span>
              </div>
              <ProgressBar value={cat.percentage} max={100} color={cat.color} />
            </div>
          ))}
        </div>
      </Card>

      {/* Suggestions */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={14} className="text-[#555]" />
          <p className="section-title">Spending Insights</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {suggestions.map((s, i) => {
            const { icon: Icon, cls } = SUGGESTION_ICON[s.type]
            return (
              <Card key={i}>
                <div className="flex gap-3">
                  <Icon size={14} className={cls} />
                  <div>
                    <p className="text-white text-xs font-semibold">{s.title}</p>
                    <p className="text-[#555] text-xs">{s.description}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}