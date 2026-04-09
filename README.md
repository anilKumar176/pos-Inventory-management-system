# Omnichannel-Retail-POS-Inventory-Management-System

# 🧾 RetailSync POS System

A full-stack **Point of Sale (POS) System** built using the **MERN Stack (MongoDB, Express, React, Node.js)**.
This system helps businesses manage products, sales, users, and billing efficiently with real-time analytics.

---

## 🚀 Features

### 🔹 Authentication & User Management

* Admin & Cashier roles
* Secure login with JWT authentication
* Create and manage users
* Role-based access control

### 🔹 Product Management

* Add, update, delete products
* Category-based filtering
* Barcode support
* Stock tracking

### 🔹 POS Billing System

* Add products to cart
* Barcode scanning (USB + Camera) 
* Customer details (name & phone)
* Multiple payment methods (Cash, Card, UPI)
* Real-time total calculation
* Invoice generation

### 🔹 Dashboard & Reports

* Sales analytics (line chart) 
* Top selling products
* Payment method distribution
* Total revenue, orders, users
* Recent orders tracking

### 🔹 Modern UI

* Built with Tailwind CSS
* Responsive design
* Dark mode support

---

## 🏗️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* React Router
* Axios
* Recharts (for charts)

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### Other Tools

* JWT Authentication
* Barcode Scanner Integration
* Toast Notifications

---

## 📂 Project Structure

```
root/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   │   ├── POS.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Products.jsx
│   │   ├── Users.jsx
│   ├── services/api.js
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/retailsync-pos.git
cd retailsync-pos
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm start
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🔌 API Endpoints

### 🔐 Auth APIs

* `POST /api/auth/create` → Create user 
* `GET /api/auth/users` → Get all users
* `DELETE /api/auth/delete/:id` → Delete user
* `GET /api/auth/count` → Total users

---

### 📦 Product APIs

* `GET /api/products` → Get all products 
* `POST /api/products/create` → Add product 
* `PUT /api/products/:id` → Update product
* `DELETE /api/products/:id` → Delete product
* `GET /api/products/barcode/:barcode` → Get product by barcode 

---

### 🧾 Order APIs

* `POST /api/orders` → Place order 
* `GET /api/orders` → Get all orders

---

### 📊 Report APIs

* `GET /api/reports/dashboard` → Dashboard stats 
* `GET /api/reports/top-products` → Top products
* `GET /api/reports/sales-graph` → Sales data

---

## 🔄 Application Flow

1. Admin creates users (cashiers)
2. Admin adds products with barcode
3. Cashier logs in and opens POS
4. Products added via:

   * Click
   * Barcode scan
5. Cart calculates total
6. Order placed via `/orders`
7. Data reflected in dashboard analytics

---

## 📸 Key Modules Explanation

### 🧾 POS System

Handles billing, barcode scanning, cart management, and order placement.
Includes customer details and payment method handling. 

### 📊 Dashboard

Displays analytics using charts:

* Sales trend
* Top products
* Payment split 

### 📦 Product Management

CRUD operations for products with category and stock management. 

### 👥 User Management

Admin can create and delete users with roles. 

---

## 🔐 Security Features

* JWT-based authentication
* Protected routes
* Role-based access control

---

## 💡 Future Improvements

* Email/SMS invoice
* Online payment integration
* Multi-store support
* Advanced analytics

---

## 👨‍💻 Author

Mudavath Anil Kumar
MCA Student - MANIT Bhopal

---

## ⭐ Conclusion

This project demonstrates a real-world **industry-level POS system** with full-stack development, API integration, authentication, and analytics.
