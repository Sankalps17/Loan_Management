# 🔗 Frontend-Backend Integration Guide

## ✅ What's Been Updated

### **1. AuthContext (`src/context/AuthContext.jsx`)**
- **Removed** dummy `users.json` seed data
- **Added** REST API integration with Spring Boot backend
- **Implemented** JWT token storage in localStorage:
  - `lms.active-user` - User profile data
  - `lms.access-token` - JWT access token (15 min)
  - `lms.refresh-token` - JWT refresh token (7 days)
- **Async functions** for `login()` and `signup()`
- **Error handling** for network failures

### **2. authReducer (`src/reducers/authReducer.js`)**
- **Added** `accessToken` and `refreshToken` to state
- **Added** `loading` state for API calls
- **Updated** all actions to handle tokens

### **3. Login Page (`src/pages/Login.jsx`)**
- **Changed** `handleSubmit` to `async`
- **Waits** for API response before navigation

### **4. Signup Page (`src/pages/Signup.jsx`)**
- **Changed** `handleSubmit` to `async`
- **Waits** for API response before navigation

---

## 🧪 Testing the Integration

### **Prerequisites**
1. ✅ Backend running on `http://localhost:8080`
2. ✅ Frontend running on `http://localhost:5173` (or 3000)

---

### **Test 1: Signup New User**

1. **Start your React app:**
   ```bash
   cd C:\Users\sanka\OneDrive\Desktop\Haniah
   npm run dev
   ```

2. **Open browser:** `http://localhost:5173`

3. **Navigate to Signup page**

4. **Fill in the form:**
   - Full Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
   - Role: `User` (note: backend stores role as uppercase `USER`)

5. **Click "Sign Up"**

6. **Expected behavior:**
   - ✅ API call to `POST http://localhost:8080/api/auth/signup`
   - ✅ Backend creates user with BCrypt-hashed password
   - ✅ Backend returns JWT tokens
   - ✅ Frontend fetches user profile
   - ✅ User is logged in automatically
   - ✅ Navigated to `/dashboard`
   - ✅ Green snackbar: "Signup successful. You are now logged in."

7. **Check localStorage** (F12 → Application → Local Storage):
   ```
   lms.active-user: {"id":"...", "fullName":"John Doe", "email":"john@example.com", "role":"USER"}
   lms.access-token: "eyJhbGciOiJIUzI1NiJ9..."
   lms.refresh-token: "eyJhbGciOiJIUzI1NiJ9..."
   ```

---

### **Test 2: Logout & Login**

1. **Click "Logout"** (from Navbar or Dashboard)

2. **Expected behavior:**
   - ✅ localStorage cleared
   - ✅ Navigated to `/login`
   - ✅ Blue snackbar: "You have been signed out."

3. **Login with same credentials:**
   - Email: `john@example.com`
   - Password: `password123`

4. **Click "Login"**

5. **Expected behavior:**
   - ✅ API call to `POST http://localhost:8080/api/auth/login`
   - ✅ Backend validates password (BCrypt comparison)
   - ✅ Backend returns JWT tokens
   - ✅ Frontend fetches user profile
   - ✅ Navigated to `/dashboard`
   - ✅ Green snackbar: "Welcome back, John!"

---

### **Test 3: Protected Routes**

1. **Logout if logged in**

2. **Manually navigate to:** `http://localhost:5173/dashboard`

3. **Expected behavior:**
   - ✅ Redirected to `/login`
   - ✅ After login, redirected back to `/dashboard`

---

### **Test 4: Admin Role** (Optional)

1. **Manually create admin user in H2 database:**
   - Open: `http://localhost:8080/h2-console`
   - JDBC URL: `jdbc:h2:mem:loan_db`
   - Username: `sa`, Password: `password`
   - Run SQL:
     ```sql
     UPDATE users SET role = 'ADMIN' WHERE email = 'john@example.com';
     ```

2. **Logout and login again**

3. **Navigate to:** `http://localhost:5173/admin`

4. **Expected behavior:**
   - ✅ Access granted (admin-only route)
   - ✅ Admin dashboard loads

---

## 🐛 Troubleshooting

### **Issue: "Failed to connect to server"**
**Symptoms:** Red snackbar on login/signup  
**Cause:** Backend not running or CORS issue  
**Solution:**
1. Verify backend is running: `http://localhost:8080`
2. Check terminal for Spring Boot logs
3. Verify CORS config in `SecurityConfig.java` allows `http://localhost:5173`

