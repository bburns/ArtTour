
// Sqlite database interface for ArtTour server

'use strict';

// * require

var path = require('path');
var sqlite3 = require("sqlite3").verbose();


// * database

// open the db
var file = "../models/arttour.db";
file = path.resolve(path.join(__dirname, file)); // otherwise resolves path relative to Desktop on Windows
console.log('opening file',file);
var db = new sqlite3.Database(file);


// * test

// show tables in db
// var sql = "SELECT * FROM sqlite_master;";
// console.log(sql);
// db.all(sql, function(err, rows) {
//     console.log(err);
//     console.log(rows);
// });


// // test
// db.each("SELECT id, first_name || ' ' || last_name as firstlast FROM artists", function(err, row) {console.log(row);});
// db.close();

// // Despite the callbacks and asynchronous nature of Node.js, these transactions
// // will run in series, allowing us to create, insert, and query knowing that the
// // statement prior will run before the current one does. However, sqlite3
// // provides a "parallel" wrapper with the same interface, but runs all the
// // transactions in parallel. It just all depends on your current circumstances.
// db.serialize(function() {
//     db.each("SELECT id, first_name || ' ' || last_name as firstlast FROM artists", function(err, row) {console.log(row);});
// });



// * artworks

// options:
// artist - name of artist (partial ok)
// country - name of country
// sortby - sort option, eg oldest_first, etc

//. also filter by favs
//. handle pagination

var Artwork = {};
Artwork.get = function(options, callback) {
    
    options = options || {};
    let artist_name = options.artist || '';
    let city_name = options.city || '';
    let country_name = options.country || '';
    let tag = options.tag || '';
    let sortby = options.sortby;
    let offset = options.offset || '0';
    let limit = options.limit || '10';
    
console.log('options',options);
    
    var where = "1=1";
    if (artist_name) {where = where + ` and last_first='${artist_name}'`;}
    if (city_name) {where = where + ` and city='${city_name}'`;} //.. handle state/country also
    if (country_name) {where = where + ` and country='${country_name}'`;}
    if (tag==='favorite') {where = where + ' and favorite=1';}
    
    var orderbys = {
        'random': 'random_id',
        'artist': 'last_first',
        'oldest_first': 'year',
        'newest_first': 'year desc',
        'oldest_first_db': 'date_added',
        'newest_first_db': 'date_added desc',
    };
    var orderby = orderbys[sortby] || 'random_id'; // eg 'year desc'
    var sortfieldorder = orderby.split(' '); // eg ['year', 'desc']
    var sortfield = sortfieldorder[0]; // eg 'year'
    var sortorder = sortfieldorder[1] || ''; // eg 'desc'

var userid = 1;
    
    var sql = `select artworks.*, artists.*, locations.*, (foo.artwork_id>0) as favorite 
        from artworks
            inner join artists on (artworks.artist_id=artists.artist_id)
            inner join locations on (artworks.location_id=locations.location_id)
            left join (select artwork_id from users_favorites where user_id=${userid}) as foo on (artworks.artwork_id=foo.artwork_id)
        where ${where} 
        order by ${sortfield} ${sortorder}
        limit ${limit}+1
        offset ${offset}
        ;`; 
    
    console.log(sql);
    db.all(sql, function(err, rows) {
        console.log('error:',err);
        console.log('rows:',rows.length);
        let moreAvailable = (rows.length == Number(limit)+1);
        if (moreAvailable) {
            rows.pop(); // remove last item
        }
        callback(err, rows, moreAvailable);
    });
};

// test
// Artwork.get({}, function(err, rows) {console.log(rows);});
// db.close();


// * artists

var Artist = {};
Artist.get = function(options, callback) {
    var sql = "select * from artists order by last_first";
    // db.all(sql, function(err, rows) {callback(err, rows);});
    db.all(sql, callback);
};

// // test
// Artist.get({}, function(err, rows) {console.log(rows);});
// db.close();


// * users

var User = {};
User.get = function(options, callback) {
    var sql = "select * from users";
    db.all(sql, function(err, rows) {callback(err, rows);});
};


// * userfavorites

var UserFavorite = {};
UserFavorite.add = function(options, callback) {
    let user_id = options.user_id;
    let artwork_id = options.artwork_id;
    var sql = `insert into users_favorites (user_id, artwork_id) values (${user_id}, ${artwork_id});`;
    db.run(sql, callback);
};
UserFavorite.remove = function(options, callback) {
    let user_id = options.user_id;
    let artwork_id = options.artwork_id;
    var sql = `delete from users_favorites where user_id=${user_id} and artwork_id=${artwork_id}`;
    db.run(sql, callback);
};


// * export

module.exports.Artwork = Artwork;
module.exports.Artist = Artist;
module.exports.User = User;
module.exports.UserFavorite = UserFavorite;


