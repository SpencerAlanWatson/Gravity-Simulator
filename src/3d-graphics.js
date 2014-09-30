define(['lib/underscore', 'lib/three', 'force', 'object'], function (_, THREE, ForceObj, Object) {
    var tickLast,
        gl,
        animId, forceTimeoutId,
        canvasSize = new THREE.Vector2(500, 500),
        scene, camera, renderer,
        o1, o2;

    window.beforeForce = true;

    function clearCanvas(ctx) {
        ctx.clearRect(0, 0, canvasSize.x, canvasSize.y);

    }

    function drawCanvas(ctx, List) {
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        var first = true;
        _.each(List, function (object) {
            ctx.beginPath();

            object.Draw(ctx);
            ctx.fill();

            /*if (first) {
            first = false;
            ctx.moveTo(object.position.x, object.position.y);
        } else {
            ctx.lineTo(object.position.x, object.position.y);
        }*/

        });

    }

    function GraphicsLoopOld(tickNow) {
        animId = requestAnimationFrame(GraphicsLoop);
        var tickDelta = tickNow - tickLast;
        if (!tickLast) {
            tickDelta = 0;
        }
        clearCanvas(ctx);
        if (window.beforeForce) {
            drawCanvas(ctx, Objects);
            ForceObj.ForceLoop(Objects, tickDelta);
        } else {
            ForceObj.ForceLoop(Objects, tickDelta);

            drawCanvas(ctx, Objects);
        }
        tickLast = tickNow;

    }

    function GraphicsLoop(tickNow) {
        animId = requestAnimationFrame(GraphicsLoop);
        //o1.position.copy(Objects[0].position);
        //o2.position.copy(Objects[1].position);
        var tickDelta = tickNow - tickLast;
        if (!tickLast) {
            tickDelta = 0;
        }

        ForceObj.ForceLoop(Objects, tickDelta);

        renderer.render(scene, camera);
                tickLast = window.performance.now();

    }

    function forceLoopRunner() {
        var tickNow = window.performance.now(),
            tickDelta = tickNow - tickLast;
        if (!tickLast) {
            tickDelta = 0;
        }
        ForceObj.ForceLoop(Objects, tickDelta);
        timeoutId = setTimeout(forceLoopRunner, 0);
        tickLast = tickNow;
    }

    function initWebGL(canvas) {
        var gl = null;
        try {
            gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        } catch (e) {
            console.error(e);
        }

        if (!gl) {
            alert("Unable to initialize WebGL. Your browser may not support it.");
            gl = null;
        }
        return gl;
    }

    function Start(canvas) {
        animId = requestAnimationFrame(GraphicsLoop);
        //forceTimeoutId = setTimeout(forceLoopRunner, 0);
        scene = new THREE.Scene();
        //camera = new THREE.PerspectiveCamera(90, canvasSize.x / canvasSize.y, 0.1, 1000);
        camera = new THREE.OrthographicCamera(0, canvasSize.x, 0, canvasSize.y, 0.1, 1000);
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(canvasSize.x, canvasSize.y);
        document.body.appendChild(renderer.domElement);
        camera.position.z = 100;

        //o1 = new THREE.Mesh( new THREE.BoxGeometry(Objects[0].size, Objects[0].size, Objects[0].size), );
        //o2 = new THREE.Mesh( new THREE.BoxGeometry(Objects[1].size, Objects[1].size, Objects[1].size), new THREE.MeshBasicMaterial({color: 0x00ff00}));
        _.each(Objects, function (Object) {
            scene.add(Object);

        });

        //scene.add(Objects[1]);
    }

    function Stop() {
        cancelAnimationFrame(animId);
        clearTimeout(forceTimeoutId);
        tickLast = null;
    }
    return {
        Start: Start,
        Stop: Stop
    };
});