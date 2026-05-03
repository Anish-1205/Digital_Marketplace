import { useEffect, useState } from "react";
import { apiRequest } from "../api.js";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [pendingEntrepreneurs, setPendingEntrepreneurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [metricsData, pendingData] = await Promise.all([
        apiRequest("/admin/metrics"),
        apiRequest("/admin/entrepreneurs")
      ]);
      setMetrics(metricsData.data);
      setPendingEntrepreneurs(pendingData.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const approveEntrepreneur = async (id) => {
    setError(null);
    try {
      await apiRequest(`/entrepreneurs/${id}/approve`, { method: "PATCH" });
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="h-40 bg-gray-100 animate-pulse rounded-xl" />
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12 space-y-8">
      <h2 className="text-2xl font-semibold">Admin Analytics</h2>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="grid md:grid-cols-4 gap-4">
        {metrics &&
          Object.entries(metrics).map(([key, value]) => (
            <div key={key} className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-sm text-gray-500">{key}</p>
              <p className="text-2xl font-semibold">{value}</p>
            </div>
          ))}
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="font-semibold">Pending Entrepreneur Approvals</h3>
        <div className="mt-4 space-y-3">
          {pendingEntrepreneurs.length === 0 && (
            <p className="text-sm text-gray-500">No results found.</p>
          )}
          {pendingEntrepreneurs.map((entrepreneur) => (
            <div key={entrepreneur._id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{entrepreneur.businessName}</p>
                <p className="text-xs text-gray-500">
                  {entrepreneur.user?.name} • {entrepreneur.user?.email}
                </p>
              </div>
              <button
                className="px-3 py-1 rounded bg-indigo-600 text-white text-sm"
                onClick={() => approveEntrepreneur(entrepreneur._id)}
              >
                Approve
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
