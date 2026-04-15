import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Wallet, GraduationCap, User,
  Zap, QrCode, SplitSquareHorizontal, Users, Bus,
  BarChart2, Send, Eye, Megaphone, ClipboardCheck,
  Calendar, FileText, Trophy, LogOut, ChevronRight,
  CreditCard,
} from 'lucide-react'
import clsx from 'clsx'

const nav = [
  { section: 'Main', items: [
    { to: '/home', label: 'Dashboard', icon: LayoutDashboard },
  ]},
  { section: 'Wallet', items: [
    { to: '/wallet',           label: 'Overview',       icon: Wallet },
    { to: '/wallet/upi',       label: 'UPI Payment',    icon: Zap },
    { to: '/wallet/qr',        label: 'QR Payment',     icon: QrCode },
    { to: '/wallet/split',     label: 'Split',          icon: SplitSquareHorizontal },
    { to: '/wallet/groups',    label: 'Groups',         icon: Users },
    { to: '/wallet/transport', label: 'Transport',      icon: Bus },
    { to: '/wallet/expenses',  label: 'Expenses',       icon: BarChart2 },
    { to: '/wallet/request',   label: 'Request Money',  icon: Send },
    { to: '/wallet/parents',   label: 'Parent View',    icon: Eye },
  ]},
  { section: 'Academics', items: [
    { to: '/academics',                     label: 'Dashboard',      icon: GraduationCap },
    { to: '/academics/announcements',       label: 'Announcements',  icon: Megaphone },
    { to: '/academics/attendance',          label: 'Attendance',     icon: ClipboardCheck },
    { to: '/academics/timetable',           label: 'Timetable',      icon: Calendar },
    { to: '/academics/notes',               label: 'Notes',          icon: FileText },
    { to: '/academics/results',             label: 'Results',        icon: Trophy },
  ]},
  { section: 'Account', items: [
    { to: '/profile', label: 'Profile', icon: User },
  ]},
]

export default function Sidebar({ onClose }) {
  const navigate = useNavigate()

  return (
    <aside className="flex flex-col h-full w-60 bg-[#0a0a0a] border-r border-[#1f1f1f]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-[#1f1f1f] flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
          <CreditCard size={14} className="text-black" />
        </div>
        <span className="text-white text-sm font-semibold">CampusWallet</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {nav.map(({ section, items }) => (
          <div key={section}>
            <p className="text-[#333] text-[10px] font-semibold uppercase tracking-widest px-2 mb-1">{section}</p>
            <ul className="space-y-0.5">
              {items.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <NavLink to={to} end={to === '/wallet' || to === '/academics'} onClick={onClose}
                    className={({ isActive }) => clsx(
                      'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors',
                      isActive ? 'bg-white text-black' : 'text-[#888] hover:text-white hover:bg-[#111]'
                    )}>
                    {({ isActive }) => (
                      <>
                        <Icon size={14} />
                        <span className="flex-1">{label}</span>
                        {isActive && <ChevronRight size={11} />}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User row */}
      <div className="p-2 border-t border-[#1f1f1f] flex-shrink-0">
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg">
          <div className="w-7 h-7 rounded-lg bg-[#1f1f1f] flex items-center justify-center flex-shrink-0">
            <User size={13} className="text-[#888]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">Student Name</p>
            <p className="text-[#555] text-[10px] truncate">Roll No.</p>
          </div>
          <button onClick={() => navigate('/login')} className="text-[#555] hover:text-red-400 transition-colors" title="Logout">
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  )
}
