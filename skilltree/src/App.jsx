import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import PublicLayout from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './components/common/ProtectedRoute'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Subjects from './pages/Subjects'
import SkillTree from './pages/SkillTree'
import Resources from './pages/Resources'
import Achievements from './pages/Achievements'
import Analytics from './pages/Analytics'
import Leaderboard from './pages/Leaderboard'
import Bookmarks from './pages/Bookmarks'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import SyllabusUpload from './pages/SyllabusUpload'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/onboarding" element={<Onboarding />} />
          </Route>

          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/app" element={<Dashboard />} />
            <Route path="/app/subjects" element={<Subjects />} />
            <Route path="/app/skill-tree" element={<SkillTree />} />
            <Route path="/app/resources" element={<Resources />} />
            <Route path="/app/achievements" element={<Achievements />} />
            <Route path="/app/analytics" element={<Analytics />} />
            <Route path="/app/leaderboard" element={<Leaderboard />} />
            <Route path="/app/bookmarks" element={<Bookmarks />} />
            <Route path="/app/profile" element={<Profile />} />
            <Route path="/app/settings" element={<Settings />} />
            <Route path="/app/syllabus-upload" element={<SyllabusUpload />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}