import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import CalendarPage from './pages/CalendarPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import EmailVerification from './components/EmailVerification.jsx'
import ModalComponent from './components/ModalComponent.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <ModalComponent>
            <LoginPage />
          </ModalComponent>
        } />
        <Route path="/verify/:token" element={<EmailVerification />} />
        <Route path="/calendar" element={
          <ProtectedRoute>
            <CalendarPage />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/calendar" replace />} />
      </Routes>
    </Router>
  )
}

export default App
