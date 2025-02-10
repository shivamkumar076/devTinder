const mongoose = require("mongoose");
const validator = require("validator");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      index: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Enter correct email");
        }
      },
    },
    password: {
      type: String,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("please enter strong password");
        }
      },
    },
    age: {
      type: Number,
      min: 8,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: `{values} not valid gender`,
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkHr-QEApS1cpUo8QpHWViF1uSZ_iG6LSJhg&s",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("invalid photo url");
        }
      },
    },
    about: {
      type: String,
      default: "this is default about",
    },
    skill: {
      type: [String],
    },
  },
  {
    timestamp: true,
  }
);
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await JWT.sign({ _id: user._id }, "Shivam@123", {
    expiresIn: "1h",
  });
  return token;//red zone
};
userSchema.methods.validatePassword = async function (password) {
  const user = this;
  const passwordHash = user.password;
  const ispassword = await bcrypt.compare(password, passwordHash);
  return ispassword;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
