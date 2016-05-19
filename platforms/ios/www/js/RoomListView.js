var RoomListView = function (service) {

    var thisService = service;
    var roomList = [];

    this.initialize = function() {
        this.$el = $('<div/>');
        this.render();
    };

    this.setRooms = function(list) {
        roomList = list;
        this.render();

        for(var i=0; i<roomList.length; i++) {
            var currRoom = roomList[i].id;
            this.$el.on('click', '#room'+currRoom, function() {
                $('body').html(new RoomView(roomList[i], thisService).render().$el);
            });
        }
    };

    this.addRoom = function(room) {
        if(roomList.indexOf(room) == -1) {
            console.log('when adding room it has these fields: ' + JSON.stringify(room));
            roomList.push(room);
            this.render();
        }

        this.$el.on('click', '#room'+room.id, function() {
                $('body').html(new RoomView(room, thisService).render().$el);
            });
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