const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

module.exports = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - Missing token" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(decodedToken.id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - Invalid user" });
    }

    req.userId = decodedToken.id;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};
