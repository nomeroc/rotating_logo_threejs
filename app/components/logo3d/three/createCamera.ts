import * as THREE from 'three';

export function createCamera(container: HTMLElement) {
  const camera = new THREE.PerspectiveCamera(
    50,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  return camera;
}
