'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import styles from './Logo.module.css';
import { transmission } from 'three/tsl';

// ─────────────────────────────────────────────────────────────────────────────

export default function Logo() {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // MATERIALS

        // ─── MATERIALS ───────────────────────────────────────────────────────────────

        const TexLoader = new THREE.TextureLoader();
        const grungeTex = TexLoader.load('textures/grunge_1.jpg');

        // Roughness maps should be treated as non-color data:
        grungeTex.colorSpace = THREE.NoColorSpace; // r152+ (older: grungeTex.encoding = THREE.LinearEncoding)
        grungeTex.wrapS = grungeTex.wrapT = THREE.RepeatWrapping;
        grungeTex.repeat.set(1, 1); // adjust if you want more/less grunge scale

        // MAIN — pearlescent shimmer (MeshPhysicalMaterial with iridescence)
        const mainMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xfff0fa,
            emissive: 0x000000,
            emissiveIntensity: 0.0,

            metalness: 0.25,
            roughness: 0.22,
            roughnessMap: grungeTex,

            ior: 1.52,
            reflectivity: 0.92,

            specularIntensity: 1.0,
            specularColor: new THREE.Color(0xffffff),

            iridescence: 0.75,
            iridescenceIOR: 1.35,
            iridescenceThicknessRange: [120, 1200],

            clearcoat: 0.55,
            clearcoatRoughness: 0.05,

            sheen: 0.35,
            sheenRoughness: 0.35,
            sheenColor: new THREE.Color(0xffc6e6),
        });

        // INSIDE — frosted glass (transmission-based)
        const insideMaterial = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(0xffffff),

            metalness: 0.0,
            roughness: .7,
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

        // SCENE
        const scene = new THREE.Scene();

        // CAMERA
        const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);

        // RENDERER — physicallyCorrectLights needed for transmission materials
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;

        container.appendChild(renderer.domElement);

        // ── 3-POINT LIGHTING ─────────────────────────────────────────────────

        const lights = new THREE.Group();
        scene.add(lights);

        // // Soft base ambience (keep low — envMap + glossy materials need contrast)
        // const hemi = new THREE.HemisphereLight(0xffffff, 0x1a1026, 0.35);
        // lights.add(hemi);

        // TOP STRIP (main highlight band)
        const top = new THREE.DirectionalLight(0xffffff, 3.2);
        top.position.set(0.0, 6.0, 2.0);
        top.target.position.set(0, 0.8, 0);
        scene.add(top.target);
        lights.add(top);

        // TOP STRIP (main highlight band)
        const bottom = new THREE.DirectionalLight(0xffffff, 1.5);
        bottom.position.set(0.0, -6.0, 2.0);
        bottom.target.position.set(0, -0.8, 0);
        scene.add(bottom.target);
        lights.add(bottom);

        // LEFT KICK (cool)
        const leftKick = new THREE.DirectionalLight(0xcfe0ff, 1.8);
        leftKick.position.set(-6.0, 1.8, 3.2);
        leftKick.target.position.set(0, 0.9, 0);
        scene.add(leftKick.target);
        lights.add(leftKick);

        // RIGHT KICK (warm, slightly stronger for “premium” highlight)
        const rightKick = new THREE.DirectionalLight(0xffe1d3, 2.2);
        rightKick.position.set(6.0, 1.2, 2.4);
        rightKick.target.position.set(0, 0.7, 0);
        scene.add(rightKick.target);
        lights.add(rightKick);

        // HARD RIM (silhouette outline + shimmer trigger)
        const rim = new THREE.DirectionalLight(0xffffff, 2.6);
        rim.position.set(0.0, 2.8, -7.0);
        rim.target.position.set(0, 0.9, 0);
        scene.add(rim.target);
        lights.add(rim);

        // SMALL GLINT (sparkle point)
        const glint = new THREE.PointLight(0xffffff, 28, 18, 2);
        glint.position.set(1.8, 2.4, 3.8);
        lights.add(glint);

        // Optional: tiny front bounce (only if it gets too contrasty)
        const frontBounce = new THREE.DirectionalLight(0xffffff, 0.35);
        frontBounce.position.set(0.0, 0.6, 5.5);
        frontBounce.target.position.set(0, 0.7, 0);
        scene.add(frontBounce.target);
        lights.add(frontBounce);

        // Debug helpers toggle
        const showHelpers = false;
        if (showHelpers) {
            lights.add(new THREE.DirectionalLightHelper(top, 0.6));
            lights.add(new THREE.DirectionalLightHelper(leftKick, 0.6));
            lights.add(new THREE.DirectionalLightHelper(rightKick, 0.6));
            lights.add(new THREE.DirectionalLightHelper(rim, 0.6));
            lights.add(new THREE.PointLightHelper(glint, 0.2));
        }
        

        // ─────────────────────────────────────────────────────────────────────

        // LOAD MODEL
        let mixer: THREE.AnimationMixer | null = null;
        const loader = new GLTFLoader();

        loader.load('/models/logo.glb', (gltf) => {
            const model = gltf.scene;

            // APPLY MATERIALS — names match your Blender outliner exactly
            model.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    if (child.name === 'Main'){
                        child.material = mainMaterial
                        child.castShadow = false;
                    };
                    if (child.name === 'Inside'){
                        child.material = insideMaterial
                        child.castShadow = false;
                    };
                }
            });

            // CENTER MODEL
            const box = new THREE.Box3().setFromObject(model);
            const center = new THREE.Vector3();
            box.getCenter(center);
            model.position.sub(center);

            // FIT CAMERA
            const size = new THREE.Vector3();
            box.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);
            const fovRad = THREE.MathUtils.degToRad(camera.fov);
            const dist = maxDim / 2 / Math.tan(fovRad / 2);
            camera.position.set(0, 0, dist * 1.5);
            camera.near = dist / 100;
            camera.far = dist * 100;
            camera.updateProjectionMatrix();

            scene.add(model);

            // ANIMATION
            mixer = new THREE.AnimationMixer(model);
            gltf.animations.forEach((clip) => mixer!.clipAction(clip).play());
        });

        // CLOCK
        const clock = new THREE.Clock();

        // RESIZE
        const onResize = () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener('resize', onResize);

        // RENDER LOOP
        let animId: number;
        const animate = () => {
            animId = requestAnimationFrame(animate);
            mixer?.update(clock.getDelta());
            renderer.render(scene, camera);
        };
        animate();

        // CLEANUP
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', onResize);
            container.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return (
        <div
            className={styles.logo}
            ref={containerRef}
        />
    );
}
