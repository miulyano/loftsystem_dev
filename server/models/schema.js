const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const types = {
    username: {
        type: String,
        required: [true,"username required"],
        unique: true,
        minlength: [3,"username too short"],
        maxlength: [20,"username too long"]
    },
    text: {
        type: String,
        required: false,
        maxlength: [250,"too long"]
    },
    longtext: {
        type: String,
        required: false,
        minlength: [3,"too short"],
        maxlength: [500,"too long"]
    },
    password: {
        type: String,
        required: [true,"password required"],
        minlength: [3,"too short"],
        maxlength: [250,"too long"]
    },
    id: {
        type: String,
        required: [true,"id required"],
        unique: true
    }
};

// data userScheme types
const userScheme = new Schema ({
    access_token: types.text,
    id: types.id,
    username: types.username,
    surName: types.text,
    firstName: types.text,
    middleName: types.text,
    permission: Object,
    permissionId: types.id,
    password: types.password,
    image: types.text
});

// data newsScheme types
const newsScheme = new Schema ({
    id: types.id,
    userId: types.text,
    text: types.longtext,
    theme: types.text,
    date: types.text,
    user: Object
});

// data chatScheme types
const chatScheme = new Schema ({
    id: types.id,
    username: types.text
});

// exports Scheme models
module.exports.User = mongoose.model("users", userScheme);
module.exports.News = mongoose.model("news", newsScheme);
module.exports.Chat = mongoose.model("chat", chatScheme);
