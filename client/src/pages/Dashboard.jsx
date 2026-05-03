import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const [serviceRequests, setServiceRequests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [entrepreneur, setEntrepreneur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const requestsPromise = apiRequest("/service-requests");
      const ordersPromise = apiRequest("/orders");
      const entrepreneurPromise =
        user?.role === "entrepreneur" ? apiRequest("/entrepreneurs/me") : Promise.resolve(null);
      const [requestsData, ordersData, entrepreneurData] = await Promise.all([
        requestsPromise,
        ordersPromise,
        entrepreneurPromise
      ]);
      setServiceRequests(requestsData.data);
      setOrders(ordersData.data);
      setEntrepreneur(entrepreneurData?.data || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const earnings = useMemo(() => {
    if (user?.role !== "entrepreneur") return 0;
    const serviceEarnings = serviceRequests
      .filter((request) => request.status === "completed")
      .reduce((sum, request) => sum + (request.priceOffer || 0), 0);
    const orderEarnings = orders
      .filter((order) => order.status === "delivered")
      .reduce(
        (sum, order) => sum + (order.product?.price || 0) * (order.quantity || 1),
        0
      );
    return serviceEarnings + orderEarnings;
  }, [orders, serviceRequests, user]);

  const updateRequestStatus = async (id, status) => {
    setActionError(null);
    try {
      await apiRequest(`/service-requests/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      await loadData();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const toggleAvailability = async () => {
    if (!entrepreneur) return;
    setActionError(null);
    const nextAvailability =
      entrepreneur.availability === "Available" ? "Unavailable" : "Available";
    try {
      await apiRequest(`/entrepreneurs/${entrepreneur._id}`, {
        method: "PATCH",
        body: JSON.stringify({ availability: nextAvailability })
      });
      await loadData();
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <section className="container mx-auto px-4 py-12 space-y-8">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <p className="text-sm text-gray-600">Welcome {user?.name}</p>

      {loading && (
        <div className="h-40 bg-gray-100 animate-pulse rounded-xl" />
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {actionError && <p className="text-sm text-red-500">{actionError}</p>}

      {user?.role === "entrepreneur" && entrepreneur && !loading && (
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="font-semibold">Entrepreneur Controls</h3>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <span className="text-sm text-gray-600">
              Availability: {entrepreneur.availability}
            </span>
            <button
              className="px-4 py-2 rounded-lg border"
              onClick={toggleAvailability}
            >
              Toggle Availability
            </button>
            <span className="text-sm font-semibold text-indigo-600">
              Earnings: ₹{earnings}
            </span>
          </div>
        </div>
      )}

      {!loading && (
        <div>
          <h3 className="font-semibold">Service Requests</h3>
          <div className="space-y-2 mt-3">
            {serviceRequests.length === 0 && (
              <p className="text-sm text-gray-500">No service requests yet.</p>
            )}
            {serviceRequests.map((request) => (
              <div key={request._id} className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-sm">{request.description}</p>
                <p className="text-xs text-gray-500">Status: {request.status}</p>
                {user?.role === "entrepreneur" && request.status === "pending" && (
                  <div className="mt-3 flex gap-2">
                    <button
                      className="px-3 py-1 rounded bg-green-600 text-white text-xs"
                      onClick={() => updateRequestStatus(request._id, "accepted")}
                    >
                      Accept
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-red-600 text-white text-xs"
                      onClick={() => updateRequestStatus(request._id, "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && (
        <div>
          <h3 className="font-semibold">Orders</h3>
          <div className="space-y-2 mt-3">
            {orders.length === 0 && <p className="text-sm text-gray-500">No orders yet.</p>}
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-sm">Product: {order.product?.name}</p>
                <p className="text-xs text-gray-500">Status: {order.status}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
