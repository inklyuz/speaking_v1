"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { getSubmission, saveAssessment, type CriteriaScores } from "@/lib/speaking-store"

const CRITERIA: { key: keyof CriteriaScores; label: string }[] = [
  { key: "fluency", label: "Fluency" },
  { key: "vocabulary", label: "Vocabulary" },
  { key: "grammar", label: "Grammar" },
  { key: "pronunciation", label: "Pronunciation" },
  { key: "interaction", label: "Interaction" },
]

export default function Page() {
  const params = useParams<{ id: string }>()
  const submission = getSubmission(params.id)
  const [scores, setScores] = useState<CriteriaScores>(submission?.scores ?? {})
  const [feedback, setFeedback] = useState(submission?.feedback ?? "")
  const [savedMessage, setSavedMessage] = useState<string | null>(null)

  if (!submission) {
    return (
      <main className="container-shell min-h-screen py-10">
        <p className="text-sm text-muted-foreground">
          Bu topshiriq topilmadi. Sahifa yangilanganda demo ma'lumotlar tozalanadi — talabgor imtihonni qaytadan
          topshirishi kerak.
        </p>
        <Link href="/admin/speaking/assessments" className="mt-4 inline-block text-sm font-semibold text-primary">
          ← Ro'yxatga qaytish
        </Link>
      </main>
    )
  }

  const setScore = (key: keyof CriteriaScores, value: string) => {
    setScores((prev) => ({ ...prev, [key]: value ? Number(value) : undefined }))
  }

  const persist = (finalize: boolean) => {
    saveAssessment(submission.id, scores, feedback, finalize)
    setSavedMessage(finalize ? "Baholash yakunlandi." : "Qoralama saqlandi.")
  }

  return (
    <main className="container-shell min-h-screen py-10">
      <Link href="/admin/speaking/assessments" className="text-sm text-muted-foreground hover:text-foreground">
        ← Barcha topshiriqlar
      </Link>
      <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-primary">Admin · Speaking baholash</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">{submission.candidateName}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Topshirilgan: {new Date(submission.submittedAt).toLocaleString()} · {submission.responses.length} ta javob
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="surface p-6">
          <p className="font-semibold">Talabgor javoblari</p>
          <div className="mt-4 space-y-4">
            {submission.responses.map((response) => (
              <div key={`${response.part}-${response.questionIndex}`} className="rounded-lg border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-primary">
                      {response.part}-qism · Savol#{response.questionIndex}
                    </p>
                    <p className="mt-1 text-sm">{response.question}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{response.durationSeconds}s</span>
                </div>
                <audio className="mt-3 w-full" controls src={response.audioUrl} />
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {CRITERIA.map(({ key, label }) => (
              <label key={key} className="flex flex-col gap-2 text-sm font-medium">
                {label}
                <select
                  value={scores[key] ?? ""}
                  onChange={(event) => setScore(key, event.target.value)}
                  className="rounded-lg border bg-card px-3 py-3"
                >
                  <option value="">Select score</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          <label className="mt-6 flex flex-col gap-2 text-sm font-medium">
            Feedback
            <textarea
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
              className="min-h-28 rounded-lg border p-3"
              placeholder="Add feedback for the assessment record"
            />
          </label>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => persist(false)} className="rounded-lg border px-4 py-3 text-sm font-semibold">
              Save draft
            </button>
            <button
              onClick={() => persist(true)}
              className="rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              Finalize assessment
            </button>
          </div>
          {savedMessage && <p className="mt-4 text-sm font-medium text-accent">{savedMessage}</p>}
        </section>

        <aside className="surface h-fit p-6">
          <p className="text-sm font-semibold">Assessment guidance</p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Score only the criteria configured for this examination. Finalization should be confirmed before it is
            sent to the result workflow.
          </p>
        </aside>
      </div>
    </main>
  )
}
