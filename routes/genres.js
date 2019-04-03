var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");

var db = admin.database();
var ref = db.ref("/");

/* GET Genres page. */
router.get('/', function(req, res, next) {
    var genreRef = ref.child('genres');
    genreRef.once("value", function (snapshot) {
        var genres = [];
        snapshot.forEach(function (childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            genres.push({
                id: key,
                name: childData.name,
            });
        });
        console.log(genres);
        res.render('genres/index', { title: 'BeatsWave - Genres', genres: genres });
    });
});

/* GET Add Genres page. */
router.get('/add', function(req, res, next) {
    res.render('genres/add', { title: 'Add Genres' });
});

/* POST Add Genres page. */
router.post('/add', function(req, res, next) {
    var genre = {
        name: req.body.name
    };
    var genreRef = ref.child('genres');
    genreRef.push().set(genre);

    req.flash('success_msg', 'Genre Added');
    res.redirect('/genres');
});

/* GET Edit Genres page. */
router.get('/edit/:id', function (req, res) {
    var id = req.params.id;
    var genreRef = ref.child('/genres/'+id);

    genreRef.once('value', function (snapshot) {
        var genre = snapshot.val();
        res.render('genres/edit', {title: 'BeatsWave - Edit Genre', genre: genre, id: id});
    });
});

/* POST Edit Genres page. */
router.post('/edit/:id', function (req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var genreRef = ref.child('/genres/'+id);

    genreRef.update({
        name: name
    });
    req.flash('success_msg', 'Changes Saved');
    res.redirect('/genres');
});

/* DELETE Single Genre as AJAX Request. */
router.post('/delete/:id', function (req, res) {
    var id = req.params.id;
    var genreRef = ref.child('/genres/'+id);

    genreRef.remove();

    req.flash('success_msg', 'Genre Removed');
    res.send(200)
});

module.exports = router;
