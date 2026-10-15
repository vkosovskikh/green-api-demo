import { StatusDeliveredIcon, StatusReadIcon } from '../../assets/icons'
import type { MessageStatus } from '../../data/chatRepository'
import styles from './ChatItem.module.css'

type ChatItemProps = {
  name: string
  preview: string
  time?: string
  status?: MessageStatus
  avatarUrl?: string
  fallback?: string
  selected?: boolean
  onClick?: () => void
}

export function ChatItem({
  name,
  preview,
  time,
  status,
  avatarUrl,
  fallback,
  selected = false,
  onClick,
}: ChatItemProps) {
  const letter = (fallback ?? name).trim().charAt(0)

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
        ) : letter ? (
          <span className={styles.circle}>{letter}</span>
        ) : (
          <span className={`${styles.circle} ${styles.empty}`} />
        )}
      </span>
      <span className={styles.name}>{name}</span>
      <span className={styles.time}>
        <OutgoingMark status={status} />
        {time}
      </span>
      <span className={styles.preview}>{preview}</span>
    </button>
  )
}

function OutgoingMark({ status }: { status: MessageStatus | undefined }) {
  if (status === 'read') return <StatusReadIcon />
  if (status === 'delivered') return <StatusDeliveredIcon />
  if (status === 'sent') return <StatusDeliveredIcon className={styles.sent} />
  return null
}
