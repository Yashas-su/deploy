import { useEffect, useState } from 'react'
import { Trophy, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, SectionHeader, Empty, PageSpinner } from '../../components/UI'
import { gradeColor } from '../../utils/helpers'
import { academicsAPI } from '../../services/api'

export default function ResultsPage() {
  // results: [{ semester, sgpa, subjects: [{ code, name, grade, points, credits }] }]
  const [results,  setResults]  = useState([])
  const [summary,  setSummary]  = useState(null)   // { cgpa, rank, totalStudents }
  const [expanded, setExpanded] = useState(null)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    // academicsAPI.getResults().then(r => { if (r.data) { setResults(r.data.semesters); setSummary(r.data.summary) } setLoading(false) })
    setLoading(false)
  }, [])

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-5">
      <h1 className="text-white text-2xl font-semibold">Results</h1>

      {/* CGPA hero */}
      <div className="card p-6 flex items-start justify-between">
        <div>
          <p className="text-[#555] text-xs mb-2">Cumulative GPA</p>
          <p className="text-white text-6xl font-semibold font-mono">{summary?.cgpa ?? '—'}</p>
          <p className="text-[#555] text-xs mt-2">
            {summary?.rank ? `Rank #${summary.rank} of ${summary.totalStudents}` : 'Rank loads from backend'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[#555] text-xs mb-1">Current SGPA</p>
          <p className="text-white text-3xl font-semibold font-mono">{summary?.currentSgpa ?? '—'}</p>
        </div>
      </div>

      {/* Semester result cards */}
      {results.length === 0 ? (
        <Card>
          <Empty icon={Trophy} title="No results yet" description="Your semester results will appear here once published by your college" />
        </Card>
      ) : (
        <div className="space-y-3">
          {results.map((sem, si) => {
            const isOpen = expanded === (sem.semester || si)
            const totalCredits = (sem.subjects || []).reduce((s, sub) => s + (sub.credits || 0), 0)

            return (
              <Card key={sem.semester || si}>
                <button className="w-full text-left"
                  onClick={() => setExpanded(isOpen ? null : (sem.semester || si))}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium text-sm">{sem.semester}</p>
                      <p className="text-[#555] text-xs mt-0.5">{(sem.subjects || []).length} subjects · {totalCredits} credits</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[#555] text-xs">SGPA</p>
                        <p className={`text-2xl font-semibold font-mono ${sem.sgpa >= 9 ? 'text-up' : sem.sgpa >= 7 ? 'text-white' : 'text-warn'}`}>
                          {sem.sgpa ?? '—'}
                        </p>
                      </div>
                      {isOpen ? <ChevronUp size={15} className="text-[#555]" /> : <ChevronDown size={15} className="text-[#555]" />}
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-4 pt-4 border-t border-[#1f1f1f]">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-[#1f1f1f]">
                            {['Code', 'Subject', 'Credits', 'Grade', 'Points'].map(h => (
                              <th key={h} className="text-left text-[#555] font-medium uppercase tracking-wider pb-2 pr-4 last:pr-0">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#0a0a0a]">
                          {(sem.subjects || []).map(sub => (
                            <tr key={sub.code} className="hover:bg-[#0a0a0a] transition-colors">
                              <td className="py-2.5 pr-4 text-[#555] font-mono">{sub.code}</td>
                              <td className="py-2.5 pr-4 text-white">{sub.name}</td>
                              <td className="py-2.5 pr-4 text-[#888]">{sub.credits}</td>
                              <td className="py-2.5 pr-4">
                                <span className={`font-bold text-base font-mono ${gradeColor(sub.grade)}`}>{sub.grade}</span>
                              </td>
                              <td className="py-2.5 text-[#888]">{sub.points}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#1f1f1f]">
                      <div className="flex items-center gap-2 text-up text-xs">
                        <Trophy size={12} />
                        <span>Result: {sem.result || 'PASS'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-white text-xs">
                        <TrendingUp size={12} />
                        <span className="font-semibold font-mono">SGPA {sem.sgpa ?? '—'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
