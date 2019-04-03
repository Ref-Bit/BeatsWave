var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");
var multer = require('multer');
var upload = multer({dest: './public/images/uploads'});
var db = admin.database();
var ref = db.ref("/");

/* GET Albums page. */
router.get('/', function(req, res, next) {
    var albumRef = ref.child('albums');
    albumRef.once("value", function (snapshot) {
        var albums = [];
        snapshot.forEach(function (childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            albums.push({
                id: key,
                artist: childData.artist,
                title: childData.title,
                genre: childData.genre,
                info: childData.info,
                label: childData.label,
                tracks: childData.tracks,
                cover: childData.cover,
            });
        });
        console.log(albums);
        res.render('albums/index', { title: 'BeatsWave - Music Discography', albums: albums });
    });
});

/* GET Add Albums page. */
router.get('/add', function(req, res, next) {
    var genreRef = ref.child('genres');
    genreRef.once("value", function (snapshot) {
        var data = [];
        snapshot.forEach(function (childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            data.push({
                id: key,
                name: childData.name,
            });
        });
        console.log(data);
        res.render('albums/add', { title: 'Add Albums', genres: data });
    });
});

/* POST Add Albums page. */
router.post('/add', upload.single('cover'), function(req, res, next) {
    // Check File Upload
    if (req.file){
        console.log('Uploading File...');
        var cover = req.file.filename;
    }else {
        console.log('No File Was Uploaded...');
        var cover = 'noImage.jpg';
    }
    // Build Album Object
    var album = {
        artist: req.body.artist,
        title: req.body.title,
        genre: req.body.genre,
        info: req.body.info,
        year: req.body.year,
        label: req.body.label,
        tracks: req.body.tracks,
        cover: cover
    };
    // Create a New Collection Reference
    var albumRef = ref.child('albums');

    // Push Album
    albumRef.push().set(album);

    req.flash('success_msg', 'Album Saved');
    res.redirect('/albums');
});

/* GET Single Album page. */
router.get('/:id/details', function (req, res) {
    var id = req.params.id;
    var albumRef = ref.child('/albums/'+id);
    albumRef.once('value', function (snapshot) {
        var album = snapshot.val();
        console.log(album);
        res.render('albums/details', {title: 'BeatsWave - Album Details', album: album, id: id})
    });
});

/* GET Edit Albums page. */
router.get('/edit/:id', function (req, res) {
    var id = req.params.id;
    var albumRef = ref.child('/albums/'+id);
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
        albumRef.once('value', function (snapshot) {
            var album = snapshot.val();
            res.render('albums/edit', {title: 'BeatsWave - Edit Album', album: album, id: id , genres: genres});
        });
    });
});

/* POST Edit Albums page. */
router.post('/edit/:id', upload.single('cover'), function (req, res) {
    var id = req.params.id;
    var albumRef = ref.child('/albums/'+id);

    // Check File Upload
    if (req.file){
        // Get Cover Filename
        var cover = req.file.filename;

        //Update Album WITH Cover
        albumRef.update({
            artist: req.body.artist,
            title: req.body.title,
            genre: req.body.genre,
            info: req.body.info,
            year: req.body.year,
            label: req.body.label,
            tracks: req.body.tracks,
            cover: cover
        });
    }else {
        //Update Album WITHOUT Cover
        albumRef.update({
            artist: req.body.artist,
            title: req.body.title,
            genre: req.body.genre,
            info: req.body.info,
            year: req.body.year,
            label: req.body.label,
            tracks: req.body.tracks,
        });
    }
    req.flash('success_msg', 'Changes Saved');
    res.redirect('/albums/'+id+'/details');
});


/* DELETE Single Album as AJAX Request. */
router.post('/delete/:id', function (req, res) {
    var id = req.params.id;
    var albumRef = ref.child('/albums/'+id);

    albumRef.remove();

    req.flash('success_msg', 'Album Removed');
    res.send(200)
});

module.exports = router;
