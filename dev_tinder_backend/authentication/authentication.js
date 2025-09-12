const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const AuthenticateUser = async (req, res, next) => {
  console.log("origin", req.headers.origin);
  const token = req.cookies.token;

  // If no token, return unauthorized
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; //We included user id in the payload of the token so we are including that in the req
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = { AuthenticateUser };
