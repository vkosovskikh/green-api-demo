import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type Credentials = {
  idInstance: string
  apiTokenInstance: string
}

type AuthContextValue = {
  credentials: Credentials | null
  login: (credentials: Credentials) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [credentials, setCredentials] = useState<Credentials | null>(null)
  const value = useMemo<AuthContextValue>(
    () => ({
      credentials,
      login: setCredentials,
      logout: () => setCredentials(null),
    }),
    [credentials],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used within AuthProvider')
  return value
}
