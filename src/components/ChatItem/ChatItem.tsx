import styles from './ChatItem.module.css'

type ChatItemProps = {
  name: string
  preview: string
  time?: string
  avatarUrl?: string
  fallback?: string
  selected?: boolean
  onClick?: () => void
}

export function ChatItem({
  name,
  preview,
  time,
  avatarUrl,
  fallback,
  selected = false,
  onClick,
}: ChatItemProps) {
  const letter = fallback ?? name.trim().charAt(0)

  return (
    <button
      className={selected ? `${styles.item} ${styles.selected}` : styles.item}
      type="button"
      aria-current={selected ? 'true' : undefined}
      onClick={onClick}
    >
      <span className={styles.avatar}>
        {avatarUrl ? (
          <img className={styles.photo} src={avatarUrl} alt="" />
        ) : (
          <span className={styles.circle}>{letter}</span>
        )}
      </span>
      <span className={styles.name}>{name}</span>
      {time ? <span className={styles.time}>{time}</span> : <span className={styles.time} />}
      <span className={styles.preview}>{preview}</span>
    </button>
  )
}
