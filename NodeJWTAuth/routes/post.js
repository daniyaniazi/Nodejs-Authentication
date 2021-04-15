const router = require("express").Router();
const verify = require('./verifyToken')


router.get('/', verify, (req, res) => {
    res.json({
        posts: {
            title: "My first post", description: "Checking Token Access This post only access by logged in users"
        }
    })
})

module.exports = router