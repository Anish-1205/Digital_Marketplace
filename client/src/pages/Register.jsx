import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer"
  });
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="container mx-auto px-4 py-12 max-w-xl">
      <h2 className="text-2xl font-semibold">Create your account</h2>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full name"
          className="w-full border rounded-lg px-3 py-2"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border rounded-lg px-3 py-2"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border rounded-lg px-3 py-2"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select
          name="role"
          className="w-full border rounded-lg px-3 py-2"
          value={form.role}
          onChange={handleChange}
        >
          <option value="customer">Customer</option>
          <option value="entrepreneur">Micro-Entrepreneur</option>
        </select>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
          Register
        </button>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>
    </section>
  );
}
