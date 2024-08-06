jwt = require("jsonwebtoken");
const secretKey = "Dhrujal";

module.exports.AuthMiddleware = async (req, res, next) => {
  try {
    const userToken = req.headers["authorization"];
    if (userToken == null) {
      return res.status(401).json({ msg: "No token provided" });
    }
    jwt.verify(userToken, secretKey, (err, user) => {
      if (err) {
        return res.status(403).json({ msg: "Token is not valid" });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};
