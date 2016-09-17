var models = ['a4', 'aircrane', 'antonov', 'bv170', 'canadair', 'clipper',
	      'dr400', 'f4u', 'f16', 'f80', 'fouga', 'geebee', 'me262', 'p38',
	      'p51d', 'pitts', 'rafale', 'spitfire', 'spitfireIIa',
	      'spitfiremkVb', 'starfighter', 'zlin50lx'];
var name = null;
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
    Axis: true,
    Name: 'pitts'
};

window.addEventListener('load', init);

function parse() {
    var result = "pitts",
    tmp = [];
    location.search.substr(1).split("&").forEach(function (item) {
        tmp = item.split("=");
        if (tmp[0] === "model")  {
	    result = decodeURIComponent(tmp[1]);
	}
    });
    return result;
}
function init() {

    name = parse();
    params.Name = name;
    var base = 'models/' + name + '/';
    var obj = name + '.obj';
    var mtl = name + '.mtl';
    var script = document.createElement('script');
    script.src = base + '/' + name + '.js';
    document.body.appendChild(script);

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
    mtlLoader.setPath(base);
    mtlLoader.load(mtl, function(materials) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
	objLoader.setPath(base);
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
    gui.add(params, 'Name', models).name('Model');;
    gui.add(params, 'Pitch', -30, 30);
    gui.add(params, 'Yaw', -30, 30);
    gui.add(params, 'Roll', -30, 30);
    gui.add(params, 'Axis', true).name('Show Axis');
    gui.open();
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {

    if (name && params.Name != name) {
	var tmp = [];
	name = params.Name;
        tmp = window.location.href.split("?");
	window.location.href = tmp[0] + '?model=' + params.Name;
    }

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
	model.rotation.x = -params.Pitch * Math.PI / 180.0;
	model.rotation.y = - params.Yaw * Math.PI / 180.0;
	model.rotation.z = params.Roll * Math.PI / 180.0;
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
