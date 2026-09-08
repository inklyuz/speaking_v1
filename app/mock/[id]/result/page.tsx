import Link from 'next/link'
import { ArrowRight, BookOpen, Headphones, PenLine, RotateCcw } from 'lucide-react'

// In production this would come from the backend via params.id
export default function Page() {
  const sections = [
    { name: 'Reading', icon: BookOpen, score: 72, total: 100, band: 'B2', color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Listening', icon: Headphones, score: 65, total: 100, band: 'B1', color: 'text-violet-600', bg: 'bg-violet-50' },
    { name: 'Writing', icon: PenLine, score: 80, total: 100, band: 'B2–C1', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ]
  const overall = Math.round(sections.reduce((s, x) => s + x.score, 0) / sections.length)

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container-shell flex h-16 items-center justify-between">
          <Link href="/" className="font-semibold">Multilevel<span className="text-primary">.exam</span></Link>
          <Link href="/mock" className="text-sm text-muted-foreground hover:text-foreground">All mock exams</Link>
        </div>
      </header>
      <div className="container-shell py-12">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Practice result</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Your mock exam result</h1>
          <p className="mt-3 text-muted-foreground max-w-xl">This is a practice score only. It gives you an indication of your current level and does not form part of your official examination.</p>

          <div className="mt-10 surface p-8">
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-10">
              <div className="flex flex-col items-center">
                <div className="flex size-24 items-center justify-center rounded-full border-4 border-primary">
                  <span className="text-4xl font-bold text-primary">{overall}%</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Overall score</p>
              </div>
              <div className="flex-1">
                <div className="grid gap-3">
                  {sections.map(s => (
                    <div key={s.name} className="flex items-center gap-3">
                      <div className={`flex size-8 items-center justify-center rounded-lg ${s.bg} ${s.color}`}>
                        <s.icon className="size-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{s.name}</span>
                          <span className="text-muted-foreground">{s.score}% · <span className={`font-semibold ${s.color}`}>{s.band}</span></span>
                        </div>
                        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${s.score}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="surface p-5">
              <p className="text-xs text-muted-foreground">Estimated band</p>
              <p className="mt-1 text-2xl font-bold text-primary">B1–B2</p>
              <p className="mt-1 text-xs text-muted-foreground">Based on your mock score</p>
            </div>
            <div className="surface p-5">
              <p className="text-xs text-muted-foreground">Strongest section</p>
              <p className="mt-1 text-2xl font-bold">Writing</p>
              <p className="mt-1 text-xs text-emerald-600 font-medium">80%</p>
            </div>
            <div className="surface p-5">
              <p className="text-xs text-muted-foreground">Area to improve</p>
              <p className="mt-1 text-2xl font-bold">Listening</p>
              <p className="mt-1 text-xs text-muted-foreground">65%</p>
            </div>
          </div>

          <div className="mt-5 surface p-6">
            <h2 className="font-semibold">What's next?</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Your mock result suggests you are working within the B1–B2 range. The official examination will assess you across all four components, including a computer-based speaking session.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/apply" className="inline-flex items-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
                Apply for official exam <ArrowRight className="ml-2 size-4" />
              </Link>
              <Link href="/mock" className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold hover:bg-muted">
                <RotateCcw className="size-4" /> Try again
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
