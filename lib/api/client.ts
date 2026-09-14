export type ApiError = { code: string; message: string }

export class ApiRequestError extends Error {
  code: string
  constructor(error: ApiError) {
    super(error.message)
    this.code = error.code
  }
}

const baseUrl = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '')

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  const isFormData = typeof FormData !== 'undefined' && init.body instanceof FormData
  if (!isFormData && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  })

  const payload = await response.json().catch(() => null) as { success?: boolean; data?: T; error?: ApiError } | null
  if (!response.ok || payload?.success === false) {
    throw new ApiRequestError(payload?.error ?? {
      code: `HTTP_${response.status}`,
      message: 'So‘rovni bajarishda xatolik yuz berdi.',
    })
  }
  return (payload?.data ?? payload) as T
}
