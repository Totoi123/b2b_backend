const jwt = require("jsonwebtoken");
require("dotenv").config();


module.exports = function(req, res, next) {
  // Get token from header
  const token = req.headers.token;

  // Check if not token
  if (!token) {
    return res.status(403).json({ msg: "authorization denied" });
  }

  // Verify token
  try {
    //it is going to give use the user id (user:{id: user.id})
    const verify = jwt.verify(token, process.env.JWT_SECRET);

    req.admin = verify.admin;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};