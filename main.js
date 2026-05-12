import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { setupControls } from './controls.js';
import { createHUD } from './hud.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.001, 500);
camera.position.set(0, 2, 35);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const { controls, moveCamera } = setupControls(camera, renderer);

const mat = {
    ledBottom: new THREE.MeshStandardMaterial({ color: 0x00aaff, emissive: 0x0088ff, emissiveIntensity: 6.0, roughness: 0.1 }),
    ledMid: new THREE.MeshStandardMaterial({ color: 0x00ccff, emissive: 0x0099ff, emissiveIntensity: 5.0, roughness: 0.1 }),
    ledTop: new THREE.MeshStandardMaterial({ color: 0x00aaff, emissive: 0x0088ff, emissiveIntensity: 5.0, roughness: 0.1 }),
    plafond: new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xccddff, emissiveIntensity: 4.0, roughness: 0.2, metalness: 0.3, side: THREE.DoubleSide }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0xaaddff, roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.15, depthWrite: false, side: THREE.DoubleSide }),
};

scene.add(new THREE.AmbientLight(0xffffff, 0.8));
scene.add(new THREE.DirectionalLight(0xffffff, 2.5)).position.set(30, 20, 20);

new THREE.TextureLoader().load('city_panorama.png', (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter; texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.wrapS = THREE.RepeatWrapping; texture.repeat.set(8, 1);
    const d = new THREE.Mesh(new THREE.CylinderGeometry(21, 21, 6, 256, 1, true), new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide, transparent: true, opacity: 0.85 }));
    d.position.y = 0; d.rotation.y = -720 * Math.PI/180; d.name = 'qasar_sky'; scene.add(d);
}, undefined, (err) => console.error('❌', err));

[{g:new THREE.TorusGeometry(19.2,0.06,16,512),m:mat.ledBottom,y:-2.4,n:'qasar_led_bottom'},
 {g:new THREE.TorusGeometry(9.0,0.08,16,256),m:mat.ledMid,y:2.4,n:'qasar_led_mid'},
 {g:new THREE.TorusGeometry(19.2,0.06,16,512),m:mat.ledTop,y:2.4,n:'qasar_led_top'}].forEach(r=>{
    const m=new THREE.Mesh(r.g,r.m); m.rotation.x=Math.PI/2; m.position.y=r.y; m.name=r.n; scene.add(m);
});

const plafond=new THREE.Mesh(new THREE.CircleGeometry(3.0,64),mat.plafond);
plafond.rotation.x=-Math.PI/2; plafond.position.y=2.35; plafond.name='qasar_plafond'; scene.add(plafond);
const plafondLight=new THREE.PointLight(0xccddff,5.0,30); plafondLight.position.y=2.3; plafondLight.name='qasar_plafond_light'; scene.add(plafondLight);

[19.2, 19.4].forEach((r, i) => {
    scene.add(new THREE.Mesh(new THREE.CylinderGeometry(r, r, 2.458, 256, 1, true), mat.glass))
        .name = i === 0 ? 'qasar_glass_inner' : 'qasar_glass_outer';
});

createHUD(scene);

console.log('🏙️ QASAR v0.2.4 — текстуры в GLB');
new GLTFLoader().load('qasar_room.glb', gltf => {
    const model = gltf.scene;
    model.name = 'qasar_room';
    model.traverse(c => { if (c.isMesh && c.material) (Array.isArray(c.material)?c.material:[c.material]).forEach(x => {
        x.side = THREE.DoubleSide;
    }); });
    scene.add(model);

    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    camera.position.set(center.x, center.y, center.z + 4);
    controls.target.copy(center);
    controls.update();
    console.log('✅ QASAR v0.2.4');
}, p=>{if(Math.round(p.loaded/p.total*100)%25===0)console.log(`⬇️${Math.round(p.loaded/p.total*100)}%`)}, e=>console.error('❌',e.message));

const clock=new THREE.Clock();
function animate(){
    requestAnimationFrame(animate);
    moveCamera(clock.getDelta());
    const t = clock.getElapsedTime();
    ['qasar_led_bottom','qasar_led_mid','qasar_led_top','qasar_plafond'].forEach(n=>{
        const o=scene.getObjectByName(n);
        if(o&&o.material.emissiveIntensity!==undefined) o.material.emissiveIntensity = (n.includes('bottom')?6:n.includes('plafond')?4:5) + Math.sin(t*2.5+n.length)*1.5;
    });
    if(plafondLight)plafondLight.intensity=5.0+Math.sin(t*2.0)*2.0;
    controls.update();
    renderer.render(scene,camera);
}
animate();

window.addEventListener('resize',()=>{
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
});