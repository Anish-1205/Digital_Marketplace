import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../api.js";
import ServiceRequestForm from "../components/ServiceRequestForm.jsx";

export default function EntrepreneurDetails() {
  const { id } = useParams();
  const [entrepreneur, setEntrepreneur] = useState(null);

  useEffect(() => {
    apiRequest(`/entrepreneurs/${id}`).then((data) => setEntrepreneur(data.data));
  }, [id]);

  if (!entrepreneur) return <p className="p-8">Loading...</p>;

  return (
    <section className="container mx-auto px-4 py-12 grid md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-semibold">{entrepreneur.businessName}</h2>
        <p className="text-sm text-gray-500">{entrepreneur.location}</p>
        <p className="mt-4 text-gray-700">{entrepreneur.description}</p>
        <div className="mt-4 text-sm text-gray-600">
          <p>Category: {entrepreneur.category}</p>
          <p>Experience: {entrepreneur.experience} years</p>
          <p>Starting at ₹{entrepreneur.basePrice}</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-3">Request a Service</h3>
        <ServiceRequestForm entrepreneurId={entrepreneur._id} />
      </div>
    </section>
  );
}
