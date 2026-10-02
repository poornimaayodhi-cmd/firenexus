import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ArchitecturalHeroBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ==========================================
    // 1. SCENE & CAMERA SETUP
    // ==========================================
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030611');
    scene.fog = new THREE.FogExp2('#030611', 0.014);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 200);
    camera.position.set(0, 3.5, 34);

    const baseTarget = new THREE.Vector3(0, 2.2, 0);
    const currentTarget = baseTarget.clone();

    // Mouse Parallax Targets (Multi-layer differential)
    const mouse = { x: 0, y: 0 };
    const targetMouse = { x: 0, y: 0 };

    // ==========================================
    // 2. RENDERER SETUP (ACES Filmic Tone Mapping)
    // ==========================================
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = false; // keep fast and smooth
    container.appendChild(renderer.domElement);

    // ==========================================
    // 3. DEPTH LAYERS (Background, Midground, Foreground)
    // ==========================================
    const backgroundGroup = new THREE.Group();
    const midgroundGroup = new THREE.Group();
    const foregroundGroup = new THREE.Group();

    scene.add(backgroundGroup);
    scene.add(midgroundGroup);
    scene.add(foregroundGroup);

    // ==========================================
    // 4. MASTER MATERIALS PALETTE
    // ==========================================
    // Deep polished dark glass/travertine ground
    const darkSlabMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#080d1a'),
      roughness: 0.18,
      metalness: 0.35,
    });

    // Premium architectural tinted glass with sharp specular highlights
    const architecturalGlassMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#38bdf8'),
      roughness: 0.05,
      metalness: 0.85,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      transmission: 0.3,
    });

    // Dark titanium structural frames & mullions
    const titaniumMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1e293b'),
      roughness: 0.35,
      metalness: 0.8,
    });

    // Warm timber vertical accent panels
    const warmTimberMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#271e16'),
      roughness: 0.65,
      metalness: 0.1,
    });

    // Emissive Tech materials
    const cyanGlowMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#38bdf8') });
    const purpleGlowMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#a855f7') });
    const emeraldGlowMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#10b981') });
    const warmHazardMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#f97316') });
    const scanningBeamMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#38bdf8'),
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // ==========================================
    // 5. BACKGROUND LAYER: Deep Architecture & Atmospheric Light Shafts
    // ==========================================
    // Reflective lower ground concourse
    const groundGeo = new THREE.PlaneGeometry(120, 100);
    const ground = new THREE.Mesh(groundGeo, darkSlabMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -4.5;
    backgroundGroup.add(ground);

    // Subtle distant vertical architectural slabs (representing modern high-bay corporate atrium)
    const slabPositions = [
      [-28, 8, -25, 6, 26, 0.4],
      [28, 8, -25, 6, 26, 0.4],
      [-14, 9, -32, 10, 28, 0.5],
      [14, 9, -32, 10, 28, 0.5],
      [0, 10, -36, 18, 30, 0.6],
    ];

    slabPositions.forEach(([x, y, z, w, h, d]) => {
      const slabGeo = new THREE.BoxGeometry(w, h, d);
      const slab = new THREE.Mesh(slabGeo, titaniumMat);
      slab.position.set(x, y, z);
      backgroundGroup.add(slab);

      // Subtle warm/cyan cove vertical outline
      const edgeGeo = new THREE.BoxGeometry(0.12, h, 0.12);
      const edge = new THREE.Mesh(edgeGeo, purpleGlowMat);
      edge.position.set(x - w / 2, y, z + d / 2 + 0.05);
      backgroundGroup.add(edge);
    });

    // Atmospheric diagonal volumetric light shafts
    const createLightShaft = (x: number, y: number, z: number, angleZ: number, scaleX: number, colorHex: number) => {
      const shaftGeo = new THREE.ConeGeometry(scaleX, 45, 16, 1, true);
      const shaftMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.045,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const shaft = new THREE.Mesh(shaftGeo, shaftMat);
      shaft.position.set(x, y, z);
      shaft.rotation.z = angleZ;
      shaft.rotation.x = 0.2;
      backgroundGroup.add(shaft);
      return shaft;
    };

    const lightShaft1 = createLightShaft(-16, 16, -18, -0.42, 6.5, 0xffedd5); // Warm sunlight beam
    const lightShaft2 = createLightShaft(20, 18, -22, 0.38, 7.0, 0x38bdf8); // Cool tech atmosphere beam

    // ==========================================
    // 6. MIDGROUND: Abstract Glass Architecture & Spatial Platforms
    // ==========================================
    // Floating multi-tier mezzanine platforms (Corridor & gallery forms)
    const platforms: THREE.Mesh[] = [];

    // Central Skybridge
    const bridgeGeo = new THREE.BoxGeometry(26, 0.35, 7);
    const centralBridge = new THREE.Mesh(bridgeGeo, darkSlabMat);
    centralBridge.position.set(0, 1.8, -4);
    midgroundGroup.add(centralBridge);
    platforms.push(centralBridge);

    // Front illuminated edge trim on bridge
    const bridgeTrimGeo = new THREE.BoxGeometry(26, 0.08, 0.1);
    const bridgeTrim = new THREE.Mesh(bridgeTrimGeo, cyanGlowMat);
    bridgeTrim.position.set(0, 1.6, -0.45);
    midgroundGroup.add(bridgeTrim);

    // West Wing Cantilevered Corridor Platform
    const westPlatformGeo = new THREE.BoxGeometry(18, 0.35, 16);
    const westPlatform = new THREE.Mesh(westPlatformGeo, darkSlabMat);
    westPlatform.position.set(-18, 3.8, -6);
    midgroundGroup.add(westPlatform);
    platforms.push(westPlatform);

    // East Wing Cantilevered Gallery Platform
    const eastPlatformGeo = new THREE.BoxGeometry(18, 0.35, 16);
    const eastPlatform = new THREE.Mesh(eastPlatformGeo, darkSlabMat);
    eastPlatform.position.set(18, 3.8, -6);
    midgroundGroup.add(eastPlatform);
    platforms.push(eastPlatform);

    // Elegant architectural glass curtain walls (Transparent reflective vertical partitions)
    const glassWalls = [
      // Central glass balustrade along bridge
      { size: [26, 1.2, 0.06], pos: [0, 2.5, -0.5] },
      // West corridor glass enclosure
      { size: [16, 4.5, 0.06], pos: [-16, 6.2, -6] },
      // East concourse glass wall
      { size: [16, 4.5, 0.06], pos: [16, 6.2, -6] },
      // Floating angled spatial reflection screen
      { size: [8, 5.0, 0.06], pos: [0, 5.5, -12] },
    ];

    glassWalls.forEach((w) => {
      const gGeo = new THREE.BoxGeometry(w.size[0], w.size[1], w.size[2]);
      const gMesh = new THREE.Mesh(gGeo, architecturalGlassMat);
      gMesh.position.set(w.pos[0], w.pos[1], w.pos[2]);
      midgroundGroup.add(gMesh);

      // Delicate structural mullion frame
      const fGeo = new THREE.BoxGeometry(w.size[0], 0.08, w.size[2] * 1.5);
      const fMesh = new THREE.Mesh(fGeo, titaniumMat);
      fMesh.position.set(w.pos[0], w.pos[1] + w.size[1] / 2, w.pos[2]);
      midgroundGroup.add(fMesh);
    });

    // Slender cylindrical structural columns (Titanium finish)
    const colPositions = [
      [-9, 3.5, -4],
      [9, 3.5, -4],
      [-18, 4.5, -8],
      [18, 4.5, -8],
      [-9, 3.5, 4],
      [9, 3.5, 4],
    ];
    const colGeo = new THREE.CylinderGeometry(0.24, 0.24, 18, 24);
    colPositions.forEach(([cx, cy, cz]) => {
      const col = new THREE.Mesh(colGeo, titaniumMat);
      col.position.set(cx, cy, cz);
      midgroundGroup.add(col);
    });

    // ==========================================
    // 7. LIVING 3D INTELLIGENCE NETWORK (Nodes & Flow Paths)
    // ==========================================
    // Spatial nodes representing CAMERAS, ZONES, PEOPLE, INCIDENTS
    interface NetworkNode {
      mesh: THREE.Mesh;
      halo: THREE.Mesh;
      basePos: THREE.Vector3;
      type: 'camera' | 'zone' | 'hazard' | 'safe' | 'person';
      pulseSpeed: number;
    }

    const networkNodes: NetworkNode[] = [];
    const nodeDefinitions: { pos: [number, number, number]; type: NetworkNode['type'] }[] = [
      // Cameras
      { pos: [-12, 4.5, -3], type: 'camera' },  // CAM-02 West Corridor
      { pos: [-20, 4.8, -7], type: 'hazard' },  // CAM-04 Server Room (Locus)
      { pos: [-14, 2.5, 2], type: 'camera' },   // CAM-05 Staircase B
      { pos: [0, 2.4, 6], type: 'camera' },     // CAM-01 Lobby
      { pos: [12, 4.5, -3], type: 'safe' },     // CAM-08 East Concourse
      { pos: [18, 4.6, -7], type: 'camera' },   // CAM-03 Tech Office
      // Key Zone centroids
      { pos: [-7, 2.2, -4], type: 'zone' },
      { pos: [7, 2.2, -4], type: 'zone' },
      // Tracked People nodes
      { pos: [-10, 2.1, 0], type: 'person' },   // P-027 moving along West
      { pos: [10, 2.1, 0], type: 'person' },    // Occupants evacuating East
    ];

    nodeDefinitions.forEach((def, idx) => {
      const nodeGeo = new THREE.SphereGeometry(def.type === 'hazard' ? 0.28 : 0.18, 16, 16);
      let mat = cyanGlowMat;
      let haloColor = 0x38bdf8;

      if (def.type === 'hazard') {
        mat = warmHazardMat;
        haloColor = 0xf97316;
      } else if (def.type === 'safe') {
        mat = emeraldGlowMat;
        haloColor = 0x10b981;
      } else if (def.type === 'zone') {
        mat = purpleGlowMat;
        haloColor = 0xa855f7;
      }

      const nodeMesh = new THREE.Mesh(nodeGeo, mat);
      nodeMesh.position.set(def.pos[0], def.pos[1], def.pos[2]);
      midgroundGroup.add(nodeMesh);

      // Soft breathing optical halo
      const haloGeo = new THREE.RingGeometry(0.22, 0.45, 24);
      const haloMat = new THREE.MeshBasicMaterial({
        color: haloColor,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.copy(nodeMesh.position);
      halo.rotation.x = Math.PI / 2;
      midgroundGroup.add(halo);

      networkNodes.push({
        mesh: nodeMesh,
        halo,
        basePos: nodeMesh.position.clone(),
        type: def.type,
        pulseSpeed: 1.5 + (idx % 4) * 0.4,
      });
    });

    // Flowing Intelligence Paths (Connecting Camera -> Detection -> Incident -> Route)
    const splinePaths: THREE.CatmullRomCurve3[] = [
      // Path 1: West corridor incident flow (CAM-04 to Corridor to Staircase B)
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-20, 4.8, -7),
        new THREE.Vector3(-16, 4.2, -4),
        new THREE.Vector3(-12, 4.5, -3),
        new THREE.Vector3(-14, 2.5, 2),
      ]),
      // Path 2: Central Atrium Cross-Correlation Bridge
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-12, 4.5, -3),
        new THREE.Vector3(-5, 2.2, -4),
        new THREE.Vector3(0, 2.3, -4),
        new THREE.Vector3(5, 2.2, -4),
        new THREE.Vector3(12, 4.5, -3),
      ]),
      // Path 3: Safe Egress Guidance to East Wing (Staircase C)
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 2.3, -4),
        new THREE.Vector3(6, 2.2, -1),
        new THREE.Vector3(12, 4.5, -3),
        new THREE.Vector3(18, 4.6, -7),
      ]),
    ];

    // Static subtle spline rails
    splinePaths.forEach((path, idx) => {
      const tubeGeo = new THREE.TubeGeometry(path, 36, 0.03, 6, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: idx === 0 ? 0xf97316 : idx === 2 ? 0x10b981 : 0x818cf8,
        transparent: true,
        opacity: 0.28,
      });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      midgroundGroup.add(tube);
    });

    // Animated Photon Data Pulses traveling along splines
    interface Photon {
      mesh: THREE.Mesh;
      pathIdx: number;
      progress: number;
      speed: number;
    }
    const photons: Photon[] = [];
    for (let p = 0; p < 6; p++) {
      const pGeo = new THREE.SphereGeometry(0.12, 10, 10);
      const pathIdx = p % splinePaths.length;
      const pColor = pathIdx === 0 ? 0xf97316 : pathIdx === 2 ? 0x34d399 : 0x38bdf8;
      const pMat = new THREE.MeshBasicMaterial({ color: pColor });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      midgroundGroup.add(pMesh);

      photons.push({
        mesh: pMesh,
        pathIdx,
        progress: p * 0.18,
        speed: 0.12 + Math.random() * 0.08,
      });
    }

    // ==========================================
    // 8. FLOWING VOLUMETRIC HEAT & SMOKE (Subtle Emergency Evolution)
    // ==========================================
    // Localized heat glow (Located in West Wing Server Zone)
    const heatGlowLight = new THREE.PointLight(new THREE.Color('#ea580c'), 3.2, 18);
    heatGlowLight.position.set(-18, 5.0, -8);
    midgroundGroup.add(heatGlowLight);

    // Warm volumetric ember/heat particles
    const emberCount = 38;
    const emberGeo = new THREE.BufferGeometry();
    const emberPositions = new Float32Array(emberCount * 3);
    for (let i = 0; i < emberCount * 3; i += 3) {
      emberPositions[i] = -18 + (Math.random() - 0.5) * 6;
      emberPositions[i + 1] = 4.0 + Math.random() * 3.5;
      emberPositions[i + 2] = -8 + (Math.random() - 0.5) * 5;
    }
    emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPositions, 3));
    const emberMat = new THREE.PointsMaterial({
      color: 0xf97316,
      size: 0.45,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const emberPoints = new THREE.Points(emberGeo, emberMat);
    midgroundGroup.add(emberPoints);

    // Soft drifting smoke volume particles
    const smokeCount = 42;
    const smokeGeo = new THREE.BufferGeometry();
    const smokePositions = new Float32Array(smokeCount * 3);
    for (let i = 0; i < smokeCount * 3; i += 3) {
      smokePositions[i] = -16 + (Math.random() - 0.5) * 12;
      smokePositions[i + 1] = 5.2 + Math.random() * 2.8;
      smokePositions[i + 2] = -6 + (Math.random() - 0.5) * 6;
    }
    smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePositions, 3));
    const smokeMat = new THREE.PointsMaterial({
      color: 0x475569,
      size: 1.1,
      transparent: true,
      opacity: 0.22,
    });
    const smokePoints = new THREE.Points(smokeGeo, smokeMat);
    midgroundGroup.add(smokePoints);

    // ==========================================
    // 9. CAMERA SCANNING CONE & OBJECT TRACKING INDICATOR
    // ==========================================
    // Subtle scanning beam moving across the central concourse
    const scannerGeo = new THREE.ConeGeometry(5.2, 14, 16, 1, true);
    const scannerCone = new THREE.Mesh(scannerGeo, scanningBeamMat);
    scannerCone.position.set(-12, 10, -3);
    scannerCone.rotation.x = Math.PI;
    midgroundGroup.add(scannerCone);

    // Subtle optical tracking crosshair reticle on the floor
    const crosshairGeo = new THREE.RingGeometry(0.4, 0.48, 16);
    const crosshairMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    });
    const trackingReticle = new THREE.Mesh(crosshairGeo, crosshairMat);
    trackingReticle.rotation.x = -Math.PI / 2;
    trackingReticle.position.set(-6, 2.0, -1);
    midgroundGroup.add(trackingReticle);

    // ==========================================
    // 10. FOREGROUND: Ambient Spatial Framing & Subtle Glass Edge
    // ==========================================
    // Translucent edge panel near camera (giving immense cinematic depth of field)
    const fgPanelGeo = new THREE.BoxGeometry(0.08, 14, 10);
    const fgPanel = new THREE.Mesh(
      fgPanelGeo,
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#1e293b'),
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
      })
    );
    fgPanel.position.set(-19, 2, 18);
    fgPanel.rotation.y = 0.35;
    foregroundGroup.add(fgPanel);

    // Subtle foreground floating dust/light motes
    const moteCount = 28;
    const moteGeo = new THREE.BufferGeometry();
    const motePositions = new Float32Array(moteCount * 3);
    for (let i = 0; i < moteCount * 3; i += 3) {
      motePositions[i] = (Math.random() - 0.5) * 36;
      motePositions[i + 1] = Math.random() * 12;
      motePositions[i + 2] = 10 + Math.random() * 16;
    }
    moteGeo.setAttribute('position', new THREE.BufferAttribute(motePositions, 3));
    const moteMat = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 0.16,
      transparent: true,
      opacity: 0.4,
    });
    const motePoints = new THREE.Points(moteGeo, moteMat);
    foregroundGroup.add(motePoints);

    // ==========================================
    // 11. LIGHTING DESIGN (Cinematic Commercial Lighting)
    // ==========================================
    // Soft ambient fill
    const ambientLight = new THREE.AmbientLight(new THREE.Color('#0f172a'), 1.4);
    scene.add(ambientLight);

    // Main Warm Key Spotlight
    const mainSpot = new THREE.SpotLight(new THREE.Color('#ffedd5'), 3.6);
    mainSpot.position.set(0, 16, 12);
    mainSpot.target.position.set(0, 2, -4);
    mainSpot.angle = Math.PI / 3.5;
    mainSpot.penumbra = 0.85;
    scene.add(mainSpot);
    scene.add(mainSpot.target);

    // Cool Electric Cyan Rim Light
    const cyanRim = new THREE.DirectionalLight(new THREE.Color('#38bdf8'), 1.2);
    cyanRim.position.set(22, 12, 16);
    scene.add(cyanRim);

    // Deep Magenta/Purple Shadow Fill
    const purpleFill = new THREE.DirectionalLight(new THREE.Color('#7c3aed'), 0.8);
    purpleFill.position.set(-20, 8, -12);
    scene.add(purpleFill);

    // ==========================================
    // 12. INTERACTIVE PARALLAX & RESIZE
    // ==========================================
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouse.x = nx;
      targetMouse.y = ny;
    };

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // ==========================================
    // 13. ANIMATION LOOP (Living Intelligence Simulation)
    // ==========================================
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth mouse parallax damping
      mouse.x += (targetMouse.x - mouse.x) * 0.04;
      mouse.y += (targetMouse.y - mouse.y) * 0.04;

      // 1. Slow, elegant cinematic camera drift (Hypnotic, professional movement)
      const driftX = Math.sin(elapsed * 0.09) * 1.6;
      const driftY = Math.cos(elapsed * 0.07) * 0.6;
      const driftZ = Math.sin(elapsed * 0.05) * 1.0;

      camera.position.x = driftX + mouse.x * 2.2;
      camera.position.y = 3.5 + driftY + mouse.y * 1.1;
      camera.position.z = 34 + driftZ;

      currentTarget.x = baseTarget.x + mouse.x * 1.0;
      currentTarget.y = baseTarget.y + mouse.y * 0.5;
      camera.lookAt(currentTarget);

      // Differential multi-layer parallax shift
      foregroundGroup.position.x = -mouse.x * 1.8;
      foregroundGroup.position.y = -mouse.y * 0.9;

      midgroundGroup.position.x = -mouse.x * 0.8;
      midgroundGroup.position.y = -mouse.y * 0.4;

      backgroundGroup.position.x = -mouse.x * 0.25;
      backgroundGroup.position.y = -mouse.y * 0.12;

      // 2. Pulse Intelligence Network Nodes
      networkNodes.forEach((node) => {
        const pulse = (Math.sin(elapsed * node.pulseSpeed) + 1) * 0.5;
        const scale = 1.0 + pulse * 0.25;
        node.mesh.scale.set(scale, scale, scale);
        node.halo.scale.set(1.0 + pulse * 0.35, 1.0 + pulse * 0.35, 1.0);
        (node.halo.material as THREE.MeshBasicMaterial).opacity = 0.25 + pulse * 0.35;
      });

      // 3. Animate Photons along Splines
      photons.forEach((p) => {
        p.progress += p.speed * delta;
        if (p.progress > 1.0) p.progress = 0;
        const spline = splinePaths[p.pathIdx];
        const point = spline.getPoint(p.progress);
        p.mesh.position.copy(point);
      });

      // 4. Volumetric Heat Breathing & Smoke Drift
      const heatBreath = Math.sin(elapsed * 2.2) * 0.4 + 1.0;
      heatGlowLight.intensity = 2.8 + heatBreath * 0.8;

      // Drift embers upward slowly
      const emberArr = emberPoints.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < emberArr.length; i += 3) {
        emberArr[i] += 0.012;
        if (emberArr[i] > 8.0) emberArr[i] = 4.0;
      }
      emberPoints.geometry.attributes.position.needsUpdate = true;

      // Drift smoke eastward along ceiling
      const smokeArr = smokePoints.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < smokeArr.length; i += 3) {
        smokeArr[i] += 0.008; // Eastward
        if (smokeArr[i] > 2.0) smokeArr[i] = -22.0;
      }
      smokePoints.geometry.attributes.position.needsUpdate = true;

      // 5. Camera Scanning Beam Sweep
      const scanAngle = Math.sin(elapsed * 0.35) * 0.25;
      scannerCone.rotation.z = scanAngle;
      scannerCone.position.x = -12 + Math.sin(elapsed * 0.25) * 3.5;

      // Tracking reticle gentle wander along concourse
      trackingReticle.position.x = -6 + Math.sin(elapsed * 0.2) * 4.0;
      trackingReticle.position.z = -1 + Math.cos(elapsed * 0.15) * 2.0;

      // 6. Intelligent Event Simulation Cycle (~12s repeating cycle)
      // Cycle: 0-3s detection pulse, 3-6s data transfer, 6-9s hazard shift, 9-12s safe reroute stabilization
      const cycleTime = elapsed % 12;
      if (cycleTime < 3.0) {
        // Phase 1: Detection pulse on CAM-04 (Hazard locus)
        const flash = Math.sin(cycleTime * 12) * 0.5 + 0.5;
        (networkNodes[1].mesh.material as THREE.MeshBasicMaterial).color.setRGB(1.0, 0.2 + flash * 0.4, 0.1);
      } else if (cycleTime < 6.0) {
        // Phase 2: Flow across bridge
        const flowPulse = Math.sin((cycleTime - 3) * 6) * 0.5 + 0.5;
        bridgeTrim.scale.set(1.0 + flowPulse * 0.08, 1.0, 1.0);
      } else if (cycleTime < 9.0) {
        // Phase 3: Hazard glow peak
        heatGlowLight.color.setRGB(1.0, 0.3, 0.1);
      } else {
        // Phase 4: Egress stabilization (Green path illuminates)
        (networkNodes[4].mesh.material as THREE.MeshBasicMaterial).color.setRGB(0.1, 0.95, 0.5);
      }

      renderer.render(scene, camera);
    };

    animate();

    // ==========================================
    // 14. CLEANUP & MEMORY DISPOSAL
    // ==========================================
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Atmospheric Overlays for Maximum Text Legibility & Depth */}
      {/* 1. Deep top vignette */}
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />

      {/* 2. Soft radial scrim centered behind FIRENEXUS title to guarantee crisp contrast */}
      <div className="absolute inset-0 bg-radial-[circle_at_center] from-slate-950/70 via-slate-950/80 to-slate-950/95 pointer-events-none" />

      {/* 3. Bottom seamless gradient blend into the camera feeds section */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pointer-events-none" />
    </div>
  );
};
