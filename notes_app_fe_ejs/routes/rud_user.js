const express = require('express');
const axios = require('axios');
const router = express.Router();
const checkToken = require('../middlewares/fake_auth');
const getUser = require('../middlewares/getuser');
router.use(checkToken);
router.use(express.urlencoded({extended:false}));
const backendApiUrl = 'http://localhost:5000'
// Shows the Notes and the Info about the user.
router.get('/info', (req, res)=>{
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${backendApiUrl}/user/getuserinfo`,
        headers: { 
          'Authorization': `Bearer ${req.cookies.jwt}`
        }
      };
    axios.request(config)
        .then((response) => {
            curruser = response.data.data;
            config.url = `${backendApiUrl}/user/note/usernotes`;
            axios.request(config)
                .then((response) => {
                    if(curruser){
                        res.render('user.ejs', {user:curruser, notes:response.data.data});
                    }
                    else{
                      res.render('message.ejs', {message:"Unauthorized", messageType:'warning',redirectRoute:'/'});
                    }
                    
                })
                .catch((error) => {
                  res.render('message.ejs', {message:error, messageType:'warning',redirectRoute:'/'});

                });
        })
        .catch((error) => {
          res.render('message.ejs', {message:error, messageType:'warning',redirectRoute:'/'});

        });
});

router.get('/update',getUser,(req,res)=>{
    res.render('user_update.ejs', {user:req.user});
});

router.post('/update',  (req, res)=>{
    const { email, oldpassword, password } = req.body;
    console.log(email, oldpassword, password);
    let data = JSON.stringify({
        "email": email,
        "oldpassword": oldpassword,
        "password": password
      });
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:5000/user/update',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${req.cookies.jwt}`
        },
        data : data
      };
    axios.request(config)
        .then((response) => {
            if(response.data.data){
                res.redirect('/user/info');
            }
            else{
              res.render('message.ejs', {message:response.data.message, messageType:'warning',redirectRoute:'/user/info'});
            }
            
        })
        .catch((error) => {
          res.render('message.ejs', {message:error, messageType:'warning',redirectRoute:'/'});

        });
    })

router.get('/notes',getUser, (req,res)=>{
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${backendApiUrl}/user/note/all`,
        headers: { 
          'Authorization': `Bearer ${req.cookies.jwt}`
        }
      }
    axios.request(config)
      .then((response) => {
        res.render('usernotes.ejs', {user:req.user, notes:response.data.data});
      })
      .catch((error) => {
        res.render('message.ejs', {message:error, messageType:'warning',redirectRoute:'/'});
      });

});

module.exports = router;