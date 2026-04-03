import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

const CashierReport = () => {
  const [report, setReport] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    cash: 0,
    card: 0,
    upi: 0,
  });

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const orders = res.data.orders || res.data;

      let cash = 0,
        card = 0,
        upi = 0;

      orders.forEach((o) => {
        if (o.paymentMethod === "cash") cash += o.totalAmount;
        if (o.paymentMethod === "card") card += o.totalAmount;
        if (o.paymentMethod === "upi") upi += o.totalAmount;
      });

      const totalRevenue = orders.reduce(
        (sum, o) => sum + o.totalAmount,
        0
      );

      setReport({
        totalOrders: orders.length,
        totalRevenue,
        cash,
        card,
        upi,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <div className="p-6 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">

        <h1 className="text-3xl font-bold mb-6 text-blue-400">
          📊 Daily Report
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">

          {/* TOTAL ORDERS */}
          <div className="bg-slate-800/80 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-slate-700 hover:scale-105 transition">
            <p className="text-gray-400">Total Orders</p>
            <h2 className="text-2xl font-bold mt-1">
              {report.totalOrders}
            </h2>
          </div>

          {/* TOTAL REVENUE */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 rounded-2xl shadow-lg hover:scale-105 transition">
            <p className="text-blue-100">Total Revenue</p>
            <h2 className="text-2xl font-bold mt-1">
              ₹ {report.totalRevenue}
            </h2>
          </div>

          {/* CASH */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-5 rounded-2xl shadow-lg hover:scale-105 transition">
            <p className="text-green-100">Cash</p>
            <h2 className="text-2xl font-bold mt-1">
              ₹ {report.cash}
            </h2>
          </div>

          {/* CARD */}
          <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-5 rounded-2xl shadow-lg hover:scale-105 transition">
            <p className="text-purple-100">Card</p>
            <h2 className="text-2xl font-bold mt-1">
              ₹ {report.card}
            </h2>
          </div>

          {/* UPI */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-5 rounded-2xl shadow-lg hover:scale-105 transition">
            <p className="text-orange-100">UPI</p>
            <h2 className="text-2xl font-bold mt-1">
              ₹ {report.upi}
            </h2>
          </div>

        </div>

      </div>
    </Layout>
  );
};

export default CashierReport;