# 🧪 API Testing Guide - Quick Reference

## Test Environment
- **Base URL:** `http://localhost:8080`
- **Server Status:** ✅ Running (check terminal for "Started LoanManagementServerApplication")

---

## 1️⃣ Register a New User

### Request
```bash
POST http://localhost:8080/api/auth/signup
Content-Type: application/json

{
  "fullName": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

### cURL Command
```bash
curl -X POST http://localhost:8080/api/auth/signup -H "Content-Type: application/json" -d "{\"fullName\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

### Expected Response (200 OK)
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJpc3MiOiJsb2FuLW1hbmFnZXIiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoiVVNFUiIsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE2OTc0NzIwMDAsImV4cCI6MTY5NzQ3MjkwMH0...",
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJpc3MiOiJsb2FuLW1hbmFnZXIiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoiVVNFUiIsInR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNjk3NDcyMDAwLCJleHAiOjE2OTgwNzY4MDB9...",
  "tokenType": "Bearer"
}
```

**💾 Save the `accessToken` for next requests!**

---

## 2️⃣ Login (Existing User)

### Request
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### cURL Command
```bash
curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

### Expected Response (200 OK)
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "tokenType": "Bearer"
}
```

---

## 3️⃣ Get User Profile (Protected Endpoint)

### Request
```bash
GET http://localhost:8080/api/user/profile
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

### cURL Command
**Replace `YOUR_ACCESS_TOKEN` with the actual token from signup/login:**
```bash
curl -X GET http://localhost:8080/api/user/profile -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Expected Response (200 OK)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "fullName": "Test User",
  "email": "test@example.com",
  "role": "USER",
  "createdAt": "2025-10-15T18:30:45.123+05:30"
}
```

### If Token is Missing/Invalid (401 Unauthorized)
```json
{
  "timestamp": "2025-10-15T18:35:00.000+00:00",
  "status": 401,
  "error": "Unauthorized",
  "path": "/api/user/profile"
}
```

---

## 4️⃣ Refresh Access Token

### Request
```bash
POST http://localhost:8080/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
}
```

### cURL Command
```bash
curl -X POST http://localhost:8080/api/auth/refresh -H "Content-Type: application/json" -d "{\"refreshToken\":\"YOUR_REFRESH_TOKEN_HERE\"}"
```

### Expected Response (200 OK)
```json
{
  "accessToken": "NEW_ACCESS_TOKEN...",
  "refreshToken": "NEW_REFRESH_TOKEN...",
  "tokenType": "Bearer"
}
```

---

## 5️⃣ Access Admin Dashboard (Admin Only)

### Request
```bash
GET http://localhost:8080/api/admin/dashboard
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

### cURL Command
```bash
curl -X GET http://localhost:8080/api/admin/dashboard -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

### Expected Response (200 OK for ADMIN role)
```json
{
  "message": "Admin dashboard - implement your statistics here",
  "totalUsers": 0,
  "totalLoans": 0,
  "pendingApprovals": 0
}
```

### If User Role is USER (403 Forbidden)
```json
{
  "timestamp": "2025-10-15T18:40:00.000+00:00",
  "status": 403,
  "error": "Forbidden",
  "path": "/api/admin/dashboard"
}
```

**Note:** To create an admin user, manually update the database or modify the signup logic.

---

## 🧪 Testing with PowerShell (Windows)

### Signup
```powershell
$body = @{
    fullName = "Test User"
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/auth/signup" -Method Post -Body $body -ContentType "application/json"
```

### Login
```powershell
$body = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $body -ContentType "application/json"
$token = $response.accessToken
Write-Host "Access Token: $token"
```

### Get Profile
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:8080/api/user/profile" -Method Get -Headers $headers
```

---

## 📊 Common HTTP Status Codes

| Code | Meaning | When You'll See It |
|------|---------|-------------------|
| 200 | OK | Successful request |
| 400 | Bad Request | Validation errors, invalid credentials |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions (e.g., USER trying to access /admin) |
| 404 | Not Found | Endpoint doesn't exist |
| 500 | Internal Server Error | Server-side error (check logs) |

---

## 🔍 Viewing Data in H2 Console

1. **Open browser:** `http://localhost:8080/h2-console`
2. **Connect with:**
   - JDBC URL: `jdbc:h2:mem:loan_db`
   - Username: `sa`
   - Password: `password`
3. **Run queries:**
   ```sql
   -- View all users
   SELECT * FROM users;
   
   -- View with formatted dates
   SELECT id, full_name, email, role, created_at FROM users;
   
   -- Check specific user
   SELECT * FROM users WHERE email = 'test@example.com';
   ```

---

## 🐛 Troubleshooting

### Problem: "Connection refused"
**Solution:** Server not running. Start it:
```bash
cd C:\Users\sanka\OneDrive\Desktop\Haniah\server
mvn spring-boot:run
```

### Problem: "Email already registered"
**Solution:** User exists. Either:
1. Use a different email for signup
2. Use login endpoint instead
3. Clear database (restart server - H2 is in-memory)

### Problem: "Invalid credentials"
**Solution:** 
- Check email and password are correct
- Ensure user was registered successfully
- Check database in H2 console

### Problem: "Token expired"
**Solution:** Use the refresh token endpoint to get a new access token

### Problem: cURL not found on Windows
**Solution:** Use PowerShell commands above or install Git Bash / WSL

---

## 📝 Test Checklist

- [ ] Start server: `mvn spring-boot:run`
- [ ] Register user: POST `/api/auth/signup`
- [ ] Login: POST `/api/auth/login`
- [ ] Copy access token from response
- [ ] Get profile: GET `/api/user/profile` with token
- [ ] Refresh token: POST `/api/auth/refresh`
- [ ] Verify data in H2 console

---

## 🎯 Quick Test Script (Copy-Paste)

```bash
# 1. Register
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Quick Test","email":"quick@test.com","password":"test123"}'

# 2. Login (copy the accessToken from response)
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"quick@test.com","password":"test123"}'

# 3. Get profile (replace TOKEN with actual token)
curl -X GET http://localhost:8080/api/user/profile \
  -H "Authorization: Bearer TOKEN"
```

---

**Status:** ✅ Ready to test! Server running on `http://localhost:8080`
