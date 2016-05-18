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
        if(roomList.indexOf(room) == -1) {
            console.log('when adding room it has these fields: ' + JSON.stringify(room));
            roomList.push(room);
            this.render();
        }
    };

    this.render = function() {
        console.log('HERE IS THE ROOMLIST ABOUT TO BE TEMPLATED: ' + roomList);
        for (var i=0; i<roomList.length; i++) {
            console.log(JSON.stringify(roomList[i]));
        }
        this.$el.html(this.template(roomList));
        return this;
    };

    this.initialize();


}