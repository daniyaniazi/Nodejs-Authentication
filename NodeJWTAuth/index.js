const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require('dotenv')
//routes
const authRoutes = require('./routes/auth')

dotenv.config()

//Conect to db
mongoose.connect(process.env.DB_CONNECT, () => {
    console.log("Connected to db")
})

//Middlewares
app.use(express.json())

//Middleware routes
app.use('/api/user', authRoutes)

app.listen(3000, () => {
    console.log("Server started running on port 3000")
})
