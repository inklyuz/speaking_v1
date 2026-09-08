'use client'
import Link from 'next/link'
import { ArrowRight, BookOpen, CalendarDays, Check, Clock3, Headphones, MapPin, Mic2, PenLine, Users } from 'lucide-react'
import { useState } from 'react'

const exams = [
  {
    id: 'ml-march-2025',
    title: 'Multilevel English Examination',
    date: '29 March 2025',
    registration: 'Closes 14 March 2025',
    centre: 'Tashkent Centre',
    spots: 12,
    fee: '300 000 UZS',
    status: 'open',
  },
  {
    id: 'ml-april-2025',
    title: 'Multilevel English Examination',
    date: '12 April 2025',
    registration: 'Closes 28 March 2025',
    centre: 'Samarkand Centre',
    spots: 24,
    fee: '300 000 UZS',
    status: 'open',
  },
  {
    id: 'ml-april-2025-t',
    title: 'Multilevel English Examination',
    date: '26 April 2025',
    registration: 'Closes 11 April 2025',
    centre: 'Tashkent Centre',
    spots: 8,
    fee: '300 000 UZS',
    status: 'open',
  },
  {
    id: 'ml-may-2025',
    title: 'Multilevel English Examination',
    date: '17 May 2025',
    registration: 'Opens 1 April 2025',
    centre: 'Fergana Centre',
    spots: 30,
    fee: '300 000 UZS',
    status: 'soon',
  },
]

const components = [
  { name: 'Reading', icon: BookOpen, detail: 'Paper-based · 60 min', desc: 'Multiple-choice and short-answer questions based on written texts.' },
  { name: 'Listening', icon: Headphones, detail: 'Paper-based · 40 min', desc: 'Recorded prompts with note-taking and multiple-choice questions.' },
  { name: 'Writing', icon: PenLine, detail: 'Paper-based · 60 min', desc: 'Structured tasks requiring clear and organised written responses.' },
  { name: 'Speaking', icon: Mic2, detail: 'Computer-based · ~20 min', desc: 'Four guided parts with timed preparation and recorded responses.', accent: true },
]

export default function ExamsPage() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? exams : exams.filter(e => e.centre.toLowerCase().includes(filter))

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container-shell flex h-16 items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight">Multilevel<span className="text-primary">.exam</span></Link>
          <div className="flex items-center gap-4">
            <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
              <Link href="/exams" className="text-foreground">The exam</Link>
              <Link href="/mock" className="hover:text-foreground">Mock exam</Link>
              <Link href="/result" className="hover:text-foreground">Results</Link>
            </nav>
            <Link href="/apply" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Apply now</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="border-b bg-card py-14">
          <div className="container-shell">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">The examination</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">Understand the examination before you apply.</h1>
            <p className="mt-5 max-w-xl leading-7 text-muted-foreground">The Multilevel English Examination measures your ability across four components. Review the format, find an available session, and apply when you are ready.</p>
          </div>
        </section>

        <section className="container-shell py-16">
          <h2 className="text-2xl font-bold tracking-tight">Four components</h2>
          <p className="mt-2 text-muted-foreground">Each component tests a distinct dimension of practical English communication.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {components.map(c => (
              <div key={c.name} className={`rounded-xl border p-6 ${c.accent ? 'border-primary/30 bg-blue-50/60' : 'bg-card'}`}>
                <div className={`flex size-11 items-center justify-center rounded-lg ${c.accent ? 'bg-primary text-white' : 'bg-muted text-primary'}`}>
                  <c.icon className="size-5" />
                </div>
                <p className="mt-5 font-semibold">{c.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{c.detail}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t bg-card py-16">
          <div className="container-shell">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Available sessions</h2>
                <p className="mt-2 text-muted-foreground">All sessions include paper-based and computer-based speaking components.</p>
              </div>
              <div className="flex gap-2">
                {['all', 'tashkent', 'samarkand', 'fergana'].map(c => (
                  <button key={c} onClick={() => setFilter(c)}
                    className={`rounded-lg border px-3 py-2 text-xs font-semibold capitalize transition-colors ${filter === c ? 'border-primary bg-secondary text-primary' : 'bg-card hover:bg-muted'}`}>
                    {c === 'all' ? 'All centres' : c}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-8 grid gap-4">
              {filtered.map(exam => (
                <div key={exam.id} className="surface flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                    <CalendarDays className="size-6" />
                  </div>
                  <div className="flex-1 grid gap-1 sm:grid-cols-3 sm:gap-4 sm:items-center">
                    <div>
                      <p className="font-semibold">{exam.title}</p>
                      <p className="mt-0.5 text-sm text-primary font-medium">{exam.date}</p>
                    </div>
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5"><MapPin className="size-3.5" />{exam.centre}</span>
                      <span className="flex items-center gap-1.5"><Clock3 className="size-3.5" />{exam.registration}</span>
                      <span className="flex items-center gap-1.5"><Users className="size-3.5" />{exam.spots} places remaining</span>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div>
                        <p className="text-lg font-bold">{exam.fee}</p>
                        {exam.status === 'open' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                            <span className="size-1.5 rounded-full bg-emerald-500" /> Open
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
                            <span className="size-1.5 rounded-full bg-amber-400" /> Opening soon
                          </span>
                        )}
                      </div>
                      {exam.status === 'open' ? (
                        <Link href="/apply" className="shrink-0 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
                          Apply <ArrowRight className="ml-1 inline size-3.5" />
                        </Link>
                      ) : (
                        <button disabled className="shrink-0 rounded-lg border px-4 py-2.5 text-sm font-semibold text-muted-foreground cursor-not-allowed">
                          Coming soon
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container-shell py-16">
          <h2 className="text-2xl font-bold tracking-tight">What to expect on the day</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: '1', title: 'Arrive early', desc: 'Bring your ID document and admission card. Arrive at least 30 minutes before the session.' },
              { step: '2', title: 'Paper components', desc: 'Reading, listening, and writing are completed on paper in a supervised hall.' },
              { step: '3', title: 'Speaking session', desc: 'Your computer-based speaking session is scheduled separately and accessed via this platform.' },
              { step: '4', title: 'Result notification', desc: 'You will be notified by email when your result is published in your candidate portal.' },
            ].map(s => (
              <div key={s.step} className="surface p-6">
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{s.step}</span>
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-primary py-14 text-primary-foreground">
          <div className="container-shell flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold">Ready to apply?</h2>
              <p className="mt-2 text-primary-foreground/70">Choose a session and begin your application in under 10 minutes.</p>
            </div>
            <Link href="/apply" className="inline-flex items-center rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-primary shadow-sm hover:bg-white/90">
              Start application <ArrowRight className="ml-2 size-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t bg-card py-8">
        <div className="container-shell flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <Link href="/" className="font-semibold text-foreground">Multilevel<span className="text-primary">.exam</span></Link>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-foreground">About</Link>
            <Link href="/verify/demo" className="hover:text-foreground">Verify a result</Link>
            <Link href="/admin" className="hover:text-foreground">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
