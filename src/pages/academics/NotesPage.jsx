import { useEffect, useState } from 'react'
import { FileText, Download, Upload, Search, Eye } from 'lucide-react'
import { Card, SectionHeader, Button, Empty, PageSpinner } from '../../components/UI'
import { fmtDate } from '../../utils/helpers'
import { academicsAPI } from '../../services/api'
import clsx from 'clsx'

export default function NotesPage() {
  // notes: [{ id, subject, title, type, size, uploadedBy, date, downloads }]
  const [notes,    setNotes]    = useState([])
  const [search,   setSearch]   = useState('')
  const [subject,  setSubject]  = useState('All')
  const [loading,  setLoading]  = useState(true)
  const [uploading,setUploading]= useState(false)

  useEffect(() => {
    // academicsAPI.getNotes().then(r => { if (r.data) setNotes(r.data); setLoading(false) })
    setLoading(false)
  }, [])

  const subjects = ['All', ...new Set(notes.map(n => n.subject).filter(Boolean))]

  const filtered = notes.filter(n => {
    const matchSearch  = !search || n.title?.toLowerCase().includes(search.toLowerCase()) || n.subject?.toLowerCase().includes(search.toLowerCase())
    const matchSubject = subject === 'All' || n.subject === subject
    return matchSearch && matchSubject
  })

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    /**
     * TODO:
     * const { data, error } = await academicsAPI.uploadNote(fd)
     * if (data) setNotes(n => [data, ...n])
     */
    setTimeout(() => setUploading(false), 800)
  }

  const handleDownload = async (note) => {
    /**
     * TODO:
     * const { data } = await academicsAPI.downloadNote(note.id)
     * // data.url — open or trigger download
     * window.open(data.url, '_blank')
     */
  }

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-white text-2xl font-semibold">Notes</h1>
        <label className={clsx('btn btn-secondary cursor-pointer', uploading && 'opacity-50')}>
          <Upload size={13} />
          {uploading ? 'Uploading…' : 'Upload'}
          <input type="file" className="hidden" onChange={handleUpload} accept=".pdf,.pptx,.docx,.jpg,.png" />
        </label>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555] pointer-events-none" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          className="input pl-9" placeholder="Search notes or subjects…" />
      </div>

      {/* Subject chips */}
      {subjects.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {subjects.map(s => (
            <button key={s} onClick={() => setSubject(s)}
              className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                subject === s ? 'bg-white text-black border-white' : 'border-[#1f1f1f] text-[#888] hover:text-white')}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Notes list */}
      {filtered.length === 0 ? (
        <Card>
          <Empty icon={FileText} title={notes.length === 0 ? 'No notes yet' : 'No results'}
            description={notes.length === 0 ? 'Notes shared by faculty and students will appear here' : 'Try a different search or filter'} />
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filtered.map((note, i) => (
            <Card key={note.id || i}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#1f1f1f] flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium leading-snug line-clamp-2">{note.title}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {note.subject && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1f1f1f] text-[#888] border border-[#2a2a2a]">
                        {note.subject}
                      </span>
                    )}
                    <span className="text-[#333] text-[10px]">{note.type} · {note.size}</span>
                  </div>
                  <p className="text-[#333] text-[10px] mt-0.5">by {note.uploadedBy} · {fmtDate(note.date)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1f1f1f]">
                <span className="text-[#333] text-xs flex items-center gap-1">
                  <Download size={10} /> {note.downloads ?? 0} downloads
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" icon={Eye}>View</Button>
                  <Button size="sm" variant="secondary" icon={Download} onClick={() => handleDownload(note)}>Save</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
