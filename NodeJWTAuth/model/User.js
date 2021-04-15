const mongoose = require("mongoose")
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        max: 1024, //hash
        min: 6,
    }
    ,
    date: {
        type: Date,
        defauly: Date.now
    }
})

module.exports = mongoose.model('User', UserSchema)