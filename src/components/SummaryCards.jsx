const SummaryCards = ({ monthlyExpenses, categoryExpenses, monthlySalary = 0 }) => {
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
  const currentMonthExpenses = monthlyExpenses[currentMonth] || 0
  
  const mostExpensiveCategory = Object.keys(categoryExpenses).reduce((a, b) => 
    categoryExpenses[a] > categoryExpenses[b] ? a : b, ''
  )

  const remainingBudget = monthlySalary - currentMonthExpenses
  const budgetUsedPercentage = monthlySalary > 0 ? ((currentMonthExpenses / monthlySalary) * 100).toFixed(1) : 0

  const cards = [
    {
      title: 'Monthly Salary',
      value: `£${monthlySalary.toFixed(2)}`,
      icon: '💰',
      color: 'success',
      subtitle: 'Your monthly income'
    },
    {
      title: 'This Month Spent',
      value: `£${currentMonthExpenses.toFixed(2)}`,
      icon: '📅',
      color: currentMonthExpenses > monthlySalary ? 'danger' : 'primary',
      subtitle: `${budgetUsedPercentage}% of salary`
    },
    {
      title: 'Remaining Budget',
      value: `£${remainingBudget.toFixed(2)}`,
      icon: remainingBudget >= 0 ? '✅' : '⚠️',
      color: remainingBudget >= 0 ? 'success' : 'danger',
      subtitle: remainingBudget >= 0 ? 'Within budget' : 'Over budget!'
    },
    {
      title: 'Top Category',
      value: mostExpensiveCategory || 'None',
      icon: getCategoryEmoji(mostExpensiveCategory),
      color: 'info',
      subtitle: `£${(categoryExpenses[mostExpensiveCategory] || 0).toFixed(2)}`
    }
  ]

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

  return (
    <div className="summary-cards">
      {cards.map((card, index) => (
        <div key={index} className={`summary-card ${card.color}`}>
          <div className="card-icon">
            <span>{card.icon}</span>
          </div>
          <div className="card-content">
            <h3 className="card-title">{card.title}</h3>
            <div className="card-value">{card.value}</div>
            <p className="card-subtitle">{card.subtitle}</p>
          </div>
          <div className="card-decoration"></div>
        </div>
      ))}
    </div>
  )
}

export default SummaryCards