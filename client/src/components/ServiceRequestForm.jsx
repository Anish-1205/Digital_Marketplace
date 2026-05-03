import { useState } from "react";
import { apiRequest } from "../api.js";

export default function ServiceRequestForm({ entrepreneurId }) {
  const [form, setForm] = useState({
    description: "",
    scheduledDate: "",
    priceOffer: ""
  });
  const [status, setStatus] = useState(null);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await apiRequest("/service-requests", {
        method: "POST",
        body: JSON.stringify({ ...form, entrepreneur: entrepreneurId })
      });
      setStatus("Request submitted!");
      setForm({ description: "", scheduledDate: "", priceOffer: "" });
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        name="description"
        placeholder="Describe the service needed"
        className="w-full border rounded-lg px-3 py-2"
        value={form.description}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="scheduledDate"
        className="w-full border rounded-lg px-3 py-2"
        value={form.scheduledDate}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="priceOffer"
        placeholder="Offer price (₹)"
        className="w-full border rounded-lg px-3 py-2"
        value={form.priceOffer}
        onChange={handleChange}
        required
      />
      <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
        Send Request
      </button>
      {status && <p className="text-sm text-gray-600">{status}</p>}
    </form>
  );
}
