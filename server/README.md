# Loan Management System - Spring Boot Backend

## 📋 Overview

This is a **Spring Boot 3.3.4** REST API backend for a Loan Management System with JWT-based authentication. The system supports user registration, login, loan applications, and administrative functions.

---

## 🏗️ Architecture & Components

### **Technology Stack**
- **Java 17+** (running on Java 20.0.2)
- **Spring Boot 3.3.4**
- **Spring Security 6.3.3** (JWT authentication)
- **Spring Data JPA** (with Hibernate ORM)
- **H2 Database** (in-memory for development)
- **MySQL/PostgreSQL** support (configurable)
- **Maven** (build tool)
- **JJWT 0.11.5** (JSON Web Token library)

---

## 📁 Project Structure

```
server/
├── src/main/java/com/example/loanmanagement/
│   ├── LoanManagementServerApplication.java    # Main Spring Boot entry point
│   ├── config/
│   │   ├── SecurityConfig.java                  # Spring Security configuration
│   │   └── filter/
│   │       └── JwtAuthenticationFilter.java     # JWT token validation filter
│   ├── controller/
│   │   ├── AuthController.java                  # Authentication endpoints (signup/login/refresh)
│   │   ├── UserController.java                  # User profile endpoints
│   │   └── AdminController.java                 # Admin dashboard endpoints
│   ├── dto/
│   │   ├── AuthRequest.java                     # Login request payload
│   │   ├── AuthResponse.java                    # JWT token response
│   │   ├── SignupRequest.java                   # User registration payload
│   │   ├── LoanApplicationRequest.java          # Loan application payload
│   │   └── DocumentUploadRequest.java           # Document upload metadata
│   ├── entity/
│   │   ├── User.java                            # User entity (id, email, password, role)
│   │   ├── LoanApplication.java                 # Loan application entity
│   │   ├── EmiSchedule.java                     # EMI payment schedule
│   │   ├── LoanDocument.java                    # Uploaded loan documents
│   │   └── enums/
│   │       ├── Role.java                        # USER, ADMIN roles
│   │       ├── LoanStatus.java                  # Loan workflow statuses
│   │       ├── PaymentStatus.java               # EMI payment statuses
│   │       └── DocumentType.java                # Document categories
│   ├── repository/
│   │   ├── UserRepository.java                  # User database operations
│   │   ├── LoanApplicationRepository.java       # Loan CRUD operations
│   │   ├── EmiScheduleRepository.java           # EMI schedule queries
│   │   └── LoanDocumentRepository.java          # Document storage references
│   ├── service/
│   │   ├── AuthService.java                     # Authentication interface
│   │   ├── JwtService.java                      # JWT token operations interface
│   │   └── impl/
│   │       ├── AuthServiceImpl.java             # Login/signup business logic
│   │       └── JwtServiceImpl.java              # JWT generation/validation logic
│   └── exception/
│       └── GlobalExceptionHandler.java          # Centralized error handling
├── src/main/resources/
│   └── application.yml                          # Application configuration
└── pom.xml                                      # Maven dependencies
```

---

## 🔑 Key Features Implemented

### **1. JWT Authentication System**
- **Access Tokens**: 15-minute validity for API requests
- **Refresh Tokens**: 7-day validity for renewing access tokens
- **HS256 Algorithm**: HMAC-SHA256 signing with configurable secret
- **Stateless**: No server-side session storage

### **2. Spring Security Configuration**
- **Password Encryption**: BCrypt hashing (strength 10)
- **CORS Support**: Configured for `localhost:5173` (Vite) and `localhost:3000` (React)
- **Role-Based Access Control**:
  - Public: `/api/auth/**` (signup, login, refresh)
  - User: `/api/user/**` (authenticated users)
  - Admin: `/api/admin/**` (ADMIN role only)
- **H2 Console**: Enabled at `/h2-console` for development

### **3. Database Schema (JPA Entities)**
- **users**: User accounts with roles
- **home_loan_applications**: Loan applications with status tracking
- **emi_schedule**: Monthly EMI payment schedule
- **loan_documents**: References to uploaded documents

