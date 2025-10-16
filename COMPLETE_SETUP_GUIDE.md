# Complete Setup & Deployment Guide - Home Loan Management System

## 🎯 Quick Answer to Your Questions

### **What is the password?**
There is NO default password. You need to **create accounts**:
1. **First User Account:** Go to http://localhost:5173/signup and create an account
2. **Admin Account:** Use the signup API with role "ADMIN" (see instructions below)
3. **Test Password Format:** Any password with min 6 characters (e.g., `Test123!`)

### **Why only dashboard showing?**
The system was using **dummy JSON data**. Now it's **fully connected to the backend MySQL database** with all features implemented!

---

## 📋 What's Been Implemented

### ✅ **Backend (Spring Boot + MySQL)**
- [x] User Authentication (JWT + BCrypt)
- [x] Loan Application System
- [x] Document Upload/Download
- [x] EMI Schedule Generation
- [x] EMI Payment Tracking
- [x] Admin Dashboard with Statistics
- [x] Email Notifications
- [x] Role-Based Access Control
- [x] MySQL Database Integration
- [x] Complete REST API (21 endpoints)

### ✅ **Frontend (React + Vite)**
- [x] User Signup/Login
- [x] Apply for Loan Form
- [x] View Loan Applications
- [x] Upload Documents
- [x] Track EMI Payments
- [x] Admin Dashboard
- [x] Approve/Reject Loans
- [x] **All connected to Backend API**

---

## 🚀 Setup Instructions

### **Prerequisites**
- ✅ Java 17 or 20 (you have 20.0.2)
- ✅ Maven 3.x
- ✅ MySQL 8.0+
- ✅ Node.js 16+ (for frontend)

---

### **Step 1: Setup MySQL Database**

**Option A: Using MySQL Command Line**
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE loan_management_db;

# Verify
SHOW DATABASES;

# Exit
exit
```

**Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. Connect to local server
3. Click "Create New Schema"
4. Name: `loan_management_db`
5. Apply

**Configure MySQL Credentials:**
If your MySQL username/password is different from `root/root`, update:
`server/src/main/resources/application.yml`
```yaml
spring:
  datasource:
    username: your_mysql_username
    password: your_mysql_password
```

---

### **Step 2: Start Backend Server**

```bash
# Navigate to server directory
cd server

# Clean and build
mvn clean install

# Start server
mvn spring-boot:run
```

**Backend starts on:** `http://localhost:8080`

**Verify Backend is Running:**
```bash
curl http://localhost:8080/api/auth/signup
```
Should return 400 (validation error) - meaning the endpoint is accessible.

---

### **Step 3: Start Frontend**

Open a **NEW terminal** (keep backend running):

```bash
# Navigate to project root
cd c:\Users\sanka\OneDrive\Desktop\Haniah

# Install dependencies (if not done)
npm install

# Start frontend
npm run dev
```

**Frontend starts on:** `http://localhost:5173`

---

### **Step 4: Create Your First Account**

**Method 1: Via Frontend (Easiest)**
1. Open browser: http://localhost:5173
2. Click "Sign Up"
3. Fill form:
   - Full Name: `Your Name`
   - Email: `you@example.com`
   - Password: `YourPassword123!`
4. Click "Sign Up"
5. You'll be logged in automatically

**Method 2: Via Postman/API**
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Your Name",
    "email": "you@example.com",
    "password": "YourPassword123!"
  }'
```

---

### **Step 5: Create Admin Account**

**Important:** Frontend signup creates USER role only. For ADMIN:

**Using PowerShell:**
```powershell
$body = @{
    fullName = "Admin User"
    email = "admin@loanmanagement.com"
    password = "Admin123!"
    role = "ADMIN"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/auth/signup" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

**Using cURL (Git Bash or WSL):**
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Admin User",
    "email": "admin@loanmanagement.com",
    "password": "Admin123!",
    "role": "ADMIN"
  }'
