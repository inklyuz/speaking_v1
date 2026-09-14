# Mock Center Speaking V1 — real backend contract

## Candidate / practice

- `GET /api/v1/speaking/practice/tests` — active Speaking test catalog.
- `GET /api/v1/speaking/practice/tests/{test_id}` — full selected test.
- `POST /api/v1/speaking/{speaking_test_id}/submit` — multipart audio upload. Practice sends only `file`.

## Mock mode

- `POST /api/v1/speaking/mock/access`
  - body: `{ "student_id": "MC-..." }`
  - registration must exist and be `ATTENDED` (admin check-in completed).
  - returns the existing Mock attempt, Speaking skill attempt and server-assigned Speaking test.
  - sets a short-lived access cookie so the existing authenticated upload endpoint can be used.
- `POST /api/v1/speaking/{speaking_test_id}/submit?mock_skill_attempt_id={id}` — audio upload linked to the Mock Speaking skill.
- `POST /api/v1/mock-exams/attempts/{attempt_id}/submit/SPEAKING` — marks the Speaking section as submitted.

## Admin

- `GET /api/v1/speaking/pending` — pending audio submissions.
- `POST /api/v1/speaking/{submission_id}/result` — evaluator enters the Speaking score.

## Important behavior

Mock mode is server-authoritative: the frontend never randomly selects a test. The `MockSkillAttempt.speaking_test_id` selected for the Mock attempt is the source of truth.

Practice mode is separate and never writes a Speaking score into a Mock result.
