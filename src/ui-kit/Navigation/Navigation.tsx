import { NavIcon, type NavIconName } from './icons'
import styles from './Navigation.module.css'

export type NavItem = {
  id: string
  label: string
  icon: NavIconName
  show?: 'wide' | 'narrow'
}

type NavigationProps = {
  items: NavItem[]
  secondaryItems?: NavItem[]
  footerItems: NavItem[]
  activeId: string
  onSelect: (id: string) => void
}

function NavButton({
  item,
  active,
  onSelect,
}: {
  item: NavItem
  active: boolean
  onSelect: (id: string) => void
}) {
  const visibility =
    item.show === 'wide' ? styles.wideOnly : item.show === 'narrow' ? styles.narrowOnly : undefined

  return (
    <div className={visibility ? `${styles.item} ${visibility}` : styles.item}>
      <button
        className={active ? `${styles.button} ${styles.buttonActive}` : styles.button}
        type="button"
        aria-current={active ? 'page' : undefined}
        onClick={() => onSelect(item.id)}
      >
        <span className={styles.icon}>
          <NavIcon name={item.icon} />
        </span>
        <span className={styles.label}>{item.label}</span>
      </button>
    </div>
  )
}

export function Navigation({
  items,
  secondaryItems = [],
  footerItems,
  activeId,
  onSelect,
}: NavigationProps) {
  return (
    <nav className={styles.nav} aria-label="Папки и профиль">
      <div className={`${styles.group} ${styles.primary}`}>
        {items.map((item) => (
          <NavButton key={item.id} item={item} active={item.id === activeId} onSelect={onSelect} />
        ))}
      </div>
      <div className={styles.separator} />
      <div className={styles.bottom}>
        {secondaryItems.map((item) => (
          <NavButton key={item.id} item={item} active={item.id === activeId} onSelect={onSelect} />
        ))}
        <div className={styles.footer}>
          {footerItems.map((item) => (
            <NavButton key={item.id} item={item} active={item.id === activeId} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </nav>
  )
}
