import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useSimulation } from '../../context/SimulationContext';
import {
  Compass,
  Eye,
  Camera,
  Layers,
  Flame,
  Wind,
  Maximize2,
  Users,
  Search,
  Sparkles,
  MapPin,
  Play,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import imgEnvironmentSky from '../../assets/images/arch_environment_daylight_1790962482173.jpg';
import imgTravertineFloor from '../../assets/images/arch_interior_materials_1790962497515.jpg';

export const ThreeDEnvironmentView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    incident,
    currentStepIndex,
    currentStep,
    stateMachine,
    cameras,
    selectedCamera,
    setSelectedCamera,
    trackedEntities,
    dangerZones,
  } = useSimulation();

  const [activeCamLocation, setActiveCamLocation] = useState<string>('iso');
  const [showCvHud, setShowCvHud] = useState<boolean>(true);
  const [showEvacRibbon, setShowEvacRibbon] = useState<boolean>(true);
  const [showDangerZones, setShowDangerZones] = useState<boolean>(true);
  const [walkthroughMode, setWalkthroughMode] = useState<boolean>(false);
  const [isMobileHudCollapsed, setIsMobileHudCollapsed] = useState<boolean>(false);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Target Camera Interpolation
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(34, 22, 38));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 3.5, 0));
  const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 3.5, 0));

  // Dynamic Fire & Smoke Particles
  const fireParticlesRef = useRef<THREE.Points | null>(null);
  const smokeParticlesRef = useRef<THREE.Points | null>(null);
  const fireLightRef = useRef<THREE.PointLight | null>(null);
  const blockedDebrisGroup = useRef<THREE.Group | null>(null);

  const hasFireInServer = currentStepIndex >= 4 && currentStepIndex <= 8;
  const hasSmokeInCorridor = currentStepIndex >= 5 && currentStepIndex <= 8;
  const isExitBBlocked = currentStepIndex >= 7 && currentStepIndex <= 8;

  // Preset Camera Positions (Natural eye-level & architectural wide-angles)
  const cameraPresets: Record<string, { pos: [number, number, number]; look: [number, number, number]; label: string; camId?: string }> = {
    iso: {
      pos: [34, 22, 38],
      look: [0, 3.5, 0],
      label: 'Establishing Exterior & Atrium',
    },
    'CAM-01': {
      pos: [0, 2.4, 22],
      look: [0, 2.2, 8],
      label: 'CAM-01: Main Entrance Lobby (Eye-Level)',
      camId: 'CAM-01',
    },
    'CAM-02': {
      pos: [-4, 6.2, 2],
      look: [-20, 6.0, 4],
      label: 'CAM-02: West Wing Corridor',
      camId: 'CAM-02',
    },
    'CAM-03': {
      pos: [6, 6.2, -3],
      look: [-4, 5.9, -6],
      label: 'CAM-03: Tech Office Workspace',
      camId: 'CAM-03',
    },
    'CAM-04': {
      pos: [-11, 6.3, -3],
      look: [-18, 5.8, -8],
      label: 'CAM-04: Server Hub 204 (Incident Origin)',
      camId: 'CAM-04',
    },
    'CAM-05': {
      pos: [-16, 6.5, 8],
      look: [-24, 6.0, 8],
      label: 'CAM-05: Staircase B West Egress',
      camId: 'CAM-05',
    },
    'CAM-08': {
      pos: [8, 6.2, 4],
      look: [22, 6.0, 4],
      label: 'CAM-08: East Concourse (Safe Egress)',
      camId: 'CAM-08',
    },
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Environment
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdce7f3); // Natural daylight atmosphere
    scene.fog = new THREE.FogExp2(0xdce7f3, 0.009);
    sceneRef.current = scene;

    // Load panoramic daylight skybox
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(imgEnvironmentSky, (skyTexture) => {
      skyTexture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = skyTexture;
    });

    // 2. Physical Camera
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 1000);
    camera.position.set(targetCamPos.current.x, targetCamPos.current.y, targetCamPos.current.z);
    camera.lookAt(targetLookAt.current);
    cameraRef.current = camera;

    // 3. Renderer with ACES Filmic Tone Mapping (Photorealistic contrast)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Natural Architectural Daylight Lighting (Warm afternoon sun)
    const hemiLight = new THREE.HemisphereLight(0xf8fafc, 0x94a3b8, 1.2);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfff5e6, 2.2);
    sunLight.position.set(40, 55, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 150;
    sunLight.shadow.camera.left = -40;
    sunLight.shadow.camera.right = 40;
    sunLight.shadow.camera.top = 40;
    sunLight.shadow.camera.bottom = -40;
    sunLight.shadow.bias = -0.0003;
    scene.add(sunLight);

    // Warm bounce light from marble surfaces
    const bounceLight = new THREE.DirectionalLight(0xedd8c0, 0.6);
    bounceLight.position.set(-25, 15, -20);
    scene.add(bounceLight);

    // Dynamic fire point light in Server Room 204
    const firePointLight = new THREE.PointLight(0xf97316, hasFireInServer ? 5.0 : 0, 28, 1.5);
    firePointLight.position.set(-18, 6.2, -8);
    fireLightRef.current = firePointLight;
    scene.add(firePointLight);

    // 5. Materials
    const floorTexture = textureLoader.load(imgTravertineFloor);
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(12, 8);

    // Warm Travertine Stone Flooring
    const travertineMaterial = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.28,
      metalness: 0.05,
    });

    // Architectural White Plaster Walls
    const whitePlasterMat = new THREE.MeshStandardMaterial({
      color: 0xf3f4f6,
      roughness: 0.85,
      metalness: 0.02,
    });

    // Rich Walnut / Oak Architectural Wood Cladding
    const walnutWoodMat = new THREE.MeshStandardMaterial({
      color: 0x5c4033,
      roughness: 0.35,
      metalness: 0.05,
    });

    // Architectural Structural Concrete (Matte)
    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      roughness: 0.75,
      metalness: 0.08,
    });

    // Photorealistic Architectural Glass (Curtain Wall)
    const archGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xe2e8f0,
      transparent: true,
      opacity: 0.25,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.85,
      ior: 1.52,
      thickness: 0.4,
    });

    // Brushed Black Anodized Aluminum Mullions
    const aluminumMullionMat = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      roughness: 0.25,
      metalness: 0.85,
    });

    // Lush Architectural Greenery Leaves
    const foliageMat = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.45,
      metalness: 0.02,
    });

    // 6. Architectural Building Geometry
    const building = new THREE.Group();

    // Outdoor Landscaped Plaza Ground Slab
    const groundPlaza = new THREE.Mesh(new THREE.BoxGeometry(90, 0.6, 60), concreteMat);
    groundPlaza.position.set(0, -0.3, 0);
    groundPlaza.receiveShadow = true;
    building.add(groundPlaza);

    // Ground Floor Interior Travertine Slab (Floor 1 Lobby, Reception, Warehouse)
    const floor1Interior = new THREE.Mesh(new THREE.BoxGeometry(64, 0.2, 38), travertineMaterial);
    floor1Interior.position.set(0, 0.1, 0);
    floor1Interior.receiveShadow = true;
    building.add(floor1Interior);

    // Floor 2 Interior Slab (Tech Office, Server Room, Corridors)
    const floor2Slab = new THREE.Mesh(new THREE.BoxGeometry(64, 0.5, 38), travertineMaterial);
    floor2Slab.position.set(0, 4.8, 0);
    floor2Slab.receiveShadow = true;
    building.add(floor2Slab);

    // Floor 2 Ceiling / Roof Slab
    const roofSlab = new THREE.Mesh(new THREE.BoxGeometry(64, 0.5, 38), concreteMat);
    roofSlab.position.set(0, 9.6, 0);
    roofSlab.castShadow = true;
    building.add(roofSlab);

    // Glass Curtain Wall Facade (Double-height atrium & large floor-to-ceiling windows)
    const frontFacadeGlass = new THREE.Mesh(new THREE.BoxGeometry(64, 9.2, 0.15), archGlassMat);
    frontFacadeGlass.position.set(0, 4.8, 19);
    building.add(frontFacadeGlass);

    const backFacadeGlass = new THREE.Mesh(new THREE.BoxGeometry(64, 9.2, 0.15), archGlassMat);
    backFacadeGlass.position.set(0, 4.8, -19);
    building.add(backFacadeGlass);

    // Architectural Mullions (Vertical Grid)
    for (let x = -30; x <= 30; x += 6) {
      const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.2, 9.2, 0.35), aluminumMullionMat);
      mullion.position.set(x, 4.8, 19);
      mullion.castShadow = true;
      building.add(mullion);

      const backMullion = new THREE.Mesh(new THREE.BoxGeometry(0.2, 9.2, 0.35), aluminumMullionMat);
      backMullion.position.set(x, 4.8, -19);
      backMullion.castShadow = true;
      building.add(backMullion);
    }

    // Structural Concrete Columns with Beveled Finish
    const columnGeometry = new THREE.CylinderGeometry(0.65, 0.65, 9.6, 24);
    [
      [-22, 4.8, -12], [-22, 4.8, 12],
      [-8, 4.8, -12], [-8, 4.8, 12],
      [8, 4.8, -12], [8, 4.8, 12],
      [22, 4.8, -12], [22, 4.8, 12],
    ].forEach(([cx, cy, cz]) => {
      const column = new THREE.Mesh(columnGeometry, concreteMat);
      column.position.set(cx, cy, cz);
      column.castShadow = true;
      column.receiveShadow = true;
      building.add(column);
    });

    // 7. Interior Rooms & Architectural Partitions (Floor 2)
    // Server Room 204 Enclosure (CAM-04) - Walnut panelling + Glass inspection window
    const serverWallSouth = new THREE.Mesh(new THREE.BoxGeometry(14, 4.3, 0.3), walnutWoodMat);
    serverWallSouth.position.set(-18, 7.0, -1);
    serverWallSouth.castShadow = true;
    serverWallSouth.receiveShadow = true;
    building.add(serverWallSouth);

    const serverWallEast = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.3, 16), walnutWoodMat);
    serverWallEast.position.set(-11, 7.0, -9);
    serverWallEast.castShadow = true;
    serverWallEast.receiveShadow = true;
    building.add(serverWallEast);

    // Realistic Server Racks in Hub 204
    const rackMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.25, metalness: 0.85 });
    for (let i = 0; i < 4; i++) {
      const rack = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.2, 1.2), rackMat);
      rack.position.set(-18 + i * 2.2, 6.5, -8);
      rack.castShadow = true;
      rack.receiveShadow = true;
      building.add(rack);
    }

    // Tech Office Partition (CAM-03)
    const officeGlassPartition = new THREE.Mesh(new THREE.BoxGeometry(0.15, 4.3, 16), archGlassMat);
    officeGlassPartition.position.set(4, 7.0, -4);
    building.add(officeGlassPartition);

    // Tech Office Desks & Workstations
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.4 });
    const woodTopMat = new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.3 });
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 2; c++) {
        const desk = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 1.2), woodTopMat);
        desk.position.set(-4 + c * 3.5, 5.5, -8 + r * 3);
        desk.castShadow = true;
        building.add(desk);

        // Desk legs
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.8, 1.0), deskMat);
        leg.position.set(-4 + c * 3.5, 5.1, -8 + r * 3);
        building.add(leg);
      }
    }

    // Ground Floor Lobby Reception Desk (CAM-01)
    const receptionBase = new THREE.Mesh(new THREE.BoxGeometry(5.5, 1.1, 1.6), walnutWoodMat);
    receptionBase.position.set(0, 0.7, 8);
    receptionBase.castShadow = true;
    building.add(receptionBase);

    // Indoor Architectural Planters & Greenery (Ficus & Monstera in Lobby & Corridors)
    const planterBoxMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
    [
      [-8, 0.5, 14], [8, 0.5, 14],
      [14, 5.3, 6], [-12, 5.3, 6],
    ].forEach(([px, py, pz]) => {
      const planterBox = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.8, 1.2), planterBoxMat);
      planterBox.position.set(px, py, pz);
      planterBox.castShadow = true;
      building.add(planterBox);

      // Lush Plant Leaves (cluster of organic spheres)
      for (let l = 0; l < 5; l++) {
        const leafCluster = new THREE.Mesh(new THREE.SphereGeometry(0.55, 8, 8), foliageMat);
        leafCluster.position.set(px + (Math.random() - 0.5) * 0.8, py + 0.8 + Math.random() * 0.6, pz + (Math.random() - 0.5) * 0.6);
        leafCluster.castShadow = true;
        building.add(leafCluster);
      }
    });

    // 8. Anatomically Proportioned Architectural Human Figures
    const occupantGroup = new THREE.Group();

    // Helper to create realistic human scale figure (Head, Torso, Limbs, Clothing)
    const createHumanFigure = (x: number, y: number, z: number, suitColor: number, isPerson104 = false) => {
      const figure = new THREE.Group();
      figure.position.set(x, y, z);

      // Head
      const headMat = new THREE.MeshStandardMaterial({ color: 0xe0ac69, roughness: 0.6 });
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), headMat);
      head.position.set(0, 1.65, 0);
      head.castShadow = true;
      figure.add(head);

      // Torso (Jacket / Shirt)
      const clothingMat = new THREE.MeshStandardMaterial({ color: suitColor, roughness: 0.65 });
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.18, 0.65, 12), clothingMat);
      torso.position.set(0, 1.22, 0);
      torso.castShadow = true;
      figure.add(torso);

      // Legs (Trousers)
      const pantMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
      const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.85, 10), pantMat);
      leftLeg.position.set(-0.1, 0.45, 0);
      leftLeg.castShadow = true;
      figure.add(leftLeg);

      const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.85, 10), pantMat);
      rightLeg.position.set(0.1, 0.45, 0);
      rightLeg.castShadow = true;
      figure.add(rightLeg);

      if (isPerson104) {
        // Subtle CV Tracking Ring overhead
        const cvMarker = new THREE.Mesh(
          new THREE.RingGeometry(0.4, 0.55, 32),
          new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide, transparent: true, opacity: 0.9 })
        );
        cvMarker.rotation.x = Math.PI / 2;
        cvMarker.position.set(0, 2.05, 0);
        figure.add(cvMarker);
      }

      return figure;
    };

    // Person #104 (Positioned dynamically according to simulation)
    const p104Loc = trackedEntities[0]?.currentCamera;
    const p104PosMap: Record<string, [number, number, number]> = {
      'CAM-03': [-4, 4.9, -6],
      'CAM-02': [-14, 4.9, 3],
      'CAM-05': [-21, 4.9, 7],
      'CAM-08': [16, 4.9, 4],
      'CAM-01': [2, 0.2, 10],
    };
    const p104Coords = p104PosMap[p104Loc] || [-4, 4.9, -6];
    occupantGroup.add(createHumanFigure(p104Coords[0], p104Coords[1], p104Coords[2], 0x1d4ed8, true));

    // Lobby Occupants (Lobby, Reception desk, glass door arrivals)
    occupantGroup.add(createHumanFigure(-2, 0.2, 12, 0x334155));
    occupantGroup.add(createHumanFigure(3, 0.2, 14, 0x475569));
    occupantGroup.add(createHumanFigure(0, 0.2, 9.2, 0x1e293b));

    // Tech Office Occupants
    occupantGroup.add(createHumanFigure(-3, 4.9, -8, 0x0f766e));
    occupantGroup.add(createHumanFigure(0, 4.9, -5, 0x374151));

    // Evacuating Crowd in East Concourse (CAM-08)
    for (let c = 0; c < 6; c++) {
      const cx = 14 + (c % 3) * 2.5;
      const cz = 2 + Math.floor(c / 3) * 3;
      occupantGroup.add(createHumanFigure(cx, 4.9, cz, 0x1f2937));
    }
    building.add(occupantGroup);

    // 9. Realistic Volumetric Multi-Layer Fire in Server Hub 204 (CAM-04)
    if (hasFireInServer) {
      const fireCount = 180;
      const fireGeo = new THREE.BufferGeometry();
      const firePositions = new Float32Array(fireCount * 3);
      for (let i = 0; i < fireCount * 3; i += 3) {
        firePositions[i] = -18 + (Math.random() - 0.5) * 2.5;
        firePositions[i + 1] = 5.2 + Math.random() * 2.6;
        firePositions[i + 2] = -8 + (Math.random() - 0.5) * 2.5;
      }
      fireGeo.setAttribute('position', new THREE.BufferAttribute(firePositions, 3));
      const fireMat = new THREE.PointsMaterial({
        color: 0xf97316,
        size: 0.55,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
      });
      const firePoints = new THREE.Points(fireGeo, fireMat);
      fireParticlesRef.current = firePoints;
      building.add(firePoints);
    }

    // 10. Environmental Smoke Volumetric Plume (CAM-02 West Corridor)
    if (hasSmokeInCorridor) {
      const smokeCount = 220;
      const smokeGeo = new THREE.BufferGeometry();
      const smokePositions = new Float32Array(smokeCount * 3);
      for (let i = 0; i < smokeCount * 3; i += 3) {
        smokePositions[i] = -14 + (Math.random() - 0.5) * 12;
        smokePositions[i + 1] = 6.8 + Math.random() * 2.0; // clings to ceiling
        smokePositions[i + 2] = 3 + (Math.random() - 0.5) * 6;
      }
      smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePositions, 3));
      const smokeMat = new THREE.PointsMaterial({
        color: 0x475569,
        size: 0.85,
        transparent: true,
        opacity: 0.5,
      });
      const smokePoints = new THREE.Points(smokeGeo, smokeMat);
      smokeParticlesRef.current = smokePoints;
      building.add(smokePoints);
    }

    // 11. Collapsed Ceiling Debris at Staircase B (CAM-05 Blocked State)
    if (isExitBBlocked) {
      const debrisGroup = new THREE.Group();
      const debrisMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 });
      for (let d = 0; d < 6; d++) {
        const piece = new THREE.Mesh(new THREE.BoxGeometry(1.2 + Math.random() * 0.8, 0.15, 0.8), debrisMat);
        piece.position.set(-22 + (Math.random() - 0.5) * 1.5, 5.0 + d * 0.2, 7.5 + (Math.random() - 0.5) * 1.5);
        piece.rotation.set(Math.random() * 0.4, Math.random() * 1.5, Math.random() * 0.4);
        piece.castShadow = true;
        debrisGroup.add(piece);
      }

      // Red emergency obstruction beacon
      const beacon = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 0.3, 16),
        new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 0.8 })
      );
      beacon.position.set(-22, 6.2, 8);
      debrisGroup.add(beacon);

      blockedDebrisGroup.current = debrisGroup;
      building.add(debrisGroup);
    }

    // 12. Elegant Directional Evacuation Wayfinding Ribbon (Safe Egress to East Wing)
    if (showEvacRibbon) {
      const ribbonGroup = new THREE.Group();
      // Flow along corridor eastward to Staircase C
      const evacPathCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-6, 5.05, 3),
        new THREE.Vector3(2, 5.05, 3),
        new THREE.Vector3(12, 5.05, 3),
        new THREE.Vector3(20, 5.05, 5),
      ]);
      const ribbonGeo = new THREE.TubeGeometry(evacPathCurve, 48, 0.1, 8, false);
      const ribbonMat = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.9 });
      const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
      ribbonGroup.add(ribbonMesh);

      // Directional Flow Chevrons
      for (let f = 0; f < 5; f++) {
        const chevronGeo = new THREE.ConeGeometry(0.3, 0.6, 3);
        const chevronMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
        const chevron = new THREE.Mesh(chevronGeo, chevronMat);
        chevron.rotation.x = Math.PI / 2;
        chevron.rotation.z = -Math.PI / 2;
        chevron.position.set(-4 + f * 5.5, 5.06, 3);
        ribbonGroup.add(chevron);
      }

      building.add(ribbonGroup);
    }

    // 13. Dynamic Danger-Zone Floor Overlays (GREEN -> SAFE, YELLOW -> CAUTION, ORANGE -> HIGH, RED -> CRITICAL)
    if (showDangerZones) {
      const zoneGroup = new THREE.Group();

      const getZoneColor = (level: string) => {
        switch (level) {
          case 'critical': return 0xef4444; // Red
          case 'high': return 0xf97316;     // Orange
          case 'caution':
          case 'moderate': return 0xeab308; // Yellow
          case 'safe':
          case 'low':
          default: return 0x10b981;         // Green
        }
      };

      dangerZones.forEach((dz) => {
        let zPos: [number, number, number] = [0, 4.88, 0];
        let zSize: [number, number] = [10, 10];

        if (dz.id === 'ZONE-A') {
          zPos = [-18, 4.88, -8];
          zSize = [10, 8];
        } else if (dz.id === 'ZONE-B') {
          zPos = [-14, 4.88, 3];
          zSize = [18, 6];
        } else if (dz.id === 'ZONE-D') {
          zPos = [0, 4.88, -6];
          zSize = [16, 12];
        } else if (dz.id === 'ZONE-C') {
          zPos = [16, 4.88, 3];
          zSize = [14, 8];
        }

        const zonePlane = new THREE.Mesh(
          new THREE.PlaneGeometry(zSize[0], zSize[1]),
          new THREE.MeshBasicMaterial({
            color: getZoneColor(dz.riskLevel),
            transparent: true,
            opacity: dz.riskLevel === 'critical' ? 0.38 : dz.riskLevel === 'high' ? 0.3 : 0.15,
            side: THREE.DoubleSide,
            depthWrite: false,
          })
        );
        zonePlane.rotation.x = -Math.PI / 2;
        zonePlane.position.set(zPos[0], zPos[1], zPos[2]);
        zoneGroup.add(zonePlane);
      });

      // Blind Spot Indicator: "ZONE D — STAIRWELL: UNVERIFIED AREA"
      const blindSpotMarker = new THREE.Mesh(
        new THREE.BoxGeometry(4.5, 0.08, 4.5),
        new THREE.MeshBasicMaterial({
          color: 0xf59e0b, // Amber
          wireframe: true,
          transparent: true,
          opacity: 0.75,
        })
      );
      blindSpotMarker.position.set(-24, 4.95, -2);
      zoneGroup.add(blindSpotMarker);

      // Responder Priority Indicators (Overhead Tactical Pins)
      if (hasFireInServer) {
        // Priority 1: Server Room
        const p1Pin = new THREE.Mesh(
          new THREE.ConeGeometry(0.5, 1.2, 4),
          new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.6 })
        );
        p1Pin.position.set(-18, 7.5, -8);
        p1Pin.rotation.x = Math.PI;
        zoneGroup.add(p1Pin);
      }

      if (isExitBBlocked) {
        // Priority 2: Staircase B Breach
        const p2Pin = new THREE.Mesh(
          new THREE.ConeGeometry(0.4, 1.0, 4),
          new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xc2410c, emissiveIntensity: 0.6 })
        );
        p2Pin.position.set(-22, 7.2, 8);
        p2Pin.rotation.x = Math.PI;
        zoneGroup.add(p2Pin);
      }

      building.add(zoneGroup);
    }

    scene.add(building);

    // 13. Smooth Interactive Orbit & Drag-Look Controls
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let spherical = { radius: 52, theta: 0.75, phi: 0.7 };

    const updateSphericalPos = () => {
      if (activeCamLocation === 'iso') {
        targetCamPos.current.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
        targetCamPos.current.y = spherical.radius * Math.cos(spherical.phi);
        targetCamPos.current.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
        targetLookAt.current.set(0, 3.5, 0);
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;

      spherical.theta -= dx * 0.007;
      spherical.phi = Math.max(0.15, Math.min(Math.PI / 2.05, spherical.phi - dy * 0.007));
      updateSphericalPos();

      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => (isDragging = false);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      spherical.radius = Math.max(12, Math.min(85, spherical.radius + e.deltaY * 0.04));
      updateSphericalPos();
    };

    // Touch event handlers for phones & tablets (iPhones, Android, iPads)
    let touchStartDist = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        isDragging = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchStartDist = Math.hypot(dx, dy);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDragging) {
        const dx = e.touches[0].clientX - prevMouse.x;
        const dy = e.touches[0].clientY - prevMouse.y;
        spherical.theta -= dx * 0.008;
        spherical.phi = Math.max(0.15, Math.min(Math.PI / 2.05, spherical.phi - dy * 0.008));
        updateSphericalPos();
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2 && touchStartDist > 0) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDist = Math.hypot(dx, dy);
        const delta = touchStartDist - currentDist;
        spherical.radius = Math.max(12, Math.min(85, spherical.radius + delta * 0.08));
        updateSphericalPos();
        touchStartDist = currentDist;
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
      touchStartDist = 0;
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

    renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // 14. Animation Loop with Smooth Camera Lerping (Cinematic Physical Camera Feeling)
    const clock = new THREE.Clock();
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth Camera Lerp
      camera.position.lerp(targetCamPos.current, 0.05);
      currentLookAt.current.lerp(targetLookAt.current, 0.05);
      camera.lookAt(currentLookAt.current);

      // Flickering Warm Fire Illumination
      if (fireLightRef.current && hasFireInServer) {
        fireLightRef.current.intensity = 4.2 + Math.sin(elapsed * 16) * 1.2;
      }

      // Dynamic Fire Particles
      if (fireParticlesRef.current) {
        const pos = fireParticlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 1; i < pos.length; i += 3) {
          pos[i] += 0.045;
          if (pos[i] > 8.0) pos[i] = 5.2;
        }
        fireParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Dynamic Smoke Plume Drifting Eastward Along Ceiling
      if (smokeParticlesRef.current) {
        const pos = smokeParticlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < pos.length; i += 3) {
          pos[i] += 0.025; // drift east
          if (pos[i] > 4) pos[i] = -20;
        }
        smokeParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.domElement.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
    };
  }, [currentStepIndex, cameras, showCvHud, showEvacRibbon, hasFireInServer, hasSmokeInCorridor, isExitBBlocked, dangerZones]);

  // Handle Location Switch (Flies camera smoothly into physical location)
  const jumpToLocation = (presetKey: string) => {
    setActiveCamLocation(presetKey);
    const preset = cameraPresets[presetKey];
    if (preset) {
      targetCamPos.current.set(preset.pos[0], preset.pos[1], preset.pos[2]);
      targetLookAt.current.set(preset.look[0], preset.look[1], preset.look[2]);

      if (preset.camId) {
        const matched = cameras.find((c) => c.id === preset.camId);
        if (matched) setSelectedCamera(matched);
      }
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-8rem)] min-h-[540px] sm:min-h-[620px] bg-slate-900 overflow-hidden flex flex-col">
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-none" />

      {/* Cinematic Adaptive Floating HUD: Mobile, Tablet & Desktop */}
      <div className="absolute top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-auto z-10 flex flex-col gap-2 max-w-full sm:max-w-md pointer-events-none">
        <div className="bg-slate-950/90 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-slate-800 shadow-2xl space-y-2 pointer-events-auto">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span>3D ARCHITECTURAL DIGITAL TWIN</span>
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase hidden sm:inline">
                {stateMachine.replace('_', ' ')}
              </span>
              <button
                onClick={() => setIsMobileHudCollapsed(!isMobileHudCollapsed)}
                className="sm:hidden p-1 rounded bg-slate-900 text-slate-400 hover:text-white"
                title={isMobileHudCollapsed ? 'Expand Details' : 'Collapse Details'}
              >
                {isMobileHudCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="text-sm sm:text-base font-bold text-white truncate">
            {cameraPresets[activeCamLocation]?.label || 'Facility Overview'}
          </div>

          {!isMobileHudCollapsed && (
            <>
              <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-3 sm:line-clamp-none">
                {hasFireInServer
                  ? 'Active combustion in Server Hub 204. Smoke propagating along West Corridor ceiling stratum. Evacuation guidance directs occupants East to Staircase C.'
                  : 'Facility operating under normal architectural daytime illumination. Building occupancy is 45 occupants with standard traffic flow.'}
              </p>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Selected Location:</span>
                <strong className="text-white">{cameraPresets[activeCamLocation]?.camId || 'Wide Overview'}</strong>
              </div>
            </>
          )}
        </div>

        {/* Location Jumps (Touch-scrollable for phones & tablets) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/90 backdrop-blur-md rounded-xl border border-slate-800 text-xs shadow-xl overflow-x-auto pointer-events-auto">
          {Object.entries(cameraPresets).map(([key, data]) => {
            const isActive = activeCamLocation === key;
            return (
              <button
                key={key}
                onClick={() => jumpToLocation(key)}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer shrink-0 text-[11px] sm:text-xs ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {key === 'iso' ? 'Overview' : key}
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Spatial Controls (Bottom Right) */}
      <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 bg-slate-950/85 backdrop-blur-md p-1.5 sm:p-2 rounded-xl border border-slate-800 shadow-xl text-xs">
        <button
          onClick={() => setShowEvacRibbon(!showEvacRibbon)}
          className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border transition-colors cursor-pointer text-[11px] sm:text-xs ${
            showEvacRibbon ? 'bg-emerald-950/70 border-emerald-700 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Evacuation Wayfinding</span>
          <span className="sm:hidden">Wayfinding</span>
        </button>

        <button
          onClick={() => jumpToLocation('iso')}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 cursor-pointer text-[11px] sm:text-xs"
          title="Reset Camera View to Establishing Overview"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Camera</span>
          <span className="sm:hidden">Reset</span>
        </button>
      </div>

      {/* Emergency Digital Twin Intelligence Legend (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-3.5 bg-slate-950/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 shadow-xl">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Green: Safe</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
          <span>Yellow: Caution</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
          <span>Orange: High Risk</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>
          <span>Red: Critical Fire</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 border border-dashed border-amber-400"></span>
          <span>Amber: Unverified Blind Spot</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-emerald-400 font-bold">→</span>
          <span>Evac Flow</span>
        </div>
      </div>
    </div>
  );
};
