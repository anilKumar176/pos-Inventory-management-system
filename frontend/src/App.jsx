import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import LowStock from "./pages/LowStock";
import Invoice from "./pages/Invoice";
import CashierReport from "./pages/CashierReport";
import Users from "./pages/Users";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔐 ADMIN ONLY */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute role="admin">
              <Products />
            </ProtectedRoute>
          }
        />

        <Route
          path="/low-stock"
          element={
            <ProtectedRoute role="admin">
              <LowStock />
            </ProtectedRoute>
          }
        />

        {/* 👥 USERS (ADMIN ONLY) */}
        <Route
          path="/users"
          element={
            <ProtectedRoute role="admin">
              <Users />
            </ProtectedRoute>
          }
        />

        {/* 🔐 CASHIER + ADMIN */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pos"
          element={
            <ProtectedRoute>
              <POS />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <CashierReport />
            </ProtectedRoute>
          }
        />

        {/* PUBLIC */}
        <Route path="/invoice" element={<Invoice />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;