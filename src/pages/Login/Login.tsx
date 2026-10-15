import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, type SubmitEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { stateInstanceOptions } from '../../api/account'
import { useAuth, type Credentials } from '../../auth/AuthContext'
import { Dialog } from '../../ui-kit/Dialog/Dialog'
import { TextField } from '../../ui-kit/TextField/TextField'
import styles from './Login.module.css'

export function Login() {
  const { credentials, login } = useAuth()
  const navigate = useNavigate()
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')
  const queryClient = useQueryClient()
  const ready = idInstance.trim().length > 0 && apiTokenInstance.trim().length > 0
  const stateInstance = useMutation({
    mutationFn: (next: Credentials) =>
      queryClient.query(stateInstanceOptions(next.idInstance, next.apiTokenInstance)),
    onSuccess: (data, next) => {
      console.log(data)
      if (data.stateInstance !== 'authorized') return
      login(next)
      navigate('/', { replace: true })
    },
  })
  const unauthorized =
    stateInstance.isError || (stateInstance.isSuccess && stateInstance.data.stateInstance !== 'authorized')

  if (credentials) return <Navigate to="/" replace />

  const changeIdInstance = (value: string) => {
    setIdInstance(value)
    stateInstance.reset()
  }

  const changeApiTokenInstance = (value: string) => {
    setApiTokenInstance(value)
    stateInstance.reset()
  }

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!ready || stateInstance.isPending) return
    stateInstance.mutate({
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
    })
  }

  return (
    <div className={styles.page}>
      <div className={styles.pattern} />
      <Dialog
        open
        dismissible={false}
        title="Вход"
        actions={
          <button className={styles.submit} type="submit" form="login" disabled={!ready || stateInstance.isPending}>
            Войти
          </button>
        }
      >
        {unauthorized ? (
          <ul className={styles.errors}>
            <li>instance не авторизован</li>
          </ul>
        ) : null}
        <form id="login" className={styles.form} onSubmit={submit}>
          <TextField
            label="idInstance"
            name="idInstance"
            value={idInstance}
            autoComplete="off"
            onChange={changeIdInstance}
          />
          <TextField
            label="apiTokenInstance"
            name="apiTokenInstance"
            type="password"
            value={apiTokenInstance}
            autoComplete="off"
            onChange={changeApiTokenInstance}
          />
        </form>
      </Dialog>
    </div>
  )
}
