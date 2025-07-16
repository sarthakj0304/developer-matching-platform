const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();
const path = require("path");

const app = express();

app.use(
  "/Public",
  express.static(
    "/Users/sarthakjain/Desktop/dev tinder project/dev_tinder_backend/Public"
  )
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

//routes
const loginRouter = require("./Routes/auth.js");
const profileRouter = require("./Routes/profile.js");
const requestRouter = require("./routes/request.js");
const userRouter = require("./Routes/user.js");

app.use("/", loginRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
