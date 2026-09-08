'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Check, Clock3, CreditCard, FileText, LockKeyhole, Tag, AlertCircle, User, Mail, Phone, MapPin } from 'lucide-react'

const steps = ['Personal', 'Contact', 'Additional', 'Review', 'Billing', 'Confirmation']

type PersonalData = {
  firstName: string; lastName: string; middleName: string;
  dob: string; gender: string; nationality: string; passportNumber: string
}
type ContactData = { email: string; phone: string; city: string; address: string }
type AdditionalData = { examDate: string; studyCenter: string; englishLevel: string; heardFrom: string }

function validate<T extends Record<string, string>>(data: T, required: (keyof T)[]): Partial<Record<keyof T, string>> {
  const errors: Partial<Record<keyof T, string>> = {}
  for (const key of required) {
    if (!data[key]?.trim()) errors[key] = 'This field is required'
  }
  return errors
}

export default function ApplicationFlow({ view = 'apply' }: { view?: 'apply' | 'billing' | 'check' | 'success' }) {
  const [personal, setPersonal] = useState<PersonalData>({ firstName: '', lastName: '', middleName: '', dob: '', gender: '', nationality: '', passportNumber: '' })
  const [contact, setContact] = useState<ContactData>({ email: '', phone: '', city: '', address: '' })
  const [additional, setAdditional] = useState<AdditionalData>({ examDate: '', studyCenter: '', englishLevel: '', heardFrom: '' })
  const [promo, setPromo] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoLoading, setPromoLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const active = view === 'billing' ? 4 : view === 'check' ? 3 : 0

  const applyPromo = () => {
    setPromoLoading(true)
    window.setTimeout(() => {
      setPromoApplied(promo.trim().toUpperCase() === 'FIRST20')
      setPromoLoading(false)
    }, 600)
  }

  if (view === 'success') return <Success personal={personal} promoApplied={promoApplied} />

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container-shell flex h-16 items-center justify-between">
          <Link href="/" className="font-semibold">Multilevel<span className="text-primary">.exam</span></Link>
          <span className="flex items-center gap-2 text-sm text-muted-foreground"><LockKeyhole className="size-4" /> Secure application</span>
        </div>
      </header>
      <main className="container-shell py-10 sm:py-14">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Application · Multilevel English Examination</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">
            {view === 'billing' ? 'Review your examination fee.' : view === 'check' ? 'Check your application.' : 'Begin your application.'}
          </h1>
          <div className="mt-8 flex overflow-x-auto pb-3">
            {steps.map((step, i) => (
              <div key={step} className="flex min-w-max items-center">
                <div className={`flex size-8 items-center justify-center rounded-full text-xs font-bold ${i <= active ? 'bg-primary text-primary-foreground' : 'border bg-card text-muted-foreground'}`}>
                  {i < active ? <Check className="size-4" /> : i + 1}
                </div>
                <span className={`ml-2 text-xs font-medium ${i === active ? 'text-foreground' : 'text-muted-foreground'}`}>{step}</span>
                {i < steps.length - 1 && <div className={`mx-3 h-px w-8 ${i < active ? 'bg-primary' : 'bg-border'}`} />}
              </div>
            ))}
          </div>
          {view === 'billing' ? (
            <Billing promo={promo} setPromo={setPromo} applied={promoApplied} loading={promoLoading} applyPromo={applyPromo} />
          ) : view === 'check' ? (
            <CheckView personal={personal} contact={contact} additional={additional} confirmed={confirmed} setConfirmed={setConfirmed} promoApplied={promoApplied} />
          ) : (
            <PersonalForm personal={personal} setPersonal={setPersonal} contact={contact} setContact={setContact} additional={additional} setAdditional={setAdditional} />
          )}
        </div>
      </main>
    </div>
  )
}

