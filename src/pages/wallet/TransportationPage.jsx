import { useEffect, useState } from 'react'
import { Bus, Clock, Ticket } from 'lucide-react'
import { Card, SectionHeader, Button, Tabs, Empty, PageSpinner } from '../../components/UI'
import { fmt, fmtDate } from '../../utils/helpers'
import clsx from 'clsx'

const TABS = [
  { id: 'routes', label: 'Routes & Pay' },
  { id: 'history', label: 'Trip History' }
]

export default function TransportationPage() {
  const [tab, setTab] = useState('routes')
  const [pass, setPass] = useState(null)
  const [routes, setRoutes] = useState([])
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(null)

  useEffect(() => {
    // 🔥 STATIC REALISTIC DATA

    setPass({
      type: "Student Monthly Pass",
      validUntil: "2026-05-05",
      passId: "BUS-2026-APR-1021",
      routesCovered: "All Campus Routes",
    })

    setRoutes([
      { id: "1", name: "Campus → City Center", fare: 20, timing: "Every 15 mins", status: "active" },
      { id: "2", name: "Hostel → College", fare: 10, timing: "Every 10 mins", status: "active" },
      { id: "3", name: "Campus → Railway Station", fare: 30, timing: "Every 30 mins", status: "limited" },
      { id: "4", name: "City Loop Service", fare: 15, timing: "Every 20 mins", status: "active" },
    ])

    setTrips([
      {
        date: "2026-04-14",
        time: "09:10",
        from: "Hostel",
        to: "College",
        route: "Hostel → College",
        fare: 10,
      },
      {
        date: "2026-04-13",
        time: "17:30",
        from: "College",
        to: "City Center",
        route: "Campus → City Center",
        fare: 20,
      },
      {
        date: "2026-04-12",
        time: "08:50",
        from: "Hostel",
        to: "College",
        route: "Hostel → College",
        fare: 10,
      },
    ])

    setLoading(false)
  }, [])

  const handlePay = (route) => {
    setPaying(route.id)

    setTimeout(() => {
      // 🔥 simulate adding trip
      setTrips(prev => [
        {
          date: new Date().toISOString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          from: "Campus",
          to: "Destination",
          route: route.name,
          fare: route.fare,
        },
        ...prev
      ])
      setPaying(null)
    }, 800)
  }

  if (loading) return <PageSpinner />

  const daysLeft = pass?.validUntil
    ? Math.max(0, Math.ceil((new Date(pass.validUntil) - new Date()) / 86400000))
    : null

  return (
    <div className="space-y-5">
      <h1 className="page-title">Transportation</h1>

      {/* PASS */}
      <Card>
        <div className="flex justify-between">
          <div>
            <p className="text-white font-semibold">{pass.type}</p>
            <p className="text-[#555] text-xs">{pass.routesCovered}</p>
            <p className="text-[#333] text-xs">{pass.passId}</p>
          </div>

          <div className="text-right">
            <p className={clsx(
              'text-2xl font-mono',
              daysLeft <= 3 ? 'text-down' : daysLeft <= 7 ? 'text-warn' : 'text-up'
            )}>
              {daysLeft}
            </p>
            <p className="text-[#555] text-xs">days left</p>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button fullWidth>Renew</Button>
          <Button variant="secondary" fullWidth>QR</Button>
        </div>
      </Card>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {/* ROUTES */}
      {tab === 'routes' ? (
        <div className="space-y-2">
          {routes.map(r => (
            <Card key={r.id}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white text-sm">{r.name}</p>
                  <p className="text-[#555] text-xs">{r.timing}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-white font-mono">{fmt(r.fare)}</span>

                  {r.status === "active" ? (
                    <Button
                      size="sm"
                      loading={paying === r.id}
                      onClick={() => handlePay(r)}
                    >
                      Pay
                    </Button>
                  ) : (
                    <span className="text-warn text-xs">Limited</span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {trips.map((t, i) => (
            <Card key={i}>
              <div className="flex justify-between">
                <div>
                  <p className="text-white text-sm">
                    {t.from} → {t.to}
                  </p>
                  <p className="text-[#555] text-xs">
                    {fmtDate(t.date)} · {t.time}
                  </p>
                </div>
                <span className="text-white font-mono">
                  {fmt(t.fare)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}