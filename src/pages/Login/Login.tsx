import { useState, type SubmitEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { Dialog } from '../../ui-kit/Dialog/Dialog'
import { TextField } from '../../ui-kit/TextField/TextField'
import styles from './Login.module.css'

export function Login() {
  const { credentials, login } = useAuth()
  const navigate = useNavigate()
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')
  const ready = idInstance.trim().length > 0 && apiTokenInstance.trim().length > 0

  if (credentials) return <Navigate to="/" replace />

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!ready) return
    login({ idInstance: idInstance.trim(), apiTokenInstance: apiTokenInstance.trim() })
    navigate('/', { replace: true })
  }

  return (
    <div className={styles.page}>
      <div className={styles.pattern} />
      <Dialog
        open
        centered
        dismissible={false}
        title="Вход"
        actions={
          <button className={styles.submit} type="submit" form="login" disabled={!ready}>
            Войти
          </button>
        }
      >
        <form id="login" className={styles.form} onSubmit={submit}>
          <TextField
            label="idInstance"
            name="idInstance"
            value={idInstance}
            autoComplete="off"
            onChange={setIdInstance}
          />
          <TextField
            label="apiTokenInstance"
            name="apiTokenInstance"
            type="password"
            value={apiTokenInstance}
            autoComplete="off"
            onChange={setApiTokenInstance}
          />
        </form>
      </Dialog>
    </div>
  )
}
