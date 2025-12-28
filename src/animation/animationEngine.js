import * as THREE from 'https://csc-vu.github.io/lib/three.module.js';


export const mixers = [];
export const updaters = [];

export function addMixer(target, clip, loopOnce = false) {
	const mixer = new THREE.AnimationMixer(target);
	const action = mixer.clipAction(clip);
	if(loopOnce) {
		action.loop = THREE.LoopOnce;
		action.clampWhenFinished = true;
	}
	action.play();
	mixers.push(mixer);
	return mixer;
}

export function addUpdater(fn) {
	updaters.push(fn);
}

export function updateAnimations(delta) {
	mixers.forEach(m => m.update(delta));
	updaters.forEach(u => u(delta));
}
