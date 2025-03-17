
import { useEffect, useState } from "react";
import { server } from "../constants/config";
import {
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
}

interface OrderItem {
  name: string;
  quantity: number;
  product: Product;
}

interface ShippingInfo {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
  phoneNo: number;
}

interface PaymentInfo {
  transactionId: string | null;
  status: string;
}

interface Order {
  _id: string;
  user: User;
  orderItems: OrderItem[];
  shippingInfo: ShippingInfo;
  paymentInfo: PaymentInfo;
  createdAt: string;
}

function AdminOrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin-login");
    }
  }, [navigate]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch(`${server}/api/order/allorders`);
        const data = await response.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const generateInvoice = (order: Order) => {
    const doc = new jsPDF();

    // Shop Name and Header
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("buyit", 10, 15);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Invoice", 10, 25);

    // Order Details
    doc.setFontSize(10);
    doc.text(`Order ID: ${order._id}`, 10, 35);
    doc.text(
      `Order Date: ${new Date(order.createdAt).toLocaleString()}`,
      10,
      40
    );

    // Customer Details
    doc.text(`Customer Name: ${order.user.name}`, 10, 50);
    doc.text(`Customer Email: ${order.user.email}`, 10, 55);
    doc.text(`product size  ${order.shippingInfo.country}`, 10, 60);

    // Shipping Address
    doc.text(
      `Shipping Address: ${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}`,
      10,
      65
    );
    doc.text(`Phone: ${order.shippingInfo.phoneNo}`, 10, 70);

    // Order Items Table
    doc.setFontSize(12);
    doc.text("Items Ordered:", 10, 80);
    doc.setFontSize(10);

    let y = 85;
    doc.setFillColor(200, 200, 200);
    doc.rect(10, y, 190, 10, "F");
    doc.setTextColor(0, 0, 0);
    doc.text("Item", 15, y + 7);
    doc.text("Quantity", 80, y + 7);
    doc.text("Price", 130, y + 7);
    doc.text("Total", 170, y + 7);

    y += 15;
    var totalprice=0;
    order.orderItems.forEach((item) => {
      const total = item.quantity * item.product.price;
      totalprice=totalprice+total;
      doc.text(item.name, 15, y);
      doc.text(`${item.quantity}`, 80, y);
      doc.text(`${item.product.price.toFixed(2)}`, 130, y);
      doc.text(`${total.toFixed(2)}`, 170, y);
      y += 10;
    });

    // Payment Details
    doc.setFontSize(12);
    doc.text(`Total Price: ${totalprice}`, 10, y + 10);
    doc.text("Payment Details:", 10, y + 20);
    doc.setFontSize(10);
    doc.text(`Payment Status: ${order.paymentInfo.status}`, 10, y + 30);
    doc.text(
      `Transaction ID: ${order.paymentInfo.transactionId ?? "N/A"}`,
      10,
      y + 25
    );

    // Save the PDF
    doc.save(`invoice_${order.user.name}.pdf`);
  };

  if (loading)
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading orders...
        </Typography>
      </Container>
    );

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Completed Orders
      </Typography>
      {orders.length === 0 ? (
        <Typography variant="h6">No completed orders found.</Typography>
      ) : (
        orders.map((order) => (
          <Card key={order._id} sx={{ mb: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="primary">
                Order ID: {order._id}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Ordered on: {new Date(order.createdAt).toLocaleString()}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6">Customer Details:</Typography>
              <Typography>
                {order.user.name} ({order.user.email})
              </Typography>
              <Typography variant="h6">Product size:</Typography>
              <Typography>
                {order.shippingInfo.country}
              </Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Shipping Address:
              </Typography>
              <Typography>
                {order.shippingInfo.address}, {order.shippingInfo.city},{" "}
                {order.shippingInfo.state},{" "}
                {order.shippingInfo.pinCode}
              </Typography>
              <Typography>Phone: {order.shippingInfo.phoneNo}</Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6">Items Ordered:</Typography>
              <List>
                {order.orderItems.map((item) => (
                  <ListItem key={item.product._id} sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <>
                          {item.name} - {item.quantity} x{" "}
                          <Typography
                            component="span"
                            sx={{ fontSize: "1.1em", fontWeight: "bold" }}
                          >
                            ₹
                          </Typography>
                          {item.product.price.toFixed(2)}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6">Payment Details:</Typography>
              <Typography>
                <strong>Status:</strong> {order.paymentInfo.status}
              </Typography>
              <Typography>
                <strong>Transaction ID:</strong>{" "}
                {order.paymentInfo.transactionId ?? "N/A"}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => generateInvoice(order)}
              >
                Download Invoice
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
}

export default AdminOrderPage;
