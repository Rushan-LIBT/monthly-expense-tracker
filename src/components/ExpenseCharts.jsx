import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js'
import { Line, Doughnut, Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
)

const ExpenseCharts = ({ expenses, categoryExpenses, monthlyExpenses, isFullView = false }) => {
  // Category Chart Data
  const categoryLabels = Object.keys(categoryExpenses)
  const categoryAmounts = Object.values(categoryExpenses)
  
  const categoryColors = [
    '#7c3aed', // Purple
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#3b82f6', // Blue
    '#8b5cf6', // Violet
    '#06b6d4', // Cyan
    '#84cc16', // Lime
  ]

  const categoryChartData = {
    labels: categoryLabels.map(label => `${getCategoryEmoji(label)} ${label}`),
    datasets: [
      {
        data: categoryAmounts,
        backgroundColor: categoryColors.slice(0, categoryLabels.length),
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverBorderWidth: 5,
        hoverOffset: 10,
      },
    ],
  }

  // Monthly Trend Chart Data
  const monthLabels = Object.keys(monthlyExpenses).sort((a, b) => new Date(a) - new Date(b))
  const monthAmounts = monthLabels.map(month => monthlyExpenses[month])

  const monthlyChartData = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Monthly Expenses',
        data: monthAmounts,
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#7c3aed',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  }

  // Daily Expenses for the last 7 days
  const getDailyExpenses = () => {
    const last7Days = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayExpenses = expenses
        .filter(expense => expense.date.split('T')[0] === dateStr)
        .reduce((sum, expense) => sum + expense.amount, 0)
      
      last7Days.push({
        date: date.toLocaleDateString('en', { weekday: 'short' }),
        amount: dayExpenses
      })
    }
    return last7Days
  }

  const dailyData = getDailyExpenses()
  const dailyChartData = {
    labels: dailyData.map(day => day.date),
    datasets: [
      {
        label: 'Daily Expenses',
        data: dailyData.map(day => day.amount),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: '#10b981',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: '600',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#7c3aed',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `£${context.parsed.y || context.parsed}`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '£' + value;
          }
        }
      }
    }
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          usePointStyle: true,
          font: {
            size: 11,
            weight: '600',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#7c3aed',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((sum, value) => sum + value, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `£${context.parsed} (${percentage}%)`;
          }
        }
      },
    },
    cutout: '60%',
  }

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

  if (categoryLabels.length === 0) {
    return (
      <div className="charts-empty">
        <div className="empty-state">
          <span className="empty-icon">📊</span>
          <h3>No expense data yet</h3>
          <p>Add some expenses to see beautiful charts and analytics!</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`expense-charts ${isFullView ? 'full-view' : ''}`}>
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>📊 Expenses by Category</h3>
          </div>
          <div className="chart-container">
            <Doughnut data={categoryChartData} options={doughnutOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>📈 Monthly Trend</h3>
          </div>
          <div className="chart-container">
            <Line data={monthlyChartData} options={chartOptions} />
          </div>
        </div>

        {isFullView && (
          <div className="chart-card full-width">
            <div className="chart-header">
              <h3>📅 Daily Expenses (Last 7 Days)</h3>
            </div>
            <div className="chart-container">
              <Bar data={dailyChartData} options={chartOptions} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExpenseCharts