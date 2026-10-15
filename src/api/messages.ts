import { instanceUrl, postInstance, requestSignal } from './client'

export type ReceivedNotification = {
  receiptId: number
  body: unknown
}

export async function sendMessage(
  idInstance: string,
  apiTokenInstance: string,
  chatId: string,
  message: string,
) {
  const data = await postInstance<unknown>(idInstance, apiTokenInstance, 'sendMessage', { chatId, message })
  return messageId(isRecord(data) ? data.idMessage : undefined)
}

export async function receiveNotification(
  idInstance: string,
  apiTokenInstance: string,
  signal: AbortSignal,
): Promise<ReceivedNotification | null> {
  const response = await fetch(instanceUrl(idInstance, 'receiveNotification', apiTokenInstance), {
    signal: requestSignal(signal),
  })
  if (!response.ok) throw new Error(`receiveNotification failed: ${response.status}`)
  const text = await response.text()
  if (!text.trim()) return null
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    return null
  }
  if (!isRecord(data) || typeof data.receiptId !== 'number' || !Number.isFinite(data.receiptId)) return null
  return { receiptId: data.receiptId, body: data.body }
}

export async function deleteNotification(
  idInstance: string,
  apiTokenInstance: string,
  receiptId: number,
  signal: AbortSignal,
) {
  const response = await fetch(
    `${instanceUrl(idInstance, 'deleteNotification', apiTokenInstance)}/${receiptId}`,
    { method: 'DELETE', signal: requestSignal(signal) },
  )
  if (!response.ok) throw new Error(`deleteNotification failed: ${response.status}`)
}

function messageId(value: unknown) {
  if (typeof value === 'string' && value.trim()) return value
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  return ''
}

function isRecord(data: unknown): data is Record<string, unknown> {
  return typeof data === 'object' && data !== null
}
