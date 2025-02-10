const express = require("express");
const { checkBlacklist } = require("../middlewares/checkBlackList");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";
// const ConnectionRequestModel=require("../models/connectionRequest");
const connectionRequestmodel = require("../models/connectionRequest");
//get all the pending connection request for the logged in user

userRouter.get(
  "/user/requests/received",
  checkBlacklist,
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const connectionRequest = await connectionRequestmodel
        .find({
          toUserId: loggedInUser._id,
          status: "interested",
        })
        .populate("fromUserId", USER_SAFE_DATA);
      res.json({
        message: "data fetched sucessfully",
        data: connectionRequest,
      });
    } catch (err) {
      res.status(400).send("error" + err.message);
    }
  }
);
userRouter.get(
  "/user/connections",
  checkBlacklist,
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const connectionRequest = await connectionRequestmodel
        .find({
          $or: [
            { toUserId: loggedInUser._id, status: "accepted" },
            { fromUserId: loggedInUser._id, status: "accepted" },
          ],
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);
    
      const data = connectionRequest.map((row) => {
        if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
          return row.toUserId;
        }
        return row.fromUserId;
      });

      res.json({ data });
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
);
userRouter.get("/feed", checkBlacklist, userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const connectionRequest = await connectionRequestmodel
      .find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      })
      .select("fromUserId toUserId");
    const hideUserFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    res.json({ data: users });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});
module.exports = userRouter;
