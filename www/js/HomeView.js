var HomeView = function (service) {

    var roomListView;
    var socket = io.connect('http://localhost:8080');
    var beaconList = [];
    var beaconInfo = [{major: 23507, minor: 36541, identifier: 'b1'},
                        {major: 25701, minor: 659, identifier: 'b2'},
                        {major: 64771, minor: 32009, identifier: 'b3'}];

    var globaluuid = 'b9407f30-f5f8-466e-aff9-25556b57fe6d';

    this.initBeacons = function() {
        console.log(beaconInfo);
        for (x in beaconInfo) {
            var beacon = beaconInfo[x];
            console.log('BEACON: ' + beacon);
            var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(beacon.identifier, globaluuid, beacon.major, beacon.minor);
            beaconList.push(beaconRegion);
        }
        console.log(beaconList);
    };

    socket.on('showingRooms', function(res) {
        roomListView.setRooms(res);
    });

    socket.on('validatedRoom', function(res) {
        roomListView.addRoom(res);
    });

    this.initialize = function() {
        this.$el = $('<div/>');
        roomListView = new RoomListView();
        this.initBeacons();
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
        var major = 23507;
        var minor = 36541;

        var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid, major, minor);
        var delegate = new cordova.plugins.locationManager.Delegate();
        
        //this is the function that we actually want for seeing whether or not the beacon is in range
        delegate.didDetermineStateForRegion = function(pluginResult) {
            console.log('DETERMINESTATE');
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

    this.determineBeaconStates = function() {
        console.log('searching for beacon states');

        var delegate = new cordova.plugins.locationManager.Delegate();
        
        //this is the function that we actually want for seeing whether or not the beacon is in range
        delegate.didDetermineStateForRegion = function(pluginResult) {
            console.log('DETERMINESTATE');
            console.log(JSON.stringify(pluginResult));
            if(pluginResult.state == "CLRegionStateInside") {
                socket.emit('validateRoom', pluginResult);
            }
        };
        delegate.didStartMonitoringForRegion = function(pluginResult) {
            console.log(JSON.stringify(pluginResult));
        };
          delegate.didRangeBeaconsInRegion = function(pluginResult) {
            console.log(JSON.stringify(pluginResult));
        };
          
        cordova.plugins.locationManager.setDelegate(delegate);
        cordova.plugins.locationManager.requestAlwaysAuthorization();
        for (x in beaconList) {
            var bRegion = beaconList[x];
            cordova.plugins.locationManager.startMonitoringForRegion(bRegion).fail(
                function(e){
                    console.log(JSON.stringify(e));
                }).done();
        }
        console.log('searching Has begun');
    };

    this.initialize();
    socket.emit('showMeRooms');
    this.determineBeaconStates();
    // ERROR: cordova not defined ???
}