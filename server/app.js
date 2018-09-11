const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
require('./models');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());

app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/', require('./routes'));

app.use((req, res, next) => {
    res
        .status(404)
        .json({err: '404'});
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    res
        .status(500)
        .json({err: '500'});
});

const server = app.listen(process.env.PORT || 3000, function () {
    console.log('Сервер запущен на порте: ' + server.address().port);
});
