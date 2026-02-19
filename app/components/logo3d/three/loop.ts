import * as THREE from 'three';

export function startLoop(opts: {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.Camera;
  getMixer: () => THREE.AnimationMixer | null;
}) {
  const clock = new THREE.Clock();
  let raf = 0;

  const tick = () => {
    raf = requestAnimationFrame(tick);
    const dt = clock.getDelta();
    opts.getMixer()?.update(dt);
    opts.renderer.render(opts.scene, opts.camera);
  };

  tick();

  return function stop() {
    cancelAnimationFrame(raf);
  };
}