### **Issue: "Invalid credentials"**
**Symptoms:** Red snackbar after login  
**Cause:** Wrong email/password or user doesn't exist  
**Solution:**
1. Try signing up with a new email first
2. Check H2 database to verify user exists:
   ```sql
   SELECT * FROM users WHERE email = 'your-email@example.com';
   ```

### **Issue: Network error in browser console**
**Symptoms:** `net::ERR_CONNECTION_REFUSED` or CORS error  
**Cause:** Backend not running or wrong URL  
**Solution:**
1. Start backend: `cd server && mvn spring-boot:run`
2. Verify API base URL in `AuthContext.jsx` is `http://localhost:8080/api`

### **Issue: Redirect loop after login**
**Symptoms:** Keeps redirecting to login  
**Cause:** Token not saved or invalid  
**Solution:**
1. Clear localStorage (F12 → Application → Clear storage)
2. Check browser console for errors
3. Verify `accessToken` is present in localStorage after login

---

## 📊 What's Different from Before

| Feature | Before (Dummy Data) | After (Backend API) |
|---------|-------------------|-------------------|
| User Storage | `src/data/users.json` | PostgreSQL/H2 database |
| Password | Plain text comparison | BCrypt hashing |
| Authentication | Client-side only | JWT tokens |
| Session | localStorage user object | JWT access token |
| API Calls | None | RESTful HTTP requests |
| Security | None | Stateless, signed tokens |

---

## 🎯 Current Integration Status

### ✅ **Fully Integrated**
- User signup (registration)
- User login (authentication)
- JWT token storage
- Protected routes
- Logout functionality
- User profile display

### ⏳ **Still Using Dummy Data** (Not Changed)
- Loan applications (`src/context/LoanContext.jsx`)
- Loan approvals/rejections
- EMI tracking
- Admin dashboard statistics

These loan features still use the local JSON files (`src/data/loans.json`). They will work for demo purposes but won't persist to the backend database.

---

## 🚀 Running the Full Application

### **Terminal 1 - Backend:**
```bash
cd C:\Users\sanka\OneDrive\Desktop\Haniah\server
mvn spring-boot:run
```
**Wait for:** "Started LoanManagementServerApplication"

### **Terminal 2 - Frontend:**
```bash
cd C:\Users\sanka\OneDrive\Desktop\Haniah
npm run dev
```
**Wait for:** "Local: http://localhost:5173"

### **Open Browser:**
`http://localhost:5173`

---

## 📝 API Endpoints Being Used

### **From Frontend:**

```javascript
// Signup
POST http://localhost:8080/api/auth/signup
Body: { fullName, email, password }
Response: { accessToken, refreshToken, tokenType }

// Login
POST http://localhost:8080/api/auth/login
Body: { email, password }
Response: { accessToken, refreshToken, tokenType }

// Get Profile
GET http://localhost:8080/api/user/profile
Headers: { Authorization: "Bearer <access-token>" }
Response: { id, fullName, email, role, createdAt }
```

---

## 🔍 Debugging Tips

### **1. Check Backend Logs**
Look at the terminal where `mvn spring-boot:run` is running:
```
2025-10-16 INFO  --- [nio-8080-exec-1] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring DispatcherServlet 'dispatcherServlet'
```

### **2. Check Frontend Network Tab**
Open DevTools (F12) → Network → XHR:
- Look for requests to `localhost:8080/api/auth/*`
- Check request payload and response

### **3. Check Console Errors**
Open DevTools (F12) → Console:
- Red errors indicate problems
- Look for "CORS", "401 Unauthorized", or network errors

### **4. Verify Data in Database**
1. Open: `http://localhost:8080/h2-console`
2. Connect with: `jdbc:h2:mem:loan_db` / `sa` / `password`
3. Run:
   ```sql
   SELECT id, full_name, email, role, created_at FROM users;
   ```

---

## ✅ Success Checklist

- [ ] Backend running on port 8080
- [ ] Frontend running on port 5173
- [ ] Can signup new user
- [ ] User appears in H2 database
- [ ] Can logout
- [ ] Can login with same credentials
- [ ] Tokens stored in localStorage
- [ ] Dashboard loads after login
- [ ] Protected routes work
- [ ] Logout clears tokens

---

**Status:** ✅ Authentication fully integrated with backend!  
**Next:** Test the flow and confirm everything works before implementing loan endpoints.
