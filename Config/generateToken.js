import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  try {
    const token = jwt.sign(
      { id: userId }, 
      process.env.SECRET_PUBLIC_KEY, 
      { expiresIn: "7d" }
    );
    return token;
  } catch (error) {
    console.error("Error generating token:", error.message);
    throw new Error("Internal Server Error in generateToken");
  }
};

export default generateToken;
