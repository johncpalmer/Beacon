var RoomView = function(room, service) {

	//var socket = io.connect('http://localhost:8080');
	var socket = io.connect('http://5dda101b.ngrok.io');


	socket.on('post', function(post) {
		console.log('something is being received at least');
	    console.log(post);
	    var list = $('.postList');
	    list.append("<li class='table-view-cell media'> <p class='table-view-cell'>" + post.user + ": " + post.message + "</p> </li>");
	});

	socket.on('joined', function(posts) {
        var list = $(".postList");
        for(var i = 0; i < posts.length; i++) {
        	list.append("<li class='table-view-cell media'> <p class='table-view-cell'>" + posts[i].user + ": " + posts[i].message + "</p> </li>");
        }
       });


  this.initialize = function() {
      this.$el = $('<div/>');
      this.$el.on('click', '#post-button', this.doPost);
      this.$el.on('click', '#backButton', function() {
      	console.log('Jon requested this');
      		socket.off('post');
      		socket.off('joined');
      	   $('body').html(new HomeView(service).render().$el);
      });
      this.render();
  };

  this.render = function() {
      this.$el.html(this.template(room));
      postListView = new PostListView(room.id);
      $('.list', this.$el).html(postListView.$el);
      return this;
  };

  this.doPost = function(event) {
  	event.preventDefault();
  	socket.emit('posting', {"roomid": room.id, "user": $('#name').val(), "message": $('#message').val()});
  }


  this.initialize();
  socket.emit('join', room.id);

}