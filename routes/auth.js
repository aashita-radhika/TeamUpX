// // const express = require("express");
// // const router = express.Router();
// // const { registerUser, loginUser, currentUser, updateUserData, deleteUser } = require("../controllers/userController") ;
// // const validateToken = require("../middleware/validateTokenHandler") ;

// // //regiter user
// // router.post("/register", registerUser);

// // //login user-get access token
// // router.post("/login", loginUser);

// // //get current user data-access private
// // router.get("/current", validateToken, currentUser);

// // //update user data-access private
// // router.route("/:id").put(validateToken, updateUserData).delete(validateToken, deleteUser);

// // //logout user
// // router.get("/logout", (req, res) => {
// //     res.clearCookie("jwt");
// //     res.json({ message: "Logged out successfully" });
// // });

// // module.exports = router;




// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// const JWT_SECRET = "avanimathur01" ; // Use env in production

// // Register
// router.post('/register', async (req, res) => {
//     const {
//         username,
//         email,
//         password,
//         fullName,
//         college,
//         yearOfStudy,
//         skills,           // Expected as comma-separated string
//         pastExperience,
//         achievements,
//         resume,           // File path or URL
//         github
//     } = req.body;
//     try {
//         const existingUser = await User.findOne({ email });
//         if (existingUser) return res.status(400).json({ msg: "User already exists" });

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = new User({
//             username,
//             email,
//             password: hashedPassword,
//             fullName,
//             college,
//             yearOfStudy,
//             skills: skills ? skills.split(',').map(skill => skill.trim()) : [],
//             pastExperience,
//             achievements,
//             resume,
//             github
//         });
//         await newUser.save();
//         res.status(201).json({ msg: "User registered" });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Login
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const user = await User.findOne({ email });
//         if (!user) return res.status(400).json({ msg: "User does not exist" });

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

//         const token = jwt.sign({ id: user._id }, JWT_SECRET);
//         res.json({
//             token,
//             user: {
//                 username: user.username,
//                 email: user.email,
//                 fullName: user.fullName,
//                 college: user.college,
//                 yearOfStudy: user.yearOfStudy,
//                 skills: user.skills,
//                 github: user.github
//             }
//         });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/profile');

const JWT_SECRET = 'avanimathur01'; // Use env variable in production

// Register Route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
