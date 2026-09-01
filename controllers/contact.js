const asyncHandler = require('express-async-handler');
const Contact = require('../models/contact.js');

const handleContact = asyncHandler(async (req, res) => {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
        return res.status(400).json({ msg: 'Name, email, and message are required' });
    }

    // Check if the email already exists (optional, if needed)
    const existingContact = await Contact.findOne({ email, message });
    if (existingContact) {
        return res.status(400).json({ msg: 'Duplicate message detected' });
    }

    // Create a new contact entry
    const newContact = new Contact({ name, email, message });

    await newContact.save();
    console.log('Message saved successfully');
    res.status(201).json({ msg: 'Message received', contact: newContact });
});

module.exports = {
    handleContact
};