// Mock "backend" for the speaking module.
// Everything lives in memory on the client for now. When a real backend is
// wired up, replace the functions below with calls to lib/api/client.ts —
// the shapes (SpeakingResponse / SpeakingSubmission) are designed to match
// what a real API would return.

export type SpeakingResponse = {
  part: string
  questionIndex: number
  question: string
  audioUrl: string
  durationSeconds: number
  recordedAt: string
}

export type CriteriaScores = {
  fluency?: number
  vocabulary?: number
  grammar?: number
  pronunciation?: number
  interaction?: number
}

export type SpeakingSubmission = {
  id: string
  candidateName: string
  submittedAt: string
  status: "pending" | "graded"
  responses: SpeakingResponse[]
  scores?: CriteriaScores
  feedback?: string
  finalizedAt?: string
}

const submissions: SpeakingSubmission[] = []

export function createSubmission(responses: SpeakingResponse[], candidateName = "Demo talabgor") {
  const submission: SpeakingSubmission = {
    id: `sp-${Date.now()}`,
    candidateName,
    submittedAt: new Date().toISOString(),
    status: "pending",
    responses,
  }
  submissions.unshift(submission)
  return submission
}

export function listSubmissions() {
  return submissions
}

export function getSubmission(id: string) {
  return submissions.find((item) => item.id === id)
}

export function saveAssessment(id: string, scores: CriteriaScores, feedback: string, finalize: boolean) {
  const submission = getSubmission(id)
  if (!submission) return undefined
  submission.scores = scores
  submission.feedback = feedback
  if (finalize) {
    submission.status = "graded"
    submission.finalizedAt = new Date().toISOString()
  }
  return submission
}
