import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Title } from '../Title/Title'
import styles from './Dialog.module.css'

type DialogProps = {
  open: boolean
  title: string
  description?: string
  onClose?: () => void
  dismissible?: boolean
  children: ReactNode
  actions?: ReactNode
}

export function Dialog({
  open,
  title,
  description,
  onClose,
  dismissible = true,
  children,
  actions,
}: DialogProps) {
  useEffect(() => {
    if (!open || !dismissible || !onClose) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, dismissible, onClose])

  if (!open) return null

  const overlayClass = [styles.overlay, dismissible ? '' : styles.locked]
    .filter(Boolean)
    .join(' ')

  return createPortal(
    <div
      className={overlayClass}
      onMouseDown={(event) => {
        if (!dismissible || !onClose) return
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className={styles.panel} role="dialog" aria-modal="true" aria-label={title}>
        <div className={styles.header}>
          <Title wrap>{title}</Title>
          {description ? <p className={styles.description}>{description}</p> : null}
        </div>
        <div className={styles.body}>{children}</div>
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>
    </div>,
    document.body,
  )
}