```

**Using Postman:**
1. Import the Postman collection: `Loan_Management_System_Postman_Collection.json`
2. Use the "Signup (Admin)" request
3. Modify email/password as needed

---

## 🎮 Testing Complete System

### **Test Flow 1: User Journey**

1. **Signup as User**
   - Go to http://localhost:5173/signup
   - Create account
   - Login automatically

2. **Apply for Loan**
   - Click "Apply for Loan"
   - Fill form:
     - Loan Amount: `5000000`
     - Tenure: `240` (20 years)
     - Interest Rate: `8.5`
     - Property Value: `6000000`
     - Purpose: `Home purchase`
   - Submit

3. **View Your Loans**
   - Go to Dashboard
   - See your loan application with status "SUBMITTED"

4. **Upload Documents**
   - Click on loan
   - Upload required documents (salary slip, ID proof, etc.)

5. **Track EMI Schedule**
   - View EMI schedule (generated automatically)
   - See payment due dates

---

### **Test Flow 2: Admin Journey**

1. **Login as Admin**
   - Use admin account created in Step 5
   - Email: `admin@loanmanagement.com`
   - Password: `Admin123!`

2. **View Pending Loans**
   - Admin Dashboard shows statistics
   - Click "Pending Loans"

3. **Review Loan Application**
   - Click on a loan
   - View applicant details
   - View uploaded documents

4. **Approve Loan**
   - Click "Approve"
   - User receives email notification
   - EMI schedule activated

5. **View Statistics**
   - Total users
   - Total loans
   - Approved/rejected/pending count
   - Total loan amount disbursed

---

### **Test Flow 3: EMI Payment**

1. **Login as User** (with approved loan)
2. **Go to EMI Tracker**
3. **View Pending EMIs**
4. **Click "Pay EMI"**
5. **Enter Transaction ID** (e.g., `TXN123456`)
6. **Confirm Payment**
7. **Receive Email Confirmation**

---

## 📚 Testing with Postman

### **Import Collection**
1. Open Postman
2. Click "Import"
3. Select: `Loan_Management_System_Postman_Collection.json`
4. Collection imported with 21 API requests

### **Set Variables**
1. Click on "Loan Management System API" collection
2. Go to "Variables" tab
3. Current values:
   - `baseUrl`: http://localhost:8080/api ✅
   - `accessToken`: (auto-filled after login)
   - `refreshToken`: (auto-filled after login)
   - `userId`: (auto-filled after signup)
   - `loanId`: (auto-filled after loan application)

### **Test Sequence**
Run requests in this order:
1. **Signup (User)** → Saves token automatically
2. **Login** → Updates token
3. **Get Profile** → Verifies authentication
4. **Apply for Loan** → Saves loanId
5. **Get My Loans** → View your loans
6. **Get EMI Schedule** → See payment schedule
7. **Signup (Admin)** → Create admin (new terminal)
8. **Login** → Switch to admin
9. **Get Dashboard Stats** → Admin data
10. **Approve Loan** → Approve user's loan

---

## 🗄️ Database Verification

### **Check Tables Created**
```sql
-- Connect to MySQL
mysql -u root -p loan_management_db

-- Show tables
SHOW TABLES;

-- Expected output:
-- +--------------------------------+
-- | Tables_in_loan_management_db  |
-- +--------------------------------+
-- | users                          |
-- | home_loan_applications         |
-- | loan_documents                 |
-- | emi_schedule                   |
-- +--------------------------------+

-- View users
SELECT id, full_name, email, role FROM users;

-- View loans
SELECT id, amount, tenure_months, status FROM home_loan_applications;

-- View EMI schedule
SELECT loan_id, due_date, amount, payment_status FROM emi_schedule;
```

---

## 📧 Email Configuration (Optional)

To enable email notifications:

1. **Edit `application.yml`:**
```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: your-email@gmail.com
    password: your-app-password  # NOT regular password!
