import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import { server } from "../constants/config";

interface Product {
  name: string;
  category: string;
  description: string;
  sellingPrice: string;
  originalPrice: string;
  image: File | null;
  preview: string | null;
}

interface AddNewProductProps {
  closeForm: () => void;
}

const AddNewProduct: React.FC<AddNewProductProps> = ({ closeForm }) => {
  const [product, setProduct] = useState<Product>({
    name: "",
    category: "All Collections",
    description: "",
    sellingPrice: "",
    originalPrice: "",
    image: null,
    preview: null,
  });

  const categories: string[] = [
    "All Collections",
    "Verified Brand",
    "Verified Artist",
    "New Drop",
    "Live Shows",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setProduct({
        ...product,
        image: file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product.image) {
      alert("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("category", product.category || ""); // Default to empty string
    formData.append("description", product.description);
    formData.append("price", product.sellingPrice);
    formData.append("originalPrice", product.originalPrice);
    formData.append("image1", product.image);

    try {
      const token = localStorage.getItem("adminToken");

      const response = await axios.post(
        `${server}/api/admin/createproduct`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Product Created:", response.data);
      alert("Product added successfully!");
      closeForm();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 className="text-2xl font-bold mb-4 text-center text-black">
          Add New Product
        </h2>
        <button
          onClick={closeForm}
          className="text-black hover:opacity-70 transition mt-0.5 "
        >
          <AiOutlineClose size={20} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block font-medium text-black">Product Name:</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            className="w-full text-black px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product name"
          />
        </div>

        {/* Product Category */}
        <div>
          <label className="block font-medium text-black">
            Product Category:
          </label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="text-black w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat || "All Collections"}
              </option>
            ))}
          </select>
        </div>

        {/* Product Image */}
        <div>
          <label className="block font-medium text-black">Product Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="w-full text-black px-3 py-2 border rounded"
          />
          {product.preview && (
            <img
              src={product.preview}
              alt="Preview"
              className="bg-black mt-2 w-32 h-32 object-cover rounded"
            />
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium text-black">Description:</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full text-black px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product description"
          />
        </div>

        {/* Selling Price & Original Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-black block font-medium">
              Selling Price:
            </label>
            <input
              type="number"
              name="sellingPrice"
              value={product.sellingPrice}
              onChange={handleChange}
              required
              className="text-black w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="₹0.00"
            />
          </div>
          <div>
            <label className="block text-black font-medium">
              Original Price:
            </label>
            <input
              type="number"
              name="originalPrice"
              value={product.originalPrice}
              onChange={handleChange}
              required
              className="text-black w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="₹0.00"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddNewProduct;
