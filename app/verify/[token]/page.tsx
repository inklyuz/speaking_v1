import Link from 'next/link'
import { BookOpen, Check, ExternalLink, Headphones, PenLine, ShieldCheck, X } from 'lucide-react'

// In production, this data would come from the backend via params.token
export default function VerifyPage({ params }: { params: { token: string } }) {
  const isValid = params.token !== 'invalid'
  const components = [
    { name: 'Reading', icon: BookOpen, band: 'B2', score: '72%' },
    { name: 'Listening', icon: Headphones, band: 'B1', score: '65%' },
    { name: 'Writing', icon: PenLine, band: 'B2–C1', score: '80%' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container-shell flex h-16 items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight">Multilevel<span className="text-primary">.exam</span></Link>
          <span className="text-sm text-muted-foreground">Result verification</span>
        </div>
      </header>

      <main className="container-shell py-14">
        <div className="mx-auto max-w-xl">
          {isValid ? (
            <>
              <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-800">Result verified</p>
                  <p className="text-sm text-emerald-700">This result was published by the Multilevel examination service and has not been altered.</p>
                </div>
              </div>

              <div className="surface mt-6 p-6">
                <p className="text-xs text-muted-foreground">Verification token: <span className="font-mono">{params.token}</span></p>
                <h1 className="mt-3 text-2xl font-bold">Azizbek Toshmatov</h1>
                <p className="text-muted-foreground">Multilevel English Examination · 29 March 2025</p>
                <div className="mt-6 grid gap-3">
                  {components.map(c => (
                    <div key={c.name} className="flex items-center gap-3 rounded-xl border p-4">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
                        <c.icon className="size-4" />
                      </div>
                      <div className="flex-1 text-sm font-medium">{c.name}</div>
                      <div className="text-right">
                        <span className="font-bold text-primary">{c.band}</span>
                        <span className="ml-2 text-xs text-muted-foreground">{c.score}</span>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between rounded-xl border bg-muted/40 px-4 py-3 text-sm">
                    <span className="text-muted-foreground">Speaking</span>
                    <span className="font-medium text-amber-600">Pending publication</span>
                  </div>
                </div>
                <p className="mt-6 text-xs text-muted-foreground">
                  Published by the Multilevel examination service. This page is generated from the backend verification endpoint.
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-5">
              <div className="flex size-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                <X className="size-5" />
              </div>
              <div>
                <p className="font-semibold text-red-800">Result not found</p>
                <p className="text-sm text-red-700">No published result matches this verification token. The document may have been altered or the token is incorrect.</p>
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <Link href="/result" className="text-sm font-semibold text-primary hover:underline">Verify another result</Link>
            <span className="text-muted-foreground">·</span>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">Return to home</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
