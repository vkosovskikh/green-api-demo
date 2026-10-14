import type { ReactNode } from 'react'
import styles from './Title.module.css'

type TitleProps = {
  children: ReactNode
  id?: string
  wrap?: boolean
}

export function Title({ children, id, wrap = false }: TitleProps) {
  return (
    <h2 className={wrap ? `${styles.title} ${styles.wrap}` : styles.title} id={id}>
      {children}
    </h2>
  )
}
