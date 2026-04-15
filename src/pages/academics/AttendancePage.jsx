import { useEffect, useState } from 'react'
import { ClipboardCheck, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { Card, SectionHeader, Empty, PageSpinner, ProgressBar } from '../../components/UI'
import { attendanceColor, attendanceBg, pct } from '../../utils/helpers'
import { academicsAPI } from '../../services/api'

export default function AttendancePage() {
  const [subjects, setSubjects] = useState([])   // [{ code, name, faculty, attended, total, credits }]
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    // academicsAPI.getAttendance().then(r => { if (r.data) setSubjects(r.data.subjects); setLoading(false) })
    setLoading(false)
  }, [])

  if (loading) return <PageSpinner />

  const overall  = subjects.length
    ? Math.round(subjects.reduce((s, x) => s + pct(x.attended, x.total), 0) / subjects.length)
    : 0

  const totalClasses  = subjects.reduce((s, x) => s + (x.total    || 0), 0)
  const totalAttended = subjects.reduce((s, x) => s + (x.attended  || 0), 0)
  const atRisk        = subjects.filter(s => pct(s.attended, s.total) < 75)

  return (
    <div className="space-y-5">
      <h1 className="text-white text-2xl font-semibold">Attendance</h1>

      {/* Summary row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Overall',        value: `${overall}%` },
          { label: 'Total Classes',  value: totalClasses  || '—' },
          { label: 'Attended',       value: totalAttended || '—' },
          { label: 'Missed',         value: totalClasses - totalAttended || '—' },
        ].map(({ label, value }) => (
          <div key={label} className="card p-4">
            <p className="text-[#555] text-xs">{label}</p>
            <p className="text-white text-2xl font-semibold font-mono mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* At-risk warning */}
      {atRisk.length > 0 && (
        <Card>
          <div className="flex items-start gap-3">
            <AlertTriangle size={14} className="text-down flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-down text-xs font-semibold">Below 75% Threshold</p>
              <p className="text-[#555] text-xs mt-0.5">
                {atRisk.map(s => s.name).join(', ')} — you may be barred from exams if attendance drops further.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Subject list */}
      {subjects.length === 0 ? (
        <Card><Empty icon={ClipboardCheck} title="No attendance data" description="Attendance loads from your college backend" /></Card>
      ) : (
        <div className="space-y-3">
          {subjects.map(sub => {
            const p       = pct(sub.attended, sub.total)
            const missed  = (sub.total || 0) - (sub.attended || 0)
            const needed  = p < 75
              ? Math.max(0, Math.ceil((0.75 * sub.total - sub.attended) / 0.25))
              : 0
            const canMiss = p >= 75
              ? Math.floor((sub.attended - 0.75 * sub.total) / 0.75)
              : 0

            return (
              <Card key={sub.code}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white font-medium text-sm">{sub.name}</p>
                    <p className="text-[#555] text-xs mt-0.5">{sub.code} · {sub.faculty}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {p >= 75
                      ? <CheckCircle size={14} className="text-up" />
                      : <XCircle    size={14} className="text-down" />
                    }
                    <span className={`font-semibold text-lg font-mono ${attendanceColor(p)}`}>{p}%</span>
                  </div>
                </div>
                <ProgressBar value={p} max={100} color={attendanceBg(p)} />
                <div className="flex justify-between mt-2 text-xs text-[#555]">
                  <span>{sub.attended}/{sub.total} attended · {missed} missed</span>
                  {needed > 0
                    ? <span className="text-down">Attend {needed} more to reach 75%</span>
                    : <span className="text-up">Can miss {canMiss} more</span>
                  }
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
