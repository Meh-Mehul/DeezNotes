//express stuff
const express = require('express');
const app = express();
//dotenv
require('dotenv').config();
// security?
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');
//db
const connectDB = require('./db/connect');
// for CORS
const cors = require('cors');
app.use(cors())


app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 5 * 60 * 1000, // 100 request per 5 minutes from one IP.
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.urlencoded({extended:false}));
app.use(helmet());
app.use(xss());
app.use(express.json());

// for home page
app.get('/', (req, res)=>{
    res.json({"Tip":"This is an auth enabled api btw"})
});

// Handling routes here
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user_main');
const notesRoutes = require('./routes/user_notes');
app.use('/', authRoutes);
app.use('/user', userRoutes);
app.use('/user/note', notesRoutes);


// Running the app
const port = process.env.PORT || 5000;
const start = async () => {
    try {
      await connectDB(process.env.MONGO_URI);
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    } catch (error) {
      console.log(error);
    }
  };
  
start();