import { createContext, useContext, useMemo, useState } from 'react'
import studentData from '../data/student.json'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [student] = useState(studentData)
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

  const value = useMemo(
    () => ({
      student,
      onboarding,
      setOnboarding,
      sidebarOpen,
      setSidebarOpen,
      mobileNavOpen,
      setMobileNavOpen,
    }),
    [student, onboarding, sidebarOpen, mobileNavOpen]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
