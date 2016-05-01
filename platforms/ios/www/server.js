'use strict';

var sqlite3 = require('sqlite3').verbose();
var db;
var db = new sqlite3.Database('beacons.db');
var check;
db.serialize(function() {

  db.run("PRAGMA foreign_keys = ON");
  db.run("CREATE TABLE if not exists chatrooms (id INT PRIMARY KEY, name TEXT)");
  db.run("CREATE TABLE if not exists posts (id INT PRIMARY KEY, roomid INT, message TEXT, user TEXT, FOREIGN KEY(roomid) REFERENCES chatrooms(id))");

  /*var stmt = db.prepare("INSERT INTO chatrooms VALUES (?, ?)");
  for (var i = 11; i < 20; i++) {
      stmt.run(i, "test" + i);
  }
  stmt.finalize();*/

  db.each("SELECT rowid AS id, name FROM chatrooms", function(err, row) {
      console.log(row.id + ": " + row.name);
  });
});

db.close();

const Hapi = require('hapi');
const Good = require('good');

const server = new Hapi.Server();
server.connection({ port: 3000 });

server.register(require('inert'), (err) => {

    if (err) {
        throw err;
    }

    server.route({
        method: 'GET',
        path: '/hello',
        handler: function (request, reply) {
            reply.file('./index.html');
        }
    });
});


// comment the below block and uncomment the others to go back to serving the static html pages
/*server.register({
    register: Good,
    options: {
        reporters: [{
            reporter: require('good-console'),
            events: {
                response: '*',
                log: '*'
            }
        }]
    }
}, (err) => {

    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start((err) => {

        if (err) {
           throw err;
        }
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});

server.route({
    method: 'GET',
    path: '/{name}',
    handler: function (request, reply) {
        reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
    }
});*/

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
