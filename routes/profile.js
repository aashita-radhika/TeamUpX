// const express = require('express');
// const router = express.Router();
// const Profile = require('../models/profile');
// const jwt = require('jsonwebtoken');
// const JWT_SECRET = 'avanimathur01';

// // Middleware to protect routes
// const authMiddleware = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'Unauthorized' });

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.userId = decoded.userId;
//     next();
//   } catch (err) {
//     res.status(403).json({ message: 'Token is invalid' });
//   }
// };

// // Create profile
// router.post('/create', authMiddleware, async (req, res) => {
//   const { fullName, bio, skills, github, linkedIn } = req.body;
//   try {
//     const profile = new Profile({ user: req.userId, fullName, bio, skills, github, linkedIn });
//     await profile.save();
//     res.status(201).json(profile);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get current user's profile
// router.get('/me', authMiddleware, async (req, res) => {
//   try {
//     const profile = await Profile.findOne({ user: req.userId }).populate('user', 'username email');
//     res.json(profile);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;



// const express = require('express');
// const router = express.Router();
// const asyncHandler = require('express-async-handler');
// const jwt = require('jsonwebtoken');
// const Profile = require('../models/profile');

// const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;

// // Middleware to protect routes
// const authMiddleware = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'Unauthorized: No token provided' });
//   }
//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     // Assuming your JWT payload has { id: userId }
//     req.userId = decoded.id;
//     next();
//   } catch (err) {
//     return res.status(403).json({ message: 'Token is invalid or expired' });
//   }
// };

// // Create profile
// router.post('/create', authMiddleware, asyncHandler(async (req, res) => {
//   const { fullName, bio, skills, github, linkedIn } = req.body;

//   // Validate fullName (required)
//   if (!fullName) {
//     return res.status(400).json({ message: 'Full name is required' });
//   }

//   // Parse skills if sent as comma-separated string, convert to array
//   let skillsArray = [];
//   if (typeof skills === 'string') {
//     skillsArray = skills.split(',').map(skill => skill.trim());
//   } else if (Array.isArray(skills)) {
//     skillsArray = skills;
//   }

//   // Check if profile already exists - if yes, update it instead of creating duplicate
//   let profile = await Profile.findOne({ user: req.userId });
//   if (profile) {
//     profile.fullName = fullName;
//     profile.bio = bio;
//     profile.skills = skillsArray;
//     profile.github = github;
//     profile.linkedIn = linkedIn;

//     await profile.save();
//     return res.json(profile);
//   }

//   // Create new profile
//   profile = new Profile({
//     user: req.userId,
//     fullName,
//     bio,
//     skills: skillsArray,
//     github,
//     linkedIn,
//   });

//   await profile.save();
//   res.status(201).json(profile);
// }));

// // Get current user's profile
// router.get('/me', authMiddleware, asyncHandler(async (req, res) => {
//   const profile = await Profile.findOne({ user: req.userId }).populate('user', 'username email');

//   if (!profile) {
//     return res.status(404).json({ message: 'Profile not found' });
//   }

//   res.json(profile);
// }));

// module.exports = router;


const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const Profile = require('../models/profile');

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id; // Payload must contain `id`
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token is invalid or expired' });
  }
};

// Create or update profile
router.post('/create', authMiddleware, asyncHandler(async (req, res) => {
  const {
    fullName,
    college,
    yearOfStudy,
    bio,
    skills,
    pastExperience,
    achievements,
    resume,
    github,
    linkedIn
  } = req.body;

  if (!fullName) {
    return res.status(400).json({ message: 'Full name is required' });
  }

  // Convert skills string to array if needed
  let skillsArray = [];
  if (typeof skills === 'string') {
    skillsArray = skills.split(',').map(skill => skill.trim());
  } else if (Array.isArray(skills)) {
    skillsArray = skills;
  }

  let profile = await Profile.findOne({ user: req.userId });

  if (profile) {
    // Update existing profile
    profile.fullName = fullName;
    profile.college = college;
    profile.yearOfStudy = yearOfStudy;
    profile.bio = bio;
    profile.skills = skillsArray;
    profile.pastExperience = pastExperience;
    profile.achievements = achievements;
    profile.resume = resume;
    profile.github = github;
    profile.linkedIn = linkedIn;

    await profile.save();
    return res.json(profile);
  }

  // Create new profile
  profile = new Profile({
    user: req.userId,
    fullName,
    college,
    yearOfStudy,
    bio,
    skills: skillsArray,
    pastExperience,
    achievements,
    resume,
    github,
    linkedIn
  });

  await profile.save();
  res.status(201).json(profile);
}));

// Get current user's profile
router.get('/me', authMiddleware, asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.userId }).populate('user', 'username email');

  if (!profile) {
    return res.status(404).json({ message: 'Profile not found' });
  }

  res.json(profile);
}));


// Get all profiles
router.get('/all', authMiddleware, asyncHandler(async (req, res) => {
  const profiles = await Profile.find().populate('user', 'username email');
  res.json(profiles);
}));


module.exports = router;
