# Healthcare API

A robust, secure, and scalable RESTful API built with NestJS for managing healthcare operations, including user management, doctor and patient profiles, appointments, medical records, access control, logging, auditing, and scheduled tasks.

This project implements:
- **Role-Based Access Control (RBAC)**
- **Attribute-Based Access Control (ABAC)**
- **Comprehensive logging and auditing**
- **Basic API versioning**
- **Detailed Swagger documentation**

---

## 📌 Table of Contents
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [File Structure](#file-structure)
- [API Documentation](#api-documentation)
- [Key Points to Consider](#key-points-to-consider)
- [Future Enhancements](#future-enhancements)

---

## 🚀 Features
- **User Management**: Register and authenticate users with roles (`ADMIN`, `DOCTOR`, `PATIENT`).
- **Role-Specific Profiles**: Separate models for `Admin`, `Doctor`, and `Patient` linked to `User`.
- **Authentication**: JWT-based authentication via cookies (`Authentication` cookie).
- **RBAC**: Role-based guards restrict endpoint access (e.g., only `ADMIN` can delete records).
- **ABAC**: Attribute-based access control (e.g., time or location restrictions on appointments).
- **Appointments**: CRUD operations with daily patient reminders via cron jobs.
- **Medical Records**: Manage patient medical records with secure access.
- **Access Policies**: Define and enforce ABAC policies.
- **Logging & Auditing**: Detailed API, error, and audit logs stored in a separate database.
- **Scheduled Tasks**: Daily appointment reminders and weekly doctor follow-up notifications.
- **API Versioning**: URI-based versioning (e.g., `/v1/` prefix).
- **Swagger Documentation**: Interactive API docs at `/api`.

---

## 🛠️ Setup Instructions

### 📋 Prerequisites
- **Node.js**: v16.x or higher
- **PostgreSQL**: Two databases (main and logs)
- **pnpm**: Package manager

### 🔧 Installation

#### 1️⃣ Clone the Repository:
```bash
git clone https://github.com/AnkushS27/nestjs-healthcare-backend-system.git
cd nestjs-healthcare-backend-system
```

#### 2️⃣ Install Dependencies:
```bash
pnpm install
```

#### 3️⃣ Configure Environment Variables:
Create a `.env` file in the root directory based on `.env.example` (create one if not present):

```ini
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/healthcare_db?schema=public  # main database url
LOGS_DATABASE_URL=postgresql://user:password@localhost:5432/logs_db?schema=public   # logs database url
JWT_SECRET=your-secret-key
JWT_EXPIRATION=3600000
```

#### 4️⃣ Set Up Databases:
Create two PostgreSQL databases:  
- `healthcare_db` (main)  
- `logs_db` (logs)  

Run migrations for both schemas:
```bash
pnpx prisma migrate dev --name init --schema=prisma/main.schema.prisma
pnpx prisma migrate dev --name init --schema=prisma/logs.schema.prisma
```

Generate Prisma clients:
```bash
pnpx prisma generate --schema=prisma/main.schema.prisma
pnpx prisma generate --schema=prisma/logs.schema.prisma
```

#### 5️⃣ Run the Application:
🛠 Development mode:
```bash
npm run start:dev
```

🚀 Production mode:
```bash
npm run build
npm run start:prod
```

#### 6️⃣ Access the API:
- `Base URL`: http://localhost:3000/v1/
- `Swagger UI`: http://localhost:3000/api

## 📂 File Structure
```bash
nestjs-healthcare-backend-system/
├── prisma/                       
│   ├── generated/               
│   │   ├── main/               
│   │   └── logs/         
|   ├── migrations/      
│   ├── main.schema.prisma
│   └── logs.schema.prisma    
├── src/   
|   ├── prisma/ 
|   |   ├── main-prisma.service.ts  
│   |   ├── logs-prisma.service.ts  
│   |   └── prisma.module.ts                      
│   ├── auth/                   
│   ├── users/                  
│   ├── doctors/                
│   ├── patients/               
│   ├── appointments/           
│   ├── medical-records/        
│   ├── access-policies/        
│   ├── logging/                
│   ├── scheduler/              
│   ├── app.module.ts           
│   └── main.ts                 
├── .env                        
├── package.json                
└── README.md                   
```

---

## 📖 API Documentation
API endpoints are versioned with a /v1/ prefix and documented via Swagger at http://localhost:3000/api.

### 🔑 Authentication
#### Login
- **Endpoint:** `POST /v1/auth/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: Sets `Authentication` cookie with JWT.
- **Usage**: Include Cookie: Authentication=<JWT_TOKEN> in headers for protected endpoints.

#### API Endpoints Overview
#### Users
- **POST** `/v1/users` - Create a user _(public)_  
- **GET** `/v1/users/me` - Get current user _(authenticated)_  

#### Doctors
- **POST** `/v1/doctors/:userId` - Create doctor _(Admin)_  
- **GET** `/v1/doctors/:id` - Get doctor _(Admin, Doctor)_  
- **PUT** `/v1/doctors/:id` - Update doctor _(Admin)_  
- **DELETE** `/v1/doctors/:id` - Delete doctor _(Admin)_  
- **POST** `/v1/doctors/:doctorId/follow-ups` - Create follow-up reminder _(Admin, Doctor)_  

#### Patients
- **POST** `/v1/patients/:userId` - Create patient _(Admin)_  
- **GET** `/v1/patients/:id` - Get patient _(Admin, Doctor, Patient)_  
- **PUT** `/v1/patients/:id` - Update patient _(Admin, Patient)_  
- **DELETE** `/v1/patients/:id` - Delete patient _(Admin)_  

#### Appointments
- **POST** `/v1/appointments` - Create appointment _(Admin, Doctor)_  
- **GET** `/v1/appointments/:id` - Get appointment _(Admin, Doctor, Patient)_  
- **PUT** `/v1/appointments/:id` - Update appointment _(Admin, Doctor)_  
- **DELETE** `/v1/appointments/:id` - Delete appointment _(Admin)_  

##### Medical Records
- **POST** `/v1/medical-records` - Create record _(Admin, Doctor)_  
- **GET** `/v1/medical-records/:id` - Get record _(Admin, Doctor, Patient)_  
- **PUT** `/v1/medical-records/:id` - Update record _(Admin, Doctor)_  
- **DELETE** `/v1/medical-records/:id` - Delete record _(Admin)_  

### Access Policies (ABAC)
- **POST** `/v1/access-policies` - Create policy _(Admin)_  
- **GET** `/v1/access-policies` - Get all policies _(Admin)_  
- **GET** `/v1/access-policies/:id` - Get policy _(Admin)_  
- **PUT** `/v1/access-policies/:id` - Update policy _(Admin)_  
- **DELETE** `/v1/access-policies/:id` - Delete policy _(Admin)_  

---

## Swagger UI
- **Access:** [http://localhost:3000/api](http://localhost:3000/api)  

### Features:
- Detailed endpoint descriptions  
- Request/response schemas via DTOs  
- Authentication instructions in the description  

---

## Key Points to Consider

### Authentication
- Use the **Authentication cookie** set by `/v1/auth/login`  
- **No Bearer token support**  

### Versioning
- All endpoints are under `/v1/`  
- Future versions (e.g., `/v2/`) can be added with `@Version('2')`  

### Error Handling
Specific errors are mapped to HTTP status codes:
- **400** - Bad request _(e.g., invalid IDs)_  
- **404** - Not found _(e.g., missing resources)_  
- **409** - Conflict _(e.g., duplicate entries)_  
- **422** - Unprocessable entity _(e.g., duplicate email)_  
- **500** - Internal server error _(rare, logged)_  

Check `error_logs` for detailed debugging.

### Logging
- API requests, errors, and audits are logged in the `logs` database.  

### Cron Jobs
- Run **daily at 8 AM** _(patient reminders)_  
- Run **every weekday** _(doctor follow-ups)_  
- Test by mocking with `*/10 * * * * *`  

### Database
- Two separate databases: **main** and **logs**  
- Require distinct **Prisma** configurations  

### Security
- **RBAC** and **ABAC** enforce access control  
- Ensure `JWT_SECRET` is secure

---

## Future Enhancements
- Notification System: Implement actual notification delivery (e.g., email, SMS, WhatsApp) using NotificationPreference.
- API v2: Introduce breaking changes under /v2/ (e.g., enhanced schemas).
- Rate Limiting: Add throttling to prevent abuse.
- Testing: Unit and integration tests for services and endpoints.
- Performance: Cache ABAC policies for faster evaluation.