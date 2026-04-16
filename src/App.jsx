import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'

// Auth
import LoginPage    from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// Main
import HomePage    from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'

// Wallet
import WalletOverviewPage  from './pages/wallet/WalletOverviewPage'
import UPIPaymentPage      from './pages/wallet/UPIPaymentPage'
import { QRPaymentPage }   from './pages/wallet/QRPaymentPage'
import SplitPaymentPage    from './pages/wallet/SplitPaymentPage'
import GroupPaymentPage    from './pages/wallet/GroupPaymentPage'
import TransportationPage  from './pages/wallet/TransportationPage'
import ExpenseTrackingPage from './pages/wallet/ExpenseTrackingPage'
import RequestMoneyPage    from './pages/wallet/RequestMoneyPage'
import ParentsTrackingPage from './pages/wallet/ParentsTrackingPage'

// Academics
import AcademicsDashboardPage from './pages/academics/AcademicsDashboardPage'
import { AnnouncementsPage }  from './pages/academics/AnnouncementsPage'
import AttendancePage         from './pages/academics/AttendancePage'
import TimetablePage          from './pages/academics/TimetablePage'
import NotesPage              from './pages/academics/NotesPage'
import ResultsPage            from './pages/academics/ResultsPage'

// Wrap page in Layout
const Page = ({ children }) => <Layout>{children}</Layout>

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth — no layout */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/"         element={<Navigate to="/login" replace />} />

        {/* Protected — with layout */}
        {/* TODO: wrap <Page> in a ProtectedRoute that checks localStorage.getItem('token') */}
        <Route path="/home"    element={<Page><AcademicsDashboardPage /></Page>} />
        <Route path="/profile" element={<Page><ProfilePage /></Page>} />

        {/* Wallet */}
        <Route path="/wallet"             element={<Page><WalletOverviewPage /></Page>} />
        <Route path="/wallet/upi"         element={<Page><UPIPaymentPage /></Page>} />
        <Route path="/wallet/qr"          element={<Page><QRPaymentPage /></Page>} />
        <Route path="/wallet/split"       element={<Page><SplitPaymentPage /></Page>} />
        <Route path="/wallet/groups"      element={<Page><GroupPaymentPage /></Page>} />
        <Route path="/wallet/transport"   element={<Page><TransportationPage /></Page>} />
        <Route path="/wallet/expenses"    element={<Page><ExpenseTrackingPage /></Page>} />
        <Route path="/wallet/request"     element={<Page><RequestMoneyPage /></Page>} />
        <Route path="/wallet/parents"     element={<Page><ParentsTrackingPage /></Page>} />

        {/* Academics */}
        <Route path="/academics"                      element={<Page><AcademicsDashboardPage /></Page>} />
        <Route path="/academics/announcements"        element={<Page><AnnouncementsPage /></Page>} />
        <Route path="/academics/attendance"           element={<Page><AttendancePage /></Page>} />
        <Route path="/academics/timetable"            element={<Page><TimetablePage /></Page>} />
        <Route path="/academics/notes"                element={<Page><NotesPage /></Page>} />
        <Route path="/academics/results"              element={<Page><ResultsPage /></Page>} />

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
