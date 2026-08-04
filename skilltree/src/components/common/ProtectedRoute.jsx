import { Navigate } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useApp()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}