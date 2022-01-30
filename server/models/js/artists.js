
var artists = {
    '1': { _id: 1,   first_name: 'George', last_name: 'Inness', dob: '1825', dod: '1894', aliases: [ 'inness' ] },
    '2': { _id: 2,   first_name: 'Edward', last_name: 'Burne-Jones', dob: '1833', dod: '1898', aliases: [ 'ebjones', 'burnejones', 'burne-jones', 'ebj', 'burne jones' ] },
    '3': { _id: 3,   first_name: 'Stanislaw', last_name: 'Maslowski' },
    '4': { _id: 4,   first_name: 'Francesco', last_name: 'Hayez' },
    '5': { _id: 5,   first_name: 'Henry', last_name: 'Fuseli' },
    '6': { _id: 6,   first_name: 'Franz', last_name: 'Kline' },
    '7': { _id: 7,   first_name: 'Eduard', last_name: 'Degas' },
    '9': { _id: 9,   first_name: 'Renzo', last_name: 'Piano' },
    '12': { _id: 12, first_name: 'Paul', last_name: 'Klee', aliases:['klee'] },
    '14': { _id: 14, first_name: 'Sandro', last_name: 'Botticelli', aliases:['botticelli'] },
    '15': { _id: 15, first_name: 'Andrew', last_name: 'Wyeth' },
    '16': { _id: 16, first_name: 'Gustav', last_name: 'Klimt', aliases:['klimt'] },
    '17': { _id: 17, first_name: 'George', last_name: 'Clausen'},
    '18': { _id: 18, first_name: 'Fernand', last_name: 'Khnopff'},
    '20': { _id: 20, first_name: 'Daniel', last_name: 'Libeskind', aliases:['libeskind']}
};


// convert to csv
// for (var i in artists) {
//     var artist=artists[i];
//     console.log([artist._id, artist.last_name, artist.first_name, artist.dob, artist.dod, artist.aliases].join(', '));
// }






module.exports = artists;

// export default artists;

