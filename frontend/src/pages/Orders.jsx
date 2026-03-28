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

  //  FETCH ORDERS
  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data.orders || res.data);
    } catch (err) {
      console.log(err);
    }
  };

  //  FILTER LOGIC
  const filteredOrders = orders
    .filter((o) =>
      o._id.toLowerCase().includes(search.toLowerCase())
    )
    .filter((o) =>
      paymentFilter ? o.paymentMethod === paymentFilter : true
    );

  return (
    <Layout>
      <div className="p-6">

        <h1 className="text-2xl font-bold mb-6">
           Order History
        </h1>

        {/*  SEARCH */}
        <input
          placeholder=" Search Order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 p-3 border rounded-lg"
        />

        {/* PAYMENT FILTER */}
        <select
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="mb-4 p-2 border rounded"
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
              className="bg-white p-5 rounded-xl shadow mb-4 hover:shadow-md transition"
            >
              {/* HEADER */}
              <div className="flex justify-between mb-3">
                <p className="font-bold text-gray-800">
                  Order ID: {order._id.slice(-6)}
                </p>

                <p className="text-gray-500 text-sm">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              {/* ITEMS */}
              <div className="mb-3">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm mb-1"
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

              <hr className="my-2" />

              {/* FOOTER */}
              <div className="flex justify-between items-center mt-2">
                <p className="font-semibold text-lg">
                  ₹ {order.totalAmount}
                </p>

                <span
                  className={`px-3 py-1 rounded text-sm ${
                    order.paymentMethod === "cash"
                      ? "bg-green-100 text-green-700"
                      : order.paymentMethod === "card"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
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