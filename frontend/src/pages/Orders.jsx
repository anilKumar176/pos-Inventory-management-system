import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data.orders || res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredOrders = orders
    .filter((o) =>
      o._id.toLowerCase().includes(search.toLowerCase())
    )
    .filter((o) =>
      paymentFilter ? o.paymentMethod === paymentFilter : true
    );

  return (
    <Layout>
      <div className="p-6 bg-gray-900 min-h-screen text-white">

        <h1 className="text-3xl font-bold mb-6 text-blue-400">
           Order History
        </h1>

        {/* SEARCH */}
        <input
          placeholder="Search Order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none"
        />

        {/* FILTER */}
        <select
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="mb-6 p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
        >
          <option value="">All Payments</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="upi">UPI</option>
        </select>

        {/* ORDERS */}
        {filteredOrders.length === 0 ? (
          <p className="text-gray-400 text-center">
            No orders found
          </p>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-gray-800 p-5 rounded-xl shadow-lg mb-4 hover:shadow-2xl transition"
            >
              {/* HEADER */}
              <div className="flex justify-between mb-3">
                <p className="font-bold text-white">
                  Order ID: #{order._id.slice(-6)}
                </p>

                <p className="text-gray-400 text-sm">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              {/* ITEMS */}
              <div className="mb-3 space-y-1">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm text-gray-300"
                  >
                    <span>
                      {item.product?.name || "Product"}
                    </span>

                    <span>
                      {item.quantity} × ₹{item.price}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="border-gray-700 my-2" />

              {/* FOOTER */}
              <div className="flex justify-between items-center mt-2">
                <p className="font-semibold text-lg text-green-400">
                  ₹ {order.totalAmount}
                </p>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.paymentMethod === "cash"
                      ? "bg-green-600/20 text-green-400"
                      : order.paymentMethod === "card"
                      ? "bg-purple-600/20 text-purple-400"
                      : "bg-blue-600/20 text-blue-400"
                  }`}
                >
                  {order.paymentMethod.toUpperCase()}
                </span>
              </div>
            </div>
          ))
        )}

      </div>
    </Layout>
  );
};

export default Orders;