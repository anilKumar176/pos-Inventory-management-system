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
    totalCustomers: 0,
  });
  const [topProducts, setTopProducts] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [userCount, setUserCount] = useState(0);

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
      const userRes = await API.get("/auth/count");

      setOrders(ordersRes.data.orders || ordersRes.data);
      setStats(statsRes.data);
      setTopProducts(topRes.data.data || []);
      setSalesData(salesRes.data.data || []);
      setUserCount(userRes.data.totalUsers);

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

  return (
    <Layout>
      <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-6 text-white">
          📊 Dashboard
        </h1>

        {/* KPI CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">

          <Card title="Orders" value={stats.totalOrders} color="bg-indigo-600" />
          <Card title="Revenue" value={`₹ ${stats.totalRevenue}`} color="bg-green-600" />
          <Card title="Products" value={stats.totalProducts} color="bg-blue-600" />
          <Card title="Low Stock" value={stats.lowStockProducts?.length} color="bg-red-600" />
          <Card title="Users" value={userCount} color="bg-purple-600" />
          <Card title="Customers" value={stats.totalCustomers} color="bg-orange-600" />

        </div>

        {/* CHARTS */}
        <div className="grid md:grid-cols-2 gap-6 p-4 rounded-xl bg-gray-800 shadow-inner">

          {/* SALES */}
          <ChartBox title="Sales Trend">
            <LineChart data={salesData}>
              <CartesianGrid stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: "#111827", border: "none", color: "#fff" }} />
              <Line
                type="monotone"
                dataKey="totalRevenue"
                stroke="#22C55E"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ChartBox>

          {/* PAYMENT */}
          <ChartBox title="Payment Split">
            <PieChart>
              <Pie data={paymentData} dataKey="value" outerRadius={100}>
                {paymentData.map((_, i) => (
                  <Cell key={i} fill={["#22C55E", "#3B82F6", "#F59E0B"][i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#111827", border: "none", color: "#fff" }} />
            </PieChart>
          </ChartBox>

          {/* TOP PRODUCTS */}
          <ChartBox title="Top Products" full>
            <BarChart data={topProducts}>
              <CartesianGrid stroke="#374151" />
              <XAxis dataKey="productName" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: "#111827", border: "none", color: "#fff" }} />

              <Bar dataKey="totalSold" fill="#22C55E" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ChartBox>

        </div>

        {/* ORDERS */}
        <div className="bg-gray-800 mt-6 p-5 rounded-xl shadow border border-gray-700">

          <h3 className="mb-4 font-semibold text-white">
            Recent Orders
          </h3>

          <table className="w-full text-sm">
            <thead className="bg-gray-700 text-gray-300">
              <tr>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Payment</th>
                <th className="p-2 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o._id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="p-2">{o._id.slice(0, 6)}</td>
                  <td className="p-2 font-medium">₹ {o.totalAmount}</td>
                  <td className="p-2 capitalize">{o.paymentMethod}</td>
                  <td className="p-2 text-gray-400">
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

// CARD
const Card = ({ title, value, color }) => (
  <div className={`${color} text-white p-4 rounded-xl shadow-lg hover:scale-105 transition`}>
    <h3 className="text-sm opacity-80">{title}</h3>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

// CHART BOX
const ChartBox = ({ title, children, full }) => (
  <div className={`bg-gray-900 p-5 rounded-xl shadow-lg border border-gray-700 ${full ? "md:col-span-2" : ""}`}>
    <h3 className="mb-4 font-semibold text-white">{title}</h3>
    <ResponsiveContainer width="100%" height={300}>
      {children}
    </ResponsiveContainer>
  </div>
);

export default Dashboard;