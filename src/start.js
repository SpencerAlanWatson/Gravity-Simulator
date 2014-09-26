requirejs.config({
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        lib: '../lib',
    }
});
requirejs(['lib/underscore', 'graphics', 'object', 'geometry/point'],
    function Start(_, Graphics, Object, Point) {
        window.Objects = [];
        var ctx = document.getElementById('canvas'),
            earth = 5.972e24,
            paul = 136.078,
            sun = 1.989E30;
            window.distanceBetweenSE = 1.501e11;

        Graphics.Start(ctx);
        Objects.push(new Object(new Point(250, 250), 20000, new Point(0, 0)));
        Objects.push(new Object(new Point(350, 250), 200, new Point(0, -2)));
        //Objects.push(new Object(new Point(300, 300), 200, new Point(0,-1)));
        window.Stop = Graphics.Stop;
        window.Start = _.partial(Graphics.Start, ctx);
    }, function (err) {
        throw err;
    }
);