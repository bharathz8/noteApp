import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // Extract token from the Authorization header
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Remove "Bearer " prefix and verify token
    const token = authHeader.split(" ")[1];
    
    // Ensure JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
      maxAge: '1h'
    });

    // Additional token validation
    if (!decoded.userId) {
      return res.status(401).json({ message: "Invalid token structure" });
    }

    // Attach user ID to request object (note: changed from .user to .userId)
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);

    // Differentiate between different types of JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token has expired" });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Catch-all for other errors
    res.status(401).json({ message: "Authentication failed" });
  }
};

export default authMiddleware;