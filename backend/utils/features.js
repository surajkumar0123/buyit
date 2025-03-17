import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { getBase64 } from "../lib/helper.js";

const connectDB = async (uri) => {
  try {
    const data = await mongoose.connect(uri, { dbName: "fashion" });
    console.log(`Connected to DB: ${data.connection.host}`);
  } catch (err) {
    console.error("Failed to connect to DB", err);
    process.exit(1);
  }
};

const sendToken = (res, user, code, message) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return res.status(code).json({
    success: true,
    user,
    token,
    message,
  });
};


const uploadFilesToCloudinary = async (file) => {
  if (!file || !file.buffer || !file.mimetype) {
    throw new Error("Invalid file provided");
  }

  return new Promise((resolve, reject) => {
    const base64String = getBase64(file);

    cloudinary.uploader.upload(
      base64String,
      { resource_type: "auto", public_id: uuid() },
      (error, result) => {
        if (error) return reject(error);
        resolve({ public_id: result.public_id, url: result.secure_url });
      }
    );
  });
};


const deletFilesFromCloudinary = async (public_ids) => {
  // Delete files from cloudinary
};
// const allowedOrigins = [
//   process.env.CLIENT_URL,
//   "http://localhost:5173",
// ];

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "https://buyit.shop",
  "https://www.buyit.shop",
 "https://buyit-mu.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., Razorpay webhooks)
    if (!origin || allowedOrigins.some((allowed) => origin.startsWith(allowed))) {
      callback(null, true);
    } else if (origin?.includes("razorpay")) {
      callback(null, true); // Allow Razorpay webhook requests
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Allows cookies and authentication headers
  allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
};
export {
  connectDB,
  sendToken,
  deletFilesFromCloudinary,
  uploadFilesToCloudinary,
  corsOptions,
};
