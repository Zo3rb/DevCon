const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Creating New Router From Express Server
const router = express.Router();

// @ROUTE   POST => /users
// @DESC    Users Registration
// @ACCESS  Public
router.post('/', [      // Validation Middleware
    body('email', 'Please Add an Email to be Able to Login With').isEmail(),
    body('name', 'Every User Should have a Name - Please Provide a Name').not().isEmpty(),
    body('password', 'Please add a Valid 6 Digits Length Password').isLength({ min: 6 })
], async (req, res) => {    // The Route Controller
    try {

        // Error Boundary From Express-Validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Destructuring From The Request Object
        const { email, name, password } = req.body;

        // Check if The User Already Exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User Already Exists' }] });
        }

        // User Didn't Signup Before
        const newUser = await User.create({ email, name, password });

        // Hashing The User Password Before Saving The Document
        newUser.password = await bcrypt.hash(password, 8);

        // Saving The document Then Sending it Back
        await newUser.save();

        // Returning "JSON-Web-Token" Upon Success Registration
        const payload = {
            user: {
                id: newUser.id
            }
        }
        const token = jwt.sign(payload, process.env.JSON_SECRET, { expiresIn: '24h' });
        res.send(token);

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
