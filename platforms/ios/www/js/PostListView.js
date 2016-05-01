var PostListView = function (roomID) {

    /*var posts = [
       {"id": 1, "roomid": 1, "user": "Dingus", "post": "this is one message"},
       {"id": 2, "roomid": 2, "user": "Drangus", "post": "this is the message in room 2"},
       {"id": 3, "roomid": 1, "user": "Drangus", "post": "this is the message in room 1"},
       {"id": 4, "roomid": 1, "user": "Drangus", "post": "this is the message in room 1"},
       {"id": 5, "roomid": 2, "user": "Drangus", "post": "this is the message in room 2"}
    ]; */

    this.initialize = function() {
        this.$el = $('<div/>');
        this.render();
    };

    this.setPosts = function(list) {
        posts = list;
        this.render();
    }

    this.render = function() {
        /*myPosts = posts.filter(function(element) {
            var myID = element.roomid;
            return myID === roomID;
        }); */
        this.$el.html(this.template([]));
        return this;
    };

    this.initialize();

}