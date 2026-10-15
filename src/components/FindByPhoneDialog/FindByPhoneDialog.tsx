import { useEffect, useRef, useState, type SubmitEvent } from 'react'
import flagRu from '../../assets/flag-ru.webp'
import { Dialog } from '../../ui-kit/Dialog/Dialog'
import { TextField } from '../../ui-kit/TextField/TextField'
import styles from './FindByPhoneDialog.module.css'

type FindByPhoneDialogProps = {
  open: boolean
  pending?: boolean
  error?: string
  onClose: () => void
  onSearch: (phone: string) => void
  onDismissError?: () => void
}

function digitsOnly(value: string) {
  let digits = value.replace(/\D/g, '')
  if (digits.length > 10 && digits.startsWith('7')) digits = digits.slice(1)
  return digits.slice(0, 10)
}

function formatPhone(digits: string) {
  return [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 8), digits.slice(8, 10)]
    .filter((part) => part.length > 0)
    .join(' ')
}

export function FindByPhoneDialog({
  open,
  pending = false,
  error,
  onClose,
  onSearch,
  onDismissError,
}: FindByPhoneDialogProps) {
  const [digits, setDigits] = useState('')
  const [wasOpen, setWasOpen] = useState(open)
  const inputRef = useRef<HTMLInputElement>(null)
  const ready = digits.length === 10

  if (open !== wasOpen) {
    setWasOpen(open)
    if (!open) setDigits('')
  }

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
  }, [open])

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!ready || pending) return
    onSearch(`+7${digits}`)
  }

  return (
    <Dialog
      open={open}
      title="Найти по номеру"
      onClose={onClose}
      actions={
        <button className={styles.submit} type="submit" form="find-by-phone" disabled={!ready || pending}>
          Найти в MAX
        </button>
      }
    >
      {error ? (
        <ul className={styles.errors}>
          <li>{error}</li>
        </ul>
      ) : null}
      <form id="find-by-phone" onSubmit={submit}>
        <TextField
          ref={inputRef}
          name="phone"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="123 456 78 90"
          value={formatPhone(digits)}
          onChange={(value) => {
            setDigits(digitsOnly(value))
            if (error) onDismissError?.()
          }}
          prefix={
            <>
              <img className={styles.flag} src={flagRu} alt="" draggable={false} />
              +7
            </>
          }
        />
      </form>
    </Dialog>
  )
}
