// This file has all the interactions possible with user profile

// Update email, pwd

const express = require('express');
const { authenticate } = require('../middleware/auth');
const { getUserfromID ,update ,getuserinfo, deleteUser} = require('../controllers/rud_user');
const router = express.Router();
router.get('/id/:id', getUserfromID);
router.get('/getuserinfo', authenticate, getuserinfo);
router.post('/update', authenticate, update);
router.delete('/delete', authenticate, deleteUser);
module.exports = router;