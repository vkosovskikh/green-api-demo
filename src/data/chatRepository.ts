import { useSyncExternalStore } from 'react'

export type MessageStatus = 'notSent' | 'sent' | 'delivered' | 'read'

export type ChatMessage = {
  id: string
  text: string
  time: string
  out: boolean
  status?: MessageStatus
}

export type Chat = {
  chatId: string
  avatar: string
  name: string
  lastSeen: number | null
  messages: ChatMessage[]
  ready: boolean
}

const statusRank: Record<MessageStatus, number> = {
  notSent: 0,
  sent: 1,
  delivered: 2,
  read: 3,
}

let chats: Chat[] = []
const byId = new Map<string, Chat>()
const pendingStatus = new Map<string, MessageStatus>()
const outgoingQueue = new Map<string, string[]>()
const listeners = new Set<() => void>()

function publish() {
  chats = [...byId.values()]
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getChats() {
  return chats
}

export const chatRepository = {
  add(chatId: string) {
    const existing = byId.get(chatId)
    if (existing) return existing
    const chat: Chat = { chatId, avatar: '', name: '', lastSeen: null, messages: [], ready: false }
    byId.set(chatId, chat)
    publish()
    return chat
  },
  pending(chatId: string) {
    const chat = byId.get(chatId)
    if (!chat || (!chat.ready && !chat.name && !chat.avatar && chat.lastSeen == null)) return
    byId.set(chatId, { ...chat, avatar: '', name: '', lastSeen: null, ready: false })
    publish()
  },
  setContact(chatId: string, contact: { avatar?: string; name?: string; lastSeen?: number | string | null }) {
    const chat = byId.get(chatId)
    if (!chat) return
    const next: Chat = {
      ...chat,
      avatar: contact.avatar ?? '',
      name: contact.name ?? '',
      lastSeen: toLastSeen(contact.lastSeen),
      ready: true,
    }
    if (
      chat.ready &&
      chat.avatar === next.avatar &&
      chat.name === next.name &&
      chat.lastSeen === next.lastSeen
    ) {
      return
    }
    byId.set(chatId, next)
    publish()
  },
  addMessage(chatId: string, message: ChatMessage) {
    const chat = byId.get(chatId)
    if (!chat) return
    if (message.out && message.status === 'notSent') enqueue(chatId, message.id)
    byId.set(chatId, { ...chat, messages: [...chat.messages, message] })
    publish()
  },
  releaseOutgoing(chatId: string, localId: string) {
    dequeue(chatId, localId)
  },
  bindServerId(chatId: string, localId: string, idMessage: string) {
    dequeue(chatId, localId)
    const chat = byId.get(chatId)
    if (!chat || localId === idMessage) return
    const local = chat.messages.find((message) => message.id === localId)
    if (!local) return
    if (chat.messages.some((message) => message.id === idMessage)) {
      byId.set(chatId, { ...chat, messages: chat.messages.filter((message) => message.id !== localId) })
      publish()
      return
    }
    const status = consumeStatus(idMessage, local.status ?? 'notSent')
    const messages = chat.messages.map((message) =>
      message.id === localId ? { ...message, id: idMessage, status } : message,
    )
    byId.set(chatId, { ...chat, messages })
    publish()
  },
  addIncoming(chatId: string, message: { id: string; text: string; time: string }) {
    const chat = ensure(chatId)
    if (chat.messages.some((item) => item.id === message.id)) return
    byId.set(chatId, {
      ...chat,
      messages: [...chat.messages, { ...message, out: false }],
    })
    publish()
  },
  claimOutgoing(chatId: string, message: { id: string; text: string; time: string }) {
    const chat = ensure(chatId)
    const existing = chat.messages.find((item) => item.id === message.id)
    if (existing) {
      const status = consumeStatus(message.id, raiseStatus(existing.status, 'sent'))
      if (status === existing.status) return
      const messages = chat.messages.map((item) => (item.id === message.id ? { ...item, status } : item))
      byId.set(chatId, { ...chat, messages })
      publish()
      return
    }
    const localId = outgoingQueue.get(chatId)?.[0]
    if (localId) dequeue(chatId, localId)
    const pendingIndex = localId ? chat.messages.findIndex((item) => item.id === localId) : -1
    if (localId && pendingIndex >= 0) {
      const pending = chat.messages[pendingIndex]
      const status = consumeStatus(message.id, raiseStatus(pending.status, 'sent'))
      const messages = chat.messages.map((item, index) =>
        index === pendingIndex ? { ...item, id: message.id, status } : item,
      )
      byId.set(chatId, { ...chat, messages })
      publish()
      return
    }
    byId.set(chatId, {
      ...chat,
      messages: [...chat.messages, { ...message, out: true, status: consumeStatus(message.id, 'sent') }],
    })
    publish()
  },
  setOutgoingStatus(chatId: string, idMessage: string, status: 'delivered' | 'read') {
    const chat = byId.get(chatId)
    const message = chat?.messages.find((item) => item.id === idMessage && item.out)
    if (!chat || !message) {
      rememberStatus(idMessage, status)
      return
    }
    const next = consumeStatus(idMessage, raiseStatus(message.status, status))
    if (next === message.status) return
    const messages = chat.messages.map((item) => (item.id === idMessage ? { ...item, status: next } : item))
    byId.set(chatId, { ...chat, messages })
    publish()
  },
  remove(chatId: string) {
    outgoingQueue.delete(chatId)
    if (!byId.delete(chatId)) return
    publish()
  },
  clear() {
    pendingStatus.clear()
    outgoingQueue.clear()
    if (byId.size === 0) return
    byId.clear()
    publish()
  },
}

export function useChats() {
  return useSyncExternalStore(subscribe, getChats, getChats)
}

export function useChat(chatId: string | undefined) {
  const items = useChats()
  if (!chatId) return undefined
  return items.find((chat) => chat.chatId === chatId)
}

export function formatLastSeen(lastSeen: number | null) {
  if (!lastSeen) return ''
  return new Date(lastSeen * 1000).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function enqueue(chatId: string, localId: string) {
  const queue = outgoingQueue.get(chatId)
  if (queue) queue.push(localId)
  else outgoingQueue.set(chatId, [localId])
}

function dequeue(chatId: string, localId: string) {
  const queue = outgoingQueue.get(chatId)
  if (!queue) return
  const index = queue.indexOf(localId)
  if (index >= 0) queue.splice(index, 1)
}

function ensure(chatId: string) {
  const existing = byId.get(chatId)
  if (existing) return existing
  const chat: Chat = { chatId, avatar: '', name: '', lastSeen: null, messages: [], ready: false }
  byId.set(chatId, chat)
  return chat
}

function raiseStatus(current: MessageStatus | undefined, next: MessageStatus) {
  if (!current || statusRank[next] > statusRank[current]) return next
  return current
}

function rememberStatus(idMessage: string, status: MessageStatus) {
  pendingStatus.set(idMessage, raiseStatus(pendingStatus.get(idMessage), status))
}

function consumeStatus(idMessage: string, fallback: MessageStatus) {
  const pending = pendingStatus.get(idMessage)
  if (!pending) return fallback
  pendingStatus.delete(idMessage)
  return raiseStatus(fallback, pending)
}

function toLastSeen(value: number | string | null | undefined) {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    if (Number.isFinite(parsed) && parsed > 0) return parsed
  }
  return null
}
