import { Routes, Route } from "react-router-dom";
import { Suspense, useEffect, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { AppDispatch } from "./redux/store";
import { userExists, userNotExists } from "./redux/reducers/auth";
import { server } from "./constants/config";
import Loader from "./pages/Loader";
import ProtectRoute from "./components/auth/ProtectRoute";
import Home from "./pages/Home";
const Aboutus = lazy(() => import("./pages/Aboutus"));
const BuyNowPage = lazy(() => import("./pages/BuyNowPage"));
const Login = lazy(() => import("./pages/Login"));
const Admin = lazy(() => import("./pages/Admin"));
const Cart = lazy(() => import("./pages/Cart"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const Contactus = lazy(() => import("./pages/Contactus"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Adminorders = lazy(() => import("./pages/Adminorders"));
const Admincontact = lazy(() => import("./pages/Admincontact"));
import Cookies from "js-cookie";
import Navbar from "./navbar";

const NotFound = lazy(() => import("./pages/NotFound"));

const App: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state:any) => state.auth.user);
  useEffect(() => {
    const token = Cookies.get("buyitid");

    if (token) {
      axios
        .get(`${server}/api/v1/user/me`, { withCredentials: true })
        .then(({ data }) => dispatch(userExists(data.user)))
        .catch(() => dispatch(userNotExists()));
    } else {
      dispatch(userNotExists());
    }
  }, [dispatch]);

  return (
    <>
      <Suspense fallback={<Loader />}>
      <Navbar key={user ? "authenticated" : "guest"} />  
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contactus" element={<Contactus />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin-orders" element={<Adminorders />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-contact" element={<Admincontact />} />

          {/* Protected Routes */}
          <Route element={<ProtectRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/buy-now" element={<BuyNowPage />} />
        <Route path="/paymentSuccess" element={<PaymentSuccess/>}/>

          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position="bottom-center" />
    </>
  );
};

export default App;
