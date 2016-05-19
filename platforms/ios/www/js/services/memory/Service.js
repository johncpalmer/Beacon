var Service = function() {

    var rooms = [];
    var socket = io.connect('http://5dda101b.ngrok.io');

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
        console.log("FINDING BY ID!");
        var deferred = $.Deferred();
        var room = null;
        var l = rooms.length;
        for (var i=0; i < l; i++) {
            if (rooms[i].id === id) {
                room = rooms[i];
                console.log("SET THE ROOM!");
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

}