import { useEffect, useState } from "react";
import { apiRequest } from "../api.js";
import EntrepreneurCard from "../components/EntrepreneurCard.jsx";
import ProductCard from "../components/ProductCard.jsx";
import categories from "../data/categories.js";

const ENTREPRENEUR_LIMIT = 6;
const PRODUCT_LIMIT = 8;

export default function Marketplace() {
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    minPrice: "",
    maxPrice: ""
  });
  const [entrepreneurPage, setEntrepreneurPage] = useState(0);
  const [productPage, setProductPage] = useState(0);
  const [entrepreneurMeta, setEntrepreneurMeta] = useState({ total: 0 });
  const [productMeta, setProductMeta] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const entrepreneurQuery = new URLSearchParams({
          ...filters,
          limit: ENTREPRENEUR_LIMIT,
          skip: entrepreneurPage * ENTREPRENEUR_LIMIT
        }).toString();
        const productQuery = new URLSearchParams({
          ...filters,
          limit: PRODUCT_LIMIT,
          skip: productPage * PRODUCT_LIMIT
        }).toString();

        const [entrepreneurData, productData] = await Promise.all([
          apiRequest(`/entrepreneurs?${entrepreneurQuery}`),
          apiRequest(`/products?${productQuery}`)
        ]);
        setEntrepreneurs(entrepreneurData.data);
        setProducts(productData.data);
        setEntrepreneurMeta(entrepreneurData.pagination || { total: entrepreneurData.data.length });
        setProductMeta(productData.pagination || { total: productData.data.length });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [filters, entrepreneurPage, productPage]);

  const entrepreneurTotalPages = Math.ceil(entrepreneurMeta.total / ENTREPRENEUR_LIMIT) || 1;
  const productTotalPages = Math.ceil(productMeta.total / PRODUCT_LIMIT) || 1;

  const updateFilters = (nextFilters) => {
    setFilters(nextFilters);
    setEntrepreneurPage(0);
    setProductPage(0);
  };

  return (
    <section className="container mx-auto px-4 py-12 space-y-10">
      <div className="bg-white p-4 rounded-xl shadow-sm flex flex-wrap gap-4">
        <select
          className="border rounded-lg px-3 py-2"
          value={filters.category}
          onChange={(e) => updateFilters({ ...filters, category: e.target.value })}
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
          onChange={(e) => updateFilters({ ...filters, location: e.target.value })}
        />
        <input
          type="number"
          placeholder="Min price"
          className="border rounded-lg px-3 py-2"
          value={filters.minPrice}
          onChange={(e) => updateFilters({ ...filters, minPrice: e.target.value })}
        />
        <input
          type="number"
          placeholder="Max price"
          className="border rounded-lg px-3 py-2"
          value={filters.maxPrice}
          onChange={(e) => updateFilters({ ...filters, maxPrice: e.target.value })}
        />
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">{error}</div>
      )}

      <div>
        <h2 className="text-xl font-semibold">Featured Entrepreneurs</h2>
        {loading ? (
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            {Array.from({ length: ENTREPRENEUR_LIMIT }).map((_, index) => (
              <div key={index} className="h-40 bg-gray-100 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              {entrepreneurs.map((entrepreneur) => (
                <EntrepreneurCard key={entrepreneur._id} entrepreneur={entrepreneur} />
              ))}
            </div>
            {entrepreneurs.length === 0 && (
              <p className="text-sm text-gray-500 mt-4">No results found.</p>
            )}
            <div className="flex items-center gap-3 mt-4">
              <button
                className="px-3 py-1 rounded border disabled:opacity-50"
                onClick={() => setEntrepreneurPage((page) => Math.max(page - 1, 0))}
                disabled={entrepreneurPage === 0}
              >
                Prev
              </button>
              <span className="text-sm text-gray-600">
                Page {entrepreneurPage + 1} of {entrepreneurTotalPages}
              </span>
              <button
                className="px-3 py-1 rounded border disabled:opacity-50"
                onClick={() =>
                  setEntrepreneurPage((page) => Math.min(page + 1, entrepreneurTotalPages - 1))
                }
                disabled={entrepreneurPage >= entrepreneurTotalPages - 1}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold">Handmade Products</h2>
        {loading ? (
          <div className="grid md:grid-cols-4 gap-4 mt-4">
            {Array.from({ length: PRODUCT_LIMIT }).map((_, index) => (
              <div key={index} className="h-48 bg-gray-100 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-4 gap-4 mt-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            {products.length === 0 && (
              <p className="text-sm text-gray-500 mt-4">No results found.</p>
            )}
            <div className="flex items-center gap-3 mt-4">
              <button
                className="px-3 py-1 rounded border disabled:opacity-50"
                onClick={() => setProductPage((page) => Math.max(page - 1, 0))}
                disabled={productPage === 0}
              >
                Prev
              </button>
              <span className="text-sm text-gray-600">
                Page {productPage + 1} of {productTotalPages}
              </span>
              <button
                className="px-3 py-1 rounded border disabled:opacity-50"
                onClick={() => setProductPage((page) => Math.min(page + 1, productTotalPages - 1))}
                disabled={productPage >= productTotalPages - 1}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
