var RoomView = function(room) {

  this.initialize = function() {
      this.$el = $('<div/>');
      this.$el.on('click', '.change-pic-btn', this.changePicture);
      this.$el.on('click', '#post-button', this.doPost);
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
  	posts.push({"id": 0, "roomid": room.id, "user": "Testerboy", "post": "a posted message!"});
  	postListView.setRooms(posts);
  }

  this.changePicture = function(event) {
	  event.preventDefault();
	  if (!navigator.camera) {
	      alert("Camera API not supported", "Error");
	      return;
	  }
	  var options =   {   quality: 50,
	                      destinationType: Camera.DestinationType.DATA_URL,
	                      sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Album
	                      encodingType: 0     // 0=JPG 1=PNG
	                  };

	  navigator.camera.getPicture(
	      function(imgData) {
	          $('.media-object', this.$el).attr('src', "data:image/jpeg;base64,"+imgData);
	      },
	      function() {
	          alert('Error taking picture', 'Error');
	      },
	      options);

	  return false;
	};

  this.initialize();

}