# 🚀 IQAC Portal - Complete Deployment Guide

## 📋 Table of Contents
1. [Quick Overview](#quick-overview)
2. [Recommended Deployment Options](#recommended-deployment-options)
3. [Step-by-Step Deployment](#step-by-step-deployment)
4. [Post-Deployment Checklist](#post-deployment-checklist)

---

## 🎯 Quick Overview

Your IQAC Portal consists of:
- **Frontend**: Next.js application (TypeScript/React)
- **Backend**: Node.js/Express server (JavaScript)
- **Database**: MongoDB

**Best Deployment Strategy:**
- Frontend → **Vercel** (Free, optimized for Next.js)
- Backend → **Render** or **Railway** (Free tier available)
- Database → **MongoDB Atlas** (Free tier available)

---

## 🌟 Recommended Deployment Options

### **Option 1: Free Tier (Recommended for Testing)**
- **Frontend**: Vercel (Free)
- **Backend**: Render (Free)
- **Database**: MongoDB Atlas (Free - M0 cluster)
- **Cost**: $0/month
- **Best for**: Testing, small-scale deployment

### **Option 2: Production Ready**
- **Frontend**: Vercel (Pro - $20/month)
- **Backend**: Render (Starter - $7/month) or AWS/DigitalOcean
- **Database**: MongoDB Atlas (M10 - $57/month)
- **Cost**: ~$84/month
- **Best for**: Production use with good traffic

### **Option 3: Self-Hosted**
- **Server**: DigitalOcean/AWS/Azure VPS ($5-20/month)
- **Database**: MongoDB on same server or Atlas
- **Cost**: $5-50/month
- **Best for**: Full control, custom setup

---

## 🚀 Step-by-Step Deployment

### **STEP 1: Prepare Your Database (MongoDB Atlas)**

#### 1.1 Create MongoDB Atlas Account
```
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with email or Google
4. Verify your email
```

#### 1.2 Create a Cluster
```
1. Click "Build a Database"
2. Choose "M0 FREE" tier
3. Select cloud provider: AWS
4. Select region: Choose closest to your users (e.g., Mumbai for India)
5. Cluster name: "iqac-portal-cluster"
6. Click "Create"
```

#### 1.3 Create Database User
```
1. Go to "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Authentication Method: Password
4. Username: iqac_admin
5. Password: Generate a strong password (SAVE THIS!)
6. Database User Privileges: "Atlas Admin"
7. Click "Add User"
```

#### 1.4 Configure Network Access
```
1. Go to "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   OR add specific IPs for better security
4. Click "Confirm"
```

#### 1.5 Get Connection String
```
1. Go to "Database" → Click "Connect"
2. Choose "Connect your application"
3. Driver: Node.js, Version: 5.5 or later
4. Copy the connection string:
   mongodb+srv://iqac_admin:<password>@iqac-portal-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority

5. Replace <password> with your actual password
6. Add database name at the end:
   mongodb+srv://iqac_admin:yourpassword@iqac-portal-cluster.xxxxx.mongodb.net/iqac-portal?retryWrites=true&w=majority
```

#### 1.6 Seed Initial Data
```bash
# Update server/.env with your MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://iqac_admin:yourpassword@iqac-portal-cluster.xxxxx.mongodb.net/iqac-portal

# Run seed scripts locally first
cd server
node seed-departments-coordinators.js
node seed-institutional-events.js
node seed-professional-development.js
```

---

### **STEP 2: Deploy Backend (Render.com)**

#### 2.1 Prepare Backend Code
```bash
# Make sure server/package.json has correct start script
# It should have:
{
  "scripts": {
    "start": "node server.js"
  }
}
```

#### 2.2 Push Code to GitHub
```bash
# Initialize git (if not already done)
cd c:\Users\Nagesh\OneDrive\Desktop\iqacportalproject1
git init

# Create .gitignore
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
echo "server/.env" >> .gitignore
echo ".next/" >> .gitignore

# Add all files
git add .
git commit -m "Initial commit for deployment"

# Create GitHub repository
# Go to https://github.com/new
# Create repository: "iqac-portal"
# Don't initialize with README

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/iqac-portal.git
git branch -M main
git push -u origin main
```

#### 2.3 Deploy on Render
```
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - Name: iqac-portal-backend
   - Region: Singapore (closest to India)
   - Branch: main
   - Root Directory: server
   - Runtime: Node
   - Build Command: npm install
   - Start Command: npm start
   - Instance Type: Free

6. Add Environment Variables:
   Click "Advanced" → "Add Environment Variable"
   
   MONGODB_URI = mongodb+srv://iqac_admin:yourpassword@iqac-portal-cluster.xxxxx.mongodb.net/iqac-portal
   JWT_SECRET = your-super-secret-jwt-key-min-32-characters-long
   PORT = 10000
   NODE_ENV = production

7. Click "Create Web Service"
8. Wait for deployment (5-10 minutes)
9. Copy your backend URL: https://iqac-portal-backend.onrender.com
```

---

### **STEP 3: Deploy Frontend (Vercel)**

#### 3.1 Update Frontend Configuration
```bash
# Create .env.local in root directory
cd c:\Users\Nagesh\OneDrive\Desktop\iqacportalproject1
echo "NEXT_PUBLIC_API_URL=https://iqac-portal-backend.onrender.com" > .env.local
```

#### 3.2 Update API Calls (if needed)
Make sure all API calls use the environment variable:
```typescript
// Should be like this:
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
```

#### 3.3 Deploy on Vercel
```
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: ./
   - Build Command: npm run build (auto-detected)
   - Output Directory: .next (auto-detected)

6. Add Environment Variables:
   NEXT_PUBLIC_API_URL = https://iqac-portal-backend.onrender.com

7. Click "Deploy"
8. Wait for deployment (3-5 minutes)
9. Your site will be live at: https://iqac-portal.vercel.app
```

---

### **STEP 4: Configure CORS on Backend**

Update `server/server.js` to allow your Vercel domain:

```javascript
// Update CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://iqac-portal.vercel.app',
    'https://your-custom-domain.com' // if you have one
  ],
  credentials: true
};

app.use(cors(corsOptions));
```

Commit and push changes:
```bash
git add server/server.js
git commit -m "Update CORS for production"
git push
```

Render will auto-deploy the update.

---

## ✅ Post-Deployment Checklist

### **1. Test Your Deployment**

#### Test Backend:
```bash
# Test health endpoint
curl https://iqac-portal-backend.onrender.com/api/health

# Should return: {"status":"ok"}
```

#### Test Frontend:
```
1. Visit https://iqac-portal.vercel.app
2. Try logging in as admin
3. Check if dashboard loads
4. Test report generation
```

### **2. Create Admin Account**
```bash
# SSH into Render or use Render Shell
# Or run locally and it will update MongoDB Atlas

cd server
node create-admin.js
```

### **3. Security Checklist**
- [ ] Changed default admin password
- [ ] Set strong JWT_SECRET (min 32 characters)
- [ ] MongoDB user has strong password
- [ ] CORS configured for specific domains only
- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] Environment variables not in code
- [ ] .env files in .gitignore

### **4. Performance Optimization**
- [ ] Enable caching on Vercel
- [ ] Add database indexes in MongoDB
- [ ] Enable compression on backend
- [ ] Optimize images (if any)

### **5. Monitoring Setup**
```bash
# Add to server/server.js for basic logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
```

---

## 🔧 Alternative Deployment Options

### **Option A: Railway.app (Backend Alternative)**
```
1. Go to https://railway.app
2. Sign up with GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables
6. Deploy
```

### **Option B: DigitalOcean App Platform**
```
1. Go to https://www.digitalocean.com
2. Create account
3. "Create" → "Apps"
4. Connect GitHub
5. Configure and deploy
```

### **Option C: Self-Hosted on VPS**

#### Setup Ubuntu Server:
```bash
# 1. SSH into server
ssh root@your-server-ip

# 2. Update system
apt update && apt upgrade -y

# 3. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# 4. Install PM2
npm install -g pm2

# 5. Clone repository
git clone https://github.com/YOUR_USERNAME/iqac-portal.git
cd iqac-portal

# 6. Setup backend
cd server
npm install
nano .env  # Add your environment variables
pm2 start server.js --name iqac-backend
pm2 startup
pm2 save

# 7. Setup frontend
cd ..
npm install
npm run build
pm2 start npm --name iqac-frontend -- start

# 8. Setup Nginx reverse proxy
apt install nginx
nano /etc/nginx/sites-available/iqac-portal
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/iqac-portal /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# Setup SSL with Let's Encrypt
apt install certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

---

## 🌐 Custom Domain Setup

### **For Vercel (Frontend)**:
```
1. Go to Vercel Dashboard → Your Project
2. Settings → Domains
3. Add your domain: iqac.yourdomain.com
4. Follow DNS configuration instructions
5. Add CNAME record in your domain registrar:
   Name: iqac
   Value: cname.vercel-dns.com
```

### **For Render (Backend)**:
```
1. Go to Render Dashboard → Your Service
2. Settings → Custom Domain
3. Add: api.yourdomain.com
4. Add CNAME record:
   Name: api
   Value: your-service.onrender.com
```

---

## 📊 Monitoring & Maintenance

### **Monitor Application Health**:
```bash
# Check Render logs
# Go to Render Dashboard → Your Service → Logs

# Check Vercel logs
# Go to Vercel Dashboard → Your Project → Deployments → View Logs
```

### **Database Backups**:
```
1. MongoDB Atlas → Clusters
2. Click on your cluster
3. Backup tab
4. Enable "Continuous Backup" (paid feature)
   OR
5. Use "Cloud Backup" (free tier has limited backups)
```

### **Update Application**:
```bash
# Make changes locally
git add .
git commit -m "Update description"
git push

# Both Vercel and Render will auto-deploy!
```

---

## 🆘 Troubleshooting

### **Issue: Backend not connecting to database**
```bash
# Check MongoDB Atlas IP whitelist
# Make sure 0.0.0.0/0 is added or your Render IP

# Check connection string format
# Should be: mongodb+srv://username:password@cluster.mongodb.net/database
```

### **Issue: Frontend can't reach backend**
```bash
# Check CORS settings in server/server.js
# Check NEXT_PUBLIC_API_URL in Vercel environment variables
# Check backend is running on Render
```

### **Issue: "Application Error" on Render**
```bash
# Check Render logs
# Usually means:
# 1. Missing environment variables
# 2. Build failed
# 3. Port configuration issue
```

---

## 💰 Cost Breakdown

### **Free Tier (Total: $0/month)**
- Vercel: Free (Hobby plan)
- Render: Free (512MB RAM, sleeps after 15min inactivity)
- MongoDB Atlas: Free (M0 - 512MB storage)
- **Limitations**: Backend sleeps, slower performance, limited storage

### **Production Tier (Total: ~$84/month)**
- Vercel Pro: $20/month
- Render Starter: $7/month (always on)
- MongoDB Atlas M10: $57/month
- **Benefits**: Always on, better performance, more storage

---

## 🎉 You're Done!

Your IQAC Portal is now live at:
- **Frontend**: https://iqac-portal.vercel.app
- **Backend**: https://iqac-portal-backend.onrender.com
- **Database**: MongoDB Atlas (cloud)

**Next Steps**:
1. Share the URL with users
2. Create coordinator accounts
3. Monitor usage and performance
4. Set up regular backups
5. Consider custom domain

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com

**Last Updated**: December 11, 2025
