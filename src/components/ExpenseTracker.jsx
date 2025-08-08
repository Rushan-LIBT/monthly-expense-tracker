import Dashboard from './Dashboard'

function ExpenseTracker({ user, token, onLogout }) {
  return <Dashboard user={user} token={token} onLogout={onLogout} />
}

export default ExpenseTracker