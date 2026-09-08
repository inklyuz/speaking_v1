export type ApiError = { code: string; message: string }

export class ApiRequestError extends Error {
  code: string
  constructor(error: ApiError) { super(error.message); this.code = error.code }
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? ''

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...init?.headers } })
  const payload = await response.json().catch(() => null) as { success?: boolean; data?: T; error?: ApiError } | null
  if (!response.ok || payload?.success === false) throw new ApiRequestError(payload?.error ?? { code: 'UNKNOWN_ERROR', message: 'Something went wrong. Please try again.' })
  return (payload?.data ?? payload) as T
}
