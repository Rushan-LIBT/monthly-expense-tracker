@echo off
echo ===================================
echo  🚀 MONTHLY EXPENSE TRACKER 🚀
echo ===================================
echo.

echo 🛠️  Killing any existing processes...
taskkill /F /IM node.exe > nul 2>&1
timeout /t 2 > nul

echo 📡 Starting Backend Server (MongoDB)...
cd backend
start "Backend API Server" cmd /k "node server.js"

echo ⏰ Waiting for backend to start...
timeout /t 5 > nul

echo 🌐 Starting Frontend React App...
cd ..
start "Frontend React App" cmd /k "npm run dev"

echo.
echo ✅ BOTH SERVERS STARTED!
echo.
echo 📍 Access your application at:
echo    Frontend: Check the React terminal for the port (usually 5173-5177)
echo    Backend:  http://localhost:3001/api
echo.
echo 🔐 Login Credentials:
echo    Email: rushan@libt.co.uk
echo    Password: password123
echo.
echo 💡 Tip: If login doesn't work:
echo    1. Check browser console for errors (F12)
echo    2. Try refreshing the page
echo    3. Clear browser cache/localStorage
echo.
pause