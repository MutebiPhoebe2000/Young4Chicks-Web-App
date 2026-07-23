// DEPENDENCIES
const express = require ('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const moment = require('moment');
const expressSession = require('express-session')({
    secret: 'crush',
    resave: false,
    saveUninitialized: false
});

require('dotenv').config();

//IMPORT USERMODEL
const User = require('./models/User');

//IMPORT ROUTE
const addChickRoutes = require('./routes/addChickRoutes')
const indexRoutes = require('./routes/indexRoutes');
//const chickRoutes = require('./routes/chickRoutes');
const managerDashRoutes = require('./routes/managerDashRoutes');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const farmerDash = require('./routes/farmerDashRoutes');
const salesDashRoutes = require('./routes/salesDashRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const feedsRoutes = require('./routes/feedsRoutes');
//const sDashRoutes = require('./routes/sDashRoutes');


//INSTANTIATIONS
const app = express();
const port = 3001;


//CONFIGURATIONS
app.locals.moment = moment;
mongoose.connect(process.env.DATABASE);
mongoose.connection
  .once('open', () => {
    console.log('Mongoose Connection Open!')
  })
  .on('error', (error) => {
    console.error(`Connection Error: ${error.message}
    `);
  });

  app.set('view engine', 'pug')
  app.set('views', path.join(__dirname, 'views'));

  //MIDDLEWARE
  // app.use('/about', (req, res, next) => {
  //   console.log('A newrequest recieved at ' + Date.now());
  //   next();
  // });

  app.use(express.urlencoded({extended: false}));
  //app.use(express.json()); 
  app.use(express.static(path.join(__dirname, 'public')));

//Express Session Configs
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());//

//Passport Configs
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//USE IMPORTED ROUTESpassport.deserializeUser(User.deserializeUser());
app.use('/', indexRoutes);
app.use('/', aboutRoutes);
// app.use('/', chickRoutes);
app.use('/managersDash', managerDashRoutes);
app.use('/', authRoutes);
app.use('/', contactRoutes);
app.use('/farmerDash', farmerDash);
app.use('/salesDash', salesDashRoutes);
app.use('/chickRequest', addChickRoutes);
app.use('/feedsRequest', feedsRoutes);
//app.use('/', chickRoutes);
// app.use('/', contactRoutes);
// app.use('/', contactRoutes);
//For Non-Existing Routes
app.use((req, res) => {
    res.status(404).send('Oops! Route not found!');
});

app.listen(port, () => console.log(`listening on port ${port}`));