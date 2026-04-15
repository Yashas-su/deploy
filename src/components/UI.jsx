import clsx from 'clsx'
import { Inbox, Loader2 } from 'lucide-react'

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className = '', onClick }) {
  return (
    <div onClick={onClick} className={clsx(onClick ? 'card-interactive' : 'card', 'p-5', className)}>
      {children}
    </div>
  )
}

// ─── Section header row ───────────────────────────────────────────────────────
export function SectionHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <p className="section-title">{title}</p>
      {action}
    </div>
  )
}

// ─── Stat tile ────────────────────────────────────────────────────────────────
export function StatTile({ label, value = '—', sub, delta, icon: Icon }) {
  const up = delta > 0, down = delta < 0
  return (
    <div className="card p-4 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <p className="text-[#888] text-xs">{label}</p>
        {Icon && <Icon size={14} className="text-[#555]" />}
      </div>
      <p className="stat-value">{value}</p>
      {sub && <p className="text-[#555] text-xs">{sub}</p>}
      {delta !== undefined && (
        <p className={clsx('text-xs font-medium', up ? 'text-up' : down ? 'text-down' : 'text-[#555]')}>
          {up ? '↑' : down ? '↓' : ''} {Math.abs(delta)}% vs last month
        </p>
      )}
    </div>
  )
}

// ─── Button ───────────────────────────────────────────────────────────────────
export function Button({ children, variant = 'primary', size, icon: Icon, iconPos = 'left', loading, disabled, fullWidth, className = '', onClick, type = 'button' }) {
  const base = {
    primary:   'btn-primary',
    secondary: 'btn-secondary',
    ghost:     'btn-ghost',
    danger:    'btn-danger',
  }
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx(base[variant] || 'btn-primary', size === 'sm' && 'btn-sm', size === 'lg' && 'btn-lg', fullWidth && 'w-full', className)}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : (Icon && iconPos === 'left' && <Icon size={14} />)}
      {children}
      {!loading && Icon && iconPos === 'right' && <Icon size={14} />}
    </button>
  )
}

// ─── Input ────────────────────────────────────────────────────────────────────
export function Input({ label, error, icon: Icon, className = '', ...props }) {
  return (
    <div>
      {label && <label className="label">{label}</label>}
      <div className="relative">
        {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555] pointer-events-none" />}
        <input className={clsx('input', Icon && 'pl-9', error && 'border-red-800 focus:border-red-700', className)} {...props} />
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ type = 'neutral', children }) {
  const map = { up: 'badge-up', down: 'badge-down', warn: 'badge-warn', neutral: 'badge-neutral' }
  return <span className={map[type] || 'badge-neutral'}>{children}</span>
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = 20 }) {
  return <Loader2 size={size} className="animate-spin text-[#555] mx-auto" />
}

export function PageSpinner() {
  return <div className="flex items-center justify-center h-64"><Spinner size={24} /></div>
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function Empty({ icon: Icon = Inbox, title = 'No data', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      <div className="p-4 rounded-xl border border-[#1f1f1f]">
        <Icon size={28} className="text-[#333]" />
      </div>
      <p className="text-[#555] text-sm font-medium">{title}</p>
      {description && <p className="text-[#333] text-xs max-w-xs">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
export function ProgressBar({ value = 0, max = 100, color = '#fff' }) {
  const w = Math.min(100, (value / max) * 100)
  return (
    <div className="w-full bg-[#1f1f1f] rounded-full h-1.5">
      <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${w}%`, backgroundColor: color }} />
    </div>
  )
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 bg-[#0a0a0a] rounded-lg p-1 border border-[#1f1f1f]">
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className={clsx('flex-1 py-2 rounded-md text-xs font-medium transition-all', active === t.id ? 'bg-white text-black' : 'text-[#888] hover:text-white')}>
          {t.label}
        </button>
      ))}
    </div>
  )
}

// ─── Toggle switch ────────────────────────────────────────────────────────────
export function Toggle({ value, onChange }) {
  return (
    <button onClick={onChange} className={clsx('relative w-10 h-5 rounded-full transition-all', value ? 'bg-white' : 'bg-[#2a2a2a]')}>
      <span className={clsx('absolute top-0.5 w-4 h-4 rounded-full transition-all', value ? 'left-[22px] bg-black' : 'left-0.5 bg-[#555]')} />
    </button>
  )
}

// ─── Divider ──────────────────────────────────────────────────────────────────
export function Divider({ className = '' }) {
  return <div className={clsx('border-t border-[#1f1f1f]', className)} />
}
