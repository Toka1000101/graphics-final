import * as THREE from 'https://csc-vu.github.io/lib/three.module.js';
import { addMixer } from './animationEngine.js';

const keyTimes = [0, 1, 2, 3, 4];
const supportOffset = Math.PI / 12;
const headOffset = Math.PI / 6;

export function animateBeams(beams) {
	const bottomLeftSupport  = getSupport(beams[0]);
	const bottomLeftHead     = getHead(beams[0]);

	const topLeftSupport     = getSupport(beams[1]);
	const topLeftHead        = getHead(beams[1]);

	const bottomRightSupport = getSupport(beams[2]);
	const bottomRightHead    = getHead(beams[2]);

	const topRightSupport    = getSupport(beams[3]);
	const topRightHead       = getHead(beams[3]);

	bottomLeftSupport.name  = 'bottomLeftSupport';
	bottomLeftHead.name     = 'bottomLeftHead';
	topLeftSupport.name     = 'topLeftSupport';
	topLeftHead.name        = 'topLeftHead';
	bottomRightSupport.name = 'bottomRightSupport';
	bottomRightHead.name    = 'bottomRightHead';
	topRightSupport.name    = 'topRightSupport';
	topRightHead.name       = 'topRightHead';

	const blSupportZ = [
		Math.PI/4 + supportOffset,
		Math.PI/4 - supportOffset, 
		Math.PI/4 + supportOffset,
		Math.PI/4 - supportOffset, 
		Math.PI/4 + supportOffset
	];
	const blHeadX    = [
		-Math.PI/2 + headOffset, 
		-Math.PI/2 - headOffset, 
		-Math.PI/2 + headOffset, 
		-Math.PI/2 - headOffset, 
		-Math.PI/2 + headOffset
	];

	const tlSupportZ = [
		-Math.PI/4 - supportOffset, 
		-Math.PI/4 + supportOffset, 
		-Math.PI/4 - supportOffset, 
		-Math.PI/4 + supportOffset, 
		-Math.PI/4 - supportOffset
	];
	const tlHeadX    = [
		-Math.PI/2 + headOffset, 
		-Math.PI/2 - headOffset, 
		-Math.PI/2 + headOffset, 
		-Math.PI/2 - headOffset, 
		-Math.PI/2 + headOffset
	];

	const brSupportZ = [
		3*Math.PI/4 + supportOffset, 
		3*Math.PI/4 - supportOffset, 
		3*Math.PI/4 + supportOffset, 
		3*Math.PI/4 - supportOffset, 
		3*Math.PI/4 + supportOffset
	];
	const brHeadX    = [
		-Math.PI/2 + headOffset, 
		-Math.PI/2 - headOffset, 
		-Math.PI/2 + headOffset, 
		-Math.PI/2 - headOffset, 
		-Math.PI/2 + headOffset
	];

	const trSupportZ = [
		-3*Math.PI/4 - supportOffset, 
		-3*Math.PI/4 + supportOffset, 
		-3*Math.PI/4 - supportOffset, 
		-3*Math.PI/4 + supportOffset, 
		-3*Math.PI/4 - supportOffset
	];
	const trHeadX    = [
		-Math.PI/2 + headOffset, 
		-Math.PI/2 - headOffset, 
		-Math.PI/2 + headOffset, 
		-Math.PI/2 - headOffset, 
		-Math.PI/2 + headOffset
	];
	// Tracks
	const blSupportTrack = new THREE.NumberKeyframeTrack('bottomLeftSupport.rotation[z]', keyTimes, blSupportZ);
	const blHeadTrack    = new THREE.NumberKeyframeTrack('bottomLeftHead.rotation[x]', keyTimes, blHeadX);

	const tlSupportTrack = new THREE.NumberKeyframeTrack('topLeftSupport.rotation[z]', keyTimes, tlSupportZ);
	const tlHeadTrack    = new THREE.NumberKeyframeTrack('topLeftHead.rotation[x]', keyTimes, tlHeadX);

	const brSupportTrack = new THREE.NumberKeyframeTrack('bottomRightSupport.rotation[z]', keyTimes, brSupportZ);
	const brHeadTrack    = new THREE.NumberKeyframeTrack('bottomRightHead.rotation[x]', keyTimes, brHeadX);

	const trSupportTrack = new THREE.NumberKeyframeTrack('topRightSupport.rotation[z]', keyTimes, trSupportZ);
	const trHeadTrack    = new THREE.NumberKeyframeTrack('topRightHead.rotation[x]', keyTimes, trHeadX);

	// adding to mixer
	addMixer(bottomLeftSupport, new THREE.AnimationClip('blSupportClip', -1, [blSupportTrack]));
	addMixer(bottomLeftHead,    new THREE.AnimationClip('blHeadClip', -1, [blHeadTrack]));

	addMixer(topLeftSupport, new THREE.AnimationClip('tlSupportClip', -1, [tlSupportTrack]));
	addMixer(topLeftHead,    new THREE.AnimationClip('tlHeadClip', -1, [tlHeadTrack]));

	addMixer(bottomRightSupport, new THREE.AnimationClip('brSupportClip', -1, [brSupportTrack]));
	addMixer(bottomRightHead,    new THREE.AnimationClip('brHeadClip', -1, [brHeadTrack]));

	addMixer(topRightSupport, new THREE.AnimationClip('trSupportClip', -1, [trSupportTrack]));
	addMixer(topRightHead,    new THREE.AnimationClip('trHeadClip', -1, [trHeadTrack]));
}

export function getSupport(beam) {
	return beam.children[0].children[0].children[1].children[0];
}

export function getHead(beam) {
	return beam.children[0].children[0].children[1].children[0].children[0];
}
