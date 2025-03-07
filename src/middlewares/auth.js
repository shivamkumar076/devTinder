const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "access denied" });
    }
    const decodeData = await jwt.verify(token, "Shivam@123");

    const { _id } = decodeData;
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not verified");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("ERROR" + err.message);
  }
};
module.exports = { userAuth };
