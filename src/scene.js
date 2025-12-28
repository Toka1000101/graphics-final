import { GLTFLoader } from 'https://csc-vu.github.io/lib/GLTFLoader.js';
import * as THREE from 'https://csc-vu.github.io/lib/three.module.js';
import { animateBeams } from './animation/beamsAnimation.js';
import { addMixer } from './animation/animationEngine.js';
import { getHead, getSupport } from './animation/beamsAnimation.js';
import { createWalls } from './objects/wall.js';
import { addUpdater } from './animation/animationEngine.js';
export const DANCE_FLOOR_PATH = 'assets/dance_floor_two.glb';
export const HEAD_BEAM = 'assets/head_beam.glb';
export const DISCO_BALL = 'assets/disco_ball_two.glb';
export const HEX_DANCE = 'assets/hexagon_dance.glb';
export const ROBOT_ARM = 'assets/robot_arm.glb'; 
export const FILM_SLATE = 'assets/film_slate.glb';
const ROT_SPEED = 0.5;

export function setupFilmSlate(gltf) {
	let model = gltf.scene;
	model.scale.set(5,5,5);
	model.position.set(360, 30, 50); 
	return model;
}

export function setupRobotArm(gltf) {
	let model = gltf.scene;
	model.scale.set(10,10,10);
	return model;
}

export function setupHex(gltf) {
	let model = gltf.scene;
	model.scale.set(10,10,10);
	model.rotation.y = Math.PI/2;
	// model.position.z = 20;
	const clip = gltf.animations[0];
	addMixer(model, clip);
	console.log(gltf);
	return model;
}

export function setupDanceFloor(gltf) {
	let model = gltf.scene;
	model.scale.set(2.5,2.5,2.5);
	model.position.z = -60;
	model.position.x = 60;
	model.position.y = -5;
}

export function setupWalls(scene) {
	let walls = createWalls(scene);
	scene.add(walls);
}
export function setupHeadBeams(scene, gltf) {
	let model = gltf.scene;
	const positions = [
		{ x: 50,  y: 0, z: 50 },  
		{ x: -50, y: 0, z: 50 },   
		{ x: 50,  y: 0, z: -50 },  
		{ x: -50, y: 0, z: -50 }
	];

	let beams = [];
	positions.forEach((pos) => {
		const beam = model.clone(true); 
		beam.position.set(pos.x, pos.y, pos.z);
		beam.scale.set(20, 20, 20);
		let head = getHead(beam); 

		const spotLight = new THREE.SpotLight(0xffffff, 100, 100, Math.PI/8, 0.1, 2);

		spotLight.position.set(0,0,0);
		head.add(spotLight);

		const localTarget = new THREE.Object3D();
		localTarget.position.set(0, 0, 10);
		head.add(localTarget);
		spotLight.target = localTarget;
		spotLight.target.updateMatrixWorld();

		scene.add(beam);
		beams.push(beam);
	});
	animateBeams(beams);
}


export function setupDiscoBall(gltf) {
	let model = gltf.scene;
	model.receiveShadow = true;
	model.position.y += 40;
	model.scale.set(20,20,20)
	const spinModel = (delta) => {
        model.rotation.y += delta * ROT_SPEED;
    };
    // 2. Register the local function with the animation engine
    addUpdater(spinModel);
}

export function loadModel(path, onLoad) {
  const loader = new GLTFLoader();
  loader.load(
		path, 
		(gltf) => onLoad(gltf),
		(progress) => console.log('Loading:', (progress.loaded / progress.total * 100) + '%'),
		(error) => console.error('Load error:', error)
	);
}
