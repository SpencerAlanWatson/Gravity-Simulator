define([], function () {

    /**
     * A 3D Point
     * @constructor
     * @param   {Number} x The X Coordinate
     * @param   {Number} y The Y Coordinate
     * @param   {Number} z The Z Coordinate
     */
    function Point(x, y, z) {
        if (!(this instanceof Point)) {
            return new Point(x, y, z);
        }
        var self = this;
        /**
         *@property x
         *@type {Number}
         *@default 0
         */

        this.x = !isFinite(x) ? 0 : x;
        /**
         *@property y
         *@type {Number}
         *@default 0
         */
        this.y = !isFinite(y) ? 0 : y;
        /**
         *@property z
         *@type {Number}
         *@default 0
         */
        this.z = !isFinite(z) ? 0 : z;
        if (!y) {
            this.y = this.x;
            this.z = this.z;
        }



    }

    /**
     * String represenation of the Point
     * @returns {String}
     */
    Point.prototype.toString = function () {
        return this.x + ", " + this.y + ", " + this.z;
    };
    /**
     * Adds two points togehter
     * @param {Point} Point The Point to add
     */
    Point.prototype.addPoint = function (Point) {
        this.x += Point.x;
        this.y += Point.y;
        this.z += Point.z;
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
    Point.prototype.addZ = function (z) {
        this.z += z;
        return this;
    };
    Point.prototype.addXY = function (x, y) {
        this.x += x;
        this.y += y;
        return this;
    };
    Point.prototype.addXZ = function (x, z) {
        this.x += x;
        this.z += z;
        return this;
    };
    Point.prototype.addYZ = function (y, z) {
        this.y += y;
        this.z += z;
        return this;
    };
    Point.prototype.addXYZ = function (x, y, z) {
        this.x += x;
        this.y += y;
        this.z += z;
        return this;
    };

    /**
     * Gets the distance to another point.
     * @param   {Point} otherPoint The Point to find the distance between
     * @returns {Number} The Distance
     */
    Point.prototype.getDistanceTo = function (otherPoint) {
        return Math.sqrt(Math.pow(this.x - otherPoint.x, 2) + Math.pow(this.y - otherPoint.y, 2) + Math.Pos(this.z - otherPoint.z, 2));
    };
    Point.prototype.getDistanceToSquared = function (otherPoint) {
        return Math.pow(this.x - otherPoint.x, 2) + Math.pow(this.y - otherPoint.y, 2) + Math.pow(this.z - otherPoint.z, 2);
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
        var cx = (this.y * b.z) - (this.z * b.y),
            cy = (this.z * b.x) - (this.x * b.z),
            cz = (this.x * b.y) - (this.y * b.x);
        return new Point(cx, cy, cz);
        //return (c.y - this.y) * (b.x - this.x) - (c.x - this.x) * (b.y - this.y);
    }
    Point.prototype.dotProduct = function (b) {
        return (this.x * b.x) + (this.y * b.y) + (this.z * b.z);
        //return (c.x - this.x) * (b.x - this.x) + (c.y - this.y) * (b.y - this.y);
    }
    Point.prototype.getMidPoint = function (otherPoint) {
        return new Point((this.x + otherPoint.x) / 2, (this.y + otherPoint.y) / 2, (this.z + otherPoint.z) / 2);
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
        return new Point(otherPoint.x - this.x, otherPoint.y - this.y, otherPoint.z - this.z);
    };
    
    Point.prototype.getMagnitude = function () {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));  
    };
    Point.prototype.getMagnitudeSquared = function () {
        return  Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2);
    }
    /**
     * Finds the angle between this and another point
     * @param   {Point}   otherPoint
     * @returns {Number} The Angle in Radians
     */
    Point.prototype.angleBetween = function (otherPoint) {
        var dotProd = this.dotProduct(otherPoint),
            mag1 = Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2),
            mag2 = Math.pow(otherPoint.x, 2) + Math.pow(otherPoint.y, 2) + Math.pow(otherPoint.z, 2),
            result = dotProd / Math.sqrt(mag1 * mag2);
        
        return Math.acos(result);
    };
    Point.prototype.getUnitVector = function () {
        var mag = this.getMagnitude();
        return new Point(this.x / mag, this.y / mag, this.z /mag);
    };
    Point.prototype.mult = function (val) {
        this.x *= val;
        this.y *= val;
        this.z *= val;
        return this;
    };
    
    Point.prototype.fromAngle = function(force, angle) {
        
    };

    Point.prototype.clone = function () {
        return new Point(this.x, this.y, this.z);
    };
    window.Point3d = Point;
    return Point;
});