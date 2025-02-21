const express = require('express');
const path = require('path');
const connectDB = require('./src/config/db.js');
const authRoutes = require('./src/routes/auth.routes.js');
const  userRoutes = require('./src/routes/user.routes.js');
const passport = require('./src/config/passport.setup.js');
const dotenv = require('dotenv');

const app = express();

connectDB();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});