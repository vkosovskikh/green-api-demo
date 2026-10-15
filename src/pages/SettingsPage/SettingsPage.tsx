import { useAuth } from '../../auth/AuthContext'
import { PageContent } from '../../components/PageContent/PageContent'
import styles from './SettingsPage.module.css'

const maskedToken = '******'

export function SettingsPage() {
  const { credentials, logout } = useAuth()
  if (!credentials) return null

  return (
    <PageContent title="Настройки">
      <div className={styles.credentials}>
        <div className={styles.item}>
          <span className={styles.name}>idInstance</span>
          <span className={styles.value}>{credentials.idInstance}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.name}>apiTokenInstance</span>
          <span className={styles.value}>{maskedToken}</span>
        </div>
        <button className={styles.logout} type="button" onClick={logout}>
          Выйти
        </button>
      </div>
    </PageContent>
  )
}
