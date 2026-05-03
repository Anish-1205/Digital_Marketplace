import { useEffect, useState } from "react";
import { apiRequest } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const [serviceRequests, setServiceRequests] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function loadData() {
      const [requestsData, ordersData] = await Promise.all([
        apiRequest("/service-requests"),
        apiRequest("/orders")
      ]);
      setServiceRequests(requestsData.data);
      setOrders(ordersData.data);
    }
    loadData();
  }, []);

  return (
    <section className="container mx-auto px-4 py-12 space-y-8">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <p className="text-sm text-gray-600">Welcome {user?.name}</p>

      <div>
        <h3 className="font-semibold">Service Requests</h3>
        <div className="space-y-2 mt-3">
          {serviceRequests.map((request) => (
            <div key={request._id} className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-sm">{request.description}</p>
              <p className="text-xs text-gray-500">Status: {request.status}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold">Orders</h3>
        <div className="space-y-2 mt-3">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-sm">Product: {order.product?.name}</p>
              <p className="text-xs text-gray-500">Status: {order.status}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
