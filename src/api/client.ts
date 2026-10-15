export function apiUrl() {
  const url = import.meta.env.VITE_API_URL.replace(/\/$/, '')
  if (!url) throw new Error('VITE_API_URL is not set')
  return url
}

export function instanceUrl(idInstance: string, method: string, apiTokenInstance: string) {
  return `${apiUrl()}/waInstance${idInstance}/${method}/${apiTokenInstance}`
}
