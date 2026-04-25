
import * as THREE from 'three';

const container = document.getElementById('three-hero-container');

// --- 1. Scene Setup ---
const scene = new THREE.Scene();
// Removed fog to allow clean daisyUI theme background matching

// --- 2. Camera Setup ---
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
camera.position.set(0, 2, 16);

// --- 3. Renderer Setup ---
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.domElement.style.width = '100%';
renderer.domElement.style.height = '100%';
container.appendChild(renderer.domElement);

// --- 4. Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffeedd, 8);
spotLight.position.set(5, 12, 8);
spotLight.angle = Math.PI / 3;
spotLight.penumbra = 0.8;
spotLight.decay = 2;
spotLight.distance = 50;
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.bias = -0.0005;
scene.add(spotLight);

const fillLight = new THREE.DirectionalLight(0xaaccff, 2.0);
fillLight.position.set(-8, 4, -5);
scene.add(fillLight);

// --- 4b. Studio Floor ---
const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.12 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -3.5;
floor.receiveShadow = true;
scene.add(floor);

// --- 4c. Orbiting Highlight (Magic Spark) ---
const magicLight = new THREE.PointLight(0xffdd88, 3, 10);
scene.add(magicLight);

// --- 4d. Ambient Dust Particles ---
const dustCount = 400;
const dustGeom = new THREE.BufferGeometry();
const dustPos = new Float32Array(dustCount * 3);
const dustSpeeds = new Float32Array(dustCount);
for(let i=0; i<dustCount; i++) {
    dustPos[i*3] = (Math.random() - 0.5) * 20;
    dustPos[i*3+1] = (Math.random() - 0.5) * 20;
    dustPos[i*3+2] = (Math.random() - 0.5) * 15;
    dustSpeeds[i] = 0.1 + Math.random() * 0.3;
}
dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
dustGeom.setAttribute('speed', new THREE.BufferAttribute(dustSpeeds, 1));
const dustMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.03,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
});
const dustSystem = new THREE.Points(dustGeom, dustMat);
scene.add(dustSystem);

// --- 5. Objects ---
const fabricCount = 200;
const fabrics = [];
const fabricGroup = new THREE.Group();

// Check if mobile based on container width and position accordingly
function updateModelPosition() {
    if (window.innerWidth < 768) {
        fabricGroup.position.x = 0; // Center X on mobile
        fabricGroup.position.y = 1.0; // Lift model up slightly so it clears text at bottom
    } else {
        fabricGroup.position.x = 0; // Right side X on desktop
        fabricGroup.position.y = 0; // Reset height
    }
}
updateModelPosition();

scene.add(fabricGroup);

// Saffron, White, and Green color palette
const colors = [
    0xFF9933, // Saffron
    0xFFa850, // Lighter Saffron
    0xFFFFFF, // Bright White
    0xEEEEEE, // Off-White
    0x138808, // India Green
    0x1b9e10  // Lighter Green
];

function getGarmentPosition() {
    const type = Math.random();
    let x, y, z;
    const torsoWidth = 2.4;
    const torsoHeight = 3.8;
    const depth = 0.6;

    if (type < 0.70) {
        x = (Math.random() - 0.5) * torsoWidth;
        y = (Math.random() - 0.5) * torsoHeight;
        if (y > torsoHeight / 2 - 0.7 && Math.abs(x) < 0.7) {
            y -= 0.8;
        }
        const taper = (y + torsoHeight/2) / torsoHeight;
        x *= 0.9 + taper * 0.1;
        z = (Math.random() > 0.5 ? 1 : -1) * (depth / 2);
        z += Math.cos((x / torsoWidth) * Math.PI) * 0.3 * Math.sign(z);
    } else {
        const isLeft = type < 0.85;
        const dir = isLeft ? -1 : 1;
        const shoulderX = dir * (torsoWidth / 2 - 0.1);
        const shoulderY = torsoHeight / 2 - 0.1;
        const sleeveLength = 1.5;
        const progress = Math.random();
        x = shoulderX + dir * progress * (sleeveLength * 0.9);
        y = shoulderY - progress * (sleeveLength * 0.5);
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.4 - (progress * 0.1);
        y += Math.sin(angle) * (radius * 1.2);
        z = Math.cos(angle) * radius;
    }
    return new THREE.Vector3(x, y, z);
}

for (let i = 0; i < fabricCount; i++) {
    const geometry = new THREE.PlaneGeometry(
        Math.random() * 0.6 + 0.3,
        Math.random() * 0.6 + 0.3,
        4, 4
    );
    const positions = geometry.attributes.position;
    for (let j = 0; j < positions.count; j++) {
        positions.setZ(j, positions.getZ(j) + (Math.random() - 0.5) * 0.3);
        positions.setX(j, positions.getX(j) + (Math.random() - 0.5) * 0.2);
        positions.setY(j, positions.getY(j) + (Math.random() - 0.5) * 0.2);
    }
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        roughness: 0.9,
        metalness: 0.05,
        side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const targetPos = getGarmentPosition();
    const targetRot = new THREE.Euler(
        (Math.random() - 0.5) * 0.3,
        targetPos.x * 0.2,
        (Math.random() - 0.5) * 0.3
    );

    const startRadius = 8 + Math.random() * 6;
    const startAngle = Math.random() * Math.PI * 2;
    const startPos = new THREE.Vector3(
        Math.cos(startAngle) * startRadius,
        (Math.random() - 0.5) * 15 + 5,
        Math.sin(startAngle) * startRadius
    );

    const startRot = new THREE.Euler(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
    );

    mesh.position.copy(startPos);
    mesh.rotation.copy(startRot);

    fabrics.push({
        mesh, startPos, targetPos, startRot, targetRot,
        randomOffset: Math.random() * Math.PI * 2,
        speed: 0.8 + Math.random() * 0.4
    });

    fabricGroup.add(mesh);
}

