var PostListView = function (roomID) {


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