const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require ('../models/user.models.js');
const dotenv = require('dotenv');
// const session = require('express-session');

dotenv.config();


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const existingUser = await User.findOne({ googleId: profile.id });
          if (existingUser) {
            // return done(null, existingUser);
            console.log("User already exists");
            done(null, existingUser);
          } else {
            // const user = await new User({
            //   googleId: profile.id,
            //   firstName: profile.name.givenName,
            //   lastName: profile.name.familyName,
            //   profilePicture: profile.photos[0].value,
            // }).save().then((user)=> {
            //   console.log("User created successfully");
            //   done(null, user);
            // })



            const user = await new User({
                googleId: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                profilePicture: profile.photos[0].value,
                email: profile.emails ? profile.emails[0].value : 'N/A',// Add this line to get email
                // For password, you could set a random one or modify your schema
              }).save().then((user)=>{
                console.log("user created success");
                done(null, user);
              })
          }
        } catch (error) {
          console.log(error);
        }
      }
    )
  );