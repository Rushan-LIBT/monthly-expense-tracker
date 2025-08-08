import { useState } from 'react'
import LoadingSpinner from './LoadingSpinner'

const ExpenseForm = ({ onAddExpense, loading }) => {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (description && amount && category && date) {
      const success = await onAddExpense({
        description,
        amount: parseFloat(amount),
        category,
        date
      })
      
      if (success) {
        setDescription('')
        setAmount('')
        setCategory('')
        setDate('')
      }
    }
  }

  const categories = [
    { value: 'Food', label: '🍕 Food', color: '#ef4444' },
    { value: 'Transportation', label: '🚗 Transportation', color: '#3b82f6' },
    { value: 'Entertainment', label: '🎬 Entertainment', color: '#8b5cf6' },
    { value: 'Utilities', label: '⚡ Utilities', color: '#f59e0b' },
    { value: 'Healthcare', label: '🏥 Healthcare', color: '#10b981' },
    { value: 'Shopping', label: '🛍️ Shopping', color: '#06b6d4' },
    { value: 'Other', label: '📝 Other', color: '#6b7280' }
  ]

  return (
    <div className="expense-form-dashboard">
      <div className="form-header">
        <h2>➕ Add New Expense</h2>
        <p>Track your spending and stay on budget</p>
      </div>
      
      <form onSubmit={handleSubmit} className="modern-expense-form">
        <div className="form-row">
          <div className="form-group-modern full-width">
            <label className="form-label-modern">
              <span className="label-icon">📝</span>
              Description
            </label>
            <input
              type="text"
              placeholder="What did you spend on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="form-input-modern"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group-modern">
            <label className="form-label-modern">
              <span className="label-icon">💰</span>
              Amount
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0"
              required
              className="form-input-modern"
            />
          </div>
          
          <div className="form-group-modern">
            <label className="form-label-modern">
              <span className="label-icon">📅</span>
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="form-input-modern"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group-modern full-width">
            <label className="form-label-modern">
              <span className="label-icon">🏷️</span>
              Category
            </label>
            <div className="category-grid">
              {categories.map((cat) => (
                <label
                  key={cat.value}
                  className={`category-option ${category === cat.value ? 'selected' : ''}`}
                  style={{ '--category-color': cat.color }}
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat.value}
                    checked={category === cat.value}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  />
                  <span className="category-content">
                    <span className="category-label">{cat.label}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={loading} 
          className="submit-btn-modern"
        >
          {loading ? (
            <LoadingSpinner type="modern" size="medium" text="Adding Expense..." />
          ) : (
            <>
              <span className="btn-icon">✨</span>
              Add Expense
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default ExpenseForm