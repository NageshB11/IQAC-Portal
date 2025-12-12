# 🐙 How to Push Your Code to GitHub

Your project is now structured correctly and ready for GitHub. Follow these steps to upload it.

## 1. Initialize Git (If not already done)
Open your terminal in the main project folder (`iqacportalproject1`) and run:
```bash
git init
```

## 2. Add All Files
Stage all your changes for commit:
```bash
git add .
```
*Note: This respects the `.gitignore` file, so sensitive files like `.env` and `node_modules` will automatically be excluded.*

## 3. Commit Your Changes
Save your current state:
```bash
git commit -m "Initial commit: Restructured project into frontend and backend"
```

## 4. Connect to GitHub
1.  Go to [GitHub.com](https://github.com) and create a **New Repository**.
2.  Name it (e.g., `iqac-portal`).
3.  **Do not** check "Add a README" or "Add .gitignore" (you already have them).
4.  Copy the URL of your new repository (e.g., `https://github.com/YOUR_USERNAME/iqac-portal.git`).

## 5. Push to GitHub
Run these commands in your terminal (replace the URL with yours):
```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/iqac-portal.git
git push -u origin main
```

---

## ✅ Verification
Refresh your GitHub repository page. You should see:
*   📁 `frontend` folder
*   📁 `backend` folder
*   📄 `README.md`
*   📄 `DEPLOYMENT_GUIDE.md`
*   📄 `render.yaml`
*   📄 `netlify.toml`

You should **NOT** see:
*   ❌ `node_modules` folders
*   ❌ `.env` files
