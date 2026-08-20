# 🛒 SmartCart: AI-Powered Retail Management System

Welcome to **SmartCart**—a modern, AI-powered retail and supermarket management system. 
This project was built to eliminate checkout lines by allowing customers to scan items directly via their carts, while providing robust, real-time dashboards for staff and managers.

## ✨ Key Features
- **Tamper-Proof Smart Checkout**: Cart subtotals and discounts are algorithmically calculated securely on the backend.
- **Dynamic Discount Engine**: Supports complex promotional offers (Flat Off, Percentage Off, BOGO, Buy-X-Get-Y).
- **Role-Based Access Control (RBAC)**: Secure routing and dashboards tailored for `Customers`, `Staff`, and `Managers`.
- **AI Vision Integration**: A simulated viewport mimicking a real-time YOLO object detection feed.
- **Modern UI/UX**: Built with a sleek, responsive glassmorphism design.
- **Enterprise Architecture**: Complete separation of concerns (Frontend, Backend APIs, Database).

---

## 🛠️ Technology Stack
### Frontend
- **React.js** (Vite)
- **Tailwind CSS** (Styling & Animations)
- **React Router DOM v6**
- **Recharts** (Data Visualization)
- **Lucide React** (Icons)

### Backend
- **FastAPI** (Python 3.13)
- **SQLAlchemy & Alembic** (ORM and Migrations)
- **MySQL** (Relational Database)
- **PyJWT & bcrypt** (Authentication & Security)

### DevOps & Deployment
- **Docker & Docker Compose** (Containerization)

---

## 🚀 How to Run Locally

### Option 1: Using Docker (Recommended)
You can instantly run the entire application (Database, Backend, Frontend) with a single command if you have Docker Desktop installed.

```bash
# Clone the repository
git clone https://github.com/Ngoel1808/Smart-Cart-.git
cd Smart-Cart-

# Spin up all containers
docker-compose up -d --build
```
- **Frontend App:** http://localhost:5173
- **Backend API Docs:** http://localhost:8000/docs

### Option 2: Manual Setup
If you don't have Docker, you can run the services manually. You will need **Node.js** and **Python 3.13+** installed.

**1. Start the Backend API**
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate   # On Windows
pip install -r requirements.txt
alembic upgrade head
python -m app.database.seed
uvicorn app.main:app --reload
```

**2. Start the Frontend App**
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Demo Accounts
The database comes pre-seeded with 15 products, 4 active offers, and these demo accounts:

- **Customer:** `customer@smartcart.com` | Password: `customer123`
- **Staff:** `staff@smartcart.com` | Password: `staff123`
- **Manager:** `manager@smartcart.com` | Password: `manager123`
