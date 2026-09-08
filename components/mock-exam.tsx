'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, Clock3, Flag, LockKeyhole, AlertCircle } from 'lucide-react'

const TOTAL_SECONDS = 35 * 60

type Question = {
  id: number
  section: 'Reading' | 'Listening' | 'Writing'
  passage?: string
  question: string
  options: string[]
  correct: number
  flagged?: boolean
}

const questions: Question[] = [
  {
    id: 1, section: 'Reading',
    passage: `The concept of "deep work" — the ability to focus without distraction on cognitively demanding tasks — is becoming increasingly rare. Psychologist Cal Newport argues that this scarcity makes deep work valuable. Workers who can cultivate the ability to perform deep work will thrive; those who cannot are at risk of becoming obsolete. Shallow work, by contrast, includes things like answering emails and attending meetings — tasks that do not create new value and that are easy to replicate.`,
    question: 'According to the passage, why is deep work considered valuable?',
    options: [
      'It is required for answering emails efficiently',
      'Its rarity makes it a scarce and sought-after skill',
      'It involves attending many productive meetings',
      'It can be easily replicated by most workers'
    ],
    correct: 1
  },
  {
    id: 2, section: 'Reading',
    passage: `The concept of "deep work" — the ability to focus without distraction on cognitively demanding tasks — is becoming increasingly rare. Psychologist Cal Newport argues that this scarcity makes deep work valuable. Workers who can cultivate the ability to perform deep work will thrive; those who cannot are at risk of becoming obsolete. Shallow work, by contrast, includes things like answering emails and attending meetings — tasks that do not create new value and that are easy to replicate.`,
    question: 'Which of the following is described as an example of shallow work?',
    options: [
      'Writing a complex software program',
      'Researching a scientific topic for hours',
      'Attending meetings and replying to emails',
      'Designing a new product from scratch'
    ],
    correct: 2
  },
  {
    id: 3, section: 'Reading',
    passage: `Urbanisation is occurring at an unprecedented rate in the developing world. Cities in Africa and Asia are absorbing millions of rural migrants each year. While urban life offers access to better services and economic opportunities, it also brings challenges: overcrowded housing, strained infrastructure, and increased pollution. Governments are under pressure to plan ahead and ensure that growth is both sustainable and inclusive.`,
    question: 'What challenge does the passage associate with rapid urbanisation?',
    options: [
      'A decline in rural agriculture',
      'Better economic opportunities for migrants',
      'Overcrowded housing and strained infrastructure',
      'Decreased access to public services'
    ],
    correct: 2
  },
  {
    id: 4, section: 'Reading',
    passage: `Urbanisation is occurring at an unprecedented rate in the developing world. Cities in Africa and Asia are absorbing millions of rural migrants each year. While urban life offers access to better services and economic opportunities, it also brings challenges: overcrowded housing, strained infrastructure, and increased pollution. Governments are under pressure to plan ahead and ensure that growth is both sustainable and inclusive.`,
    question: 'What does the passage suggest governments should do?',
    options: [
      'Discourage rural migration to cities',
      'Plan for sustainable and inclusive urban growth',
      'Invest only in agricultural regions',
      'Focus on reducing pollution in rural areas'
    ],
    correct: 1
  },
  {
    id: 5, section: 'Listening',
    question: '[Audio] A university lecturer is explaining a research methodology. What is the main purpose of a control group in an experiment?',
    options: [
      'To receive the experimental treatment and measure its effects',
      'To serve as a baseline for comparison against the treated group',
      'To select participants randomly for the study',
      'To replace the experimental group if errors occur'
    ],
    correct: 1
  },
  {
    id: 6, section: 'Listening',
    question: '[Audio] Two students discuss their study schedules. According to Maria, why does she prefer studying in the morning?',
    options: [
      'The library is quieter in the morning',
      'Her concentration is highest early in the day',
      'She has no afternoon classes this semester',
      'Morning study sessions are shorter'
    ],
    correct: 1
  },
  {
    id: 7, section: 'Listening',
    question: '[Audio] A news report discusses renewable energy. Which energy source does the report say experienced the largest growth last year?',
    options: [
      'Wind energy',
      'Hydroelectric power',
      'Solar energy',
      'Geothermal power'
    ],
    correct: 2
  },
  {
    id: 8, section: 'Writing',
    question: 'Choose the sentence that uses the correct verb form: "By the time she arrived, the meeting ___ already ___."',
    options: [
      'has / started',
      'had / started',
      'was / starting',
      'will have / started'
    ],
    correct: 1
  },
  {
    id: 9, section: 'Writing',
    question: 'Which sentence is grammatically correct?',
    options: [
      'Neither of the students have completed their homework.',
      'Neither of the students has completed their homework.',
      'Neither of the student has completed their homework.',
      'Neither the students has completed their homework.'
    ],
    correct: 1
  },
  {
    id: 10, section: 'Writing',
    question: 'Select the most appropriate word to complete the sentence: "The scientist\'s findings were ___; no one had reached the same conclusion before."',
    options: [
      'redundant',
      'ambiguous',
      'unprecedented',
      'conventional'
    ],
    correct: 2
  },
]

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

