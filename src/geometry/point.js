define([], function () {

    /**
     * A 2D Point
     * @constructor
     * @param   {Number} x The X Coordinate
     * @param   {Number} y The Y Coordinate
     */
    function Point(x, y) {
        if (!(this instanceof Point)) {
            return new Point(x, y);
        }
        var self = this;
        /**
         *@property x
         *@type {Number}
         *@default 0
         */

        this.x = !isFinite(x) ? 0 : x;
        /**
         *@property x
         *@type {Number}
         *@default 0
         */
        this.y = !isFinite(y) ? 0 : y;

        if (!y) {
            this.y = this.x;
        }



    }

    /**
     * String represenation of the Point
     * @returns {String}
     */
    Point.prototype.toString = function () {
        return this.x + ", " + this.y;
    };
    /**
     * Adds two points togehter
     * @param {Point} Point The Point to add
     */
    Point.prototype.addPoint = function (Point) {
        this.x += Point.x;
        this.y += Point.y;
        return this;
    };
    Point.prototype.addX = function (x) {
        this.x += x;
        return this;
    };
    Point.prototype.addY = function (y) {
        this.y += y;
        return this;
    };
    Point.prototype.addXY = function (x, y) {
        this.x += x;
        this.y += y;
        return this;
    };
    /**
     * Gets the distance to another point.
     * @param   {Point} otherPoint The Point to find the distance between
     * @returns {Number} The Distance
     */
    Point.prototype.distanceTo = function (otherPoint) {
        return Math.sqrt(Math.pow(this.x - otherPoint.x, 2) + Math.pow(this.y - otherPoint.y, 2));
    };
    Point.prototype.distanceToSquared = function (otherPoint) {
        return Math.pow(this.x - otherPoint.x, 2) + Math.pow(this.y - otherPoint.y, 2);
    }
    Point.prototype.getNormals = function (other) {
        var dx = other.x - this.x,
            dy = other.y - this.y;
        return [new Point(-dy, dx), new Point(dy, -dx)];
    }
    Point.prototype.getSlope = function (otherPoint) {
        return (otherPoint.y - this.y) / (otherPoint.x - this.x);
    }
    Point.prototype.crossProduct = function (b) {
        return (this.x * b.y) - (this.y * b.x);
        //return (c.y - this.y) * (b.x - this.x) - (c.x - this.x) * (b.y - this.y);
    }
    Point.prototype.dotProduct = function (b) {
        return (this.x * b.x) + (this.y * b.y);
        //return (c.x - this.x) * (b.x - this.x) + (c.y - this.y) * (b.y - this.y);
    }
    Point.prototype.getMidPoint = function(otherPoint) {
        return new Point((this.x + otherPoint.x) /2, (this.y + otherPoint.y) /2);
    }
    Point.prototype.isBetween = function (b, c) {
        crossproduct = this.crossProduct(b, c);
        if (Math.abs(crossproduct) != 0)
            return false; //(or != 0if using integers)

        dotproduct = this.dotProduct(b, c);
        if (dotproduct < 0)
            return false;

        squaredlengthba = this.getDistanceToSquared(b);
        if (dotproduct > squaredlengthba)
            return false;

        return true;
    }
    Point.prototype.deltaPoint = function (otherPoint) {
        return new Point(otherPoint.x - this.x, otherPoint.y - this.y);
    };
    /**
     * Finds the angle between this and another point
     * @param   {Point}   otherPoint
     * @returns {Number} The Angle in Radians
     */
    Point.prototype.angleTo = function (otherPoint) {
        var dx = otherPoint.x - this.x,
            dy = otherPoint.y - this.y;
        return Math.atan2(dy, dx);
    };

    Point.prototype.inverseAngleBetween = function (otherPoint) {
        var dx = this.x - otherPoint.x,
            dy = this.y - otherPoint.y;
        return Math.atan2(dx, dy);
    };
    Point.prototype.getUnitVector = function() {
        var angBet = new Point().angleBetween(this);
        return new Point(Math.cos(angBet), Math.sin(angBet));
    };
    Point.prototype.mult = function (val) {
        this.x *= val;
        this.y *= val;
        return this;
    };
    
    Point.prototype.equals = function (p2) {
        return this.x === p2.x && this.y === p2.y;
    }

    Point.prototype.clone = function () {
        return new Point(this.x, this.y);
    };
    window.Point = Point;
    return Point;
});