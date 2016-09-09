var name = 'clipper';

var obj = 'models/' + name + '/obj/' + name + '.obj';
var mtl = 'models/' + name + '/obj/' + name + '.mtl';
var container, camera, scene, renderer, controls, clock, model = null;
var proppeler = null;
var rudder = null;
var elevators = null;
var axis = null;
var tl = null;
var top_left = null;
var r = null;
var t = null;
var body = null;
var params = {
    Pitch: 0,
    Yaw: 0,
    Roll: 0,
    Axis: true
};

window.addEventListener('load', init);

function init() {

    // Create an output div container for all our stuff
    container = document.createElement('div');
    document.body.appendChild(container);

    // Create a renderer and set the size
    renderer = new THREE.WebGLRenderer(/*{antialias: true, alpha: true}*/);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Create a scene, that will hold all our elements such as
    // objects, cameras and lights.
    scene = new THREE.Scene();

    // Create a camera, which defines where we're looking at.
    camera = new THREE.PerspectiveCamera(55, window.innerWidth /
                                         window.innerHeight, 0.1, 3000000);
    camera.position.set(-3, 2, 5);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Create a sun light
    var sun = new THREE.DirectionalLight(0xffffdd, 1);
    sun.position.set(-10000, 10000, -10000);
    scene.add(sun);

    // Create water
    var waterNormals = new THREE.TextureLoader().load('textures/waternormals.jpg');
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
    water = new THREE.Water(renderer, camera, scene, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: waterNormals,
        alpha: 1.0,
        sunDirection: sun.position.clone().normalize(),
        sunColor: 0xffffdd,
        waterColor: 0x001e0f,
        distortionScale: 100.0,
    });
    var ocean = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(2000 * 500, 2000 * 500),
        water.material);
    ocean.add(water);
    ocean.rotation.x = - Math.PI / 2;
    ocean.position.set(0, -50, 0);
    scene.add(ocean);

    // Create skybox
    var cubeMap = new THREE.CubeTexture([]);
    cubeMap.format = THREE.RGBFormat;
    var loader = new THREE.ImageLoader();
    loader.load('textures/skyboxsun25degtest.png', function (image) {
        var getSide = function (x, y) {
            var size = 1024;
            var canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            var context = canvas.getContext('2d');
            context.drawImage(image, - x * size, - y * size);
            return canvas;
        };
        cubeMap.images[0] = getSide(2, 1); // px
        cubeMap.images[1] = getSide(0, 1); // nx
        cubeMap.images[2] = getSide(1, 0); // py
        cubeMap.images[3] = getSide(1, 2); // ny
        cubeMap.images[4] = getSide(1, 1); // pz
        cubeMap.images[5] = getSide(3, 1); // nz
        cubeMap.needsUpdate = true;
    });
    var cubeShader = THREE.ShaderLib['cube'];
    cubeShader.uniforms['tCube'].value = cubeMap;
    var skyBoxMaterial = new THREE.ShaderMaterial({
        fragmentShader: cubeShader.fragmentShader,
        vertexShader: cubeShader.vertexShader,
        uniforms: cubeShader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
    });
    var skyBox = new THREE.Mesh(
        new THREE.BoxGeometry(1000000, 1000000, 1000000),
        skyBoxMaterial);
    scene.add(skyBox);

    // Create small axis helper
    axis = new THREE.AxisHelper(5);
    scene.add(axis);

    // Create model
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load(mtl, function(materials) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(obj, function (object) {
            model = fixModel(object);
            scene.add(model);
        });
    });

    // Create the automatic trackball controls and related clock
    // Passing the render context tells the control to only work when
    // the mouse is over the renderer's domElement (the canvas).
    controls = new THREE.TrackballControls(camera, renderer.domElement);
    clock = new THREE.Clock();

    // Handle window resize events
    window.addEventListener('resize', onWindowResize, false);

    // Create GUI
    var gui = new dat.GUI(resizable= false);
    gui.add(params, 'Pitch', -30, 30);
    gui.add(params, 'Yaw', -30, 30);
    gui.add(params, 'Roll', -30, 30);
    gui.add(params, 'Axis', true).name('Show Axis');
    gui.open();
    animate();
}

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
    //object.position.set(0, -0.19578, 0.62016);
    return object;
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {

    // Update the Trackball control 
    var delta = clock.getDelta();
    controls.update(delta);

    // Move water
    water.material.uniforms.time.value += 1.0 / 100.0;
    water.render();

    // Rotate proppeler
    if (proppeler) {
	proppeler.rotation.z += 0.02;
    }
    if (elevators) {
	elevators.rotation.x = params.Pitch * Math.PI / 180.0;
    }
    if (rudder) {
	rudder.rotation.y = params.Yaw * Math.PI / 180.0;
    }
    if (model) {
	model.rotation.z = -params.Pitch * Math.PI / 180.0;
	model.rotation.y = - params.Yaw * Math.PI / 180.0;
	model.rotation.x = params.Roll * Math.PI / 180.0;
    }
    if (axis) {
	axis.visible = params.Axis;
    }
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
