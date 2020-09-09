const mongoose = require('mongoose');

// The Database URI
const DATABASE_URI = process.env.DATABASE_URI;

// Connection Options
const CONNECT_OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
};

const connectApp = async () => {
    try {
        await mongoose.connect(DATABASE_URI, CONNECT_OPTIONS);
        console.log('Database Connected Successfully');
    } catch (error) {
        console.log(error);
        process.exit();
    }
};

module.exports = connectApp;
