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

  const [resources, setResources] = useState([])
  const [bookmarks, setBookmarks] = useState([])

  const [achievements, setAchievements] = useState([])
  const [leaderboard, setLeaderboard] = useState([])

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

  async function refreshResources() {
    try {
      const data = await apiRequest('/resources/')
      setResources(data)
    } catch (err) {
      console.error('Failed to load resources', err)
    }
  }

  async function refreshBookmarks() {
    try {
      const data = await apiRequest('/bookmarks/')
      setBookmarks(data)
    } catch (err) {
      console.error('Failed to load bookmarks', err)
    }
  }

  async function refreshAchievements() {
    try {
      const data = await apiRequest('/achievements/')
      setAchievements(data)
    } catch (err) {
      console.error('Failed to load achievements', err)
    }
  }

  async function refreshLeaderboard() {
    try {
      const data = await apiRequest('/leaderboard/')
      setLeaderboard(data)
    } catch (err) {
      console.error('Failed to load leaderboard', err)
    }
  }

  async function toggleBookmark(resourceId) {
    const existing = bookmarks.find((b) => b.resource === resourceId)
    if (existing) {
      await apiRequest(`/bookmarks/${existing.id}/`, { method: 'DELETE' })
    } else {
      await apiRequest('/bookmarks/', { method: 'POST', body: { resource: resourceId } })
    }
    await Promise.all([refreshResources(), refreshBookmarks()])
  }

  async function enrollInSubject(subjectId) {
    await apiRequest(`/subjects/${subjectId}/enroll/`, { method: 'POST' })
    await refreshSubjects()
  }

  async function fetchTopics(subjectId) {
    return apiRequest(`/subjects/${subjectId}/topics/`)
  }

  async function completeTopic(topicId) {
    const result = await apiRequest(`/topics/${topicId}/complete/`, { method: 'POST' })
    await refreshDashboard()
    await refreshSubjects()
    await refreshAchievements()
    await refreshLeaderboard()
    return result
  }

  async function generateSyllabus(file) {
    const formData = new FormData()
    formData.append('file', file)
    const result = await apiRequest('/syllabus/generate/', { method: 'POST', body: formData, isFormData: true })
    await refreshSubjects()
    return result
  }

  useEffect(() => {
    if (isAuthenticated) {
      refreshDashboard()
      refreshSubjects()
      refreshResources()
      refreshBookmarks()
      refreshAchievements()
      refreshLeaderboard()
    } else {
      setDashboard(null)
      setSubjects([])
      setResources([])
      setBookmarks([])
      setAchievements([])
      setLeaderboard([])
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
    setResources([])
    setBookmarks([])
    setAchievements([])
    setLeaderboard([])
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
      fetchTopics,
      completeTopic,
      resources,
      bookmarks,
      refreshResources,
      refreshBookmarks,
      toggleBookmark,
      achievements,
      refreshAchievements,
      leaderboard,
      refreshLeaderboard,
      generateSyllabus,
      onboarding,
      setOnboarding,
      sidebarOpen,
      setSidebarOpen,
      mobileNavOpen,
      setMobileNavOpen,
    }),
    [
      isAuthenticated,
      currentUser,
      authLoading,
      authError,
      dashboard,
      dashboardLoading,
      subjects,
      subjectsLoading,
      resources,
      bookmarks,
      achievements,
      leaderboard,
      onboarding,
      sidebarOpen,
      mobileNavOpen,
    ]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}