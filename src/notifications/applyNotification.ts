import { chatRepository } from '../data/chatRepository'

export function applyNotification(body: unknown) {
  if (!isRecord(body)) return
  if (
    body.typeWebhook === 'incomingMessageReceived' ||
    body.typeWebhook === 'outgoingAPIMessageReceived' ||
    body.typeWebhook === 'outgoingMessageReceived'
  ) {
    const sender = isRecord(body.senderData) ? body.senderData : undefined
    const chatId = asId(sender?.chatId)
    const id = asId(body.idMessage)
    const text = messageText(body.messageData)
    if (!chatId || !id || !text) return
    const message = { id, text, time: messageTime(body.timestamp) }
    if (body.typeWebhook === 'incomingMessageReceived') {
      chatRepository.addIncoming(chatId, message)
      return
    }
    chatRepository.claimOutgoing(chatId, message)
    return
  }
  if (body.typeWebhook !== 'outgoingMessageStatus') return
  const chatId = asId(body.chatId)
  const id = asId(body.idMessage)
  if (!chatId || !id) return
  if (body.status === 'delivered' || body.status === 'read') {
    chatRepository.setOutgoingStatus(chatId, id, body.status)
  }
}

function messageText(messageData: unknown) {
  if (!isRecord(messageData)) return ''
  const textMessage = messageData.textMessageData
  if (isRecord(textMessage) && typeof textMessage.textMessage === 'string' && textMessage.textMessage.trim()) {
    return textMessage.textMessage
  }
  const extended = messageData.extendedTextMessageData
  if (isRecord(extended) && typeof extended.text === 'string' && extended.text.trim()) {
    return extended.text
  }
  return ''
}

function messageTime(timestamp: unknown) {
  const seconds = typeof timestamp === 'number' ? timestamp : typeof timestamp === 'string' ? Number(timestamp) : NaN
  const date = Number.isFinite(seconds) && seconds > 0 ? new Date(seconds * 1000) : new Date()
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

function asId(value: unknown) {
  if (typeof value === 'string' && value.trim()) return value
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  return ''
}

function isRecord(data: unknown): data is Record<string, unknown> {
  return typeof data === 'object' && data !== null
}
