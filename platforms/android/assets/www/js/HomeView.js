var HomeView = function (service) {

    var roomListView;

    this.initialize = function() {
        this.$el = $('<div/>');
        this.$el.on('keyup', '.search-key', this.findByName);
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
}