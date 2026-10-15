import { ensureOutgoingSettings } from '../api/account'
import { deleteNotification, receiveNotification } from '../api/messages'
import { applyNotification } from './applyNotification'

type Session = {
  idInstance: string
  apiTokenInstance: string
}

let controller: AbortController | null = null

export function startNotifications(session: Session) {
  stopNotifications()
  const next = new AbortController()
  controller = next
  void run(session, next.signal)
}

export function stopNotifications() {
  controller?.abort()
  controller = null
}

async function run(session: Session, signal: AbortSignal) {
  try {
    await ensureOutgoingSettings(session.idInstance, session.apiTokenInstance, signal)
  } catch {
    if (signal.aborted) return
  }
  while (!signal.aborted) {
    try {
      const notification = await receiveNotification(session.idInstance, session.apiTokenInstance, signal)
      if (signal.aborted || !notification) continue
      applyNotification(notification.body)
      if (signal.aborted) return
      await deleteNotification(session.idInstance, session.apiTokenInstance, notification.receiptId, signal)
    } catch {
      if (signal.aborted) return
    }
  }
}
