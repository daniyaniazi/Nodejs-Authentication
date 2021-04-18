const express = require('express')
const app = express()
const path = require("path")
const routes = require('./routes')
const bcrypt = require('bcrypt')


//Templaye engine
app.set("view engine", 'ejs')
app.set('views', path.join(__dirname, 'views'))

//Middlewares
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//ROUTES
app.use('/', routes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("server started")
})