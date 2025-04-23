import User from "../Model/UserModel.js";
import bcrypt from "bcrypt";
// import generateToken from "../config/generateToken.js";
// // Correct (when using ES Modules)
import generateToken from '../config/generateToken.js';


// Signup
export const signup = async (req, res) => {
  
  try {
    const { firstName, lastName, userName, email, password } = req.body;
    const emailFormat_Regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!firstName || !lastName || !userName || !email || !password) {
      return res.status(400).json({ message: "All fields are required..." });
    }

    if(!emailFormat_Regex.test(email)){
      return res.status(400).json({message: "Email Invalid Format..."})
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists..." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password should be at least 6 characters long..." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    if(!hashedPassword){
      return res.status(400).json({message : "Hased password is not succesfully completed..."});
    }

    const user = await User.create({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({ user, token, message: "User created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error in signup" });
  }
};

// Signin
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({ user, token, message: "User signed in successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error in signin" });
  }
};

// Get User Data
export const getData = async (req, res) => {
  try {
    const userId = req.user;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user, message: "User data fetched successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error in getData" });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error in logout" });
  }
};
