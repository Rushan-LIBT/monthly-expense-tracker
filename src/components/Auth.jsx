import { useState, useEffect } from 'react'
import axios from 'axios'
import ThemeToggle from './ThemeToggle'
import LoadingSpinner from './LoadingSpinner'
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
  const [showPassword, setShowPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const validateForm = () => {
    const errors = {}
    
    if (!isLogin && (!formData.username || formData.username.length < 3)) {
      errors.username = 'Username must be at least 3 characters'
    }
    
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password || formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
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

  const toggleAuthMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setValidationErrors({})
    setFormData({
      username: '',
      email: '',
      password: ''
    })
  }

  const demoLogin = async () => {
    setFormData({
      username: '',
      email: 'rushan@example.com',
      password: 'password123'
    })
    
    setTimeout(() => {
      setLoading(true)
      axios.post(`${API_URL}/login`, {
        email: 'rushan@example.com',
        password: 'password123'
      })
      .then(response => {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        onLogin(response.data.user, response.data.token)
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Demo login failed')
      })
      .finally(() => {
        setLoading(false)
      })
    }, 300)
  }

  return (
    <div className={`auth-container ${mounted ? 'mounted' : ''}`}>
      <div className="auth-background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      
      <div className="auth-content">
        {/* Left Hero Section */}
        <div className="auth-hero-section">
          <div className="hero-content">
            <div className="hero-brand">
              <div className="hero-logo">
                <div className="logo-icon-large">💰</div>
                <div className="logo-rings">
                  <div className="ring ring-1"></div>
                  <div className="ring ring-2"></div>
                  <div className="ring ring-3"></div>
                </div>
              </div>
              <h1 className="hero-title">Rush Finance</h1>
              <p className="hero-subtitle">Transform your financial future with intelligent expense tracking and powerful analytics</p>
            </div>

            <div className="hero-features">
              <div className="hero-feature">
                <div className="feature-icon-large">📊</div>
                <div className="feature-content">
                  <h3>Smart Analytics</h3>
                  <p>AI-powered insights into your spending patterns and financial habits</p>
                </div>
              </div>
              <div className="hero-feature">
                <div className="feature-icon-large">💰</div>
                <div className="feature-content">
                  <h3>Budget Management</h3>
                  <p>Set intelligent budgets and receive real-time notifications</p>
                </div>
              </div>
              <div className="hero-feature">
                <div className="feature-icon-large">🔒</div>
                <div className="feature-content">
                  <h3>Bank-Level Security</h3>
                  <p>Your data is protected with enterprise-grade encryption</p>
                </div>
              </div>
            </div>

            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Active Users</div>
              </div>
              <div className="stat">
                <div className="stat-number">$2M+</div>
                <div className="stat-label">Money Tracked</div>
              </div>
              <div className="stat">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="auth-form-section">
          <ThemeToggle isAuth={true} />
          
          <div className="auth-card">
            <div className="auth-header">
              <h2 className="auth-title">{isLogin ? 'Welcome Back' : 'Join Rush Finance'}</h2>
              <p className="auth-description">
                {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
              </p>
            </div>

            <div className="auth-tabs">
              <button 
                type="button"
                className={`auth-tab ${isLogin ? 'active' : ''}`}
                onClick={() => isLogin || toggleAuthMode()}
              >
                Sign In
              </button>
              <button 
                type="button"
                className={`auth-tab ${!isLogin ? 'active' : ''}`}
                onClick={() => !isLogin || toggleAuthMode()}
              >
                Sign Up
              </button>
              <div className="tab-indicator" style={{
                transform: `translateX(${isLogin ? '0%' : '100%'})`
              }}></div>
            </div>

            <div className={`auth-form-wrapper ${isLogin ? 'login-mode' : 'signup-mode'}`}>
              <div className="auth-form-container">
                
                {error && (
                  <div className="error-alert">
                    <div className="error-icon">⚠️</div>
                    <span>{error}</span>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="auth-form-new">
                  {!isLogin && (
                    <div className="form-field">
                      <label htmlFor="username" className="field-label">Username</label>
                      <div className="field-container">
                        <div className="field-icon">👤</div>
                        <input
                          id="username"
                          type="text"
                          name="username"
                          placeholder="Choose a username"
                          value={formData.username}
                          onChange={handleChange}
                          className={`field-input ${validationErrors.username ? 'error' : ''}`}
                          required={!isLogin}
                        />
                      </div>
                      {validationErrors.username && (
                        <span className="field-error">{validationErrors.username}</span>
                      )}
                    </div>
                  )}
                  
                  <div className="form-field">
                    <label htmlFor="email" className="field-label">Email Address</label>
                    <div className="field-container">
                      <div className="field-icon">📧</div>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`field-input ${validationErrors.email ? 'error' : ''}`}
                        required
                      />
                    </div>
                    {validationErrors.email && (
                      <span className="field-error">{validationErrors.email}</span>
                    )}
                  </div>
                  
                  <div className="form-field">
                    <label htmlFor="password" className="field-label">Password</label>
                    <div className="field-container">
                      <div className="field-icon">🔒</div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`field-input ${validationErrors.password ? 'error' : ''}`}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                    {validationErrors.password && (
                      <span className="field-error">{validationErrors.password}</span>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading} 
                    className={`auth-submit ${loading ? 'loading' : ''}`}
                  >
                    <div className="submit-content">
                      {loading ? (
                        <LoadingSpinner 
                          type="auth" 
                          size="medium" 
                          text={isLogin ? 'Signing In...' : 'Creating Account...'} 
                        />
                      ) : (
                        <>
                          <span className="submit-text">
                            {isLogin ? 'Sign In' : 'Create Account'}
                          </span>
                          <div className="submit-icon">
                            {isLogin ? '🚀' : '✨'}
                          </div>
                        </>
                      )}
                    </div>
                  </button>
                </form>

                {isLogin && (
                  <div className="demo-section">
                    <div className="demo-divider">
                      <span>Try Demo</span>
                    </div>
                    <button 
                      type="button"
                      onClick={demoLogin}
                      className="demo-btn"
                      disabled={loading}
                    >
                      <div className="demo-icon">🎮</div>
                      <span>Quick Demo Login</span>
                    </button>
                    <p className="demo-info">
                      Experience all features with sample data
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth