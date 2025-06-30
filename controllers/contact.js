const Contact = require('../models/contact.js')
const asyncWrapper = require('../middleware/async');

const handleContact = asyncWrapper(async (req, res) => {
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

    try {
        await newContact.save();
        console.log('Message saved successfully');
        return res.status(201).json({ msg: 'Message received', contact: newContact });
    } catch (error) {
        console.error('Error saving message:', error.message);
        return res.status(500).json({ msg: error.message });
    }
});

module.exports = {
    handleContact
};