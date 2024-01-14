const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      default: "admin",  
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      default: "active",
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", userSchema);
