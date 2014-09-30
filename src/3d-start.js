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
requirejs(['lib/underscore', 'lib/three', '3d-graphics', '3d-object', 'geometry/point'],
    function Start(_, THREE, Graphics, Object, Point) {
        window.Objects = [];
        var earth = 5.972e24,
            paul = 136.078,
            sun = 1.989E30;
        window.distanceBetweenSE = 1.501e11;

        Objects.push(new Object(new THREE.Vector3(250, 250, 0), 20000, new THREE.Vector3(0, 0, 0)));
        Objects.push(new Object(new THREE.Vector3(450, 250, 0), 200, new THREE.Vector3(0, 0, -2)));
        Graphics.Start();

        //Objects.push(new Object(new Point(300, 300), 200, new Point(0,-1)));
        window.Stop = Graphics.Stop;
        window.Start = Graphics.Start;

        function pFromString(str, itp) {
            var strArr = str.split(',');
            var x = Number(strArr[0]),
                y = Number(strArr[1]);
            if (itp) {
                return new THREE.Vector2(x, y);
            } else {
                return new Point(x, y);
            }
        }
        window.testRes = function () {
            function fix(val) {
                return Math.floor(val * Math.pow(10, 10)) / Math.pow(10,10);
            }
            var min = -10000,
                max = 10000,
                p1 = new Point(0, 00),
                p2 = new Point(min, min),
                v1 = new THREE.Vector2(0, 0),
                v2 = new THREE.Vector2(min, min),
                pers = 16,
                success = true;
            for (var curX = min; curX <= max; ++curX) {
                for (var curY = min; curY <= max; ++curY) {
                    for (var curForce = min; curForce <= max; ++curForce) {
                        var fv1 = forceToForceVector(curForce, p1.angleTo(p2)),
                            fv2 = v1.clone().lerp(v2, curForce / v1.distanceTo(v2));
                        pers = (fv1.x + "").length-2;
                        if(fix(fv1.x) !== fix(fv2.x) || fix(fv1.y) !== fix(fv2.y))
                        {
                            success = false;
                            console.error("Failure, fv1 !== fv2!", p1, p2, v1, v2, curForce,  fv1, fv2);
                            console.log(fix(fv1.x), fix(fv1.y), fix(fv2.x), fix(fv2.x));
                            debugger;
                            throw "Failure, fv1 !== fv2!";
                        }
                    }
                    ++p2.y;
                    ++v2.y;
                }
                ++p2.x;
                ++v2.x;
            }
        }
        window.testPoints = function () {
            THREE.Vector2.prototype.toString = function () {
                return "" + this.x + ", " + this.y;
            }
            var p1 = pFromString(document.getElementById('p1').value),
                p2 = pFromString(document.getElementById('p2').value),
                v1 = pFromString(document.getElementById('v1').value, true),
                v2 = pFromString(document.getElementById('v2').value, true),
                force = Number(document.getElementById('force').value),
                out = "";
            out += "P1: " + p1 + " P2: " + p2 + "\n";
            out += "V1: " + v1 + " V2: " + v2 + "\n";
            out += "Force: " + force + "\n";

            var fv1 = forceToForceVector(force, p1.angleTo(p2)),
                fv2 = v1.clone().lerp(v2, force / v1.distanceTo(v2));

            out += "FV1: " + fv1 + "\n";
            out += "FV2: " + fv2 + "\n";

            document.getElementById('output').innerHTML = out;
        };
    }, function (err) {
        throw err;
    }
);