const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization; // Use lowercase "authorization"

    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            // Fetch full user details
            const user = await User.findById(decoded.id).select("-password");
            if (!user) {
                res.status(401);
                throw new Error("User not found");
            }

            req.user = user; // Store full user object
            next();
        } catch (err) {
            res.status(401);
            throw new Error("Invalid or expired token");
        }
    } else {
        res.status(401);
        throw new Error("Token not found");
    }
});

module.exports = validateToken;
