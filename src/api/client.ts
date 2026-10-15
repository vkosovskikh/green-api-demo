export const requestTimeoutMs = 10000

export function requestSignal(signal?: AbortSignal) {
  const timeout = AbortSignal.timeout(requestTimeoutMs)
  if (!signal) return timeout
  return AbortSignal.any([signal, timeout])
}

export function apiUrl() {
  const url = import.meta.env.VITE_API_URL.replace(/\/$/, '')
  if (!url) throw new Error('VITE_API_URL is not set')
  return url
}

export function instanceUrl(idInstance: string, method: string, apiTokenInstance: string) {
  return `${apiUrl()}/waInstance${idInstance}/${method}/${apiTokenInstance}`
}

export async function postInstance<T>(
  idInstance: string,
  apiTokenInstance: string,
  method: string,
  body: unknown,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(instanceUrl(idInstance, method, apiTokenInstance), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: requestSignal(signal),
  })
  if (!response.ok) throw new Error(`${method} failed: ${response.status}`)
  return (await response.json()) as T
}
