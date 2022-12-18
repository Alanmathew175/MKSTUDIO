const express = require('express')
const userroutes = express()

const controller = require('../controller/usercontroller')

userroutes.get('/', controller.loadhome)
userroutes.get('/login', controller.loadloginpage)
userroutes.post('/login', controller.postLoggin)
userroutes.get('/register', controller.loadregisterpage)
userroutes.post('/register', controller.insertuser)

module.exports = userroutes
