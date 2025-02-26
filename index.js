const express = require('express');
const path = require('path');
const connectDB = require('./src/config/db.js');
const session = require('express-session');
const authRoutes = require('./src/routes/auth.routes.js');
const  userRoutes = require('./src/routes/user.routes.js');
const passport = require('passport');
require('./src/config/passport.setup.js');
const dotenv = require('dotenv');
const { isAuthenticated } = require('./src/middleware/auth.js');

const app = express();

connectDB();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false
        // maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'src/views')));

// Routes
app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);



app.get('/', (req,res)=> {
    res.sendFile(path.join(__dirname, 'src/views/home.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/login.html'));
});

app.get('/dashbroad', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/dashbroad.html'));
    // res.send('welcome');
});
app.get('/api/users/profile', (req, res) => {
    console.log("User Data in /api/users/profile:", req.user); // Debugging log

    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    res.json({
        firstName: req.user.firstName || 'N/A',
        lastName: req.user.lastName || 'N/A',
        email: req.user.email || 'N/A',
        googleId: req.user.googleId || null,
        profilePicture: req.user.profilePicture || ''
    });
});

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});