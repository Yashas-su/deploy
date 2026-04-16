import { useEffect, useState } from 'react'
import { ClipboardCheck, CheckCircle, XCircle } from 'lucide-react'
import { Card, PageSpinner, ProgressBar, Empty } from '../../components/UI'
import { attendanceColor, attendanceBg, pct } from '../../utils/helpers'

export default function AttendancePage() {
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token")

        const res = await fetch(
          'http://localhost:3000/api/academic/attendence',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await res.json()
        setAttendance(data?.attendence || [])
      } catch (err) {
        console.error(err)
        setAttendance([])
      } finally {
        setLoading(false)
      }
    }

    fetchAttendance()
  }, [])

  if (loading) return <PageSpinner />

  if (!attendance.length) {
    return (
      <Card>
        <Empty
          icon={ClipboardCheck}
          title="No attendance data"
          description="Attendance loads from backend"
        />
      </Card>
    )
  }

  // -------------------------
  // ✅ OVERALL CALCULATION
  // -------------------------
  const total = attendance.reduce(
    (s, x) => s + (x.totalclasses || 0),
    0
  )

  const attended = attendance.reduce(
    (s, x) => s + (x.attendendclasses || 0),
    0
  )

  const missed = total - attended
  const overallPercent = pct(attended, total)

  return (
    <div className="space-y-5">
      <h1 className="text-white text-2xl font-semibold">Attendance</h1>

      {/* ===================== */}
      {/* OVERALL CARD */}
      {/* ===================== */}
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white text-sm font-medium">
              Overall Attendance
            </p>
            <p className="text-[#555] text-xs">
              All subjects combined
            </p>
          </div>

          <div className="flex items-center gap-2">
            {overallPercent >= 75 ? (
              <CheckCircle size={16} className="text-up" />
            ) : (
              <XCircle size={16} className="text-down" />
            )}

            <span
              className={`font-bold text-lg ${attendanceColor(
                overallPercent
              )}`}
            >
              {overallPercent}%
            </span>
          </div>
        </div>

        <ProgressBar
          value={overallPercent}
          max={100}
          color={attendanceBg(overallPercent)}
        />

        <div className="flex justify-between mt-2 text-xs text-[#555]">
          <span>
            {attended}/{total} attended · {missed} missed
          </span>
        </div>
      </Card>

      {/* ===================== */}
      {/* SUBJECT WISE */}
      {/* ===================== */}
      <div className="space-y-3">
        {attendance.map((sub) => {
          const total = sub.totalclasses || 0
          const attended = sub.attendendclasses || 0
          const missed = total - attended
          const percent = pct(attended, total)

          return (
            <Card key={sub._id}>
              <div className="flex justify-between items-center mb-2">
                <div>
                  {/* ✅ SUBJECT NAME FIX */}
                  <p className="text-white text-sm font-medium">
                    {sub.subjectid?.name || "Unknown Subject"}
                  </p>
                  <p className="text-[#555] text-xs">
                    {sub.subjectid?.code || ""}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {percent >= 75 ? (
                    <CheckCircle size={14} className="text-up" />
                  ) : (
                    <XCircle size={14} className="text-down" />
                  )}

                  <span className={attendanceColor(percent)}>
                    {percent}%
                  </span>
                </div>
              </div>

              <ProgressBar
                value={percent}
                max={100}
                color={attendanceBg(percent)}
              />

              <div className="flex justify-between mt-2 text-xs text-[#555]">
                <span>
                  {attended}/{total} attended · {missed} missed
                </span>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}