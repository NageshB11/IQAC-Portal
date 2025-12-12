# 🚀 Deployment Guide: Netlify (Frontend) & Render (Backend)

This guide will walk you through deploying your IQAC Portal. Since your project is split into `frontend` and `backend` directories, we have added configuration files (`netlify.toml` and `render.yaml`) to make this process easier.

---

## 🛑 Prerequisites

1.  **GitHub Account**: You must push this code to a GitHub repository.
2.  **MongoDB Atlas Account**: You need a cloud database. Your local MongoDB (`localhost`) **will not work** on the cloud.
3.  **Netlify Account**: For frontend deployment.
4.  **Render Account**: For backend deployment.

---

## 📦 Step 1: Set up MongoDB Atlas (Database)

1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a **Free Cluster (M0)**.
3.  **Create a Database User**:
    *   Go to "Database Access".
    *   Add a new user (e.g., `admin`).
    *   Set a password (write this down!).
    *   Role: "Atlas Admin" or "Read and write to any database".
4.  **Allow Network Access**:
    *   Go to "Network Access".
    *   Add IP Address -> "Allow Access from Anywhere" (`0.0.0.0/0`).
5.  **Get Connection String**:
    *   Go to "Database" -> "Connect" -> "Drivers".
    *   Copy the connection string. It looks like:
        `mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`
    *   **Replace `<password>`** with the actual password you just created.

---

## 🔙 Step 2: Deploy Backend to Render

1.  Login to [Render.com](https://render.com).
2.  Click **"New"** -> **"Web Service"**.
3.  Connect your GitHub repository.
4.  Scroll down to **"Root Directory"** and enter: `backend`
    *   *Note: Because we added `render.yaml`, Render might detect it automatically perfectly. If you use "Blueprints", select that option instead.*
5.  **Build Command:** `npm install`
6.  **Start Command:** `npm start`
7.  **Environment Variables** (Click "Advanced" > "Add Environment Variable"):
    *   `MONGODB_URI`: Paste your MongoDB Atlas connection string from Step 1.
    *   `JWT_SECRET`: Enter a long, random secret code (e.g., `mySuperSecretKey123!@#`).
    *   `NODE_ENV`: `production`
8.  Click **"Create Web Service"**.
9.  Wait for deployment to finish. Copy your **Service URL** (e.g., `https://iqac-backend.onrender.com`).

---

## 🎨 Step 3: Deploy Frontend to Netlify

1.  Login to [Netlify](https://www.netlify.com).
2.  Click **"Add new site"** -> **"Import an existing project"**.
3.  Connect with **GitHub** and select your repository.
4.  **Configuration**:
    *   Netlify should detect the `netlify.toml` file we added.
    *   **Base directory**: `frontend`
    *   **Build command**: `npm run build`
    *   **Publish directory**: `.next`
5.  **Environment Variables**:
    *   Click **"Add environment variables"**.
    *   Key: `NEXT_PUBLIC_API_URL`
    *   Value: **Paste your Render Backend URL** (from Step 2) **WITHOUT** the trailing slash (e.g., `https://iqac-backend.onrender.com`).
6.  Click **"Deploy iqac-portal"**.

---

## 🔍 Step 4: Final Checks

1.  Open your Netlify URL.
2.  Try to **Login**.
    *   *Note: Since this is a fresh database, your admin account won't exist yet!*
3.  **Seed the Cloud Database**:
    *   You can't run the seed scripts directly on Render easily.
    *   **Option A (Recommended):** Connect to your Atlas database from your *local* machine and run the scripts.
        1. Open your local `backend/.env` file.
        2. Replace `MONGODB_URI` with your **Atlas Connection String**.
        3. Run `node create-admin.js` in your local terminal.
        4. This will create the admin user in the *cloud* database.
    *   **Option B (API):** If you built an API route to seed data (we don't have one public), you could use that. Stick to Option A.

---

**🎉 Congratulations! Your IQAC Portal is live.**
