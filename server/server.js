//Lets require/import the HTTP module
var http = require('http'),
	express = require('express'),
	bodyParser = require('body-parser'),
	app = express(),
	fs = require('fs'),
	anyDB = require('any-db'),
	conn = anyDB.createConnection('sqlite3://beacons.db'),
	server = http.createServer(app);
	console.log(server);

	var io = require('socket.io').listen(server)

// create table for the rooms
conn.query('CREATE TABLE IF NOT EXISTS chatrooms (id INTEGER PRIMARY KEY AUTOINCREMENT, roomName TEXT, major INTEGER, minor INTEGER)')
	.on('end', function(){
		console.log('Made table!');
		conn.end();
	});

// create table for the messages
conn.query('CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, roomid INTEGER, user TEXT, message TEXT, FOREIGN KEY(roomid) REFERENCES chatrooms(id))')
	.on('end', function(){
		console.log('Made table!');
		conn.end();
	});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


// list chatrooms
app.get("/:roomname/messages", function(req,res) {
	var q = conn.query('SELECT * FROM posts WHERE roomid=($1)', roomname, function(err,result) {
		if(err) {
			console.log(err);
			res.end();
		}
		res.json(result.rows);
	});
});
/* configure the files (don't think i need this unless server will be supplying any files. Most files will be on the app native to the phone.)
app.configure(function() {
	app.use(express.static(__dirname + "/static"));
}); */ 

// Setting up the socket and its event listeners
io.sockets.on('connection', function(socket){

	// clients emit this when they join new rooms
    socket.on('join', function(roomid){
        socket.join(roomid);
        socket.roomid = roomid;

        conn.query("SELECT * FROM posts WHERE roomid=($1)", roomid,
			function(err, result) {
			if(err) {
				console.log(err);
				return;
			}
		socket.emit('joined', result.rows);
		});
	});

    // the client emits this when they want to send a message
    socket.on('posting', function(post){
        conn.query("INSERT INTO posts (roomid, user, message) VALUES ($1, $2, $3)",
		[post.roomid, post.user, post.message], function(err,result) {
			conn.query("SELECT * FROM posts WHERE roomid=$1 and user=$2 and message=$3", 
			[post.roomid, post.user, post.message], function(err,result) {
				if(err) {
					console.log(err);
					return;
				} else {
					console.log(result.rows[0]);
					console.log(post.roomid);
					io.sockets.in(post.roomid).emit('post',result.rows[0]);
					//socket.emit('post',result.rows[0]);
				}
			});   
		});
    });

    socket.on('showMeRooms', function() {
    	conn.query("SELECT * FROM chatrooms", function(err,result) {
    		if(err) {
    			console.log(err);
    			return;
    		} else {
    			console.log("about to log rooms on server side");
    			socket.emit('showingRooms', result.rows);
    		}
    	});
    });

    socket.on('getAllRooms', function() {
    	conn.query("SELECT * FROM chatrooms", function(err,result) {
    		if(err) {
    			console.log(err);
    			return;
    		} else {
    			console.log("about to log rooms on server side");
    			socket.emit('allRooms', result.rows);
    		}
    	});
    });

    socket.on('validateRoom', function(pluginResult) {
    	conn.query("SELECT * FROM chatrooms WHERE major=($1) AND minor=($2)", 
    		[pluginResult.region.major, pluginResult.region.minor], function(err, result) {
    			if(err) {
    				console.log(err);
    			} else {
    				console.log('valid room: ' + JSON.stringify(result.rows[0]));
    				socket.emit('validatedRoom', result.rows[0]);
    			}
    		});
    	// query database for major and minor
    	// check to make sure valid or not
    	// if valid
    	// socket.emit('validatedRoom', result.rows[0]);
    	// else
    	// socket.emit('notValid')
    });

});

server.listen(8080);