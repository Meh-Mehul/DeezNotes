const express = require('express');
const router = express.Router();
const getUser = require('../middlewares/getuser');
const axios = require('axios');
router.get('/see/:id', getUser, async (req, res, next)=>{
    const id = req.params.id;
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://localhost:5000/user/note/see/${id}`,
        headers: { 
          'Authorization':`Bearer ${req.cookies.jwt}`
        }
      };
    axios.request(config)
    .then(async (response) => {
        if(response.data.data){
            const note = response.data.data;
            if(!req.user){
                res.render('onenote.ejs', { user:null,note:response.data.data, acclist:null});
            }
            else if(note.author === req.user.name){
                let aclist = note.has_ac;
                guys = [];
                try {
                    const requests = aclist.map(id => {
                        config.url = `http://localhost:5000/user/id/${id}`;
                        return axios.request(config);
                    });
                    const responses = await Promise.all(requests);
                    guys = responses.map(response => response.data.data);
                    res.render('onenote.ejs', {user:req.user, note:response.data.data, acclist:guys});
                } catch (error) {
                    res.render('message.ejs', {message:error, messageType:'warning',redirectRoute:'/'});

                }
            }
            else{
                res.render('onenote.ejs', {user:req.user, note:response.data.data, acclist:null});
            }
            
        }
        else{
            res.render('message.ejs', {message:response.data.message, messageType:'warning',redirectRoute:'/'});

        }
        
         //render page with and note and edit flag attribute
    })
    .catch((error) => {
        res.render('message.ejs', {message:error, messageType:'warning',redirectRoute:'/'});

    });



});
router.get('/new', getUser, (req, res)=>{
    res.render('newnote.ejs', {user:req.user});
});
router.post('/new', getUser,(req, res)=>{
    let {text, public} = req.body;
    if(public === 'on'){
        public = true;
    }
    else{
        public = false;
    }
    let data = JSON.stringify({
        "text": text,
        "public": public
      });
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:5000/user/note/create',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${req.cookies.jwt}`
        },
        data : data
      };
    axios.request(config)
        .then((response) => {
            res.redirect('/user/notes');
        })
        .catch((error) => {
            res.render('message.ejs', {message:error, messageType:'warning',redirectRoute:'/'});
        });
});
router.get('/edit/:id', (req,res)=>{
    const id = req.params.id;
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://localhost:5000/user/note/see/${id}`,
        headers: { 
          'Authorization':`Bearer ${req.cookies.jwt}`
        }
      };
    axios.request(config)
    .then((response) => {
        if(response.data.data){
            res.render('edit_note.ejs', { note:response.data.data});
        }
        else{
            res.render('message.ejs', {message:response.data.message, messageType:'warning',redirectRoute:`/note/edit/${id}`});
        }
    })
    .catch((error) => {
        res.render('message.ejs', {message:"Internal Server Error", messageType:'warning',redirectRoute:'/'});
    });
});
router.post('/edit/:id', getUser, (req, res)=>{
    let {text, public} = req.body;

    if(public === 'on'){
        public = true;
    }
    else{
        public = false;
    }
    let data = JSON.stringify({
        "text": text,
        "public": public
    });
      
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `http://localhost:5000/user/note/update/${req.params.id}`,
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${req.cookies.jwt}`
        },
        data : data
    };
    axios.request(config)
        .then((response) => {
            if(response.data.data){
                res.redirect(`/note/see/${req.params.id}`);
            }
            else{
                res.render('message.ejs', {message:response.data.message, messageType:'warning',redirectRoute:`/note/edit/${id}`});
            }
        })
        .catch((error) => {
            res.render('message.ejs', {message:"Internal Server Error", messageType:'warning',redirectRoute:'/'});
        });

    // res.redirect(`/note/edit/${req.params.id}`)
});

router.get('/delete/:id', getUser, (req, res)=>{
    const id = req.params.id;
    let config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: `http://localhost:5000/user/note/delete/${id}`,
        headers: { 
          'Authorization': `Bearer ${req.cookies.jwt}`
        }
    };
    axios.request(config)
    .then((response) => {
        if(response.data.data){
            res.redirect('/user/notes');
        }
        else{
            res.render('message.ejs', {message:"Could Not delete Note", messageType:'warning',redirectRoute:'/user/notes'});

        }
    })
    .catch((error) => {
        res.render('message.ejs', {message:"Internal Server Error", messageType:'warning',redirectRoute:'/'});

    });
});
router.get('/revoke/:id/:name', (req, res)=>{
    const id = req.params.id;
    const name = req.params.name;
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `http://localhost:5000/user/note/deshare/${id}/${name}`,
        headers: { 
          'Authorization': `Bearer ${req.cookies.jwt}`
        }
    };
    axios.request(config)
    .then((response) => {
        response = response.data;
        if(response.data){
            if(response.data === 'CANT'){
                res.render('message.ejs', {message:response.message, messageType:'warning',redirectRoute:`/note/see/${id}`});

            }
            else{
                res.redirect(`/note/see/${id}`);
            }
        }
        else{
            res.render('message.ejs', {message:response.message, messageType:'warning',redirectRoute:`/note/see/${id}`});

        }
    })
    .catch((error) => {
        res.render('message.ejs', {message:error, messageType:'warning',redirectRoute:'/'});

    });
});

router.post('/share/:id', getUser, (req, res)=>{
    const id = req.params.id;
    const {username} = req.body;
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `http://localhost:5000/user/note/share/${id}/${username}`,
        headers: { 
          'Authorization': `Bearer ${req.cookies.jwt}`
        }
    };
    axios.request(config)
    .then((response) => {
        response = response.data;
        if(response.data){
            res.redirect(`/note/see/${id}`);
        }
        else{
            res.render('message.ejs', {message:response.message, messageType:'warning',redirectRoute:`/note/see/${id}`});
        }
    })
    .catch((error) => {
        res.render('message.ejs', {message:"Internal Server Error", messageType:'warning',redirectRoute:'/'});
    });
    
});
module.exports = router;