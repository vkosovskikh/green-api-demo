import { queryOptions } from '@tanstack/react-query'
import { instanceUrl } from './client'

export type StateInstanceResponse = {
  stateInstance: string
}

export async function getStateInstance(idInstance: string, apiTokenInstance: string) {
  const response = await fetch(instanceUrl(idInstance, 'getStateInstance', apiTokenInstance), {
    signal: AbortSignal.timeout(5000),
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
