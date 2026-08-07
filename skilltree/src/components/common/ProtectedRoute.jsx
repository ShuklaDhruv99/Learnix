import { Navigate } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isDemoMode } = useApp()
  if (!isAuthenticated && !isDemoMode) return <Navigate to="/" replace />
  return children
}