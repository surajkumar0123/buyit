import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { server } from "../constants/config";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: { url: string }[];
}

const categories = [
  "All Collections",
  "Verified Brands",
  "Verified Artists",
  "New Drops",
  "Live Shows",
];

const validCategoryMap: Record<string, string> = {
  "All Collections": "All Collections",
  "Verified Brands": "Verified Brand",
  "Verified Artists": "Verified Artist",
  "New Drops": "New Drop",
  "Live Shows": "Live Shows",
};

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All Collections");
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts(activeCategory);
  }, [activeCategory]);

  const fetchProducts = async (category: string) => {
    setLoading(true);
    setError(null);

    const validCategory = validCategoryMap[category] ?? "";
    const categoryQuery = validCategory
      ? `?category=${encodeURIComponent(validCategory)}`
      : "";

    try {
      const response = await axios.get(
        `${server}/api/product/productsbycategory${categoryQuery}`
      );
      setProducts(response.data?.products || []);
      if (!response.data?.products?.length) setError("No products available.");
    } catch (err) {
      setProducts([]);
      setError("Failed to fetch products. Please try again.");
      console.error("API request failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string) => {
    const token = localStorage.getItem("buyitid");
    if (!token) {
      setShowLoginDialog(true);
      return;
    }
    try {
      const token = localStorage.getItem("buyitid");
    
      const response = await axios.post(
        `${server}/api/cart/add`,
        { productId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    
      if (response.data.success) {
        setCartItems((prev) => [...prev, productId]);
      }
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen p-6" id="shop">
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-md text-sm transition ${
              activeCategory === category
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <h1 className="text-3xl font-bold text-center mb-6">{activeCategory}</h1>

      {loading && <p className="text-center text-gray-400">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-gray-900 p-4 rounded-lg shadow-lg"
          >
            <img
              src={
                product.images[0]?.url ||
                "https://via.placeholder.com/300?text=No+Image"
              }
              alt={product.name}
              className="w-full h-64 object-cover rounded-md"
            />
            <div className="mt-4">
              <p className="text-sm text-gray-400">@Oversized</p>
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-400 text-sm">{product.description}</p>
              <p className="text-purple-400 font-bold mt-2">
                Rs. {product.price}
              </p>
              <div className="flex justify-between items-center mt-3">
                <button
                  onClick={() => navigate("/buy-now", { state: { product } })}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-800 transition"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => addToCart(product._id)}
                  className="text-lg transition"
                >
                  {cartItems.includes(product._id) ? "❤️" : "♡"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showLoginDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <p className="text-white text-lg mb-4">
              Please log in to add products to the cart.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate("/login")}
                className="bg-purple-600 px-4 py-2 rounded-md text-white hover:bg-purple-800"
              >
                Login
              </button>
              <button
                onClick={() => setShowLoginDialog(false)}
                className="bg-gray-600 px-4 py-2 rounded-md text-white hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
