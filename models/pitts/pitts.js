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
    var elevator_surfaces = object.getObjectByName('elevators');
    if (elevator_surfaces) {
	elevator_surfaces.name = 'elevator-surfaces';
	elevator_surfaces.geometry.computeBoundingBox();
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
    top_left = object.getObjectByName('aileron-top-left');
/*
    if (top_left) {
	top_left.name = 'aileron-top-left-surface';
	top_left.geometry.computeBoundingBox();
	var offsetX = top_left.geometry.boundingBox.max.x;
	var offsetY = (top_left.geometry.boundingBox.max.y + top_left.geometry.boundingBox.min.y) / 2;
	var offsetZ = top_left.geometry.boundingBox.min.z + (top_left.geometry.boundingBox.max.y - top_left.geometry.boundingBox.min.y) / 2;
	t = new THREE.Group();
	var helper_t = new THREE.AxisHelper(-2);
	t.add(top_left);
	t.add(helper_t);
	top_left.position.x = -offsetX;
	top_left.position.y = -offsetY;
	top_left.position.z = -offsetZ;
	object.add(t);
*/
/*
	body = object.getObjectByName('fuselage');
	body.visible = false;
*/
/*
	t = new THREE.Group();
	var helper_t = new THREE.AxisHelper(-2);
	t.add(top_left);
	t.add(helper_t);
//	t.position.x = offsetX;
	top_left.position.x = -offsetX;
//	t.position.y = offsetY;
	top_left.position.y = -offsetY;
//	t.position.z = offsetZ;
//	t.rotation.y = Math.PI * 5.809 / 180;
	top_left.position.z = -offsetZ;
	r = new THREE.Group();
	var helper_r = new THREE.AxisHelper(-2);
	r.position.x = offsetX;
	r.position.y = offsetY;
	r.position.z = offsetZ;
	r.add(t);
	r.add(helper_r);
	object.add(r);
*/
//    }
    object.position.set(0, -0.19578, 0.62016);
    return object;
}
