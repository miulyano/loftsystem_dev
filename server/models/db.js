const mongoose = require("mongoose");
const uuidv1 = require('uuid/v1');
const uuidv4 = require('uuid/v4');
const schema = require('./schema');
const schemaUsers = schema.User;
const schemaNews = schema.News;
const schemaChat = schema.Chat;


const isNotValidUser = data => {
    let isName = !!data.username;
    let isPassword = !!data.password;
    return !isName || !isPassword;
};

const isNotValidNews = data => {
    let isText = !!data.text;
    let isTheme = !!data.theme;
    return !isText || !isTheme;
};

module.exports.getUsers = function () {
    return schemaUsers.find({})
};

module.exports.saveNewUser = function (data) {
    if (isNotValidUser(data)) {
        return Promise.reject(new Error('Data format is not correct'))
    }
    const User = new schemaUsers ({
        access_token: uuidv1(),
        id: uuidv4(),
        username: data.username,
        surName: data.surName || '',
        firstName: data.firstName || '',
        middleName: data.middleName || '',
        permission: data.permission,
        permissionId: uuidv4(),
        password: data.password,
        image: data.img || ''
    });

    return User.save()
};

module.exports.updateUser = function (data, user, paramsId) {
    const User = {};
    User.surName = data.surName ||  data.surName === ''? data.surName : user.surName;
    User.firstName = data.firstName || data.firstName === '' ? data.firstName : user.firstName;
    User.middleName = data.middleName || data.middleName === '' ? data.middleName : user.middleName;
    User.image = data.image ? data.image : user.image;
    User.password = data.password ? data.password : user.password;
    return schemaUsers.findOneAndUpdate ({
        id: data.id
    }, {
        $set: User
    }, {new: true})
};

module.exports.deleteUser = function (paramsId) {
    return schemaUsers.findOneAndRemove({id: paramsId})
};

module.exports.updateUserAccess = function (user) {
    const newAccess = uuidv1();
    return schemaUsers.findOneAndUpdate({id: user.id}, {access_token: newAccess}, {
        multi: true,
        returnNewDocument: true,
        new: true
    })
};

module.exports.updateUserPermission = (user, data) => {
    let newPermission = user.permission;
    for (key1 in data.permission) {
        let changedAttr = newPermission[key1];
        for (key2 in data.permission[key1]) {
            changedAttr = newPermission[key1][key2];
            newPermission[key1][key2] = !newPermission[key1][key2];
        }
    }
    return schemaUsers.findOneAndUpdate({id: user.id}, {permission: newPermission}, {
        multi: true,
        returnNewDocument: true,
        new: true
    })
};

module.exports.getNews = function () {
    return schemaNews.find({})
};

module.exports.newNews = (data, user) => {
    if (isNotValidNews(data)) {
        return Promise.reject(new Error('Заполните текст и тему новости перед добавлением!'))
    }
    const New = new schemaNews({
        id: uuidv1(),
        userId: data.userId,
        text: data.text || '',
        theme: data.theme || '',
        date:  data.date || '',
        user: user
    });
    New.save();
    return schemaUsers.find();
};

module.exports.deleteNews = function (paramsId) {
    return schemaNews.findOneAndRemove({id: paramsId});
};

module.exports.updateNews = function (data, news, paramsId) {
    const News = {};
    News.text = data.text ? data.text : news.text;
    News.theme = data.theme ? data.theme : news.theme;
    News.date = data.date ? data.date : news.date;
    News.user = data.user ? data.user : news.user;
    return schemaNews.findOneAndUpdate ({
        id: paramsId
    }, {
        $set: News
    }, {new: true})
};
