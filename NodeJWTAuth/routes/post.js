const router = require("express").Router();
const verify = require('./verifyToken')
const User = require("../model/User")


router.get('/', verify, async (req, res) => {
    console.log(req.user)
    let user = await User.findById(req.user._id)
    res.json({
        posts: {
            user: user.name,
            title: "My first post", description: "Checking Token Access This post only access by logged in users"
        }
    })
})

module.exports = router