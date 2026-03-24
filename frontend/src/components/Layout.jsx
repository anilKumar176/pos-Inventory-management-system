import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Layout = ({ children }) => {
  const location = useLocation();

  // USER
  const user = JSON.parse(localStorage.getItem("user"));

  //  MOBILE MENU
  const [open, setOpen] = useState(false);

  //  MENU
  let menu = [
    { name: "POS Billing", path: "/pos" },
    { name: "Orders", path: "/orders" },
    { name: "Report", path: "/report" }
  ];

  if (user?.role === "admin") {
    menu = [
      { name: "Dashboard", path: "/dashboard" },
      ...menu,
      { name: "Products", path: "/products" },
      { name: "Low Stock", path: "/low-stock" },
    ];
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* MOBILE TOP BAR */}
      <div className="md:hidden flex justify-between items-center bg-white p-4 shadow">
        <h1 className="font-bold text-blue-600">Retail POS</h1>

        <button
          onClick={() => setOpen(!open)}
          className="text-xl"
        >
        </button>
      </div>

      {/* MOBILE SIDEBAR */}
      {open && (
        <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg p-6 z-50 md:hidden">

          <button
            onClick={() => setOpen(false)}
            className="mb-4 text-right w-full"
          >
          </button>

          <nav className="space-y-3">
            {menu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`block p-2 rounded ${
                  location.pathname === item.path
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/*  DESKTOP SIDEBAR */}
      <div className="hidden md:block w-64 bg-white shadow-lg p-6">

        <h1 className="text-2xl font-bold mb-6 text-blue-600">
          Retail POS
        </h1>

        <p className="text-sm text-gray-500 mb-4">
          Logged in as:{" "}
          <span className="font-semibold">{user?.role}</span>
        </p>

        <nav className="space-y-3">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block p-2 rounded ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
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
          className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/*  MAIN CONTENT */}
      <div className="flex-1 p-4 md:p-6">
        {children}
      </div>
    </div>
  );
};

export default Layout;