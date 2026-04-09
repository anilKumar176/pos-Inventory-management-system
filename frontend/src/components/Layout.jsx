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

  let menu = [
    { name: "POS Billing", path: "/pos", icon: <FaCashRegister /> },
    { name: "Orders", path: "/orders", icon: <FaShoppingCart /> },
    { name: "Report", path: "/report", icon: <FaChartBar /> },
  ];

  if (user?.role === "admin") {
    menu = [
      { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
      ...menu,
      { name: "Products", path: "/products", icon: <FaBox /> },
      { name: "Low Stock", path: "/low-stock", icon: <FaBox /> },
      { name: "Users", path: "/users", icon: <FaUsers /> },
    ];
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">

      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 w-full flex justify-between items-center bg-gray-900 p-4 border-b border-gray-700 z-40">
        <h1 className="font-bold text-indigo-400 text-lg">Retail POS</h1>

        <button onClick={() => setOpen(true)} className="text-xl">
          <FaBars />
        </button>
      </div>

      {/* MOBILE SIDEBAR + OVERLAY */}
      {open && (
        <>
          {/* OVERLAY */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setOpen(false)}
          />

          {/* SIDEBAR */}
          <div className="fixed top-0 left-0 w-64 h-full bg-gray-900 border-r border-gray-700 p-6 z-50 overflow-y-auto">

            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold text-indigo-400">
                Retail POS
              </h1>

              <button onClick={() => setOpen(false)}>
                <FaTimes />
              </button>
            </div>

            <nav className="space-y-2">
              {menu.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-xl transition ${
                    location.pathname === item.path
                      ? "bg-indigo-600"
                      : "hover:bg-gray-800 text-gray-300"
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
              className="mt-6 w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-2 rounded-lg"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </>
      )}

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex flex-col w-64 bg-gray-900 border-r border-gray-700 p-6">

        <h1 className="text-2xl font-bold mb-6 text-indigo-400">
          RetailSync
        </h1>

        <p className="text-sm text-gray-400 mb-6">
          Logged in as:
          <span className="ml-1 font-semibold text-white">
            {user?.role}
          </span>
        </p>

        <nav className="space-y-2 flex-1">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-xl transition ${
                location.pathname === item.path
                  ? "bg-indigo-600 shadow-md"
                  : "hover:bg-gray-800 text-gray-300"
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
          className="mt-6 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-2 rounded-xl"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 pt-16 md:pt-0 p-3 md:p-8 bg-gray-950 overflow-y-auto">
        {children}
      </div>

    </div>
  );
};

export default Layout;