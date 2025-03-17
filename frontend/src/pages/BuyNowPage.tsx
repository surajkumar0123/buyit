
// Declare Razorpay globally
declare var Razorpay: any;

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { server } from "../constants/config";

// Type for Product
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: { url: string }[];
}

const BuyNowPage: React.FC = () => {
  const location = useLocation();
  const product = location.state?.product as Product | undefined;

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [pinCode, setPinCode] = useState<string>("");
  const [phoneNo, setPhoneNo] = useState<string>("");
 // const [orderId, setOrderId] = useState<any | null>(null);
  const [productPrice, setProductPrice] = useState<number | null>(null);

  useEffect(() => {
    if (!product) {
      setError("No product selected.");
    } else {
      axios
        .get(`${server}/api/product/productdetails/${product._id}`)
        .then(({ data }) => setProductPrice(data.product.price))
        .catch(() => setError("Failed to fetch product details."));
    }
  }, [product]);
  const handlePayment = async () => {
    if (!address || !city || !state || !country || !pinCode || !phoneNo) {
      setError("Please fill in all address fields.");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("buyitid");
      const { data } = await axios.post(
        `${server}/api/order/create`,
        {
          shippingInfo: { address, city, state, country, pinCode, phoneNo },
          orderItems: [
            { name: product?.name, quantity, product: product?._id },
          ],
        },
        {
          headers: {
           "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if(data.message){
        setError(data.message);
      }
      const newOrderId = data.order._id;
      //setOrderId(data.order._id);
      const { data: keyData } = await axios.get(
        `${server}/api/payment/getkey`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      const { key } = keyData;

      const { data: orderData } = await axios.post(
        `${server}/api/payment/process`,
        { amount: productPrice! * quantity },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      const { order } = orderData;
      //openRazorpay(key, order);
      // const options = {
      //   key,
      //   amount: order.amount,
      //   currency: "INR",
      //   name: "buyit",
      //   description: "cloth brand",
      //   order_id: order.id,
      //   callback_url: `${server}/api/payment/paymentVerification/${orderId}`,
      //   prefill: { name: "User", email: "user@example.com", contact: phoneNo },
      //   theme: { color: "#6C5DD3" },
      // };
      // const rzp = new Razorpay(options);
      // rzp.open();
      const openRazorpay = (key: string, order: any) => {
        const options = {
          key,
          amount: order.amount,
          currency: "INR",
          name: "buyit",
          description: "Cloth Brand",
          order_id: order.id,
          callback_url: `${server}/api/payment/paymentVerification/${newOrderId}`,
          prefill: {
            name: "User",
            email: "user@example.com",
            contact: phoneNo,
          },
          theme: { color: "#6C5DD3" },
        };

        const rzp = new Razorpay(options);
        rzp.open();
      };
      openRazorpay(key, order);
    } catch (error) {
      setError("Payment failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
        <img
          src={product?.images[0].url}
          alt={product?.name}
          className="w-full h-64 object-cover rounded-md"
        />
        <h2 className="text-lg font-semibold mt-4">{product?.name}</h2>
        <p className="text-gray-400">{product?.description}</p>

        <div className="flex items-center justify-between mt-4">
          <button
            className="bg-gray-700 text-white px-3 py-1 rounded-md hover:bg-gray-600"
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
          >
            -
          </button>
          <span className="text-xl font-semibold">{quantity}</span>
          <button
            className="bg-gray-700 text-white px-3 py-1 rounded-md hover:bg-gray-600"
            onClick={() => setQuantity((prev) => prev + 1)}
          >
            +
          </button>
        </div>

        <div className="mt-4">
          <input
            type="text"
            placeholder="Address"
            className="w-full p-2 mb-2 bg-gray-800"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            type="text"
            placeholder="City"
            className="w-full p-2 mb-2 bg-gray-800"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            type="text"
            placeholder="State"
            className="w-full p-2 mb-2 bg-gray-800"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter size"
            className="w-full p-2 mb-2 bg-gray-800"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <input
            type="text"
            placeholder="Pin Code"
            className="w-full p-2 mb-2 bg-gray-800"
            value={pinCode}
            onChange={(e) => setPinCode(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone No"
            className="w-full p-2 mb-2 bg-gray-800"
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
          />
        </div>

        <p className="text-purple-400 font-bold text-xl mt-2">
          Rs. {productPrice !== null ? productPrice * quantity : "Loading..."}
        </p>
        <button
          onClick={handlePayment}
          className="mt-4 w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-800"
          disabled={
            !address ||
            !city ||
            !state ||
            !country ||
            !pinCode ||
            !phoneNo ||
            loading
          }
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default BuyNowPage;
