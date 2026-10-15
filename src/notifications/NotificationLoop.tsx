import { useEffect } from 'react'
import { ensureOutgoingSettings } from '../api/account'
import { deleteNotification, receiveNotification } from '../api/messages'
import type { Credentials } from '../auth/AuthContext'
import { useAuth } from '../auth/AuthContext'
import { applyNotification } from './applyNotification'

export function NotificationLoop() {
  const { credentials } = useAuth()

  useEffect(() => {
    if (!credentials) return
    const controller = new AbortController()
    void run(credentials, controller.signal)
    return () => controller.abort()
  }, [credentials])

  return null
}

async function run(credentials: Credentials, signal: AbortSignal) {
  try {
    await ensureOutgoingSettings(credentials.idInstance, credentials.apiTokenInstance, signal)
  } catch {
    if (signal.aborted) return
  }
  while (!signal.aborted) {
    try {
      const notification = await receiveNotification(
        credentials.idInstance,
        credentials.apiTokenInstance,
        signal,
      )
      if (signal.aborted || !notification) continue
      applyNotification(notification.body)
      if (signal.aborted) return
      await deleteNotification(
        credentials.idInstance,
        credentials.apiTokenInstance,
        notification.receiptId,
        signal,
      )
    } catch {
      if (signal.aborted) return
    }
  }
}
