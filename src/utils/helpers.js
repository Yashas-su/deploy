export const fmt = (n, currency = '₹') =>
  `${currency}${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`

export const fmtDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0)

export const attendanceColor = (p) => p >= 85 ? 'text-up' : p >= 75 ? 'text-warn' : 'text-down'
export const attendanceBg    = (p) => p >= 85 ? '#22c55e' : p >= 75 ? '#eab308' : '#ef4444'

export const gradeColor = (g) => {
  const m = { 'O': 'text-up', 'A+': 'text-up', 'A': 'text-up', 'B+': 'text-white', 'B': 'text-white', 'C': 'text-warn', 'F': 'text-down' }
  return m[g] || 'text-soft'
}

export const deltaColor = (v) => v > 0 ? 'text-up' : v < 0 ? 'text-down' : 'text-[#888]'
export const deltaIcon  = (v) => v > 0 ? '↑' : v < 0 ? '↓' : '—'
