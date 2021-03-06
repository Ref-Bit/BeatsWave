var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");
var firebase = require('firebase');
// Initialize Firebase
var config = {
  apiKey: "AIzaSyBrVv_E4ICOuB_iHo3HWBc_BV35Bas8HyA",
  authDomain: "beatswave-85fcc.firebaseapp.com",
  databaseURL: "https://beatswave-85fcc.firebaseio.com",
  storageBucket: "gs://beatswave-85fcc.appspot.com",
};
firebase.initializeApp(config);

var db = admin.database();
var auth = admin.auth();
var ref = db.ref("/");

/* GET Register Form. */
router.get('/register', function(req, res, next) {
  res.render('users/register' , {title: 'BeatsWave - Register'});
});

/* POST Register Form. */
router.post('/register', function(req, res, next) {
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var email = req.body.email;
  var password = req.body.password;
  var confirm_password = req.body.confirm_password;
  var location = req.body.location;
  var fav_genres = req.body.fav_genres;
  var fav_artists = req.body.fav_artists;

  // Validation
  req.checkBody('first_name', 'First Name is required!').notEmpty();
  req.checkBody('last_name', 'Last Name is required!').notEmpty();
  req.checkBody('email', 'Email is required!').notEmpty();
  req.checkBody('email', 'email is not valid!').isEmail();
  req.checkBody('password', 'Password is required!').notEmpty();
  req.checkBody('confirm_password', 'Passwords do not match!').equals(req.body.password);

  var errors = req.validationErrors();
  if (errors){
    res.render('users/register', {
      title: 'BeatsWave - Register',
      errors: errors
    });
  }else {
    auth.createUser({
      email: email,
      password: password
    }).then(function (userData) {
      console.log('Successfully created new user wi UID: ', userData.uid);
      var user = {
        uid: userData.uid,
        email: email,
        first_name: first_name,
        last_name: last_name,
        location: location,
        fav_genres: fav_genres,
        fav_artists: fav_artists
      };
      var userRef = ref.child('users');
      userRef.push().set(user);

      req.flash('success_msg', 'You are now registered and can login.');
      res.redirect('/users/login');
    }).catch(function (error) {
      console.log('Error creating new user:', error);

      req.flash('error_msg', 'Registration Failed.');
      res.redirect('/users/register');
    });
  }
});

/* GET Login Form. */
router.get('/login', function(req, res, next) {
  res.render('users/login', {title: 'BeatsWave - Login'});
});

/* POST Login Form. */
router.post('/login', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  // Validation
  req.checkBody('email', 'Email is required!').notEmpty();
  req.checkBody('email', 'email is not valid!').isEmail();
  req.checkBody('password', 'Password is required!').notEmpty();

  var errors = req.validationErrors();
  if (errors){
    res.render('users/login', {
      title: 'BeatsWave - Login',
      errors: errors
    });
  }else {
    firebase.auth().signInWithEmailAndPassword(email, password).then(function (authData) {
     console.log('Authenticated user with:', authData);
      // firebase.auth().onAuthStateChanged(function(user) {
      //   if (user) {
      //     console.log(user.email + " is signed in");
      //   }else{
      //     console.log(user.email + " has logged out");
      //   }
      // });
      req.flash('success_msg', 'You are now logged in.');
      res.redirect('/albums');
    }).catch(function (error) {
      console.log('Login Failed due to', error);

      req.flash('error_msg', 'Login Failed.');
      res.redirect('/users/login');
    });
  }
});

/* GET Logout User. */
router.get('/logout', function(req, res, next) {
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
  }).catch(function(error) {
    // An error happened.
    console.log(error);

    req.flash('error_msg', 'Logging out Failed');
    res.redirect('/');
  });
});

module.exports = router;
