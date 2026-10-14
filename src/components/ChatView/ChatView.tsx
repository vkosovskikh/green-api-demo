import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { findChat, type Message } from '../../data/chats'
import { ChatHeader } from './ChatHeader'
import styles from './ChatView.module.css'
import { Composer } from './Composer'
import { MessageList } from './MessageList'

export function ChatView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const chat = findChat(id)
  const [messages, setMessages] = useState<Message[]>(() => chat?.messages ?? [])
  const [draft, setDraft] = useState('')

  useEffect(() => {
    setMessages(chat?.messages ?? [])
    setDraft('')
  }, [chat])

  if (!chat) return <Navigate to="/" replace />

  const send = () => {
    const text = draft.trim()
    if (!text) return
    const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    setMessages((items) => [...items, { id: Date.now(), text, time, out: true, read: false }])
    setDraft('')
  }

  return (
    <section className={styles.view} aria-label={`Окно чата с ${chat.name}`}>
      <ChatHeader
        name={chat.name}
        status={chat.status}
        fallback={chat.fallback}
        onBack={() => navigate('/')}
      />
      <MessageList messages={messages} />
      <Composer value={draft} onChange={setDraft} onSend={send} />
    </section>
  )
}
