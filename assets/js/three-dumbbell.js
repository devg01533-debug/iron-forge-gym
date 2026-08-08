import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

(() => {
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = document.getElementById("webgl");
  const supportsWebGL =
    canvas && window.WebGLRenderingContext && (() => {
      try {
        const ctx = canvas.getContext("webgl2") || canvas.getContext("webgl");
        return Boolean(ctx);
      } catch {
        return false;
      }
    })();

  if (!supportsWebGL) {
    document.body.classList.add("no-webgl");
    return;
  }

  let renderer, scene, camera, dumbbell, particles, fadeMaterials = [], envRT;
  let mouseX = 0, mouseY = 0, scrollProgress = 0, scrollVelocity = 0;
  let lastScrollY = window.scrollY;
  let running = true;

  const BASE_SCALE = window.innerWidth < 720 ? 0.62 : 1;
  const CAMERA_Z = 8;

  function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, CAMERA_Z);

    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    envRT = new THREE.PMREMGenerator(renderer).fromScene(
      new RoomEnvironment(),
      0.04
    );
    scene.environment = envRT.texture;

    addLights();
    buildDumbbell();
    buildParticles();
    addListeners();
  }

  function addLights() {
    scene.add(new THREE.AmbientLight(0xffffff, 0.22));

    const key = new THREE.DirectionalLight(0xffffff, 2.6);
    key.position.set(5, 6, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 20;
    key.shadow.camera.left = -4;
    key.shadow.camera.right = 4;
    key.shadow.camera.top = 4;
    key.shadow.camera.bottom = -4;
    key.shadow.radius = 8;
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x8b5cf6, 1.4);
    fill.position.set(-6, -2, 2);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xc084fc, 1.3);
    rim.position.set(0, -4, -3);
    scene.add(rim);

    const purple = new THREE.PointLight(0x8b5cf6, 40, 22, 2);
    purple.position.set(-4.5, -2.5, 2.5);
    scene.add(purple);

    const glow = new THREE.PointLight(0xc084fc, 32, 20, 2);
    glow.position.set(3.5, 2.5, -2.5);
    scene.add(glow);
  }

  function metalMaterial(color = 0x0d0d0f, roughness = 0.3) {
    const mat = new THREE.MeshStandardMaterial({
      color,
      metalness: 0.9,
      roughness,
      envMapIntensity: 1.8,
      transparent: true
    });
    fadeMaterials.push(mat);
    return mat;
  }

  function addGlowHalo() {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, "rgba(168, 85, 247, 0.55)");
    grad.addColorStop(0.35, "rgba(139, 92, 246, 0.28)");
    grad.addColorStop(0.7, "rgba(139, 92, 246, 0.1)");
    grad.addColorStop(1, "rgba(139, 92, 246, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(canvas);
    const halo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.9
      })
    );
    halo.scale.set(6.2, 6.2, 1);
    halo.position.z = -0.4;
    halo.position.y = 0.2;
    dumbbell.add(halo);
  }

  function buildDumbbell() {
    dumbbell = new THREE.Group();

    const bar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.085, 0.085, 2.4, 32),
      metalMaterial(0x1a1a20, 0.25)
    );
    bar.rotation.z = Math.PI / 2;
    bar.castShadow = true;
    dumbbell.add(bar);

    const plateGeo = new THREE.CylinderGeometry(0.56, 0.56, 0.15, 48);
    const plateMat = metalMaterial(0x232329, 0.35);

    const innerPlate = (x) => {
      const plate = new THREE.Mesh(plateGeo, plateMat);
      plate.rotation.z = Math.PI / 2;
      plate.position.x = x;
      plate.castShadow = true;
      dumbbell.add(plate);

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.46, 0.022, 16, 64),
        new THREE.MeshStandardMaterial({
          color: 0x8b5cf6,
          emissive: 0x8b5cf6,
          emissiveIntensity: 3.2,
          metalness: 0.4,
          roughness: 0.35,
          transparent: true
        })
      );
      ring.rotation.y = Math.PI / 2;
      ring.position.x = x;
      dumbbell.add(ring);
      fadeMaterials.push(ring.material);
      return plate;
    };

    const outerPlate = (x) => {
      const plate = new THREE.Mesh(plateGeo, plateMat);
      plate.rotation.z = Math.PI / 2;
      plate.position.x = x;
      plate.castShadow = true;
      dumbbell.add(plate);
      return plate;
    };

    const collarGeo = new THREE.CylinderGeometry(0.19, 0.19, 0.2, 32);
    const collarMat = metalMaterial(0x0a0a0c, 0.22);
    const collar = (x) => {
      const c = new THREE.Mesh(collarGeo, collarMat);
      c.rotation.z = Math.PI / 2;
      c.position.x = x;
      c.castShadow = true;
      dumbbell.add(c);
      return c;
    };

    innerPlate(-0.95);
    innerPlate(0.95);
    outerPlate(-1.18);
    outerPlate(1.18);
    collar(-1.42);
    collar(1.42);

    addGlowHalo();

    const shadowMat = new THREE.MeshStandardMaterial({
      color: 0x000000,
      roughness: 1,
      metalness: 0,
      transparent: true,
      opacity: 0.38
    });
    const softShadow = new THREE.Mesh(
      new THREE.CircleGeometry(1.35, 48),
      shadowMat
    );
    softShadow.rotation.x = -Math.PI / 2;
    softShadow.position.y = -1.5;
    softShadow.receiveShadow = true;
    dumbbell.add(softShadow);

    scene.add(dumbbell);
  }

  function buildParticles() {
    const COUNT = 600;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const purple = new THREE.Color(0x8b5cf6);
    const violet = new THREE.Color(0xc084fc);
    const white = new THREE.Color(0xe9e2ff);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = -1 - Math.random() * 11;

      const c = Math.random();
      const base = c < 0.55 ? purple : c < 0.85 ? violet : white;
      colors[i * 3] = base.r;
      colors[i * 3 + 1] = base.g;
      colors[i * 3 + 2] = base.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    particles = new THREE.Points(geo, mat);
    scene.add(particles);
  }

  const PATH = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.2, 0.25, 0.6),
    new THREE.Vector3(1.1, 0.95, -0.4),
    new THREE.Vector3(-2.7, 1.1, -2.6),
    new THREE.Vector3(2.7, -1.3, -3.0),
    new THREE.Vector3(-2.8, 0.9, -3.2),
    new THREE.Vector3(2.8, -1.6, -3.0),
    new THREE.Vector3(-2.9, 0.8, -2.7),
    new THREE.Vector3(2.5, -1.7, -2.0),
    new THREE.Vector3(-2.2, 0.4, -0.6),
    new THREE.Vector3(1.6, -0.35, 1.0),
    new THREE.Vector3(2.6, 0.2, -1.2)
  ], false, "catmullrom", 0.5);

  function gaussian(p, center, width) {
    const d = (p - center) / width;
    return Math.exp(-d * d);
  }

  function currentScale(p) {
    const hero = 0.62 * gaussian(p, 0.02, 0.05);
    const form = 0.55 * gaussian(p, 0.9, 0.06);
    const gallery = 0.16 * gaussian(p, 0.72, 0.06);
    return BASE_SCALE * (1 + hero + gallery + form);
  }

  function currentOpacity(p) {
    if (p > 0.955) return Math.max(0, 1 - (p - 0.955) / 0.045);
    return 1;
  }

  function applyDumbbellTransform(p, time, dt) {
    const pos = PATH.getPoint(Math.min(Math.max(p, 0), 1));
    dumbbell.position.copy(pos);
    dumbbell.position.y += Math.sin(time * 1.1) * 0.12;

    const scale = currentScale(p);
    dumbbell.scale.setScalar(scale);

    dumbbell.rotation.y += (0.012 + Math.abs(scrollVelocity) * 0.045) * dt * 60;
    dumbbell.rotation.x += (mouseY * 0.32 - dumbbell.rotation.x) * 0.05;
    dumbbell.rotation.z += (Math.sin(time * 0.35) * 0.06 - mouseX * 0.12 - dumbbell.rotation.z) * 0.05;

    const opacity = currentOpacity(p);
    for (const mat of fadeMaterials) {
      mat.opacity = opacity;
    }
  }

  function animateParticles(time) {
    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += 0.0045;
      if (positions[i + 1] > 8) positions[i + 1] = -8;
    }
    particles.geometry.attributes.position.needsUpdate = true;
    particles.rotation.y = time * 0.008;
  }

  function computeScrollProgress() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    return max > 0 ? window.scrollY / max : 0;
  }

  function updateScroll() {
    const y = window.scrollY;
    scrollVelocity = y - lastScrollY;
    lastScrollY = y;
    const target = computeScrollProgress();
    scrollProgress += (target - scrollProgress) * 0.07;
    if (Math.abs(target - scrollProgress) < 0.0004) scrollProgress = target;
  }

  let lastTime = performance.now();
  function loop(now) {
    if (!running) return;
    if (!REDUCED) requestAnimationFrame(loop);

    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    const time = now / 1000;

    if (REDUCED) {
      const pos = PATH.getPoint(0.02);
      dumbbell.position.copy(pos);
      dumbbell.scale.setScalar(currentScale(0.02));
    } else {
      updateScroll();
      applyDumbbellTransform(scrollProgress, time, dt);
      animateParticles(time);
    }
    renderer.render(scene, camera);
  }

  function addListeners() {
    window.addEventListener(
      "resize",
      () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      },
      { passive: true }
    );

    window.addEventListener(
      "pointermove",
      (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -((e.clientY / window.innerHeight) * 2 - 1);
      },
      { passive: true }
    );

    document.addEventListener("visibilitychange", () => {
      running = document.visibilityState === "visible";
      if (running) {
        lastTime = performance.now();
        requestAnimationFrame(loop);
      }
    });
  }

  try {
    init();
    requestAnimationFrame(loop);
  } catch (err) {
    console.error("[IronForge 3D] failed to initialize:", err);
    document.body.classList.add("no-webgl");
    if (envRT) envRT.dispose();
    if (renderer) renderer.dispose();
  }
})();
