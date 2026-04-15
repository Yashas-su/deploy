import { useEffect, useState } from 'react'
import { Bus, Clock, CheckCircle, Ticket } from 'lucide-react'
import { Card, SectionHeader, Button, Tabs, Empty, PageSpinner } from '../../components/UI'
import { fmt, fmtDate } from '../../utils/helpers'
import { walletAPI } from '../../services/api'
import clsx from 'clsx'

const TABS = [{ id: 'routes', label: 'Routes & Pay' }, { id: 'history', label: 'Trip History' }]

export default function TransportationPage() {
  const [tab,     setTab]     = useState('routes')
  const [pass,    setPass]    = useState(null)    // { type, validUntil, passId, status, routesCovered }
  const [routes,  setRoutes]  = useState([])      // [{ id, name, fare, timing, status }]
  const [trips,   setTrips]   = useState([])      // [{ date, time, from, to, route, fare }]
  const [loading, setLoading] = useState(true)
  const [paying,  setPaying]  = useState(null)    // route id being paid

  useEffect(() => {
    const load = async () => {
      /**
       * TODO:
       * const [p, r, t] = await Promise.all([
       *   walletAPI.getBusPass(),
       *   walletAPI.getRoutes(),
       *   walletAPI.getTripHistory(),
       * ])
       * if (p.data) setPass(p.data)
       * if (r.data) setRoutes(r.data)
       * if (t.data) setTrips(t.data)
       */
      setLoading(false)
    }
    load()
  }, [])

  const handlePay = async (route) => {
    setPaying(route.id)
    /**
     * TODO:
     * const { data, error } = await walletAPI.payTransport({ routeId: route.id, fare: route.fare })
     * if (error) { alert(error) }
     */
    setTimeout(() => setPaying(null), 1000)
  }

  if (loading) return <PageSpinner />

  // Days left on pass
  const daysLeft = pass?.validUntil
    ? Math.max(0, Math.ceil((new Date(pass.validUntil) - new Date()) / 86400000))
    : null

  return (
    <div className="space-y-5">
      <h1 className="page-title">Transportation</h1>

      {/* Bus pass card */}
      <Card>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1f1f1f] flex items-center justify-center flex-shrink-0">
              <Ticket size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{pass?.type || 'Bus Pass'}</p>
              <p className="text-[#555] text-xs mt-0.5">{pass?.routesCovered || 'No pass active'}</p>
              <p className="text-[#333] text-xs font-mono mt-1">{pass?.passId || '—'}</p>
            </div>
          </div>
          <div className="text-right">
            {daysLeft !== null ? (
              <>
                <p className={clsx('text-2xl font-semibold font-mono', daysLeft <= 3 ? 'text-down' : daysLeft <= 7 ? 'text-warn' : 'text-up')}>
                  {daysLeft}
                </p>
                <p className="text-[#555] text-xs">days left</p>
              </>
            ) : (
              <span className="text-[#555] text-xs">No active pass</span>
            )}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-[#1f1f1f] flex gap-2">
          <Button size="sm" fullWidth>Renew Pass</Button>
          <Button size="sm" variant="secondary" fullWidth>View QR</Button>
        </div>
      </Card>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'routes' ? (
        routes.length === 0 ? (
          <Card><Empty icon={Bus} title="No routes available" description="Routes will appear when loaded from backend" /></Card>
        ) : (
          <div className="space-y-2">
            {routes.map(r => (
              <Card key={r.id}>
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#1f1f1f] flex items-center justify-center flex-shrink-0">
                    <Bus size={16} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{r.name}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-[#555] text-xs">
                      <Clock size={10} /><span>{r.timing}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <p className="text-white font-mono font-semibold text-sm">{fmt(r.fare)}</p>
                    {r.status === 'active'
                      ? <Button size="sm" loading={paying === r.id} onClick={() => handlePay(r)}>Pay</Button>
                      : <span className="text-warn text-xs">Limited</span>
                    }
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : (
        trips.length === 0 ? (
          <Card><Empty icon={Bus} title="No trips yet" /></Card>
        ) : (
          <div className="space-y-2">
            {trips.map((t, i) => (
              <Card key={i}>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[#1f1f1f] flex items-center justify-center flex-shrink-0">
                    <Bus size={14} className="text-[#555]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-sm">
                      <span className="text-white font-medium">{t.from}</span>
                      <span className="text-[#333]">→</span>
                      <span className="text-white font-medium">{t.to}</span>
                    </div>
                    <p className="text-[#555] text-xs mt-0.5">{fmtDate(t.date)} · {t.time} · {t.route}</p>
                  </div>
                  <p className="text-white font-mono text-sm flex-shrink-0">{fmt(t.fare)}</p>
                </div>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  )
}
