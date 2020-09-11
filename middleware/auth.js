const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    try {

        const token = req.header('x-auth-token');

        if (!token) {
            return res.status(401).json({ errors: [{ msg: "Not Authorized" }] });
        }

        const decoded = jwt.verify(token, process.env.JSON_SECRET);

        req.user = decoded.user;

        next();

    } catch (error) {
        res.status(500).send("Internal Server Error Or Bad Token");
    }

}
