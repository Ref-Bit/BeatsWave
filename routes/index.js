var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'BeatsWave - Home' });
});

/* GET Contact page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'BeatsWave - Contact Us' });
});

/* GET 404 page. */
router.get('/*', function (req, res) {
  res.render('404', { title: 'BeatsWave - 404' });
});

module.exports = router;
