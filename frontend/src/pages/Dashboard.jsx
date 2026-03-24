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
  Cell
} from "recharts";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data.orders || res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 📊 TOTALS
  const totalRevenue = orders.reduce(
    (sum, o) => sum + o.totalAmount,
    0
  );

  const totalOrders = orders.length;

  // 📊 PAYMENT DATA
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

  // 📊 DAILY SALES
  const salesMap = {};

  orders.forEach((o) => {
    const date = new Date(o.createdAt).toLocaleDateString();

    if (!salesMap[date]) {
      salesMap[date] = 0;
    }

    salesMap[date] += o.totalAmount;
  });

  const salesData = Object.keys(salesMap).map((date) => ({
    date,
    revenue: salesMap[date],
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <Layout>
      <div className="p-6 bg-gray-100 min-h-screen">

        <h1 className="text-2xl font-bold mb-6">
          📊 Dashboard
        </h1>

        {/* CARDS */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-gray-500">Total Orders</h3>
            <p className="text-2xl font-bold">{totalOrders}</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-gray-500">Total Revenue</h3>
            <p className="text-2xl font-bold text-blue-600">
              ₹ {totalRevenue}
            </p>
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* BAR CHART */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="font-bold mb-4">📈 Daily Sales</h3>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* PIE CHART */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="font-bold mb-4">💳 Payment Split</h3>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >
                  {paymentData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;