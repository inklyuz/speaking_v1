/**
 * speaking-questions.ts
 *
 * Barcha speaking savollari shu yerda saqlanadi.
 * Savollar rasmiy namunaviy format (PDF) asosida tuzilgan.
 *
 * MANTIQ:
 *  - Part 1.1 (savolNo 1–3): 3 ta savol RANDOM tanlanadi — har imtihonda boshqacha kombinatsiya
 *  - Part 1.2, Part 2, Part 3: savollar KETMA-KET (sequential) — har imtihonda keyingi variant
 *
 * YANGI SAVOL QO'SHISH:
 *  - Part 1.1 slot 1 → POOL_SLOT1 ga yangi element qo'shing
 *  - Part 1.1 slot 2 → POOL_SLOT2 ga yangi element qo'shing
 *  - Part 1.1 slot 3 → POOL_SLOT3 ga yangi element qo'shing
 *  - Part 1.2       → PART1_PHOTO_SETS ga yangi Photo12Set qo'shing
 *  - Part 2         → PART2_TOPICS ga yangi Part2Topic qo'shing
 *  - Part 3         → PART3_TABLES ga yangi TableSpec qo'shing
 */

// ─────────────────────────────────────────────────────────────────────────────
// Shared types
// ─────────────────────────────────────────────────────────────────────────────

export type VisualKey = "drive-cross" | "feet-arrows"

export type TableSpec = {
  statement: string
  forPoints: string[]
  againstPoints: string[]
}

export type Item = {
  savolNo: number
  prompt: string[]
  intro?: string
  visual?: VisualKey
  table?: TableSpec
  seconds: number
  prep: number
}

export type Step = { key: "1" | "2" | "3"; intro: string; items: Item[] }

// ─────────────────────────────────────────────────────────────────────────────
// Yordamchi funksiyalar
// ─────────────────────────────────────────────────────────────────────────────

function pickRandom<T>(pool: T[]): T {
  return pool[Math.floor(Math.random() * pool.length)]
}

function getCounter(key: string, max: number): number {
  if (typeof window === "undefined") return 0
  const raw = localStorage.getItem(key)
  const value = raw !== null ? parseInt(raw, 10) : 0
  return isNaN(value) ? 0 : value % max
}

function bumpCounter(key: string, max: number): void {
  if (typeof window === "undefined") return
  const next = (getCounter(key, max) + 1) % max
  localStorage.setItem(key, String(next))
}

// ─────────────────────────────────────────────────────────────────────────────
// PART 1.1 — Shaxsiy savollar (RANDOM)
// Daraja: A1–A2 | Vaqt: 30 soniya | Tayyorgarlik: yo'q
//
// 3 ta tematik slot — har imtihonda har slotdan bitta random tanlanadi.
// Slot 1: odamlar/munosabatlar
// Slot 2: joy/makon
// Slot 3: qiziqishlar/bo'sh vaqt
// ─────────────────────────────────────────────────────────────────────────────

const POOL_SLOT1 = [
  "What is your favourite food?",
  "Who is your first teacher?",
  "Do you prefer watching movies or reading books?",
  "What do you do to stay healthy?",
  "Do you work or are you a student?",
  "Tell me about your first teacher.",
  "What is your favourite drink?",
];

const POOL_SLOT2 = [
  "Do you go to bed early or late?",
  "What do you do after school or work?",
  "What types of music do you like?",
  "Which weather dislike you?",
  "Do you have a pet?",
  "Where do you like to go shopping?",
  "What is your favorite TV show?",
  "What do you do in your free time?",
]

const POOL_SLOT3 = [
  "How often do you go to a cinema?",
  "How popular are museums in your country?",
  "Do you play any sports?",
  "Do you wake up early?",
  "What sort of devices do you use daily?",
  "What do you usually have for breakfast?",
  "Who is your favorite singer?",
  "What is your favorite weather?",
  "Do you like reading books?",
  "How do you stay healthy?",
]

// ─────────────────────────────────────────────────────────────────────────────
// PART 1.2 — Ikki rasm asosida savollar (SEQUENTIAL)
// Daraja: B1 | Savol 4: 45s | Savollar 5–6: 30s | Tayyorgarlik: yo'q
// ─────────────────────────────────────────────────────────────────────────────

type Photo12Set = {
  visual: VisualKey
  intro: string
  q4: string
  q5: string
  q6: string
}

