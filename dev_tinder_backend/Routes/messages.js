const express = require("express");
const messages_router = express.Router();
const Message = require("../models/Message");
messages_router.get("/messages/:userId/:otherUserId", async (req, res) => {
  const { userId, otherUserId } = req.params;
  const messages = await Message.find({
    $and: [
      {
        $or: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      { content: { $exists: true, $ne: "" } }, // 🚫 skip empty messages
    ],
  }).sort({ createdAt: 1 });
  res.json(messages);
});

module.exports = messages_router;
