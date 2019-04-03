var express = require('express');
var router = express.Router();

/* GET Register Form. */
router.get('/register', function(req, res, next) {
  res.render('users/register');
});

/* GET Login Form. */
router.get('/login', function(req, res, next) {
  res.render('users/login');
});

module.exports = router;
