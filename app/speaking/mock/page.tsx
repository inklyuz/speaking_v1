'use client'

import { FormEvent, useState } from 'react'
import { AlertCircle, ArrowRight, Loader2, Mic2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getMockSpeakingAccess } from '@/lib/api/speaking'
import { saveSpeakingAccess } from '@/lib/speaking-session'

export default function MockSpeakingEntryPage() {
  const router = useRouter()
  const [studentId, setStudentId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!studentId.trim()) return setError('Student ID kiriting.')
    setLoading(true); setError('')
    try {
      const access = await getMockSpeakingAccess(studentId)
      saveSpeakingAccess({ mode: 'mock', studentId: access.candidate.student_id, candidateName: access.candidate.full_name, attemptId: access.attempt_id, skillAttemptId: access.skill_attempt_id, testId: access.speaking_test.id })
      router.push(`/speaking/mock/${encodeURIComponent(access.candidate.student_id)}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Student ID tekshirilmadi.')
    } finally { setLoading(false) }
  }

  return <main className="min-h-screen bg-muted/30"><div className="mx-auto flex min-h-screen max-w-md items-center px-5 py-10"><section className="w-full rounded-2xl border bg-background p-7 shadow-sm"><div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Mic2 className="size-6" /></div><p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-primary">Mock Speaking</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Student ID bilan kirish</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Mock imtihonda admin tomonidan check-in qilingan talabgorning ID raqami orqali unga biriktirilgan Speaking testi ochiladi.</p><form onSubmit={submit} className="mt-8 space-y-4"><label className="block text-sm font-semibold">Student ID<input value={studentId} onChange={(e) => setStudentId(e.target.value.toUpperCase())} placeholder="MC-DDMMYY5XX" autoComplete="off" className="mt-2 h-12 w-full rounded-xl border bg-card px-4 font-mono text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" /></label>{error && <div className="flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="mt-0.5 size-4 shrink-0" />{error}</div>}<button disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground disabled:opacity-60">{loading ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}{loading ? 'Tekshirilmoqda…' : 'Speakingga kirish'}</button></form></section></div></main>
}
