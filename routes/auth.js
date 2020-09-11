const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Creating New Router From Express Server
const router = express.Router();

// @ROUTE   GET => /api/auth
// @DESC    Getting Logged User from Token
// @ACCESS  Private (Auth Middleware Handles Token Verification)
router.get('/', auth, async (req, res) => {
    try {

        const user = await User.findById(req.user.id).select('-password');

        res.json(user);

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

// @ROUTE   POST => /api/auth
// @DESC    Users Login With Email & Password
// @ACCESS  Public
router.post('/', [
    body('email', 'Please Provide a Valid Email').not().isEmpty(),
    body('password', 'Please Provide The Password').not().isEmpty()
], async (req, res) => {
    try {

        // Error Boundary From Express-Validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        const user = await User.findOne({ email });

        // Check if There's not Email from User Input
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Wrong Credentials' }] });
        }

        // There's an Email
        const isMatched = await bcrypt.compare(password, user.password);

        if (!isMatched) {
            return res.status(400).json({ errors: [{ msg: 'Wrong Credentials' }] });
        }

        // Returning "JSON-Web-Token" Upon Success Registration
        const payload = {
            user: {
                id: user.id
            }
        }
        const token = jwt.sign(payload, process.env.JSON_SECRET, { expiresIn: '24h' });
        res.send(token);

    } catch (error) {
        res.status(500).send('Internal Server error');
    }
})

module.exports = router;
