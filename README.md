# Omnichannel-Retail-POS-Inventory-Management-System

# 🛒 Omnichannel Retail POS & Inventory Management System

A modern full-stack web application for managing retail sales, inventory, and billing in real-time.  
This system helps retail businesses automate operations, reduce manual errors, and improve efficiency.

---

## 🚀 Features

### 🏪 POS (Point of Sale)
- Add products to cart using search or barcode
- Real-time billing system
- Multiple payment methods (Cash/Card/UPI)
- Automatic total calculation
- Order history tracking

### 📦 Inventory Management
- Add, update, delete products
- Real-time stock updates after each sale
- Low stock alerts
- Category-based product filtering

### 🔐 Authentication & Security
- User registration & login
- JWT-based authentication
- Role-based access (Admin, Cashier)
- Protected API routes

### 📊 Reports & Analytics
- Daily sales report
- Total revenue tracking
- Dashboard statistics

---

## 🧑‍💻 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Toastify

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Other Tools
- JWT (Authentication)
- bcrypt (Password hashing)
- REST APIs
- Git & GitHub

---

## 📂 Project Structure
project-root/
│
├── frontend/
│ ├── src/
│ ├── components/
│ ├── pages/
│ └── services/
│
├── backend/
│ ├── src/
│ │ ├── config/
│ │ ├── controllers/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── middleware/
│ │ └── server.js
│ └── .env


---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/pos-system.git
cd pos-system
2️⃣ Backend Setup
cd backend
npm install

Create .env file:

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key

Run backend:

npm run dev
3️⃣ Frontend Setup
cd frontend
npm install
npm run dev
🔗 API Endpoints
Auth APIs
POST /api/auth/register
POST /api/auth/login
Product APIs
POST /api/products/create
GET /api/products
PUT /api/products/:id
DELETE /api/products/:id
GET /api/products/search
GET /api/products/barcode/:barcode
Order APIs
POST /api/orders
GET /api/orders
Report APIs
GET /api/reports/dashboard
GET /api/reports/sales
🔄 Workflow (How System Works)
Cashier scans product barcode
Product added to cart
User confirms order
Order stored in database
Inventory automatically updated
Reports updated in dashboard

👉 This ensures real-time synchronization of stock and sales

🗄️ Database Models
User
name
email
password
role
Product
name
sku
category
price
stock
barcode
description
Order
items
quantity
totalAmount
paymentMethod
🎯 Objectives
Reduce manual inventory errors
Provide real-time stock updates
Improve billing speed
Support multi-store retail system

👉 The system ensures accurate inventory and faster retail operations

📈 Future Improvements
Mobile app integration
AI-based demand forecasting
Advanced analytics dashboard
Redis caching for performance
