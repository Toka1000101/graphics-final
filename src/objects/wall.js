import * as THREE from 'https://csc-vu.github.io/lib/three.module.js';
const texLoader = new THREE.TextureLoader();

const length = 120;
const width = 120;
export function createWalls() {
	
	const walls = new THREE.Object3D();

	const discoWallpaperTexture = texLoader.load("textures/daft-punk.jpg");
	const discoWallMat = new THREE.MeshPhongMaterial( { map: discoWallpaperTexture , side: THREE.DoubleSide } );
	const discoWallGeom = new THREE.PlaneGeometry(length, width);
	const discoWall = new THREE.Mesh(discoWallGeom, discoWallMat);
	walls.add(discoWall);

	discoWall.rotation.y = Math.PI/2;
	discoWall.position.x = -width/2;
	discoWall.position.y = length/2;

	return walls;
}
