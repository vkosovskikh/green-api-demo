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
): Promise<T> {
  const response = await fetch(instanceUrl(idInstance, method, apiTokenInstance), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(5000),
  })
  if (!response.ok) throw new Error(`${method} failed: ${response.status}`)
  return (await response.json()) as T
}
