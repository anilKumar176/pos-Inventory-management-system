import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BarcodeScanner from "../components/BarcodeScanner";

const POS = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [barcodeInput, setBarcodeInput] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  const inputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    inputRef.current?.focus();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data.products || res.data);
    } catch {
      toast.error("Failed to load products ❌");
    }
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const exist = prev.find((item) => item._id === product._id);
      if (exist) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const fetchProduct = async (barcode) => {
    if (!barcode) return;

    try {
      const res = await API.get(`/products/barcode/${barcode}`);
      addToCart(res.data);

      toast.success("Product added ");

      setBarcodeInput("");
      inputRef.current?.focus();
      setShowScanner(false);
    } catch {
      toast.error("Product not found ❌");
    }
  };

  const handleScan = (barcode) => {
    fetchProduct(barcode);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchProduct(barcodeInput);
    }
  };

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const placeOrder = async () => {
    if (cart.length === 0) {
      toast.warning("Cart empty ");
      return;
    }

    if (!/^\d{10}$/.test(customerPhone)) {
      toast.error("Invalid phone number ❌");
      return;
    }

    try {
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
          totalAmount: total,
          paymentMethod,
          customerName,
          customerPhone,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Order placed ");

      navigate("/invoice", {
        state: {
          items: cart,
          total,
          paymentMethod,
          customerName,
        },
      });

      setCart([]);
      setCustomerName("");
      setCustomerPhone("");
    } catch {
      toast.error("Order failed ❌");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      {/* MAIN DARK BACKGROUND */}
      <div className="p-6 min-h-screen bg-[#020617] text-white">

        {/* HEADER */}
        <h2 className="text-3xl font-bold mb-6 text-indigo-400">
           POS Billing ({cart.length} items)
        </h2>

        {/* CUSTOMER */}
        <div className="bg-gray-800 p-4 rounded-xl mb-4 grid grid-cols-2 gap-3 shadow">
          <input
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="p-2 rounded bg-gray-900 border border-gray-700 text-white"
          />
          <input
            placeholder="Phone"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="p-2 rounded bg-gray-900 border border-gray-700 text-white"
          />
        </div>

        {/* BARCODE */}
        <div className="flex gap-2 mb-4">
          <input
            ref={inputRef}
            placeholder="Scan barcode..."
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 p-2 rounded bg-gray-800 border border-gray-700 text-white"
          />

          <button
            onClick={() => fetchProduct(barcodeInput)}
            className="bg-green-600 hover:bg-green-700 px-4 rounded"
          >
            Add
          </button>

          <button
            onClick={() => setShowScanner(!showScanner)}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 rounded"
          >
            📷
          </button>
        </div>

        {showScanner && (
          <div className="bg-gray-800 p-4 rounded-xl mb-4">
            <BarcodeScanner onScan={handleScan} />
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">

          {/* PRODUCTS */}
          <div className="bg-gray-800 p-4 rounded-xl shadow">
            <input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 mb-3 rounded bg-gray-900 border border-gray-700 text-white"
            />

            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((p) => (
                <div
                  key={p._id}
                  onClick={() => addToCart(p)}
                  className="bg-gray-700 hover:bg-indigo-600 transition p-3 rounded cursor-pointer"
                >
                  <p>{p.name}</p>
                  <p className="text-green-400">₹{p.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CART */}
          <div className="bg-gray-800 p-4 rounded-xl shadow flex flex-col">

            <h3 className="text-indigo-400 mb-2">🛒 Cart</h3>

            <div className="flex-1 space-y-2">
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between">
                  <span>{item.name} x {item.qty}</span>
                  <span className="text-green-400">
                    ₹{item.price * item.qty}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-700 pt-2 mt-2">
              <h3 className="text-lg font-bold">
                Total: <span className="text-green-400">₹{total}</span>
              </h3>

              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full mt-2 p-2 bg-gray-900 border border-gray-700 rounded"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
              </select>

              <button
                onClick={placeOrder}
                className="w-full bg-indigo-600 hover:bg-indigo-700 p-2 mt-3 rounded font-semibold"
              >
                Complete Payment
              </button>
            </div>

          </div>

        </div>
      </div>
    </Layout>
  );
};

export default POS;