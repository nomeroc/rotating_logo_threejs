import * as THREE from 'three';

export function createRenderer(container: HTMLElement) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  // helps physical materials behave correctly
//   renderer.physicallyCorrectLights = true;

  container.appendChild(renderer.domElement);
  return renderer;
}
