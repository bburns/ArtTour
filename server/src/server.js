
// Server for arttour

'use strict';

// * require

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('express-jwt');

//. keep elsewhere?
// eg var auth0secret = process.env.AUTH0_CLIENT_SECRET;
var auth0secret = 'HTqL_HR72gtNKuH6BJnICzgxMRKMhkZJYTYpc6Z4-YbYj9p3wpucpR_dbQB3z9yK';
var secretBuffer = new Buffer(auth0secret, 'base64');


// * database

// load data from one of the db models
// var db = require('./db-json');
// var db = require('./db-knex');
var db = require('./db-sqlite');


// * server

var app = express();
app.set('port', (process.env.PORT || 4000));


// * middleware

// app.use(morgan('dev')); // log every request to the console

// function isAuthorized(req, res, next) {
//     if (!req.session.userid) {
//         res.send('You are not authorized to view this page');
//     } else {
//         next();
//     }
// }


app.use('/', express.static(path.join(__dirname, '../../client/public'))); // serve static files
app.use(bodyParser.json()); // get information from html forms (json encoded)
app.use(bodyParser.urlencoded({extended: true})); // parse url-encoded parameters - extended allows encoding of rich objects and arrays


// additional middleware which will set headers that we need on each request.
//. do we need this? 
app.use(function(req, res, next) {
    // set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server
    res.setHeader('Access-Control-Allow-Origin', '*');
    // disable caching so we'll always get the latest data
    res.setHeader('Cache-Control', 'no-cache');
    next();
});



// * artworks

// filter and sort data according to request query parameters
// call with things like GET /artworks?artist=inness&country=united_states&tag=favorite&sort=oldest_first&offset=20&limit=10
app.get('/artworks', function(req, res) {
    console.log('req.query: ', req.query);
    var artist = req.query.artist;
    var country = req.query.country;
    var city = req.query.city;
    var tag = req.query.tag;
    var sortby = req.query.sort;
    var offset = req.query.offset;
    var limit = req.query.limit;
    db.Artwork.get({artist, city, country, tag, sortby, offset, limit}, function(err, artworks, moreAvailable) {
        // console.log(rows[0]);
        // console.log('rows:',rows.length);
        // this converts data to a json string, which the client will then turn back into an object
        res.json({artworks, moreAvailable});
    });
});


// * artists

// used by the artist dropdown
// db sorts it by lastfirstname
app.get('/artists', function(req, res) {
    db.Artist.get({}, function(err, rows) {
        res.json(rows);
    });
});


// * countries

// don't really want another ajax call just to get a list of countries - just store in the frontend?
//. though could eventually have the server generate a js file that the front-end could build into app.js
// // countries endpoint
// // used by the country dropdown
// //. return a list of objects like {id, lastfirst, firstlast}
// app.get('/artists', function(req, res) {
//     var artists = db.Artist.get();
//     // // sort alphabetically
//     // artists.sort(function (a, b) {
//     //     if (a.lastfirst > b.lastfirst) {return 1;}
//     //     if (a.lastfirst < b.lastfirst) {return -1;}
//     //     return 0;
//     // });
//     res.json(artists);
// });


// * favorites

// create a generic response function that takes an error code
// and returns the given message on OK
const responsefn = function(res, msg) {
    return function(err) {
        if (err) {
            res.status(400).json({status:400, data:null, message:'error'});
        }
        res.status(200);
        res.json({status:200, data:null, message:msg});
    };
};


app.route('/users/:user_id/favorites/:artwork_id')
// .all(jwt({secret: secretBuffer}))
.post(function(req, res) {// add a favorite
    // console.log(req.params.user_id, req.params.artwork_id);
    // console.log('req.user',req.user); //. could/should include email
    let options = {user_id: req.params.user_id, artwork_id: req.params.artwork_id};
    db.UserFavorite.add(options, responsefn(res, 'added'));
})
.delete(function(req, res) {// remove a favorite
    let options = {user_id: req.params.user_id, artwork_id: req.params.artwork_id};
    db.UserFavorite.remove(options, responsefn(res, 'removed'));
});



// * login/logout


// // login endpoint
// // this is called from the login.html form
// app.post('/auth', function(req, res) {
    
//     // get username and password
//     var username = req.body.username;
//     var password = req.body.password;
//     // res.write('username ' + username + '\n');
//     // res.write('pw ' + password +'\n');
//     // res.end();
    
//     //. lookup the user in the users dictionary, check password (hashed), get userid
//     var userid = 1;
    
//     // create jwt token
//     //. respond with 200 ok and {'access-token': <jwt token>}
//     // or 400/500 error invalid login, try again

//     //. client will store the jwt token in local storage, and send it along with every request,
//     // in Authorization: Bearer header item
//     // that way will know which userid to include in the api requests, eg to get favorites.
    
//     res.redirect('/');
// });


// // logout endpoint
// app.get('/logout', function (req, res) {
//     // delete the userid from the session object and return to home page
//     delete req.session.userid;
//     res.redirect('/');
// });    


// * start

app.listen(app.get('port'), function() {
    console.log(Date() + ' - Server started: http://localhost:' + app.get('port') + '/');
});


// eof
