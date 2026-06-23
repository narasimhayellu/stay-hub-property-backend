const jwt = require("jsonwebtoken");

const requireSignIn = (req, res, next) => {
  try {
    console.log('Auth headers:', req.headers.authorization); 
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); 
    req.user = decoded; 
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).send({ message: "Invalid or expired token" });
  }
};

module.exports = requireSignIn;
