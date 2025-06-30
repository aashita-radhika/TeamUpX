
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already registered!");
  }


    const user = new User({
        username,
        email,
        password, // plaintext for now, will get hashed via pre('save')
    });

    await user.save(); // This triggers pre('save') to hash password

  if (user) {
    res.status(201).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      message: "User registered successfully",
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});


const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  const user = await User.findOne({ email });

  if (!user) {
    console.log("❌ No user found with email:", email);
    res.status(401);
    throw new Error("Invalid credentials (user not found)");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    console.log("❌ Password did not match");
    res.status(401);
    throw new Error("Invalid credentials (wrong password)");
  }

  res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    accessToken: generateToken(user._id),
  });
});

// Get current logged-in user
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { registerUser, loginUser, currentUser };
