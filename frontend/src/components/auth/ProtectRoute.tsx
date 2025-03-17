import { Navigate, Outlet } from "react-router-dom";

const ProtectRoute: React.FC<{ redirect?: string }> = ({ redirect = "/login" }) => {
  const token = localStorage.getItem("buyitid"); // Get token from localStorage

  if (!token) return <Navigate to={redirect} />; // Redirect if no token

  return <Outlet />; // Allow access to protected route
};

export default ProtectRoute;
