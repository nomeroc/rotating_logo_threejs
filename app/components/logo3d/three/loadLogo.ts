import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { fitCameraToObject } from './fitCamera';

type Args = {
  url: string;
  mainMaterial: THREE.Material;
  insideMaterial: THREE.Material;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
};

export async function loadLogo({ url, mainMaterial, insideMaterial, camera, scene }: Args) {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(url);

  const model = gltf.scene;

  model.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child.name === 'Main') child.material = mainMaterial;
      if (child.name === 'Inside') child.material = insideMaterial;
      child.castShadow = false;
      child.receiveShadow = false;
    }
  });

  // center model
  const box = new THREE.Box3().setFromObject(model);
  const center = new THREE.Vector3();
  box.getCenter(center);
  model.position.sub(center);

  scene.add(model);

  // fit camera
  fitCameraToObject(camera, model, 1.5);

  // animations
  let mixer: THREE.AnimationMixer | null = null;
  if (gltf.animations?.length) {
    mixer = new THREE.AnimationMixer(model);
    gltf.animations.forEach((clip) => mixer!.clipAction(clip).play());
  }

  return { model, mixer };
}
