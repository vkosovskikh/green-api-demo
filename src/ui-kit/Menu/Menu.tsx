import { useEffect, useLayoutEffect, useState, type ReactNode, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import styles from './Menu.module.css'

export type MenuItem = {
  id: string
  label: string
  icon?: ReactNode
  onSelect: () => void
}

type MenuProps = {
  id: string
  open: boolean
  anchorRef: RefObject<HTMLElement | null>
  items: MenuItem[]
  onClose: () => void
}

type MenuPosition = {
  top: number
  left: number
}

export function Menu({ id, open, anchorRef, items, onClose }: MenuProps) {
  const [position, setPosition] = useState<MenuPosition | null>(null)

  useLayoutEffect(() => {
    if (!open) return

    const update = () => {
      const anchor = anchorRef.current
      if (!anchor) return
      const rect = anchor.getBoundingClientRect()
      setPosition({ top: rect.bottom + 10, left: rect.right })
    }

    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open, anchorRef])

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (anchorRef.current?.contains(target)) return
      const menu = document.getElementById(id)
      if (menu?.contains(target)) return
      onClose()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, anchorRef, id, onClose])

  if (!open || !position) return null

  return createPortal(
    <div id={id} className={styles.menu} role="menu" style={{ top: position.top, left: position.left }}>
      {items.map((item) => (
        <button
          key={item.id}
          className={styles.item}
          type="button"
          role="menuitem"
          onClick={item.onSelect}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </div>,
    document.body,
  )
}
