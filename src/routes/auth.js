const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
// const { addToBlacklist } = require("../utils/jwt");
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
    // res.cookie("token",token,{
    //     expires:new Date(Date.now()+8*3600000)
    // })
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
    console.log(user);
    if (!user) {
      throw new Error("invalid credential");
    }
    const ispassword = await user.validatePassword(password);
    console.log(ispassword);
    if (ispassword) {
      const token = await user.getJWT();
      // res.status(200).json({ success: true, token });
      // res.cookie("token",token,{
      //     // httpOnly: true,
      //     sameSite: "none",
      //     expires:new Date(Date.now()+ 8* 3600000)
      //     // maxAge: 1000 * 60 * 60 * 24,
      // });
      res.json({
        token: token,
        user: user,
      });
      // res.send(user);
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
    // res.cookie("token", null, {
    //     expires: new Date(Date.now()),
    //     httpOnly: true
    // });
    // res.send("logout sucess");
  } catch (err) {
    res.status(401).send("Error" + err + message);
  }
});
module.exports = authRouter;
