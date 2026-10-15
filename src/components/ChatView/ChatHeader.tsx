import { ArrowLeftIcon } from '../../assets/icons'
import styles from './ChatView.module.css'

type ChatHeaderProps = {
  name: string
  status: string
  avatar: string
  onBack: () => void
}

export function ChatHeader({ name, status, avatar, onBack }: ChatHeaderProps) {
  const letter = name.trim().charAt(0)

  return (
    <header className={styles.header}>
      <button className={styles.back} type="button" aria-label="Перейти назад" onClick={onBack}>
        <ArrowLeftIcon />
      </button>
      <div className={styles.peer}>
        {avatar ? (
          <img className={styles.avatarPhoto} src={avatar} alt="" />
        ) : (
          <span className={letter ? styles.avatar : `${styles.avatar} ${styles.avatarEmpty}`}>{letter}</span>
        )}
        <span className={styles.titles}>
          <span className={styles.name}>{name}</span>
          <span className={styles.status}>{status}</span>
        </span>
      </div>
    </header>
  )
}
