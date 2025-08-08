import { useTheme } from '../context/ThemeContext'

const ThemeToggle = ({ isAuth = false }) => {
  const { toggleTheme, isDark } = useTheme()

  if (isAuth) {
    return (
      <button 
        onClick={toggleTheme}
        className="theme-toggle-auth"
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <span className="theme-icon">
          {isDark ? '☀️' : '🌙'}
        </span>
        <span>
          {isDark ? 'Light' : 'Dark'}
        </span>
      </button>
    )
  }

  return (
    <button 
      onClick={toggleTheme}
      className="theme-toggle"
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span className="theme-icon">
        {isDark ? '☀️' : '🌙'}
      </span>
      <span>
        {isDark ? 'Light' : 'Dark'}
      </span>
    </button>
  )
}

export default ThemeToggle