
declare var Razorpay: any;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../constants/config";

interface CartItem {
  productId: string;
  quantity: number;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: { url: string }[];
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [pinCode, setPinCode] = useState<string>("");
  const [phoneNo, setPhoneNo] = useState<string>("");

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("buyitid");
      const { data } = await axios.get(`${server}/api/cart`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success && Array.isArray(data.cart)) {
        const formattedCart = data.cart.map((item: any) => ({
          productId:
            typeof item.productId === "object"
              ? item.productId._id
              : item.productId,
          quantity: item.quantity,
        }));
        setCartItems(formattedCart);
        fetchProductDetails(formattedCart);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Failed to fetch cart items", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductDetails = async (cart: CartItem[]) => {
    const productDetails: Record<string, Product> = {};

    await Promise.all(
      cart.map(async (item) => {
        try {
          const productId = item.productId;
          if (!productId) return;

          const { data } = await axios.get(
            `${server}/api/product/productdetails/${productId}`
          );
          if (data.success) {
            productDetails[productId] = data.product;
          }
        } catch (error) {
          console.error(
            `Failed to fetch product details for ${item.productId}`,
            error
          );
        }
      })
    );

    setProducts(productDetails);
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return; // Ensure quantity is at least 1
    
    try {
      const token = localStorage.getItem("buyitid");
      await axios.post(
        `${server}/api/cart/update`,
        { productId, quantity },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems((prev) =>
        prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
      );
    } catch (error) {
      console.error("Failed to update quantity", error);
    }
  };

  const deleteFromCart = async (productId: string) => {
    try {
      const token = localStorage.getItem("buyitid");
      await axios.post(
        `${server}/api/cart/delete`, 
        { productId }, 
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems((prev) => prev.filter((item) => item.productId !== productId));
    } catch (error) {
      console.error("Failed to remove item from cart", error);
    }
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const product = products[item.productId];
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const handlePayment = async () => {
    if (!address || !city || !state || !country || !pinCode || !phoneNo) {
      alert("Please fill in all address fields.");
      return;
    }
    try {
      const orderItems = cartItems.map((item) => ({
        name: products[item.productId]?.name,
        quantity: item.quantity,
        product: item.productId,
      }));
      const token = localStorage.getItem("buyitid");
      const { data } = await axios.post(
        `${server}/api/order/create`,
        {
          shippingInfo: { address, city, state, country, pinCode, phoneNo },
          orderItems,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const orderId = data.order._id;
      const { data: keyData } = await axios.get(
        `${server}/api/payment/getkey`,
        {
          withCredentials: true,
        }
      );

      const totalAmount = calculateTotalPrice();

      const { data: orderData } = await axios.post(
        `${server}/api/payment/process`,
        { amount: totalAmount },
        { withCredentials: true }
      );

      const openRazorpay = (key: string, order: any) => {
        const options = {
          key,
          amount: order.amount,
          currency: "INR",
          name: "buyit",
          description: "Cloth Brand",
          order_id: order.id,
          callback_url: `${server}/api/payment/paymentVerification/${orderId}`,
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
      openRazorpay(keyData.key, orderData.order);
    } catch (error) {
      alert("Payment failed. Please try again later.");
    }
  };

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Your Cart</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : cartItems.length === 0 ? (
        <p className="text-center text-gray-400">Your cart is empty.</p>
      ) : (
        <>
          <div className="grid gap-6">
            {cartItems.map((item) => {
              const product = products[item.productId];
              if (!product) return null;

              return (
                <div
                  key={item.productId}
                  className="bg-gray-900 p-4 rounded-lg flex gap-4 w-full"
                >
                  <img
                    src={
                      product.images[0]?.url || "https://via.placeholder.com/150"
                    }
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{product.name}</h2>
                    <p className="text-gray-400">{product.description}</p>
                    <p className="text-purple-400 font-bold">
                      Rs. {product.price} x {item.quantity} = Rs. {product.price * item.quantity}
                    </p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="px-3 py-1 bg-gray-700 text-white rounded-l-md hover:bg-gray-600"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-3 py-1 bg-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="px-3 py-1 bg-gray-700 text-white rounded-r-md hover:bg-gray-600"
                      >
                        +
                      </button>
                      <button
                        onClick={() => deleteFromCart(item.productId)}
                        className="ml-4 px-3 py-1 bg-red-700 text-white rounded-md hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 bg-gray-900 p-4 rounded-lg">
            <h2 className="text-xl font-bold">Order Summary</h2>
            <div className="flex justify-between mt-2">
              <span>Total Items:</span>
              <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2 border-t border-gray-700 pt-2">
              <span>Total Amount:</span>
              <span>Rs. {calculateTotalPrice()}</span>
            </div>
          </div>
        </>
      )}

      {!showAddressForm && cartItems.length > 0 && (
        <button
          onClick={() => setShowAddressForm(true)}
          className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-md w-full hover:bg-purple-800"
        >
          Buy Now
        </button>
      )}

      {showAddressForm && (
        <div className="mt-4 bg-gray-900 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Shipping Details</h2>
          <input
            type="text"
            placeholder="Address"
            className="w-full p-2 mb-2 bg-gray-800 border border-gray-700 rounded text-white"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            type="text"
            placeholder="City"
            className="w-full p-2 mb-2 bg-gray-800 border border-gray-700 rounded text-white"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            type="text"
            placeholder="State"
            className="w-full p-2 mb-2 bg-gray-800 border border-gray-700 rounded text-white"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter size for each product"
            className="w-full p-2 mb-2 bg-gray-800 border border-gray-700 rounded text-white"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <input
            type="text"
            placeholder="Pin Code"
            className="w-full p-2 mb-2 bg-gray-800 border border-gray-700 rounded text-white"
            value={pinCode}
            onChange={(e) => setPinCode(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone No"
            className="w-full p-2 mb-2 bg-gray-800 border border-gray-700 rounded text-white"
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
          />
          <button
            className="mt-4 px-6 py-3 bg-green-600 text-white rounded-md w-full hover:bg-green-700"
            onClick={handlePayment}
          >
            Pay Now (Rs. {calculateTotalPrice()})
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
