const canvas = document.getElementById('f1Canvas');
const speedLabel = document.getElementById('speedLabel');

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2('#070912', 0.014);

const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 250);
camera.position.set(0, 6, 18);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.12;
controls.minDistance = 9;
controls.maxDistance = 35;
controls.maxPolarAngle = Math.PI * 0.49;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xfff8e4, 1.15);
keyLight.position.set(15, 20, 12);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 2048;
keyLight.shadow.camera.near = 1;
keyLight.shadow.camera.far = 80;
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0x77aaff, 0.48);
fillLight.position.set(-18, 12, -10);
scene.add(fillLight);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(220, 120),
  new THREE.MeshStandardMaterial({ color: '#091324', roughness: 0.82, metalness: 0.1 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const gridHelper = new THREE.GridHelper(200, 40, 0x202d46, 0x111d34);
gridHelper.position.y = 0.01;
scene.add(gridHelper);

const track = new THREE.Group();
const trackMaterial = new THREE.MeshStandardMaterial({ color: '#111d35', metalness: 0.3, roughness: 0.6 });
const trackBase = new THREE.Mesh(new THREE.BoxGeometry(120, 0.1, 32), trackMaterial);
trackBase.position.set(0, 0.05, 0);
track.add(trackBase);
scene.add(track);

function createWheel(radius, width, color = '#11131f') {
  const wheel = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, width, 32),
    new THREE.MeshStandardMaterial({ color, metalness: 0.7, roughness: 0.18 })
  );
  wheel.rotation.z = Math.PI / 2;
  wheel.castShadow = true;
  wheel.receiveShadow = true;
  return wheel;
}

function buildF1Car() {
  const car = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(12, 1.4, 4.4),
    new THREE.MeshStandardMaterial({ color: '#c90f0f', sheen: 0.9, roughness: 0.18, metalness: 0.6 })
  );
  body.position.set(0, 1.2, 0);
  body.castShadow = true;
  car.add(body);

  const cockpit = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 1.2, 2.2),
    new THREE.MeshStandardMaterial({ color: '#121825', roughness: 0.3, metalness: 0.2 })
  );
  cockpit.position.set(-0.5, 1.7, 0);
  car.add(cockpit);

  const nose = new THREE.Mesh(
    new THREE.ConeGeometry(1.4, 5.8, 24),
    new THREE.MeshStandardMaterial({ color: '#c90f0f', roughness: 0.16, metalness: 0.55 })
  );
  nose.rotation.z = Math.PI;
  nose.rotation.x = Math.PI / 12;
  nose.position.set(6.1, 1.2, 0);
  car.add(nose);

  const wingMaterial = new THREE.MeshStandardMaterial({ color: '#1f1f1f', roughness: 0.3, metalness: 0.5 });
  const frontWing = new THREE.Mesh(new THREE.BoxGeometry(8.8, 0.18, 0.65), wingMaterial);
  frontWing.position.set(7.6, 0.9, 0);
  car.add(frontWing);

  const rearWing = new THREE.Mesh(new THREE.BoxGeometry(8.8, 0.22, 0.72), wingMaterial);
  rearWing.position.set(-6.6, 1.35, 0);
  car.add(rearWing);

  const sidepods = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.1, 2.4), new THREE.MeshStandardMaterial({ color: '#bd1010', roughness: 0.2, metalness: 0.42 }));
  sidepods.position.set(0.3, 1.05, 2.2);
  sidepods.scale.set(1, 1, 0.55);
  sidepods.rotation.y = -0.18;
  car.add(sidepods);

  const sidepods2 = sidepods.clone();
  sidepods2.position.set(0.3, 1.05, -2.2);
  sidepods2.rotation.y = 0.18;
  car.add(sidepods2);

  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(1.75, 0.13, 16, 60),
    new THREE.MeshStandardMaterial({ color: '#121825', roughness: 0.25, metalness: 0.5 })
  );
  halo.rotation.x = Math.PI / 2;
  halo.position.set(-1.4, 2.25, 0);
  car.add(halo);

  const wheelPositions = [
    { x: 4.2, z: 2.8 },
    { x: 4.2, z: -2.8 },
    { x: -4.1, z: 2.8 },
    { x: -4.1, z: -2.8 }
  ];

  wheelPositions.forEach((pos) => {
    const wheel = createWheel(0.9, 1.1, '#11131f');
    wheel.position.set(pos.x, 0.95, pos.z);
    car.add(wheel);
  });

  const decal = new THREE.Mesh(
    new THREE.PlaneGeometry(4.4, 1.1),
    new THREE.MeshStandardMaterial({ color: '#f6f6f6', transparent: true, opacity: 0.46 })
  );
  decal.position.set(0.6, 1.65, 0);
  decal.rotation.y = Math.PI * 0.03;
  decal.rotation.x = -0.05;
  car.add(decal);

  return car;
}

const f1Car = buildF1Car();
f1Car.scale.set(1.08, 1.08, 1.08);
scene.add(f1Car);

const ambientTrack = new THREE.PointLight(0xff6d50, 0.75, 42);
ambientTrack.position.set(0, 14, 0);
scene.add(ambientTrack);

const accentPulse = new THREE.PointLight(0xff162b, 0.18, 120);
accentPulse.position.set(0, 7, -18);
scene.add(accentPulse);

const pulseSphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.18, 18, 16),
  new THREE.MeshBasicMaterial({ color: '#ff162b', transparent: true, opacity: 0.4 })
);
pulseSphere.position.copy(accentPulse.position);
scene.add(pulseSphere);

const clock = new THREE.Clock();
let motionStrength = 1.0;
let targetStrength = 1.0;

function animate() {
  const elapsed = clock.getElapsedTime();

  const speed = 1 + Math.sin(elapsed * 1.7) * 0.18;
  const carPhase = Math.sin(elapsed * 2.3) * 0.08;

  f1Car.rotation.y = Math.sin(elapsed * 0.24) * 0.18;
  f1Car.position.y = 0.14 + carPhase;

  scene.children.forEach((child) => {
    if (child.type === 'Mesh' && child.geometry.type === 'CylinderGeometry') {
      child.rotation.x -= 0.08 * speed;
    }
  });

  const orbitRadius = 17;
  camera.position.x = Math.cos(elapsed * 0.1) * orbitRadius;
  camera.position.z = Math.sin(elapsed * 0.1) * orbitRadius + 2;
  camera.lookAt(f1Car.position);

  controls.update();

  keyLight.position.x = Math.cos(elapsed * 0.9) * 18;
  keyLight.position.z = Math.sin(elapsed * 0.9) * 14;

  accentPulse.intensity = 0.22 + Math.sin(elapsed * 2.8) * 0.08;
  pulseSphere.scale.setScalar(1 + Math.sin(elapsed * 3) * 0.14);

  speedLabel.textContent = `Race Mode: ${Math.round(92 + speed * 10)}%`; 
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

function onResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', onResize);

canvas.addEventListener('dblclick', () => {
  targetStrength = targetStrength === 1.0 ? 1.6 : 1.0;
  document.body.style.cursor = 'wait';
  setTimeout(() => { document.body.style.cursor = 'default'; }, 240);
});
