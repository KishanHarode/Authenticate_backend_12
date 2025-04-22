import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./Config/Connect.js";
import AuthRoutes from "./AuthRoutes/AutheRoutes.js"; 

// Load environment variables
dotenv.config({ path: "./dotenv/.env" });

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL,   // Example: http://localhost:3000
  credentials: true,                // Allow cookies
  methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(express.json());             // Parse incoming JSON
app.use(cookieParser());             // Parse cookies

// Routes
app.use("/api/auth", AuthRoutes);     // Auth routes

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await connectDB();               // Connect to MongoDB
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
});
