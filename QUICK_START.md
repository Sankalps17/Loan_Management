# 🚀 Quick Start Guide - Loan Management System

## ✅ Prerequisites Check

Before starting, verify you have:
- ✅ Java 17+ installed
- ✅ Node.js installed
- ✅ Maven installed

---

## 🎯 Start the Application (2 Easy Steps)

### **Step 1: Start Backend (Terminal 1)**

```bash
# Navigate to server directory
cd C:\Users\sanka\OneDrive\Desktop\Haniah\server

# Run Spring Boot
mvn spring-boot:run
```

**✅ Wait for this message:**
```
Tomcat started on port 8080 (http) with context path '/'
Started LoanManagementServerApplication in 4.09 seconds
```

**Keep this terminal open!**

---

### **Step 2: Start Frontend (Terminal 2)**

Open a **NEW terminal** (don't close the first one):

```bash
# Navigate to project root
cd C:\Users\sanka\OneDrive\Desktop\Haniah

# Start Vite dev server
npm run dev
```

**✅ Wait for this message:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 🌐 Open the Application

### **Open your browser and go to:**
```
http://localhost:5173
```

---

## 🧪 Test the Integration

### **Test 1: Sign Up**
1. Click "Create Account" or navigate to `/signup`
2. Fill in:
   - **Full Name:** John Doe
   - **Email:** john@example.com
   - **Password:** password123
   - **Role:** User
3. Click "Sign Up"
4. ✅ Should see: "Signup successful. You are now logged in."
5. ✅ Should be on: `/dashboard`

### **Test 2: Logout**
1. Click "Logout" button
2. ✅ Should see: "You have been signed out."
3. ✅ Should be on: `/login`

### **Test 3: Login**
1. Enter credentials:
   - **Email:** john@example.com
   - **Password:** password123
2. Click "Login"
3. ✅ Should see: "Welcome back, John!"
4. ✅ Should be on: `/dashboard`

---

## 🔍 Verify Data in Database (Optional)

While both servers are running:

1. **Open:** `http://localhost:8080/h2-console`
2. **Connection Settings:**
   - JDBC URL: `jdbc:h2:mem:loan_db`
   - Username: `sa`
   - Password: `password`
3. **Click:** "Connect"
4. **Run SQL:**
   ```sql
   SELECT * FROM users;
   ```
5. ✅ You should see your registered user!

---

## 📱 Available Pages

| URL | Page | Auth Required | Role |
|-----|------|--------------|------|
| `/` | Welcome | ❌ | Public |
| `/login` | Login | ❌ | Public |
| `/signup` | Sign Up | ❌ | Public |
| `/dashboard` | User Dashboard | ✅ | USER |
| `/apply-loan` | Apply for Loan | ✅ | USER |
| `/approved-loans` | My Loans | ✅ | USER |
| `/emi-tracker` | EMI Tracker | ✅ | USER |
| `/repayment-table` | Repayment | ✅ | USER |
| `/admin` | Admin Dashboard | ✅ | ADMIN |

---

## 🛑 Stop the Application

### **Stop Frontend (Terminal 2):**
Press `Ctrl + C`

### **Stop Backend (Terminal 1):**
Press `Ctrl + C`

---

## 🐛 Common Issues & Solutions

### **Issue: Port 8080 already in use**
**Solution:** Kill the process or change backend port in `application.yml`

### **Issue: Port 5173 already in use**
**Solution:** Kill the process or let Vite use next available port

### **Issue: "Failed to connect to server"**
**Solution:** Make sure backend is running (Step 1)

### **Issue: CORS error in browser console**
**Solution:** Verify CORS is configured in `SecurityConfig.java` for `http://localhost:5173`

---

## 📊 What's Working

### ✅ **Backend (Spring Boot)**
- User registration with BCrypt password hashing
- JWT token generation (access + refresh)
- User authentication
- Protected API endpoints
- H2 in-memory database
- Database tables: `users`, `home_loan_applications`, `emi_schedule`, `loan_documents`

### ✅ **Frontend (React + Vite)**
- User signup with backend integration
- User login with JWT tokens
- Token storage in localStorage
- Protected routes (redirect to login)
- User dashboard
- Logout functionality

### ⏳ **Still Using Dummy Data**
- Loan applications (not yet connected to backend)
- Loan approvals (not yet connected to backend)
- EMI tracking (not yet connected to backend)

---

## 📞 Need Help?

1. **Check backend logs** in Terminal 1
2. **Check browser console** (F12 → Console)
3. **Check network requests** (F12 → Network → XHR)
4. **Verify database** in H2 Console

---

## 🎉 Success!

If you can:
- ✅ Sign up a new user
- ✅ See the user in H2 database
- ✅ Logout
- ✅ Login with the same credentials
- ✅ Access the dashboard

**Your authentication system is working perfectly!** 🚀

---

**Happy Testing!** 🎊
