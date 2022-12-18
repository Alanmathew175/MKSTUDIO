const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    required: true
  },
  phonenumber: {
    type: String,
    required: true,
    trim: true,
    minLength: 10
  },
  password: {
    type: String,
    required: true
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  }
})
module.exports = mongoose.model('users', userSchema)
