"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Loader2, Mic2 } from 'lucide-react'
import { listAssessments } from '@/lib/api/speaking'

type Assessment = {
  id: string
  candidate_name?: string
  student_id?: string
  submitted_at?: string
  status?: string
  responses_count?: number
}

export default function Page() {
  const [items, setItems] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    listAssessments().then(setItems).catch((e) => setError(e instanceof Error ? e.message : 'Baholashlar yuklanmadi.')).finally(() => setLoading(false))
  }, [])

  return <main className="container-shell min-h-screen py-10">
    <div className="flex items-end justify-between gap-4">
      <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Admin · Speaking</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Speaking baholashlari</h1><p className="mt-2 text-sm text-muted-foreground">Yakunlangan speaking sessiyalarini tinglang va baholang.</p></div>
      <Mic2 className="size-8 text-primary" />
    </div>
    {loading && <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Yuklanmoqda…</div>}
    {error && <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    {!loading && !error && <div className="mt-8 overflow-hidden rounded-2xl border bg-background">
      {items.length === 0 ? <div className="p-10 text-center text-sm text-muted-foreground">Hozircha baholash uchun speaking sessiyasi yo‘q.</div> : <table className="w-full text-left text-sm"><thead className="bg-muted/50 text-xs uppercase text-muted-foreground"><tr><th className="px-5 py-3">Talabgor</th><th className="px-5 py-3">Student ID</th><th className="px-5 py-3">Javoblar</th><th className="px-5 py-3">Holat</th><th className="px-5 py-3" /></tr></thead><tbody>{items.map((item) => <tr key={item.id} className="border-t"><td className="px-5 py-4 font-semibold">{item.candidate_name ?? '—'}</td><td className="px-5 py-4 font-mono text-xs text-muted-foreground">{item.student_id ?? '—'}</td><td className="px-5 py-4 text-muted-foreground">{item.responses_count ?? '—'}</td><td className="px-5 py-4"><span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">{item.status ?? 'pending'}</span></td><td className="px-5 py-4 text-right"><Link href={`/admin/speaking/assessments/${item.id}`} className="font-semibold text-primary">Tekshirish →</Link></td></tr>)}</tbody></table>}
    </div>}
  </main>
}
