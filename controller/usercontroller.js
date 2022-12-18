const Users = require('../models/userModel')
const Banners = require('../models/bannerModel')
const Products = require('../models/productModel')
exports.loadhome = async(req, res) => {
  try {
    const banner = await Banners.find({isActive:1})
    const products = await Products.find({status:1}).limit(4)
    
    res.render('user/home', {
       banners: banner,
       products
    })
  } catch (error) {
    console.log(error.message)
  }
  
}
exports.loadloginpage = (req, res) => {
  res.render('user/login')
}
exports.loadregisterpage = (req, res) => {
  res.render('user/register')
}

exports.insertuser = async (req, res) => {
  if (req.body.password === req.body.password2) {
    try {
      const email = req.body.email
      const phonenumber = req.body.phonenumber
      const Data = await Users.findOne({ email })
      if (Data) {
        return res.render('user/register', {
          message: ' User Already Exist'
        })
      }
      const user = new Users({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phonenumber,
        email,
        password: req.body.password
      })

      const userData = await user.save()

      if (userData) {
        res.redirect('/')
      } else {
        return res.render('user/register.ejs', {
          message: 'Your registration has been failed'
        })
      }
    } catch (error) {
      console.log(error.message)
    }
  } else {
    return res.render('user/register', {
      message: ' Password must be same'
    })
  }
}
exports.postLoggin = async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password
    const userData = await Users.findOne({ email })

    if (userData.password === password) {
      return res.render('user/home', { userData })
    } else {
      console.log(userData)
      return res.render('user/login', {
        message: 'Email or password is incorrect'
      })
    }
  } catch (error) {
    console.log(error.message)
  }
}
