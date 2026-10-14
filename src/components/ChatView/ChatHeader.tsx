import { ArrowLeftIcon } from '../../assets/icons'
import styles from './ChatView.module.css'

type ChatHeaderProps = {
  name: string
  status: string
  fallback: string
  onBack: () => void
}

export function ChatHeader({ name, status, fallback, onBack }: ChatHeaderProps) {
  return (
    <header className={styles.header}>
      <button className={styles.back} type="button" aria-label="Перейти назад" onClick={onBack}>
        <ArrowLeftIcon />
      </button>
      <div className={styles.peer}>
        <span className={styles.avatar}>{fallback}</span>
        <span className={styles.titles}>
          <span className={styles.name}>{name}</span>
          <span className={styles.status}>{status}</span>
        </span>
      </div>
    </header>
  )
}
