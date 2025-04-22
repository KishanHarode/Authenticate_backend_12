import express from "express";
import { signup, signin, getData, logout } from "../Controller/AuthController.js";
import { checkAuth } from "../Middleware/AuthCheck.js";

const router = express.Router();

// Routes with API Endpoints
router.post("/signup", signup);           // POST → http://localhost:5000/api/auth/signup
router.post("/signin", signin);           // POST → http://localhost:5000/api/auth/signin
router.get("/verify", checkAuth, getData); // GET  → http://localhost:5000/api/auth/verify (Protected Route)
router.post("/logout", logout);            // POST → http://localhost:5000/api/auth/logout

export default router;
