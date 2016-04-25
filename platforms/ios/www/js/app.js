// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    /* ---------------------------------- Local Variables ---------------------------------- */
    HomeView.prototype.template = Handlebars.compile($("#home-tpl").html());
    RoomListView.prototype.template = Handlebars.compile($("#room-list-tpl").html());
    RoomView.prototype.template = Handlebars.compile($("#room-tpl").html());

    var service = new EmployeeService();
    service.initialize().done(function () {
        router.addRoute('', function() {
            console.log('empty');
            $('body').html(new HomeView(service).render().$el);
        });

        router.addRoute('rooms/:id', function(id) {
            console.log('details');
            service.findById(parseInt(id)).done(function(room) {
                $('body').html(new RoomView(room).render().$el);
            });
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