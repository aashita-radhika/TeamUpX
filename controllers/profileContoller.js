const asyncHandler = require("express-async-handler");
const Profile = require("../models/profileModel");

// Create or update profile for logged in user
const createOrUpdateProfile = asyncHandler(async (req, res) => {
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
    linkedIn,
  } = req.body;

  if (!fullName) {
    res.status(400);
    throw new Error("fullName is required");
  }

  let profile = await Profile.findOne({ user: req.user._id });

  if (profile) {
    // Update profile
    profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      {
        fullName,
        college,
        yearOfStudy,
        bio,
        skills,
        pastExperience,
        achievements,
        resume,
        github,
        linkedIn,
      },
      { new: true, runValidators: true }
    );
    return res.json(profile);
  }

  // Create new profile
  profile = new Profile({
    user: req.user._id,
    fullName,
    college,
    yearOfStudy,
    bio,
    skills,
    pastExperience,
    achievements,
    resume,
    github,
    linkedIn,
  });

  await profile.save();
  res.status(201).json(profile);
});

module.exports = { createOrUpdateProfile };
