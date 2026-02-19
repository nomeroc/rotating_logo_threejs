import * as THREE from 'three';
import { createScene } from './createScene';
import { createCamera } from './createCamera';
import { createRenderer } from './createRenderer';
import { createLights } from './createLights';
import { createMaterials } from './createMaterials';
import { loadLogo } from './loadLogo';
import { startLoop } from './loop';
import { disposeAll } from './dispose';

export function initLogo3D(container: HTMLDivElement) {
  const scene = createScene();
  const camera = createCamera(container);
  const renderer = createRenderer(container);

  const lights = createLights();
  scene.add(lights);

  const { mainMaterial, insideMaterial, textures } = createMaterials();

  let mixer: THREE.AnimationMixer | null = null;
  let model: THREE.Object3D | null = null;

  // Load model async
  loadLogo({
    url: '/models/logo.glb',
    mainMaterial,
    insideMaterial,
    camera,
    scene,
  }).then((res) => {
    model = res.model;
    mixer = res.mixer;
  });

  const stop = startLoop({ renderer, scene, camera, getMixer: () => mixer });

  const onResize = () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  window.addEventListener('resize', onResize);

  function dispose() {
    stop();
    window.removeEventListener('resize', onResize);

    // Remove canvas
    if (renderer.domElement.parentElement === container) {
      container.removeChild(renderer.domElement);
    }

    // Dispose GPU resources (geometries, textures, materials)
    disposeAll({
      scene,
      renderer,
      extraMaterials: [mainMaterial, insideMaterial],
      extraTextures: textures,
    });
  }

  return { dispose };
}
