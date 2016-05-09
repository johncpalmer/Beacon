var HomeView = function (service) {

    var roomListView;
    var socket = io.connect('http://localhost:8080');

    socket.on('showingRooms', function(res) {
        roomListView.setRooms(res);
    });

    this.initialize = function() {
        this.$el = $('<div/>');
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

     this.searchForBeacon = function() {
      
        console.log('searching');
        var uuid = 'b9407f30-f5f8-466e-aff9-25556b57fe6d';
        //identifier isn't actually a part of the beacon, but is sent back through the callbacks (so you know which triggered which event)
        var identifier = "testBeacon";
        var major = 46375;
        var minor = 49433;
        var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid, major, minor);
          
        var delegate = new cordova.plugins.locationManager.Delegate();
          
        //this is the function that we actually want for seeing whether or not the beacon is in range
        delegate.didDetermineStateForRegion = function(pluginResult) {
            console.log(JSON.stringify(pluginResult));
        };
        delegate.didStartMonitoringForRegion = function(pluginResult) {
            console.log(JSON.stringify(pluginResult));
        };
          delegate.didRangeBeaconsInRegion = function(pluginResult) {
            console.log(JSON.stringify(pluginResult));
        };
          
        cordova.plugins.locationManager.setDelegate(delegate);
        cordova.plugins.locationManager.requestAlwaysAuthorization();
        cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion).fail(function(e){}).done();
      
    };

    this.initialize();
    socket.emit('showMeRooms');
    this.searchForBeacon();
}