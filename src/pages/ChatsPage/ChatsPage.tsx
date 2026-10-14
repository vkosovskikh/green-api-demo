import { useRef, useState } from 'react'
import { useMatch, useNavigate } from 'react-router-dom'
import { CallByNumberIcon, PlusIcon } from '../../assets/icons'
import { ChatItem } from '../../components/ChatItem/ChatItem'
import { ChatList } from '../../components/ChatList/ChatList'
import { FindByPhoneDialog } from '../../components/FindByPhoneDialog/FindByPhoneDialog'
import { PhoneNotFoundDialog } from '../../components/PhoneNotFoundDialog/PhoneNotFoundDialog'
import { PageContent } from '../../components/PageContent/PageContent'
import { chats, findChat } from '../../data/chats'
import { IconButton } from '../../ui-kit/IconButton/IconButton'
import { Menu } from '../../ui-kit/Menu/Menu'

const startMenuId = 'start-chat-menu'

export function ChatsPage() {
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [phoneOpen, setPhoneOpen] = useState(false)
  const [missedPhone, setMissedPhone] = useState<string | null>(null)
  const plusRef = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()
  const match = useMatch('/:id')
  const selectedId = findChat(match?.params.id)?.id
  const normalizedQuery = query.trim().toLowerCase()
  const visibleChats = chats.filter((chat) => {
    if (!normalizedQuery) return true
    return (
      chat.name.toLowerCase().includes(normalizedQuery) ||
      chat.preview.toLowerCase().includes(normalizedQuery)
    )
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
        onClose={() => setPhoneOpen(false)}
        onSearch={(phone) => {
          setPhoneOpen(false)
          setMissedPhone(phone)
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
      <ChatList>
        {visibleChats.map((chat) => (
          <ChatItem
            key={chat.id}
            name={chat.name}
            preview={chat.preview}
            time={chat.time}
            fallback={chat.fallback}
            selected={chat.id === selectedId}
            onClick={() => navigate(`/${chat.id}`)}
          />
        ))}
      </ChatList>
    </PageContent>
  )
}
