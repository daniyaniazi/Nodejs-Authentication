const routes = require('express').Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('./models')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const dotenv = require('dotenv')
const flash = require('connect-flash')


//Conect to db
dotenv.config()
mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true, useUnifiedTopology: true,
}).then(() => console.log("DATABASE CONNECTED")).catch((err) => {
    console.log("Error while connecting with database ", err)
})


//middlewares
routes.use(cookieParser('secret'))
routes.use(session({
    secret: 'secret',
    maxAge: 3600000,
    resave: true,
    saveUninitialized: false,
}))

//set passport
routes.use(passport.initialize())
routes.use(passport.session())

//Connect Flash after cookie and session
routes.use(flash());
routes.use(function (req, res, next) {
    res.locals.success_message = req.flash('success_message')
    res.locals.error_message = req.flash('error_message')
    res.locals.error = req.flash('error')
    next()

})

//ROUTES
//GET index signup page
routes.get('/', (req, res) => {
    res.render('index')
})

//signup
routes.post('/register', (req, res) => {
    var { username, email, password1, password2 } = req.body
    var err;
    //validate
    if (!email || !username || !password1 || !password2) {

        err = "Please fill all the fields"
        res.render('index', { "err": err })
    }
    if (password1 !== password2) {
        err = "Password didn't match"
        res.render('index', { "err": err, "email": email, "username": username })
    }
    if (typeof err == 'undefined') {
        User.findOne({ email: email }, function (err, data) {
            if (err) throw err;
            if (data) {
                console.log("User Exists")
                err = "User Already exist"
                res.render('index', { "err": err, "email": email, "username": username })
            }
            else {
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) throw err;

                    bcrypt.hash(password1, salt, (err, hash) => {
                        if (err) throw err;

                        password = hash;
                        User({
                            username,
                            email,
                            password
                        }).save((err, data) => {
                            if (err) throw err;

                            req.flash('success_message', "Registered Successfully login to continue")

                            res.redirect('/login')
                        })
                    })
                })
            }
        })
    }
})


//AUTH STRATEGY 
var localStrategy = require('passport-local').Strategy
passport.use(new localStrategy({
    usernameField: 'email'
}, (email, password, done) => {
    //form data
    User.findOne({ email: email }, (err, data) => {
        if (err) throw err;

        //no user exist
        if (!data) {
            //default error message
            return done(null, false, { message: "User Doesn't Exist" })
        }

        //comapre password
        bcrypt.compare(password, data.password, (err, match) => {

            if (err) {
                // console.log("comapre err", err)
                return done(null, false, { message: "Some Error Occured" })
            }
            if (!match) {
                //password wrog
                // console.log("not match err", err)
                return done(null, false, { message: "Email or Password did not Match" })
            }
            if (match) {
                console.log("match", match)
                return done(null, data)
            }
        })
    })
}))

passport.serializeUser(function (user, cb) {
    cb(null, user.id)
})

passport.deserializeUser((id, cb) => {
    User.findById(id, (err, User) => cb(err, User))
})
//END OF AUTH STRATEGY



//login
routes.get('/login', (req, res) => {
    res.render('login')
})
routes.post('/login', (req, res, next) => {
    console.log(req.body)
    //define startegy
    passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/success',
        failureFlash: true,
    })(req, res, next);
})


//success
routes.get('/success', (req, res) => {
    res.render('success', { 'user': req.user })
})

//logout
routes.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_message', "Logout Successfully login to continue")
    res.redirect('/login')

})
module.exports = routes