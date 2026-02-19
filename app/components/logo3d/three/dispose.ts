import * as THREE from 'three';

export function disposeAll(opts: {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  extraMaterials?: THREE.Material[];
  extraTextures?: THREE.Texture[];
}) {
  // dispose objects inside scene
  opts.scene.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.geometry?.dispose?.();

      const mat = obj.material;
      if (Array.isArray(mat)) mat.forEach(disposeMaterial);
      else if (mat) disposeMaterial(mat);
    }
  });

  // dispose “external” resources you created
  opts.extraMaterials?.forEach(disposeMaterial);
  opts.extraTextures?.forEach((t) => t.dispose());

  // renderer + internal caches
  opts.renderer.renderLists.dispose();
  opts.renderer.dispose();
}

function disposeMaterial(mat: THREE.Material) {
  // dispose any textures on the material
  for (const key in mat) {
    const value = (mat as any)[key];
    if (value instanceof THREE.Texture) value.dispose();
  }
  mat.dispose();
}
