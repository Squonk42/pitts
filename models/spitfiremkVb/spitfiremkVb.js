function fixModel(model) {
    model.traverse(function(mesh) {
	if ((!mesh instanceof THREE.Mesh)) {
	    return;
	}
	if (mesh.material) {
	    mesh.material.side = THREE.DoubleSide;
	}
    });
    return model;
}

function renderModel(model) {
}
