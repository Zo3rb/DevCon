require('dotenv').config({ path: "./config/config.env" }); // Getting Customized ENV Vars
const express = require('express'); // Express Framework
const morgan = require('morgan'); // HTTP/HTTPS Logger

// Creating an Instance From Express Framework
const app = express();

// Connection The Application to The Database
const connect = require('./db');
connect();

// Third Party Middleware
app.use(morgan('tiny'));
app.use(express.json());

// Customized Middleware
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/posts', require('./routes/posts'));

// Serve up The Application
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`The Application is Up & Running on PORT ${PORT}`));
