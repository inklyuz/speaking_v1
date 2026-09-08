"use client"

import Link from "next/link"
import { listSubmissions } from "@/lib/speaking-store"

export default function Page() {
  const submissions = listSubmissions()

  return (
    <main className="container-shell min-h-screen py-10">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">Admin · Speaking</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Talabgorlar javoblari</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Talabgor imtihonni yakunlagach, uning ovozli javoblari shu ro'yxatda paydo bo'ladi.
      </p>

      {submissions.length === 0 ? (
        <div className="surface mt-8 p-10 text-center text-sm text-muted-foreground">
          Hozircha yakunlangan speaking topshiriqlari yo'q. Talabgor{" "}
          <Link href="/speaking" className="font-semibold text-primary">
            /speaking
          </Link>{" "}
          orqali imtihonni topshirgach, bu yerda ko'rinadi.
        </div>
      ) : (
        <div className="surface mt-8 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Talabgor</th>
                <th className="px-5 py-3">Topshirilgan vaqt</th>
                <th className="px-5 py-3">Javoblar soni</th>
                <th className="px-5 py-3">Holati</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.id} className="border-t">
                  <td className="px-5 py-3 font-medium">{submission.candidateName}</td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {new Date(submission.submittedAt).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{submission.responses.length}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        submission.status === "graded" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {submission.status === "graded" ? "Baholandi" : "Kutilmoqda"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link href={`/admin/speaking/assessments/${submission.id}`} className="text-sm font-semibold text-primary">
                      Tekshirish →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
