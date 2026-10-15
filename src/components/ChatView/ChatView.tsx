import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { sendMessage } from '../../api/messages'
import { useAuth } from '../../auth/AuthContext'
import { chatRepository, formatLastSeen, useChat } from '../../data/chatRepository'
import { ChatHeader } from './ChatHeader'
import styles from './ChatView.module.css'
import { Composer } from './Composer'
import { MessageList } from './MessageList'

export function ChatView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { credentials } = useAuth()
  const chat = useChat(id)
  const [draft, setDraft] = useState('')
  const [draftChatId, setDraftChatId] = useState(chat?.chatId)
  if (chat?.chatId !== draftChatId) {
    setDraftChatId(chat?.chatId)
    setDraft('')
  }

  if (!chat) return <Navigate to="/" replace />

  const name = chat.ready ? chat.name : ''
  const avatar = chat.ready ? chat.avatar : ''
  const status = chat.ready ? formatLastSeen(chat.lastSeen) : ''

  const send = () => {
    const text = draft.trim()
    if (!text || !credentials) return
    const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    const localId = crypto.randomUUID()
    chatRepository.addMessage(chat.chatId, { id: localId, text, time, out: true, status: 'notSent' })
    setDraft('')
    void sendMessage(credentials.idInstance, credentials.apiTokenInstance, chat.chatId, text)
      .then((idMessage) => {
        if (!idMessage) return
        chatRepository.bindServerId(chat.chatId, localId, idMessage)
      })
      .catch(() => {
        chatRepository.releaseOutgoing(chat.chatId, localId)
      })
  }

  return (
    <section className={styles.view} aria-label={name ? `Окно чата с ${name}` : 'Окно чата'}>
      <ChatHeader name={name} status={status} avatar={avatar} onBack={() => navigate('/')} />
      <MessageList messages={chat.messages} />
      <Composer value={draft} onChange={setDraft} onSend={send} />
    </section>
  )
}
