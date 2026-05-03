import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          HunarHub
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/marketplace" className="text-gray-700 hover:text-indigo-600">
            Marketplace
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600">
                Dashboard
              </Link>
              {user.role === "admin" && (
                <Link to="/admin" className="text-gray-700 hover:text-indigo-600">
                  Admin
                </Link>
              )}
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-indigo-600">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
              >
                Join
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
