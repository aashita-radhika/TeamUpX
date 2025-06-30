const express = require('express');
const router = express.Router();
const path = require('path');
const { handleContact } = require('../controllers/contact'); 

router.route('/feedback')
    .get((req, res) => {
        res.sendFile(path.join(__dirname, '../public/feedback.html'));
    })
    .post(handleContact); // Protected route

module.exports = router;