import * as THREE from 'https://csc-vu.github.io/lib/three.module.js';
import { OrbitControls } from 'https://csc-vu.github.io/lib/OrbitControls.js';
import { GLTFLoader } from 'https://csc-vu.github.io/lib/GLTFLoader.js';
import KeyboardState from 'https://csc-vu.github.io/lib/KeyboardState.js';
import { lightScene } from './light.js';
import { DISCO_BALL, HEAD_BEAM, HEX_DANCE, loadModel, setupDiscoBall, setupHeadBeams, setupHex, setupWalls, ROBOT_ARM, FILM_SLATE, setupFilmSlate} from './scene.js';
import { DANCE_FLOOR_PATH } from './scene.js';
import { setupDanceFloor } from './scene.js';
import { addMixer, addUpdater, updateAnimations } from './animation/animationEngine.js';
import { setupBubbles, updateBubble } from './objects/bubbles.js';
import { initMusic} from './audio/music.js';

const clock = new THREE.Clock();
let isPlaying = false;
let startTime = 0;
let animationTriggered = false;
let filmSlateMixer;
let animationFinished = false;
let filmSlate;

let radius = 60;
let angle = Math.PI;
const rotateSpeed = 0.5;

// vertical motion
const verticalPeriod = 3.5;
const verticalAmplitude = 8;
const baseOrbitHeight = 30;
const baseBlendDuration = 0.6;

// radius boundaries
const innerRadius = 50;
const outerRadius = 60;
const radiusBlendDuration = 3.5; 

let moveState = 0;
let orbitTime = 0;
let baseYStart = 0;
let baseBlendT = 0;

let radiusStart = 0;
let radiusEnd = 0;
let radiusBlendT = 0;

let radiusDirection = -1; 
let lookTime = 0;
const lookWaveAmplitude = 10;
const lookWavePeriod = 5; 
const minLookY = 8;
let maxLookY = 8;

export function startShow() {
    if (isPlaying) return;
    isPlaying = true;
    startTime = clock.getElapsedTime();

    if (window.htmlAudio) {
        window.htmlAudio.play().catch(e => console.log("Music blocked (normal on first click)"));
    }

    const overlay = document.getElementById('playOverlay');
    if (overlay) overlay.style.display = 'none';

    console.log("SHOW STARTED!");
}

function moveCamera(camera, delta) {
	const posX = camera.position.x;
	// Phase 0 — move forward
	if (moveState === 0) {
		if (posX > outerRadius) {
			camera.position.x -= 30 * delta;
			camera.position.y -= 3 * delta;
		} else {
			moveState = 1;

			// compute initial circular values once
			const dx = camera.position.x;
			const dz = camera.position.z;
			radius = camera.position.x;
			angle = Math.atan2(dz, dx);
			baseYStart = camera.position.y;
			baseBlendT = 0;
			// setup first radius transition
			setupNextRadiusTarget();
		}
	}

	// orbit + vertical oscillation + radius cycling
	if (moveState === 1) {
		orbitCamera(camera, delta);
		updateRadius(delta);
	}
}

function updateRadius(delta) {
    if (radiusBlendT < 1) {
        radiusBlendT += delta / radiusBlendDuration;
        if (radiusBlendT > 1) radiusBlendT = 1;
    }
    const t = radiusBlendT;
    const smooth = t*t*(3 - 2*t);
    radius = THREE.MathUtils.lerp(radiusStart, radiusEnd, smooth);

    if (radiusBlendT >= 1) {
        radiusDirection *= -1;
        setupNextRadiusTarget();
    }
}

function orbitCamera(camera, delta) {
	angle += rotateSpeed * delta;
	orbitTime += delta;

	// orbit position
	camera.position.x = Math.cos(angle) * radius;
	camera.position.z = Math.sin(angle) * radius;

	// vertical smooth base movement
	if (baseBlendT < 1) {
		baseBlendT += delta / baseBlendDuration;
		if (baseBlendT > 1) baseBlendT = 1;
	}
	const t = baseBlendT;
	const smooth = t*t*(3 - 2*t);
	const currentBase = THREE.MathUtils.lerp(baseYStart, baseOrbitHeight, smooth);

	// vertical oscillation wave
	const wave = Math.sin((orbitTime * 2 * Math.PI) / verticalPeriod) * verticalAmplitude;
	camera.position.y = currentBase + wave;
	updateCameraLook(camera, delta);
	maxLookY = 15;
}

function updateCameraLook(camera, delta) {
    lookTime += delta;
    // base point your camera should look at
    const baseLookY = 12;
    // wavy offset
    const wave = Math.sin((lookTime * 2 * Math.PI) / lookWavePeriod) * lookWaveAmplitude;
    let lookY = THREE.MathUtils.clamp(baseLookY + wave, minLookY, maxLookY);
    camera.lookAt(new THREE.Vector3(0, lookY, 0));
}

function setupNextRadiusTarget() {
    radiusStart = radius;
    radiusEnd = radiusDirection === -1 ? innerRadius : outerRadius;
    radiusBlendT = 0;
}

export function buildScene(scene, camera) {
	initMusic();
	lightScene(scene, camera);
	loadModel(DANCE_FLOOR_PATH, (gltf) => {
		setupDanceFloor(gltf);
		scene.add(gltf.scene);
	});

	loadModel(HEAD_BEAM, (gltf) => {
		setupHeadBeams(scene, gltf);
	});

	loadModel(DISCO_BALL, (gltf) => {
		setupDiscoBall(gltf);
		scene.add(gltf.scene);
	});

	loadModel(HEX_DANCE, (gltf) => {
		let model = setupHex(gltf);
		scene.add(model);
	});

	loadModel(FILM_SLATE, (gltf) => {
		let model = setupFilmSlate(gltf);
		filmSlate = model;
		if (gltf.animations.length > 0) {
			filmSlateMixer = addMixer(filmSlate, gltf.animations[0], true); 
			filmSlateMixer.timeScale = 0; 
			filmSlateMixer.addEventListener('finished', () => {
				animationFinished = true; 
			});
		}
		scene.add(model);
	});
	setupWalls(scene);
	setupBubbles(scene);
	addUpdater(updateBubble);
}


// Do not change function name and parameter.
// This function is called repeatedly to update the scene (for animation).
export function update(scene, camera) {
	if (!isPlaying) return;
	let delta = clock.getDelta();
	if(filmSlate) {
		let pos = filmSlate.position.z;

		if (animationFinished) {
			filmSlate.position.z -= 6 * delta; 
			if (filmSlate.position.z < -40) {
				//stop pos -100
				filmSlate.position.z = -40; 
				moveCamera(camera,delta);
			}
		} 
		else if (pos <= 0) {
			if (filmSlateMixer && !animationTriggered) {
				// start animation 
				filmSlateMixer.timeScale = 1; 
				animationTriggered = true;
			}
		}
		else if (pos > 0) {
			filmSlate.position.z -= 10 * delta;
			if (filmSlate.position.z < 0) {
				filmSlate.position.z = 0;
			}
		}
	}
	updateAnimations(delta);
}
