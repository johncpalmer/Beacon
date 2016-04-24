var RoomListView = function () {

    var rooms;

    this.initialize = function() {
        this.$el = $('<div/>');
        this.render();
    };

    this.setRooms = function(list) {
        rooms = list;
        this.render();
    }

    this.render = function() {
        this.$el.html(this.template(rooms));
        return this;
    };

    this.initialize();

}