import React, { useState, useEffect } from "react";
import AddNewProduct from "./AddnewProducts";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../constants/config";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: string;
  image: string;
}

const AdminPanel: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editFormData, setEditFormData] = useState<{ price: string }>({
    price: "",
  });
  const [newImage, setNewImage] = useState<File | null>(null);
  const [dimBackground, setDimBackground] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
  
    if (!token) {
      navigate("/admin-login");
    } else {
      setIsAuthenticated(true);
      fetchProducts();
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    navigate("/");
  };
  const fetchProducts = async () => {
    try {
       const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${server}/api/admin/getallproduct`, {
          headers: {
            "Content-Type": "application/json", 
            Authorization: `Bearer ${token}`,
          },
        });
      setProducts(response.data.products); // Fix: Accessing `products` inside the response
    } catch (error) {
      console.error("Please try to logout and then log in again as admin:", error);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file); // Fix: Storing the file itself instead of a URL
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;

    const formData = new FormData();
    formData.append("price", editFormData.price);
    if (newImage) formData.append("image", newImage); // Fix: Sending actual File object

    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `${server}/api/admin/updateproduct/${editProduct._id}`,
        formData,
        {
          headers: {
             "Content-Type": "multipart/form-data", 
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchProducts();
      setEditProduct(null);
      setNewImage(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${server}/api/admin/deleteproduct/${id}`,{
          headers: {
            "Content-Type": "application/json", 
            Authorization: `Bearer ${token}`,
          },
        });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <div style={{display:"flex",justifyContent:"space-between"}}>
      <button
        onClick={() => navigate("/admin-orders")}
        className="px-4 py-2 bg-blue-500 text-white rounded m-3"
      >
        Go to Admin Orders
      </button>
      <button
              className="bg-red-500 text-white rounded-2xl px-4 py-2 font-medium hover:bg-red-600 transition m-2"
              onClick={handleLogout}
            >
              Logout
            </button>
      </div>
      <div
        className={`relative min-h-screen p-4 bg-gray-900 text-white ${
          dimBackground ? "opacity-50" : "opacity-100"
        }`}
      >
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditProduct(null);
            setDimBackground(!showForm);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {showForm ? "Close Form" : "Add New Product"}
        </button>
        <button
        onClick={() => navigate("/admin-contact")}
        className="px-4 py-2 bg-blue-500 text-white rounded m-3"
      >
       Customer feedbacks
      </button>
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-20">
            <AddNewProduct
              closeForm={() => {
                setShowForm(false);
                setDimBackground(false);
              }}
            />
          </div>
        )}

        <h2 className="mt-6 text-xl font-bold">All Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="border p-4 relative bg-gray-800 rounded shadow-lg"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-contain scale-95 mb-2 rounded"
              />
              <h3 className="text-lg font-bold">{product.name}</h3>
              <p>description: {product.description}</p>
              <p>Price: ₹{product.price}</p>
              <div className="mt-2">
                <button
                  onClick={() => {
                    setEditProduct(product);
                    setEditFormData({ price: product.price });
                    setNewImage(null);
                    setShowForm(false);
                  }}
                  className="bg-yellow-500 text-white px-4 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-500 text-white px-4 py-1 rounded"
                >
                  Delete
                </button>
              </div>
              {editProduct?._id === product._id && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-gray-900 p-4 shadow-lg border mt-2 z-10 rounded w-64">
                  <form onSubmit={handleEditSubmit}>
                    <input
                      type="number"
                      name="price"
                      placeholder="New Price"
                      value={editFormData.price}
                      onChange={handleEditChange}
                      required
                      className="block mb-2 p-2 border w-full bg-gray-700 text-white"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block mb-2 p-2 border w-full bg-gray-700 text-white"
                    />
                    {newImage && (
                      <img
                        src={URL.createObjectURL(newImage)}
                        alt="Preview"
                        className="w-full h-20 object-cover mb-2 rounded"
                      />
                    )}
                    <button
                      type="submit"
                      className="bg-yellow-500 text-white px-4 py-2 rounded w-full"
                    >
                      Update Product
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
