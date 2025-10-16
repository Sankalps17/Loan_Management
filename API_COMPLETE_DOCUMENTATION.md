# Loan Management System - Complete API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

---

## Table of Contents
1. [Authentication APIs](#authentication-apis)
2. [User APIs](#user-apis)
3. [Loan APIs](#loan-apis)
4. [Document APIs](#document-apis)
5. [EMI APIs](#emi-apis)
6. [Admin APIs](#admin-apis)
7. [Database Schema](#database-schema)
8. [Error Handling](#error-handling)
9. [Testing Guide](#testing-guide)

---

## Authentication APIs

### 1. **User Signup**
**Endpoint:** `POST /api/auth/signup`  
**Access:** Public  
**Description:** Register a new user account

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Response (201 Created):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "role": "USER",
    "createdAt": "2025-10-16T10:00:00Z"
  }
}
```

**Validation:**
- `fullName`: Required, 2-100 characters
- `email`: Required, valid email format
- `password`: Required, min 6 characters

---

### 2. **Login**
**Endpoint:** `POST /api/auth/login`  
**Access:** Public  
**Description:** Authenticate user and get access tokens

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "role": "USER"
  }
}
```

---

### 3. **Refresh Token**
**Endpoint:** `POST /api/auth/refresh`  
**Access:** Public  
**Description:** Get new access token using refresh token

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## User APIs

### 4. **Get User Profile**
**Endpoint:** `GET /api/user/profile`  
**Access:** Authenticated (USER/ADMIN)  
**Description:** Get current user's profile information

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "role": "USER",
  "createdAt": "2025-10-16T10:00:00Z",
  "updatedAt": null
}
```

---

## Loan APIs

### 5. **Apply for Loan**
**Endpoint:** `POST /api/loans/apply`  
**Access:** Authenticated (USER/ADMIN)  
**Description:** Submit a new home loan application

**Request Body:**
```json
{
  "amount": 5000000.00,
  "tenureMonths": 240,
  "interestRate": 8.5,
  "propertyValue": 6000000.00,
  "purpose": "Home purchase in Bangalore"
}
```

**Field Constraints:**
- `amount`: Min 10,000, Max 50,000,000 (in your currency)
- `tenureMonths`: Min 6, Max 360 months (30 years)
- `interestRate`: Min 0.1%, Max 20%
- `propertyValue`: Optional, should be >= loan amount
- `purpose`: Required, max 500 characters

**Response (201 Created):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "applicant": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "fullName": "John Doe",
    "email": "john.doe@example.com"
  },
  "amount": 5000000.00,
  "propertyValue": 6000000.00,
  "tenureMonths": 240,
  "interestRate": 8.5,
  "purpose": "Home purchase in Bangalore",
  "status": "SUBMITTED",
  "submittedAt": "2025-10-16T10:30:00Z",
  "updatedAt": null
}
```

---

### 6. **Get My Loans**
**Endpoint:** `GET /api/loans/my-loans`  
**Access:** Authenticated (USER/ADMIN)  
**Description:** Get all loans for the authenticated user

**Response (200 OK):**
```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "amount": 5000000.00,
    "tenureMonths": 240,
    "interestRate": 8.5,
    "status": "SUBMITTED",
    "submittedAt": "2025-10-16T10:30:00Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440002",
    "amount": 3000000.00,
    "tenureMonths": 180,
    "interestRate": 8.25,
    "status": "APPROVED",
    "submittedAt": "2025-09-10T08:20:00Z"
  }
]
```

---

### 7. **Get Loan by ID**
**Endpoint:** `GET /api/loans/{loanId}`  
**Access:** Authenticated (USER/ADMIN)  
**Description:** Get details of a specific loan

**Response (200 OK):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "applicant": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "role": "USER"
  },
  "amount": 5000000.00,
  "propertyValue": 6000000.00,
  "tenureMonths": 240,
  "interestRate": 8.5,
  "purpose": "Home purchase in Bangalore",
  "status": "SUBMITTED",
  "submittedAt": "2025-10-16T10:30:00Z",
  "updatedAt": null,
  "documents": [],
  "emiSchedule": []
}
```

---

### 8. **Get All Loans (Admin Only)**
**Endpoint:** `GET /api/loans`  
**Access:** Admin Only  
**Description:** Get all loan applications in the system

**Response (200 OK):**
```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "applicant": {
      "fullName": "John Doe",
      "email": "john.doe@example.com"
    },
    "amount": 5000000.00,
    "status": "SUBMITTED",
    "submittedAt": "2025-10-16T10:30:00Z"
  }
]
```

---

## Document APIs

### 9. **Upload Document**
**Endpoint:** `POST /api/documents/upload`  
**Access:** Authenticated (USER/ADMIN)  
**Content-Type:** `multipart/form-data`  
**Description:** Upload a document for loan application

**Form Data:**
- `loanId` (string, UUID): The loan application ID
- `documentType` (enum): One of: `SALARY_SLIP`, `ID_PROOF`, `ADDRESS_PROOF`, `PROPERTY_DOCUMENTS`, `BANK_STATEMENT`
- `file` (file): The document file (PDF, JPG, PNG - Max 10MB)

**Response (201 Created):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440003",
  "loan": {
    "id": "660e8400-e29b-41d4-a716-446655440001"
  },
  "documentType": "SALARY_SLIP",
  "fileName": "salary_slip_oct_2025.pdf",
  "filePath": "/uploads/documents/abc123.pdf",
  "uploadedAt": "2025-10-16T11:00:00Z"
}
```

---

### 10. **Get Documents by Loan ID**
**Endpoint:** `GET /api/documents/loan/{loanId}`  
**Access:** Authenticated (USER/ADMIN)  
**Description:** Get all documents for a specific loan

**Response (200 OK):**
```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440003",
    "documentType": "SALARY_SLIP",
    "fileName": "salary_slip_oct_2025.pdf",
    "uploadedAt": "2025-10-16T11:00:00Z"
  },
  {
    "id": "770e8400-e29b-41d4-a716-446655440004",
    "documentType": "ID_PROOF",
    "fileName": "aadhar_card.pdf",
    "uploadedAt": "2025-10-16T11:05:00Z"
  }
]
```

---

### 11. **Download Document**
**Endpoint:** `GET /api/documents/{documentId}/download`  
**Access:** Authenticated (USER/ADMIN)  
**Description:** Download a specific document

**Response:** Binary file download with appropriate headers

---

### 12. **Delete Document (Admin)**
**Endpoint:** `DELETE /api/documents/{documentId}`  
**Access:** Admin Only  
**Description:** Delete a document from the system

**Response (204 No Content)**

---

## EMI APIs

### 13. **Get EMI Schedule**
**Endpoint:** `GET /api/emi/schedule/{loanId}`  
**Access:** Authenticated (USER/ADMIN)  
**Description:** Get complete EMI payment schedule for a loan

**Response (200 OK):**
```json
[
  {
    "id": "880e8400-e29b-41d4-a716-446655440005",
    "loan": {
      "id": "660e8400-e29b-41d4-a716-446655440001"
    },
    "dueDate": "2025-11-16",
    "amount": 38601.49,
    "paymentStatus": "PENDING",
    "transactionId": null
  },
  {
    "id": "880e8400-e29b-41d4-a716-446655440006",
    "dueDate": "2025-12-16",
    "amount": 38601.49,
    "paymentStatus": "PENDING",
    "transactionId": null
  }
]
```

**EMI Calculation Formula:**
```
EMI = [P × R × (1+R)^N] / [(1+R)^N-1]
Where:
P = Principal loan amount
R = Monthly interest rate (annual rate / 12 / 100)
N = Tenure in months
```

---

### 14. **Get Pending EMIs**
**Endpoint:** `GET /api/emi/pending`  
**Access:** Authenticated (USER/ADMIN)  
**Description:** Get all pending EMIs for the authenticated user

**Response (200 OK):**
```json
[
  {
    "id": "880e8400-e29b-41d4-a716-446655440005",
    "loan": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "amount": 5000000.00
    },
    "dueDate": "2025-11-16",
    "amount": 38601.49,
    "paymentStatus": "PENDING"
  }
]
```

---

### 15. **Pay EMI**
**Endpoint:** `PUT /api/emi/{emiId}/pay`  
**Access:** Authenticated (USER/ADMIN)  
**Description:** Mark an EMI as paid

**Request Body:**
```json
{
  "transactionId": "TXN123456789"
}
```

**Response (200 OK):**
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440005",
  "dueDate": "2025-11-16",
  "amount": 38601.49,
  "paymentStatus": "PAID",
  "transactionId": "TXN123456789"
}
```

---

## Admin APIs

### 16. **Get Admin Dashboard**
**Endpoint:** `GET /api/admin/dashboard`  
**Access:** Admin Only  
**Description:** Get dashboard statistics for admin

**Response (200 OK):**
```json
{
  "totalUsers": 150,
  "totalLoans": 45,
  "pendingLoans": 12,
  "approvedLoans": 28,
  "rejectedLoans": 5,
  "totalLoanAmount": 225000000.00,
  "approvedLoanAmount": 140000000.00
}
```

---

### 17. **Get All Loans (Admin)**
**Endpoint:** `GET /api/admin/loans`  
**Access:** Admin Only  
**Description:** Get all loan applications

**Response:** Same as "Get All Loans" endpoint

---

### 18. **Get Pending Loans**
**Endpoint:** `GET /api/admin/loans/pending`  
**Access:** Admin Only  
**Description:** Get all loans with SUBMITTED status

**Response (200 OK):**
```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "applicant": {
      "fullName": "John Doe",
      "email": "john.doe@example.com"
    },
    "amount": 5000000.00,
    "status": "SUBMITTED",
    "submittedAt": "2025-10-16T10:30:00Z"
  }
]
```

---

### 19. **Approve Loan**
**Endpoint:** `PUT /api/admin/loans/{loanId}/approve`  
**Access:** Admin Only  
**Description:** Approve a loan application

**Response (200 OK):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "status": "APPROVED",
  "updatedAt": "2025-10-16T12:00:00Z"
}
```

