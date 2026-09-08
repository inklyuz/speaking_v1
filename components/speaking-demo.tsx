"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import {
  ArrowLeft,
  Check,
  Headphones,
  Image as ImageIcon,
  Mic2,
  Square,
  Volume2,
  X,
} from "lucide-react"
import { createSubmission, type SpeakingResponse } from "@/lib/speaking-store"
import { resolveSteps, type Step, type Item, type VisualKey } from "@/lib/speaking-questions"
import JSZip from "jszip"

/* ------------------------------------------------------------------ */
/* Landing                                                             */
/* ------------------------------------------------------------------ */

export function SpeakingLanding() {
  return (
    <main className="min-h-screen bg-muted/40">
      <header className="border-b bg-card">
        <div className="container-shell flex items-center justify-between py-3">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-5" />
          </Link>
          <span className="text-lg">🇺🇿</span>
        </div>
      </header>
      <div className="container-shell py-16">
        <div className="relative mx-auto max-w-md overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="absolute right-[-38px] top-[18px] w-[150px] rotate-45 bg-emerald-500 py-1 text-center text-[11px] font-bold tracking-wide text-white">
            YANGI
          </div>
          <div className="flex items-start justify-between gap-6 p-6">
            <div>
              <h1 className="text-xl font-bold">Gapirish</h1>
              <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                <li>1 - qism</li>
                <li>2 - qism</li>
                <li>3 - qism</li>
              </ul>
            </div>
            <div className="flex size-28 shrink-0 items-center justify-center rounded-full bg-muted">
              <Mic2 className="size-12 text-red-500" strokeWidth={1.5} />
            </div>
          </div>
          <Link
            href="/speaking/pre-check"
            className="flex items-center justify-center gap-2 bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Headphones className="size-4" /> Kirish
          </Link>
        </div>
      </div>
    </main>
  )
}

/* ------------------------------------------------------------------ */
/* Pre-check                                                           */
/* ------------------------------------------------------------------ */

const RULES = [
  "brauzerdan chiqish;",
  "boshqa dasturlarni ochish;",
  "texnik jihozlarga teginish;",
  "aloqa vositalaridan foydalanish;",
  "lug'at yoki shpargalka ishlatish;",
  "yon-atrofga o'girilish;",
  "boshqa nomzodlar bilan gaplashish;",
  "yordam so'rash va yordam berish taqiqlanadi.",
]

const NOTES = [
  "Ushbu qoidalarni buzgan talabgorlar imtihondan chetlatiladi va test natijalari bekor qilinadi.",
  "Imtihonni boshlashdan oldin quloqchin va mikrofon ishlayotganligiga ishonch hosil qiling.",
  "Gapirish bo'limi 3 ta qismdan iborat.",
  "Ushbu bo'limda oldingi savolga yoki oldingi qismga qaytishning imkoni yo'q.",
  "Mikrofon avtomatik ravishda yoqiladi va o'chiriladi.",
  "Savol uchun ajratilgan vaqt tugagach, keyingi savol avtomatik tarzda ochiladi.",
  "Imtihonni yakunlash tugmasini bosishdan avval barcha savollarga javob berganligingizga ishonch hosil qiling.",
]

const MIC_TEST_TEXT =
  "Salom! Bu mikrofon sinovi uchun matn. Men bu jumlani ovoz chiqarib o'qiyapman va uni tinglab, ovozim aniq eshitilishiga ishonch hosil qilaman."

