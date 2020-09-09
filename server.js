require('dotenv').config({ path: "./config/config.env" });
const express = require('express');
const morgan = require('morgan');

// Creating an Instance From Express Framework
const app = express();

// Third Party Middleware
app.use(morgan('tiny'));
app.use(express.json());

// Customized Middleware
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/posts', require('./routes/posts'));

// Connection The Application to The Database
const connect = require('./config/db');
connect();

// Serve up The Application
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`The Application is Up & Running on PORT ${PORT}`));
