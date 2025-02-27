const router = require('express').Router();
const passport = require('passport');

// auth login
router.get('/login', (req, res) => {
    res.render('login', { user: req.user });
});

// auth logout
router.get('/logout', (req, res) => {
    // handle with passport
    res.send('logging out');
});

// auth with google+
router.get('/google', passport.authenticate('google', {
    scope: ['profile','email']
}));

// callback route for google to redirect to
// Replace the problematic section with this
router.get('/google/redirect', passport.authenticate('google', {
    failureRedirect: '/auth/login'
}), (req, res) => {
    res.redirect('/dashbroad');
});

// router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
//     res.redirect('/dashbroad');});


module.exports = router;