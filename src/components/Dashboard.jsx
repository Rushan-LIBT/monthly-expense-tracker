import { useState, useEffect } from 'react'
import axios from 'axios'
import ThemeToggle from './ThemeToggle'
import ExpenseCharts from './ExpenseCharts'
import ExpenseForm from './ExpenseForm'
import ExpenseList from './ExpenseList'
import SummaryCards from './SummaryCards'
import SalaryManager from './SalaryManager'
import { API_URL } from '../config/api'

function Dashboard({ user, token, onLogout }) {
  const [expenses, setExpenses] = useState([])
  const [currentUser, setCurrentUser] = useState(user)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const axiosConfig = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }

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

  useEffect(() => {
    fetchExpenses()
  }, [])

  const addExpense = async (expenseData) => {
    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/expenses`, expenseData, axiosConfig)
      setExpenses([response.data, ...expenses])
      return true
    } catch (error) {
      console.error('Error adding expense:', error)
      if (error.response?.status === 401) {
        onLogout()
      }
      return false
    } finally {
      setLoading(false)
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
    return expenses.reduce((total, expense) => total + expense.amount, 0)
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

  const getExpensesByCategory = () => {
    const categoryExpenses = {}
    expenses.forEach(expense => {
      if (!categoryExpenses[expense.category]) {
        categoryExpenses[expense.category] = 0
      }
      categoryExpenses[expense.category] += expense.amount
    })
    return categoryExpenses
  }

  const getRecentExpenses = () => {
    return expenses.slice(0, 5)
  }

  const handleSalaryUpdate = (updatedUser) => {
    setCurrentUser(updatedUser)
    // Update localStorage with new user data
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'budget', label: 'Budget', icon: '💰' },
    { id: 'add-expense', label: 'Add', icon: '➕' },
    { id: 'expenses', label: 'Expenses', icon: '📝' }
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Rush Finance</h1>
          <p>Welcome back, <span className="user-highlight">{currentUser.username}</span>!</p>
        </div>
        <div className="dashboard-actions">
          <ThemeToggle />
          <button className="logout-btn-dashboard" onClick={onLogout}>
            <span>🚪</span>
          </button>
        </div>
      </div>

      <div className="dashboard-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            {/* Mobile Quick Actions */}
            <div className="mobile-quick-actions">
              <button 
                className="quick-action-btn" 
                onClick={() => setActiveTab('add-expense')}
              >
                <span className="icon">➕</span>
                <span>Add Expense</span>
              </button>
              <button 
                className="quick-action-btn" 
                onClick={() => setActiveTab('budget')}
              >
                <span className="icon">💰</span>
                <span>Salary</span>
              </button>
              <button 
                className="quick-action-btn" 
                onClick={() => setActiveTab('analytics')}
              >
                <span className="icon">📊</span>
                <span>Analytics</span>
              </button>
            </div>
            
            <SummaryCards 
              totalExpenses={getTotalExpenses()}
              monthlyExpenses={getExpensesByMonth()}
              categoryExpenses={getExpensesByCategory()}
              recentCount={getRecentExpenses().length}
              monthlySalary={currentUser.monthlySalary || 0}
            />
            <div className="overview-grid">
              <div className="overview-chart-section">
                <ExpenseCharts 
                  expenses={expenses}
                  categoryExpenses={getExpensesByCategory()}
                  monthlyExpenses={getExpensesByMonth()}
                />
              </div>
              <div className="recent-expenses-section">
                <h3>🕒 Recent Expenses</h3>
                <ExpenseList 
                  expenses={getRecentExpenses()} 
                  onDeleteExpense={deleteExpense}
                  isCompact={true}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-tab">
            <ExpenseCharts 
              expenses={expenses}
              categoryExpenses={getExpensesByCategory()}
              monthlyExpenses={getExpensesByMonth()}
              isFullView={true}
            />
          </div>
        )}

        {activeTab === 'add-expense' && (
          <div className="add-expense-tab">
            <ExpenseForm onAddExpense={addExpense} loading={loading} />
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="budget-tab">
            <div className="budget-grid">
              <div className="salary-section">
                <SalaryManager 
                  user={currentUser}
                  token={token}
                  onSalaryUpdate={handleSalaryUpdate}
                />
              </div>
              <div className="budget-overview">
                <div className="budget-card">
                  <h3>💸 Budget Overview</h3>
                  <div className="budget-stats">
                    <div className="budget-stat">
                      <span className="stat-label">Monthly Income:</span>
                      <span className="stat-value income">£{(currentUser.monthlySalary || 0).toFixed(2)}</span>
                    </div>
                    <div className="budget-stat">
                      <span className="stat-label">This Month Expenses:</span>
                      <span className="stat-value expense">£{(getExpensesByMonth()[new Date().toLocaleString('default', { month: 'long', year: 'numeric' })] || 0).toFixed(2)}</span>
                    </div>
                    <div className="budget-stat">
                      <span className="stat-label">Remaining Budget:</span>
                      <span className={`stat-value ${((currentUser.monthlySalary || 0) - (getExpensesByMonth()[new Date().toLocaleString('default', { month: 'long', year: 'numeric' })] || 0)) >= 0 ? 'positive' : 'negative'}`}>
                        £{((currentUser.monthlySalary || 0) - (getExpensesByMonth()[new Date().toLocaleString('default', { month: 'long', year: 'numeric' })] || 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="expenses-tab">
            <ExpenseList 
              expenses={expenses} 
              onDeleteExpense={deleteExpense}
              isFullView={true}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard