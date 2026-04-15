import { useEffect, useState } from 'react'
import { Megaphone, ChevronDown, ChevronUp, AlertCircle, Info, Bell } from 'lucide-react'
import { Card, Empty, PageSpinner } from '../../components/UI'
import clsx from 'clsx'

const PRIORITY_ICON = {
  high:   { icon: AlertCircle, cls: 'text-down' },
  medium: { icon: Info,        cls: 'text-warn' },
  low:    { icon: Bell,        cls: 'text-[#555]' },
}

export function AnnouncementsPage() {
  const [items, setItems] = useState([])
  const [expanded, setExpanded] = useState(null)
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  // ✅ FETCH DATA
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/academic/announcements', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

        const data = await res.json()

        // ✅ HANDLE ARRAY + SORT LATEST FIRST
        if (Array.isArray(data.announcement)) {
          const sorted = data.announcement
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

          setItems(
            sorted.map(a => ({
              id: a._id,
              title: a.title,
              body: a.description,
              date: new Date(a.createdAt).toLocaleString(), // 🔥 better format
              tag: 'General',
              priority: 'low',
              author: 'Admin'
            }))
          )
        }

      } catch (err) {
        console.log("err", err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  // ✅ FILTER TAGS
  const tags = ['All', ...new Set(items.map(i => i.tag).filter(Boolean))]
  const filtered = filter === 'All' ? items : items.filter(i => i.tag === filter)

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-5">
      <h1 className="text-white text-2xl font-semibold">Announcements</h1>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {tags.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-xs font-medium border transition',
              filter === t
                ? 'bg-white text-black border-white'
                : 'border-[#1f1f1f] text-[#888] hover:text-white'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* LIST */}
      {filtered.length === 0 ? (
        <Card>
          <Empty
            icon={Megaphone}
            title="No announcements"
            description="Announcements will appear here"
          />
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((a, i) => {
            const isOpen = expanded === (a.id || i)
            const { icon: PIcon, cls } =
              PRIORITY_ICON[a.priority] || PRIORITY_ICON.low

            return (
              <Card key={a.id || i}>
                <button
                  className="w-full text-left"
                  onClick={() =>
                    setExpanded(isOpen ? null : (a.id || i))
                  }
                >
                  <div className="flex items-start gap-3">

                    <PIcon size={14} className={`${cls} mt-0.5`} />

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1f1f1f] text-[#888] border border-[#2a2a2a]">
                          {a.tag}
                        </span>

                        <span className="text-[#333] text-[10px]">
                          {a.date}
                        </span>
                      </div>

                      <p className="text-white text-sm font-medium">
                        {a.title}
                      </p>

                      <p className="text-[#555] text-xs">
                        {a.author}
                      </p>

                      {isOpen && (
                        <p className="text-[#888] text-xs mt-3">
                          {a.body}
                        </p>
                      )}
                    </div>

                    {isOpen
                      ? <ChevronUp size={14} className="text-[#555]" />
                      : <ChevronDown size={14} className="text-[#555]" />
                    }

                  </div>
                </button>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}