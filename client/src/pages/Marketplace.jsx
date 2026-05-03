import { useEffect, useState } from "react";
import { apiRequest } from "../api.js";
import EntrepreneurCard from "../components/EntrepreneurCard.jsx";
import ProductCard from "../components/ProductCard.jsx";
import categories from "../data/categories.js";

export default function Marketplace() {
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ category: "", location: "" });

  useEffect(() => {
    async function loadData() {
      const query = new URLSearchParams(filters).toString();
      const [entrepreneurData, productData] = await Promise.all([
        apiRequest(`/entrepreneurs?${query}`),
        apiRequest(`/products?${query}`)
      ]);
      setEntrepreneurs(entrepreneurData.data);
      setProducts(productData.data);
    }
    loadData();
  }, [filters]);

  return (
    <section className="container mx-auto px-4 py-12 space-y-10">
      <div className="bg-white p-4 rounded-xl shadow-sm flex flex-wrap gap-4">
        <select
          className="border rounded-lg px-3 py-2"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Location"
          className="border rounded-lg px-3 py-2"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold">Featured Entrepreneurs</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {entrepreneurs.map((entrepreneur) => (
            <EntrepreneurCard key={entrepreneur._id} entrepreneur={entrepreneur} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Handmade Products</h2>
        <div className="grid md:grid-cols-4 gap-4 mt-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
