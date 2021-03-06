const router = require("express").Router();
const User = require('../model/User')
const bcrypt = require("bcryptjs")
const { registerValidation, loginValidation } = require('../validation')
const jwt = require("jsonwebtoken")

router.post('/register', async (req, res) => {
    //validate
    const { error } = registerValidation(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    //if user is already in Datatbase
    const emailExist = await User.findOne({ email: req.body.email })
    if (emailExist) {
        return res.status(400).send("Email already Exist")
    }

    //Hash Passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    //Create a new User
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        const savedUser = await user.save()
        res.send({ user: user._id })
    } catch (error) {
        res.status(400).send(error)
    }
})

//Login
router.post('/login', async (req, res) => {
    //validate
    const { error } = loginValidation(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    //if user is  in Datatbase
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).send("User is not found")
    }
    const validPass = await bcrypt.compare(req.body.password, user.password)

    //If not valid
    if (!validPass) {
        return res.status(400).send("Invalid Password")
    }
    //Create and Assign a token
    const maxAge = 3 * 24 * 60 * 60 //3 days
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: maxAge })
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.header('auth-token', token) //.send(token);
    res.status(200).json({ user: user._id, token: token })
})



//Logout
router.get('/logout', (req, res) => {

    //remove token that expires very very quickly
    res.cookie('jwt', '', { maxAge: 1 });
    res.send("Logged Out")
    res.redirect('/auth/user/login')
})
module.exports = router