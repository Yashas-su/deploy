import { useEffect, useState } from 'react'
import { Trophy, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, Empty, PageSpinner } from '../../components/UI'
import { gradeColor } from '../../utils/helpers'

export default function ResultsPage() {
  const [results, setResults] = useState([])
  const [summary, setSummary] = useState(null)
  const [expanded, setExpanded] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 🔥 STATIC REALISTIC RESULTS DATA
    const staticData = {
      summary: {
        cgpa: 8.42,
        currentSgpa: 8.75,
        rank: 12,
        totalStudents: 180
      },
      semesters: [
        {
          semester: "Semester 5",
          sgpa: 8.75,
          result: "PASS",
          subjects: [
            { code: "CSE2260", name: "Database Management System", credits: 4, grade: "A", points: 9 },
            { code: "CSE2269", name: "Operating Systems", credits: 4, grade: "A-", points: 8 },
            { code: "CSE2271", name: "Computer Networks", credits: 3, grade: "B+", points: 7 },
            { code: "CSE2280", name: "Artificial Intelligence", credits: 3, grade: "A", points: 9 },
            { code: "CSE2255", name: "Software Engineering", credits: 3, grade: "A", points: 9 },
          ]
        },
        {
          semester: "Semester 4",
          sgpa: 8.10,
          result: "PASS",
          subjects: [
            { code: "CSE2240", name: "Data Structures", credits: 4, grade: "A-", points: 8 },
            { code: "CSE2245", name: "Discrete Mathematics", credits: 3, grade: "B+", points: 7 },
            { code: "CSE2250", name: "Computer Organization", credits: 3, grade: "A", points: 9 },
            { code: "CSE2252", name: "Theory of Computation", credits: 3, grade: "B", points: 6 },
          ]
        },
        {
          semester: "Semester 3",
          sgpa: 7.85,
          result: "PASS",
          subjects: [
            { code: "CSE2230", name: "Object Oriented Programming", credits: 4, grade: "B+", points: 7 },
            { code: "CSE2235", name: "Digital Logic", credits: 3, grade: "B", points: 6 },
            { code: "CSE2238", name: "Probability & Statistics", credits: 3, grade: "A-", points: 8 },
          ]
        }
      ]
    }

    setResults(staticData.semesters)
    setSummary(staticData.summary)
    setLoading(false)
  }, [])

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-5">
      <h1 className="text-white text-2xl font-semibold">Results</h1>

      {/* CGPA Hero */}
      <div className="card p-6 flex items-start justify-between">
        <div>
          <p className="text-[#555] text-xs mb-2">Cumulative GPA</p>
          <p className="text-white text-6xl font-semibold font-mono">
            {summary?.cgpa}
          </p>
          <p className="text-[#555] text-xs mt-2">
            Rank #{summary.rank} of {summary.totalStudents}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[#555] text-xs mb-1">Current SGPA</p>
          <p className="text-white text-3xl font-semibold font-mono">
            {summary?.currentSgpa}
          </p>
        </div>
      </div>

      {/* Semester Cards */}
      {results.length === 0 ? (
        <Card>
          <Empty
            icon={Trophy}
            title="No results yet"
            description="Results will appear here"
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {results.map((sem, si) => {
            const isOpen = expanded === (sem.semester || si)

            const totalCredits = sem.subjects.reduce(
              (sum, sub) => sum + sub.credits,
              0
            )

            return (
              <Card key={sem.semester}>
                <button
                  className="w-full text-left"
                  onClick={() =>
                    setExpanded(isOpen ? null : (sem.semester || si))
                  }
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium text-sm">
                        {sem.semester}
                      </p>
                      <p className="text-[#555] text-xs mt-0.5">
                        {sem.subjects.length} subjects · {totalCredits} credits
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[#555] text-xs">SGPA</p>
                        <p className="text-2xl font-semibold font-mono text-white">
                          {sem.sgpa}
                        </p>
                      </div>

                      {isOpen ? (
                        <ChevronUp size={15} className="text-[#555]" />
                      ) : (
                        <ChevronDown size={15} className="text-[#555]" />
                      )}
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
                              <th key={h} className="text-left text-[#555] pb-2 pr-4">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          {sem.subjects.map(sub => (
                            <tr key={sub.code}>
                              <td className="py-2 text-[#555]">{sub.code}</td>
                              <td className="py-2 text-white">{sub.name}</td>
                              <td className="py-2 text-[#888]">{sub.credits}</td>
                              <td className={`py-2 font-bold ${gradeColor(sub.grade)}`}>
                                {sub.grade}
                              </td>
                              <td className="py-2 text-[#888]">{sub.points}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-between mt-4 pt-3 border-t border-[#1f1f1f]">
                      <span className="text-up text-xs flex items-center gap-1">
                        <Trophy size={12} /> {sem.result}
                      </span>
                      <span className="text-white text-xs flex items-center gap-1">
                        <TrendingUp size={12} /> SGPA {sem.sgpa}
                      </span>
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