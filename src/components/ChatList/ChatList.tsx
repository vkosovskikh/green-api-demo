import type { ReactNode } from 'react'
import styles from './ChatList.module.css'

type ChatListProps = {
  children: ReactNode
}

export function ChatList({ children }: ChatListProps) {
  return <div className={styles.list}>{children}</div>
}
