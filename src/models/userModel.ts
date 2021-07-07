//const mongoose = require("mongoose");
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  admin: { type: Boolean, required: true, default: 0 },
});

const User = mongoose.model("user", userSchema);

module.exports = User;

export default User;
