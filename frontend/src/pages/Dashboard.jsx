import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    lowStockProducts: [],
  });
  const [topProducts, setTopProducts] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [userCount, setUserCount] = useState(0); // ✅ NEW

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const token = localStorage.getItem("token");

      const ordersRes = await API.get("/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const statsRes = await API.get("/reports/dashboard");
      const topRes = await API.get("/reports/top-products");
      const salesRes = await API.get("/reports/sales-graph");

      // ✅ USER COUNT API
      const userRes = await API.get("/auth/count");

      setOrders(ordersRes.data.orders || ordersRes.data);
      setStats(statsRes.data);
      setTopProducts(topRes.data);
      setSalesData(salesRes.data);
      setUserCount(userRes.data.totalUsers); // ✅ IMPORTANT

    } catch (err) {
      console.log("Dashboard Error:", err);
    }
  };

  const paymentData = [
    {
      name: "Cash",
      value: orders
        .filter((o) => o.paymentMethod === "cash")
        .reduce((sum, o) => sum + o.totalAmount, 0),
    },
    {
      name: "Card",
      value: orders
        .filter((o) => o.paymentMethod === "card")
        .reduce((sum, o) => sum + o.totalAmount, 0),
    },
    {
      name: "UPI",
      value: orders
        .filter((o) => o.paymentMethod === "upi")
        .reduce((sum, o) => sum + o.totalAmount, 0),
    },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

  return (
    <Layout>
      <div className="p-6 bg-gray-100 min-h-screen">

        <h1 className="text-3xl font-bold mb-6">
          📊 Dashboard Overview
        </h1>

        {/* KPI CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-gray-500 text-sm">Total Orders</h3>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-gray-500 text-sm">Revenue</h3>
            <p className="text-2xl font-bold text-blue-600">
              ₹ {stats.totalRevenue}
            </p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-gray-500 text-sm">Products</h3>
            <p className="text-2xl font-bold">{stats.totalProducts}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-gray-500 text-sm">Low Stock</h3>
            <p className="text-2xl font-bold text-red-500">
              {stats.lowStockProducts?.length}
            </p>
          </div>

          {/* ✅ NEW USER CARD */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-gray-500 text-sm">Users</h3>
            <p className="text-2xl font-bold text-green-600">
              {userCount}
            </p>
          </div>

        </div>

        {/* CHARTS */}
        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-white p-4 rounded shadow">
            <h3 className="mb-3 font-semibold">Sales Trend</h3>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="totalRevenue" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="mb-3 font-semibold">Payment Split</h3>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={paymentData} dataKey="value" outerRadius={100} label>
                  {paymentData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded shadow md:col-span-2">
            <h3 className="mb-3 font-semibold">Top Products</h3>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts}>
                <XAxis dataKey="productName" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalSold" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* RECENT ORDERS */}
        <div className="bg-white p-4 rounded shadow mt-6">

          <h3 className="mb-3 font-semibold">Recent Orders</h3>

          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Payment</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o._id} className="border-b">
                  <td className="p-2">{o._id.slice(0, 6)}</td>
                  <td className="p-2">₹ {o.totalAmount}</td>
                  <td className="p-2">{o.paymentMethod}</td>
                  <td className="p-2">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;