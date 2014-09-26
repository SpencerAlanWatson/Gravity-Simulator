define([], function () {
    function Circle(x, y, radius) {
        this.x = x || 0;
        this.y = y || 0;
        this.radius = radius || 0;
    }
    Circle.prototype.contains = function (x, y) {
        if (this.radius <= 0)
            return false;

        var dx = (this.x - x),
            dy = (this.y - y),
            r2 = this.radius * this.radius;

        dx *= dx;
        dy *= dy;

        return (dx + dy <= r2);
    };
    Circle.prototype.clone = function () {
        return new Circle(this.x, this.y, this.radius)
    };
    return Circle;
});