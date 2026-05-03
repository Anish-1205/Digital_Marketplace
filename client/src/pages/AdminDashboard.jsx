import { useEffect, useState } from "react";
import { apiRequest } from "../api.js";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    apiRequest("/admin/metrics").then((data) => setMetrics(data.data));
  }, []);

  if (!metrics) return <p className="p-8">Loading...</p>;

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-semibold">Admin Analytics</h2>
      <div className="grid md:grid-cols-4 gap-4 mt-6">
        {Object.entries(metrics).map(([key, value]) => (
          <div key={key} className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500">{key}</p>
            <p className="text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
