import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { toast } from "react-toastify";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [form, setForm] = useState({
    _id: "",
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
    barcode: "",
    description: "",
    image: "",
  });

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

  const resetForm = () => {
    setForm({
      _id: "",
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

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/products/create",
        {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Product Added ✅");
      resetForm();
      fetchProducts();
    } catch {
      toast.error("Error adding product ❌");
    }
  };

  const updateProduct = async () => {
    if (!form._id) {
      toast.warning("Select product first ⚠️");
      return;
    }

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
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Product Updated ✅");
      resetForm();
      fetchProducts();
    } catch {
      toast.error("Update failed ❌");
    }
  };

  const deleteProduct = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Deleted ✅");
      fetchProducts();
    } catch {
      toast.error("Delete failed ❌");
    }
  };

  const filteredProducts = products
    .filter((p) =>
      p.name?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) =>
      category ? p.category === category : true
    );

  const categories = [
    "Electronics","Clothing","Footwear","Groceries","Books",
    "Toys","Furniture","Beauty","Sports","Stationery",
    "Accessories","Mobile","Laptop","Kitchen","Home Decor",
    "Automobile","Health","Jewelry","Pet Supplies","Other"
  ];

  return (
    <Layout>
      <div className="p-6 min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#020617] text-white">

        <h1 className="text-3xl font-bold mb-6 text-indigo-400">
          Product Management
        </h1>

        {/* SEARCH */}
        <input
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        {/* CATEGORY FILTER */}
        <select
          onChange={(e) => setCategory(e.target.value)}
          className="mb-4 p-3 rounded bg-gray-800 text-white border border-gray-700"
        >
          <option value="">All Categories</option>
          {categories.map((cat, i) => (
            <option key={i}>{cat}</option>
          ))}
        </select>

        {/* FORM */}
        <form
          onSubmit={addProduct}
          className="bg-[#1e293b] border border-slate-700 p-6 rounded-xl mb-6 grid grid-cols-2 gap-4 shadow-lg"
        >
          {/* COMMON INPUT STYLE */}
          {[
            { name: "name", placeholder: "Name" },
            { name: "sku", placeholder: "SKU" },
          ].map((field) => (
            <input
              key={field.name}
              name={field.name}
              placeholder={field.placeholder}
              value={form[field.name]}
              onChange={handleChange}
              className="p-2 rounded bg-gray-800 text-white border border-gray-600 outline-none"
            />
          ))}

          {/* CATEGORY */}
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800 text-white border border-gray-600"
          >
            <option value="">Select Category</option>
            {categories.map((cat, i) => (
              <option key={i}>{cat}</option>
            ))}
          </select>

          {/* PRICE & STOCK */}
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800 text-white border border-gray-600"
          />

          <input
            name="stock"
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800 text-white border border-gray-600"
          />

          <input
            name="barcode"
            placeholder="Barcode"
            value={form.barcode}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800 text-white border border-gray-600"
          />

          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800 text-white border border-gray-600 col-span-2"
          />

          <input
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800 text-white border border-gray-600 col-span-2"
          />

          {/* BUTTONS */}
          <button className="bg-indigo-600 hover:bg-indigo-700 py-2 rounded col-span-2 font-semibold">
            Add Product
          </button>

          <button
            type="button"
            onClick={updateProduct}
            className="bg-green-600 hover:bg-green-700 py-2 rounded col-span-2 font-semibold"
          >
            Update Product
          </button>
        </form>

        {/* PRODUCTS */}
        <div className="grid md:grid-cols-3 gap-4">
          {filteredProducts.length === 0 ? (
            <p className="text-gray-400 text-center col-span-3">
              No products found
            </p>
          ) : (
            filteredProducts.map((p) => (
              <div key={p._id} className="bg-[#1e293b] p-4 rounded-xl shadow border border-slate-700 hover:scale-105 transition">

                <img
                  src={p.image || "https://via.placeholder.com/150"}
                  className="w-full h-32 object-cover rounded mb-2"
                />

                <h3 className="font-bold">{p.name}</h3>
                <p className="text-green-400">₹ {p.price}</p>
                <p className="text-sm text-gray-400">Stock: {p.stock}</p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setForm(p)}
                    className="bg-yellow-500 px-3 py-1 rounded text-black"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteProduct(p._id)}
                    className="bg-red-600 px-3 py-1 rounded"
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