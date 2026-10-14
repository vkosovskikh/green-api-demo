import { Dialog } from '../../ui-kit/Dialog/Dialog'
import styles from './PhoneNotFoundDialog.module.css'

type PhoneNotFoundDialogProps = {
  open: boolean
  phone: string
  onClose: () => void
  onClick: () => void
}

export function PhoneNotFoundDialog({ open, phone, onClose, onClick }: PhoneNotFoundDialogProps) {
  return (
    <Dialog
      open={open}
      title={`Не нашли номер ${phone}`}
      description="Отправьте ссылку‑приглашение на чат с вами"
      onClose={onClose}
      actions={
        <button className={styles.another} type="button" onClick={onClick}>
          Найти другой номер
        </button>
      }
    >
      <div className={styles.space} />
    </Dialog>
  )
}
