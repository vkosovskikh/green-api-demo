import { queryOptions } from '@tanstack/react-query'
import { instanceUrl, postInstance, requestSignal } from './client'

const serverError = 'При обращении к серверу произошла ошибка'

export type CheckAccountResult = { exist: true; chatId: string } | { exist: false } | { message: string }

export type ContactInfo = {
  avatar?: string
  name?: string
  lastSeen?: number | string | null
}

export async function checkAccount(
  idInstance: string,
  apiTokenInstance: string,
  phoneNumber: number,
): Promise<CheckAccountResult> {
  let response: Response
  try {
    response = await fetch(instanceUrl(idInstance, 'checkAccount', apiTokenInstance), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber }),
      signal: requestSignal(),
    })
  } catch {
    return { message: serverError }
  }

  let data: unknown
  try {
    data = await response.json()
  } catch {
    data = undefined
  }

  const reason = failureReason(data)
  if (reason) return { message: reason }
  if (!response.ok) return { message: serverError }
  if (isRecord(data) && data.exist === false) return { exist: false }
  if (isRecord(data) && data.exist === true && typeof data.chatId === 'string' && data.chatId) {
    return { exist: true, chatId: data.chatId }
  }
  return { message: serverError }
}

function failureReason(data: unknown) {
  if (!isRecord(data) || data.status !== false || typeof data.reason !== 'string') return
  const reason = data.reason.trim()
  return reason || undefined
}

function isRecord(data: unknown): data is Record<string, unknown> {
  return typeof data === 'object' && data !== null
}

export function getContactInfo(idInstance: string, apiTokenInstance: string, chatId: string) {
  return postInstance<ContactInfo>(idInstance, apiTokenInstance, 'getContactInfo', { chatId })
}

export function contactInfoOptions(idInstance: string, apiTokenInstance: string, chatId: string) {
  return queryOptions({
    queryKey: ['service', 'getContactInfo', idInstance, chatId],
    queryFn: () => getContactInfo(idInstance, apiTokenInstance, chatId),
    retry: false,
    gcTime: 0,
  })
}
