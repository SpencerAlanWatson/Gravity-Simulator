define(['eventtarget', 'geometry/point'], function (EventTarget, Point) {
    var G = 6.67384e0 ,
        forceEmitter = new EventTarget();
    /**
     * It converts a normal force into a force vector
     * @param   {Number} force The force (in newtons)
     * @param   {Number} angle The angle of the direction of hte force
     * @returns {Point}  Returns an point with the vector
     */
    function forceToForceVector(force, angle) {
        return new Point(force * Math.cos(angle), force * Math.sin(angle));
    }
    function forceVectorToForce(forceVector) {
        return forceVector.x + forceVector.y;   
    }

    function calcGravityForce(m1, m2, p1, p2) {
        if (p1.x === p2.x && p1.y === p2.y) return 0;

        var dist = p1.getDistanceTo(p2);
        return (G * (m1 * m2)) / Math.pow(dist, 2);
    }

    function calcGravityForceObjects(o1, o2) {
        return calcGravityForce(o1.mass, o2.mass, o1.position, o2.position);
    }

    function ForceLoop(List, tickDelta, ctx) {
        var perSec = tickDelta / 1000;
        _.each(List, function (firstObject, firstIndex) {
            _.each(List, function (secondObject, secondIndex) {
                if (firstIndex === secondIndex) //That means its the same object
                    return;
                var gForce = calcGravityForceObjects(firstObject, secondObject);
                firstObject.addForce(gForce, firstObject.position.angleBetween(secondObject.position));
            });
            testCollision(List, firstObject, perSec);
        });
        forceEmitter.emit({
            'type': 'applyForce',
            'perSec': perSec
        });
    }

    function testCollision(List, object, perSec) {
        return _.find(List, function (object2) {
            if (object !== object2) {
                return object.testCollision(object2, perSec)
            }
        })
    }

    return {
        G: G,
        forceEmitter: forceEmitter,
        forceToForceVector: forceToForceVector,
        calcGravityForce: calcGravityForce,
        calcGravityForceObjects: calcGravityForceObjects,
        ForceLoop: ForceLoop,
        testCollision: testCollision,
    }
});