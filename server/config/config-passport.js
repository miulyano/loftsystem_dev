const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('../models/schema').User;

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        done(null, id);
    } else {
        User
            .findById(id, function (err, user) {
                done(err, user);
            });
    }
});

// локальная стратегия

passport.use('loginUsers', new LocalStrategy((username, password, done) => {
    User.findOne({username: username})
        .then(user => {
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch(err => {
            done(err);
        });
}));
