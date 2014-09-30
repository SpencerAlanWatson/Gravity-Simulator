define(['lib/underscore', 'lib/three', 'force', 'geometry/rectangle'], function (_, THREE, ForceObj, Rectangle) {
    var Tao = 2 * Math.PI;


    function Obj(position, mass, startingVelocity) {
        var self = this;
        if (!(this instanceof Obj)) {
            return new Obj(position, mass, startingVelocity);
        }
        this.mass = Math.abs(mass) || 1;
        this.size = Math.log(this.mass);
        this.color = THREE.Math.randInt(0, 0xffffff);
        THREE.Mesh.call(this, new THREE.BoxGeometry(this.size, this.size, this.size), new THREE.MeshBasicMaterial({
            color: this.color
        }));

        this.translateX(position.x);
        this.translateY(position.y);
        this.translateZ(position.z);

        this.lastPosition = this.position.clone();

        this.hitArea = new Rectangle(position.x, position.y, this.size, this.size);

        this.velocity = startingVelocity || new THREE.Vector3();
        this.momentum = this.velocity.clone().multiplyScalar(this.mass);
        this.forceVector = new THREE.Vector3();
        this.accleration = new THREE.Vector3();


        ForceObj.forceEmitter.on('applyForce', _.bind(this.applyForce, this));

    }
    Obj.prototype = Object.create(THREE.Mesh.prototype);

    function toPixels(meterDistance) {
        var conversionRatio = 1000;
        if (meterDistance instanceof Point) {
            return new Point(meterDistance.x / conversionRatio, meterDistance.y / conversionRatio);
        }
        return meterDistance / conversionRatio;
    }

    Obj.prototype.Clear = function (ctx) {
        var offset = 1.5,
            gPos = this.lastPosition,
            gSizeX = this.size + offset,
            gSizeY = this.size + offset;
        ctx.clearRect(gPos.x - offset / 2, gPos.y - offset / 2, gSizeX, gSizeY);
    }
    Obj.prototype.Draw = function (ctx) {
        //Converting meters to kilometers, because the distances are much to vast.
        var gPos = this.position,
            gSize = this.size;
        ctx.rect(gPos.x, gPos.y, gSize, gSize);
    };

    Obj.prototype.testCollision = function (otherObject, perSec) {
        var vel = this.velocity.clone().addPoint(this.accleration.clone().mult(perSec)),
            ovel = otherObject.velocity.clone().addPoint(otherObject.accleration.clone().mult(perSec)),
            size = this.size,
            osize = otherObject.size,
            fullWidth = this.size + vel.x,
            fullHeight = this.size + vel.y,
            p1 = this.position.clone(), //6
            p2 = this.position.clone().addPoint(vel),
            p3 = p1.clone(), //new Point(),
            p4 = p2.clone(), //new Point();
            op3 = otherObject.position.clone(),
            op4 = otherObject.position.clone().addPoint(ovel);
        /*if (p1.x <= p2.x) {
            p3.x = p1.x;
            p4.x = p2.x;
        } else {
            p3.x = p2.x;
            p4.x = p1.x;
        }
        if (p1.y <= p2.y) {
            p3.y = p1.y;
            p4.y = p2.y;
        } else {
            p3.y = p2.y;
            p4.y = p1.y;
        }*/

        if (false && (p3.x === p4.x || p3.y === p4.y)) {
            var hitArea = new Rectangle(p3.x, p3.y, (p3.x - p4.x) + this.size, (p3.y - p4.y) + this.size);
            if (hitArea.containsRect(otherObject.hitArea)) {
                console.info('Collision!', window.performance.now(), this, otherObject);
            }
        } else {
            //y = mx + i
            //x = (y - i)/m
            /*ar slope = p3.getSlope(p4),
                yi = (slope * (-p3.x)) + p3.y,
                ox1 = otherObject.position.x,
                oy1 = otherObject.position.y,
                ox2 = otherObject.position.x + otherObject.size,
                oy2 = otherObject.position.y + otherObject.size,
                ex1 = slope * ox1 + yi,
                ey1 = (oy1 - yi) / slope,
                ex2 = slope * ox2 + yi,
                ey2 = (oy2 - yi) / slope,
                s1 = p3.y >= ex1,
                s2 = p4.y <= ex1,
                s3 = p3.x >= ey1,
                s4 = p4.x <= ey1,
                
                s5 = p3.y >= ex2,
                s6 = p4.y <= ex2,
                s7 = p3.x >= ey2,
                s8 = p4.x <= ey2,
                
                sx1 = s1 && s2,
                sy1 = s3 && s4,
                sx2 = s5 && s6,
                sy2 = s7 && s8;
                    
            if((sx1 || sx2) && (sy1 || sy2)) {
                debugger;
            }*/
            /*var oop = otherObject.position.clone(),
                oop2 = otherObject.position.clone().addXY(otherObject.size, otherObject.size),
                mp = p4.clone().addXY(this.size, this.size),
                isBetween = p3.isBetween(mp, oop),
                isBetween2 = p3.isBetween(mp, oop2),
                oBetween = p3.isBetween(oop, p4),
                oBetween2 = p3.isBetween(oop2, p4);
            if (isBetween || isBetween2 || oBetween || oBetween2) {
                debugger;
            }*/
            var halfSize1 = this.size / 2,
                op = p4.clone().addXY(this.size, this.size),
                center1 = p3.getMidPoint(op),
                center2 = otherObject.position.clone().addXY(otherObject.size / 2, otherObject.size / 2),
                axis = center1.getUnitVector(),

                o1p = [
                    p3,
                    Point(p3.x + this.size, p3.y),
                    Point(p4.x + this.size, p4.y),
                    Point(p4.x + this.size, p4.y + this.size),
                    Point(p4.x, p4.y + this.size),
                    Point(p3.x, p3.y + this.size)
                ],
                o2p = [
                    op3,
                    Point(op3.x + osize, op3.y),
                    Point(op4.x + osize, op4.y),
                    Point(op4.x + osize, op4.y + osize),
                    Point(op4.x, op4.y + osize),
                    Point(op3.x, op3.y + osize)
                ],
                /*[
                    otherObject.position
                    Point(otherObject.position.x + otherObject.size, otherObject.position.y),
                    Point(otherObject.position.x + otherObject.size, otherObject.position.y + otherObject.size),
                    Point(otherObject.position.x, otherObject.position.y + otherObject.size)
                ],*/
                normals = [];

            function getNormals(List, array) {
                for (var i = 0, length = List.length - 1; i < length; i++) {
                    var norms = List[i].getNormals(List[i + 1]);
                    array.push(norms[0]); //We use the left hand side normal.
                }
                array.push(List[length].getNormals(List[0])[0]);

            }

            function minMaxProjections(List, Axis) {
                var projections = {
                    min: Infinity,
                    max: -Infinity
                }
                _.each(List, function (point) {
                    var currProjection = point.dotProduct(Axis);
                    //select the minimum projection on axis to corresponding box corners
                    if (projections.min > currProjection) {
                        projections.min = currProjection;
                    }
                    //select the maximum projection on axis to corresponding box corners
                    if (currProjection > projections.max) {
                        projections.max = currProjection;
                    }
                });
                return projections;
            };
            /*var ctx = document.getElementById('canvas').getContext('2d');
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#00ff00";

            ctx.strokeRect(p3.x, p3.y, this.size, this.size);

            ctx.strokeStyle = "#0000FF";
            ctx.strokeRect(p4.x, p4.y, this.size, this.size);

            ctx.strokeStyle = "#FF0000";
            DrawLines(ctx, o1p);

            DrawLines(ctx, o2p);
            ctx.strokeStyle = "#000000";*/

            //D
            getNormals(o1p, normals);
            getNormals(o2p, normals);
            var o1projs = [],
                o2projs = [];
            var isColliding = !_.find(normals, function (normal) {
                var normalUnitVector = normal, //.getUnitVector(),
                    o1Projections = minMaxProjections(o1p, normalUnitVector),
                    o2Projections = minMaxProjections(o2p, normalUnitVector),
                    isSeparated = o2Projections.max < o1Projections.min || o1Projections.max < o2Projections.min;
                o1projs.push(o1Projections);
                o2projs.push(o2Projections);
                return isSeparated;
            });

            /*var c = new Point(center2.x - center1.x, center2.y - center1.y),
                a = new Point(op.x - center1.x, op.y - center1.y),
                b = new Point(otherObject.position.x - center2.x, otherObject.position.y - center2.y),
                projC = c.dotProduct(axis),
                projA = a.dotProduct(axis),
                projB = b.dotProduct(axis),
                gap = projC - projA + projB;*/

            if (isColliding) {
                var velocityChange1 = new Point((-otherObject.momentum.x) / this.mass, (-otherObject.momentum.y) / this.mass),
                    velocityChange2 = new Point((-this.momentum.x) / otherObject.mass, (-this.momentum.y) / otherObject.mass);
                otherObject.addForce(vel.clone().mult(this.mass));
                this.addForce(ovel.clone().mult(otherObject.mass));
                console.group('Collision Velocity Change');
                console.log(velocityChange1.toString())
                console.log(velocityChange2.toString());
                console.groupEnd();
            }

            return isColliding;
            dum = "no";
        }
        return false;

    };
    var xaxis = new THREE.Vector3(1, 0, 0),
        yaxis = new THREE.Vector3(0, 1, 0),
        zaxis = new THREE.Vector3(0, 0, 1);

    function forceToForceVector3D(force, dir) {
        var angleA = xaxis.angleTo(dir),
            angleB = yaxis.angleTo(dir),
            angleC = zaxis.angleTo(dir);
        return new THREE.Vector3(force * Math.cos(angleA), force * Math.cos(angleB), force * Math.cos(angleC));
    }
    Obj.prototype.addForce = function (force, p2) {
        if (this.mass >= 0) {

            var fv = force;
            //If angle was sent in, then we assume that force is the magnitude
            if (p2) {
                
                /*var forceRatio = force / this.mass / this.position.distanceTo(p2),
                    beforeSub = this.position.clone().lerp(p2, forceRatio);
                fv = this.position.clone().sub(beforeSub);*/
                fv = forceToForceVector3D(force, p2.clone().sub(this.position));
                //console.log(fv, new THREE.Vector3(1, 1).setLength(force).applyAxisAngle(new THREE.Vector3(), angle));
            }
            this.forceVector.add(fv);
            this.accleration.add(fv.divideScalar(this.mass));
            //this.accleration.add(fv.divideScalar(this.mass));
        }
    };
    Obj.prototype.applyForce = function (forceEvent) {
        var perSec = forceEvent.perSec;

        this.lastPosition = this.position.clone();

        this.velocity.add(this.accleration.multiplyScalar(perSec));
        this.momentum = this.velocity.clone().multiplyScalar(this.mass);

        this.translateX(this.velocity.x);
        this.translateY(this.velocity.y);
        this.translateZ(this.velocity.z);

        this.forceVector = new THREE.Vector3();
        this.accleration = new THREE.Vector3();
    };

    return Obj;
});