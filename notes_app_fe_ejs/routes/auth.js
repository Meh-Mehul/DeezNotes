const express = require('express');
const axios = require('axios');
const router = express.Router();
const path = require('path');
const checkToken = require('../middlewares/fake_auth')

backendApiUrl = 'http://127.0.0.1:5000'
router.use(express.urlencoded({extended:false}));
router.post('/login', async (req, res, next)=>{
    const { name, password } = req.body;
    const token = req.cookies.jwt;
    if(token){
        res.redirect('http://localhost:3000');
    }
    else{
        try {
            const response = await axios.post(`${backendApiUrl}/login`, { name:name, password:password });
            const { message,token } = response.data;
            if(token){
                // Set the JWT token in a cookie
                res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour expiry
                // res.status(200).json({ message: 'Login successful' });
                res.redirect('/');
            }
            else{
                res.render('message.ejs', {message:message, messageType:'warning',redirectRoute:'/login'});

            }

        } catch (error) {
            console.log(error);
            res.render('message.ejs', {message:error, messageType:'warning',redirectRoute:'/'});

        }
    }
});
router.get('/logout', checkToken, (req, res)=>{
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:5000/logout',
        headers: { 
          'Authorization': `Bearer ${req.cookies.jwt}`
        }
      };
      axios.request(config)
        .then((response) => {
            res.cookie('jwt', '', { expires: new Date(0), httpOnly: true });
            res.redirect('/');
        })
        .catch((error) => {
            console.log(error);
            res.render('message.ejs', {message:error, messageType:'warning',redirectRoute:'/'});
        });
});


module.exports  = router;