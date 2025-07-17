const express = require("express");
const userRouter = express.Router();
const { AuthenticateUser } = require("../authentication/authentication.js");
const { ConnectionRequestModel } = require("../models/ConnectionRequests.js");
const User = require("../models/User.js");
const { ConnectionsMade } = require("../models/Connections.js");
const USER_SAFE_DATA = "firstName lastName photoURL about age gender skills";
const mongoose = require("mongoose");
userRouter.get("/requests/received", AuthenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;

    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: userId,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    return res.status(200).json({ connectionRequests });
  } catch (error) {
    console.error("Error fetching received requests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get confirmed connections
userRouter.get("/connections", AuthenticateUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const userId = req.user.id;
    const connections = await ConnectionsMade.find({
      $or: [{ user1Id: loggedInUser.id }, { user2Id: loggedInUser.id }],
    }).populate("user1Id user2Id", USER_SAFE_DATA);

    const result = [];

    for (const conn of connections) {
      const otherUserId =
        conn.user1Id.toString() === userId ? conn.user2Id : conn.user1Id;

      const otherUser = await User.findById(otherUserId).select(USER_SAFE_DATA);

      if (otherUser) result.push(otherUser);
    }

    //console.log(result);

    res.status(200).json({ connections: result });
  } catch (error) {
    console.error("Error fetching connections:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

userRouter.get("/feed", AuthenticateUser, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    console.log(
      "Connection Requests involving user:",
      loggedInUser._id.toString()
    );
    connectionRequests.forEach((req) => {
      console.log({
        from: req.fromUserId.toString(),
        to: req.toUserId.toString(),
        status: req.status,
      });
    });

    const connections = await ConnectionsMade.find({
      $or: [{ user1Id: loggedInUser._id }, { user2Id: loggedInUser._id }],
    }).select("user1Id user2Id");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    connections.forEach((req) => {
      hideUsersFromFeed.add(req.user1Id.toString());
      hideUsersFromFeed.add(req.user2Id.toString());
    });

    console.log(
      "Users hidden due to connection requests:",
      Array.from(hideUsersFromFeed)
    );

    const excludedUserIds = Array.from(hideUsersFromFeed).map((id) =>
      mongoose.Types.ObjectId(id)
    );
    const users = await User.find({
      _id: { $nin: excludedUserIds, $ne: loggedInUser._id },
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json(users);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = userRouter;
