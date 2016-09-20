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
    top_right = object.getObjectByName('aileron-top-right');
    if (top_left && top_right) {
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

	var left_group = new THREE.Group();
	top_left.geometry.translate(-offsetX, -offsetY, -offsetZ);
	top_left.geometry.rotateX(-angleX);
	top_left.geometry.rotateY(-angleY);
	top_left.geometry.rotateZ(-angleZ);

	// THREE.Object3D.translate() has been removed.
	left_group.translateX(offsetX);
	left_group.translateY(offsetY);
	left_group.translateZ(offsetZ);
	left_group.rotateX(angleX);
	left_group.rotateY(angleY);
	left_group.rotateZ(angleZ);
	left_group.add(top_left);
	object.add(left_group);

	var right_group = new THREE.Group();
	top_right.geometry.translate(offsetX, -offsetY, -offsetZ);
	top_right.geometry.rotateX(angleX);
	top_right.geometry.rotateY(angleY);
	top_right.geometry.rotateZ(angleZ);

	// THREE.Object3D.translate() has been removed.
	right_group.translateX(-offsetX);
	right_group.translateY(offsetY);
	right_group.translateZ(offsetZ);
	right_group.rotateX(-angleX);
	right_group.rotateY(-angleY);
	right_group.rotateZ(-angleZ);
	right_group.add(top_right);
	object.add(right_group);
    }
    bottom_left = object.getObjectByName('aileron-bottom-left');
    bottom_right = object.getObjectByName('aileron-bottom-right');
    if (bottom_left && bottom_right) {
	bottom_left.geometry.computeBoundingBox();
	var offsetX = bottom_left.geometry.boundingBox.max.x;
	var offsetY = (bottom_left.geometry.boundingBox.max.y +
		       bottom_left.geometry.boundingBox.min.y) / 2;
	var offsetZ = bottom_left.geometry.boundingBox.min.z +
	    (bottom_left.geometry.boundingBox.max.y -
	     bottom_left.geometry.boundingBox.min.y) / 2;
	var angleX = 0.0;
	var angleY = -0.02;
	var angleZ = -0.02;

	var left_group = new THREE.Group();
	bottom_left.geometry.translate(-offsetX, -offsetY, -offsetZ);
	bottom_left.geometry.rotateX(-angleX);
	bottom_left.geometry.rotateY(-angleY);
	bottom_left.geometry.rotateZ(-angleZ);

	// THREE.Object3D.translate() has been removed.
	left_group.translateX(offsetX);
	left_group.translateY(offsetY);
	left_group.translateZ(offsetZ);
	left_group.rotateX(angleX);
	left_group.rotateY(angleY);
	left_group.rotateZ(angleZ);
	left_group.add(bottom_left);
	object.add(left_group);

	var right_group = new THREE.Group();
	bottom_right.geometry.translate(offsetX, -offsetY, -offsetZ);
	bottom_right.geometry.rotateX(angleX);
	bottom_right.geometry.rotateY(angleY);
	bottom_right.geometry.rotateZ(angleZ);

	// THREE.Object3D.translate() has been removed.
	right_group.translateX(-offsetX);
	right_group.translateY(offsetY);
	right_group.translateZ(offsetZ);
	right_group.rotateX(-angleX);
	right_group.rotateY(-angleY);
	right_group.rotateZ(-angleZ);
	right_group.add(bottom_right);
	object.add(right_group);
    }
    //object.position.set(0, -0.19578, 0.62016);
    return object;
}