```

2. **Generate Gmail App Password:**
   - Go to Google Account → Security
   - Enable 2-Factor Authentication
   - Go to "App Passwords"
   - Generate password for "Mail"
   - Use that password in `application.yml`

3. **Restart Backend**

**Test Email:**
- Apply for a loan
- Check your email for "Loan Application Received" notification
- Admin approves loan
- Check email for "Loan Approved" notification

---

## 🔍 Troubleshooting

### **Problem: Backend won't start**
**Error:** `com.mysql.cj.jdbc.exceptions.CommunicationsException`
**Solution:**
- Verify MySQL is running: `mysql --version`
- Check credentials in `application.yml`
- Ensure database exists: `SHOW DATABASES;`

---

### **Problem: Frontend shows empty dashboard**
**Symptoms:** No loans showing, empty screens
**Solution:**
- Check browser console (F12) for errors
- Verify backend is running: http://localhost:8080
- Check `.env` file has: `VITE_API_BASE_URL=http://localhost:8080/api`
- Clear browser cache and reload

---

### **Problem: "Network Error" when applying loan**
**Solution:**
- Check backend logs for errors
- Verify authentication token in localStorage
- Try logout and login again
- Check CORS is enabled (already configured)

---

### **Problem: Can't upload documents**
**Error:** `File size exceeds maximum`
**Solution:**
- Max file size: 10MB
- Supported formats: PDF, JPG, PNG
- Check `application.yml` multipart settings

---

### **Problem: EMI schedule not generating**
**Solution:**
- Check loan status is APPROVED
- Verify backend logs for errors
- Check `emi_schedule` table in MySQL

---

## 📝 API Endpoints Quick Reference

### **Authentication**
- POST `/api/auth/signup` - Register
- POST `/api/auth/login` - Login
- POST `/api/auth/refresh` - Refresh token

### **User**
- GET `/api/user/profile` - Get profile

### **Loans**
- POST `/api/loans/apply` - Apply for loan
- GET `/api/loans/my-loans` - My loans
- GET `/api/loans/{id}` - Loan details
- GET `/api/loans` - All loans (Admin)

### **Documents**
- POST `/api/documents/upload` - Upload
- GET `/api/documents/loan/{loanId}` - Get by loan
- GET `/api/documents/{id}/download` - Download
- DELETE `/api/documents/{id}` - Delete (Admin)

### **EMI**
- GET `/api/emi/schedule/{loanId}` - Get schedule
- GET `/api/emi/pending` - Pending EMIs
- PUT `/api/emi/{id}/pay` - Pay EMI

### **Admin**
- GET `/api/admin/dashboard` - Statistics
- GET `/api/admin/loans` - All loans
- GET `/api/admin/loans/pending` - Pending loans
- PUT `/api/admin/loans/{id}/approve` - Approve
- PUT `/api/admin/loans/{id}/reject` - Reject
- PUT `/api/admin/loans/{id}/status` - Update status

**Full Documentation:** See `API_COMPLETE_DOCUMENTATION.md`

---

## 🎯 Feature Checklist

### **Authentication & Authorization**
- [x] User signup with email validation
- [x] Password hashing (BCrypt)
- [x] JWT token generation (15min access, 7 day refresh)
- [x] Role-based access (USER, ADMIN)
- [x] Protected routes
- [x] Token refresh mechanism

### **Loan Management**
- [x] Apply for home loan
- [x] Dynamic interest rate calculation
- [x] Property value validation
- [x] Tenure selection (6-360 months)
- [x] Purpose description
- [x] Application status tracking
- [x] View all user loans
- [x] Loan details with EMI schedule

### **Document Management**
- [x] Upload multiple document types
- [x] File validation (size, type)
- [x] Secure file storage
- [x] Download documents
- [x] Admin can delete documents
- [x] Document type enum (SALARY_SLIP, ID_PROOF, etc.)

### **EMI System**
- [x] Auto-generate EMI schedule on loan approval
- [x] EMI calculation formula (reducing balance)
- [x] Monthly due dates
- [x] Payment status tracking
- [x] Mark EMI as paid
- [x] Transaction ID recording
- [x] Pending EMIs dashboard

### **Admin Features**
- [x] Dashboard with statistics
- [x] View all loans
- [x] Filter pending loans
- [x] Approve loans
- [x] Reject loans with reason
- [x] View user details
- [x] View documents
- [x] Loan portfolio management

### **Email Notifications**
- [x] Loan application confirmation
- [x] Loan status updates (approved/rejected)
- [x] EMI payment confirmation
- [x] EMI reminder (implementation ready)

