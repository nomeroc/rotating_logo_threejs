import * as THREE from 'three';

export function createScene() {
  const scene = new THREE.Scene();
  // keep transparent background because renderer alpha:true
  return scene;
}
