const express = require("express");
const { ConnectionRequestModel } = require("../models/ConnectionRequests.js");
const { AuthenticateUser } = require("../authentication/authentication.js");
const requestRouter = express.Router();
const User = require("../models/User.js");
const { ConnectionsMade } = require("../models/Connections.js");

requestRouter.post(
  "/request/send/:status/:toUserId",
  AuthenticateUser,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const status = req.params.status;
      const toUserId = req.params.toUserId;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Check if the recipient exists
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res
          .status(400)
          .json({ message: "User not found", success: false });
      }

      // Validate status
      const allowedStatuses = ["ignore", "accept"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status type" });
      }

      // If the request is ignored, just return without saving
      if (status == "ignore") {
        // Save the ignore entry
        await ConnectionRequestModel.create({
          fromUserId: userId,
          toUserId: toUserId,
          status: "ignore",
        });

        return res.status(200).json({
          message: `Request ignored from ${userId} to ${toUserId}`,
        });
      }
      // Check if there is already a connection
      const existingConnection = await ConnectionsMade.findOne({
        $or: [
          { user1Id: userId, user2Id: toUserId },
          { user1Id: toUserId, user2Id: userId },
        ],
      });

      if (existingConnection) {
        return res.status(400).json({ message: "You are already connected!" });
      }

      // Check if a mutual connection request exists
      const receivedRequest = await ConnectionRequestModel.findOne({
        fromUserId: toUserId,
        toUserId: userId,
        status: "interested", // Ensure the received request was interested
      });

      if (receivedRequest) {
        // Create a new connection
        const newConnection = new ConnectionsMade({
          user1Id: userId,
          user2Id: toUserId,
        });

        await newConnection.save();

        // Delete existing requests as they are no longer needed
        await ConnectionRequestModel.deleteMany({
          $or: [
            { fromUserId: userId, toUserId: toUserId },
            { fromUserId: toUserId, toUserId: userId },
          ],
        });

        return res.status(200).json({
          message: `Connection successfully established between ${userId} and ${toUserId}`,
        });
      }

      // If no mutual request exists, create a new request
      const newConnectionRequest = new ConnectionRequestModel({
        fromUserId: userId,
        toUserId: toUserId,
        status: "interested", // Set status as "interested" instead of user input
      });

      await newConnectionRequest.save();

      res.status(200).json({
        message: `Connection request sent from ${userId} to ${toUserId}`,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  }
);

requestRouter.post(
  "/request/recieve/:status/:fromUserId",
  AuthenticateUser,
  async (req, res) => {
    const { status, fromUserId } = req.params;
    const userId = req.user.id; // receiver of the request

    try {
      // Remove the original connection request
      await ConnectionRequestModel.findOneAndDelete({
        fromUserId,
        toUserId: userId,
      });

      if (status === "accept") {
        // Check if connection already exists
        const existingConnection = await ConnectionsMade.findOne({
          $or: [
            { user1Id: userId, user2Id: fromUserId },
            { user1Id: fromUserId, user2Id: userId },
          ],
        });

        if (!existingConnection) {
          const newConnection = new ConnectionsMade({
            user1Id: userId,
            user2Id: fromUserId,
          });

          await newConnection.save();
        }

        return res
          .status(200)
          .json({ message: "Connection accepted and saved." });
      } else if (status === "ignore") {
        return res
          .status(200)
          .json({ message: "Connection ignored and request removed." });
      } else {
        return res.status(400).json({ message: "Invalid status." });
      }
    } catch (error) {
      console.error("Error handling request:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }
);
module.exports = requestRouter;
