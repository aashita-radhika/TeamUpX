const express = require('express');
const router = express.Router();
const validateToken = require('../middleware/validateTokenHandler');
const { createOrUpdateProfile, getProfile, getAllProfiles } = require('../controllers/profileContoller');

// Create or update profile
router.post('/create', validateToken, createOrUpdateProfile);

// Get current user's profile
router.get('/me', validateToken, getProfile);

// Get all profiles
router.get('/all', validateToken, getAllProfiles);


module.exports = router;
