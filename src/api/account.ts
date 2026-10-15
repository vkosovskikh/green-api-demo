import { queryOptions } from '@tanstack/react-query'
import { instanceUrl, postInstance, requestSignal } from './client'

export type StateInstanceResponse = {
  stateInstance: string
}

export async function getStateInstance(idInstance: string, apiTokenInstance: string) {
  const response = await fetch(instanceUrl(idInstance, 'getStateInstance', apiTokenInstance), {
    signal: requestSignal(),
  })
  if (!response.ok) throw new Error(`GetStateInstance failed: ${response.status}`)
  return (await response.json()) as StateInstanceResponse
}

export function stateInstanceOptions(idInstance: string, apiTokenInstance: string) {
  return queryOptions({
    queryKey: ['account', 'getStateInstance', idInstance, apiTokenInstance],
    queryFn: () => getStateInstance(idInstance, apiTokenInstance),
    retry: false,
  })
}

const outgoingSettings = {
  webhookUrl: '',
  incomingWebhook: 'yes',
  outgoingWebhook: 'yes',
  outgoingAPIMessageWebhook: 'yes',
  outgoingMessageWebhook: 'yes',
} as const

export async function getSettings(idInstance: string, apiTokenInstance: string, signal?: AbortSignal) {
  const response = await fetch(instanceUrl(idInstance, 'getSettings', apiTokenInstance), {
    signal: requestSignal(signal),
  })
  if (!response.ok) throw new Error(`getSettings failed: ${response.status}`)
  return (await response.json()) as unknown
}

export function setSettings(idInstance: string, apiTokenInstance: string, signal?: AbortSignal) {
  return postInstance(idInstance, apiTokenInstance, 'setSettings', outgoingSettings, signal)
}

export async function ensureOutgoingSettings(idInstance: string, apiTokenInstance: string, signal?: AbortSignal) {
  const settings = await getSettings(idInstance, apiTokenInstance, signal)
  if (outgoingReady(settings)) return
  await setSettings(idInstance, apiTokenInstance, signal)
}

function outgoingReady(settings: unknown) {
  if (!isRecord(settings)) return false
  const webhookUrl = settings.webhookUrl
  const emptyWebhook = webhookUrl == null || webhookUrl === ''
  return (
    emptyWebhook &&
    settings.incomingWebhook === 'yes' &&
    settings.outgoingWebhook === 'yes' &&
    settings.outgoingAPIMessageWebhook === 'yes' &&
    settings.outgoingMessageWebhook === 'yes'
  )
}

function isRecord(data: unknown): data is Record<string, unknown> {
  return typeof data === 'object' && data !== null
}
