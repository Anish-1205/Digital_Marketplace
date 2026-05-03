export default function ProductCard({ product }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <img
        src={product.imageUrl || "https://placehold.co/600x400"}
        alt={product.name}
        className="h-40 w-full object-cover rounded-lg"
      />
      <h3 className="text-lg font-semibold mt-3">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.category}</p>
      <div className="mt-3 flex justify-between items-center">
        <span className="text-indigo-600 font-semibold">₹{product.price}</span>
        <span className="text-xs text-gray-400">Stock: {product.stock}</span>
      </div>
    </div>
  );
}
