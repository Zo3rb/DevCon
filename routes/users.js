const express = require('express');

// Creating New Router From Express Server
const router = express.Router();

// Creating all The Endpoints of The Router
router.get('/', (req, res) => res.send({ msg: "Hello From This Route" }));

module.exports = router;
