import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../api.js";
import ServiceRequestForm from "../components/ServiceRequestForm.jsx";

export default function EntrepreneurDetails() {
  const { id } = useParams();
  const [entrepreneur, setEntrepreneur] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [entrepreneurData, reviewData] = await Promise.all([
          apiRequest(`/entrepreneurs/${id}`),
          apiRequest(`/reviews?entrepreneur=${id}`)
        ]);
        setEntrepreneur(entrepreneurData.data);
        setReviews(reviewData.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="h-56 bg-gray-100 animate-pulse rounded-xl" />
      </div>
    );
  }

  if (error) {
    return <p className="p-8 text-red-500">{error}</p>;
  }

  if (!entrepreneur) return null;

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
          <p>Rating: {averageRating} ⭐ ({reviews.length} reviews)</p>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold">Reviews</h3>
          <div className="mt-3 space-y-3">
            {reviews.length === 0 && (
              <p className="text-sm text-gray-500">No results found.</p>
            )}
            {reviews.map((review) => (
              <div key={review._id} className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-sm font-medium">{review.customer?.name || "Customer"}</p>
                <p className="text-xs text-gray-500">Rating: {review.rating} ⭐</p>
                {review.comment && <p className="text-sm mt-2">{review.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-3">Request a Service</h3>
        <ServiceRequestForm entrepreneurId={entrepreneur._id} />
      </div>
    </section>
  );
}