function PersonalForm({ personal, setPersonal, contact, setContact, additional, setAdditional }:
  { personal: PersonalData; setPersonal: (v: PersonalData) => void; contact: ContactData; setContact: (v: ContactData) => void; additional: AdditionalData; setAdditional: (v: AdditionalData) => void }) {
  const [step, setStep] = useState<'personal' | 'contact' | 'additional'>('personal')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const goNext = () => {
    if (step === 'personal') {
      const errs = validate(personal, ['firstName', 'lastName', 'dob', 'gender', 'nationality', 'passportNumber'])
      if (Object.keys(errs).length) { setErrors(errs); return }
      setErrors({}); setStep('contact')
    } else if (step === 'contact') {
      const errs = validate(contact, ['email', 'phone', 'city'])
      if (contact.email && !/\S+@\S+\.\S+/.test(contact.email)) errs.email = 'Enter a valid email address'
      if (Object.keys(errs).length) { setErrors(errs); return }
      setErrors({}); setStep('additional')
    }
  }

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_300px]">
      <section className="surface p-6 sm:p-8">
        {step === 'personal' && <>
          <div className="flex items-center gap-3 border-b pb-5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-secondary"><User className="size-4 text-primary" /></div>
            <div><h2 className="font-semibold">Personal information</h2><p className="text-sm text-muted-foreground">Exactly as on your ID document</p></div>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="First name *" placeholder="Enter first name" value={personal.firstName} onChange={v => setPersonal({ ...personal, firstName: v })} error={errors.firstName} />
            <Field label="Last name *" placeholder="Enter last name" value={personal.lastName} onChange={v => setPersonal({ ...personal, lastName: v })} error={errors.lastName} />
            <Field label="Middle name" placeholder="Optional" value={personal.middleName} onChange={v => setPersonal({ ...personal, middleName: v })} />
            <Field label="Date of birth *" placeholder="DD / MM / YYYY" type="date" value={personal.dob} onChange={v => setPersonal({ ...personal, dob: v })} error={errors.dob} />
            <SelectField label="Gender *" value={personal.gender} onChange={v => setPersonal({ ...personal, gender: v })} error={errors.gender} options={['Male', 'Female', 'Other']} />
            <Field label="Nationality *" placeholder="e.g. Uzbek" value={personal.nationality} onChange={v => setPersonal({ ...personal, nationality: v })} error={errors.nationality} />
            <Field label="Passport / ID number *" placeholder="e.g. AA1234567" value={personal.passportNumber} onChange={v => setPersonal({ ...personal, passportNumber: v })} error={errors.passportNumber} />
          </div>
          <button onClick={goNext} className="mt-8 inline-flex items-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
            Continue to contact <ArrowRight className="ml-2 size-4" />
          </button>
        </>}
        {step === 'contact' && <>
          <div className="flex items-center gap-3 border-b pb-5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-secondary"><Mail className="size-4 text-primary" /></div>
            <div><h2 className="font-semibold">Contact details</h2><p className="text-sm text-muted-foreground">We'll use this to reach you</p></div>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="Email address *" placeholder="your@email.com" type="email" value={contact.email} onChange={v => setContact({ ...contact, email: v })} error={errors.email} />
            <Field label="Phone number *" placeholder="+998 90 000 0000" type="tel" value={contact.phone} onChange={v => setContact({ ...contact, phone: v })} error={errors.phone} />
            <Field label="City *" placeholder="e.g. Tashkent" value={contact.city} onChange={v => setContact({ ...contact, city: v })} error={errors.city} />
            <Field label="Address" placeholder="Street, district" value={contact.address} onChange={v => setContact({ ...contact, address: v })} />
          </div>
          <div className="mt-8 flex gap-3">
            <button onClick={() => setStep('personal')} className="rounded-lg border px-5 py-3 text-sm font-semibold hover:bg-muted">Back</button>
            <button onClick={goNext} className="inline-flex items-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
              Continue <ArrowRight className="ml-2 size-4" />
            </button>
          </div>
        </>}
        {step === 'additional' && <>
          <div className="flex items-center gap-3 border-b pb-5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-secondary"><FileText className="size-4 text-primary" /></div>
            <div><h2 className="font-semibold">Exam preferences</h2><p className="text-sm text-muted-foreground">Help us prepare your session</p></div>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <SelectField label="Exam date" value={additional.examDate} onChange={v => setAdditional({ ...additional, examDate: v })} options={['15 March 2025', '29 March 2025', '12 April 2025', '26 April 2025']} />
            <SelectField label="Study centre" value={additional.studyCenter} onChange={v => setAdditional({ ...additional, studyCenter: v })} options={['Tashkent Centre', 'Samarkand Centre', 'Namangan Centre', 'Fergana Centre']} />
            <SelectField label="Your current English level" value={additional.englishLevel} onChange={v => setAdditional({ ...additional, englishLevel: v })} options={['A1 – Beginner', 'A2 – Elementary', 'B1 – Intermediate', 'B2 – Upper Intermediate', 'C1 – Advanced']} />
            <SelectField label="How did you hear about us?" value={additional.heardFrom} onChange={v => setAdditional({ ...additional, heardFrom: v })} options={['Social media', 'Friend or colleague', 'Employer / university', 'Website search', 'Other']} />
          </div>
          <div className="mt-8 flex gap-3">
            <button onClick={() => setStep('contact')} className="rounded-lg border px-5 py-3 text-sm font-semibold hover:bg-muted">Back</button>
            <Link href="/apply/multilevel-2026/billing" className="inline-flex items-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
              Continue to billing <ArrowRight className="ml-2 size-4" />
            </Link>
          </div>
        </>}
      </section>
      <Aside />
    </div>
  )
}

