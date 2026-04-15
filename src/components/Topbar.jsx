import { useState } from 'react'
import { Menu, Bell, X, CreditCard, User } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

const titles = {
  '/home': 'Dashboard',
  '/wallet': 'Wallet Overview',
  '/wallet/upi': 'UPI Payment',
  '/wallet/qr': 'QR Payment',
  '/wallet/split': 'Split Payment',
  '/wallet/groups': 'Group Payments',
  '/wallet/transport': 'Transportation',
  '/wallet/expenses': 'Expense Tracking',
  '/wallet/request': 'Request Money',
  '/wallet/parents': 'Parent View',
  '/academics': 'Academics',
  '/academics/announcements': 'Announcements',
  '/academics/attendance': 'Attendance',
  '/academics/timetable': 'Timetable',
  '/academics/notes': 'Notes',
  '/academics/results': 'Results',
  '/profile': 'Profile',
}

export default function Topbar() {
  const [open, setOpen] = useState(false)
  const [notif, setNotif] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const title = titles[location.pathname] || 'CampusWallet'

  // Placeholder notification count — replace with real unread count from API
  const unread = 0

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full z-10">
            <Sidebar onClose={() => setOpen(false)} />
          </div>
          <button onClick={() => setOpen(false)} className="absolute top-3 right-3 p-1.5 rounded-lg bg-[#111] border border-[#1f1f1f] z-20">
            <X size={16} className="text-white" />
          </button>
        </div>
      )}

      <header className="h-14 flex-shrink-0 flex items-center justify-between px-4 border-b border-[#1f1f1f] bg-black">
        <div className="flex items-center gap-3">
          <button className="lg:hidden p-1.5 rounded-lg hover:bg-[#111] text-[#888] hover:text-white" onClick={() => setOpen(true)}>
            <Menu size={18} />
          </button>
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2">
            <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
              <CreditCard size={12} className="text-black" />
            </div>
            <span className="text-white text-sm font-semibold">CampusWallet</span>
          </div>
          {/* Desktop page title */}
          <p className="hidden lg:block text-[#888] text-sm">{title}</p>
        </div>

        <div className="flex items-center gap-1">
          {/* Notifications */}
          <div className="relative">
            <button onClick={() => setNotif(!notif)} className="relative p-1.5 rounded-lg hover:bg-[#111] text-[#888] hover:text-white">
              <Bell size={16} />
              {unread > 0 && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
              )}
            </button>

            {notif && (
              <div className="absolute right-0 top-10 w-72 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl shadow-2xl z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f1f1f]">
                  <p className="text-white text-xs font-semibold">Notifications</p>
                  <button onClick={() => setNotif(false)}><X size={13} className="text-[#555]" /></button>
                </div>
                {/* Notification list — populate from API */}
                <div className="flex flex-col items-center justify-center py-8 text-[#333] text-xs">
                  <Bell size={22} className="mb-2" />
                  No notifications
                </div>
              </div>
            )}
          </div>

          {/* Avatar */}
          <button onClick={() => navigate('/profile')} className="w-7 h-7 rounded-lg bg-[#1f1f1f] flex items-center justify-center hover:bg-[#2a2a2a] transition-colors">
            <User size={13} className="text-[#888]" />
          </button>
        </div>
      </header>
    </>
  )
}
