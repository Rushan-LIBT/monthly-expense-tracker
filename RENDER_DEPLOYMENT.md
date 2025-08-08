# 🚀 Deploy Rush Finance to Render

This guide will help you deploy your Rush Finance app to Render with both backend API and frontend static site hosting.

## 📋 Prerequisites

- GitHub account (to connect with Render)
- Render account (free tier is sufficient)
- MongoDB Atlas connection string (already configured)

## 🏗️ Deployment Steps

### Step 1: Push to GitHub

1. **Create a new GitHub repository:**
   - Go to github.com and create a new repository
   - Name it: `rush-finance`
   - Make it public (required for free Render tier)

2. **Push your code to GitHub:**
   ```bash
   cd "C:\Users\thavi\Desktop\Finance_Rushan\monthly-expense-tracker"
   git init
   git add .
   git commit -m "Initial commit - Rush Finance ready for deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/rush-finance.git
   git push -u origin main
   ```

### Step 2: Deploy Backend API to Render

1. **Go to Render Dashboard:**
   - Visit [render.com](https://render.com)
   - Sign in/up with your GitHub account

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your `rush-finance` repository

3. **Configure Backend Service:**
   ```
   Name: rush-finance-api
   Region: Oregon (US West) or closest to you
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

4. **Set Environment Variables:**
   Click "Advanced" → "Add Environment Variable":
   ```
   MONGODB_URI = mongodb+srv://rushan:rushan1234@cluster0.sluz1rc.mongodb.net/FinanceDB?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET = expense-tracker-secret-key-2024
   NODE_ENV = production
   ```

5. **Deploy Backend:**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Your backend URL: `https://finance-backend-iela.onrender.com`

### Step 3: Deploy Frontend to Render

1. **Create New Static Site:**
   - In Render Dashboard, click "New +" → "Static Site"
   - Connect same GitHub repository

2. **Configure Frontend Service:**
   ```
   Name: monthly-expense-tracker-app
   Region: Oregon (US West) or closest to you
   Branch: main
   Root Directory: (leave blank - root of repository)
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

3. **Set Environment Variables:**
   Add this environment variable:
   ```
   VITE_API_URL = https://finance-backend-iela.onrender.com/api
   ```

4. **Deploy Frontend:**
   - Click "Create Static Site"
   - Wait for deployment (5-10 minutes)

### Step 4: Update Backend CORS (if needed)

If you encounter CORS errors, update your backend environment variables:
1. Go to your backend service in Render dashboard
2. Click "Environment"
3. Add this variable:
   ```
   FRONTEND_URL = https://YOUR-FRONTEND-URL.onrender.com
   ```
4. The service will automatically redeploy

## 🎯 Final Configuration

### Your Deployed URLs:
- **Backend API**: `https://finance-backend-iela.onrender.com`
- **Frontend App**: `https://rush-finance-app.onrender.com`

### Test Your Deployment:
1. Visit your frontend URL
2. Try logging in with: `rushan@libt.co.uk` / `password123`
3. Test adding expenses and updating salary

## 🔧 Environment Variables Summary

### Backend (.env):
```env
MONGODB_URI=mongodb+srv://rushan:rushan1234@cluster0.sluz1rc.mongodb.net/FinanceDB?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=expense-tracker-secret-key-2024
NODE_ENV=production
FRONTEND_URL=https://rush-finance-app.onrender.com
```

### Frontend (Render Environment):
```env
VITE_API_URL=https://finance-backend-iela.onrender.com/api
```

## ⚡ Performance Notes

- **Free Tier Limitations**: Services may "spin down" after 15 minutes of inactivity
- **First Load**: May take 30-60 seconds to wake up
- **Solution**: Upgrade to paid tier for always-on services

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure FRONTEND_URL is set correctly in backend
2. **Build Failures**: Check Node.js version compatibility
3. **API Connection**: Verify VITE_API_URL is correct in frontend
4. **Database Connection**: Ensure MongoDB URI is correct

### Debug Commands:
```bash
# Check backend logs in Render dashboard
# Check frontend build logs in Render dashboard
# Test API directly: https://your-api.onrender.com/api/profile
```

## 🎉 Success!

Once deployed, your Monthly Expense Tracker will be live on the internet!

- ✅ Professional hosting on Render
- ✅ MongoDB Atlas database
- ✅ Automatic HTTPS
- ✅ Global CDN distribution
- ✅ Automatic deployments from GitHub

**Share your live app with anyone in the world!** 🌍