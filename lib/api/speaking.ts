import { apiRequest } from './client'

export type SpeakingPart = {
  question_1?: string
  question_2?: string
  question_3?: string
  question_describe?: string
  image_1_url?: string
  image_2_url?: string
  image_url?: string
  topic?: string
  for_points?: string[]
  against_points?: string[]
  prep_seconds?: number
  answer_seconds?: number
  describe_answer_seconds?: number
}

export type SpeakingTest = {
  id: string
  title: string
  description?: string | null
  is_active: boolean
  created_at: string
  part_1_1?: SpeakingPart | null
  part_1_2?: SpeakingPart | null
  part_2?: SpeakingPart | null
  part_3?: SpeakingPart | null
}

export type SpeakingTestListItem = {
  id: string
  title: string
  is_active: boolean
  created_at: string
}

export type MockSpeakingAccess = {
  candidate: {
    candidate_id: string
    student_id: string
    full_name: string
    exam_id: string
  }
  attempt_id: number
  skill_attempt_id: number
  speaking_test: SpeakingTest
  status: 'available' | 'completed'
}

const prefix = process.env.NEXT_PUBLIC_SPEAKING_API_PREFIX ?? '/api/v1/speaking'

export function listPracticeTests() {
  return apiRequest<SpeakingTestListItem[]>(`${prefix}/practice/tests`)
}

export function getPracticeTest(testId: string) {
  return apiRequest<SpeakingTest>(`${prefix}/practice/tests/${encodeURIComponent(testId)}`)
}

export function getMockSpeakingAccess(studentId: string) {
  return apiRequest<MockSpeakingAccess>(`${prefix}/mock/access`, {
    method: 'POST',
    body: JSON.stringify({ student_id: studentId.trim() }),
  })
}

export function uploadSpeakingAudio(
  speakingTestId: string,
  file: Blob,
  mockSkillAttemptId?: number,
) {
  const form = new FormData()
  form.append('file', file, `speaking-${Date.now()}.webm`)
  if (mockSkillAttemptId) form.append('mock_skill_attempt_id', String(mockSkillAttemptId))

  const query = mockSkillAttemptId
    ? `?mock_skill_attempt_id=${encodeURIComponent(String(mockSkillAttemptId))}`
    : ''

  return apiRequest<{ id: number }>(`${prefix}/${encodeURIComponent(speakingTestId)}/submit${query}`, {
    method: 'POST',
    body: form,
    headers: {},
  })
}

export function submitMockSpeakingSkill(attemptId: number) {
  return apiRequest<{ submitted: boolean }>(`/api/v1/mock-exams/attempts/${attemptId}/submit/SPEAKING`, {
    method: 'POST',
  })
}

export function listPendingSubmissions() {
  return apiRequest<any[]>(`${prefix}/pending`)
}

export function submitSpeakingResult(submissionId: number, data: Record<string, unknown>) {
  return apiRequest<any>(`${prefix}/${submissionId}/result`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Backward-compatible aliases used by older admin UI.
export const listAssessments = listPendingSubmissions
export const getAssessment = async (id: string) => {
  const items = await listPendingSubmissions()
  const item = items.find((x) => String(x.id) === id)
  if (!item) throw new Error('Speaking topshiriq topilmadi.')
  return item
}
export const saveAssessment = submitSpeakingResult
