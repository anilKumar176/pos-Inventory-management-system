// SAME IMPORTS (unchanged)
import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const POS = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data.products || res.data);
    } catch {
      toast.error("Failed to load products ❌");
    }
  };

  const categories = [...new Set(products.map(p => p.category || "Other"))];

  //  CART FUNCTIONS (UNCHANGED)
  const addToCart = (product) => {
    const exist = cart.find((item) => item._id === product._id);
    if (exist) {
      setCart(cart.map((item) =>
        item._id === product._id ? { ...item, qty: item.qty + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const increaseQty = (id) => {
    setCart(cart.map((item) =>
      item._id === id ? { ...item, qty: item.qty + 1 } : item
    ));
  };

  const decreaseQty = (id) => {
    setCart(cart
      .map((item) =>
        item._id === id ? { ...item, qty: item.qty - 1 } : item
      )
      .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  // 💰 TOTAL + DISCOUNT
  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discount = total * 0.05; // 5%
  const finalTotal = total - discount;

  //  PLACE ORDER (UNCHANGED)
  const placeOrder = async () => {
    try {
      if (cart.length === 0) {
        toast.warning("Cart is empty ");
        return;
      }

      const token = localStorage.getItem("token");

      const items = cart.map((item) => ({
        product: item._id,
        quantity: item.qty,
        price: item.price,
      }));

      await API.post("/orders",
        { items, paymentMethod, totalAmount: finalTotal },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Order placed successfully ");

      navigate("/invoice", {
        state: { items: cart, total: finalTotal, paymentMethod },
      });

      setCart([]);

    } catch (err) {
      console.log(err);
      toast.error("Order failed ❌");
    }
  };

  //  FILTER
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (category ? p.category === category : true)
  );

  return (
    <Layout>
      <div className="p-6 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">

        <h2 className="text-3xl font-bold mb-6 text-gray-800">
           POS Billing ({cart.length} items)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* PRODUCTS */}
          <div className="bg-white p-5 rounded-2xl shadow-lg">

            {/* SEARCH */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="🔍 Search product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
              <button
                onClick={() => setSearch("")}
                className="bg-gray-300 px-3 rounded"
              >
                ✖
              </button>
            </div>

            {/* CATEGORY */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 mb-5 border rounded-lg"
            >
              <option value="">All Categories</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* PRODUCTS */}
            <div className="grid grid-cols-2 gap-4">
              {filteredProducts.length === 0 ? (
                <p className="text-gray-400 col-span-2 text-center">
                  No products found 
                </p>
              ) : (
                filteredProducts.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => addToCart(p)}
                    className="bg-blue-50 p-3 rounded-xl shadow hover:shadow-xl cursor-pointer"
                  >
                    <img
                      src={p.image || "https://via.placeholder.com/150"}
                      className="w-full h-24 object-cover rounded mb-2"
                    />

                    <h3 className="text-sm font-semibold">
                      {p.name}
                    </h3>

                    <p className="text-blue-600 font-bold">
                      ₹{p.price}
                    </p>

                    {/* 🔥 LOW STOCK */}
                    {p.stock < 5 && (
                      <p className="text-red-500 text-xs">
                        Low Stock 
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

          </div>

          {/* CART */}
          <div className="bg-white p-5 rounded-2xl shadow-lg flex flex-col">

            <h3 className="font-bold text-lg mb-4">🛒 Cart</h3>

            <div className="flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-gray-400 text-center mt-10">
                  Cart empty 
                </p>
              ) : (
                cart.map((item) => (
                  <div key={item._id} className="flex justify-between mb-3 border-b pb-2">

                    <div>
                      <p>{item.name}</p>
                      <p className="text-sm text-gray-500">
                        ₹{item.price} × {item.qty}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => decreaseQty(item._id)}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => increaseQty(item._id)}>+</button>
                      <button onClick={() => removeItem(item._id)}>✖</button>
                    </div>

                  </div>
                ))
              )}
            </div>

            {/* TOTAL */}
            <div className="border-t pt-4">
              <p>Total: ₹{total}</p>
              <p className="text-green-600">Discount (5%): ₹{discount.toFixed(2)}</p>
              <h3 className="font-bold text-blue-600">
                Final: ₹{finalTotal.toFixed(2)}
              </h3>

              <button onClick={placeOrder} className="w-full bg-blue-600 text-white p-3 rounded mt-2">
                 Place Order
              </button>

              <button onClick={() => setCart([])} className="w-full mt-2 bg-gray-500 text-white p-2 rounded">
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