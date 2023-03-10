require('dotenv').config()

const mongodb = require('./util/db')
const express = require('express')
const app = express()
const user = require('./routes/userroutes')
const admin = require('./routes/adminroutes')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const nocache = require('nocache')

app.use(nocache())
app.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: true,
    resave: true
  })
)

app.use(flash())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')
app.set('views', './views')

app.use(express.static('public'))
app.use('/', user)
app.use('/admin', admin)

app.use((req, res) => {
  res.status(404).render('error')
})

app.listen(3000)
