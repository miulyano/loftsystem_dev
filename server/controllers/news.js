const db = require('../models/db');
const schema = require('../models/schema');

const schemaUsers = schema.User;
const schemaNews = schema.News;

module.exports.getNews = function (req, res) {
    db.getNews().then((results) => {
        res.json(results);
    })
    .catch((err) => {
        res.status(400).json({error: err.message});
    })
};

module.exports.newNews = function (req, res) {
    const bodyObj = JSON.parse(req.body);
    schemaUsers.findOne({id: bodyObj.userId})
        .then((user) => {
            db.newNews(bodyObj, user)
                .then((results) => {
                    db.getNews().then((results) => {
                        res.json(results);
                    })
                        .catch((err) => {
                            res.status(400).json({error: err.message});
                        })
                })
                .catch((err) => {
                    res.status(400).json({error: err.message});
                })
        })
        .catch((err) => {
            res.status(400).json({error: err.message});
        });
};

module.exports.deleteNews = function (req, res) {
    db.deleteNews(req.params.id)
        .then((results) => {
            if (results) {
                db.getNews().then((results) => {
                    res.json(results);
                })
                    .catch((err) => {
                        res.status(400).json({error: err.message});
                    })
            } else {
                res.status(400).json({error: 'Новость не найдена'});
            }
        })
        .catch((err) => {
            res.status(400).json({err: err.message});
        })
};

module.exports.updateNews = function (req, res) {
    const bodyObj = JSON.parse(req.body);
    schemaNews.findOne({id: req.params.id})
        .then( news => {
            db.updateNews(bodyObj, news, req.params.id)
                .then(() => {
                    db.getNews()
                      .then((results) => {
                          res.json(results);
                      })
                      .catch((err) => {
                          res.status(400).json({error: err.message});
                      })
                })
        });
};
