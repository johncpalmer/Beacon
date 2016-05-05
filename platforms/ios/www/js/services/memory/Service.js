var Service = function() {

    var rooms;
    var socket = io.connect('http://localhost:8080');

    socket.on('allRooms', function(allRooms) {
        console.log('getting all rooms');
        rooms = allRooms;
    });

    this.initialize = function() {
        // No Initialization required
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
    }

    this.findById = function(id) {
        var deferred = $.Deferred();
        var room = null;
        var l = rooms.length;
        for (var i=0; i < l; i++) {
            if (rooms[i].id === id) {
                room = rooms[i];
                break;
            }
        }
        deferred.resolve(room);
        return deferred.promise();
    }

    this.getRooms = function() {
        socket.emit('getAllRooms');
    }

    this.findByName = function(searchKey) {
        var deferred = $.Deferred();
        var results = rooms.filter(function(element) {
            var fullName = element.name;
            return fullName.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
        });
        deferred.resolve(results);
        return deferred.promise();
    }

    // var posts = [
    //    {"id": 1, "roomid": 1, "user": "Dingus", "post": "this is one message"},
    //    {"id": 2, "roomid": 2, "user": "Drangus", "post": "this is the message in room 2"}
    // ];

}