import * as THREE from 'https://csc-vu.github.io/lib/three.module.js';
export function lightScene(scene) {
	const light = new THREE.AmbientLight( 0xffffff, 0.7 );
	light.position.y = 50;
	const bulb = new THREE.PointLight(0xffffff, 1, 50); 
	bulb.position.set(-40,40,50);
	scene.add(bulb);
	scene.add(light);

	const slateLight = new THREE.PointLight( 0xffffff, 10, 50 );
	slateLight.position.set(400, 50, 0);
	scene.add(slateLight);
}
