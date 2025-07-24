const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  // Check if token not provided in the request headers


  // Check for token in headers
  let authHeader = req.headers.Authorization || req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("User not authorized, token failed");
      }
      // If token is valid, attach user to request object
      req.user = decoded.user;
      next();
    });
   
  }
     if (!token) {
      res.status(401);
      throw new Error("User not authorized or token not found in headers");  
      next();
    }
});

module.exports = validateToken;
