
var dbfile = './arttour2.db';


var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: dbfile
  }
});










