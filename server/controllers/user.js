const db = require('../models/db');
const passwordLibs = require('../libs/passwordBcrypt');
const formidable = require('formidable');
const schema = require('../models/schema');
const path = require('path');
const fs = require('fs');

// start of use mongoose DB SCHEME
const schemaUsers = schema.User;
const schemaNews = schema.News;

// password operations
const createHash = passwordLibs.createHash;
const isValidPassword = passwordLibs.isValidPassword;

// controllers for POST request /api/login
module.exports.login = function (req, res) {
    let bodyObj = JSON.parse(req.body);
    schemaUsers.findOne({username: bodyObj.username})
        .then(user => {
            if (user && isValidPassword(user.password, bodyObj.password)) {
              db.updateUserAccess(user).then(user => {
                  if(bodyObj.remembered) {
                      res.cookie('access_token', user.access_token,{maxAge: 360000000});
                  }
                  res.status(200).json(user);
                });
            } else {
                res.status(400).json({error: 'Пользователь не найден'});
            }
        })
        .catch(() => {
            res.status(400).json({error: 'Указанного пользователя не существует! Проверьте логин или пароль.'});
        });
};

// controllers for POST auto request /api/authFromToken
// replaces the old token with a new one
// for authentication
module.exports.authFromToken = function (req, res) {
    const tokenObj = JSON.parse(req.body);
    schemaUsers.findOne({access_token: tokenObj.access_token})
        .then(user => {
            if (user) {
                res.status(200).json(user);
            } else {
                res.json({error: 'Нет токена'});
            }
        })
        .catch((err) => {
            res.status(400).json({error: err.message});
        });
};

// controllers for GET request /api/getUsers
module.exports.getUsers = function (req, res) {
    db.getUsers()
        .then((results) => {
            res.json(results);
        })
        .catch((err) => {
            res.status(400).json({error: err.message});
        })
};

// controllers for POST request /api/saveNewUser
module.exports.saveNewUser = function (req, res) {
    const bodyObj = JSON.parse(req.body);
    bodyObj.password = createHash(bodyObj.password);

    schemaUsers.findOne({username: bodyObj.username})
        .then(user => {
            if (user) {
                res.json({error: 'Пользователь с таким логином уже существует'});
            } else {
                db.saveNewUser(bodyObj)
                    .then((results) => {
                        res.status(201).json(results);
                    })
                    .catch((err) => {
                        res.status(400).json({err: err.message});
                    })
            }
        })
        .catch((err) => {
            res.status(400).json({error: err.message});
        });
};

// controllers for PUT request /api/updateUser/:id
module.exports.updateUser = function (req, res) {
    const bodyObj = JSON.parse(req.body);
    schemaUsers.findOne({id: bodyObj.id})
        .then(user => {
            if (user) {
                if (bodyObj.oldPassword) {
                    if (isValidPassword(user.password, bodyObj.oldPassword)) {
                        bodyObj.password = createHash(bodyObj.password);
                    } else {
                        res.status(400).json({error: 'Некорректный пароль'});
                    }
                }
                db.updateUser(bodyObj, user)
                    .then((results) => {
                      if (results) {
                        res.json(results);
                        return results;
                      } else {
                        res.status(400).json({error: 'Пользователь не найден'});
                      }
                    })
                    .then((userObj) => {
                        schemaNews.updateMany(
                            {userId: userObj.id}, { $set: {user: userObj}},
                            function(err, result) {
                                if(err) {
                                    res.status(400).json({error: err.message});
                                }
                            })
                        })
                        .catch((err) => {
                            res.status(400).json({error: err.message});
                        })
            } else {
                res.status(400).json({error: 'undefined user'});
            }
        })
        .catch((err) => {
            res.status(400).json({error: err.message});
        });
};

// controllers for DELETE request /api/deleteUser/:id
module.exports.deleteUser = function (req, res) {
    db.deleteUser(req.params.id)
        .then((results) => {
            if (results) {
                res.json(results);
            } else {
                res.status(400).json({error: 'Пользователь не найден'});
            }
        })
        .catch((err) => {
            res.status(400).json({err: err.message});
        })
};

// controllers for PUT request /api/updateUserPermission/:id
module.exports.updateUserPermission = function (req, res) {
    const bodyObj = JSON.parse(req.body);

    schemaUsers.findOne({permissionId: req.params.id})
        .then(user => {
            if (user) {
                db.updateUserPermission(user, bodyObj).then(() => {
                    db.getUsers().then((results) => {
                        res.json(results);
                    })
                        .catch((err) => {
                            res.status(400).json({error: err.message});
                        })
                });
            } else {
                res.status(400).send('undefined user');
            }
        })
        .catch((err) => {
            res.status(400).json({err: err.message});
        });
};

// controllers for POST request /api/saveUserImage/:id
module.exports.saveUserImage = function (req, res) {


  let id = req.params.id;
  let form = new formidable.IncomingForm();
  let upload = 'public/upload';
  let fileName;

  form.uploadDir = path.join(process.cwd(), upload);
  let pathUpload = form.uploadDir;
  if (!fs.existsSync(pathUpload)) {
    fs.mkdirSync(pathUpload);
  }
  form.parse(req, function (err, fields, files) {
    if (err) {
      return res.json({ msg: 'Проект не загружен Ошибка!', status: 'Error' });
    }

    if (files[id]['name'] === '' || files[id]['size'] === 0) {
      return res.json({ msg: 'Проект не загружен Ошибка!', status: 'Error' });
    }

    fileName = path.join(upload, files[id]['name']);
    fileNamedb = path.join('upload', files[id]['name']);

    fs.rename(files[id]['path'], fileName, function (err) {
      if (err) {
        console.error(err);
        fs.unlink(fileName);
        fs.rename(files[id]['path'], fileName);
      }
      let dir = fileName.substr(6);
      //console.log(dir);

      schemaUsers.findOneAndUpdate(
        { id: id },
        { image: fileNamedb },
        { new: true }
      ).then(item => {
        if (item) {
          res.json({ path: fileNamedb });
        } else {
          res.status(404).json({ err: 'User not save' });
        }

      }).catch(e => {
        console.log(e);
      });
    });
  });




    /*const form = new formidable.IncomingForm();
    let userFilePath;
    schemaUsers.findOne({id: req.params.id})
        .then(user => {
            userFilePath = path.join(process.cwd(),'public', user.image);
            uploadPath = path.join(process.cwd(), 'public', 'upload');
            form.parse(req, (err, fields, files) => {
                console.log(fields, files);
                if (err) {
                    return next(err);
                }

                const filePath = files[req.params.id].path;
                console.log();
                const uploadDir = 'upload';
                const savedFilePath = path.join(process.cwd(), 'public', uploadDir, files[req.params.id].name);

                if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath)
                }

                fs.rename(filePath, savedFilePath, (err) => {
                    if (err) {
                        fs.unlink(savedFilePath, (err) => {
                            return (err);
                        });
                        return (err);
                    }
                    if (savedFilePath !== userFilePath) {
                        fs.unlink(userFilePath, (err) => {
                            return (err);
                        });
                    }
                    res.json({path: path.join(uploadDir, files[req.params.id].name)});
                });
            });
        })
        .catch((err) => {
            res.status(400).json({err: err.message});
        });*/
};
