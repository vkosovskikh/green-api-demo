import type { ReactNode } from 'react'
import { SearchInput } from '../../ui-kit/SearchInput/SearchInput'
import { Title } from '../../ui-kit/Title/Title'
import styles from './PageContent.module.css'

type PageContentProps = {
  title: string
  children?: ReactNode
  query?: string
  onQueryChange?: (value: string) => void
  actions?: ReactNode
}

export function PageContent({ title, children, query, onQueryChange, actions }: PageContentProps) {
  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div className={styles.info}>
          <Title>{title}</Title>
        </div>
        {actions ? <div className={styles.actions}>{actions}</div> : null}
        {onQueryChange ? (
          <div className={styles.search}>
            <SearchInput placeholder="Найти" value={query} onChange={onQueryChange} />
          </div>
        ) : null}
      </header>
      <div className={styles.body}>{children}</div>
    </section>
  )
}
