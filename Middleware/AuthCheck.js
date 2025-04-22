import jwt from "jsonwebtoken";

export const checkAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized access. Token missing." });
    }

    const decoded = jwt.verify(token, process.env.SECRET_PUBLIC_KEY);
    if(!decoded){
      return res.status(500).json({message : "Decoded is not Verified..."});
    }

    req.user = decoded.id;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized access. Token invalid." });
  }
};
