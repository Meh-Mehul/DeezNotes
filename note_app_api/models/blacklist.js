const mongoose = require('mongoose')

const TokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: [true, 'Please provide token'],
    minlength: 1,
  },
});

module.exports = mongoose.model('blacklist', TokenSchema)
