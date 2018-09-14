const uuidv1 = require('uuid/v1');
const uuidv4 = require('uuid/v4');
const schema = require('./schema');

// start of use mongoose DB SCHEME
const schemaUsers = schema.User;
const schemaNews = schema.News;

/*\*\*\*\*\* USERS methods *\*\*\*\*\*\*/

// verifying the validity of the USER
const isNotValidUser = data => {
    let isName = !!data.username;
    let isPassword = !!data.password;
    return !isName || !isPassword;
};

// verifying the validity of the NEWS
const isNotValidNews = data => {
    let isText = !!data.text;
    let isTheme = !!data.theme;
    return !isText || !isTheme;
};

// GET users of DB
module.exports.getUsers = function () {
    return schemaUsers.find({})
};

// SAVE new user in DB
module.exports.saveNewUser = function (data) {
    if (isNotValidUser(data)) {
        return Promise.reject(new Error('Введите логин и пароль, это обязательные поля!'))
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

// UPDATE user in DB
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

// DELETE user of DB
module.exports.deleteUser = function (paramsId) {
    return schemaUsers.findOneAndRemove({id: paramsId})
};

// UPDATE user access_token of DB
module.exports.updateUserAccess = function (user) {
    const newAccess = uuidv1();
    return schemaUsers.findOneAndUpdate({id: user.id}, {access_token: newAccess}, {
        multi: true,
        returnNewDocument: true,
        new: true
    })
};

// UPDATE user permission in DB
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


/*\*\*\*\*\* NEWS methods *\*\*\*\*\*\*/

// GET news of DB DB
module.exports.getNews = function () {
    return schemaNews.find({})
};

// SAVE new in DB
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

// DELETE new of DB
module.exports.deleteNews = function (paramsId) {
    return schemaNews.findOneAndRemove({id: paramsId});
};

// UPDATE new in DB
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
