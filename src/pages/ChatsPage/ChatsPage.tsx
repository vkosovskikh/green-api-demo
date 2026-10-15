import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMatch, useNavigate } from 'react-router-dom'
import { checkAccount, contactInfoOptions } from '../../api/service'
import { CallByNumberIcon, PlusIcon } from '../../assets/icons'
import { useAuth } from '../../auth/AuthContext'
import { ChatItem } from '../../components/ChatItem/ChatItem'
import { ChatList } from '../../components/ChatList/ChatList'
import { FindByPhoneDialog } from '../../components/FindByPhoneDialog/FindByPhoneDialog'
import { PhoneNotFoundDialog } from '../../components/PhoneNotFoundDialog/PhoneNotFoundDialog'
import { PageContent } from '../../components/PageContent/PageContent'
import { chatRepository, useChats } from '../../data/chatRepository'
import { IconButton } from '../../ui-kit/IconButton/IconButton'
import { Menu } from '../../ui-kit/Menu/Menu'

const startMenuId = 'start-chat-menu'

function ChatContactLoader({
  chatId,
  idInstance,
  apiTokenInstance,
}: {
  chatId: string
  idInstance: string
  apiTokenInstance: string
}) {
  const contact = useQuery(contactInfoOptions(idInstance, apiTokenInstance, chatId))

  useEffect(() => {
    if (!contact.isFetching) return
    chatRepository.pending(chatId)
  }, [chatId, contact.isFetching])

  useEffect(() => {
    if (contact.isFetching || !contact.isSuccess) return
    chatRepository.setContact(chatId, contact.data)
  }, [chatId, contact.data, contact.isFetching, contact.isSuccess])

  useEffect(() => {
    if (!contact.isError) return
    chatRepository.remove(chatId)
  }, [chatId, contact.isError])

  return null
}

export function ChatsPage() {
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [phoneOpen, setPhoneOpen] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const [missedPhone, setMissedPhone] = useState<string | null>(null)
  const plusRef = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()
  const { credentials } = useAuth()
  const chats = useChats()
  const match = useMatch('/:id')
  const selectedId = match?.params.id
  const normalizedQuery = query.trim().toLowerCase()
  const visibleChats = chats.filter((chat) => {
    if (!normalizedQuery) return true
    return chat.name.toLowerCase().includes(normalizedQuery)
  })
  const search = useMutation({
    mutationFn: (phone: string) => {
      if (!credentials) throw new Error('unauthorized')
      return checkAccount(credentials.idInstance, credentials.apiTokenInstance, Number(phone.replace(/\D/g, '')))
    },
    onSuccess: (result, phone) => {
      if ('message' in result) {
        setPhoneError(result.message)
        return
      }
      setPhoneError('')
      setPhoneOpen(false)
      if (!result.exist) {
        setMissedPhone(phone)
        return
      }
      chatRepository.add(result.chatId)
      navigate(`/${encodeURIComponent(result.chatId)}`)
    },
  })

  return (
    <PageContent
      title="Чаты"
      query={query}
      onQueryChange={setQuery}
      actions={
        <IconButton
          ref={plusRef}
          label="Начать общение"
          expanded={menuOpen}
          controls={startMenuId}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <PlusIcon />
        </IconButton>
      }
    >
      <Menu
        id={startMenuId}
        open={menuOpen}
        anchorRef={plusRef}
        onClose={() => setMenuOpen(false)}
        items={[
          {
            id: 'find-by-phone',
            label: 'Найти по номеру',
            icon: <CallByNumberIcon />,
            onSelect: () => {
              setMenuOpen(false)
              setPhoneOpen(true)
            },
          },
        ]}
      />
      <FindByPhoneDialog
        open={phoneOpen}
        pending={search.isPending}
        error={phoneError}
        onClose={() => {
          setPhoneOpen(false)
          setPhoneError('')
        }}
        onDismissError={() => setPhoneError('')}
        onSearch={(phone) => {
          setPhoneError('')
          search.mutate(phone)
        }}
      />
      <PhoneNotFoundDialog
        open={missedPhone !== null}
        phone={missedPhone ?? ''}
        onClose={() => setMissedPhone(null)}
        onClick={() => {
          setMissedPhone(null)
          setPhoneOpen(true)
        }}
      />
      {credentials
        ? chats.map((chat) => (
            <ChatContactLoader
              key={chat.chatId}
              chatId={chat.chatId}
              idInstance={credentials.idInstance}
              apiTokenInstance={credentials.apiTokenInstance}
            />
          ))
        : null}
      <ChatList>
        {visibleChats.map((chat) => {
          const ready = chat.ready
          const lastMessage = chat.messages.at(-1)
          return (
            <ChatItem
              key={chat.chatId}
              name={ready ? chat.name : ''}
              preview={lastMessage?.text ?? ''}
              time={lastMessage?.time ?? ''}
              status={lastMessage?.out ? lastMessage.status : undefined}
              avatarUrl={ready && chat.avatar ? chat.avatar : undefined}
              fallback={ready ? chat.name.trim().charAt(0) : ''}
              selected={chat.chatId === selectedId}
              onClick={() => navigate(`/${encodeURIComponent(chat.chatId)}`)}
            />
          )
        })}
      </ChatList>
    </PageContent>
  )
}
