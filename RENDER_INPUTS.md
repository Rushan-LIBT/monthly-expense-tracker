# 📝 Rush Finance - Render Deployment Inputs

## 🖥️ Web Service (Backend API) Configuration

### Basic Settings:
```
Name: rush-finance-api
Region: Oregon (US West) [or closest to you]
Branch: main
Root Directory: backend
Runtime: Node
```

### Build & Start:
```
Build Command: npm install
Start Command: npm start
```

### Instance Type:
```
Instance Type: Free
```

### Environment Variables:
Click "Advanced" → "Add Environment Variable" and add these **4 variables**:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://rushan:rushan1234@cluster0.sluz1rc.mongodb.net/FinanceDB?retryWrites=true&w=majority&appName=Cluster0` |
| `JWT_SECRET` | `expense-tracker-secret-key-2024` |
| `NODE_ENV` | `production` |
| `PORT` | `10000` (Render's default port) |

### Auto-Deploy:
```
☑️ Auto-Deploy: Yes (recommended)
```

---

## 🌐 Static Site (Frontend App) Configuration  

### Basic Settings:
```
Name: rush-finance-app
Region: Oregon (US West) [or closest to you] 
Branch: main
Root Directory: [LEAVE BLANK - root of repo]
```

### Build & Publish:
```
Build Command: npm install && npm run build
Publish Directory: dist
```

### Environment Variables:
Add **1 variable** (⚠️ **IMPORTANT**: Replace with YOUR actual backend URL):

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://rush-finance-api.onrender.com/api` |

⚠️ **Note**: You'll get the actual backend URL after deploying the Web Service first.

### Auto-Deploy:
```
☑️ Auto-Deploy: Yes (recommended)
```

---

## 🔄 Step-by-Step Order:

### Step 1: Deploy Backend (Web Service) FIRST
1. Use Web Service inputs above
2. Wait for deployment to complete
3. **Copy the backend URL** (e.g., `https://rush-finance-api.onrender.com`)

### Step 2: Deploy Frontend (Static Site) SECOND  
1. Use Static Site inputs above
2. Replace `VITE_API_URL` with your actual backend URL from Step 1
3. Deploy

---

## 📋 Quick Reference Card:

### Web Service (Backend):
```
✅ Type: Web Service
✅ Runtime: Node
✅ Root Directory: backend  
✅ Build: npm install
✅ Start: npm start
✅ Env Variables: 4 (MONGODB_URI, JWT_SECRET, NODE_ENV, PORT)
```

### Static Site (Frontend):
```
✅ Type: Static Site
✅ Runtime: Static
✅ Root Directory: [blank]
✅ Build: npm install && npm run build
✅ Publish: dist
✅ Env Variables: 1 (VITE_API_URL)
```

---

## 🎯 Expected Results:

After both deployments:
- **Backend URL**: `https://rush-finance-api.onrender.com`
- **Frontend URL**: `https://rush-finance-app.onrender.com`
- **Test Login**: `rushan@libt.co.uk` / `password123`

## ⚠️ Common Mistakes to Avoid:

1. **Don't** put "backend" in Static Site root directory
2. **Don't** forget to update VITE_API_URL with real backend URL
3. **Do** deploy Web Service first, then Static Site
4. **Do** wait for each deployment to complete before testing

Copy and paste these exact values into Render! 🚀