const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const validator = require("validator");
dotenv.config();
const admin = require("firebase-admin");
const fs = require("fs");
let serviceAccount;

try {
  // Check if FIREBASE_CONFIG_PATH env var is set
  if (process.env.FIREBASE_CONFIG_PATH) {
    // Read from env-provided path (Render: /etc/secrets/... , Local: ./...)
    const serviceAccountPath = process.env.FIREBASE_CONFIG_PATH;
    serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
  } else {
    // Fallback for dev if you forget to set env var
    serviceAccount = require("./dev-match-platform-firebase-adminsdk-fbsvc-30ccea3332.json");
  }
} catch (err) {
  console.error("Failed to load Firebase credentials:", err);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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
    res.status(400).send("ERROR:" + err.res.message);
  }
});

AuthRouter.post("/login", async (req, res) => {
  console.log("Login route hit");
  const { emailId, password } = req.body;
  console.log(emailId, password);

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

AuthRouter.post("/gmail-login", async (req, res) => {
  try {
    const { idToken } = req.body;

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email;

    // Check if user exists in your database
    let user = await User.findOne({ emailId: email });

    if (!user) {
      // Don't auto-create → tell frontend to redirect
      return res.status(404).json({
        message: "User not found, redirect to signup",
        email: email,
      });
    }
    if (!user.firebaseUid) {
      // If user exists but doesn't have a Firebase UID, link it
      user.firebaseUid = uid;
      await user.save();
    }

    // Generate a JWT for your internal system
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

module.exports = AuthRouter;
