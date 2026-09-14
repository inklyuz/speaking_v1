"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { getAssessment, saveAssessment, type SpeakingAssessment } from '@/lib/api/speaking'

const CRITERIA: { key: keyof SpeakingAssessment; label: string }[] = [
  { key: 'fluency', label: 'Fluency / Coherence' },
  { key: 'vocabulary', label: 'Lexical Resource' },
  { key: 'grammar', label: 'Grammar' },
  { key: 'pronunciation', label: 'Pronunciation' },
  { key: 'interaction', label: 'Interaction' },
]

export default function Page() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [scores, setScores] = useState<SpeakingAssessment>({})
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    getAssessment(params.id).then((value) => { setData(value); setScores(value.scores ?? {}); setFeedback(value.feedback ?? '') }).catch((e) => setError(e instanceof Error ? e.message : 'Baholash topilmadi.')).finally(() => setLoading(false))
  }, [params.id])

  async function persist(finalize: boolean) {
    const missing = CRITERIA.some(({ key }) => typeof scores[key] !== 'number')
    if (finalize && missing) return setError('Finalizatsiya qilishdan oldin barcha baholarni kiriting.')
    setSaving(true); setError(''); setMessage('')
    try { await saveAssessment(params.id, { ...scores, feedback }, finalize); setMessage(finalize ? 'Baholash yakunlandi.' : 'Qoralama saqlandi.'); if (finalize) setTimeout(() => router.push('/admin/speaking/assessments'), 700) } catch (e) { setError(e instanceof Error ? e.message : 'Bahoni saqlab bo‘lmadi.') } finally { setSaving(false) }
  }

  if (loading) return <main className="container-shell min-h-screen py-10"><div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Yuklanmoqda…</div></main>
  if (error && !data) return <main className="container-shell min-h-screen py-10"><p className="text-sm text-red-600">{error}</p><Link href="/admin/speaking/assessments" className="mt-4 inline-block text-sm font-semibold text-primary">← Ro‘yxat</Link></main>

  return <main className="container-shell min-h-screen py-10">
    <Link href="/admin/speaking/assessments" className="text-sm text-muted-foreground">← Barcha speakinglar</Link>
    <div className="mt-5"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Speaking assessment</p><h1 className="mt-2 text-3xl font-bold">{data?.candidate_name ?? 'Talabgor'}</h1><p className="mt-1 font-mono text-xs text-muted-foreground">{data?.student_id ?? '—'}</p></div>
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="rounded-2xl border bg-background p-6"><h2 className="font-bold">Audio javoblar</h2><div className="mt-5 space-y-4">{(data?.responses ?? []).map((response: any, index: number) => <article key={response.id ?? index} className="rounded-xl border p-4"><div className="flex justify-between gap-3"><div><p className="text-xs font-semibold text-primary">Part {response.part} · Savol {response.question_index}</p><p className="mt-1 text-sm leading-6">{response.question}</p></div><span className="text-xs text-muted-foreground">{response.duration_seconds ?? 0}s</span></div>{response.audio_url && <audio className="mt-3 w-full" controls preload="metadata" src={response.audio_url} />}</article>)}</div></section>
      <aside className="h-fit rounded-2xl border bg-background p-6"><h2 className="font-bold">Baholash</h2><div className="mt-5 space-y-4">{CRITERIA.map(({ key, label }) => <label key={key} className="block text-sm font-semibold">{label}<select value={scores[key] ?? ''} onChange={(e) => setScores((v) => ({ ...v, [key]: e.target.value ? Number(e.target.value) : undefined }))} className="mt-2 h-11 w-full rounded-xl border bg-card px-3"><option value="">Tanlang</option>{[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}</option>)}</select></label>)}</div><label className="mt-5 block text-sm font-semibold">Feedback<textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} className="mt-2 min-h-28 w-full rounded-xl border p-3 text-sm font-normal" placeholder="Examiner izohi" /></label>{error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-700">{error}</p>}{message && <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700">{message}</p>}<div className="mt-5 grid gap-2"><button disabled={saving} onClick={() => persist(false)} className="h-11 rounded-xl border text-sm font-bold disabled:opacity-50">Qoralama saqlash</button><button disabled={saving} onClick={() => persist(true)} className="h-11 rounded-xl bg-primary text-sm font-bold text-primary-foreground disabled:opacity-50">{saving ? 'Saqlanmoqda…' : 'Baholashni yakunlash'}</button></div></aside>
    </div>
  </main>
}
