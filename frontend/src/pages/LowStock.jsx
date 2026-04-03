import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { toast } from "react-toastify";

const LowStock = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchLowStock();
    checkLowStock();
  }, []);

  
  const fetchLowStock = async () => {
    try {
      const res = await API.get("/products/low-stock");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  //  TOAST ALERT
  const checkLowStock = async () => {
    try {
      const res = await API.get("/products/low-stock");

      if (res.data.length > 0) {
        toast.warn(" Some products are low in stock!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <div className="p-6">

        <h1 className="text-2xl font-bold mb-6">
           Low Stock Products
        </h1>

        {products.length === 0 ? (
          <p className="text-gray-400 text-center">
            No low stock items
          </p>
        ) : (
          products.map((p) => (
            <div
              key={p._id}
              className="bg-white p-5 rounded-xl shadow mb-3 flex justify-between hover:shadow-md transition"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  {p.name}
                </p>
                <p className="text-sm text-gray-500">
                  SKU: {p.sku}
                </p>
              </div>

              <span className="bg-red-100 text-red-600 px-3 py-1 rounded">
                Stock: {p.stock}
              </span>
            </div>
          ))
        )}

      </div>
    </Layout>
  );
};

export default LowStock;