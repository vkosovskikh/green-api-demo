import { useSyncExternalStore } from 'react'

export type ChatMessage = {
  id: number
  text: string
  time: string
  out: boolean
  read?: boolean
}

export type Chat = {
  chatId: string
  avatar: string
  name: string
  lastSeen: number | null
  messages: ChatMessage[]
  ready: boolean
}

let chats: Chat[] = []
const byId = new Map<string, Chat>()
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
    byId.set(chatId, { ...chat, messages: [...chat.messages, message] })
    publish()
  },
  remove(chatId: string) {
    if (!byId.delete(chatId)) return
    publish()
  },
  clear() {
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

function toLastSeen(value: number | string | null | undefined) {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    if (Number.isFinite(parsed) && parsed > 0) return parsed
  }
  return null
}
