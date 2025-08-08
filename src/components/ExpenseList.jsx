const ExpenseList = ({ expenses, onDeleteExpense, isCompact = false, isFullView = false }) => {
  function getCategoryEmoji(category) {
    const emojis = {
      'Food': '🍕',
      'Transportation': '🚗',
      'Entertainment': '🎬',
      'Utilities': '⚡',
      'Healthcare': '🏥',
      'Shopping': '🛍️',
      'Other': '📝'
    }
    return emojis[category] || '📊'
  }

  function getCategoryColor(category) {
    const colors = {
      'Food': '#ef4444',
      'Transportation': '#3b82f6',
      'Entertainment': '#8b5cf6',
      'Utilities': '#f59e0b',
      'Healthcare': '#10b981',
      'Shopping': '#06b6d4',
      'Other': '#6b7280'
    }
    return colors[category] || '#6b7280'
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      ...(isFullView && { year: 'numeric' })
    })
  }

  function getTimeAgo(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return formatDate(dateString)
  }

  if (expenses.length === 0) {
    return (
      <div className="expense-list-modern">
        <div className="empty-expenses">
          <div className="empty-icon">💸</div>
          <h3>No expenses found</h3>
          <p>{isCompact ? 'Start adding expenses to see them here!' : 'Your expense list is empty. Add your first expense to get started!'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`expense-list-modern ${isCompact ? 'compact' : ''} ${isFullView ? 'full-view' : ''}`}>
      {!isCompact && (
        <div className="list-header">
          <h3>📝 {isFullView ? 'All Expenses' : 'Recent Expenses'}</h3>
          {!isFullView && expenses.length > 5 && (
            <span className="expense-count">{expenses.length} total expenses</span>
          )}
        </div>
      )}
      
      <div className="expense-items">
        {expenses.map((expense, index) => (
          <div 
            key={expense._id} 
            className="expense-item-modern"
            style={{ 
              animationDelay: `${index * 0.05}s`,
              '--category-color': getCategoryColor(expense.category)
            }}
          >
            <div className="expense-icon">
              <span>{getCategoryEmoji(expense.category)}</span>
            </div>
            
            <div className="expense-details">
              <div className="expense-primary">
                <h4 className="expense-description">{expense.description}</h4>
                <span className="expense-amount">£{expense.amount.toFixed(2)}</span>
              </div>
              <div className="expense-secondary">
                <span className="expense-category">
                  {expense.category}
                </span>
                <span className="expense-date">
                  {isCompact ? getTimeAgo(expense.date) : formatDate(expense.date)}
                </span>
              </div>
            </div>
            
            <div className="expense-actions">
              <button 
                onClick={() => onDeleteExpense(expense._id)}
                className="delete-btn-modern"
                title="Delete expense"
              >
                <span>🗑️</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExpenseList