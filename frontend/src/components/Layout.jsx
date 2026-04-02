import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  FaHome,
  FaBox,
  FaShoppingCart,
  FaChartBar,
  FaCashRegister,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUsers
} from "react-icons/fa";

const Layout = ({ children }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // 🔥 BASE MENU (cashier + admin)
  let menu = [
    { name: "POS Billing", path: "/pos", icon: <FaCashRegister /> },
    { name: "Orders", path: "/orders", icon: <FaShoppingCart /> },
    { name: "Report", path: "/report", icon: <FaChartBar /> },
  ];

  // 👑 ADMIN MENU ADD
  if (user?.role === "admin") {
    menu = [
      { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
      ...menu,
      { name: "Products", path: "/products", icon: <FaBox /> },
      { name: "Low Stock", path: "/low-stock", icon: <FaBox /> },
      { name: "Users", path: "/users", icon: <FaUsers /> }, // 🔥 ADDED
    ];
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">

      {/* MOBILE TOP BAR */}
      <div className="md:hidden flex justify-between items-center bg-white p-4 shadow-md">
        <h1 className="font-bold text-blue-600 text-lg">Retail POS</h1>

        <button onClick={() => setOpen(!open)} className="text-xl">
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* MOBILE SIDEBAR */}
      {open && (
        <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-xl p-6 z-50 md:hidden">

          <h1 className="text-xl font-bold mb-6 text-blue-600">
            Retail POS
          </h1>

          <nav className="space-y-3">
            {menu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  location.pathname === item.path
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>

          {/* LOGOUT */}
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex flex-col w-64 bg-white shadow-xl p-6">

        <h1 className="text-2xl font-bold mb-6 text-blue-600">
          RetailSync
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          Logged in as:
          <span className="ml-1 font-semibold text-gray-700">
            {user?.role}
          </span>
        </p>

        <nav className="space-y-2 flex-1">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-xl ${
                location.pathname === item.path
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        {/* LOGOUT */}
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="mt-6 flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-xl"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-4 md:p-8">
        {children}
      </div>

    </div>
  );
};

export default Layout;