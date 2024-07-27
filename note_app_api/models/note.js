const mongoose = require('mongoose')

const NoteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please provide Note Content'],
    minlength: 1,
  },
  createtime:{
    type:Date,
    required:true,
  },
  isPub:{
    type:Boolean,
    required:true,
    default:false,
  },
  isEdit:{
    type:Boolean,
    required:true,
    default:false,
  },
  author:{
    type:String,
    required:true,
  },
  has_ac:{
    type:Array,
    required:true,
    default:[String],
  }
});

module.exports = mongoose.model('Note', NoteSchema)
