var HomeView = function (service) {

    var roomListView;
    var socket = io.connect('http://localhost:8080');

    socket.on('showingRooms', function(res) {
        roomListView.setRooms(res);
    });

    this.initialize = function() {
        this.$el = $('<div/>');
        roomListView = new RoomListView();
        this.render();
    };

    this.render = function() {
        this.$el.html(this.template());
        $('.content', this.$el).html(roomListView.$el);
        return this;
    };

    this.findByName = function() {
        service.findByName($('.search-key').val()).done(function(rooms) {
            roomListView.setRooms(rooms);
        });
    };

    this.initialize();
    socket.emit('showMeRooms');
}