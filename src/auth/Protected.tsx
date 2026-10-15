import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function Protected({ children }: { children: ReactNode }) {
  const { credentials } = useAuth()
  if (!credentials) return <Navigate to="/login" replace />
  return children
}
