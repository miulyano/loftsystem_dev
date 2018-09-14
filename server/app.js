const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

<<<<<<< HEAD
=======
// creating an application and connecting MODELS
>>>>>>> e7f4cb78cacbbb2099fa54d3176483d92459ce10
const app = express();
require('./models');

// setting various HTTP headers
app.use(helmet());

// start of use BODYPARSER & COOKIEPARSER
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(cookieParser());

// start of use STATIC DIR & ROUTES
app.use(express.static(path.join(__dirname, '../public')));
app.use('/', require('./routes'));

<<<<<<< HEAD
=======
// error processing
>>>>>>> e7f4cb78cacbbb2099fa54d3176483d92459ce10
app.use((req, res, next) => {
    res.status(404).json({err: `404\nNot found`});
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({err: '500\nServer error'});
});

// SERVER startup
if (require.main === module) {
    const server = app.listen(process.env.PORT || 3000, function () {
        console.log(`Сервер запущен на порте: ${server.address().port}\nhttp://localhost:${server.address().port}`);
    });

    // WEBSOCKET startup
    const io = require('socket.io').listen(server);
    const chat = require('./libs/chat');
    chat(io);

} else {
    module.exports = app
}
