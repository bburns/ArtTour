
// local cache
// this could be an in-memory db in the front-end, ~1000 museums? include latlong
// then could do joins there
// find latlongs at https://developers.google.com/maps/documentation/geocoding/intro#Geocoding
// find placeids at https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
var locations = {
    "fogg": {_id:"fogg", name:"Fogg Museum of Art", location: "Harvard University, Cambridge, Mass, United States", country: 'United States', lat: 42.374685, lng: -71.11457, placeid: "ChIJbaeXiER344kRR_f4e89EQuM"},
    "detroit": {_id:"detroit", name:"Detroit Institute of Arts", location: "Detroit, Michigan, United States", country: 'United States', lat : 42.357778, lng : -83.065556, placeid: "ChIJ7xI5r73SJIgRNG3LIOjRYxU"},
    "cracow": {_id:"cracow", name:"National Museum", location: "Cracow, Poland", country: 'Poland', lat:50.06465, lng:19.94498},
    "buscot": {_id:"buscot", name:"Buscot Park", location: "Oxfordshire, England", country: 'England', lat:51.669839, lng:-1.652811, placeid: "ChIJq2LhUeBJcUgRjPWqcFGIpNA"},
    "southampton": {_id:"southampton", name: "Southampton City Art Gallery", location:"Southampton, England", country: 'England', lat: 50.908794, lng:-1.406259},
    "tate": {_id:"tate", name: "Tate Britain", location:"London, England", country: 'England', lat:51.49202, lng:-0.128113 },
    "uffizi": {_id:"uffizi", name: "Uffizi Gallery", location:"Florence, Italy", country: 'Italy', lat:43.768518, lng:11.255539},
    "philadelphia": {_id:"philadelphia", name: "Philadelphia Museum of Art", "location": "Philadelphia, PA, United States", country: 'United States', lat:39.963802,lng:-75.176825},
    "liechtenstein": {_id:"liechtenstein", name:"Liechtenstein Museum", location: "Vienna, Austria", country: 'Austria', lat:48.2225, lng:16.359444},
    "boston": {_id:"boston", name:"Museum of Fine Arts", location: "Boston, Mass, United States", country: 'United States', lat:42.3406, lng:-71.093595},
    "moma": {_id:"moma", name:"Museum of Modern Art", location: "New York, NY, United States", country: 'United States', lat:40.761484, lng:-73.977664},
    "neue": {_id:"neue", name:"Neue Pinakothek", location: "Munich, Germany", country: 'Germany', lat:48.149722, lng:11.571111},
    "laing": {_id:"laing", name:"Laing Art Gallery", location: "Newcastle Upon Tyne, England", country: 'England', lat:54.975, lng:-1.609},
    "smith": {_id:"smith", name:"Smith Art Museum", location: "Springfield, MA, United States", country: 'United States', lat:42.103611, lng:-72.585278},
    "worcester": {_id:"worcester", name:"Worcester Art Museum", location: "Worcester, MA, United States", country: 'United States', lat:42.273007, lng:-71.802029},
    "mma": {_id:"mma", name:"Metropolitan Museum of Art", location: "New York, NY, United States", country: 'United States', lat:40.77891, lng:-73.96367},
    "delaware": {_id:"delaware", name:"Delaware Art Museum", location: "Wilmington, Delaware, United States", country: 'United States', lat:39.765, lng:-75.565},
    "reynolda": {_id:"reynolda", name:"Reynolda House Museum of American Art", location: "Winston-Salem, NC, United States", country: 'United States', lat:36.125906,lng:-80.282473},
    "stlouis": {_id:"stlouis", name:"St Louis Art Museum", location: "St Louis, Missouri, United States", country: 'United States', lat:38.639444, lng:-90.294444},
    "osterreichische": {_id:"osterreichische", name:"Osterreichische Galerie", location: "Vienna, Austria", country: 'Austria', lat:48.191389, lng:16.38},
    "vienna": {_id:"vienna", name:"Vienna Museum (Historisches Museum der Stadt Wien)", location: "Vienna, Austria", country: 'Austria', lat:48.198889, lng:16.373056},
    "staatsgalerie": {_id:"staatsgalerie", name:"Staatsgalerie Stuttgart", location: "Stuttgart, Germany", country: 'Germany', lat:48.780228, lng:9.186875},
    "leopold": {_id:"leopold", name:"Leopold Museum", location: "Vienna, Austria", country: 'Austria', lat:48.2025, lng:16.358889},
    "shard": {_id:"shard", name:"The Shard", location: "London, England", country: 'England', lat:51.5045, lng:-0.0865},
    "jewishmuseum": {_id:"jewishmuseum", name:"Jewish Museum", location: "Berlin, Germany", country: 'Germany', lat:52.502, lng:13.395}
};


// // convert to csv
// console.log('key, name, city, lat, lng');
// for (var i in locations) {
//     var location=locations[i];
//     console.log([location._id, location.name, '"'+location.location+'"', location.lat, location.lng].join(','));
// }



module.exports = locations;
