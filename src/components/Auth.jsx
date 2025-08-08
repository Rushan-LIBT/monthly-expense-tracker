import { useState } from 'react'
import axios from 'axios'
import ThemeToggle from './ThemeToggle'
import { API_URL } from '../config/api'

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = isLogin ? '/login' : '/register'
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData

      const response = await axios.post(`${API_URL}${endpoint}`, payload)
      
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      onLogin(response.data.user, response.data.token)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <ThemeToggle isAuth={true} />
        
        <div className="auth-form-header">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="auth-form-subtitle">
            {isLogin 
              ? 'Sign in to continue managing your finances' 
              : 'Join thousands who trust us with their expense tracking'
            }
          </p>
        </div>

        {error && (
          <div className="error-message" style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-lg)',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group-auth">
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
                className="form-input-auth"
              />
              <span className="input-icon">👤</span>
            </div>
          )}
          
          <div className="form-group-auth">
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input-auth"
            />
            <span className="input-icon">📧</span>
          </div>
          
          <div className="form-group-auth">
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input-auth"
            />
            <span className="input-icon">🔒</span>
          </div>
          
          <button type="submit" disabled={loading} className="auth-submit-btn">
            {loading ? (
              <span className="loading-auth">
                <span className="loading-spinner-auth"></span>
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </span>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>
        
        <div className="auth-switch">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button 
            type="button" 
            className="auth-link-btn"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>

        {isLogin && (
          <div style={{ 
            textAlign: 'center', 
            marginTop: 'var(--spacing-lg)',
            color: 'rgba(248, 250, 252, 0.6)',
            fontSize: 'var(--font-size-xs)'
          }}>
            <p>Demo Account: rushan@example.com | password123</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Auth