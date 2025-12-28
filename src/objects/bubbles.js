import * as THREE from 'https://csc-vu.github.io/lib/three.module.js';

const PARTICLE_COUNT = 500;
const BUBBLE_TEXTURE_URL = 'textures/smoke.png'; 
const DANCE_FLOOR_Y = 0; 
const PARTICLE_SIZE = 10;
const RISE_SPEED = 20; 
const MAX_HEIGHT = 20;
const BASE_OPACITY = 0.6;
const MAX_SPEED_VARIATION = 5
let bubbleParticles = [];

function createBubbleParticles(scene, texture) {
	const bubbleGeo = new THREE.SphereGeometry(0.1, 100, 100); 
	const bubbleMaterial = new THREE.MeshLambertMaterial({
		map: texture,
		transparent: true,
		opacity: 0.6,
		depthWrite: false, 
		blending: THREE.AdditiveBlending 
	});

	for (let i = 0; i < PARTICLE_COUNT; i++) {
		let particle = new THREE.Mesh(bubbleGeo, bubbleMaterial.clone());
		        
		particle.scale.set(PARTICLE_SIZE, PARTICLE_SIZE, PARTICLE_SIZE);
		particle.userData.riseSpeed = RISE_SPEED + (Math.random() * MAX_SPEED_VARIATION - (MAX_SPEED_VARIATION / 2));
		const randomHeightOffset = Math.random() * MAX_HEIGHT;
		particle.position.set(
			(Math.random() - 0.5) * 100,
			DANCE_FLOOR_Y + randomHeightOffset,
			(Math.random() - 0.5) *100 
		);

		particle.rotation.z = Math.random() * 2 * Math.PI;
		particle.initialY = DANCE_FLOOR_Y;

		const fadeProgress = randomHeightOffset / MAX_HEIGHT;
		particle.material.opacity = Math.max(0, BASE_OPACITY * (1 - fadeProgress));

		scene.add(particle);
		bubbleParticles.push(particle);
	}
}

export function setupBubbles(scene) {
	const textureLoader = new THREE.TextureLoader();
	textureLoader.load(BUBBLE_TEXTURE_URL, (texture) => {
		createBubbleParticles(scene, texture);
	}, undefined, (error) => {
		console.error('Error loading bubble texture:', error);
	});
}

export function updateBubble(delta) {
	if (bubbleParticles.length === 0) return;

	bubbleParticles.forEach(p => {
		// rising movement
		p.position.y += delta * p.userData.riseSpeed;

		// recycling
		const riseAmount = p.position.y - DANCE_FLOOR_Y;
		const fadeProgress = riseAmount / MAX_HEIGHT; 

		if (p.material) {
			const smoothFade = Math.pow(fadeProgress, 1.5); 
			p.material.opacity = Math.max(0, BASE_OPACITY * (1 - smoothFade));
		}

		if (riseAmount > MAX_HEIGHT) {
			// position reset
			p.position.set(
				(Math.random() - 0.5) * 100,
				p.initialY,
				(Math.random() - 0.5) * 100 
			);
			p.material.opacity = BASE_OPACITY * (0.8 + Math.random() * 0.2); 
            
			p.userData.riseSpeed = RISE_SPEED + (Math.random() * MAX_SPEED_VARIATION - (MAX_SPEED_VARIATION / 2));
		}
	});
}
