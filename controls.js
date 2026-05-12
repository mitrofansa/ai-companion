import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function setupControls(camera, renderer) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI;
    controls.minDistance = 0.0;
    controls.maxDistance = 200;
    controls.zoomSpeed = 5.0;
    controls.rotateSpeed = 0.8;
    controls.panSpeed = 2.0;
    controls.screenSpacePanning = true;
    controls.enableZoom = true;
    controls.zoomToCursor = true;
    controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };
    controls.update();

    const keys = {};
    document.addEventListener('keydown', (e) => {
        const k = e.key.toLowerCase();
        // Английские и русские клавиши
        if (k === 'w' || k === 'ц') keys['w'] = true;
        if (k === 'a' || k === 'ф') keys['a'] = true;
        if (k === 's' || k === 'ы') keys['s'] = true;
        if (k === 'd' || k === 'в') keys['d'] = true;
    });
    document.addEventListener('keyup', (e) => {
        const k = e.key.toLowerCase();
        if (k === 'w' || k === 'ц') keys['w'] = false;
        if (k === 'a' || k === 'ф') keys['a'] = false;
        if (k === 's' || k === 'ы') keys['s'] = false;
        if (k === 'd' || k === 'в') keys['d'] = false;
    });

    function moveCamera(delta) {
        const speed = 15 * delta;
        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);
        dir.y = 0; dir.normalize();
        const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0,1,0)).normalize();
        if (keys['w']) { camera.position.addScaledVector(dir, speed); controls.target.addScaledVector(dir, speed); }
        if (keys['s']) { camera.position.addScaledVector(dir, -speed); controls.target.addScaledVector(dir, -speed); }
        if (keys['a']) { camera.position.addScaledVector(right, -speed); controls.target.addScaledVector(right, -speed); }
        if (keys['d']) { camera.position.addScaledVector(right, speed); controls.target.addScaledVector(right, speed); }
    }

    return { controls, moveCamera };
}