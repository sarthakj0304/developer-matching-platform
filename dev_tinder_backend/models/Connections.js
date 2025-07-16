const mongoose = require("mongoose");

const ConnectionsMadeSchema = mongoose.Schema({
  user1Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  user2Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
const ConnectionsMade = new mongoose.model(
  "ConnectionMade",
  ConnectionsMadeSchema
);
module.exports = {
  ConnectionsMade,
};
