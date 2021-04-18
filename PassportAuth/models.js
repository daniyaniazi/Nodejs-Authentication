const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    messages: [
        {
            type: String
        }
    ]

})


module.exports = mongoose.model('User', UserSchema);