import { createContext, useContext, useMemo, useState, useEffect } from 'react'
import { apiRequest, login as apiLogin, register as apiRegister, clearTokens, isLoggedIn, setCurrentUsername, getCurrentUsername } from '../api/client'
import { demoGuard } from '../components/common/demoGuard'
import {
  demoUsername, demoMyProfile, demoDashboard, demoSubjects, demoTopicsBySubject,
  demoResources, demoBookmarks, demoAchievements, demoLeaderboard, demoAnalytics,
  demoTutorial, demoQuizQuestions, demoCodePracticeQuestions, demoChatHistory,
} from '../data/demoData'

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
  const [analytics, setAnalytics] = useState(null)
  const [myProfile, setMyProfile] = useState(null)

  // ---- Demo mode ----
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [demoNotice, setDemoNotice] = useState(null)

  function enterDemoMode() {
    clearTokens()
    setIsAuthenticated(false)
    setIsDemoMode(true)
    setCurrentUser({ username: demoUsername })
    setDashboard(demoDashboard)
    setSubjects(demoSubjects)
    setResources(demoResources)
    setBookmarks(demoBookmarks)
    setAchievements(demoAchievements)
    setLeaderboard(demoLeaderboard)
    setAnalytics(demoAnalytics)
    setMyProfile(demoMyProfile)
  }

  function exitDemoMode() {
    setIsDemoMode(false)
    setCurrentUser(null)
    setDashboard(null)
    setSubjects([])
    setResources([])
    setBookmarks([])
    setAchievements([])
    setLeaderboard([])
    setAnalytics(null)
    setMyProfile(null)
  }

  function dismissDemoNotice() {
    setDemoNotice(null)
  }

  async function refreshMyProfile() {
    if (isDemoMode) return
    try {
      const data = await apiRequest('/my-profile/')
      setMyProfile(data)
    } catch (err) {
      console.error('Failed to load profile details', err)
    }
  }
  async function refreshAnalytics() {
    if (isDemoMode) return
    try {
      const data = await apiRequest('/analytics/')
      setAnalytics(data)
    } catch (err) {
      console.error('Failed to load analytics', err)
    }
  }
  async function refreshDashboard() {
    if (isDemoMode) return
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
    if (isDemoMode) return
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
    if (isDemoMode) return
    try {
      const data = await apiRequest('/resources/')
      setResources(data)
    } catch (err) {
      console.error('Failed to load resources', err)
    }
  }
  async function refreshBookmarks() {
    if (isDemoMode) return
    try {
      const data = await apiRequest('/bookmarks/')
      setBookmarks(data)
    } catch (err) {
      console.error('Failed to load bookmarks', err)
    }
  }
  async function refreshAchievements() {
    if (isDemoMode) return
    try {
      const data = await apiRequest('/achievements/')
      setAchievements(data)
    } catch (err) {
      console.error('Failed to load achievements', err)
    }
  }
  async function refreshLeaderboard() {
    if (isDemoMode) return
    try {
      const data = await apiRequest('/leaderboard/')
      setLeaderboard(data)
    } catch (err) {
      console.error('Failed to load leaderboard', err)
    }
  }

  async function toggleBookmark(resourceId) {
    demoGuard(isDemoMode, setDemoNotice)
    const existing = bookmarks.find((b) => b.resource === resourceId)
    if (existing) {
      await apiRequest(`/bookmarks/${existing.id}/`, { method: 'DELETE' })
    } else {
      await apiRequest('/bookmarks/', { method: 'POST', body: { resource: resourceId } })
    }
    await Promise.all([refreshResources(), refreshBookmarks()])
  }

  async function enrollInSubject(subjectId) {
    demoGuard(isDemoMode, setDemoNotice)
    await apiRequest(`/subjects/${subjectId}/enroll/`, { method: 'POST' })
    await refreshSubjects()
  }

  async function fetchTopics(subjectId) {
    if (isDemoMode) return demoTopicsBySubject[subjectId] || []
    return apiRequest(`/subjects/${subjectId}/topics/`)
  }

  async function fetchAllMyTopics() {
    const enrolledSubjects = subjects.filter((s) => s.is_enrolled)
    const topicLists = await Promise.all(enrolledSubjects.map((s) => fetchTopics(s.id)))
    return topicLists.flatMap((topics, i) =>
      topics.map((t) => ({ ...t, subjectName: enrolledSubjects[i].name }))
    )
  }

  async function completeTopic(topicId) {
    demoGuard(isDemoMode, setDemoNotice)
    const result = await apiRequest(`/topics/${topicId}/complete/`, { method: 'POST' })
    await refreshDashboard()
    await refreshSubjects()
    await refreshAchievements()
    await refreshLeaderboard()
    return result
  }

  async function logStudySession(topicId, minutes) {
    demoGuard(isDemoMode, setDemoNotice)
    const today = new Date().toISOString().split('T')[0]
    await apiRequest('/study-sessions/', {
      method: 'POST',
      body: { topic: topicId, minutes, date: today },
    })
    await refreshDashboard()
    await refreshSubjects()
  }

  async function fetchTopicResources(topicId) {
    demoGuard(isDemoMode, setDemoNotice)
    return apiRequest(`/topics/${topicId}/fetch-resources/`, { method: 'POST' })
  }

  async function getTopicResources(topicId) {
    if (isDemoMode) {
      const matches = demoResources.filter((r) => r.topic === topicId)
      return matches.length > 0 ? matches : demoResources
    }
    return apiRequest(`/topics/${topicId}/resources/`)
  }

  async function generateQuiz(topicId, numQuestions = 5) {
    if (isDemoMode) return { topic_id: topicId, questions: demoQuizQuestions }
    return apiRequest(`/topics/${topicId}/generate-quiz/`, {
      method: 'POST',
      body: { num_questions: numQuestions },
    })
  }

  async function submitQuizAttempt(topicId, score, totalQuestions) {
    if (isDemoMode) return { id: 0, topic: topicId, score, total_questions: totalQuestions }
    return apiRequest('/quiz-attempts/', {
      method: 'POST',
      body: { topic: topicId, score, total_questions: totalQuestions },
    })
  }

  async function generateSyllabus(file) {
    demoGuard(isDemoMode, setDemoNotice)
    const formData = new FormData()
    formData.append('file', file)
    const result = await apiRequest('/syllabus/generate/', { method: 'POST', body: formData, isFormData: true })
    await refreshSubjects()
    return result
  }

  async function getTopicChat(topicId) {
    if (isDemoMode) return demoChatHistory
    return apiRequest(`/topics/${topicId}/chat/`)
  }

  async function sendTopicChatMessage(topicId, message) {
    demoGuard(isDemoMode, setDemoNotice)
    return apiRequest(`/topics/${topicId}/chat/`, { method: 'POST', body: { message } })
  }

  async function clearTopicChat(topicId) {
    if (isDemoMode) return { cleared: true }
    return apiRequest(`/topics/${topicId}/chat/clear/`, { method: 'DELETE' })
  }

  async function getTopicSummary(topicId) {
    if (isDemoMode) return demoTutorial
    return apiRequest(`/topics/${topicId}/generate-summary/`, { method: 'POST' })
  }

  async function generateCodePractice(topicId, numQuestions = 5) {
    if (isDemoMode) return { topic_id: topicId, questions: demoCodePracticeQuestions }
    return apiRequest(`/topics/${topicId}/generate-code-practice/`, {
      method: 'POST',
      body: { num_questions: numQuestions },
    })
  }

  async function reviewCodeAttempt(problemStatement, solutionCode, userCode) {
    demoGuard(isDemoMode, setDemoNotice)
    return apiRequest('/review-code-attempt/', {
      method: 'POST',
      body: { problem_statement: problemStatement, solution_code: solutionCode, user_code: userCode },
    })
  }

  useEffect(() => {
    if (isAuthenticated) {
      refreshDashboard()
      refreshSubjects()
      refreshResources()
      refreshBookmarks()
      refreshAchievements()
      refreshLeaderboard()
      refreshAnalytics()
      refreshMyProfile()
    } else if (!isDemoMode) {
      setDashboard(null)
      setSubjects([])
      setResources([])
      setBookmarks([])
      setAchievements([])
      setLeaderboard([])
      setAnalytics(null)
      setMyProfile(null)
    }
  }, [isAuthenticated])

  async function login(username, password) {
    setAuthLoading(true)
    setAuthError(null)
    setIsDemoMode(false)
    setDashboard(null)
    setSubjects([])
    setResources([])
    setBookmarks([])
    setAchievements([])
    setLeaderboard([])
    setAnalytics(null)
    try {
      await apiLogin(username, password)
      setCurrentUsername(username)
      setIsAuthenticated(true)
      setCurrentUser({ username })
      await Promise.all([
        refreshDashboard(),
        refreshSubjects(),
        refreshResources(),
        refreshBookmarks(),
        refreshAchievements(),
        refreshLeaderboard(),
        refreshAnalytics(),
      ])
      return true
    } catch (err) {
      setAuthError(err?.data?.detail || 'Login failed. Check your username and password.')
      return false
    } finally {
      setAuthLoading(false)
    }
  }

  async function submitOnboarding(payload) {
    return apiRequest('/onboarding/', { method: 'PATCH', body: payload })
  }

  async function register(username, email, password) {
    setAuthLoading(true)
    setAuthError(null)
    setIsDemoMode(false)
    setDashboard(null)
    setSubjects([])
    setResources([])
    setBookmarks([])
    setAchievements([])
    setLeaderboard([])
    setAnalytics(null)
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
    setIsDemoMode(false)
    setCurrentUser(null)
    setDashboard(null)
    setSubjects([])
    setResources([])
    setBookmarks([])
    setAchievements([])
    setLeaderboard([])
    setAnalytics(null)
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
      generateQuiz,
      submitQuizAttempt,
      logStudySession,
      resources,
      bookmarks,
      refreshResources,
      refreshBookmarks,
      toggleBookmark,
      achievements,
      refreshAchievements,
      leaderboard,
      refreshLeaderboard,
      analytics,
      refreshAnalytics,
      generateSyllabus,
      onboarding,
      setOnboarding,
      sidebarOpen,
      setSidebarOpen,
      mobileNavOpen,
      setMobileNavOpen,
      submitOnboarding,
      fetchTopicResources,
      getTopicResources,
      fetchAllMyTopics,
      getTopicChat,
      sendTopicChatMessage,
      clearTopicChat,
      getTopicSummary,
      refreshMyProfile,
      myProfile,
      generateCodePractice,
      reviewCodeAttempt,
      isDemoMode,
      enterDemoMode,
      exitDemoMode,
      demoNotice,
      dismissDemoNotice,
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
      analytics,
      onboarding,
      sidebarOpen,
      mobileNavOpen,
      myProfile,
      isDemoMode,
      demoNotice,
    ]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}