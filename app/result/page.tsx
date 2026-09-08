'use client'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, BookOpen, Check, Clock3, Download, ExternalLink, Headphones, Mic2, PenLine, Search } from 'lucide-react'

export default function ResultPage() {
  const [appNo, setAppNo] = useState('')
  const [dob, setDob] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [found, setFound] = useState(false)

  const handleLookup = () => {
    setSubmitted(true)
    // Simulate: ML-2025-4871 + any dob shows a result
    setFound(appNo.trim().toUpperCase() === 'ML-2025-4871' && !!dob)
  }

  const components = [
    { name: 'Reading', icon: BookOpen, band: 'B2', score: '72%', status: 'Published' },
    { name: 'Listening', icon: Headphones, band: 'B1', score: '65%', status: 'Published' },
    { name: 'Writing', icon: PenLine, band: 'B2–C1', score: '80%', status: 'Published' },
    { name: 'Speaking', icon: Mic2, band: '—', score: '—', status: 'Pending' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container-shell flex h-16 items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight">Multilevel<span className="text-primary">.exam</span></Link>
          <Link href="/dashboard" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Candidate portal</Link>
        </div>
      </header>

      <main className="container-shell py-14">
        <div className="mx-auto max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Results portal</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">View your result.</h1>
          <p className="mt-4 leading-7 text-muted-foreground">Enter your application number and date of birth to access your published result. Try <strong>ML-2025-4871</strong> with any date.</p>

          <div className="surface mt-10 p-6 sm:p-8">
            <div className="grid gap-4">
              <label className="flex flex-col gap-1.5 text-sm font-medium">
                Application number
                <input value={appNo} onChange={e => setAppNo(e.target.value)} placeholder="e.g. ML-2025-4871"
                  className="rounded-lg border bg-card px-3 py-3 text-sm font-normal outline-none focus:ring-2 focus:ring-ring" />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium">
                Date of birth
                <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                  className="rounded-lg border bg-card px-3 py-3 text-sm font-normal outline-none focus:ring-2 focus:ring-ring" />
              </label>
              <button onClick={handleLookup}
                className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">
                <Search className="size-4" /> Find my result
              </button>
            </div>
          </div>

          {submitted && !found && (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
              No result found for this combination. Check your application number and date of birth, or contact the examination service.
            </div>
          )}

          {found && (
            <div className="mt-8 grid gap-4">
              <div className="surface p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">ML-2025-4871 · Azizbek Toshmatov</p>
                    <h2 className="mt-1 text-xl font-bold">Multilevel English Examination</h2>
                    <p className="text-sm text-muted-foreground">29 March 2025 · Tashkent Centre</p>
                  </div>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">Partially published</span>
                </div>
                <div className="mt-6 grid gap-3">
                  {components.map(c => (
                    <div key={c.name} className={`flex items-center gap-4 rounded-xl border p-4 ${c.status === 'Pending' ? 'opacity-60' : ''}`}>
                      <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-primary">
                        <c.icon className="size-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{c.name}</p>
                        <p className={`text-xs ${c.status === 'Published' ? 'text-emerald-600' : 'text-amber-600'}`}>{c.status}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${c.band !== '—' ? 'text-primary' : 'text-muted-foreground'}`}>{c.band}</p>
                        <p className="text-xs text-muted-foreground">{c.score}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold hover:bg-muted">
                  <Download className="size-4" /> Download score report
                </button>
                <Link href="/verify/ml-2025-4871" className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold hover:bg-muted">
                  <ExternalLink className="size-4" /> Verify this result
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
