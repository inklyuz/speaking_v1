import { Inter } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Multilevel English Examination',
  description: 'A secure, clear platform for your Multilevel English Examination journey.',
}

export const viewport: Viewport = { colorScheme: 'light', themeColor: '#0F172A' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="bg-background"><body className={inter.variable}>{children}</body></html>
}
