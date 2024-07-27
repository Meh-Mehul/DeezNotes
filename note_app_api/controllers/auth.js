const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Token = require('../models/blacklist');
// Register a new user
const register = async (req, res, next) => {
  if(req.user){
    res.json({message:"Already Logged in ", data:"ALREADY"});
  }
  else{
    const { name, email, password } = req.body;
    const user = await User.findOne({ name :name});
    if(user){
      res.status(401).json({error:"User already exists"})
    }
    const try1 = await User.findOne({email:email});
    if(try1){
      res.status(401).json({error:"New Email please!"});
    }
    else{
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(200).json({ message: 'Registration successful' });
      } catch (error) {
        res.json({message:null});
      }
    }
  }

};

// Login with an existing user
const login = async (req, res, next) => {
  if(req.user){
    res.json({message:"Already Logged in ", token:req.headers.authorization?.split(' ')[1]});
  }
  else{
    const { name, password } = req.body;
    // console.log(name, password);
    try {
      const user = await User.findOne({ name });
      if (!user) {
        return res.status(200).json({ message: 'User not found', token:null });
      }

      const passwordMatch = await user.comparePassword(password);
      if (!passwordMatch) {
        return res.status(200).json({ message: 'Incorrect password', token:null });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1 hour'
      });
      res.json({message:"Logged In successfully", token });
    } catch (error) {
      next(error);
    }
  }
};

const logout = async (req, res, next)=>{
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.json({ message: 'You need to be login for this to happen' });
  }
  const added_token = new Token({token:token});
  await added_token.save();
  res.json({message:"Successfully Logged out!", data:"LOGOUT"});

};
module.exports = { register, login ,logout};