import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import CalendarPage from './pages/CalendarPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import EmailVerification from './components/EmailVerification.jsx'
import ModalComponent from './components/ModalComponent.jsx'
import { updateFavicon } from './utils/faviconUtils';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
           (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    const updateTheme = (dark) => {
      setIsDarkMode(dark);
      updateFavicon(dark);
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    };

    updateTheme(isDarkMode);
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => updateTheme(e.matches);

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  useEffect(() => {
    updateFavicon(isDarkMode);
  }, [isDarkMode]);

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