### **4. API Endpoints**

#### **Authentication Endpoints** (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | ❌ |
| POST | `/api/auth/login` | Login with email/password | ❌ |
| POST | `/api/auth/refresh` | Refresh access token | ❌ |

#### **User Endpoints** (`/api/user`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/user/profile` | Get current user profile | ✅ |

#### **Admin Endpoints** (`/api/admin`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/dashboard` | Admin statistics | ✅ (ADMIN only) |

---

## 🚀 How to Run the Application

### **Prerequisites**
1. **Java 17 or higher** installed
   ```bash
   java -version  # Should show Java 17+
   ```

2. **Maven 3.6+** installed
   ```bash
   mvn -version
   ```

### **Step 1: Navigate to Server Directory**
```bash
cd C:\Users\sanka\OneDrive\Desktop\Haniah\server
```

### **Step 2: Clean Build (Optional)**
```bash
mvn clean package -DskipTests
```

### **Step 3: Run the Application**
```bash
mvn spring-boot:run
```

**Expected Output:**
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/

 :: Spring Boot ::                (v3.3.4)

...
Tomcat started on port 8080 (http) with context path '/'
Started LoanManagementServerApplication in 4.09 seconds
```

✅ **Server is now running at:** `http://localhost:8080`

---

## 🧪 Testing the API

### **Using cURL**

#### **1. Register a New User**
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"fullName\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer"
}
```

#### **2. Login**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

#### **3. Get User Profile (Authenticated)**
```bash
curl -X GET http://localhost:8080/api/user/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "USER",
  "createdAt": "2025-10-15T18:30:00Z"
}
```

#### **4. Refresh Access Token**
```bash
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"YOUR_REFRESH_TOKEN_HERE\"}"
```

### **Using Postman**
1. Import the API collection (create one with above endpoints)
2. Set `Authorization` header: `Bearer <token>`
3. Test all endpoints

---

## ⚙️ Configuration Details

### **application.yml Explained**

```yaml
spring:
  datasource:
    url: jdbc:h2:mem:loan_db           # In-memory H2 database
    driver-class-name: org.h2.Driver
    username: sa
    password: password
  
  jpa:
    hibernate:
      ddl-auto: update                  # Auto-create tables from entities
    show-sql: true                      # Log SQL queries to console
    properties:
      hibernate:
        format_sql: true                # Pretty-print SQL
  
  h2:
    console:
      enabled: true                     # Enable H2 web console
      path: /h2-console                # Access at http://localhost:8080/h2-console

security:
  jwt:
    issuer: loan-manager
    access-token-validity: 900000       # 15 minutes in milliseconds
    refresh-token-validity: 604800000   # 7 days in milliseconds
    secret: YourSuperSecretJWTKeyThatIsAtLeast32CharactersLongForHS256Algorithm
```

### **🔐 Important: JWT Secret Configuration**

**Current Secret (Development Only):**
```
YourSuperSecretJWTKeyThatIsAtLeast32CharactersLongForHS256Algorithm
```

⚠️ **For Production:**
1. Generate a strong 256-bit (32+ character) secret:
   ```bash
   openssl rand -base64 32
   ```

2. Store it as an environment variable:
   ```yaml
   security:
     jwt:
       secret: ${JWT_SECRET}  # Read from environment
   ```

3. Set the environment variable:
   ```bash
   export JWT_SECRET="your-generated-secret-here"
   ```

---

## 🗄️ Database Access

### **H2 Console (Development)**
While the server is running, access the H2 database console:

**URL:** `http://localhost:8080/h2-console`

**Connection Settings:**
- **JDBC URL:** `jdbc:h2:mem:loan_db`
- **Username:** `sa`
- **Password:** `password`

You can view/query tables directly:
```sql
SELECT * FROM users;
SELECT * FROM home_loan_applications;
SELECT * FROM emi_schedule;
```

### **Switching to MySQL (Production)**

**1. Update `pom.xml`** (MySQL driver already included):
```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

**2. Update `application.yml`:**
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/loan_management_db
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: your-mysql-password
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
```

---

