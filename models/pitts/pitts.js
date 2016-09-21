var proppeler = null;
var rudder = null;
var elevators = null;
var top_left = null;
var top_right = null;
var bottom_left = null;
var bottom_right = null;

function fixModel(model) {

    var offset;

    // Create a proppeler group containing the nose and blades
    var blades = model.getObjectByName('proppeler');
    var nose = model.getObjectByName('nose');
    if (blades && nose) {
	offset = nose.geometry.center();
        proppeler = new THREE.Group();
        proppeler.name = 'proppeler';
	proppeler.position.set(-offset.x, -offset.y, -offset.z);
	blades.position.set(offset.x, offset.y, offset.z);
        proppeler.add(nose);
        proppeler.add(blades);
        model.add(proppeler);

        // For rendering blades on both sides
        if (blades.material) {
            blades.material.side = THREE.DoubleSide;
        }
    }

    // Create a rudder group containing the rudder surface, rear landing gear and wheel
    var rudder_surface = model.getObjectByName('rudder');
    var rear_landing_gear = model.getObjectByName('rear-landing-gear');
    var rear_landing_gear_wheel = model.getObjectByName('rear-landing-gear-wheel');
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
	model.add(rudder);
    }

    // Add a pivot axis for the elevators
    elevators = model.getObjectByName('elevators');
    if (elevators) {
	elevators.geometry.computeBoundingBox();
	var origin = new THREE.Vector3(
	    0.0,
	    (elevators.geometry.boundingBox.min.y +
	     elevators.geometry.boundingBox.max.y) / 2,
	    elevators.geometry.boundingBox.min.z);
	var direction = new THREE.Vector3(0.0, 0.0, 0.0);
	model = pivotAxis(model, elevators, origin, direction);
    }

    // Add pivot axis for all ailerons
    top_left = model.getObjectByName('aileron-top-left');
    top_right = model.getObjectByName('aileron-top-right');
    if (top_left && top_right) {
	top_left.geometry.computeBoundingBox();
	var origin = new THREE.Vector3(
	    top_left.geometry.boundingBox.max.x,
	    (top_left.geometry.boundingBox.max.y +
	     top_left.geometry.boundingBox.min.y) / 2,
	    top_left.geometry.boundingBox.min.z +
	    (top_left.geometry.boundingBox.max.y -
	     top_left.geometry.boundingBox.min.y) / 2);
	var direction = new THREE.Vector3(0.0, 0.1, 0.0065);
	model = pivotAxis(model, top_left, origin, direction);
	origin.x = -origin.x;
	direction.negate();
	model = pivotAxis(model, top_right, origin, direction);
    }
    bottom_left = model.getObjectByName('aileron-bottom-left');
    bottom_right = model.getObjectByName('aileron-bottom-right');
    if (bottom_left && bottom_right) {
	bottom_left.geometry.computeBoundingBox();
	var origin = new THREE.Vector3(
	    bottom_left.geometry.boundingBox.max.x,
	    (bottom_left.geometry.boundingBox.max.y +
	     bottom_left.geometry.boundingBox.min.y) / 2,
	    bottom_left.geometry.boundingBox.min.z +
		(bottom_left.geometry.boundingBox.max.y -
		 bottom_left.geometry.boundingBox.min.y) / 2);
	var direction = new THREE.Vector3(0.0, -0.02, -0.02);
	model = pivotAxis(model, bottom_left, origin, direction);
	origin.x = -origin.x;
	direction.negate();
	model = pivotAxis(model, bottom_right, origin, direction);
    }
    //model.position.set(0, -0.19578, 0.62016);
    return model;
}

function renderModel(model) {

    // Rotate proppeler
    if (proppeler) {
	proppeler.rotation.z += 0.02;
    }

    // Rotate elevators
    if (elevators) {
	elevators.rotation.x = params.Pitch * Math.PI / 180.0;
    }

    // Rotate rudder and rear landing gear
    if (rudder) {
	rudder.rotation.y = params.Yaw * Math.PI / 180.0;
    }

    // Rotate all ailerons
    if (top_left) {
    	top_left.rotation.x = -params.Roll * Math.PI / 180.0;
    }
    if (top_right) {
    	top_right.rotation.x = params.Roll * Math.PI / 180.0;
    }
    if (bottom_left) {
    	bottom_left.rotation.x = -params.Roll * Math.PI / 180.0;
    }
    if (bottom_right) {
    	bottom_right.rotation.x = params.Roll * Math.PI / 180.0;
    }
}
