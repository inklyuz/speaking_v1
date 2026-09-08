'use client'
import Link from 'next/link'
import { ArrowRight, BookOpen, CalendarDays, Check, Clock3, Download, FileText, Headphones, LogOut, Mic2, PenLine, User } from 'lucide-react'
import { useState } from 'react'

const application = {
  number: 'ML-2025-4871',
  name: 'Azizbek Toshmatov',
  exam: 'Multilevel English Examination',
  date: '29 March 2025',
  centre: 'Tashkent Centre',
  status: 'Confirmed',
  paid: '300 000 UZS',
}

const components = [
  { name: 'Reading', icon: BookOpen, status: 'Completed', band: 'B2', score: '72%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { name: 'Listening', icon: Headphones, status: 'Completed', band: 'B1', score: '65%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { name: 'Writing', icon: PenLine, status: 'Completed', band: 'B2–C1', score: '80%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { name: 'Speaking', icon: Mic2, status: 'Pending assessment', band: null, score: null, color: 'text-amber-600', bg: 'bg-amber-50' },
]

const timeline = [
  { label: 'Application submitted', date: '10 Jan 2025', done: true },
  { label: 'Payment confirmed', date: '11 Jan 2025', done: true },
  { label: 'Exam session', date: '29 Mar 2025', done: true },
  { label: 'Speaking assessment', date: 'In progress', done: false },
  { label: 'Result published', date: 'Expected late April', done: false },
]

export default function Dashboard() {
  const [tab, setTab] = useState<'overview' | 'result' | 'documents'>('overview')

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container-shell flex h-16 items-center justify-between">
          <Link href="/" className="font-semibold">Multilevel<span className="text-primary">.exam</span></Link>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 text-sm sm:flex">
              <div className="flex size-8 items-center justify-center rounded-full bg-secondary">
                <User className="size-4 text-primary" />
              </div>
              <span className="font-medium">{application.name}</span>
            </div>
            <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <LogOut className="size-4" /> Sign out
            </Link>
          </div>
        </div>
      </header>

      <div className="container-shell py-10">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Candidate portal</p>
            <h1 className="mt-1 text-2xl font-bold">Welcome back, {application.name.split(' ')[0]}.</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm">
            <span className="size-2 rounded-full bg-amber-400" />
            <span className="font-medium text-amber-700">Assessment in progress</span>
          </div>
        </div>

        <div className="mt-6 flex gap-1 border-b">
          {(['overview', 'result', 'documents'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm font-semibold capitalize border-b-2 transition-colors ${tab === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
            <div className="grid gap-5">
              <div className="surface p-6">
                <h2 className="font-semibold">Application details</h2>
                <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                  {[
                    ['Application no.', application.number],
                    ['Exam', application.exam],
                    ['Date', application.date],
                    ['Study centre', application.centre],
                    ['Status', application.status],
                    ['Fee paid', application.paid],
                  ].map(([l, v]) => (
                    <div key={l}>
                      <p className="text-muted-foreground">{l}</p>
                      <p className="mt-0.5 font-semibold">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="surface p-6">
                <h2 className="font-semibold">Exam components</h2>
                <div className="mt-5 grid gap-3">
                  {components.map(c => (
                    <div key={c.name} className="flex items-center gap-4 rounded-xl border p-4">
                      <div className={`flex size-10 items-center justify-center rounded-lg ${c.bg} ${c.color}`}>
                        <c.icon className="size-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{c.name}</p>
                        <p className={`text-sm ${c.color}`}>{c.status}</p>
                      </div>
                      {c.band && (
                        <div className="text-right">
                          <p className="font-bold text-primary">{c.band}</p>
                          <p className="text-xs text-muted-foreground">{c.score}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/* Speaking session access */}
              <div className="surface border-primary/30 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mic2 className="size-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Speaking session access</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Use the access code from your registration card to enter your speaking session.</p>
                    <Link href="/speaking/login" className="mt-4 inline-flex items-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
                      Enter speaking session <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <aside className="grid gap-4 h-fit">
              <div className="surface p-5">
                <h3 className="font-semibold text-sm">Your journey</h3>
                <div className="mt-5 flex flex-col gap-0">
                  {timeline.map((t, i) => (
                    <div key={t.label} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`flex size-6 items-center justify-center rounded-full border-2 text-xs font-bold ${t.done ? 'border-emerald-400 bg-emerald-400 text-white' : 'border-border bg-card'}`}>
                          {t.done && <Check className="size-3" />}
                        </div>
                        {i < timeline.length - 1 && <div className={`w-px flex-1 my-1 ${t.done ? 'bg-emerald-200' : 'bg-border'}`} />}
                      </div>
                      <div className="pb-4">
                        <p className={`text-sm font-medium ${t.done ? '' : 'text-muted-foreground'}`}>{t.label}</p>
                        <p className="text-xs text-muted-foreground">{t.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="surface p-5">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="size-4 text-primary" />
                  <span className="font-medium">Result expected</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Late April 2025. You will receive an email when your result is published.</p>
              </div>
            </aside>
          </div>
        )}

        {tab === 'result' && (
          <div className="mt-8 max-w-2xl">
            <div className="surface p-8 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-amber-50">
                <Clock3 className="size-6 text-amber-500" />
              </div>
              <h2 className="mt-4 text-xl font-bold">Result pending</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground max-w-sm mx-auto">
                Your speaking component is currently being assessed. Once the examination team publishes your result, it will appear here.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3 text-left">
                {components.filter(c => c.band).map(c => (
                  <div key={c.name} className="rounded-xl bg-muted p-4">
                    <p className="text-xs text-muted-foreground">{c.name}</p>
                    <p className="mt-1 text-lg font-bold text-primary">{c.band}</p>
                    <p className="text-xs text-muted-foreground">{c.score}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'documents' && (
          <div className="mt-8 max-w-2xl">
            <div className="surface overflow-hidden">
              <div className="border-b p-5">
                <h2 className="font-semibold">Documents</h2>
                <p className="text-sm text-muted-foreground mt-1">Documents are published here when the examination service releases them.</p>
              </div>
              <div className="divide-y">
                {[
                  { name: 'Registration confirmation', date: '11 Jan 2025', ready: true },
                  { name: 'Examination admit card', date: '15 Mar 2025', ready: true },
                  { name: 'Result certificate', date: 'Pending publication', ready: false },
                  { name: 'Score report', date: 'Pending publication', ready: false },
                ].map(d => (
                  <div key={d.name} className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-3">
                      <div className={`flex size-9 items-center justify-center rounded-lg ${d.ready ? 'bg-secondary text-primary' : 'bg-muted text-muted-foreground'}`}>
                        <FileText className="size-4" />
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${!d.ready ? 'text-muted-foreground' : ''}`}>{d.name}</p>
                        <p className="text-xs text-muted-foreground">{d.date}</p>
                      </div>
                    </div>
                    {d.ready ? (
                      <button className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold hover:bg-muted">
                        <Download className="size-3.5" /> Download
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground">Not available</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
