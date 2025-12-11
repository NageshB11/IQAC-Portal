# IQAC Portal - Deployment Guide

## Production Checklist

- [ ] Change all default passwords
- [ ] Set strong JWT_SECRET
- [ ] Configure MongoDB with authentication
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Configure firewall rules
- [ ] Setup error logging
- [ ] Configure backups

## MongoDB Atlas (Recommended for Production)

### 1. Create Production Cluster

\`\`\`
1. Go to MongoDB Atlas
2. Create new cluster → M0 or higher
3. Enable automated backups
4. Enable encryption at rest
5. Configure IP whitelist
\`\`\`

### 2. Create Database User

\`\`\`
1. Database Access → Add New User
2. Create user with strong password
3. Assign Admin role (or custom)
4. Save credentials securely
\`\`\`

### 3. Get Connection String

\`\`\`
Connection → Drivers → Node.js
Copy connection string format:
mongodb+srv://user:password@cluster.xxxxx.mongodb.net/iqac-portal
\`\`\`

### 4. Update .env for Production

\`\`\`env
MONGODB_URI=mongodb+srv://user:password@cluster.xxxxx.mongodb.net/iqac-portal
JWT_SECRET=generate-a-random-string-min-32-chars
PORT=443
NODE_ENV=production
\`\`\`

## Vercel Deployment (Frontend)

\`\`\`bash
# 1. Push code to GitHub
git init
git add .
git commit -m "Initial commit"
git push -u origin main

# 2. Go to https://vercel.com
# 3. Click "New Project"
# 4. Import your GitHub repository
# 5. Configure environment variables:
#    - NEXT_PUBLIC_API_URL=your-backend-url

# 6. Deploy
\`\`\`

## Render/Heroku Deployment (Backend)

### Using Render (Easier)

\`\`\`bash
# 1. Push code to GitHub
# 2. Go to https://render.com
# 3. Create new "Web Service"
# 4. Connect GitHub repository
# 5. Configure:
#    - Build command: npm install
#    - Start command: npm start
# 6. Add environment variables:
#    - MONGODB_URI
#    - JWT_SECRET
#    - NODE_ENV=production
# 7. Deploy
\`\`\`

### Using AWS/GCP/DigitalOcean (VPS)

\`\`\`bash
# 1. SSH into server
ssh user@server-ip

# 2. Install Node.js
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install MongoDB
sudo apt-get install -y mongodb

# 4. Clone repository
git clone your-repo-url
cd iqac-portal/server

# 5. Install dependencies
npm install

# 6. Create .env
nano .env
# Add production credentials

# 7. Start with PM2 (process manager)
npm install -g pm2
pm2 start server.js --name "iqac-backend"
pm2 startup
pm2 save
\`\`\`

## Security Best Practices

1. **Environment Variables**: Never commit .env files
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Configure CORS for specific domains
4. **Rate Limiting**: Add rate limiting to API
5. **Input Validation**: Validate all user inputs
6. **SQL Injection**: Use MongoDB queries safely
7. **Backups**: Regular automated backups
8. **Monitoring**: Setup error tracking (Sentry)

## Monitoring & Logging

\`\`\`bash
# Using PM2 monitoring
pm2 logs iqac-backend

# Setup error tracking with Sentry
npm install @sentry/node
\`\`\`

## Database Backup

\`\`\`bash
# MongoDB Atlas: Automatic backups in dashboard

# Self-hosted MongoDB:
mongodump --db iqac-portal --out /backup/iqac-portal-backup

# Restore:
mongorestore --db iqac-portal /backup/iqac-portal-backup