**Note:** Email notification sent to applicant automatically

---

### 20. **Reject Loan**
**Endpoint:** `PUT /api/admin/loans/{loanId}/reject`  
**Access:** Admin Only  
**Description:** Reject a loan application

**Request Body:**
```json
{
  "reason": "Insufficient income documentation"
}
```

**Response (200 OK):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "status": "REJECTED",
  "updatedAt": "2025-10-16T12:00:00Z"
}
```

---

### 21. **Update Loan Status**
**Endpoint:** `PUT /api/admin/loans/{loanId}/status`  
**Access:** Admin Only  
**Description:** Update loan status with custom status

**Request Body:**
```json
{
  "status": "APPROVED",
  "remarks": "All documents verified"
}
```

**Available Statuses:**
- `SUBMITTED`
- `UNDER_REVIEW`
- `APPROVED`
- `REJECTED`
- `CLOSED`

**Response (200 OK):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "status": "APPROVED",
  "updatedAt": "2025-10-16T12:00:00Z"
}
```

---

## Database Schema

### Tables Overview

**1. users**
- id (UUID, Primary Key)
- full_name (VARCHAR)
- email (VARCHAR, Unique)
- password (VARCHAR, BCrypt hashed)
- role (ENUM: USER, ADMIN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**2. home_loan_applications**
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key → users.id)
- amount (DECIMAL(15,2))
- tenure_months (INTEGER)
- property_value (DECIMAL(15,2))
- interest_rate (DECIMAL(5,2))
- purpose (VARCHAR(500))
- status (ENUM: SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, CLOSED)
- submitted_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**3. loan_documents**
- id (UUID, Primary Key)
- loan_id (UUID, Foreign Key → home_loan_applications.id)
- document_type (ENUM: SALARY_SLIP, ID_PROOF, ADDRESS_PROOF, PROPERTY_DOCUMENTS, BANK_STATEMENT)
- file_name (VARCHAR)
- file_path (VARCHAR)
- uploaded_at (TIMESTAMP)

