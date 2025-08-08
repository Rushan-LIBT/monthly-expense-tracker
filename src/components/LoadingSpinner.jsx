import React from 'react'

const LoadingSpinner = ({ 
  type = 'modern', 
  size = 'medium', 
  text = '', 
  className = '' 
}) => {
  const getSpinnerClass = () => {
    switch (type) {
      case 'auth':
        return 'loading-spinner-auth'
      case 'salary':
        return 'loading-spinner-salary'
      case 'modern':
      default:
        return 'loading-spinner-modern'
    }
  }

  const getContainerClass = () => {
    const baseClass = 'loading-container'
    const sizeClass = `loading-${size}`
    return `${baseClass} ${sizeClass} ${className}`.trim()
  }

  return (
    <div className={getContainerClass()}>
      <div className={getSpinnerClass()}>
        <div className="loading-dot loading-dot-1"></div>
        <div className="loading-dot loading-dot-2"></div>
        <div className="loading-dot loading-dot-3"></div>
      </div>
      {text && <span className="loading-text">{text}</span>}
    </div>
  )
}

export default LoadingSpinner