// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    /* ---------------------------------- Local Variables ---------------------------------- */
    HomeView.prototype.template = Handlebars.compile($("#home-tpl").html());
    RoomListView.prototype.template = Handlebars.compile($("#room-list-tpl").html());
    RoomView.prototype.template = Handlebars.compile($("#room-tpl").html());
    PostListView.prototype.template = Handlebars.compile($("#post-list-tpl").html());

    var service = new Service();
    service.getRooms();
    service.initialize().done(function () {

        router.addRoute('*', function() {
            console.log('* is the route');
            $('body').html(new HomeView(service).render().$el);
        });

        router.addRoute('rooms/:id', function(id) {
            console.log('details');
            console.log('ROUTING FUNCTIONAL');
            service.findById(parseInt(id)).done(function(room) {
                console.log("FOUND ROOM HERE");
                $('body').html(new RoomView(room, service).render().$el);
            });
        });

        router.addRoute('', function() {
            console.log('empty is the route');
            $('body').html(new HomeView(service).render().$el);
        });

        router.start();
    });

    /* --------------------------------- Event Registration -------------------------------- */
    document.addEventListener('deviceready', function () {
        StatusBar.overlaysWebView( false );
        StatusBar.backgroundColorByHexString('#ffffff');
        StatusBar.styleDefault();
        FastClick.attach(document.body);
        if (navigator.notification) { // Override default HTML alert with native dialog
            window.alert = function (message) {
                navigator.notification.alert(
                    message,    // message
                    null,       // callback
                    "Workshop", // title
                    'OK'        // buttonName
                );
            };
        }
    }, false);

    /* ---------------------------------- Local Functions ---------------------------------- */

}());