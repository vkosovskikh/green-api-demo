import { useState } from 'react'
import { Outlet, useMatch, useNavigate } from 'react-router-dom'
import { useChat } from '../../data/chatRepository'
import { NotificationLoop } from '../../notifications/NotificationLoop'
import { Navigation, type NavItem } from '../../ui-kit/Navigation/Navigation'
import { ChatsPage } from '../ChatsPage/ChatsPage'
import styles from './Home.module.css'
import { SettingsPage } from '../SettingsPage/SettingsPage'

const folders: NavItem[] = [{ id: 'all', label: 'Все', icon: 'message' }]

const footer: NavItem[] = [{ id: 'settings', label: 'Настройки', icon: 'settings' }]

export function Home() {
  const navigate = useNavigate()
  const match = useMatch('/:id')
  const chatOpen = Boolean(useChat(match?.params.id))
  const [section, setSection] = useState<'all' | 'settings'>('all')

  return (
    <div className={chatOpen ? `${styles.shell} ${styles.shellChat}` : styles.shell}>
      <NotificationLoop />
      <div className={styles.nav}>
        <Navigation
          items={folders}
          footerItems={footer}
          activeId={section}
          onSelect={(id) => {
            const next = id === 'settings' ? 'settings' : 'all'
            setSection(next)
            if (chatOpen) navigate('/')
          }}
        />
      </div>
      <div className={styles.content}>
        {section === 'settings' ? <SettingsPage /> : <ChatsPage />}
      </div>
      <div className={styles.chat}>
        <div className={styles.pattern} />
        <Outlet />
      </div>
    </div>
  )
}
