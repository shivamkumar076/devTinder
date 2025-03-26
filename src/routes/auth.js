const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const {addToBlacklist}=require('../middlewares/checkBlackList')
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    const savedUser = await user.save();
    const token=await savedUser.getJWT();
    res.json({ message: "user add successfully", data: savedUser,
      token:token
     });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "This email already exists" });
    }
    // Handle other errors
    res.status(500).json({ message: "Something went wrong"});
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
  
    if (!user) {
      throw new Error("invalid credential");
    }
    const ispassword = await user.validatePassword(password);
    
    if (ispassword) {
      const token = await user.getJWT();
      res.json({
        token: token,
        user: user,
      });
    } else {
      throw new Error("invalid credential");
    }
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});
authRouter.post("/logout", (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (token) {
      addToBlacklist(token); // Add the token to the blacklist
    }
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(401).send("Error" + err + message);
  }
});
module.exports = authRouter;
