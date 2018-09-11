const db = require('../models/db');
const passwordLibs = require('../libs/passwordBcrypt');

const schema = require('../models/schema');
const schemaUsers = schema.User;
const schemaNews = schema.News;
const schemaChat = schema.Chat;

const createHash = passwordLibs.createHash;
const isValidPassword = passwordLibs.isValidPassword;

module.exports.login = function (req, res) {
    //let bodyObj = JSON.parse(req.body);
    console.log(req.body);
    // schemaUsers.findOne({username: bodyObj.username}).then(user => {
    //     //console.log(user)
    // });
};

module.exports.authFromToken = function (req, res) {
    const token = req.cookies.access_token || req.body.access_token;
    console.log(token);
    schemaUsers.findOne({access_token: token}).then(user => {
        if (user) {
            res.status(200).json(user);
        } else {
            res.json({err: 'Нет токена'});
        }
    });
};

module.exports.getUsers = function (req, res) {
    db.getUsers().then((results) => {
            res.json(results);
        })
        .catch((err) => {
            res.status(400).json({err: err.message});
        })
};

module.exports.saveNewUser = function (req, res) {
    const bodyObj = req.body;
    bodyObj.password = createHash(bodyObj.password);

    schemaUsers.findOne({username: bodyObj.username}).then(user => {
        if (user) {
            res.json({err: 'Пользователь с таким логином уже существует'});
        } else {
            db.saveNewUser(req.body).then((results) => {
                    res.status(201).json(results);
                })
                .catch((err) => {
                    res.status(400).json({err: err.message});
                })
        }
    });
};

module.exports.updateUser = function (req, res) {
    const bodyObj = req.body;
    schemaUsers.findOne({id: bodyObj.id}).then(user => {
        if (user) {
            if (bodyObj.oldPassword) {
                if (isValidPassword(user.password, bodyObj.oldPassword)) {
                    bodyObj.password = createHash(bodyObj.password);
                } else {
                    res.status(400).json({err: 'incorrect password'});
                }
            }
            db.updateUser(bodyObj, user, req.params.id).then((results) => {
                    if (results) {
                        res.json(results);
                    } else {
                        res.status(400).json({err: 'User not found'});
                    }
                })
                .catch((err) => {
                    res.status(400).json({err: err.message});
                })
        } else {
            res.status(400).json({err: 'undefined user'});
        }
    });
};

module.exports.deleteUser = function (req, res) {
    db.deleteUser(req.params.id).then((results) => {
            if (results) {
                res.json(results);
            } else {
                res.status(400).json({err: 'User not found'});
            }
        })
        .catch((err) => {
            res.status(400).json({err: err.message});
        })
};
