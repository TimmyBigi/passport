const router = require('express').Router();
const { signup, login } = require('../controller/user.controller.js');

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', (req, res) => {
    // Add session clearing logic here when you implement sessions
    res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;