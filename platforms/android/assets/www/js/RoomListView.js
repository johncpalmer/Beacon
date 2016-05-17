var RoomListView = function () {

    var roomList = [];

    this.initialize = function() {
        this.$el = $('<div/>');
        this.render();
    };

    this.setRooms = function(list) {
        roomList = list;
        this.render();
    };

    this.addRoom = function(room) {
        roomList.push(room);
        this.render();
    };

    this.render = function() {
        console.log(roomList);
        this.$el.html(this.template(roomList));
        return this;
    };

    this.initialize();


}