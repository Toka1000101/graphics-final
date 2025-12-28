import * as THREE from 'https://csc-vu.github.io/lib/three.module.js';
import { OrbitControls } from 'https://csc-vu.github.io/lib/OrbitControls.js';
import { buildScene, update } from './main.js';

let scene, camera, renderer, controls, canvas;
// Helper function to create and position a perspective camera
function createCamera() {
	// PerspectiveCamera(fieldOfView, aspectRatio, near, far)
	let camera = new THREE.PerspectiveCamera(40, canvas.width / canvas.height, 1, 500);
	// camera.position.set(80, -20, 0); 
	camera.position.set(400,40,0);
	
	// Look at the center of the scene
	camera.lookAt(0, 0, 0);
	return camera; 
}

// Initialize everything: canvas, renderer, scene, camera, controls
function init() {
	canvas = document.getElementById("glcanvas");
	try {
		// Create the WebGL renderer, attach it to our canvas, enable antialiasing for smoother edges
		renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
	} catch (e) {
		// If the browser/device does not support WebGL, show an error
		document.body.innerHTML = "<h3><b>WebGL is not available.</b></h3>";
		return;
	}

	// Set renderer size and pixel ratio for high-DPI screens
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);

	// Create an empty scene 
	scene = new THREE.Scene();

	// Set up the camera
	camera = createCamera();

	// Enable interactive orbit controls (click and drag to move camera)
	controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;

	// Handle browser resizing
	window.addEventListener('resize', () => {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	});

	// Call student function to add objects/lights to the scene
	buildScene(scene, camera);

	// Start the animation/rendering loop
	render();
}
document.getElementById('playOverlay')?.addEventListener('click', () => {
    import('./main.js').then(module => {
        module.startShow();
    });
});

// The render loop: updates controls, runs animation code, draws the scene
function render() {
	controls.enabled = false;
	requestAnimationFrame(render);  // Keep calling render before the next frame
	controls.update();              // Update orbit controls (camera movement)
	update(scene, camera);                 // Call student animation code (optional)
	renderer.render(scene, camera); // Draw the current scene from the camera's POV
}

// Run the init function when the page is fully loaded
window.addEventListener('DOMContentLoaded', init);