function Billing({ promo, setPromo, applied, loading, applyPromo }: { promo: string; setPromo: (v: string) => void; applied: boolean; loading: boolean; applyPromo: () => void }) {
  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
      <section className="surface p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex size-11 items-center justify-center rounded-lg bg-secondary text-primary"><Tag className="size-5" /></div>
          <div><h2 className="text-xl font-semibold">Promo code</h2><p className="mt-1 text-sm text-muted-foreground">Have a code? Apply it before continuing to payment.</p></div>
        </div>
        <div className="mt-6 flex gap-2">
          <input aria-label="Promo code" value={promo} onChange={e => setPromo(e.target.value)}
            placeholder="e.g. FIRST20" className="min-w-0 flex-1 rounded-lg border bg-card px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
          <button onClick={applyPromo} disabled={loading || !promo}
            className="rounded-lg border px-4 py-3 text-sm font-semibold disabled:opacity-50 hover:bg-muted">
            {loading ? 'Checking…' : 'Apply'}
          </button>
        </div>
        {applied && <p className="mt-4 flex items-center gap-2 text-sm font-medium text-accent"><Check className="size-4" /> Promo applied — 20% off (−60 000 UZS)</p>}
        {promo && !applied && !loading && <p className="mt-4 flex items-center gap-2 text-sm text-red-500"><AlertCircle className="size-4" /> Code not found or expired.</p>}
        <div className="mt-8 rounded-xl border bg-muted/40 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payment methods accepted</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Uzcard', 'Humo', 'Visa', 'Mastercard', 'Click', 'Payme'].map(m => (
              <span key={m} className="rounded-md border bg-card px-3 py-1.5 text-xs font-semibold">{m}</span>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Payment is processed securely. Your card details are never stored by this platform.</p>
        </div>
      </section>
      <aside className="surface h-fit p-6">
        <h2 className="font-semibold">Examination fee</h2>
        <div className="mt-6 flex flex-col gap-3 text-sm">
          <div className="flex justify-between text-muted-foreground"><span>Multilevel English Examination</span><span>300 000 UZS</span></div>
          <div className="flex justify-between text-muted-foreground"><span>Discount</span><span className={applied ? 'text-accent font-semibold' : ''}>{applied ? '−60 000 UZS' : '—'}</span></div>
          <div className="my-2 border-t" />
          <div className="flex justify-between text-base font-bold"><span>Total</span><span>{applied ? '240 000 UZS' : '300 000 UZS'}</span></div>
        </div>
        <Link href="/apply/multilevel-2026/check" className="mt-7 block rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          Continue to review <ArrowRight className="ml-2 inline size-4" />
        </Link>
        <p className="mt-4 text-center text-xs text-muted-foreground">Final amounts confirmed by the examination service.</p>
      </aside>
    </div>
  )
}

function CheckView({ personal, contact, additional, confirmed, setConfirmed, promoApplied }:
  { personal: PersonalData; contact: ContactData; additional: AdditionalData; confirmed: boolean; setConfirmed: (v: boolean) => void; promoApplied: boolean }) {
  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_300px]">
      <section className="surface divide-y p-6 sm:p-8">
        <ReviewSection title="Personal information" icon={<User className="size-4" />} rows={[
          { label: 'Full name', value: [personal.firstName, personal.middleName, personal.lastName].filter(Boolean).join(' ') || '—' },
          { label: 'Date of birth', value: personal.dob || '—' },
          { label: 'Gender', value: personal.gender || '—' },
          { label: 'Nationality', value: personal.nationality || '—' },
          { label: 'Passport / ID', value: personal.passportNumber || '—' },
        ]} />
        <ReviewSection title="Contact" icon={<Mail className="size-4" />} rows={[
          { label: 'Email', value: contact.email || '—' },
          { label: 'Phone', value: contact.phone || '—' },
          { label: 'City', value: contact.city || '—' },
        ]} />
        <ReviewSection title="Exam details" icon={<FileText className="size-4" />} rows={[
          { label: 'Exam date', value: additional.examDate || '—' },
          { label: 'Study centre', value: additional.studyCenter || '—' },
          { label: 'Current level', value: additional.englishLevel || '—' },
          { label: 'Fee', value: promoApplied ? '240 000 UZS (20% discount)' : '300 000 UZS' },
        ]} />
        <label className="mt-6 flex items-start gap-3 pt-6 text-sm">
          <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} className="mt-0.5 size-4 accent-primary" />
          I confirm that the information above is accurate and matches my identification document.
        </label>
        <div className="pt-5">
          <Link aria-disabled={!confirmed} href={confirmed ? '/apply/multilevel-2026/success' : '#'}
            className={`inline-flex items-center rounded-lg px-5 py-3 text-sm font-semibold ${confirmed ? 'bg-primary text-primary-foreground' : 'pointer-events-none bg-muted text-muted-foreground'}`}>
            Confirm application <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>
      </section>
      <Aside />
    </div>
  )
}

