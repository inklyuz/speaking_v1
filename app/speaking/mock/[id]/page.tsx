'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, Loader2, Mic2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { getMockSpeakingAccess } from '@/lib/api/speaking'
import { saveSpeakingAccess } from '@/lib/speaking-session'

export default function MockSpeakingAccessPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [error, setError] = useState('')

  useEffect(() => {
    const studentId = decodeURIComponent(params.id || '').trim().toUpperCase()
    if (!studentId) {
      router.replace('/speaking/mock')
      return
    }

    let cancelled = false

    async function verify() {
      try {
        const access = await getMockSpeakingAccess(studentId)
        if (cancelled) return

        saveSpeakingAccess({
          mode: 'mock',
          studentId: access.candidate.student_id,
          candidateName: access.candidate.full_name,
          attemptId: access.attempt_id,
          skillAttemptId: access.skill_attempt_id,
          testId: access.speaking_test.id,
        })

        router.replace('/speaking/pre-check?mode=mock')
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Student ID tekshirilmadi.')
        }
      }
    }

    void verify()
    return () => { cancelled = true }
  }, [params.id, router])

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-5 py-10">
        <section className="w-full rounded-2xl border bg-background p-7 shadow-sm">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {error ? <AlertCircle className="size-6" /> : <Mic2 className="size-6" />}
          </div>
          <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-primary">Mock Speaking</p>
          {error ? (
            <>
              <h1 className="mt-2 text-2xl font-bold tracking-tight">Kirish amalga oshmadi</h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{error}</p>
              <button onClick={() => router.replace('/speaking/mock')} className="mt-6 h-11 w-full rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground">
                Student ID ni qayta kiritish
              </button>
            </>
          ) : (
            <>
              <h1 className="mt-2 text-2xl font-bold tracking-tight">Speaking tayyorlanmoqda…</h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">Student ID va Mock imtihon ma’lumotlari tekshirilmoqda.</p>
              <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Testga kirish tekshirilmoqda
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  )
}
