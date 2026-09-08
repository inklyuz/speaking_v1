'use client'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, Check, ChevronRight, Download, Filter, Search, X } from 'lucide-react'

type Status = 'Under review' | 'Paid' | 'Draft' | 'Confirmed' | 'Rejected'

type Application = {
  id: string; name: string; email: string; exam: string;
  date: string; centre: string; status: Status; fee: string; submitted: string
}

const allApplications: Application[] = [
  { id: 'ML-2025-4871', name: 'Azizbek Toshmatov', email: 'a.toshmatov@gmail.com', exam: 'Multilevel English Examination', date: '29 Mar 2025', centre: 'Tashkent', status: 'Confirmed', fee: '300 000 UZS', submitted: '10 Jan 2025' },
  { id: 'ML-2025-4870', name: 'Malika Yusupova', email: 'malika.y@outlook.com', exam: 'Multilevel English Examination', date: '29 Mar 2025', centre: 'Tashkent', status: 'Paid', fee: '240 000 UZS', submitted: '9 Jan 2025' },
  { id: 'ML-2025-4869', name: 'Jasur Karimov', email: 'jasur.k@email.uz', exam: 'Multilevel English Examination', date: '12 Apr 2025', centre: 'Samarkand', status: 'Under review', fee: '300 000 UZS', submitted: '8 Jan 2025' },
  { id: 'ML-2025-4868', name: 'Nilufar Rahimova', email: 'n.rahimova@uni.uz', exam: 'Multilevel English Examination', date: '12 Apr 2025', centre: 'Samarkand', status: 'Under review', fee: '300 000 UZS', submitted: '7 Jan 2025' },
  { id: 'ML-2025-4867', name: 'Bobur Mirzaev', email: 'bobur.m@corp.com', exam: 'Multilevel English Examination', date: '26 Apr 2025', centre: 'Tashkent', status: 'Draft', fee: '300 000 UZS', submitted: '6 Jan 2025' },
  { id: 'ML-2025-4866', name: 'Sarvinoz Ergasheva', email: 's.ergasheva@mail.ru', exam: 'Multilevel English Examination', date: '26 Apr 2025', centre: 'Tashkent', status: 'Paid', fee: '300 000 UZS', submitted: '5 Jan 2025' },
  { id: 'ML-2025-4865', name: 'Ulugbek Nazarov', email: 'u.nazarov@biz.uz', exam: 'Multilevel English Examination', date: '17 May 2025', centre: 'Fergana', status: 'Draft', fee: '300 000 UZS', submitted: '4 Jan 2025' },
  { id: 'ML-2025-4864', name: 'Dilnoza Xasanova', email: 'dil.xasanova@gmail.com', exam: 'Multilevel English Examination', date: '17 May 2025', centre: 'Fergana', status: 'Rejected', fee: '300 000 UZS', submitted: '3 Jan 2025' },
]

const statusColors: Record<Status, string> = {
  Confirmed: 'bg-emerald-50 text-emerald-700',
  Paid: 'bg-blue-50 text-blue-700',
  'Under review': 'bg-amber-50 text-amber-700',
  Draft: 'bg-muted text-muted-foreground',
  Rejected: 'bg-red-50 text-red-700',
}

export default function AdminApplications() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All')
  const [selected, setSelected] = useState<Application | null>(null)

  const filtered = allApplications.filter(a => {
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || a.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container-shell flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /></Link>
            <span className="font-semibold">Admin · Applications</span>
          </div>
          <button className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-muted">
            <Download className="size-4" /> Export CSV
          </button>
        </div>
      </header>

      <main className="container-shell py-8">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, ID or email…"
              className="w-full rounded-lg border bg-card py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="flex gap-2">
            {(['All', 'Confirmed', 'Paid', 'Under review', 'Draft', 'Rejected'] as const).map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${statusFilter === s ? 'border-primary bg-secondary text-primary' : 'bg-card hover:bg-muted'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          {filtered.length} application{filtered.length !== 1 ? 's' : ''} found
        </div>

        <div className="surface mt-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5">Application</th>
                  <th className="px-5 py-3.5">Candidate</th>
                  <th className="px-5 py-3.5">Exam date</th>
                  <th className="px-5 py-3.5">Centre</th>
                  <th className="px-5 py-3.5">Fee</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map(app => (
                  <tr key={app.id} className="hover:bg-muted/30 cursor-pointer" onClick={() => setSelected(app)}>
                    <td className="px-5 py-4 font-mono text-xs font-semibold">{app.id}</td>
                    <td className="px-5 py-4">
                      <p className="font-semibold">{app.name}</p>
                      <p className="text-xs text-muted-foreground">{app.email}</p>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{app.date}</td>
                    <td className="px-5 py-4 text-muted-foreground">{app.centre}</td>
                    <td className="px-5 py-4">{app.fee}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[app.status]}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">No applications found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md overflow-y-auto bg-card shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b p-6">
              <div>
                <p className="font-mono text-xs font-semibold text-muted-foreground">{selected.id}</p>
                <h2 className="mt-0.5 text-xl font-bold">{selected.name}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-lg p-2 hover:bg-muted"><X className="size-4" /></button>
            </div>
            <div className="p-6 grid gap-4">
              <span className={`w-fit inline-block rounded-full px-3 py-1 text-sm font-semibold ${statusColors[selected.status]}`}>{selected.status}</span>
              {[
                ['Email', selected.email],
                ['Exam', selected.exam],
                ['Date', selected.date],
                ['Centre', selected.centre],
                ['Fee', selected.fee],
                ['Submitted', selected.submitted],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between border-b pb-4 text-sm">
                  <span className="text-muted-foreground">{l}</span>
                  <span className="font-semibold">{v}</span>
                </div>
              ))}
              <div className="mt-2 grid gap-2">
                {selected.status === 'Under review' && (
                  <>
                    <button className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white">
                      <Check className="size-4" /> Confirm application
                    </button>
                    <button className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50">
                      Reject
                    </button>
                  </>
                )}
                <button className="rounded-lg border px-4 py-2.5 text-sm font-semibold hover:bg-muted">
                  <Download className="mr-2 inline size-4" /> Download admit card
                </button>
                <Link href={`/admin/speaking/assessments/${selected.id}`}
                  className="rounded-lg border px-4 py-2.5 text-center text-sm font-semibold hover:bg-muted">
                  View speaking assessment
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
