import { useState, useEffect } from 'react'
import Auth from './components/Auth'
import ExpenseTracker from './components/ExpenseTracker'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
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

  if (!user || !token) {
    return <Auth onLogin={handleLogin} />
  }

  return <ExpenseTracker user={user} token={token} onLogout={handleLogout} />
}

export default App
