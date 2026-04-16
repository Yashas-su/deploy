// ─── QR Payment ──────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react'
import { QrCode, Camera, Download, Share2, CheckCircle, Scan } from 'lucide-react'
import { Card, SectionHeader, Button, Tabs, Empty } from '../../components/UI'
import { fmt } from '../../utils/helpers'
import { walletAPI } from '../../services/api'

const QR_TABS = [{ id: 'my', label: 'My QR' }, { id: 'scan', label: 'Scan & Pay' }]

export function QRPaymentPage() {
  const [tab,      setTab]      = useState('my')
  const [qrData,   setQrData]   = useState(null)    // { qrCodeUrl, upiId } from API
  const [scanned,  setScanned]  = useState(false)
  const [merchant, setMerchant] = useState(null)    // { name, upiId, amount } from scanned QR
  const [paid,     setPaid]     = useState(false)
  const [loading,  setLoading]  = useState(false)

  useEffect(() => {
    // walletAPI.getQRCode().then(r => { if (r.data) setQrData(r.data) })
  }, [])

  const handleScanSimulate = async () => {
    setLoading(true)
    /**
     * TODO: Replace with real camera QR scan result
     * The scanned QR string should be sent to backend to decode merchant details
     * const { data } = await walletAPI.decodeQR({ qrString: scannedString })
     * setMerchant(data)
     */
    setTimeout(() => { setLoading(false); setScanned(true) }, 800)
  }

  const handlePay = async () => {
    setLoading(true)
    /**
     * TODO:
     * const { data, error } = await walletAPI.sendUPI({ upiId: merchant.upiId, amount: merchant.amount })
     * if (error) { alert(error); setLoading(false); return }
     */
    setTimeout(() => { setLoading(false); setPaid(true) }, 800)
  }

  return (
    <div className="space-y-5">
      <h1 className="page-title">QR Payment</h1>
      <Tabs tabs={QR_TABS} active={tab} onChange={(id) => { setTab(id); setScanned(false); setPaid(false) }} />

      {tab === 'my' ? (
        <div className="max-w-sm mx-auto">
          <Card>
            <SectionHeader title="Your QR Code" />
            {/* QR image from backend: qrData?.qrCodeUrl */}
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-48 h-48 rounded-xl border border-[#1f1f1f] bg-[#0a0a0a] flex flex-col items-center justify-center gap-2">
                <QrCode size={56} className="text-[#2a2a2a]" />
                <p className="text-[#333] text-xs">QR loads from backend</p>
              </div>
              {/* qrData?.upiId */}
              <p className="text-[#555] text-xs font-mono">{qrData?.upiId || 'UPI ID from backend'}</p>
              <div className="flex gap-2 w-full">
                <Button variant="secondary" icon={Download} fullWidth size="sm">Save</Button>
                <Button variant="secondary" icon={Share2}   fullWidth size="sm">Share</Button>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div className="max-w-sm mx-auto space-y-4">
          {!scanned ? (
            <Card>
              <SectionHeader title="Scan QR Code" />
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="w-56 h-56 rounded-xl border border-dashed border-[#2a2a2a] flex flex-col items-center justify-center gap-2 bg-[#0a0a0a]">
                  <Camera size={36} className="text-[#2a2a2a]" />
                  <p className="text-[#333] text-xs text-center px-4">Camera feed — integrate with device camera API</p>
                </div>
                <Button fullWidth loading={loading} onClick={handleScanSimulate} icon={Scan}>Scan QR</Button>
              </div>
            </Card>
          ) : !paid ? (
            <Card>
              <div className="flex items-center gap-2 mb-4 text-up">
                <CheckCircle size={14} /><p className="text-xs font-medium">QR Scanned</p>
              </div>
              <div className="text-center py-4 border border-[#1f1f1f] rounded-lg mb-4">
                <p className="text-[#555] text-xs mb-1">Paying to</p>
                {/* merchant?.name, merchant?.upiId, merchant?.amount */}
                <p className="text-white font-semibold">{merchant?.name || 'Merchant Name'}</p>
                <p className="text-[#555] text-xs font-mono mt-0.5">{merchant?.upiId || 'merchant@upi'}</p>
                <p className="text-white text-3xl font-semibold font-mono mt-3">{fmt(merchant?.amount ?? 0)}</p>
              </div>
              <Button fullWidth loading={loading} onClick={handlePay} icon={QrCode}>Pay {fmt(merchant?.amount ?? 0)}</Button>
              <Button fullWidth variant="ghost" className="mt-2" onClick={() => setScanned(false)}>Cancel</Button>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <CheckCircle size={40} className="text-up" />
              <p className="text-white font-semibold">Payment Successful</p>
              <Button variant="secondary" onClick={() => { setScanned(false); setPaid(false) }}>Scan Again</Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
