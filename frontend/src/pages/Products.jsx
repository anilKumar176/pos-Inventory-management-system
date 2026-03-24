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

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔄 FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data.products || res.data);
    } catch (err) {
      toast.error("Failed to load products ❌");
    }
  };

  // 📝 HANDLE CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ➕ ADD PRODUCT
  const addProduct = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!form.name || !form.price || !form.stock) {
        toast.error("Fill required fields ❌");
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

      toast.success("Product Added ✅");
      resetForm();
      fetchProducts();
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error("Error adding product ❌");
    }
  };

  // ✏️ UPDATE PRODUCT
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

      toast.success("Product Updated ✅");
      resetForm();
      fetchProducts();
    } catch {
      toast.error("Error updating ❌");
    }
  };

  // ❌ DELETE
  const deleteProduct = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Deleted ✅");
      fetchProducts();
    } catch {
      toast.error("Error deleting ❌");
    }
  };

  // 🔄 RESET
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

  // 🔍 FILTER
  const filteredProducts = products
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) =>
      category ? p.category === category : true
    );

  return (
    <Layout>
      <div className="p-6 bg-gray-100 min-h-screen">

        <h1 className="text-2xl font-bold mb-6">
          📦 Product Management
        </h1>

        {/* SEARCH */}
        <input
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 p-3 border rounded-lg"
        />

        {/* CATEGORY */}
        <select
          onChange={(e) => setCategory(e.target.value)}
          className="mb-4 p-2 border rounded"
        >
          <option value="">All Categories</option>
          <option value="Footwear">Footwear</option>
          <option value="Clothing">Clothing</option>
        </select>

        {/* FORM */}
        <form
          onSubmit={addProduct}
          className="bg-white p-6 rounded-xl shadow mb-6 grid grid-cols-2 gap-4"
        >
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2 rounded" />
          <input name="sku" placeholder="SKU" value={form.sku} onChange={handleChange} className="border p-2 rounded" />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} className="border p-2 rounded" />
          <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} className="border p-2 rounded" />
          <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} className="border p-2 rounded" />
          <input name="barcode" placeholder="Barcode" value={form.barcode} onChange={handleChange} className="border p-2 rounded" />

          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />

          <input
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />

          <button className="bg-blue-600 text-white py-2 rounded col-span-2 hover:bg-blue-700">
            ➕ Add Product
          </button>

          <button
            type="button"
            onClick={updateProduct}
            className="bg-green-600 text-white py-2 rounded col-span-2 hover:bg-green-700"
          >
            ✏️ Update Product
          </button>
        </form>

        {/* PRODUCTS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p._id}
              className="bg-white p-4 rounded-xl shadow hover:shadow-xl transition duration-300"
            >
              <img
                src={p.image || "https://via.placeholder.com/150"}
                alt={p.name}
                className="w-full h-32 object-cover rounded mb-2"
              />

              <h3 className="font-bold text-lg">{p.name}</h3>

              <p className="text-blue-600 font-semibold">
                ₹ {p.price}
              </p>

              <p className="text-sm text-gray-500">
                Stock: {p.stock}
              </p>

              {/* BUTTONS */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setForm(p)}
                  className="flex-1 bg-yellow-500 text-white py-1 rounded hover:bg-yellow-600"
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() => deleteProduct(p._id)}
                  className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
};

export default Products;