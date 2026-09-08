import Link from 'next/link'
import { ArrowRight, BookOpen, Clock3, Headphones, PenLine, Play } from 'lucide-react'

const mocks = [
  {
    id: 'multilevel-demo',
    title: 'Full mock exam',
    desc: 'Reading, listening, and writing in one 35-minute timed session. Includes question review and estimated band at the end.',
    components: ['Reading (4 Qs)', 'Listening (3 Qs)', 'Writing (3 Qs)'],
    duration: '35 min',
    questions: 10,
  },
]

export default function MockPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container-shell flex h-16 items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight">Multilevel<span className="text-primary">.exam</span></Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <Link href="/exams" className="hover:text-foreground">The exam</Link>
            <Link href="/mock" className="text-foreground">Mock exam</Link>
            <Link href="/result" className="hover:text-foreground">Results</Link>
          </nav>
          <Link href="/apply" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Apply now</Link>
        </div>
      </header>
      <main className="container-shell py-14">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Practice</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Prepare with a mock exam.</h1>
        <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
          Get familiar with the examination format before your session. The mock includes timed questions across all written components and gives you an estimated band at the end.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mocks.map(m => (
            <div key={m.id} className="surface flex flex-col p-6">
              <div className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary">
                <Play className="size-6" />
              </div>
              <h2 className="mt-5 text-lg font-bold">{m.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground flex-1">{m.desc}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {m.components.map(c => (
                  <span key={c} className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">{c}</span>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Clock3 className="size-3.5" />{m.duration}</span>
                <span>{m.questions} questions</span>
              </div>
              <Link href={`/mock/${m.id}`}
                className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">
                <Play className="size-4" /> Start mock exam
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-14 surface p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">How the mock exam works</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {[
              { icon: BookOpen, title: 'Answer questions', desc: 'Work through reading, listening, and writing questions with a live countdown timer.' },
              { icon: Clock3, title: 'Submit when ready', desc: 'Submit at any point. The exam also submits automatically when the timer runs out.' },
              { icon: PenLine, title: 'Review your answers', desc: 'See which answers were correct, your score by section, and an estimated CEFR band.' },
            ].map(s => (
              <div key={s.title} className="flex gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <s.icon className="size-5" />
                </div>
                <div>
                  <p className="font-semibold">{s.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between rounded-xl border bg-card p-6">
          <div>
            <p className="font-semibold">Ready for the official exam?</p>
            <p className="mt-1 text-sm text-muted-foreground">Apply for an upcoming session after completing your practice.</p>
          </div>
          <Link href="/apply" className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
            Apply now <ArrowRight className="size-4" />
          </Link>
        </div>
      </main>
    </div>
  )
}
