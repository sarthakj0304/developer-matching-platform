const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const validator = require("validator");
dotenv.config();

const AuthRouter = express.Router();

AuthRouter.post("/sign-up", async (req, res) => {
  try {
    //Validate signup data
    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      about,
      skills,
    } = req.body;

    if (!firstName || !lastName) {
      throw new Error("Enter a vaid first or last name");
    } else if (!validator.isEmail(emailId)) {
      throw new Error("Enter a valid Email ID");
    } else if (!validator.isStrongPassword(password)) {
      throw new Error("Enter a strong password");
    }

    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    const checkEmail = await User.findOne({ emailId });

    if (checkEmail) {
      throw new Error("Email Already Exist");
    }

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
      about,
      skills,
    });

    await user.save(); // inserting it

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

AuthRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId });

    if (!user) return res.status(404).json({ message: "Invalid email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(404).json({ message: "Invalid Password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

AuthRouter.post("/logout", async (req, res) => {
  res.cookie("token", "", {
    path: "/", // Must match the path where the cookie was set
    maxAge: 0, // Expire immediately
  });

  res.status(200).json({ message: "User Logged out successfully" });
});

module.exports = AuthRouter;
