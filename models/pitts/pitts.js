function fixModel(object) {

    var offset;

    // Create a proppeler group containing the nose and blades
    var blades = object.getObjectByName('proppeler');
    var nose = object.getObjectByName('nose');
    if (blades && nose) {
	offset = nose.geometry.center();
        proppeler = new THREE.Group();
        proppeler.name = 'proppeler';
	proppeler.position.set(-offset.x, -offset.y, -offset.z);
	blades.position.set(offset.x, offset.y, offset.z);
        proppeler.add(nose);
        proppeler.add(blades);
        object.add(proppeler);

        // For rendering blades on both sides
        if (blades.material) {
            blades.material.side = THREE.DoubleSide;
        }
    }

    // Create a rudder group containing the rudder surface, rear landing gear and wheel
    var rudder_surface = object.getObjectByName('rudder');
    var rear_landing_gear = object.getObjectByName('rear-landing-gear');
    var rear_landing_gear_wheel = object.getObjectByName('rear-landing-gear-wheel');
    if (rudder_surface && rear_landing_gear && rear_landing_gear_wheel) {
	rudder_surface.name = 'rudder-surface';
	rudder_surface.geometry.computeBoundingBox();
	offset = rudder_surface.geometry.boundingBox.min.z;
	rudder = new THREE.Group();
	rudder.name = 'rudder';
	rudder.add(rudder_surface);
	rudder.add(rear_landing_gear);
	rudder.add(rear_landing_gear_wheel);
	rudder.position.z = offset;
	rudder_surface.position.z = -offset;
	rear_landing_gear.position.z = -offset;
	rear_landing_gear_wheel.position.z = -offset;
	object.add(rudder);
    }

    // Create an elevators group containing the elevator surfaces
/*
    var elevator_surfaces = object.getObjectByName('elevators');
    if (elevator_surfaces) {
	elevator_surfaces.name = 'elevator-surfaces';
	elevator_surfaces.geometry.computeBoundingBox();
	var offsetX = 0.0;
	var offsetY = (elevator_surfaces.geometry.boundingBox.min.y +
		       elevator_surfaces.geometry.boundingBox.max.y) / 2;
	var offsetZ = elevator_surfaces.geometry.boundingBox.min.z;
	elevators = new THREE.Group();
	elevators.name = 'elevators';
	elevators.add(elevator_surfaces);
	elevators.position.y = offsetY;
	elevator_surfaces.position.y = -offsetY;
	elevators.position.z = offsetZ;
	elevator_surfaces.position.z = -offsetZ;
	object.add(elevators);
    }
*/
    elevators = object.getObjectByName('elevators');
    if (elevators) {
	elevators.geometry.computeBoundingBox();
	var offsetX = 0.0;
	var offsetY = (elevators.geometry.boundingBox.min.y +
		       elevators.geometry.boundingBox.max.y) / 2;
	var offsetZ = elevators.geometry.boundingBox.min.z;
	var angleX = 0.0;
	var angleY = 0.0;
	var angleZ = 0.0;
	var group = new THREE.Group();
	elevators.geometry.translate(-offsetX, -offsetY, -offsetZ);
	elevators.geometry.rotateX(-angleX);
	elevators.geometry.rotateY(-angleY);
	elevators.geometry.rotateZ(-angleZ);
	group.translateX(offsetX);
	group.translateY(offsetY);
	group.translateZ(offsetZ);
	group.rotation.x = angleX;
	group.rotation.Y = angleY;
	group.rotation.z = angleZ;
	group.add(elevators);
	object.add(group);
    }

    top_left = object.getObjectByName('aileron-top-left');
    if (top_left) {
	top_left.geometry.computeBoundingBox();
	var offsetX = top_left.geometry.boundingBox.max.x;
	var offsetY = (top_left.geometry.boundingBox.max.y +
		       top_left.geometry.boundingBox.min.y) / 2;
	var offsetZ = top_left.geometry.boundingBox.min.z +
	    (top_left.geometry.boundingBox.max.y -
	     top_left.geometry.boundingBox.min.y) / 2;
	var angleX = 0.0;
	var angleY = 0.1;
	var angleZ = 0.0065;
	var group = new THREE.Group();
	top_left.geometry.translate(-offsetX, -offsetY, -offsetZ);
	top_left.geometry.rotateX(-angleX);
	top_left.geometry.rotateY(-angleY);
	top_left.geometry.rotateZ(-angleZ);
	group.translateX(offsetX);
	group.translateY(offsetY);
	group.translateZ(offsetZ);
	group.rotation.x = angleX;
	group.rotation.Y = angleY;
	group.rotation.z = angleZ;
	group.add(top_left);
	object.add(group);

//	body = object.getObjectByName('fuselage');
//	body.visible = false;
    }
    //object.position.set(0, -0.19578, 0.62016);
    return object;
}
