// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//     username:   { type: String, required: true },
//     email:      { type: String, required: true, unique: true },
//     password:   { type: String, required: true },
//     bio:        { type: String },
//     fullName:   { type: String, required: true },
//     college:    { type: String },
//     yearOfStudy:{ type: String }, 
//     skills:     [String], 
//     pastExperience: { type: String }, 
//     achievements:   { type: String }, 
//     resume:     { type: String },
//     github:     { type: String }
// });

// module.exports = mongoose.model('User', UserSchema);


const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    college:    { type: String },
    yearOfStudy:{ type: String }, 
    bio: { type: String },
    skills: [{ type: String }],
    pastExperience: { type: String }, 
    achievements:   { type: String }, 
    resume:     { type: String },
    github: { type: String },
    linkedIn: { type: String },
});

module.exports = mongoose.model('Profile', ProfileSchema);
