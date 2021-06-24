const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
require("../models/User")
const User = mongoose.model("users")


module.exports = function (passport) {
    passport.use(new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
        session: false
    }, (email, password, done) => {
        User.findOne({ email: email }).then((user) => {

            if (!user) {
                return done(null, false, { message: "Utilizador não existe!" });
            }

            bcrypt.compare(password, user.password, (err, pass) => {
                if (pass) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: "Utilizador e/ou senha inválidos!" })
                }
            })

        })
    }));

    passport.serializeUser((user,done)=>{
        done(null, user.id)
    })

    passport.deserializeUser((id,done)=>{
        User.findById(id,(err, user)=>{
            done(err,user)
        })
    })

}

