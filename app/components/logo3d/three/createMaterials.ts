import * as THREE from 'three';

export function createMaterials() {
  const texLoader = new THREE.TextureLoader();
  const grungeTex = texLoader.load('/textures/grunge_1.jpg');

  grungeTex.colorSpace = THREE.NoColorSpace;
  grungeTex.wrapS = grungeTex.wrapT = THREE.RepeatWrapping;
  grungeTex.repeat.set(1, 1);

  const mainMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    emissive: 0x000000,
    emissiveIntensity: 0.0,

    metalness: 0.25,
    roughness: 0.22,
    roughnessMap: grungeTex,

    ior: 1.52,
    reflectivity: 0.92,

    specularIntensity: 1.0,
    specularColor: new THREE.Color(0xffffff),

    clearcoat: 0.55,
    clearcoatRoughness: 0.05,

    sheen: 0.35,
    sheenRoughness: 0.35,
    sheenColor: new THREE.Color(0xffc6e6),
  });

  const insideMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xffffff),

    metalness: 0.0,
    roughness: 0.7,
    roughnessMap: grungeTex,

    transmission: 1.0,
    ior: 1.65,
    thickness: 0.1,

    transparent: true,
    opacity: 1.0,

    attenuationColor: new THREE.Color(0xffffff),
    attenuationDistance: 0.6,

    specularIntensity: 1.0,
    specularColor: new THREE.Color(0xffffff),

    sheen: 0.05,
    sheenRoughness: 0.8,
    sheenColor: new THREE.Color(0xffffff),

    side: THREE.DoubleSide,
    dispersion: 0.7,
  });

  return {
    mainMaterial,
    insideMaterial,
    textures: [grungeTex],
  };
}
