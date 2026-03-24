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

    let cash = 0, card = 0, upi = 0;

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
      <h1 className="text-2xl font-bold mb-6">
        📊 Cashier Daily Report
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">

        <div className="bg-white p-4 rounded-xl shadow">
          <p>Total Orders</p>
          <h2 className="text-xl font-bold">{report.totalOrders}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p>Total Revenue</p>
          <h2 className="text-xl font-bold text-blue-600">
            ₹ {report.totalRevenue}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p>Cash</p>
          <h2 className="text-green-600 font-bold">₹ {report.cash}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p>Card</p>
          <h2 className="text-purple-600 font-bold">₹ {report.card}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p>UPI</p>
          <h2 className="text-orange-600 font-bold">₹ {report.upi}</h2>
        </div>

      </div>
    </Layout>
  );
};

export default CashierReport;