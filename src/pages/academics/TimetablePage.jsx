import { useEffect, useState } from 'react'
import { Calendar, Clock, MapPin, FlaskConical, BookOpen, Briefcase } from 'lucide-react'
import { Card, SectionHeader, Empty, PageSpinner } from '../../components/UI'
import { academicsAPI } from '../../services/api'
import clsx from 'clsx'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const TYPE_CONFIG = {
  lecture: { icon: BookOpen,     label: 'Lecture', dot: '#fff' },
  lab:     { icon: FlaskConical, label: 'Lab',     dot: '#22c55e' },
  project: { icon: Briefcase,    label: 'Project', dot: '#eab308' },
  tutorial:{ icon: BookOpen,     label: 'Tutorial',dot: '#888' },
}

export default function TimetablePage() {
  // timetable: { Monday: [{ time, subject, room, type }], ... }
  const [timetable, setTimetable] = useState({})
  const [activeDay, setActiveDay] = useState('')
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    // Set today as default active day
    const dayIdx  = new Date().getDay()  // 0=Sun
    const weekDay = DAYS[Math.max(0, Math.min(dayIdx - 1, 4))]
    setActiveDay(weekDay)

    // academicsAPI.getTimetable().then(r => { if (r.data) setTimetable(r.data); setLoading(false) })
    setLoading(false)
  }, [])

  if (loading) return <PageSpinner />

  const dayClasses = timetable[activeDay] || []

  return (
    <div className="space-y-5">
      <h1 className="text-white text-2xl font-semibold">Timetable</h1>

      {/* Day selector */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {DAYS.map(day => (
          <button key={day} onClick={() => setActiveDay(day)}
            className={clsx('flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-colors border',
              activeDay === day
                ? 'bg-white text-black border-white'
                : 'bg-transparent border-[#1f1f1f] text-[#888] hover:text-white')}>
            {day.slice(0, 3)}
          </button>
        ))}
      </div>

      {/* Classes */}
      {dayClasses.length === 0 ? (
        <Card>
          <Empty icon={Calendar} title="No classes"
            description={Object.keys(timetable).length === 0
              ? 'Timetable data loads from your college backend'
              : `No classes on ${activeDay}`}
          />
        </Card>
      ) : (
        <div className="space-y-2">
          {dayClasses.map((cls, i) => {
            const cfg = TYPE_CONFIG[cls.type] || TYPE_CONFIG.lecture
            const { icon: Icon } = cfg
            return (
              <Card key={i} className={clsx('border-l-2')}
                style={{ borderLeftColor: cfg.dot }}>
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#1f1f1f] flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <p className="text-white font-medium text-sm">{cls.subject}</p>
                      <span className="text-[#555] text-[10px] border border-[#1f1f1f] rounded px-1.5 py-0.5">
                        {cfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-[#555] text-xs">
                      <span className="flex items-center gap-1"><Clock size={10} />{cls.time}</span>
                      <span className="flex items-center gap-1"><MapPin size={10} />{cls.room}</span>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Weekly summary grid */}
      {Object.keys(timetable).length > 0 && (
        <Card>
          <SectionHeader title="Week at a Glance" />
          <div className="grid grid-cols-6 gap-2">
            {DAYS.map(day => {
              const count = (timetable[day] || []).length
              return (
                <button key={day} onClick={() => setActiveDay(day)}
                  className={clsx('flex flex-col items-center gap-1.5 p-2.5 rounded-lg transition-colors',
                    activeDay === day ? 'bg-white' : 'hover:bg-[#111]')}>
                  <p className={clsx('text-[10px] font-medium', activeDay === day ? 'text-black' : 'text-[#555]')}>
                    {day.slice(0, 3)}
                  </p>
                  <p className={clsx('text-lg font-semibold font-mono', activeDay === day ? 'text-black' : 'text-white')}>
                    {count}
                  </p>
                </button>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}
