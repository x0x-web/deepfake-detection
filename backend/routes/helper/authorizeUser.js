
import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "secret");

    
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

export default authUser;
