import { TryCatch } from "./error.js";
import { ErrorHandler } from "../utils/utility.js";
import jwt from "jsonwebtoken"
const isAuthenticated = TryCatch((req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ErrorHandler("Please login to access this route", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedData._id;
    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired token", 401));
  }
});
const isAdmin = TryCatch((req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ErrorHandler("Only Admin can access this route", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedData._id;
    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired admin token", 401));
  }
});
export { isAuthenticated ,isAdmin};
