const router = require("express").Router();
const User = require('../model/User')
const bcrypt = require("bcryptjs")

const { registerValidation } = require('../validation')
router.post('/register', async (req, res) => {
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

router.post('/login', (req, res) => {
    res.send("Login")
})

module.exports = router