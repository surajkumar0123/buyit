import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "./assets/logo.png";
import cart from "./assets/cart.png";

const Navbar = (hello: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  console.log(hello);

  // Get user state from Redux
  const user = useSelector((state: any) => state.user);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = (): boolean => {
    return localStorage.getItem("buyitid") !== null;
  };
  
  useEffect(() => {
    setIsAuthenticated(checkAuth());
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("buyitid");
    setIsAuthenticated(false);
    navigate("/");
  };
  return (
    <nav className="bg-black w-full px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <img
          src={logo}
          alt="Logo"
          className="h-10 w-auto sm:h-10 md:h-15 lg:h-20 xl:h-20"
        />
        <div className="hidden md:flex bg-[#1F1F1F] text-white rounded-full px-6 py-3.5 gap-6 items-center">
          <a href="/" className="hover:text-gray-300 font-medium">
            Home
          </a>
          <a href="#shop" className="hover:text-gray-300 font-medium">
            Shop
          </a>
          <a href="/aboutus" className="hover:text-gray-300 font-medium">
            About Us
          </a>
          <a href="/contactus" className="hover:text-gray-300 font-medium">
            Contact Us
          </a>
          <a href="/admin" className="hover:text-gray-300 font-medium">
            Admin Login
          </a>
        </div>
        <div className="flex items-center gap-6">
          <img
            onClick={() => navigate("/cart")}
            src={cart}
            alt="Cart"
            className="h-8 w-auto cursor-pointer"
          />
          {user || isAuthenticated ? (
            <button
              className="bg-red-500 text-white rounded-2xl px-4 py-2 font-medium hover:bg-red-600 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <button
              className="bg-[#FFFFFFBD] text-black rounded-2xl px-4 py-2 font-medium hover:bg-gray-300 transition"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}
          <button
            className="md:hidden text-white text-2xl focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>
      </div>
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden mt-3 flex flex-col bg-[#1F1F1F] text-white rounded-lg py-3 px-4 space-y-2">
          <a href="/" className="py-2 hover:text-gray-300">
            Home
          </a>
          <a href="#shop" className="py-2 hover:text-gray-300">
            Shop
          </a>
          <a href="/aboutus" className="py-2 hover:text-gray-300">
            About Us
          </a>
          <a href="/contactus" className="py-2 hover:text-gray-300">
            Contact Us
          </a>
          <a href="#" className="py-2 hover:text-gray-300">
            Showcase
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
