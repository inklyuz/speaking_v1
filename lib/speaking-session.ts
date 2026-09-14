export type SpeakingAccess = {
  mode: 'mock' | 'practice'
  studentId?: string
  candidateName?: string
  attemptId?: number
  skillAttemptId?: number
  testId: string
}

const KEY = 'mock-center-speaking-access'

export function saveSpeakingAccess(value: SpeakingAccess) {
  if (typeof window !== 'undefined') sessionStorage.setItem(KEY, JSON.stringify(value))
}

export function getSpeakingAccess(): SpeakingAccess | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearSpeakingAccess() {
  if (typeof window !== 'undefined') sessionStorage.removeItem(KEY)
}
