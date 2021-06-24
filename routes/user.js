const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const passport = require("passport")
require("../models/Status")
const Status = mongoose.model("status")
const async = require('async')
require("../models/User")
const User = mongoose.model("users")
const crypto = require("crypto")
const nodemailer = require("nodemailer")
const sgMail = require('@sendgrid/mail')


router.get("/login", (req, res) => {
    res.render("user/login")
})

router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/admin",
        failureRedirect: "/user/login",
        failureFlash: true
    })
        (req, res, next)
})

router.get("/logout", (req, res) => {
    req.logout()
    req.flash("success_msg", "Sessão terminada")
    res.redirect("/")
})

router.get("/rest-password", (req, res) => {
    res.render("user/reset")
})



router.post('/forgot', (req, res, next) => {
    async.waterfall([
        (done) => {
            crypto.randomBytes(20, (err, buf) => {
                var token = buf.toString('hex');
                done(err, token);
            });
        },

        (token, done) => {
            User.findOne({ email: req.body.email }, (err, user) => {
                if (!user) {
                    req.flash("error_msg", "Não existe nenhum utilizador com esta conta");
                    return res.redirect("/user/rest-password");
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save((err) => {
                    done(err, token, user);
                });
            });
        },
        (token, user, done) => {
            var smtpTransport = nodemailer.createTransport({
                service: "smtp.sendgrid.net",
                port: 587,
                secure: false,
                auth: {
                    user: "apikey",
                    pass: "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"
                }
            });
            var mailOptions = {
                to: user.email,
                from: "spenna.live@gmail.com",
                subject: 'Node.js Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, (err) => {
                req.flash("succes_msg", 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], (err) => {
        if (err) return next(err);
        res.redirect('/user/rest-password');
    });
});


router.get("/contact", (req, res) => {
    req.flash("succes_msg", "Agradecemos o seu contacto");
    res.render("user/contact")
})

router.post("/sendcontact",(req,res)=>{
    res.render("user/contact")
})

router.get("/about/us", (req, res) => {
    res.render("user/about_us")
})

router.get("/status/os", (req, res) => {
    res.render("user/status_os")
})

router.post("/search", (req, res) => {
    Status.find({ os: req.body.os }).populate("os").then((status) => {
        console.log("Dados encontrados: " + req.body.os)
        res.render("user/status_os", { status: status })
    }).catch((error) => {
        req.flash("error_msg", "Ordem de serviço solicitada não existe!")
        console.log("Ocorreu um erro ao encontrar resultado: " + error)
        res.render("user/404")
    })
})

module.exports = router