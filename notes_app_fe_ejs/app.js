// app
const express = require('express');
const axios  = require('axios');
const app = express();
const path = require('path');
var cookieParser = require('cookie-parser')
// cors
const cors = require('cors');
app.use(cors());
app.use(cookieParser())

// body-parser stuff
app.use(express.urlencoded({extended:false}));
app.set('view-engine', 'ejs');
app.set("views", path.join(__dirname, "views"));


// Routes and middlwares
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/rud_user');
const noteRoutes = require('./routes/crud_notes');
const checkIfLoggedIn = require('./middlewares/ifLoggedin');
const getUser = require('./middlewares/getuser');
app.use('/',authRoutes);
app.use('/user', userRoutes)
app.use('/note',noteRoutes);
app.get('/register', checkIfLoggedIn,(req,res, next)=>{
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
})
app.get('/login', checkIfLoggedIn,(req, res)=>{
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
})
// Home page
app.get('/', getUser,(req, res)=>{
  let data = '';
  let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'http://localhost:5000/user/note/pub/all',
  headers: { },
  data : data
  };
  axios.request(config)
  .then((response) => {
      res.render('home.ejs', {notes:response.data['data'], user:req.user});
  })
  .catch((error) => {
      console.log(error);
      res.status(201).json({message:"Internal Server Error"});
  });
});

// Running the app
const port = process.env.PORT || 3000;
const start = () => {
    try {
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    } catch (error) {
      console.log(error);
    }
  };
  
start();