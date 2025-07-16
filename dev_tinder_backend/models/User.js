const mongoose = require("mongoose");
const validator = require("validator");

const dotenv = require("dotenv");

dotenv.config();
// User Model
const gend = null;
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email :" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter Strong password :" + value);
        }
      },
    },
    age: {
      type: Number,
      required: false,
      min: 18,
    },
    gender: {
      type: String,
      required: true,
      trim: true,

      validate(value) {
        if (
          !["male", "female", "others", "Male", "Female", "Others"].includes(
            value
          )
        ) {
          throw new Error("Not a valid gender (Male , Female and other)");
        }
      },
    },
    about: {
      type: String,
      // default: "Dev is in search for someone here",
    },
    photoURL: {
      type: String,
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

//compound index
userSchema.index({ firstName: 1, lastName: 1 });
userSchema.pre("save", function (next) {
  if (!this.photoURL) {
    if (this.gender && this.gender.toLowerCase() === "male") {
      this.photoURL =
        "https://www.strasys.uk/wp-content/uploads/2022/02/Depositphotos_484354208_S.jpg";
    } else if (this.gender && this.gender.toLowerCase() === "female") {
      this.photoURL =
        "https://t4.ftcdn.net/jpg/02/70/22/85/360_F_270228529_iDayZ2Dl4ZeDClKl7ZnLgzN5HRIvlGlK.jpg";
    } else {
      this.photoURL =
        "https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg";
    }
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
