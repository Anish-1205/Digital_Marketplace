import { Link } from "react-router-dom";

export default function EntrepreneurCard({ entrepreneur }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{entrepreneur.businessName}</h3>
        <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-600 rounded-full">
          {entrepreneur.category}
        </span>
      </div>
      <p className="text-sm text-gray-500 mt-2">{entrepreneur.location}</p>
      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
        {entrepreneur.description}
      </p>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-700">From ₹{entrepreneur.basePrice}</span>
        <Link
          to={`/entrepreneurs/${entrepreneur._id}`}
          className="text-indigo-600 text-sm font-medium"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
