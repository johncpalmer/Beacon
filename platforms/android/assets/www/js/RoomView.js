var RoomView = function(room) {

	var socket = io.connect('http://localhost:8080');


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
      console.log('initializing');
      this.$el.on('click', '.change-pic-btn', this.searchForBeacon);
      this.$el.on('click', '#post-button', this.doPost);
      this.render();
  };
  
  this.searchForBeacon = function() {
      
      console.log('searching');
      var uuid = 'b9407f30-f5f8-466e-aff9-25556b57fe6d';
      var identifier = "testBeacon";
      var major = 46375;
      var minor = 49433;
      var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid, major, minor);
      
      var delegate = new cordova.plugins.locationManager.Delegate();
      delegate.didDetermineStateForRegion = function(pluginResult) {
          console.log(JSON.stringify(pluginResult));
      };
      delegate.didStartMonitoringForRegion = function(pluginResult) {
          //appendMessage2(JSON.stringify(pluginResult));
          console.log(JSON.stringify(pluginResult));
      };
      delegate.didRangeBeaconsInRegion = function(pluginResult) {
          //appendMessage2(JSON.stringify(pluginResult));
          console.log(JSON.stringify(pluginResult));
      };
      
      cordova.plugins.locationManager.setDelegate(delegate);
      
      cordova.plugins.locationManager.requestAlwaysAuthorization();
      
      cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion).fail(function(e){}).done();
      
  };

  this.render = function() {
      this.$el.html(this.template(room));
      postListView = new PostListView(room.id);
      $('.list', this.$el).html(postListView.$el);
      return this;
  };

  this.doPost = function(event) {
  	event.preventDefault();
    this.appendMessage2("test");
    this.searchForBeacon();
  	socket.emit('posting', {"roomid": room.id, "user": $('#name').val(), "message": $('#message').val()});
  };
  
  this.appendMessage2 = function(message) {
	    var list = $('.postList');
	    list.append("<li class='table-view-cell media'> <p class='table-view-cell'>" + message + "</p> </li>");
  };

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
  socket.emit('join', room.id);

// this is doing something weird right now. it's meant to load all messages in a room when it first gets loaded, but its making them all just post twice. doesn't even do an initial load
	/*socket.emit('join', room.id, function(posts){
        var list = $(".postList");
        for(var i = 0; i < messages.length; i++) {
        	list.append("<li class='table-view-cell media'> <p class='table-view-cell'>" + posts[i].user + ": " + posts[i].message + "</p> </li>");
        }
       });*/

}