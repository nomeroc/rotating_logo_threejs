import * as THREE from 'three';

export function fitCameraToObject(
  camera: THREE.PerspectiveCamera,
  object: THREE.Object3D,
  distanceMultiplier = 1.5
) {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  box.getSize(size);

  const maxDim = Math.max(size.x, size.y, size.z);
  const fovRad = THREE.MathUtils.degToRad(camera.fov);
  const dist = maxDim / 2 / Math.tan(fovRad / 2);

  camera.position.set(0, 0, dist * distanceMultiplier);
  camera.near = dist / 100;
  camera.far = dist * 100;
  camera.updateProjectionMatrix();
}