function Success({ personal, promoApplied }: { personal: PersonalData; promoApplied: boolean }) {
  const appNo = `ML-2025-${String(Math.floor(1000 + Math.random() * 9000))}`
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container-shell flex h-16 items-center justify-between">
          <Link href="/" className="font-semibold">Multilevel<span className="text-primary">.exam</span></Link>
        </div>
      </header>
      <main className="container-shell flex min-h-[calc(100vh-64px)] items-center justify-center py-12">
        <div className="surface w-full max-w-xl p-8 text-center sm:p-12">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
            <Check className="size-8" />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-emerald-600">Application submitted</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">You are ready for the next step.</h1>
          <p className="mt-4 leading-7 text-muted-foreground">
            Your application has been received. A confirmation will be sent to your email once the examination service processes your registration.
          </p>
          <div className="mt-8 grid gap-3 text-left sm:grid-cols-2">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-xs text-muted-foreground">Application number</p>
              <p className="mt-1 font-mono font-semibold">{appNo}</p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="mt-1 font-semibold">{[personal.firstName, personal.lastName].filter(Boolean).join(' ') || 'Candidate'}</p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-xs text-muted-foreground">Exam fee paid</p>
              <p className="mt-1 font-semibold">{promoApplied ? '240 000 UZS' : '300 000 UZS'}</p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="mt-1 font-semibold text-amber-600">Under review</p>
            </div>
          </div>
          <Link href="/dashboard" className="mt-8 inline-flex items-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
            Go to dashboard <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>
      </main>
    </div>
  )
}

function ReviewSection({ title, icon, rows }: { title: string; icon: React.ReactNode; rows: { label: string; value: string }[] }) {
  return (
    <div className="py-5 first:pt-0">
      <div className="flex items-center gap-2 font-semibold text-sm">{icon}{title}</div>
      <div className="mt-3 grid gap-2">
        {rows.map(r => (
          <div key={r.label} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{r.label}</span>
            <span className="font-medium text-right">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Aside() {
  return (
    <aside className="surface h-fit p-6">
      <FileText className="size-5 text-primary" />
      <h2 className="mt-4 font-semibold">Multilevel English Examination</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">Complete each step carefully. Your information is processed securely by the examination service.</p>
      <div className="mt-5 grid gap-2 text-sm">
        {[['Reading', 'Paper-based'], ['Listening', 'Paper-based'], ['Writing', 'Paper-based'], ['Speaking', 'Computer-based']].map(([s, t]) => (
          <div key={s} className="flex justify-between"><span className="font-medium">{s}</span><span className="text-muted-foreground">{t}</span></div>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-2 rounded-lg bg-muted px-3 py-2.5 text-xs text-muted-foreground">
        <Clock3 className="size-4 shrink-0" /> Approximately 10 minutes to complete
      </div>
    </aside>
  )
}

function Field({ label, placeholder, type = 'text', value, onChange, error }:
  { label: string; placeholder: string; type?: string; value: string; onChange: (v: string) => void; error?: string }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium">
      {label}
      <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
        className={`rounded-lg border bg-card px-3 py-3 font-normal outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring ${error ? 'border-red-400' : ''}`} />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  )
}

function SelectField({ label, value, onChange, options, error }:
  { label: string; value: string; onChange: (v: string) => void; options: string[]; error?: string }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium">
      {label}
      <select value={value} onChange={e => onChange(e.target.value)}
        className={`rounded-lg border bg-card px-3 py-3 font-normal outline-none focus:ring-2 focus:ring-ring ${error ? 'border-red-400' : ''}`}>
        <option value="">Select…</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  )
}
