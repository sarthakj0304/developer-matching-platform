const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();
const path = require("path");
const { Server } = require("socket.io");
const Message = require("./models/Message");
const http = require("http");
const app = express();
const localHost = process.env.LOCAL_HOST;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: `${localHost}`,
    credentials: true,
  },
  allowRequest: (req, callback) => {
    callback(null, true);
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: `${localHost}`,
    credentials: true,
  })
);
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("sendMessage", async (msg) => {
    const { senderId, receiverId, content } = msg;

    // Save message to DB
    const newMsg = new Message({ senderId, receiverId, content });
    await newMsg.save();

    // Send to receiver (if online)
    io.emit(`chat:${receiverId}`, newMsg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

io.use((socket, next) => {
  const userId = socket.handshake.auth?.userId;
  if (!userId) {
    console.log("Connection rejected: No userId");
    return next(new Error("Unauthorized"));
  }
  socket.userId = userId;
  next();
});

process.on("SIGINT", () => {
  console.log("Shutting down server...");

  // Disconnect all sockets
  io.sockets.sockets.forEach((socket) => {
    socket.disconnect(true); // Force disconnect
  });

  process.exit();
});

//routes
const loginRouter = require("./Routes/auth.js");
const profileRouter = require("./Routes/profile.js");
const requestRouter = require("./routes/request.js");
const userRouter = require("./Routes/user.js");
const messages_router = require("./Routes/messages.js");

app.use("/", loginRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", messages_router);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
