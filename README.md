# Rush Finance 💰

A modern React application for smart expense tracking and budget management with MongoDB database, user authentication, and beautiful charts.

## ✨ Features

- 🔐 **User Authentication** - Secure login/registration
- 💵 **Expense Management** - Add, view, delete expenses by category
- 📊 **Visual Analytics** - Beautiful charts and spending insights
- 💰 **Salary Tracking** - Set monthly salary and budget tracking
- 🎨 **Modern UI** - Glassmorphism design with dark/light themes
- 📱 **Responsive** - Works perfectly on all devices
- 💷 **British Currency** - Uses Pounds (£) for UK users

## 🚀 Quick Start

### Run the Application
```bash
# Double-click this file to start both servers:
start-fixed.bat
```

### Manual Start
```bash
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend
npm run dev
```

## 🔐 Login Credentials
- **Email**: rushan@libt.co.uk  
- **Password**: password123

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite + Chart.js
- **Backend**: Node.js + Express + JWT
- **Database**: MongoDB Atlas (Cluster0/FinanceDB)
- **Styling**: Modern CSS with Glassmorphism

## 📁 Project Structure
```
monthly-expense-tracker/
├── backend/
│   ├── server.js          # Main MongoDB server
│   ├── package.json       # Backend dependencies  
│   └── .env              # Database credentials
├── src/
│   ├── components/       # React components
│   ├── context/         # Theme management
│   └── App.jsx          # Main application
├── start-fixed.bat      # Easy startup script
└── package.json         # Frontend dependencies
```

## 💡 Usage

1. **Login** with the provided credentials
2. **Set Salary** - Add your monthly income for budget tracking  
3. **Add Expenses** - Categorize your spending (Food, Transport, etc.)
4. **View Analytics** - Check charts and spending patterns
5. **Budget Management** - Track remaining budget vs spending

## 🎯 Key Components

- **Dashboard** - Main overview with charts and summaries
- **SalaryManager** - Monthly salary input and breakdown  
- **ExpenseCharts** - Visual spending analytics
- **ThemeToggle** - Dark/Light mode switcher

Your Rush Finance app is ready to use! 🎉
