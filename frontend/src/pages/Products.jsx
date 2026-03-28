import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { toast } from "react-toastify";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
    barcode: "",
    description: "",
    image: "",
  });

  //  FIXED 20 CATEGORIES
  const categories = [
    "Footwear","Clothing","Electronics","Groceries","Accessories",
    "Bags","Watches","Mobile","Laptop","Furniture",
    "Beauty","Toys","Stationery","Sports","Books",
    "Kitchen","Home Decor","Fitness","Automobile","Health"
  ];

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addProduct = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!form.name || !form.price || !form.stock || !form.category) {
        toast.error("Fill all required fields ❌");
        return;
      }

      await API.post(
        "/products/create",
        {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Product Added ");
      resetForm();
      fetchProducts();
    } catch {
      toast.error("Error adding product ❌");
    }
  };

  const updateProduct = async () => {
    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/products/${form._id}`,
        {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Product Updated ");
      resetForm();
      fetchProducts();
    } catch {
      toast.error("Error updating ❌");
    }
  };

  const deleteProduct = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Deleted ");
      fetchProducts();
    } catch {
      toast.error("Error deleting ❌");
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      sku: "",
      category: "",
      price: "",
      stock: "",
      barcode: "",
      description: "",
      image: "",
    });
  };

  // SMART SEARCH (MAGGI FIX)
  const filteredProducts = products
    .filter((p) => {
      const text = search.trim().toLowerCase();

      return (
        (p.name || "").toLowerCase().includes(text) ||
        (p.category || "").toLowerCase().includes(text) ||
        (p.description || "").toLowerCase().includes(text)
      );
    })
    .filter((p) =>
      category ? p.category === category : true
    );

  return (
    <Layout>
      <div className="p-6 bg-gray-100 min-h-screen">

        <h1 className="text-2xl font-bold mb-6">
           Product Management ({products.length})
        </h1>

        {/*  SEARCH */}
        <div className="flex gap-2 mb-4">
          <input
            placeholder="Search product (e.g. maggi)..."
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

        {/* CATEGORY FILTER */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mb-4 p-2 border rounded"
        >
          <option value="">All Categories</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* FORM */}
        <form
          onSubmit={addProduct}
          className="bg-white p-6 rounded-xl shadow mb-6 grid grid-cols-2 gap-4"
        >
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2 rounded" />
          <input name="sku" placeholder="SKU" value={form.sku} onChange={handleChange} className="border p-2 rounded" />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>

          <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} className="border p-2 rounded" />
          <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} className="border p-2 rounded" />
          <input name="barcode" placeholder="Barcode" value={form.barcode} onChange={handleChange} className="border p-2 rounded" />

          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 rounded col-span-2" />
          <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} className="border p-2 rounded col-span-2" />

          <button className="bg-blue-600 text-white py-2 rounded col-span-2">
            Add Product
          </button>

          <button
            type="button"
            onClick={updateProduct}
            className="bg-green-600 text-white py-2 rounded col-span-2"
          >
            ✏️ Update Product
          </button>
        </form>

        {/* PRODUCTS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {filteredProducts.length === 0 ? (
            <p className="text-gray-400 col-span-3 text-center">
              No products found 
            </p>
          ) : (
            filteredProducts.map((p) => (
              <div key={p._id} className="bg-white p-4 rounded-xl shadow">

                <img
                  src={p.image || "https://via.placeholder.com/150"}
                  className="w-full h-32 object-cover rounded mb-2"
                />

                <h3 className="font-bold">{p.name}</h3>
                <p>₹ {p.price}</p>
                <p>Stock: {p.stock}</p>
                <p className="text-sm text-gray-500">
                  Category: {p.category}
                </p>

                {p.stock < 5 && (
                  <p className="text-red-500 text-xs">
                    Low Stock 
                  </p>
                )}

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setForm(p)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteProduct(p._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>

              </div>
            ))
          )}

        </div>

      </div>
    </Layout>
  );
};

export default Products;