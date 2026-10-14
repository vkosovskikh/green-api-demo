import { useEffect, useRef, useState, type SubmitEvent } from 'react'
import flagRu from '../../assets/flag-ru.webp'
import { Dialog } from '../../ui-kit/Dialog/Dialog'
import styles from './FindByPhoneDialog.module.css'

type FindByPhoneDialogProps = {
  open: boolean
  onClose: () => void
  onSearch: (phone: string) => void
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

export function FindByPhoneDialog({ open, onClose, onSearch }: FindByPhoneDialogProps) {
  const [digits, setDigits] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const ready = digits.length === 10

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
  }, [open])

  const close = () => {
    setDigits('')
    onClose()
  }

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!ready) return
    const phone = `+7${digits}`
    setDigits('')
    onSearch(phone)
  }

  return (
    <Dialog
      open={open}
      title="Найти по номеру"
      onClose={close}
      actions={
        <button className={styles.submit} type="submit" form="find-by-phone" disabled={!ready}>
          Найти в MAX
        </button>
      }
    >
      <form id="find-by-phone" onSubmit={submit}>
        <div className={styles.field}>
          <span className={styles.prefix}>
            <img className={styles.flag} src={flagRu} alt="" draggable={false} />
            +7
          </span>
          <input
            ref={inputRef}
            className={styles.input}
            type="text"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="123 456 78 90"
            value={formatPhone(digits)}
            onChange={(event) => setDigits(digitsOnly(event.target.value))}
          />
        </div>
      </form>
    </Dialog>
  )
}
