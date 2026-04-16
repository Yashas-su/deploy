import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  GraduationCap, Megaphone, ClipboardCheck, Calendar,
  FileText, Trophy, TrendingUp, ArrowRight,
} from 'lucide-react'
import { Card, SectionHeader, Empty, PageSpinner, ProgressBar, StatTile } from '../../components/UI'
import { pct, attendanceColor, attendanceBg } from '../../utils/helpers'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'

const MODULES = [
  { label: 'Announcements', icon: Megaphone,      to: '/academics/announcements' },
  { label: 'Attendance',    icon: ClipboardCheck,  to: '/academics/attendance' },
  { label: 'Timetable',     icon: Calendar,        to: '/academics/timetable' },
  { label: 'Notes',         icon: FileText,        to: '/academics/notes' },
  { label: 'Results',       icon: Trophy,          to: '/academics/results' },
]

export default function AcademicsDashboardPage() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 🔥 STATIC PROTOTYPE DATA (REALISTIC)
    const staticData = {
      cgpa: 8.42,
      sgpa: 8.75,
      rank: 12,
      totalStudents: 180,
      creditsCompleted: 92,
      totalCredits: 120,
      attendance: 86,
      subjects: [
        { code: "CSE2260", name: "Database Management System", attendancePct: 88 },
        { code: "CSE2269", name: "Operating Systems", attendancePct: 82 },
        { code: "CSE2271", name: "Computer Networks", attendancePct: 79 },
        { code: "CSE2280", name: "Artificial Intelligence", attendancePct: 91 },
        { code: "CSE2255", name: "Software Engineering", attendancePct: 85 },
      ]
    }

    setData(staticData)
    setLoading(false)
  }, [])

  if (loading) return <PageSpinner />

  const radarData = (data?.subjects || []).map(s => ({
    subject: s.code,
    value: s.attendancePct ?? 0,
  }))

  return (
    <div className="space-y-5">
      <h1 className="page-title">Academics</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile label="CGPA"       value={data?.cgpa} icon={Trophy} />
        <StatTile label="SGPA"       value={data?.sgpa} icon={TrendingUp} />
        <StatTile label="Class Rank" value={`#${data?.rank}`} icon={GraduationCap} />
        <StatTile label="Attendance" value={`${data?.attendance}%`} />
      </div>

      {/* Credit progress */}
      <Card>
        <SectionHeader title="Credit Progress" />
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-[#888]">Completed</span>
            <span className="text-white font-mono">
              {data?.creditsCompleted} / {data?.totalCredits}
            </span>
          </div>
          <ProgressBar
            value={data?.creditsCompleted}
            max={data?.totalCredits}
            color="#fff"
          />
          <p className="text-[#555] text-xs">
            {data.totalCredits - data.creditsCompleted} credits remaining for graduation
          </p>
        </div>
      </Card>

      {/* Module shortcuts */}
      <div className="grid grid-cols-5 gap-2">
        {MODULES.map(({ label, icon: Icon, to }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            className="card-interactive flex flex-col items-center gap-2 py-4 rounded-xl"
          >
            <div className="w-9 h-9 rounded-lg bg-[#1f1f1f] flex items-center justify-center">
              <Icon size={16} className="text-white" />
            </div>
            <span className="text-[#888] text-xs text-center leading-tight">
              {label}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Subject attendance */}
        <Card>
          <SectionHeader
            title="Subject Attendance"
            action={
              <button
                onClick={() => navigate('/academics/attendance')}
                className="text-[#555] hover:text-white text-xs flex items-center gap-1"
              >
                Details <ArrowRight size={11} />
              </button>
            }
          />
          <div className="space-y-3">
            {data.subjects.map(s => {
              const p = s.attendancePct
              return (
                <div key={s.code}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white text-xs">{s.name}</span>
                    <span className={`text-xs font-semibold ${attendanceColor(p)}`}>
                      {p}%
                    </span>
                  </div>
                  <ProgressBar value={p} max={100} color={attendanceBg(p)} />
                </div>
              )
            })}
          </div>
        </Card>

        {/* Radar */}
        <Card>
          <SectionHeader title="Attendance Radar" />
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1f1f1f" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#555', fontSize: 10 }} />
              <Radar
                dataKey="value"
                stroke="#fff"
                fill="#fff"
                fillOpacity={0.08}
                strokeWidth={1.5}
              />
              <Tooltip
                contentStyle={{
                  background: '#111',
                  border: '1px solid #1f1f1f',
                  borderRadius: 8,
                  fontSize: 12
                }}
                formatter={v => [`${v}%`, 'Attendance']}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}