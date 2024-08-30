const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ err: "User already exist" });
    }
    user = new User({
      name,
      email,
      password,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    return res.status(201).json({ msg: "User Successfully Registered" });
  } catch (error) {
    console.log(err.message);
    res.status(500).json({ err: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      // Check if user does not exist
      return res.status(400).json({ err: "Invalid Credentials" });
    }
    const verify = await bcrypt.compare(password, user.password);
    if (!verify) {
      return res.status(400).json({
        err: "Password is incorrect",
      });
    }
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error.message); // Corrected variable name to "error"
    return res.status(500).json({ err: error.message });
  }
});

module.exports = router;