**4. emi_schedule**
- id (UUID, Primary Key)
- loan_id (UUID, Foreign Key → home_loan_applications.id)
- due_date (DATE)
- amount (DECIMAL(15,2))
- payment_status (ENUM: PENDING, PAID, OVERDUE)
- transaction_id (VARCHAR)

---

## Error Handling

### Standard Error Response Format
```json
{
  "timestamp": "2025-10-16T12:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed for field 'amount'",
  "path": "/api/loans/apply"
}
```

### Common HTTP Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful GET/PUT request |
| 201 | Created | Successful POST request |
| 204 | No Content | Successful DELETE request |
| 400 | Bad Request | Invalid request data/validation error |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | User doesn't have required role |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource (e.g., email exists) |
| 500 | Internal Server Error | Server-side error |

---

## Testing Guide

### Step 1: Setup MySQL Database
```bash
# Start MySQL
mysql -u root -p

# Create database
CREATE DATABASE loan_management_db;

# Verify
SHOW DATABASES;
```

### Step 2: Start Backend Server
```bash
cd server
mvn clean install
mvn spring-boot:run
```

Server starts on: `http://localhost:8080`

### Step 3: Test Authentication Flow
```bash
# 1. Signup
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "Test123!"
  }'

# 2. Login (save the accessToken)
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'

# 3. Get Profile (use token from login)
curl http://localhost:8080/api/user/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Step 4: Test Loan Application
```bash
# Apply for loan
curl -X POST http://localhost:8080/api/loans/apply \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000000,
    "tenureMonths": 240,
    "interestRate": 8.5,
    "propertyValue": 6000000,
    "purpose": "Home purchase"
  }'
