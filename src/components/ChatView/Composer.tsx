import { type KeyboardEvent, type SubmitEvent } from 'react'
import { SendIcon } from '../../assets/icons'
import styles from './ChatView.module.css'

type ComposerProps = {
  value: string
  onChange: (value: string) => void
  onSend: () => void
}

export function Composer({ value, onChange, onSend }: ComposerProps) {
  const canSend = value.trim().length > 0

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSend) return
    onSend()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey) return
    event.preventDefault()
    if (canSend) onSend()
  }

  return (
    <form className={styles.composer} onSubmit={submit}>
      <div className={styles.field}>
        <textarea
          className={styles.input}
          rows={1}
          placeholder="Сообщение"
          aria-label="Сообщение"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
        />
        <button className={styles.send} type="submit" aria-label="Отправить сообщение" disabled={!canSend}>
          <SendIcon />
        </button>
      </div>
    </form>
  )
}
