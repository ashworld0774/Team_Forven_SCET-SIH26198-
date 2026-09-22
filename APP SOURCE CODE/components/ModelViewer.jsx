import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, Platform, StatusBar
} from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS } from '../constants/colors';

export default function ModelViewer({ modelUrl, modelName, onClose }) {
  const [loading, setLoading] = useState(true);

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  body { 
    background: #080c18; 
    overflow: hidden; 
    width: 100vw; 
    height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    touch-action: none;
  }
  canvas { display: block; touch-action: none; }
  
  /* Loading Screen */
  #loadingScreen {
    position: fixed; inset: 0;
    background: linear-gradient(135deg, #080c18 0%, #0d1a2e 100%);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    z-index: 200;
    transition: opacity 0.6s ease;
  }
  .load-ring-outer {
    width: 90px; height: 90px; border-radius: 50%;
    border: 2px solid rgba(30,158,116,0.15);
    position: relative;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 24px;
  }
  .load-ring {
    position: absolute; inset: 4px; border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: #1E9E74;
    border-right-color: #2dd4a0;
    animation: spin 1s linear infinite;
  }
  .load-icon { font-size: 28px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .load-title { color: #2dd4a0; font-size: 17px; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 6px; }
  .load-sub { color: rgba(255,255,255,0.35); font-size: 13px; margin-bottom: 28px; }
  .progress-track { width: 180px; height: 3px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; }
  .progress-fill { height: 100%; background: linear-gradient(90deg, #1E9E74, #2dd4a0); width: 0%; transition: width 0.4s ease; border-radius: 2px; }
  .progress-pct { color: rgba(255,255,255,0.4); font-size: 12px; margin-top: 10px; }

  /* Top Bar */
  #topBar {
    position: fixed; top: 0; left: 0; right: 0;
    padding: 52px 16px 20px;
    background: linear-gradient(180deg, rgba(8,12,24,0.95) 0%, transparent 100%);
    display: none; z-index: 100;
    pointer-events: auto;
  }
    .top-actions{
  pointer-events:auto;
}
  .top-inner { display: flex; align-items: center; justify-content: space-between; }
  .model-info {}
  .model-name { color: #fff; font-size: 17px; font-weight: 700; letter-spacing: 0.3px; }
  .model-badge {
    display: inline-block; background: rgba(30,158,116,0.25);
    border: 1px solid rgba(30,158,116,0.4);
    color: #2dd4a0; font-size: 10px; font-weight: 600;
    padding: 3px 10px; border-radius: 10px; margin-top: 4px;
    letter-spacing: 0.5px;
  }
.top-actions{
  position:absolute;
  top:45px;
  right:76px;
  z-index:9999;
  pointer-events:auto;
}
  .top-actions{
  z-index:9999;
}
.icon-btn {
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background: rgba(0,0,0,0.7);
  border: 1px solid rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  backdrop-filter: blur(10px);
  cursor: pointer;
  pointer-events: auto;
  z-index: 9999;
}

.icon-btn.active{
  background:#1E9E74;
  border-color:#2dd4a0;
}

  /* Bottom Controls */
  
  /* Control Pills Row */
  .pills-row {
    display: flex; gap: 8px; margin-bottom: 14px;
    overflow-x: auto; padding-bottom: 4px;
    scrollbar-width: none;
  }

  .pill:active { transform: scale(0.95); }
  .pill.active {
    background: rgba(30,158,116,0.3);
    border-color: #1E9E74; color: #2dd4a0;
  }
  .pill.danger { border-color: rgba(239,68,68,0.4); }
  .pill.danger:active { background: rgba(239,68,68,0.2); }

  .main-btn:active { transform: scale(0.97); }


  /* Hint */
  .hint-toast {
    position: fixed; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px; padding: 14px 24px;
    color: rgba(255,255,255,0.8); font-size: 13px;
    text-align: center; line-height: 1.6;
    pointer-events: none; z-index: 50;
    animation: fadeHint 3.5s forwards;
  }
  @keyframes fadeHint {
    0% { opacity: 0; transform: translate(-50%,-50%) scale(0.9); }
    15% { opacity: 1; transform: translate(-50%,-50%) scale(1); }
    70% { opacity: 1; }
    100% { opacity: 0; }
  }

  /* Status */
  #statusBar {
    position: fixed; top: 50%; right: 12px;
    transform: translateY(-50%);
    display: flex; flex-direction: column; gap: 8px;
    z-index: 50; display: none;
  }
  .stat-item {
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px; padding: 8px 12px;
    color: rgba(255,255,255,0.6); font-size: 10px;
    text-align: center;
  }
  .stat-val { color: #2dd4a0; font-size: 13px; font-weight: 700; display: block; }
</style>
</head>
<body>

<!-- Loading -->
<div id="loadingScreen">
  <div class="load-ring-outer">
    <div class="load-ring"></div>
    <span class="load-icon">🫁</span>
  </div>
  <div class="load-title">Loading 3D Model</div>
  <div class="load-sub" id="loadSub">Fetching from server...</div>
  <div class="progress-track">
    <div class="progress-fill" id="progressFill"></div>
  </div>
  <div class="progress-pct" id="progressPct">0%</div>
</div>

<!-- Top Bar -->
<div id="topBar">
  <div class="top-inner">
    <div class="model-info">
      <div class="model-name" id="modelNameEl">3D Model</div>
      <div class="model-badge">3D ANATOMICAL</div>
    </div>
   <div class="top-actions">
<div class="icon-btn" id="wireBtn" onclick="toggleWireframe()">
    ⊹
  </div>
</div>
</div>

<!-- Bottom Bar -->


<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>

<script>
const MODEL_URL = '${modelUrl}';
const MODEL_NAME = '${(modelName || '3D Model').replace(/'/g, "\\'")}';

document.getElementById('modelNameEl').textContent = MODEL_NAME;

// Scene
const scene = new THREE.Scene();


const W = window.innerWidth, H = window.innerHeight;
const camera = new THREE.PerspectiveCamera(50, W / H, 0.01, 1000);
camera.position.set(0, 1, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(W, H);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.shadowMap.enabled = true;
document.body.insertBefore(renderer.domElement, document.getElementById('loadingScreen'));

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.autoRotate = false;
controls.autoRotateSpeed = 0.6;
controls.minDistance = 0.5;
controls.maxDistance = 30;
controls.enablePan = true;
controls.panSpeed = 0.5;

// ── ROOM ENVIRONMENT ──
const roomGroup = new THREE.Group();


// Floor plane (subtle glow)
const floorGeo = new THREE.PlaneGeometry(0, 0);
const floorMat = new THREE.MeshPhysicalMaterial({

});
const floor = new THREE.Mesh(floorGeo, floorMat);


// Vertical guide lines (room walls feel)


scene.add(roomGroup);

// ── LIGHTS ──
const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);

const hemi = new THREE.HemisphereLight(0xddeeff, 0x0a1a0a, 0.8);
scene.add(hemi);

const dir1 = new THREE.DirectionalLight(0xffffff, 2.0);
dir1.position.set(5, 10, 7);
dir1.castShadow = true;
dir1.shadow.mapSize.width = 1024;
dir1.shadow.mapSize.height = 1024;
scene.add(dir1);

const dir2 = new THREE.DirectionalLight(0x88ccff, 0.6);
dir2.position.set(-5, -2, -5);
scene.add(dir2);

// Rim light (green tint for medical feel)
const rimLight = new THREE.PointLight(0x1E9E74, 0.8, 20);
rimLight.position.set(-4, 3, -3);
scene.add(rimLight);
const spotLight = new THREE.SpotLight(
  0xffffff,
  0.6
);

spotLight.position.set(
  0,
  8,
  4
);

spotLight.angle = Math.PI / 8;
spotLight.penumbra = 0.4;
spotLight.decay = 2;

scene.add(spotLight);
const fillLight = new THREE.PointLight(0xffffff, 0.5, 15);
fillLight.position.set(4, -1, 4);
scene.add(fillLight);

// ── STATE ──
let model = null;
let isWireframe = false;
let isAutoRotate = false;
let isExploded = false;
let lightsIntensity = 1;
let defaultCamPos = new THREE.Vector3(0, 1, 6);
let defaultTarget = new THREE.Vector3(0, 0, 0);
let originalPositions = [];

// ── LOAD MODEL ──
const loader = new THREE.GLTFLoader();
loader.load(
  MODEL_URL,
  function(gltf) {
    model = gltf.scene;

    // Center + scale
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 3.5 / maxDim;

    model.scale.setScalar(scale);
    model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

    // Store original positions for explode
    model.traverse(child => {
      if (child.isMesh) {
        originalPositions.push({
          mesh: child,
          pos: child.position.clone(),
        });
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.needsUpdate = true;
          if (child.material.map) child.material.map.encoding = THREE.sRGBEncoding;
        }
      }
    });

    // Adjust camera distance
    const fov = camera.fov * (Math.PI / 180);
    const dist = (maxDim * scale) / (2 * Math.tan(fov / 2));
    const camDist = dist * 1.8;
    defaultCamPos = new THREE.Vector3(0, size.y * scale * 0.2, camDist);
const angleDistance = camDist * 0.8;

defaultCamPos = new THREE.Vector3(
  angleDistance,
  angleDistance * 0.5,
  angleDistance
);

camera.position.copy(defaultCamPos);

controls.target.set(0,0,0);
controls.update();

controls.target.set(0,0,0);
controls.update();

    scene.add(model);
    // Hide loading
    const ls = document.getElementById('loadingScreen');
    ls.style.opacity = '0';
    setTimeout(() => {
      ls.style.display = 'none';
      document.getElementById('topBar').style.display = 'block';
    }, 600);

    if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage('loaded');
  },
  function(xhr) {
    if (xhr.total > 0) {
      const pct = Math.round(xhr.loaded / xhr.total * 100);
      document.getElementById('progressFill').style.width = pct + '%';
      document.getElementById('progressPct').textContent = pct + '%';
      document.getElementById('loadSub').textContent = pct < 30 ? 'Connecting...' : pct < 70 ? 'Downloading model...' : 'Processing geometry...';
    }
  },
  function(err) {
    document.getElementById('loadSub').textContent = '⚠ Failed — check connection';
    document.getElementById('progressPct').textContent = 'Error';
  }
);

// ── HINT TOAST ──
function showHint(msg) {
  const el = document.createElement('div');
  el.className = 'hint-toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

// ── CONTROLS ──
function toggleWireframe() {
  isWireframe = !isWireframe;
  const btn = document.getElementById('wireBtn');
  btn.classList.toggle('active', isWireframe);
  if (model) {
    model.traverse(child => {
      if (child.isMesh) child.material.wireframe = isWireframe;
    });
  }
  showHint(isWireframe ? '⊹ Wireframe ON — pinch to zoom' : '⊹ Wireframe OFF');
}

function toggleAutoRotate() {
  isAutoRotate = !isAutoRotate;
  controls.autoRotate = isAutoRotate;
  const btn = document.getElementById('rotateBtn');
  btn.classList.toggle('active', isAutoRotate);
  btn.textContent = isAutoRotate ? '⟳ Auto Rotate' : '⏸ Paused';
}

function resetCamera() {
  camera.position.copy(defaultCamPos);
  controls.target.copy(defaultTarget);
  controls.update();
  showHint('⌖ View reset to origin');
}

function zoomIn() {
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  camera.position.addScaledVector(dir, 1.0);
  controls.update();
}

function zoomOut() {
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  camera.position.addScaledVector(dir, -1.0);
  controls.update();
}

function topView() {
  camera.position.set(0, 8, 0.01);
  controls.target.set(0, 0, 0);
  controls.update();
  showHint('⬆ Top view');
}

function frontView() {
  camera.position.copy(defaultCamPos);
  controls.target.set(0, 0, 0);
  controls.update();
  showHint('⬛ Front view');
}

function sideView() {
  const d = defaultCamPos.length();
  camera.position.set(d, defaultCamPos.y, 0);
  controls.target.set(0, 0, 0);
  controls.update();
  showHint('◧ Side view');
}

function toggleLights() {
  lightsIntensity = lightsIntensity === 1 ? 2 : lightsIntensity === 2 ? 0.3 : 1;
  ambient.intensity = 0.6 * lightsIntensity;
  dir1.intensity = 2.0 * lightsIntensity;
  showHint('💡 Brightness: ' + Math.round(lightsIntensity * 100) + '%');
}

function toggleExplode() {
  isExploded = !isExploded;
  if (!model) return;
  const factor = isExploded ? 0.8 : 0;
  const center = new THREE.Vector3();
  model.traverse(child => {
    if (child.isMesh) {
      const orig = originalPositions.find(o => o.mesh === child);
      if (orig) {
        const dir = orig.pos.clone().sub(center).normalize();
        child.position.copy(orig.pos).addScaledVector(dir, factor);
      }
    }
  });
  showHint(isExploded ? '💥 Exploded view' : '🔗 Assembled view');
}

// Animate
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
</script>
</body>
</html>
  `;

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <WebView
        source={{ html }}
        style={styles.webview}
        onLoadEnd={() => setLoading(false)}
        onMessage={(e) => {
          if (e.nativeEvent.data === 'loaded') setLoading(false);
        }}
        javaScriptEnabled
        allowFileAccess
        originWhitelist={['*']}
        mixedContentMode="always"
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
      />

      {/* Close Button */}
      <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      {loading && (
        <View style={styles.rnOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.rnLoadingText}>Starting 3D Engine...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080c18' },
  webview: { flex: 1 },
  closeBtn: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 44 : 54,
    right: 16,
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    zIndex: 999, elevation: 10,
  },
  closeText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  rnOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#080c18', zIndex: 50,
  },
  rnLoadingText: { color: 'rgba(255,255,255,0.5)', marginTop: 16, fontSize: 14 },
});