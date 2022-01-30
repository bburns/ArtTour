
// Json object interface for ArtTour server
// (this was for prototyping and is obsolete)

'use strict';

// * require

var fs = require('fs');

var m_users = require('../models/users.js');
var m_artists = require('../models/artists.js');
var m_artworks = require('../models/artworks.js');
var m_locations = require('../models/locations.js');

var db = {};

// * lib

let nextId = function(objs) {
    let keys = Object.keys(objs);
    let max = Math.max.apply(null, keys);
    if (max<0) max=0;
    return max + 1;
};
// console.log(nextId({}));


// * artist

db.Artist = {};
db.Artist.get = function(options) {
    //. replace with sql query, then knex
    //. order by lastname + firstname
    return m_artists;
};

// these work but commenting out till need for upload fns

// // find exact match for given artist name
// db.Artist.find = function(searchName) {
//     //. replace with sql query, then knex
//     let keys = Object.keys(m_artists);
//     for (let key of keys) {
//         let artist = m_artists[key];
//         let artistName = (artist.first_name + ' ' + artist.last_name).toLowerCase();
//         // if (searchName.toLowerCase() == artist.name.toLowerCase()) {
//         if (searchName.toLowerCase() == artistName) {
//             return artist;
//         }
//         if (artist.aliases) {
//             for (let alias of artist.aliases) {
//                 if (searchName.toLowerCase() == alias.toLowerCase()) {
//                     return artist;
//                 }
//             }
//         }
//     }
//     return undefined;
// };

// db.Artist.getAdd = function(searchName) {
//     // create a new artist if doesn't exist
//     let artist = this.find(searchName);
//     if (!artist) {
//         artist = {};
//         //... split name
//         artist.name = searchName;
//         artist = db.Artist.add(artist);
//     }
//     return artist;
// };

// db.Artist.add = function(artist) {
//     let id = nextId(m_artists);
//     artist._id = id;
//     m_artists[id] = artist;
//     console.log('added artist ' + artist.first_name + ' ' + artist.last_name);
//     return artist;
// };


// * artwork

// options:
// artist - name of artist (partial ok)
// country - name of country
// sortby - sort option, eg oldest_first, etc

//. don't allow partial name matches?
//. also filter by favs
//. handle pagination

db.Artwork = {};
db.Artwork.get = function(options) {
    
    options = options || {};
    let artist_name = options.artist || '';
    let country_name = options.country || '';
    let sortby = options.sortby;
    
    let reArtist = new RegExp(artist_name, 'i'); // case-insensitive regexp
    let artworksNew = [];
    
    let artworkKeys = Object.keys(m_artworks);
    for (let key of artworkKeys) {
        let artwork = m_artworks[key];
        
        // join with artist table
        // '1': { _id: 1,   first_name: 'George', last_name: 'Inness', dob: '1825', dod: '1894', aliases: [ 'inness' ] },
        var artist = m_artists[artwork.artist_id];
        artwork.artist_first_name = artist.first_name;
        artwork.artist_last_name = artist.last_name;
        artwork.artist_last_first = artist.last_name + ', ' + artist.first_name;
        
        // join with location table
        var location = m_locations[artwork.location_id];
        artwork.location_name = location.name;
        artwork.location_location = location.location; //. confusing
        artwork.location_country = location.country;
        artwork.location_lat = location.lat;
        artwork.location_lng = location.lng;
        
        // add artwork to list if fits criteria
        let matchArtist = (options.artist) ? reArtist.test(artwork.artist) : true;
        let matchCountry = (options.country) ? (artwork.location_country===country_name) : true;
        if (matchArtist && matchCountry) {
            artworksNew.push(artwork);
        }
    }
    
    // now sort
    switch (sortby) {
        case 'random':
        artworksNew.sort(function(a, b) {return a.random_id - b.random_id;});
        break;
        
        case 'title':
        artworksNew.sort(function(a, b) {return a.title.localeCompare(b.title);});
        break;
        
        case 'artist':
        artworksNew.sort(function(a, b) {return a.artist_last_first.localeCompare(b.artist_last_first);});
        break;
        
        case 'oldest_first':
        // sort the artworksNew list by artwork.year
        artworksNew.sort(function(a, b) {return a.year - b.year;});
        break;
        
        case 'newest_first':
        artworksNew.sort(function(a, b) {return b.year - a.year;});
        break;
        
        case 'oldest_first_db':
        artworksNew.sort(function(a, b) {return a.dateAdded - b.dateAdded;});
        break;
        
        case 'newest_first_db':
        artworksNew.sort(function(a, b) {return b.dateAdded - a.dateAdded;});
        break;
    }
    
    return artworksNew;
};


// these work but commenting out until need upload fns

// db.Artwork.add = function(artwork) {
//     let id = nextId(m_artworks);
//     artwork._id = id;
//     m_artworks[id] = artwork;
//     return artwork;
// };

// db.Artwork.clear = function() {
//     m_artworks = {};
// };

// db.Artwork.export = function(filename) {
//     let s = '// this file is generated by scripts/import.js\n\n';
//     s += 'var artworks = {\n';
//     let keys = Object.keys(m_artworks);
//     for (let i = 0; i < keys.length; i++) {
//         let key = keys[i];
//         let artwork = m_artworks[key];
//         s = s + '"' + key + '": ' + JSON.stringify(artwork);
//         if (i<keys.length-1) s = s + ', \n';
//     }
//     s = s + '};\n\n';
//     s = s + 'module.exports = artworks;\n';
//     fs.writeFileSync(filename, s);
//     console.log('wrote ' + keys.length + ' artworks to ' + filename);
// };


// // db.Artwork.export('foo.js');


// * location

// used by import.js

db.Location = {};
db.Location.get = function(options) {
    return m_locations;
};

//. could make location.words a set for more speed
let countMatches = function(words1, words2) {
    let nmatches = 0;
    for (let word1 of words1) {
        for (let word2 of words2) {
            if (word1.toLowerCase()==word2.toLowerCase()) {
                nmatches++;
                break;
            }
        }
    }
    return nmatches;
};

// find location object using first word as the location key
db.Location.find = function(s) { // eg 'mass, boston, mfa'
    let words = s.toLowerCase().replace(/,/g,'').split(' ');
    // let bestmatches = 0;
    // let bestlocation = undefined;
    // for (let key in m_locations) {
    //     let location = m_locations[key];
    //     let locationwords = location.words || [];
    //     locationwords.push(location._id); // so can just match on key, eg 'fogg'
    //     let nmatches = countMatches(locationwords, words);
    //     if (nmatches > bestmatches) {
    //         bestmatches = nmatches;
    //         bestlocation = location;
    //     }
    // }
    // if (!bestlocation) console.log('db.Location.find: unable to find ' + s);
    // return bestlocation;
    var key = words[0];
    var location = m_locations[key];
    if (!location) console.log('db.Location.find: unable to find ' + s);
    return location;
};

// console.log(db.Location.get());
// console.log(db.Location.find('mfaboston'));
// console.log(db.Location.find('fogg'));


// * export

module.exports = db;
