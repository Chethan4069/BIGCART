const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// ✅ User Schema
const userSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  phone: String,
  email: { type: String, unique: true },
  password: String
});

const User = mongoose.model("User", userSchema);

// ✅ Register API
router.post("/register", async (req, res) => {
  try {
    const { name, dob, phone, email, password } = req.body;
    const user = new User({ name, dob, phone, email, password });
    await user.save();
    res.status(201).send({ message: "✅ Register Successful!" });
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: "❌ Email already exists or error occurred" });
  }
});

// ✅ Login API
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
      password
    });

    if (user) {
      res.send({ message: "✅ Login Successful!" });
    } else {
      res.status(401).send({ message: "❌ Invalid Credentials" });
    }
  } catch (err) {
    res.status(500).send({ message: "❌ Server Error" });
  }
});

module.exports = router;