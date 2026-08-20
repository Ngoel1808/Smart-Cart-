# SmartCart – AI-Powered Smart Shopping & Retail Management System

A production-ready FastAPI backend for the SmartCart application.

## Technologies
- **Python 3.13**
- **FastAPI** (Web Framework)
- **SQLAlchemy** (ORM)
- **PyMySQL** (MySQL Database Driver)
- **Alembic** (Database Migrations)
- **Pydantic** (Data Validation)
- **PyJWT & bcrypt** (Authentication & Security)

## Features
- Complete Role-Based Access Control (RBAC: Manager, Staff, Customer).
- Product & Inventory Management system.
- Robust Discount Engine supporting Percentage, Flat, BOGO, and Buy-X-Get-Y offers.
- Secure Cart & Checkout system that prevents client-side price manipulation.
- Analytics & Dashboard APIs.
- Modular architecture ready for YOLO object detection integration via `MockAIService`.

## Setup Instructions

### 1. Database Setup
Create a MySQL database named `smartcart_db`.

### 2. Environment Variables
Create a `.env` file in the root directory and update the `DATABASE_URL` with your MySQL credentials:
```env
DATABASE_URL=mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/smartcart_db
SECRET_KEY=change_this_secret
ACCESS_TOKEN_EXPIRE_MINUTES=60
FRONTEND_URL=http://localhost:5173
```

### 3. Installation
Create and activate a virtual environment:
```bash
python -m venv venv
# On Windows
.\venv\Scripts\activate
# On Mac/Linux
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

### 4. Migrations & Seeding
Run the database migrations:
```bash
alembic upgrade head
```

Seed the database with demo accounts and products:
```bash
python -m app.database.seed
```

### 5. Run the Server
```bash
uvicorn app.main:app --reload
```

Access the interactive API documentation at:
- **Swagger UI**: http://127.0.0.1:8000/docs

## Demo Accounts
Passwords for all demo accounts are their respective names followed by `123`.
- **Manager**: `manager@smartcart.com` / `manager123`
- **Staff**: `staff@smartcart.com` / `staff123`
- **Customer**: `customer@smartcart.com` / `customer123`
