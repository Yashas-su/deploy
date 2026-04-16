import { useEffect, useState } from 'react'
import { Calendar, Clock, MapPin, FlaskConical, BookOpen, Briefcase } from 'lucide-react'
import { Card, SectionHeader, Empty, PageSpinner } from '../../components/UI'
import clsx from 'clsx'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const TYPE_CONFIG = {
  lecture: { icon: BookOpen, label: 'Lecture', dot: '#fff' },
  lab: { icon: FlaskConical, label: 'Lab', dot: '#22c55e' },
  project: { icon: Briefcase, label: 'Project', dot: '#eab308' },
  tutorial: { icon: BookOpen, label: 'Tutorial', dot: '#888' },
}

export default function TimetablePage() {
  const [timetable, setTimetable] = useState({})
  const [activeDay, setActiveDay] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 🔥 STATIC REALISTIC TIMETABLE DATA
    const staticSchedule = [
      { day: "Monday", subject: "Database Management System", start: "09:00", end: "10:00", room: "A-101", type: "lecture" },
      { day: "Monday", subject: "Operating Systems", start: "10:00", end: "11:00", room: "A-102", type: "lecture" },
      { day: "Monday", subject: "Computer Networks", start: "11:00", end: "12:00", room: "A-103", type: "lecture" },

      { day: "Tuesday", subject: "Artificial Intelligence", start: "09:00", end: "10:00", room: "B-201", type: "lecture" },
      { day: "Tuesday", subject: "Software Engineering", start: "10:00", end: "11:00", room: "B-202", type: "lecture" },
      { day: "Tuesday", subject: "Database Management System", start: "11:00", end: "12:00", room: "B-203", type: "lecture" },

      { day: "Wednesday", subject: "Operating Systems", start: "09:00", end: "10:00", room: "C-101", type: "lecture" },
      { day: "Wednesday", subject: "Computer Networks Lab", start: "10:00", end: "12:00", room: "C-102", type: "lab" },

      { day: "Thursday", subject: "Artificial Intelligence", start: "09:00", end: "10:00", room: "D-201", type: "lecture" },
      { day: "Thursday", subject: "Software Engineering", start: "10:00", end: "11:00", room: "D-202", type: "tutorial" },

      { day: "Friday", subject: "Mini Project", start: "09:00", end: "11:00", room: "Lab-1", type: "project" },
      { day: "Friday", subject: "Database Management System", start: "11:00", end: "12:00", room: "A-105", type: "lecture" },
    ]

    // 🔥 GROUP BY DAY
    const grouped = staticSchedule.reduce((acc, item) => {
      if (!acc[item.day]) acc[item.day] = []
      acc[item.day].push(item)
      return acc
    }, {})

    // 🔥 SORT BY TIME
    Object.keys(grouped).forEach(day => {
      grouped[day].sort((a, b) => a.start.localeCompare(b.start))
    })

    setTimetable(grouped)

    const todayIndex = new Date().getDay() - 1
    const today = DAYS[todayIndex] || 'Monday'
    setActiveDay(today)

    setLoading(false)
  }, [])

  if (loading) return <PageSpinner />

  const dayClasses = timetable[activeDay] || []

  return (
    <div className="space-y-5">
      <h1 className="text-white text-2xl font-semibold">Timetable</h1>

      {/* DAY SELECTOR */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={clsx(
              'px-3 py-2 rounded-lg text-xs border',
              activeDay === day
                ? 'bg-white text-black'
                : 'text-[#888] border-[#1f1f1f]'
            )}
          >
            {day.slice(0, 3)}
          </button>
        ))}
      </div>

      {/* CLASSES */}
      {dayClasses.length === 0 ? (
        <Card>
          <Empty
            icon={Calendar}
            title="No classes"
            description={`No classes on ${activeDay}`}
          />
        </Card>
      ) : (
        <div className="space-y-2">
          {dayClasses.map((cls, i) => {
            const cfg = TYPE_CONFIG[cls.type] || TYPE_CONFIG.lecture
            const Icon = cfg.icon

            return (
              <Card key={i} style={{ borderLeft: `2px solid ${cfg.dot}` }}>
                <div className="flex gap-3">
                  <div className="w-9 h-9 bg-[#1f1f1f] rounded-lg flex items-center justify-center">
                    <Icon size={16} />
                  </div>

                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">
                      {cls.subject}
                    </p>

                    <div className="flex gap-3 text-xs text-[#555] mt-1">
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {cls.start} - {cls.end}
                      </span>

                      <span className="flex items-center gap-1">
                        <MapPin size={10} />
                        {cls.room}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* WEEK SUMMARY */}
      {Object.keys(timetable).length > 0 && (
        <Card>
          <SectionHeader title="Week at a Glance" />

          <div className="grid grid-cols-6 gap-2">
            {DAYS.map(day => {
              const count = (timetable[day] || []).length

              return (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={clsx(
                    'p-2 rounded-lg',
                    activeDay === day ? 'bg-white text-black' : 'text-white'
                  )}
                >
                  <p className="text-[10px]">{day.slice(0, 3)}</p>
                  <p className="text-lg font-mono">{count}</p>
                </button>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}