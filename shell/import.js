// Import artworks
// Parse image filename into metadata, add to a new models/artworks.js file.

'use strict';

// var testing = true; // don't copy any files or overwrite existing artworks.js file
var testing = false; 

// * about

// walk through a folder, importing image files as artworks
// try to parse filename into metadata
// generate a json file
// which can paste into db.js
// js highlighter beats the json one

// "!@@@pose dragon tosee art ebjones 1884 Perseus The Doom Fulfilled - england, southampton, city art gallery.jpg"
// =>
// tags = !, @@@, pose, dragon, tosee, art
// artist = ebjones -> "Edward Burne-Jones"
// year = 1884
// title = "Perseus The Doom Fulfilled"
// location = "england, southampton, city art gallery"
// =>
// "edward_burne-jones_1884_perseus_the_doom_fulfilled.jpg"


// * todo

//. generate different size thumbnails - gallery normalized, gallery scaled, zoomin, small for map
//. some of this can be adapted for eventual upload/scrape fns
//. also add/update the artist.js file/db, and locations.js file


// * lib

let fs = require('fs');
let path = require('path');
let sizeOf = require('image-size');
let rimraf = require('rimraf'); // for rm -rf - see https://github.com/isaacs/rimraf

// copy a file
// see http://stackoverflow.com/questions/11293857/fastest-way-to-copy-file-in-node-js
let copyFile = function(sourcefile, destfile) {
console.log('copy ' + sourcefile + ' to ' + destfile);    
    fs.writeFileSync(destfile, fs.readFileSync(sourcefile));
    // fs.createReadStream(sourcefile).pipe(fs.createWriteStream(destfile)); // async
};


// * db, tags, aliases, files

let db = require('../server/src/db-json');

// add tags here as they're encountered, to remove them from the artist name
//. make a set for speed
let m_tags = ['tosee','art','painting','compos','colors','values','arch','pose','dragon','topost','tshirt',
            'poster','skin','toavatar','avatar','lookup','travel','romance','topaint','artstyle','inspir','abstract',
            'wallpaper','water','portrait','bg','armor','style','myth','vid'];

let sourceFolder = "c:/projects/arttour/tosee/"; // on dropbox
let destFolder = "./client/assets/images/";
let existingFile = './models/artworks.js';
let exportFile = 'artworks_imported.js';


// not used
// let m_aliases = {
//     'museum of fine arts': 'mfa'
//     };


// * getstars

// get leading ! and @ from a string
var getStars = function(s) {
    let re = /^[!@]*/;
    let match = re.exec(s);
    let stars = '';
    if (match) {
        stars = match[0];
    }
    return stars;
};


// * getyear

// get year(s) from filename
var getYear = function(s) {
    let re = /[ ](\d\d\d\d(-\d\d)?|~)[ ]/; // eg 1885-86 or ~
    let match = re.exec(s);
    let year;
    if (match) {
        let matchtext = match[0].trim();
        let matchpos = match.index;
        year = matchtext;
    } else {
        //. try splitting on first '-'
    }
    return year;
};


// * gettags

// get recognized tags from first part of filename
// return tags and nontags parts
var getTags = function(s) {
    let words = s.split(' ');
    let tags = '';
    let nontags = '';
    for (let word of words) {
        let found = false;
        word = word.trim();
        for (let tag of m_tags) {
            if (word==tag) {
                found = true;
                break;
            }
        }
        if (found)
            tags = tags + ' ' + word;
        else
            nontags = nontags + ' ' + word;
    }
    tags = tags.trim();
    nontags = nontags.trim();
    return [tags, nontags];
};


// * gettitle

// get title of artwork
// return title and the rest of the string
var getTitle = function(s) {
    let split = s.split(' - '); // separated from location by dash
    let title = split[0].trim();
    let rest = split[1];
    if (rest) rest = rest.trim();
    return [title, rest];
};


// * getdimensions

