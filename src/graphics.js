define(['lib/underscore', 'force', 'object', 'geometry/point'], function (_, ForceObj, Object, Point) {
    var tickLast,
        ctx,
        animId,
        canvasTranslate = new Point(0, 0),
        canvasSize = new Point();

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
        clearCanvas(ctx);
        drawCanvas(ctx, Objects);
    }
    function forceLoopRunner() {
        var tickNow = window.performance.now(),
            tickDelta = tickNow - tickLast;
        if (!tickLast) {
            tickDelta = 0;
        }
        ForceObj.ForceLoop(Objects, tickDelta, ctx);
        timeoutId = setTimeout(forceLoopRunner, 0);
        tickLast = tickNow;
    }

    function DrawLines(ctx, points) {
        ctx.moveTo(points[0].x, points[0].y);
        for (var i = 1, length = points.length; i < length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.lineTo(points[0].x, points[0].y);
        ctx.stroke();
    }
    window.DrawLines = DrawLines;

    function Start(canvas) {
        animId = requestAnimationFrame(GraphicsLoop);
        forceTimeoutId = setTimeout(forceLoopRunner, 0);

        ctx = canvas.getContext('2d');
        canvasSize = new Point(canvas.width, canvas.height);
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