### **Database**
- [x] MySQL integration
- [x] Auto-create tables (Hibernate DDL)
- [x] UUID primary keys
- [x] Proper relationships (One-to-Many)
- [x] Enum types for status fields
- [x] Timestamp tracking

---

## 💡 Development Tips

### **Backend Development**
- Logs location: Console output
- Hot reload: Not enabled (restart after changes)
- Test single endpoint: Use Postman
- Debug: Add breakpoints in IntelliJ/Eclipse

### **Frontend Development**
- Hot reload: ✅ Enabled (Vite)
- React DevTools: Install browser extension
- Network tab: F12 → Network (see API calls)
- Console errors: F12 → Console

### **Database Management**
- GUI Tool: MySQL Workbench
- Command line: `mysql -u root -p loan_management_db`
- Reset database: `DROP DATABASE loan_management_db; CREATE DATABASE loan_management_db;`
- View logs: Check backend console

---

## 📦 Project Structure

```
Haniah/
├── server/                          # Backend (Spring Boot)
│   ├── src/main/java/.../
│   │   ├── controller/             # REST controllers
│   │   ├── service/                # Business logic
│   │   ├── repository/             # Database access
│   │   ├── entity/                 # JPA entities
│   │   ├── dto/                    # Data transfer objects
│   │   ├── config/                 # Security config
│   │   └── exception/              # Error handling
│   ├── src/main/resources/
│   │   └── application.yml         # Configuration
│   └── pom.xml                     # Maven dependencies
├── src/                            # Frontend (React)
│   ├── context/                    # State management
│   │   ├── AuthContext.jsx        # 🔄 Connected to API
│   │   └── LoanContext.jsx        # 🔄 Connected to API
│   ├── pages/                      # Page components
│   ├── components/                 # Reusable components
│   └── utils/                      # Helper functions
├── .env                            # 🆕 Frontend environment vars
├── Loan_Management_System_Postman_Collection.json  # 🆕 API tests
├── API_COMPLETE_DOCUMENTATION.md   # 🆕 Full API docs
└── COMPLETE_SETUP_GUIDE.md         # 🆕 This file
```

---

## 🚀 What's Different Now?

### **Before (Old)**
- ❌ Used `loans.json` dummy data
- ❌ No real database
- ❌ No document upload
- ❌ No EMI tracking
- ❌ No admin approval workflow
- ❌ Data lost on refresh

### **After (Current)**
- ✅ **MySQL database** with persistent data
- ✅ **All 21 REST APIs** working
- ✅ **Real loan applications** saved to database
- ✅ **Document upload** to file system
- ✅ **EMI auto-calculation** and tracking
- ✅ **Admin dashboard** with real statistics
- ✅ **Email notifications** for all actions
- ✅ **Proper authentication** with JWT
- ✅ **Complete frontend integration**

---

## 🎉 Ready to Use!

Your system is now **fully functional** with:
- ✅ 21 Working API endpoints
- ✅ MySQL database integration
- ✅ Complete loan lifecycle (Apply → Review → Approve → EMI Payment)
- ✅ Document management
- ✅ Admin & user dashboards
- ✅ Email notifications
- ✅ Postman collection for testing
- ✅ Comprehensive documentation

### **Quick Start Command Summary:**
```bash
# Terminal 1: Start MySQL (if not running)
mysql -u root -p
CREATE DATABASE loan_management_db;

# Terminal 2: Start Backend
cd server
mvn spring-boot:run

# Terminal 3: Start Frontend
cd c:\Users\sanka\OneDrive\Desktop\Haniah
npm run dev

# Browser: Open application
http://localhost:5173
```

---

## 📞 Need Help?

1. **Check Logs:**
   - Backend: Console where mvn spring-boot:run is running
   - Frontend: Browser console (F12)
   - MySQL: Check MySQL logs

2. **Common Issues:**
   - See Troubleshooting section above
   - Check `API_COMPLETE_DOCUMENTATION.md`

3. **Test with Postman:**
   - Import collection
   - Run test sequences
   - Check response codes

---

**System Status: ✅ FULLY OPERATIONAL**

All features implemented, tested, and documented!
