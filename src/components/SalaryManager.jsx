import { useState } from 'react'
import axios from 'axios'
import { API_URL } from '../config/api'

const SalaryManager = ({ user, token, onSalaryUpdate }) => {
  const [monthlySalary, setMonthlySalary] = useState(user.monthlySalary || '')
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(!user.monthlySalary)
  const [message, setMessage] = useState('')

  const axiosConfig = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      console.log('Sending salary update request:', {
        url: `${API_URL}/salary`,
        data: { monthlySalary: parseFloat(monthlySalary) || 0 },
        token: axiosConfig.headers.Authorization
      })
      
      const response = await axios.put(`${API_URL}/salary`, {
        monthlySalary: parseFloat(monthlySalary) || 0
      }, axiosConfig)

      onSalaryUpdate(response.data)
      setIsEditing(false)
      setMessage('Salary updated successfully! 💰')
      
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error updating salary:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      console.error('Request URL:', `${API_URL}/salary`)
      console.error('Token:', token ? 'Present' : 'Missing')
      console.error('User data:', user)
      
      let errorMessage = 'Error updating salary. Please try again.'
      
      if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.'
      } else if (error.response?.status === 404) {
        errorMessage = 'User not found. Please login again.'
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = `Network error: ${error.message}`
      }
      
      setMessage(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setMessage('')
  }

  const handleCancel = () => {
    setMonthlySalary(user.monthlySalary || '')
    setIsEditing(false)
    setMessage('')
  }

  return (
    <div className="salary-manager">
      <div className="salary-header">
        <h3>💰 Monthly Salary</h3>
        {!isEditing && (
          <button className="edit-salary-btn" onClick={handleEdit}>
            <span>✏️</span> Edit
          </button>
        )}
      </div>

      {message && (
        <div className={`salary-message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="salary-form">
        <div className="salary-input-group">
          <div className="currency-symbol">£</div>
          <input
            type="number"
            placeholder="Enter your monthly salary"
            value={monthlySalary}
            onChange={(e) => setMonthlySalary(e.target.value)}
            step="0.01"
            min="0"
            className={`salary-input ${!isEditing ? 'readonly' : ''}`}
            readOnly={!isEditing}
          />
        </div>

        {isEditing && (
          <div className="salary-actions">
            <button 
              type="submit" 
              disabled={loading}
              className="save-salary-btn"
            >
              {loading ? (
                <span className="loading-salary">
                  <span className="loading-spinner"></span>
                  Saving...
                </span>
              ) : (
                <>
                  <span>💾</span> Save Salary
                </>
              )}
            </button>
            <button 
              type="button" 
              onClick={handleCancel}
              className="cancel-salary-btn"
            >
              <span>❌</span> Cancel
            </button>
          </div>
        )}
      </form>

      {!isEditing && monthlySalary && (
        <div className="salary-display">
          <div className="salary-breakdown">
            <div className="breakdown-item">
              <span className="breakdown-label">Daily Average:</span>
              <span className="breakdown-value">£{(parseFloat(monthlySalary) / 30).toFixed(2)}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Weekly Average:</span>
              <span className="breakdown-value">£{(parseFloat(monthlySalary) / 4.33).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SalaryManager