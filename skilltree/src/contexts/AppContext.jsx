import { createContext, useContext, useMemo, useState, useEffect } from 'react'
import { apiRequest, login as apiLogin, register as apiRegister, clearTokens, isLoggedIn, setCurrentUsername, getCurrentUsername } from '../api/client'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn())
  const [currentUser, setCurrentUser] = useState(() => {
    const username = getCurrentUsername()
    return username ? { username } : null
  })
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState(null)

  const [dashboard, setDashboard] = useState(null)
  const [dashboardLoading, setDashboardLoading] = useState(false)

  const [subjects, setSubjects] = useState([])
  const [subjectsLoading, setSubjectsLoading] = useState(false)

  const [onboarding, setOnboarding] = useState({
    learnerType: null,
    board: null,
    medium: null,
    className: null,
    stream: null,
    university: null,
    branch: null,
    semester: null,
    goalMode: null,
    completed: false,
  })
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  async function refreshDashboard() {
    setDashboardLoading(true)
    try {
      const data = await apiRequest('/dashboard/')
      setDashboard(data)
    } catch (err) {
      console.error('Failed to load dashboard', err)
    } finally {
      setDashboardLoading(false)
    }
  }

  async function refreshSubjects() {
    setSubjectsLoading(true)
    try {
      const data = await apiRequest('/subjects/')
      setSubjects(data)
    } catch (err) {
      console.error('Failed to load subjects', err)
    } finally {
      setSubjectsLoading(false)
    }
  }

  async function enrollInSubject(subjectId) {
    await apiRequest(`/subjects/${subjectId}/enroll/`, { method: 'POST' })
    await refreshSubjects()
  }

  useEffect(() => {
    if (isAuthenticated) {
      refreshDashboard()
      refreshSubjects()
    } else {
      setDashboard(null)
      setSubjects([])
    }
  }, [isAuthenticated])

  async function login(username, password) {
    setAuthLoading(true)
    setAuthError(null)
    try {
      await apiLogin(username, password)
      setCurrentUsername(username)
      setIsAuthenticated(true)
      setCurrentUser({ username })
      return true
    } catch (err) {
      setAuthError(err?.data?.detail || 'Login failed. Check your username and password.')
      return false
    } finally {
      setAuthLoading(false)
    }
  }

  async function register(username, email, password) {
    setAuthLoading(true)
    setAuthError(null)
    try {
      await apiRegister(username, email, password)
      return await login(username, password)
    } catch (err) {
      const detail = err?.data?.username?.[0] || err?.data?.password?.[0] || 'Registration failed.'
      setAuthError(detail)
      return false
    } finally {
      setAuthLoading(false)
    }
  }

  function logout() {
    clearTokens()
    setIsAuthenticated(false)
    setCurrentUser(null)
    setDashboard(null)
    setSubjects([])
  }

  const value = useMemo(
    () => ({
      isAuthenticated,
      currentUser,
      authLoading,
      authError,
      login,
      register,
      logout,
      dashboard,
      dashboardLoading,
      refreshDashboard,
      subjects,
      subjectsLoading,
      refreshSubjects,
      enrollInSubject,
      onboarding,
      setOnboarding,
      sidebarOpen,
      setSidebarOpen,
      mobileNavOpen,
      setMobileNavOpen,
    }),
    [isAuthenticated, currentUser, authLoading, authError, dashboard, dashboardLoading, subjects, subjectsLoading, onboarding, sidebarOpen, mobileNavOpen]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}