export default function MockExam() {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [flagged, setFlagged] = useState<Set<number>>(new Set())
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS)
  const [submitted, setSubmitted] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current!); setSubmitted(true); return 0 }
        if (t === 300) setShowWarning(true)
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  }, [])

  const q = questions[current]
  const sections = ['Reading', 'Listening', 'Writing'] as const
  const sectionCounts = { Reading: 4, Listening: 3, Writing: 3 }

  const toggleFlag = () => {
    setFlagged(prev => {
      const next = new Set(prev)
      next.has(current) ? next.delete(current) : next.add(current)
      return next
    })
  }

  const handleSubmit = () => {
    clearInterval(timerRef.current!)
    setSubmitted(true)
  }

  if (submitted) {
    const correct = questions.filter(q => answers[q.id - 1] === q.correct).length
    const total = questions.length
    const pct = Math.round((correct / total) * 100)
    const band = pct >= 80 ? 'B2–C1' : pct >= 60 ? 'B1–B2' : pct >= 40 ? 'A2–B1' : 'A1–A2'
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container-shell flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <LockKeyhole className="size-4 text-primary" />
              <span className="font-semibold">Multilevel Mock Exam</span>
            </div>
            <Link href="/mock" className="text-sm text-muted-foreground hover:text-foreground">Exit</Link>
          </div>
        </header>
        <main className="container-shell py-12">
          <div className="mx-auto max-w-3xl">
            <div className="surface p-8 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                <Check className="size-8" />
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-emerald-500">Practice complete</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">Your mock result</h1>
              <p className="mt-3 text-muted-foreground">This is a practice score and does not affect your official result.</p>
              <div className="mt-8 inline-flex flex-col items-center justify-center rounded-full border-4 border-primary p-8">
                <span className="text-5xl font-bold text-primary">{pct}%</span>
                <span className="mt-1 text-sm text-muted-foreground">Overall score</span>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-muted p-4">
                  <p className="text-xs text-muted-foreground">Correct</p>
                  <p className="mt-1 text-2xl font-bold text-emerald-500">{correct} / {total}</p>
                </div>
                <div className="rounded-xl bg-muted p-4">
                  <p className="text-xs text-muted-foreground">Unanswered</p>
                  <p className="mt-1 text-2xl font-bold">{total - Object.keys(answers).length}</p>
                </div>
                <div className="rounded-xl bg-muted p-4">
                  <p className="text-xs text-muted-foreground">Estimated band</p>
                  <p className="mt-1 text-2xl font-bold text-primary">{band}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 surface overflow-hidden">
              <div className="border-b p-5">
                <h2 className="font-semibold">Question review</h2>
              </div>
              <div className="divide-y">
                {questions.map((q, i) => {
                  const given = answers[q.id - 1]
                  const isCorrect = given === q.correct
                  const unanswered = given === undefined
                  return (
                    <div key={q.id} className="p-5">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${unanswered ? 'bg-muted text-muted-foreground' : isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                          {unanswered ? '–' : isCorrect ? '✓' : '✗'}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-primary">{q.section} · Q{i + 1}</p>
                          <p className="mt-1 text-sm font-medium">{q.question}</p>
                          {!unanswered && !isCorrect && (
                            <p className="mt-1.5 text-xs text-muted-foreground">
                              Your answer: <span className="text-red-500">{q.options[given]}</span> · Correct: <span className="text-emerald-600">{q.options[q.correct]}</span>
                            </p>
                          )}
                          {unanswered && (
                            <p className="mt-1.5 text-xs text-muted-foreground">Not answered · Correct: <span className="text-emerald-600">{q.options[q.correct]}</span></p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Link href="/mock" className="rounded-lg border px-5 py-3 text-sm font-semibold hover:bg-muted">Back to mock exams</Link>
              <Link href="/apply" className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Apply for official exam <ArrowRight className="ml-2 inline size-4" /></Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const urgent = timeLeft < 300

  return (
    <div className="min-h-screen bg-background">
      {showWarning && (
        <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-3 bg-amber-500 px-5 py-3 text-sm font-semibold text-white">
          <span className="flex items-center gap-2"><AlertCircle className="size-4" /> 5 minutes remaining — review your answers</span>
          <button onClick={() => setShowWarning(false)} className="rounded px-2 py-1 hover:bg-amber-600">Dismiss</button>
        </div>
      )}
      <header className="border-b bg-card">
        <div className="container-shell flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <LockKeyhole className="size-4 text-primary" />
            <span className="font-semibold">Multilevel Mock Exam</span>
          </div>
          <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${urgent ? 'bg-red-50 text-red-600' : 'bg-muted'}`}>
            <Clock3 className={`size-4 ${urgent ? 'text-red-500' : 'text-primary'}`} />
            {formatTime(timeLeft)} remaining
          </div>
        </div>
      </header>
      <div className="border-b bg-card">
        <div className="container-shell flex gap-0">
          {sections.map(sec => {
            const startIdx = sec === 'Reading' ? 0 : sec === 'Listening' ? 4 : 7
            const active = q.section === sec
            return (
              <button key={sec} onClick={() => setCurrent(startIdx)}
                className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${active ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                {sec}
              </button>
            )
          })}
        </div>
      </div>
      <main className="container-shell py-6">
        <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
          <aside className="surface h-fit p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Questions</p>
              <Flag className="size-4 text-muted-foreground" />
            </div>
            {sections.map(sec => {
              const startIdx = sec === 'Reading' ? 0 : sec === 'Listening' ? 4 : 7
              const count = sectionCounts[sec]
              return (
                <div key={sec} className="mt-4">
                  <p className="mb-2 text-xs font-semibold text-muted-foreground">{sec}</p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {Array.from({ length: count }, (_, i) => {
                      const idx = startIdx + i
                      const isAnswered = answers[idx] !== undefined
                      const isCurrent = current === idx
                      const isFlagged = flagged.has(idx)
                      return (
                        <button key={idx} onClick={() => setCurrent(idx)}
                          className={`relative flex size-9 items-center justify-center rounded-lg border text-sm font-semibold transition-all
                            ${isCurrent ? 'border-primary bg-primary text-primary-foreground' : isAnswered ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'hover:bg-muted'}`}>
                          {idx + 1}
                          {isFlagged && <span className="absolute -right-1 -top-1 size-2 rounded-full bg-amber-400" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
            <div className="mt-5 border-t pt-4 text-xs leading-5 text-muted-foreground">
              <p>Answered: {Object.keys(answers).length} / {questions.length}</p>
              <p>Flagged: {flagged.size}</p>
            </div>
            <button onClick={handleSubmit}
              className="mt-4 w-full rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground">
              Submit exam
            </button>
          </aside>
          <section className="surface flex min-h-[560px] flex-col p-6 sm:p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">{q.section}</p>
                <p className="mt-1 text-xs text-muted-foreground">Question {current + 1} of {questions.length}</p>
              </div>
              <button onClick={toggleFlag}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${flagged.has(current) ? 'border-amber-300 bg-amber-50 text-amber-600' : 'text-muted-foreground hover:bg-muted'}`}>
                <Flag className="size-3.5" /> {flagged.has(current) ? 'Flagged' : 'Flag'}
              </button>
            </div>
            {q.passage && (
              <div className="mt-6 rounded-xl bg-muted/50 p-5 text-sm leading-7 text-foreground/80 border">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Passage</p>
                {q.passage}
              </div>
            )}
            <h1 className="mt-7 max-w-2xl text-xl font-bold leading-snug">{q.question}</h1>
            <div className="mt-6 grid gap-3">
              {q.options.map((opt, i) => (
                <button key={i} onClick={() => setAnswers({ ...answers, [current]: i })}
                  className={`flex items-center gap-4 rounded-xl border p-4 text-left text-sm transition-all
                    ${answers[current] === i ? 'border-primary bg-secondary shadow-sm' : 'hover:bg-muted'}`}>
                  <span className={`flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold
                    ${answers[current] === i ? 'border-primary bg-primary text-white' : ''}`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>
            <div className="mt-auto flex justify-between border-t pt-6">
              <button disabled={current === 0} onClick={() => setCurrent(current - 1)}
                className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold disabled:opacity-40 hover:bg-muted">
                <ArrowLeft className="size-4" /> Previous
              </button>
              {current === questions.length - 1 ? (
                <button onClick={handleSubmit}
                  className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
                  Submit <Check className="size-4" />
                </button>
              ) : (
                <button onClick={() => setCurrent(current + 1)}
                  className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
                  Next <ArrowRight className="size-4" />
                </button>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
