import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900">
          Discover local talent. Empower micro-entrepreneurs.
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          HunarHub connects skilled artisans, tailors, potters, cobblers, and small vendors with
          customers in their community. Book services, buy handmade products, and support local
          economies.
        </p>
        <div className="mt-6 flex gap-4">
          <Link
            to="/marketplace"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg"
          >
            Explore Marketplace
          </Link>
          <Link
            to="/register"
            className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg"
          >
            Join as Entrepreneur
          </Link>
        </div>
      </div>
    </section>
  );
}
