const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let url = 'mongodb://localhost:27017/loftsystem_test';

// connect database
mongoose.connect(url, { useNewUrlParser: true } );

mongoose
    .connection
    .on('connected', () => {
        console.log(`Mongoose connection open ${url}`);
    });

mongoose
    .connection
    .on('error', (err) => {
        console.log('Mongoose connection error: ' + err);
    });

mongoose
    .connection
    .on('disconnected', () => {
        console.log('Mongoose disconnected');
    });

process.on('SIGINT', () => {
    mongoose
        .connection
        .close(() => {
            console.log('Mongoose connection disconnected. App termination');
            process.exit(0)
        })
});
