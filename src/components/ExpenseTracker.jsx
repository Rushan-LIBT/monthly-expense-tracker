import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

function ExpenseTracker({ user, token, onLogout }) {
  const [expenses, setExpenses] = useState([])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)

  const axiosConfig = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${API_URL}/expenses`, axiosConfig)
      setExpenses(response.data)
    } catch (error) {
      console.error('Error fetching expenses:', error)
      if (error.response?.status === 401) {
        onLogout()
      }
    }
  }

  const addExpense = async (e) => {
    e.preventDefault()
    if (description && amount && category && date) {
      setLoading(true)
      try {
        const response = await axios.post(`${API_URL}/expenses`, {
          description,
          amount: parseFloat(amount),
          category,
          date
        }, axiosConfig)

        setExpenses([response.data, ...expenses])
        setDescription('')
        setAmount('')
        setCategory('')
        setDate('')
      } catch (error) {
        console.error('Error adding expense:', error)
        if (error.response?.status === 401) {
          onLogout()
        }
      } finally {
        setLoading(false)
      }
    }
  }

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${API_URL}/expenses/${id}`, axiosConfig)
      setExpenses(expenses.filter(expense => expense._id !== id))
    } catch (error) {
      console.error('Error deleting expense:', error)
      if (error.response?.status === 401) {
        onLogout()
      }
    }
  }

  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0).toFixed(2)
  }

  const getExpensesByMonth = () => {
    const monthlyExpenses = {}
    expenses.forEach(expense => {
      const month = new Date(expense.date).toLocaleString('default', { month: 'long', year: 'numeric' })
      if (!monthlyExpenses[month]) {
        monthlyExpenses[month] = 0
      }
      monthlyExpenses[month] += expense.amount
    })
    return monthlyExpenses
  }

  return (
    <div className="app">
      <div className="header fade-in">
        <h1>Monthly Expense Tracker</h1>
        <div className="user-info">
          <span>Welcome, {user.username}!</span>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </div>
      
      <form onSubmit={addExpense} className="expense-form fade-in">
        <h2>Add New Expense</h2>
        <div className="form-grid">
          <div className="form-group full-width">
            <label className="form-label">Description</label>
            <input
              type="text"
              placeholder="What did you spend on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Amount</label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="category-select"
            >
              <option value="">Select Category</option>
              <option value="Food">🍕 Food</option>
              <option value="Transportation">🚗 Transportation</option>
              <option value="Entertainment">🎬 Entertainment</option>
              <option value="Utilities">⚡ Utilities</option>
              <option value="Healthcare">🏥 Healthcare</option>
              <option value="Shopping">🛍️ Shopping</option>
              <option value="Other">📝 Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? <span className="loading">Adding</span> : 'Add Expense'}
        </button>
      </form>

      <div className="summary fade-in">
        <h2>Total Expenses</h2>
        <div className="summary-amount">${getTotalExpenses()}</div>
      </div>

      <div className="monthly-summary fade-in">
        <h2>Monthly Summary</h2>
        {Object.entries(getExpensesByMonth()).length === 0 ? (
          <p className="expense-list-empty">No monthly data yet. Add some expenses to see your spending patterns!</p>
        ) : (
          Object.entries(getExpensesByMonth()).map(([month, total]) => (
            <div key={month} className="month-item">
              <span className="month-name">{month}</span>
              <span className="month-amount">${total.toFixed(2)}</span>
            </div>
          ))
        )}
      </div>

      <div className="expense-list fade-in">
        <h2>Recent Expenses</h2>
        {expenses.length === 0 ? (
          <div className="expense-list-empty">
            <p>No expenses recorded yet.</p>
            <p>Start by adding your first expense above! 💰</p>
          </div>
        ) : (
          expenses.map((expense, index) => (
            <div key={expense._id} className="expense-item slide-in" style={{animationDelay: `${index * 0.1}s`}}>
              <span className="expense-description">{expense.description}</span>
              <span className="expense-amount">${expense.amount.toFixed(2)}</span>
              <span className="expense-category">{expense.category}</span>
              <span className="expense-date">{new Date(expense.date).toLocaleDateString()}</span>
              <button 
                onClick={() => deleteExpense(expense._id)}
                className="delete-btn"
                title="Delete expense"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ExpenseTracker