// DEPENDENCIES
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const expressSession = require('express-session');

require('dotenv').config();

const connectDB = require('./config/db');

// IMPORT USER MODEL
const User = require('./models/User');

// IMPORT ROUTES
const authRoutes = require('./routes/authRoutes');
const farmerDashRoutes = require('./routes/farmerDashRoutes');
const managerDashRoutes = require('./routes/managerDashRoutes');
const salesDashRoutes = require('./routes/salesDashRoutes');
const chickRequestRoutes = require('./routes/chickRequestRoutes');
const feedsRoutes = require('./routes/feedsRoutes');

// INSTANTIATIONS
const app = express();
const port = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// Render/other reverse proxies sit in front of the app; needed for secure cookies
app.set('trust proxy', 1);

// CONFIGURATIONS
connectDB();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express Session Config
app.use(expressSession({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport Configs
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// API ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/farmer', farmerDashRoutes);
app.use('/api/manager', managerDashRoutes);
app.use('/api/sales', salesDashRoutes);
app.use('/api/chick-requests', chickRequestRoutes);
app.use('/api/feeds-requests', feedsRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// For Non-Existing Routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => console.log(`listening on port ${port}`));
