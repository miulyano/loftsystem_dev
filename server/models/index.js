const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let url = process.env.NODE_ENV === 'production' ? 'mongodb://admin:admin1@ds149672.mlab.com:49672/loftsystem':'mongodb://localhost:27017/loftsystem_test';

// connect database
mongoose.connect(url, { useNewUrlParser: true } );
<<<<<<< HEAD
=======
console.log(url);
>>>>>>> e7f4cb78cacbbb2099fa54d3176483d92459ce10

// event connected
mongoose
    .connection
    .on('connected', () => {
        console.log(`Mongoose connection open ${url}`);
    });

// event error
mongoose
    .connection
    .on('error', (err) => {
        console.log('Mongoose connection error: ' + err);
    });

// event disconnected
mongoose
    .connection
    .on('disconnected', () => {
        console.log('Mongoose disconnected');
    });

// event SIGINT
process.on('SIGINT', () => {
    mongoose
        .connection
        .close(() => {
            console.log('Mongoose connection disconnected. App termination');
            process.exit(0)
        })
});
