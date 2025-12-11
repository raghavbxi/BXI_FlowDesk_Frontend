# Frontend Troubleshooting Guide

## Common Issues and Solutions

### 1. Frontend Not Loading / Blank Screen

**Possible Causes:**
- Dependencies not installed
- Port already in use
- Build errors
- Browser console errors

**Solutions:**

1. **Reinstall Dependencies:**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check if Port 3000 is Available:**
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # If port is in use, change it in vite.config.js
   ```

3. **Clear Browser Cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Clear browser cache and cookies

4. **Check Browser Console:**
   - Open Developer Tools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

### 2. Module Not Found Errors

**Solution:**
```bash
cd frontend
npm install
```

### 3. MUI Date Picker Issues

If you see errors related to `@mui/x-date-pickers`:

```bash
cd frontend
npm install @mui/x-date-pickers dayjs
```

### 4. CORS Errors

Make sure backend is running on port 5000:
```bash
cd backend
npm run dev
```

### 5. Authentication Issues

Clear localStorage:
```javascript
// In browser console
localStorage.clear()
```

### 6. Vite Build Errors

```bash
cd frontend
npm run build
```

Check for specific error messages and fix accordingly.

## Quick Fix Commands

```bash
# Complete reset
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev

# Check for errors
npm run build
```

## Still Not Working?

1. Check Node.js version (should be v16+):
   ```bash
   node --version
   ```

2. Check if all files exist:
   - `frontend/src/main.jsx`
   - `frontend/src/App.jsx`
   - `frontend/index.html`
   - `frontend/vite.config.js`

3. Check browser console for specific error messages

4. Verify backend is running and accessible at `http://localhost:5000/api/health`

