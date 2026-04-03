import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { toast } from "react-toastify";

const Users = () => {
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "cashier",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data);
    } catch {
      toast.error("Failed to load users ❌");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await API.post("/auth/create", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("User created ✅");

      setForm({
        name: "",
        email: "",
        password: "",
        role: "cashier",
      });

      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error ❌");
    }
  };

  const deleteUser = async (id, role) => {
    if (role === "admin") {
      toast.error("Admin cannot be deleted ❌");
      return;
    }

    if (!window.confirm("Delete user?")) return;

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/auth/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Deleted ✅");
      fetchUsers();
    } catch {
      toast.error("Delete failed ❌");
    }
  };

  return (
    <Layout>
      <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">

        {/* HEADER */}
        <h1 className="text-3xl font-semibold mb-6 tracking-wide">
          👥 Users Management
        </h1>

        {/* FORM */}
        <div className="bg-gray-800/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-gray-700 mb-6">

          <h2 className="text-lg font-semibold mb-4 text-gray-200">
            Create User
          </h2>

          <form className="grid md:grid-cols-4 gap-4" onSubmit={handleSubmit}>

            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="p-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="p-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="p-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="p-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="cashier">Cashier</option>
              <option value="admin">Admin</option>
            </select>

            <button className="md:col-span-4 bg-indigo-600 hover:bg-indigo-700 transition py-2 rounded-lg font-medium shadow-lg">
              ➕ Create User
            </button>

          </form>
        </div>

        {/* TABLE */}
        <div className="bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-700 overflow-hidden">

          <div className="p-4 border-b border-gray-700 text-gray-300 font-semibold">
            All Users
          </div>

          <table className="w-full text-sm">

            <thead className="bg-gray-900 text-gray-400">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="border-b border-gray-700 hover:bg-gray-900 transition"
                >
                  <td className="p-3 font-medium text-white">
                    {u.name}
                  </td>

                  <td className="p-3 text-gray-300">
                    {u.email}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        u.role === "admin"
                          ? "bg-purple-600/20 text-purple-400"
                          : "bg-green-600/20 text-green-400"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => deleteUser(u._id, u.role)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-xs shadow-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>
    </Layout>
  );
};

export default Users;