## 🔒 Security Architecture

### **Authentication Flow**

```
1. User sends credentials → POST /api/auth/login
2. Backend validates password (BCrypt)
3. JwtService generates tokens:
   - Access Token (15 min)
   - Refresh Token (7 days)
4. Client stores tokens (localStorage/cookies)
5. Client includes token in requests:
   Authorization: Bearer <access-token>
6. JwtAuthenticationFilter validates token
7. SecurityContext populated with User principal
8. Controller access granted/denied based on role
```

### **Password Storage**
- **Algorithm:** BCrypt
- **Salt Rounds:** 10 (automatic)
- **Never stored in plain text**

### **Token Structure (JWT Payload)**
```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",  // User ID
  "iss": "loan-manager",                          // Issuer
  "email": "john@example.com",
  "role": "USER",
  "type": "access",                               // or "refresh"
  "iat": 1697472000,                              // Issued at
  "exp": 1697472900                               // Expiration
}
```

---

## 📊 API Response Format

### **Success Response**
```json
{
  "id": "uuid",
  "fullName": "John Doe",
  "email": "john@example.com"
}
```

### **Validation Error Response**
```json
{
  "status": 400,
  "message": "Validation failed",
  "timestamp": "2025-10-15T18:30:00Z",
  "errors": {
    "email": "Email must be valid",
    "password": "Password must be at least 6 characters"
  }
}
```

### **Authentication Error Response**
```json
{
  "status": 400,
  "message": "Invalid credentials",
  "timestamp": "2025-10-15T18:30:00Z"
}
```

---

## 🛠️ Development Commands

```bash
# Clean build
mvn clean package

# Run tests
mvn test

# Run without tests
mvn spring-boot:run -DskipTests

# Package JAR file
mvn package
java -jar target/loan-management-server-0.0.1-SNAPSHOT.jar

# Check dependencies
mvn dependency:tree

# Update dependencies
mvn versions:display-dependency-updates
```

---

## 🐛 Troubleshooting

### **Issue: "JWT secret must be at least 256 bits"**
**Solution:** The secret in `application.yml` must be 32+ characters. Already fixed with current config.

### **Issue: "Port 8080 already in use"**
**Solution:** Kill the process or change the port:
```yaml
server:
  port: 8081
```

### **Issue: Database connection errors**
**Solution:** H2 is in-memory; data resets on restart. For persistence:
```yaml
spring:
  datasource:
    url: jdbc:h2:file:./data/loan_db  # File-based H2
```

### **Issue: CORS errors from frontend**
**Solution:** Verify frontend origin in `SecurityConfig.java`:
```java
configuration.setAllowedOrigins(List.of("http://localhost:5173"));
```

---

## 📝 Next Steps (Not Yet Implemented)

1. **Loan Management Endpoints**
   - POST `/api/loans/apply` - Submit loan application
   - GET `/api/loans/my-loans` - User's loan list
   - GET `/api/admin/loans/pending` - Pending approvals
   - PUT `/api/admin/loans/{id}/approve` - Approve loan
   - PUT `/api/admin/loans/{id}/reject` - Reject loan

2. **EMI Management**
   - GET `/api/loans/{id}/emi-schedule` - View EMI schedule
   - POST `/api/loans/{id}/emi/pay` - Mark EMI as paid

3. **Document Upload**
   - POST `/api/loans/{id}/documents` - Upload document
   - GET `/api/loans/{id}/documents` - List documents
   - Use `MultipartFile` for file handling

4. **Email Notifications**
   - Add `spring-boot-starter-mail` dependency
   - Configure SMTP settings
   - Send approval/rejection emails

5. **Admin Features**
   - User management endpoints
   - Loan statistics dashboard
   - Bulk operations

---

## 📞 Support

For questions or issues:
1. Check logs in terminal where `mvn spring-boot:run` is running
2. Access H2 console to verify database state
3. Test endpoints with sample cURL commands above
4. Review stack traces for detailed error information

---

## 📄 License

This project is for educational/demonstration purposes.

---

**Status:** ✅ Authentication system fully functional and running on `http://localhost:8080`
