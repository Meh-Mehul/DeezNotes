const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Token = require('../models/blacklist');
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(200).json({ message: 'Authentication required' });
  }

  try {
    const check = await Token.findOne({token:token});
    if(!check){
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decodedToken.userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found' , data: null});
      }
      req.user = user;
      next();
    }
    else{
      res.status(200).json({ message: 'Invalid token' , data:null});
    }
  } catch (error) {
    res.status(200).json({ message: 'Invalid token' , data:null});
  }
};

const caseauthenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(200).json({ message: 'Authentication required' });
  }

  try {
    const check = await Token.findOne({token:token});
    if(!check){
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decodedToken.userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found' , data: null});
      }
      req.user = user;
      next();
    }
    else{
      req.user = null;
      next();
    }
  } catch (error) {
    req.user = null;
    next();
  }
};


module.exports = { authenticate, caseauthenticate };