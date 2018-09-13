const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');

const app = express();
require('./models');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../public')));
app.use('/', require('./routes'));

app.use(session({
    secret: 'secret',
    key: 'keys',
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 60*9999999999
    },
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

require('./config/config-passport');
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.status(404).json({err: `404\nNot found`});
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({err: '500\nServer error'});
});

const server = app.listen(process.env.PORT || 3000, function () {
    console.log('Сервер запущен на порте: ' + server.address().port);
});

const io = require('socket.io').listen(server);
const chat = require('./libs/chat');
chat(io);
