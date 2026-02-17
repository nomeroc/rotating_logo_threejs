'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function Logo3D() {
    const hostRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const host = hostRef.current;
        if (!host) return;

        // --- Scene ---
        const scene = new THREE.Scene();
        scene.background = null;

        // --- Camera ---
        const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 200);
        camera.position.set(0, 0, 4);

        // --- Renderer ---
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;

        host.appendChild(renderer.domElement);

        // --- Lights ---
        scene.add(new THREE.AmbientLight(0xffffff, 1.0));
        const dir = new THREE.DirectionalLight(0xffffff, 2.0);
        dir.position.set(3, 4, 5);
        scene.add(dir);

        // --- Load GLB ---
        const loader = new GLTFLoader();
        let root: THREE.Object3D | null = null;

        loader.load(
            '/models/logo.glb',
            (gltf) => {
                root = gltf.scene;
                scene.add(root);

                // center + fit camera
                const box = new THREE.Box3().setFromObject(root);
                const size = new THREE.Vector3();
                const center = new THREE.Vector3();
                box.getSize(size);
                box.getCenter(center);

                root.position.sub(center);

                const maxSize = Math.max(size.x, size.y, size.z);
                const fitDist = maxSize / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)));
                camera.position.set(0, 0, fitDist * 1.4);
                camera.near = fitDist / 100;
                camera.far = fitDist * 100;
                camera.updateProjectionMatrix();
            },
            undefined,
            (err) => console.error('GLB load error:', err),
        );

        // --- Resize ---
        const resize = () => {
            const r = host.getBoundingClientRect();
            const w = Math.max(1, r.width);
            const h = Math.max(1, r.height);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h, false);
        };

        const ro = new ResizeObserver(resize);
        ro.observe(host);
        resize();

        // --- Render loop ---
        let raf = 0;
        const tick = () => {
            if (root) root.rotation.y += 0.01;
            renderer.render(scene, camera);
            raf = requestAnimationFrame(tick);
        };
        tick();

        // --- Cleanup ---
        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            renderer.dispose();
            if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div
            ref={hostRef}
            style={{ width: '100%', height: '100%' }}
        />
    );
}
