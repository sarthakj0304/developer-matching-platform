const express = require("express");
const { AuthenticateUser } = require("../authentication/authentication.js");
const User = require("../models/User.js");
const profileRouter = express.Router();
profileRouter.get("/profile/view", AuthenticateUser, async (req, res) => {
  const user_id = req.user.id;
  const user = await User.findById(user_id);
  res.send(user);
});

profileRouter.post("/profile/edit", AuthenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    Object.keys(req.body).forEach((field) => {
      user[field] = req.body[field];
    });

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = profileRouter;
