import { useState, useEffect } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Auth from './components/Auth'
import ExpenseTracker from './components/ExpenseTracker'
import { API_URL } from './config/api'
import './App.css'

function AppContent() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for saved authentication
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')
      
      // For development: Check if we want to force logout
      const forceLogout = new URLSearchParams(window.location.search).get('logout')
      if (forceLogout === 'true') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.history.replaceState({}, document.title, window.location.pathname)
        setIsLoading(false)
        return
      }
      
      if (savedToken && savedUser) {
        try {
          // Verify token is still valid by making a test request
          const response = await fetch(`${API_URL}/expenses`, {
            headers: {
              'Authorization': `Bearer ${savedToken}`
            }
          })
          
          if (response.ok) {
            setToken(savedToken)
            setUser(JSON.parse(savedUser))
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('token')
            localStorage.removeItem('user')
          }
        } catch {
          // Network error or invalid token
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }
      
      setIsLoading(false)
    }
    
    checkAuth()
  }, [])

  const handleLogin = (userData, userToken) => {
    setUser(userData)
    setToken(userToken)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setToken(null)
  }

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #7c3aed 0%, #10b981 100%)',
        color: 'white',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(255,255,255,0.3)',
          borderTop: '4px solid white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (!user || !token) {
    return <Auth onLogin={handleLogin} />
  }

  return <ExpenseTracker user={user} token={token} onLogout={handleLogout} />
}

function App() {
  return (
    <ThemeProvider>
      <div style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
      }}>
        <AppContent />
      </div>
    </ThemeProvider>
  )
}

export default App
