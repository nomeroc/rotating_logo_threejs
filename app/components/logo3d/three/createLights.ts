import * as THREE from 'three';

export function createLights() {
  const lights = new THREE.Group();

  const top = new THREE.DirectionalLight(0xffffff, 3.2);
  top.position.set(0.0, 6.0, 2.0);
  top.target.position.set(0, 0.8, 0);
  lights.add(top);
  lights.add(top.target);

  const bottom = new THREE.DirectionalLight(0xffffff, 1.5);
  bottom.position.set(0.0, -6.0, 2.0);
  bottom.target.position.set(0, -0.8, 0);
  lights.add(bottom);
  lights.add(bottom.target);

  const leftKick = new THREE.DirectionalLight(0xcfe0ff, 1.8);
  leftKick.position.set(-6.0, 1.8, 3.2);
  leftKick.target.position.set(0, 0.9, 0);
  lights.add(leftKick);
  lights.add(leftKick.target);

  const rightKick = new THREE.DirectionalLight(0xffe1d3, 2.2);
  rightKick.position.set(6.0, 1.2, 2.4);
  rightKick.target.position.set(0, 0.7, 0);
  lights.add(rightKick);
  lights.add(rightKick.target);

  const rim = new THREE.DirectionalLight(0xffffff, 2.6);
  rim.position.set(0.0, 2.8, -7.0);
  rim.target.position.set(0, 0.9, 0);
  lights.add(rim);
  lights.add(rim.target);

  const glint = new THREE.PointLight(0xffffff, 28, 18, 2);
  glint.position.set(1.8, 2.4, 3.8);
  lights.add(glint);

  const frontBounce = new THREE.DirectionalLight(0xffffff, 0.35);
  frontBounce.position.set(0.0, 0.6, 5.5);
  frontBounce.target.position.set(0, 0.7, 0);
  lights.add(frontBounce);
  lights.add(frontBounce.target);

  return lights;
}
