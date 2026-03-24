import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const POS = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔄 FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data.products || res.data);
    } catch {
      toast.error("Failed to load products ❌");
    }
  };

  // 🛒 ADD TO CART
  const addToCart = (product) => {
    const exist = cart.find((item) => item._id === product._id);

    if (exist) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  // ➕ INCREASE
  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item._id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  // ➖ DECREASE
  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item._id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  // ❌ REMOVE ITEM
  const removeItem = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  // 💰 TOTAL
  const total = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // 🧾 PLACE ORDER
  const placeOrder = async () => {
    try {
      if (cart.length === 0) {
        toast.warning("Cart is empty ⚠️");
        return;
      }

      const token = localStorage.getItem("token");

      const items = cart.map((item) => ({
        product: item._id,
        quantity: item.qty,
        price: item.price,
      }));

      await API.post(
        "/orders",
        {
          items,
          paymentMethod,
          totalAmount: total,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Order placed successfully ✅");

      navigate("/invoice", {
        state: {
          items: cart,
          total,
          paymentMethod,
        },
      });

      setCart([]);

    } catch (err) {
      console.log(err);
      toast.error("Order failed ❌");
    }
  };

  return (
    <Layout>
      <div className="p-6 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">

        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          🛒 POS Billing
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* PRODUCTS */}
          <div className="bg-white p-5 rounded-2xl shadow-lg">

            <input
              type="text"
              placeholder="🔍 Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 mb-5 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <div className="grid grid-cols-2 gap-4">

              {products
                .filter((p) =>
                  p.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((p) => (
                  <div
                    key={p._id}
                    onClick={() => addToCart(p)}
                    className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-xl shadow hover:shadow-xl cursor-pointer transition"
                  >
                    {/* IMAGE */}
                    <img
                      src={p.image || "https://via.placeholder.com/150"}
                      alt={p.name}
                      className="w-full h-24 object-cover rounded mb-2"
                    />

                    <h3 className="text-sm font-semibold text-gray-800">
                      {p.name}
                    </h3>

                    <p className="text-blue-600 font-bold">
                      ₹{p.price}
                    </p>
                  </div>
                ))}

            </div>
          </div>

          {/* CART */}
          <div className="bg-white p-5 rounded-2xl shadow-lg flex flex-col">

            <h3 className="font-bold text-lg mb-4">🛒 Cart</h3>

            <div className="flex-1 overflow-y-auto">

              {cart.length === 0 ? (
                <p className="text-gray-400 text-center mt-10">
                  No items in cart 🛒
                </p>
              ) : (
                cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center mb-3 border-b pb-2"
                  >
                    <div className="flex gap-3 items-center">

                      {/* IMAGE */}
                      <img
                        src={item.image || "https://via.placeholder.com/100"}
                        className="w-12 h-12 rounded object-cover"
                      />

                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          ₹{item.price} × {item.qty}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">

                      <button
                        onClick={() => decreaseQty(item._id)}
                        className="bg-red-500 text-white px-2 rounded"
                      >
                        -
                      </button>

                      <span>{item.qty}</span>

                      <button
                        onClick={() => increaseQty(item._id)}
                        className="bg-green-500 text-white px-2 rounded"
                      >
                        +
                      </button>

                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-red-600 text-sm"
                      >
                        ✖
                      </button>

                    </div>
                  </div>
                ))
              )}

            </div>

            {/* TOTAL */}
            <div className="border-t pt-4 mt-4">

              <h3 className="font-bold text-xl mb-4 text-blue-600">
                Total: ₹ {total}
              </h3>

              {/* PAYMENT */}
              <div className="mb-4">
                <p className="font-semibold mb-2">Payment Method</p>

                <div className="flex gap-2">
                  {["cash", "card", "upi"].map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`px-3 py-2 rounded-lg transition ${
                        paymentMethod === method
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {method.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* BUTTON */}
              <button
                onClick={placeOrder}
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
              >
                🧾 Place Order
              </button>

              <button
                onClick={() => setCart([])}
                className="w-full mt-2 bg-gray-500 text-white p-2 rounded-lg"
              >
                Clear Cart
              </button>

            </div>

          </div>

        </div>
      </div>
    </Layout>
  );
};

export default POS;