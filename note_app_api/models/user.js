const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    maxlength: 50,
    minlength: 3,
    unique:true,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
    unique:false,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 1,
    unique:false,
  },
  notes:{
    type:Array,
    default:[String],
    unique:false,
  }
})


UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};
module.exports = mongoose.model('User', UserSchema)