// get dimensions of artwork, if there
// return dimensions and string with dimensions removed
var getDimensions = function(s) {
    let re = /[ ]\d\d?\d?x\d\d?\d(in|cm)?[ ]?/; // eg 25x20cm
    let match = re.exec(s);
    let dims = '';
    if (match) {
        dims = match[0].trim();
        s = s.split(dims).join(' ');
    }
    return [dims, s];
};


// * getartist

// get name of artist if in db, else add him
let getArtist = function(s) {
    // check our list of artists if he exists
    let artist = db.Artist.getAdd(s);
    return artist;
};


// * parsefilename

// parse an image filename and return it as an artwork object, or undefined if can't parse
let parseFilename = function(filename) {
    
    // remove extension
    let s = filename;
    s = path.parse(s).name; 
    
    // get leading ! and @
    let stars = getStars(s);
    s = s.slice(stars.length); // remove stars
    
    // get year
    let year = getYear(s);
    if (!year) return undefined; // give up if no year
    let split = s.split(year);
    let firstpart = split[0];
    let lastpart = split[1];
    
    // get tags
    let r = getTags(firstpart);
    let tags = r[0];
    firstpart = r[1];
    
    // get artist
    let artist = getArtist(firstpart);
    
    // get dimensions
    r = getDimensions(lastpart);
    let dims = r[0];
    lastpart = r[1];

    // get title
    r = getTitle(lastpart);
    let title = r[0];
    lastpart = r[1];
    
    // get location
    let location_id = undefined;
    let location_name = lastpart;
    if (location_name) {
        let location = db.Location.find(location_name); // will print error message if can't find
        if (location) {
            location_id = location._id;
            location_name = location.name + ', ' + location.location;
        }
    }
    
    let artwork = {
        stars: stars,
        tags: tags,
        artist_id: artist._id,
        artist: artist.name,
        year: year,
        title: title,
        dims: dims,
        location_id: location_id,
        location: location_name
    };
    
    return artwork;
};


// * importimagefile

// import an imagefile as an artwork object, adding it to the database
let importImageFile = function(filename) {
    // only import files with leading !
    if (filename[0]!='!') return undefined;
    let artwork = parseFilename(filename);
    if (artwork) {
        artwork = db.Artwork.add(artwork);
    } else {
        console.log('Unable to parse filename: ' + filename);
    }
    return artwork;
};


// let getImageDimensions = function(artwork, filename) {
//     artwork.imageDimensions = [x,y];
//     return artwork;
// };


// * generatefilename

// generate a canonical filename for the given artwork
//. make a method
let generateCanonicalFilename = function(artwork) {
    let filename = artwork.artist + ' ' + artwork.year + ' ' + artwork.title + '.jpg';
    filename = filename.replace(/ /g, '_');
    return filename;
};


// * do import and export db

// import folder of image files as artworks to database
// need to manually delete contents of /app/assets/images before import
// exports list to replace /app/assets/scripts/data/artworks.js

db.Artwork.clear();

let filenames = fs.readdirSync(sourceFolder);
// rimraf.sync(destFolder); // clear the dest folder
// fs.mkdirSync(destFolder);
for (let filename of filenames) {
    let artwork = importImageFile(filename);
    if (artwork) {
        let newname = generateCanonicalFilename(artwork);
        artwork.image = newname;
        let dims = sizeOf(sourceFolder + filename);
        artwork.imageHeight = dims.height;
        artwork.imageWidth = dims.width;
        if (!testing) 
            copyFile(sourceFolder + filename, destFolder + newname);
    }
}
// console.log(db.Artwork.get());
// console.log(db.Artist.get());

// export to file in this folder - see server/db.js for code
db.Artwork.export(exportFile);

if (!testing) {
    // backup existing artworks.js file and copy new one over it
    copyFile(existingFile, existingFile + '.backup');
    copyFile(exportFile, existingFile);
    console.log('wrote ' + existingFile);
}

// eof