const PART1_PHOTO_SETS: Photo12Set[] = [
  {
    visual: "drive-cross",
    intro:
      "Now, I'm going to ask you to compare two pictures and I will ask you two questions about them. Look at the photographs.",
    q4: "What do you see in these pictures?",
    q5: "What are some advantages of walking over driving?",
    q6: "Why do some people prefer having a car of their own?",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// PART 2 — Rasm asosida 3 ta savol (SEQUENTIAL)
// Daraja: B2 | Vaqt: 2 daqiqa javob, 1 daqiqa tayyorgarlik
// ─────────────────────────────────────────────────────────────────────────────

type Part2Topic = {
  visual: VisualKey
  prompts: [string, string, string]
}

const PART2_TOPICS: Part2Topic[] = [
  {
    visual: "feet-arrows",
    prompts: [
      "Tell me about a critical decision you have made.",
      "How has this decision influenced you and your life?",
      "What factors have the highest impact on the decisions people make?",
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// PART 3 — For/Against jadval (SEQUENTIAL)
// Daraja: C1 | Vaqt: 2 daqiqa javob, 1 daqiqa tayyorgarlik
// ─────────────────────────────────────────────────────────────────────────────

const PART3_TABLES: TableSpec[] = [
  {
    statement: "Citizens should be allowed to carry personal guns.",
    forPoints: [
      "Guns can help people protect themselves",
      "They prevent people from becoming victims of crimes like burglary",
      "Necessary for hunting or target sports",
    ],
    againstPoints: [
      "Guns are weapons that are used to commit a crime",
      "Fewer guns will reduce the murder rate",
      "Small or military guns are not useful for activities like hunting",
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// resolveSteps — har bir imtihon boshida bir marta chaqiriladi
// ─────────────────────────────────────────────────────────────────────────────

export function resolveSteps(): Step[] {
  // Part 1.1 — har slotdan random bitta savol
  const p11Items: Item[] = [
    { savolNo: 1, prompt: [pickRandom(POOL_SLOT1)], seconds: 30, prep: 0 },
    { savolNo: 2, prompt: [pickRandom(POOL_SLOT2)], seconds: 30, prep: 0 },
    { savolNo: 3, prompt: [pickRandom(POOL_SLOT3)], seconds: 30, prep: 0 },
  ]

  // Part 1.2 — sequential
  const photoIdx = getCounter("spk_photo_idx", PART1_PHOTO_SETS.length)
  bumpCounter("spk_photo_idx", PART1_PHOTO_SETS.length)
  const ps = PART1_PHOTO_SETS[photoIdx]
  const p12Items: Item[] = [
    { savolNo: 4, prompt: [ps.q4], intro: ps.intro, visual: ps.visual, seconds: 45, prep: 10 },
    { savolNo: 5, prompt: [ps.q5], visual: ps.visual, seconds: 30, prep: 0 },
    { savolNo: 6, prompt: [ps.q6], visual: ps.visual, seconds: 30, prep: 0 },
  ]

  // Part 2 — sequential
  const p2Idx = getCounter("spk_p2_idx", PART2_TOPICS.length)
  bumpCounter("spk_p2_idx", PART2_TOPICS.length)
  const p2 = PART2_TOPICS[p2Idx]
  const p2Items: Item[] = [
    { savolNo: 1, prompt: [...p2.prompts], visual: p2.visual, seconds: 120, prep: 60 },
  ]

  // Part 3 — sequential
  const p3Idx = getCounter("spk_p3_idx", PART3_TABLES.length)
  bumpCounter("spk_p3_idx", PART3_TABLES.length)
  const p3Items: Item[] = [
    { savolNo: 1, prompt: [], table: PART3_TABLES[p3Idx], seconds: 120, prep: 60 },
  ]

  return [
    {
      key: "1",
      intro:
        "Part one. In this part, I'm going to ask you three short questions about yourself and your interests. And then, you will see some photos and answer some questions about them. You will have 30 seconds to reply to each question. Begin speaking when you hear this sound.",
      items: [...p11Items, ...p12Items],
    },
    {
      key: "2",
      intro:
        "Part two. In this part, I'm going to show you a picture and ask you three questions. You will have one minute to think about your answers before you start speaking. You will have two minutes to answer all three questions. Begin speaking when you hear this sound. Look at the photograph.",
      items: p2Items,
    },
    {
      key: "3",
      intro:
        "Part three. In this part, you are going to speak on a topic for two minutes. You can see the topic on the screen and two lists of points, for and against, related to the topic. Choose two items from each list and give a balanced argument to represent both sides of the topic. You have one minute to prepare your argument. You will then have two minutes to speak. Begin speaking when you hear this sound.",
      items: p3Items,
    },
  ]
}