// --- 6. Magical Glowing Stitches / Threads ---
const threadMaterial = new THREE.LineBasicMaterial({
    color: 0xffaa00,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending
});
const threadGeometry = new THREE.BufferGeometry();
const threadPositions = new Float32Array(fabricCount * 2 * 3);
threadGeometry.setAttribute('position', new THREE.BufferAttribute(threadPositions, 3));
const threadLines = new THREE.LineSegments(threadGeometry, threadMaterial);
fabricGroup.add(threadLines);

// --- 7. Interactivity & Mouse Parallax ---
let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

// --- 8. Animation & Assembly Logic ---
const clock = new THREE.Clock();
function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

let assemblyProgress = 0;
function animate() {
    const time = clock.getElapsedTime();
    if (time > 1.0 && assemblyProgress < 1) {
        assemblyProgress += 0.002;
        if (assemblyProgress > 1) assemblyProgress = 1;
    }

    const easeT = easeInOutQuad(assemblyProgress);
    const threadPulse = Math.sin(time * 15) * 0.5 + 0.5;
    threadMaterial.opacity = (easeT > 0.3 && easeT < 0.9) ? Math.sin((easeT - 0.3) * (Math.PI / 0.6)) * (0.3 + threadPulse * 0.5) : 0;
    const tPositions = threadLines.geometry.attributes.position.array;

    fabrics.forEach((f, i) => {
        let currentPos;
        if (easeT < 1) {
            const vortexRadius = Math.max(0.1, (1 - easeT) * 8);
            const vortexAngle = time * f.speed * 2 + f.randomOffset;
            const swirlPos = new THREE.Vector3(
                Math.cos(vortexAngle) * vortexRadius,
                f.startPos.y * (1 - easeT) + (Math.sin(time*2) * 1.5),
                Math.sin(vortexAngle) * vortexRadius
            );
            currentPos = new THREE.Vector3().lerpVectors(swirlPos, f.targetPos, easeT);
        } else {
            currentPos = f.targetPos.clone();
            currentPos.y += Math.sin(time * 2 + f.randomOffset) * 0.05;
        }

        f.mesh.position.copy(currentPos);

        const currentQuat = new THREE.Quaternion().setFromEuler(f.startRot);
        const targetQuat = new THREE.Quaternion().setFromEuler(f.targetRot);
        currentQuat.slerp(targetQuat, easeT);
        f.mesh.setRotationFromQuaternion(currentQuat);

        if (easeT === 1) {
            f.mesh.rotation.x += Math.sin(time * 3 + f.randomOffset) * 0.005;
            f.mesh.rotation.z += Math.cos(time * 3 + f.randomOffset) * 0.005;
        }

        if (i < fabricCount - 1) {
            tPositions[i * 6] = currentPos.x;
            tPositions[i * 6 + 1] = currentPos.y;
            tPositions[i * 6 + 2] = currentPos.z;
            tPositions[i * 6 + 3] = f.targetPos.x;
            tPositions[i * 6 + 4] = f.targetPos.y;
            tPositions[i * 6 + 5] = f.targetPos.z;
        }
    });

    threadLines.geometry.attributes.position.needsUpdate = true;
    fabricGroup.rotation.y = time * 0.5;

    const dPos = dustSystem.geometry.attributes.position.array;
    const dSpeeds = dustSystem.geometry.attributes.speed.array;
    for(let i=0; i<dustCount; i++) {
        dPos[i*3+1] += dSpeeds[i] * 0.01;
        dPos[i*3] += Math.sin(time * 0.5 + i) * 0.003;
        if (dPos[i*3+1] > 10) dPos[i*3+1] = -10;
    }
    dustSystem.geometry.attributes.position.needsUpdate = true;
    dustSystem.rotation.y = time * 0.03;

    magicLight.position.x = fabricGroup.position.x + Math.cos(time * 2) * 3;
    magicLight.position.z = fabricGroup.position.z + Math.sin(time * 2) * 3;
    magicLight.position.y = Math.sin(time * 1.5) * 2;

    const targetX = mouseX * 0.0015;
    const targetY = mouseY * 0.0015;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (-targetY - (camera.position.y - 2)) * 0.05;

    // Look straight ahead to correctly render the centered/right-aligned positions
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

// --- 9. Resize Handler ---
window.addEventListener('resize', () => {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // Update responsive layout for 3D model
    updateModelPosition();
});