```

### Step 5: Import Postman Collection
1. Open Postman
2. Click "Import"
3. Select `Loan_Management_System_Postman_Collection.json`
4. Update the `accessToken` variable after login
5. Run requests in sequence

---

## Password for Testing
The system uses BCrypt password hashing. For testing:

**Test Account 1 (User):**
- Email: `test@example.com`
- Password: `Test123!`

**Test Account 2 (Admin):**
- Email: `admin@loanmanagement.com`
- Password: `Admin123!`

**Note:** These accounts need to be created via the `/auth/signup` endpoint first.

---

## API List Summary

| # | Method | Endpoint | Access | Description |
|---|--------|----------|--------|-------------|
| 1 | POST | /api/auth/signup | Public | User registration |
| 2 | POST | /api/auth/login | Public | User login |
| 3 | POST | /api/auth/refresh | Public | Refresh access token |
| 4 | GET | /api/user/profile | User/Admin | Get user profile |
| 5 | POST | /api/loans/apply | User/Admin | Apply for loan |
| 6 | GET | /api/loans/my-loans | User/Admin | Get user's loans |
| 7 | GET | /api/loans/{id} | User/Admin | Get loan details |
| 8 | GET | /api/loans | Admin | Get all loans |
| 9 | POST | /api/documents/upload | User/Admin | Upload document |
| 10 | GET | /api/documents/loan/{loanId} | User/Admin | Get loan documents |
| 11 | GET | /api/documents/{id}/download | User/Admin | Download document |
| 12 | DELETE | /api/documents/{id} | Admin | Delete document |
| 13 | GET | /api/emi/schedule/{loanId} | User/Admin | Get EMI schedule |
| 14 | GET | /api/emi/pending | User/Admin | Get pending EMIs |
| 15 | PUT | /api/emi/{id}/pay | User/Admin | Pay EMI |
| 16 | GET | /api/admin/dashboard | Admin | Dashboard stats |
| 17 | GET | /api/admin/loans | Admin | All loans |
| 18 | GET | /api/admin/loans/pending | Admin | Pending loans |
| 19 | PUT | /api/admin/loans/{id}/approve | Admin | Approve loan |
| 20 | PUT | /api/admin/loans/{id}/reject | Admin | Reject loan |
| 21 | PUT | /api/admin/loans/{id}/status | Admin | Update loan status |

**Total Endpoints: 21**

---

## Email Notifications

The system sends automatic email notifications for:
1. **Loan Application Received** - When user applies for loan
2. **Loan Status Update** - When admin approves/rejects
3. **EMI Payment Confirmation** - When EMI is marked as paid
4. **EMI Reminder** - Before due date (can be scheduled)

To configure email:
1. Update `application.yml`:
```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: your-email@gmail.com
    password: your-app-password
```

2. For Gmail: Enable "App Password" in Google Account settings

---

## Support & Contact
For issues or questions:
- Check logs: `server/logs/application.log`
- Database console: `http://localhost:8080/h2-console` (development only)
- API documentation: This file

---

**Version:** 1.0.0  
**Last Updated:** October 16, 2025