export function SpeakingPreCheck() {
  const [stage, setStage] = useState<"idle" | "recording" | "review">("idle")
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  const startTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      chunksRef.current = []
      const media = new MediaRecorder(stream)
      media.ondataavailable = (event) => chunksRef.current.push(event.data)
      media.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach((track) => track.stop())
        setStage("review")
      }
      recorderRef.current = media
      media.start()
      setStage("recording")
    } catch {
      setStage("idle")
    }
  }

  const stopTest = () => {
    recorderRef.current?.stop()
  }

  const retry = () => {
    setAudioUrl(null)
    setConfirmed(false)
    setStage("idle")
  }

  return (
    <main className="min-h-screen bg-card">
      <header className="border-b">
        <div className="container-shell flex items-center justify-between py-3">
          <Link href="/speaking" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-5" />
          </Link>
          <span className="text-sm text-muted-foreground">English</span>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-5 py-10">
        <h1 className="font-semibold">Gapirish</h1>
        <p className="mt-3 font-medium">Imtihon davomida:</p>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-sm">
          {RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
        <div className="mt-4 space-y-3 text-sm leading-6">
          {NOTES.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>

        {stage !== "review" ? (
          <div className="mt-8 rounded-md border bg-muted/40 p-5">
            <p className="text-sm font-semibold">Quyidagi matnni ovoz chiqarib o'qing:</p>
            <p className="mt-3 rounded-md bg-card p-4 text-sm leading-6">{MIC_TEST_TEXT}</p>
            {stage === "idle" && (
              <button
                onClick={startTest}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-teal-500 py-3 text-sm font-semibold text-white hover:bg-teal-600"
              >
                <Mic2 className="size-4" /> Mikrofonni tekshirish — o'qishni boshlash
              </button>
            )}
            {stage === "recording" && (
              <button
                onClick={stopTest}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-red-500 py-3 text-sm font-semibold text-white hover:bg-red-600"
              >
                <span className="size-2.5 animate-pulse rounded-full bg-white" /> Yozib olinmoqda — tugatish uchun bosing
              </button>
            )}
          </div>
        ) : (
          <div className="mt-8 rounded-md border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-sm font-semibold">Ovozingizni tinglang</p>
            <p className="mt-1 text-sm text-muted-foreground">
              O'zingiz o'qigan matnni tinglab, ovoz aniq va tovushsiz eshitilayotganiga ishonch hosil qiling.
            </p>
            {audioUrl && <audio className="mt-3 w-full" controls src={audioUrl} />}
            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={retry} className="rounded-md border px-4 py-2.5 text-sm font-semibold">
                Qayta yozish
              </button>
            </div>
            <label className="mt-4 flex items-center gap-3 rounded-md border border-emerald-200 bg-card px-4 py-3 text-sm font-medium">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(event) => setConfirmed(event.target.checked)}
                className="size-4"
              />
              Ovozimni tingladim, mikrofon va quloqchin soz holatda ekanligini tasdiqlayman
            </label>
            <Link
              href={confirmed ? "/speaking/exam" : "#"}
              aria-disabled={!confirmed}
              className={`mt-3 flex w-full items-center justify-center gap-2 rounded-md py-3 text-sm font-semibold text-white ${confirmed ? "bg-teal-600 hover:bg-teal-700" : "pointer-events-none bg-teal-600/40"}`}
            >
              <Headphones className="size-4" /> Imtihonni boshlash
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}

/* ------------------------------------------------------------------ */
/* Exam                                                                 */
/* ------------------------------------------------------------------ */

// Types and resolveSteps are imported from @/lib/speaking-questions

const CHIME_SRC = "/sounds/chime.mp3"

// Swap these for your own uploaded images — either drop files into
// public/images/speaking/ and reference them as "/images/speaking/xxx.jpg",
// or paste a full https:// URL directly here.
const VISUALS: Record<VisualKey, { src: string; alt: string }[]> = {
  "drive-cross": [
    { src: "/images/speaking/driving.jpg.png", alt: "Man driving a car" },
    { src: "/images/speaking/crosswalk.jpg.png", alt: "Pedestrians crossing a street" },
  ],
  "feet-arrows": [
    { src: "/images/speaking/feet-arrows.jpg.png", alt: "Feet standing among directional arrows" },
  ],
}

export function SpeakingExam() {
  // resolveSteps() ichida tasodifiy tanlash/aralashtirish bo'lishi mumkin,
  // shuning uchun uni faqat CLIENT tomonda hisoblaymiz (useEffect ichida).
  // Bu server va client bir xil HTML chiqarishini kafolatlaydi va
  // "Hydration failed" xatosini bartaraf etadi.
  const [steps, setSteps] = useState<Step[] | null>(null)
  const [stepIndex, setStepIndex] = useState(0)
  const [itemIndex, setItemIndex] = useState(0)
  const [phase, setPhase] = useState<"reading" | "prep" | "recording" | "advancing">("reading")
  const [prepLeft, setPrepLeft] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [fontScale, setFontScale] = useState(1)
  const [showVisual, setShowVisual] = useState(true)
  const [complete, setComplete] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)
  // Part 1's intro is read once before the very first question; while that
  // happens (and during the 5s pause right after it) the question itself
  // stays hidden so the candidate isn't reading ahead of the narration.
  const [questionRevealed, setQuestionRevealed] = useState(true)
  const [downloadingZip, setDownloadingZip] = useState(false)
  const volumeRef = useRef(volume)
  useEffect(() => {
    volumeRef.current = volume
  }, [volume])

  // Compute the (possibly randomized) steps once we're on the client.
  useEffect(() => {
    setSteps(resolveSteps())
  }, [])

  const responses = useRef<SpeakingResponse[]>([])
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const rafRef = useRef<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const startedAtRef = useRef(0)
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const waitTimeoutRef = useRef<number | null>(null)
  const recordingStartedRef = useRef(false)
  const finishedRef = useRef(false)

  const step = steps ? steps[stepIndex] : null
  const item = step ? step.items[itemIndex] : null

  // Reset per-item state: read the part intro (once, first item of Part 1
  // only) + any item intro + the question aloud, then move into
  // prep/recording. Part 1's first question additionally waits 5s of
  // silence after the intro finishes before it is revealed and read.
  useEffect(() => {
    if (!step || !item) return

    const isStepOpener = itemIndex === 0

    setFontScale(1)
    setPrepLeft(item.prep)
    setTimeLeft(item.seconds)
    setPhase("reading")
    setQuestionRevealed(false)
    setShowVisual(false)
    recordingStartedRef.current = false
    finishedRef.current = false

    let cancelled = false
    const questionText = item.table ? item.table.statement : item.prompt.join(". ")
    const QUESTION_DELAY_MS = 2000

    // Guard so the recording/chime can only ever fire once per item, no
    // matter which path (prep timer vs. straight-through) triggers it.
    const beginRecordingOnce = () => {
      if (cancelled || recordingStartedRef.current) return
      recordingStartedRef.current = true
      setPhase("recording")
      void startRecording()
    }

    const afterQuestionRead = () => {
      if (cancelled) return
      if (item.prep > 0) setPhase("prep")
      else beginRecordingOnce()
    }

    const speakAll = (queue: string[], onDone: () => void) => {
      if (cancelled) return
      if (queue.length === 0) {
        onDone()
        return
      }
      const [next, ...rest] = queue
      const utterance = new SpeechSynthesisUtterance(next)
      utterance.lang = "en-US"
      const voice = pickMaleVoice()
      if (voice) utterance.voice = voice
      utterance.pitch = 0.95
      utterance.volume = volumeRef.current
      currentUtteranceRef.current = utterance
      utterance.onend = () => speakAll(rest, onDone)
      utterance.onerror = () => speakAll(rest, onDone)
      window.speechSynthesis.speak(utterance)
    }

    const revealAndSpeakQuestion = () => {
      if (cancelled) return
      setQuestionRevealed(true)
      setShowVisual(true)
      const segments = [item.intro ?? null, questionText].filter(
        (segment): segment is string => Boolean(segment),
      )
      if ("speechSynthesis" in window && segments.length > 0) {
        speakAll(segments, afterQuestionRead)
      } else {
        afterQuestionRead()
      }
    }

    // Every question waits QUESTION_DELAY_MS of silence before it appears
    // and is read out — this happens right after the step's intro (for the
    // first item of every part) or right after the previous item ends.
    const waitThenReveal = () => {
      if (cancelled) return
      waitTimeoutRef.current = window.setTimeout(() => {
        waitTimeoutRef.current = null
        revealAndSpeakQuestion()
      }, QUESTION_DELAY_MS)
    }

    if (isStepOpener && step.intro && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      speakAll([step.intro], waitThenReveal)
    } else if (isStepOpener && step.intro) {
      waitThenReveal()
    } else {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel()
      waitThenReveal()
    }

    return () => {
      cancelled = true
      if (waitTimeoutRef.current !== null) {
        window.clearTimeout(waitTimeoutRef.current)
        waitTimeoutRef.current = null
      }
      window.speechSynthesis?.cancel()
      stopMediaOnly()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps, stepIndex, itemIndex])


  // Countdown ticker. Recreated whenever phase changes so its closure
  // always sees the current step/item — but recordingStartedRef and
  // finishedRef guarantee startRecording()/finishItem() each fire at most
  // once per item, even if an old interval briefly overlaps a new one
  // right after a phase transition (this overlap was previously causing
  // advance() to fire twice in a row and skip an entire part).
  useEffect(() => {
    if (complete || !steps) return
    const id = window.setInterval(() => {
      if (phase === "prep") {
        setPrepLeft((value) => {
          if (value <= 1) {
            if (!recordingStartedRef.current) {
              recordingStartedRef.current = true
              setPhase("recording")
              void startRecording()
            }
            return 0
          }
          return value - 1
        })
      } else if (phase === "recording") {
        setTimeLeft((value) => {
          if (value <= 1) {
            if (!finishedRef.current) {
              finishedRef.current = true
              finishItem()
            }
            return 0
          }
          return value - 1
        })
      }
    }, 1000)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, complete, steps])

  async function startRecording() {
    playChime(volumeRef.current)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      startedAtRef.current = Date.now()

      const media = new MediaRecorder(stream)
      chunksRef.current = []
      media.ondataavailable = (event) => chunksRef.current.push(event.data)
      media.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        const audioUrl = URL.createObjectURL(blob)
        if (step && item) {
          responses.current.push({
            part: step.key,
            questionIndex: item.savolNo,
            question: item.table ? item.table.statement : item.prompt.join(" "),
            audioUrl,
            durationSeconds: Math.round((Date.now() - startedAtRef.current) / 1000),
            recordedAt: new Date().toISOString(),
          })
        }
      }
      recorderRef.current = media
      media.start()

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      const ctx = new AudioCtx()
      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      audioCtxRef.current = ctx
      analyserRef.current = analyser
      drawWaveform()
    } catch {
      // Mic unavailable — still let the timer run so the flow doesn't stall.
    }
  }

  function drawWaveform() {
    const canvas = canvasRef.current
    const analyser = analyserRef.current
    if (!canvas || !analyser) return
    const ctx2d = canvas.getContext("2d")
    if (!ctx2d) return
    const data = new Uint8Array(analyser.frequencyBinCount)

    const render = () => {
      analyser.getByteTimeDomainData(data)
      const { width, height } = canvas
      ctx2d.clearRect(0, 0, width, height)
      ctx2d.beginPath()
      ctx2d.strokeStyle = "#1f2937"
      ctx2d.lineWidth = 1.5
      const slice = width / data.length
      let x = 0
      for (let i = 0; i < data.length; i++) {
        const y = (data[i] / 255) * height
        i === 0 ? ctx2d.moveTo(x, y) : ctx2d.lineTo(x, y)
        x += slice
      }
      ctx2d.stroke()
      rafRef.current = requestAnimationFrame(render)
    }
    render()
  }

  function stopMediaOnly() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach((track) => track.stop())
    audioCtxRef.current?.close().catch(() => {})
    streamRef.current = null
    audioCtxRef.current = null
    analyserRef.current = null
  }

  function finishItem() {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop()
    }
    stopMediaOnly()
    setPhase("advancing")
    window.setTimeout(advance, 150)
  }

  function advance() {
    if (!steps || !step) return
    if (itemIndex < step.items.length - 1) {
      setItemIndex((value) => value + 1)
    } else if (stepIndex < steps.length - 1) {
      setStepIndex((value) => value + 1)
      setItemIndex(0)
    } else {
      createSubmission(responses.current)
      setComplete(true)
    }
  }

  // Bundles every recorded answer into a single .zip so the candidate (or
  // admin) can download all audio files at once instead of one by one.
  async function handleDownloadZip() {
    if (downloadingZip || responses.current.length === 0) return
    setDownloadingZip(true)
    try {
      const zip = new JSZip()
      for (const [index, response] of responses.current.entries()) {
        const blob = await fetch(response.audioUrl).then((res) => res.blob())
        const fileName = `qism${response.part}-savol${response.questionIndex}-${index + 1}.webm`
        zip.file(fileName, blob)
      }
      const archive = await zip.generateAsync({ type: "blob" })
      const url = URL.createObjectURL(archive)
      const link = document.createElement("a")
      link.href = url
      link.download = `gapirish-javoblari-${Date.now()}.zip`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch {
      // If bundling fails, the individual audio blobs are still in memory —
      // simplest fallback is to just let the candidate know and retry.
    } finally {
      setDownloadingZip(false)
    }
  }

  // + / − tugmalari: darajani yangilaydi VA agar hozir gapirish (TTS)
  // ketayotgan bo'lsa, brauzer cheklovi tufayli hozirgi gapga ta'sir
  // qilolmaydi (Web Speech API mid-utterance volume o'zgarishini
  // qo'llab-quvvatlamaydi) — shu sababli avval eshitilmaganday tuyulishi
  // mumkin, lekin keyingi jumla/chimedan boshlab yangi daraja ishlaydi.
  const changeVolume = (delta: number) => {
    setVolume((v) => {
      const next = Math.min(1, Math.max(0, Math.round((v + delta) * 10) / 10))
      return next
    })
  }

  const stepStatus = (index: number) => (index < stepIndex ? "done" : index === stepIndex ? "active" : "upcoming")

  if (!steps || !step || !item) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-card">
        <p className="text-sm text-muted-foreground">Yuklanmoqda…</p>
      </main>
    )
  }

  if (complete) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-card px-5 text-center">
        <div className="max-w-lg">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check className="size-8" />
          </div>
          <h1 className="mt-6 text-2xl font-bold">Imtihon yakunlandi</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Barcha javoblaringiz ({responses.current.length} ta) yozib olindi va saqlandi. Natijalar admin tomonidan
            tekshirilgach, hisobingizda ko'rinadi.
          </p>
          <button
            onClick={handleDownloadZip}
            disabled={downloadingZip}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 py-3 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {downloadingZip ? "Tayyorlanmoqda…" : "Javoblarni ZIP holida yuklab olish"}
          </button>
          <Link href="/speaking" className="mt-3 inline-flex rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
            Bosh sahifaga qaytish
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-card">
      <header className="border-b">
        <div className="container-shell flex items-center justify-between py-3">
          <span className="text-sm text-muted-foreground">Gapirish bo'limi</span>
          <span className="text-sm text-muted-foreground">English</span>
        </div>
      </header>

      <div className="container-shell py-8">
        <div className="mx-auto flex max-w-xs items-center">
          {steps.map((s, index) => (
            <div key={s.key} className="flex flex-1 items-center last:flex-none">
              <div
                className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${
                  stepStatus(index) === "upcoming" ? "bg-orange-400" : "bg-emerald-500"
                }`}
              >
                {stepStatus(index) === "done" ? <Check className="size-4" /> : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`h-0.5 flex-1 ${stepStatus(index) === "done" ? "bg-emerald-500" : "bg-orange-400"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <section className="rounded-lg border p-5">
            <div className="flex items-center gap-3">
              <span className="rounded bg-sky-500 px-2 py-1 text-xs font-semibold text-white">
                Savol#{item.savolNo}
              </span>
              <Volume2 className="size-4 text-primary" />
              <button
                onClick={() => changeVolume(-0.1)}
                disabled={volume <= 0}
                title="Ovozni pasaytirish"
                className="rounded border px-2 py-0.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40"
              >
                −
              </button>
              <div className="h-1 flex-1 rounded-full bg-muted">
                <div className="h-1 rounded-full bg-primary" style={{ width: `${volume * 100}%` }} />
              </div>
              <button
                onClick={() => changeVolume(0.1)}
                disabled={volume >= 1}
                title="Ovozni balandlashtirish"
                className="rounded border px-2 py-0.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40"
              >
                +
              </button>
              <span className="w-9 shrink-0 text-right text-xs text-muted-foreground">{Math.round(volume * 100)}%</span>
            </div>

            <div className="mt-4 flex items-center gap-2 border-b pb-3 text-xs">
              <button onClick={() => setFontScale((v) => Math.max(0.8, v - 0.15))} className="rounded border px-2 py-1 font-semibold">
                A-
              </button>
              <button
                onClick={() => setFontScale((v) => Math.min(1.6, v + 0.15))}
                className="rounded bg-primary px-2 py-1 font-semibold text-primary-foreground"
              >
                A+
              </button>
              {item.visual && (
                <button onClick={() => setShowVisual((v) => !v)} className="ml-auto flex items-center gap-1 rounded border px-2 py-1 text-primary">
                  <ImageIcon className="size-3.5" /> Rasmni ko'rish
                </button>
              )}
            </div>

            {questionRevealed ? (
              <>
                <div className="mt-4 space-y-2" style={{ fontSize: `${fontScale}rem` }}>
                  {item.prompt.map((line, i) => (
                    <p key={`${itemIndex}-${i}`}>{line}</p>
                  ))}
                </div>

                {item.table && (
                  <div className="mt-4 overflow-hidden rounded border text-sm">
                    <p className="border-b bg-muted/60 p-2 text-center font-semibold">{item.table.statement}</p>
                    <div className="grid grid-cols-2 divide-x">
                      <div className="p-3">
                        <p className="font-semibold">FOR</p>
                        <ul className="mt-2 list-disc space-y-1 pl-4">
                          {item.table.forPoints.map((point, i) => (
                            <li key={i}>{point}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-3">
                        <p className="font-semibold">AGAINST</p>
                        <ul className="mt-2 list-disc space-y-1 pl-4">
                          {item.table.againstPoints.map((point, i) => (
                            <li key={i}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {item.visual && showVisual && (
                  <VisualPrompt kind={item.visual} onSelect={(image) => setLightbox(image)} />
                )}
              </>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">Savol tez orada chiqadi…</p>
            )}
          </section>

          <aside className="rounded-lg border">
            {phase === "recording" && (
              <div className="bg-cyan-400 py-2 text-center text-sm font-semibold text-white">
                Timer: {fmtTimer(timeLeft)}
              </div>
            )}
            <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 p-6">
              {phase === "reading" && (
                <>
                  <Volume2 className="size-10 animate-pulse text-primary" />
                  <p className="text-sm text-muted-foreground">Savol o'qilmoqda…</p>
                </>
              )}
              {phase === "prep" && (
                <>
                  <div className="flex size-24 items-center justify-center rounded-full border-2 text-3xl font-semibold">
                    {prepLeft}
                  </div>
                  <p className="text-sm text-muted-foreground">Diqqatni jamlang…</p>
                </>
              )}
              {phase === "recording" && (
                <>
                  <button
                    onClick={finishItem}
                    title="Javobni yakunlash"
                    className="flex size-9 items-center justify-center rounded bg-red-100 text-red-500 hover:bg-red-200"
                  >
                    <Square className="size-4 fill-current" />
                  </button>
                  <canvas ref={canvasRef} width={360} height={90} className="w-full max-w-[360px] border-b" />
                  <p className="text-xs text-muted-foreground">Ovozingiz yozilmoqda…</p>
                </>
              )}
              {phase === "advancing" && <p className="text-sm text-muted-foreground">Saqlanmoqda…</p>}
            </div>
          </aside>
        </div>
      </div>

      {lightbox && <ImageLightbox image={lightbox} onClose={() => setLightbox(null)} />}
    </main>
  )
}

function VisualPrompt({
  kind,
  onSelect,
}: {
  kind: VisualKey
  onSelect: (image: { src: string; alt: string }) => void
}) {
  const images = VISUALS[kind]
  return (
    <div className={`mt-4 grid gap-2 ${images.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
      {images.map((image) => (
        <ImageWithFallback key={image.src} src={image.src} alt={image.alt} onClick={() => onSelect(image)} />
      ))}
    </div>
  )
}

function ImageWithFallback({
  src,
  alt,
  onClick,
}: {
  src: string
  alt: string
  onClick: () => void
}) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className="flex h-32 items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/40 text-center text-xs text-muted-foreground">
        Rasm topilmadi — {"{src}"} yo'liga fayl qo'shing yoki URL bilan almashtiring
      </div>
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      onClick={onClick}
      className="h-40 w-full cursor-zoom-in rounded-lg border object-cover transition hover:opacity-90"
    />
  )
}

// Rasmni bosganda ochiladigan kattalashtirilgan oyna (lightbox/modal).
function ImageLightbox({
  image,
  onClose,
}: {
  image: { src: string; alt: string }
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        title="Yopish"
        className="absolute right-5 top-5 flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <X className="size-5" />
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt={image.alt}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
      />
    </div>
  )
}

function fmtTimer(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

function pickMaleVoice() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null
  const voices = window.speechSynthesis.getVoices()
  const englishVoices = voices.filter((v) => v.lang.startsWith("en"))
  return (
    // Common male-voice names across Chrome/Edge/Safari/Windows TTS engines.
    englishVoices.find((v) => /male|david|daniel|mark|alex|george|fred|james|tom|guy|ryan/i.test(v.name)) ||
    // Fall back to any English voice that isn't obviously flagged female.
    englishVoices.find((v) => !/female|zira|samantha|susan|karen|victoria|moira|tessa/i.test(v.name)) ||
    englishVoices[0] ||
    null
  )
}

function playChime(volume: number) {
  try {
    const audio = new Audio(CHIME_SRC)
    audio.volume = volume
    void audio.play().catch(() => {})
  } catch {
    // ignore
  }
}