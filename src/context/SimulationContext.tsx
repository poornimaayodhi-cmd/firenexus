import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  BlindSpotZone,
  CameraFeedState,
  CrowdFlowMetrics,
  DangerZone,
  ExitInspection,
  FalseAlarmVerification,
  IncidentState,
  IncidentStateMachine,
  PropagationStage,
  RiskLevel,
  SimulationStepDefinition,
  TimelineEvent,
  TrackedEntity,
  UserProfile,
  UserRole,
  ViewNavigation,
  VulnerablePerson,
} from '../types';
import {
  ALL_USERS,
  INITIAL_BLIND_SPOTS,
  INITIAL_CAMERAS,
  INITIAL_CROWD_FLOW,
  INITIAL_DANGER_ZONES,
  INITIAL_EXITS,
  INITIAL_FALSE_ALARM_VERIFICATION,
  INITIAL_INCIDENT,
  INITIAL_PROPAGATION_TIMELINE,
  INITIAL_TRACKED_ENTITIES,
  INITIAL_USER,
  INITIAL_VULNERABLE_PEOPLE,
  SIMULATION_STEPS_DEFINITION,
} from '../data/mockData';

interface SimulationContextType {
  currentStepIndex: number;
  currentStep: SimulationStepDefinition;
  stateMachine: IncidentStateMachine;
  isPlaying: boolean;
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  goToStep: (stepNumber: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Domain data
  incident: IncidentState;
  cameras: CameraFeedState[];
  trackedEntities: TrackedEntity[];
  exits: ExitInspection[];
  dangerZones: DangerZone[];
  blindSpots: BlindSpotZone[];
  falseAlarmVerification: FalseAlarmVerification;
  propagationTimeline: PropagationStage[];
  crowdFlow: CrowdFlowMetrics;
  vulnerablePeople: VulnerablePerson[];
  riskExplanationBullets: string[];
  correlationSummaryText: string;

  // Selection & Inspector
  selectedEntity: TrackedEntity | null;
  setSelectedEntity: (entity: TrackedEntity | null) => void;
  selectedCamera: CameraFeedState | null;
  setSelectedCamera: (cam: CameraFeedState | null) => void;

  // User & Navigation
  currentUser: UserProfile;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  currentView: ViewNavigation;
  setCurrentView: (view: ViewNavigation) => void;

  // Interactivity & Overrides
  highlightedPathEntityId: string | null;
  setHighlightedPathEntityId: (id: string | null) => void;
  isAiSynthesizing: boolean;
  triggerAiSceneSynthesis: () => Promise<void>;
  aiGeneratedSummary: string | null;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start at Step 1 (NORMAL MODE) so user can see normal baseline first, or jump to Step 4/7 as needed
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);

  const [activeRole, setActiveRole] = useState<UserRole>('emergency_officer');
  const [currentView, setCurrentView] = useState<ViewNavigation>('landing');

  const [selectedCameraId, setSelectedCameraId] = useState<string>('CAM-04');
  const [highlightedPathEntityId, setHighlightedPathEntityId] = useState<string | null>('PERSON #104');

  const [isAiSynthesizing, setIsAiSynthesizing] = useState<boolean>(false);
  const [aiGeneratedSummary, setAiGeneratedSummary] = useState<string | null>(null);

  const currentUser = useMemo(() => {
    return ALL_USERS.find((u) => u.role === activeRole) || INITIAL_USER;
  }, [activeRole]);

  const currentStep = useMemo(() => {
    return SIMULATION_STEPS_DEFINITION.find((s) => s.stepIndex === currentStepIndex) || SIMULATION_STEPS_DEFINITION[0];
  }, [currentStepIndex]);

  const stateMachine = currentStep.stateMachine;

  // Derive each of the 8 cameras from the current step's synchronized state
  const cameras: CameraFeedState[] = useMemo(() => {
    return INITIAL_CAMERAS.map((cam) => {
      const stepState = currentStep.cameraStates[cam.id];
      if (!stepState) return cam;

      const activeImage = stepState.useEmergencyImage ? cam.imageEmergency : cam.imageNormal;

      return {
        ...cam,
        status: stepState.status,
        statusText: stepState.statusText,
        hasFire: stepState.hasFire,
        hasSmoke: stepState.hasSmoke,
        peopleCount: stepState.peopleCount,
        activeImage: activeImage,
        detections: stepState.detections,
      };
    });
  }, [currentStep]);

  const selectedCamera = useMemo(() => {
    return cameras.find((c) => c.id === selectedCameraId) || cameras[3]; // default CAM-04 Server Room
  }, [cameras, selectedCameraId]);

  const setSelectedCamera = (cam: CameraFeedState | null) => {
    if (cam) setSelectedCameraId(cam.id);
  };

  // Derive tracked entity (Person #104) dynamically through the evolving timeline
  const trackedEntities: TrackedEntity[] = useMemo(() => {
    const p104Info = currentStep.person104Location;

    const basePerson104: TrackedEntity = {
      ...INITIAL_TRACKED_ENTITIES[0],
      currentCamera: p104Info.camera,
      currentLocation: p104Info.location,
      movementStatus: p104Info.movementStatus,
      riskStatus: p104Info.risk,
      riskReason: p104Info.reason,
      nearestAvailableRoute:
        currentStepIndex >= 7
          ? 'Turn 180° East → Central Atrium Bridge → Staircase C'
          : 'Staircase B (West Wing)',
      pathHistory: [
        { camera: 'CAM-03', location: 'Tech Office Desk 14', timestamp: '21:40:15', x: 45, y: 55 },
        ...(currentStepIndex >= 5
          ? [{ camera: 'CAM-02', location: 'West Corridor Junction', timestamp: '21:42:04', x: 48, y: 50 }]
          : []),
        ...(currentStepIndex >= 7
          ? [{ camera: 'CAM-02', location: 'West Corridor near Exit B [Trapped]', timestamp: '21:42:22', x: 58, y: 52 }]
          : []),
        ...(currentStepIndex >= 8
          ? [{ camera: 'CAM-08', location: 'East Concourse [Rescue Staged]', timestamp: '21:43:05', x: 62, y: 40 }]
          : []),
        ...(currentStepIndex >= 9
          ? [{ camera: 'CAM-01', location: 'Ground Floor Assembly', timestamp: '21:44:10', x: 50, y: 50 }]
          : []),
      ],
      context: {
        fireDistanceMeters: currentStepIndex >= 4 && currentStepIndex <= 7 ? 6.4 : 22.0,
        smokeDensity: currentStepIndex >= 6 && currentStepIndex <= 7 ? 'heavy' : currentStepIndex === 5 ? 'moderate' : 'none',
        crowdDensity: currentStepIndex === 6 ? 'high' : 'low',
        exitCondition: currentStepIndex >= 7 ? 'Exit B Blocked (12m ahead)' : 'Clear',
        exposureSeconds: currentStepIndex >= 5 ? (currentStepIndex - 4) * 35 : 0,
      },
    };

    return [
      INITIAL_TRACKED_ENTITIES[0], // P-027 (CAM-01 -> Corridor A -> CAM-03 -> Staircase B)
      INITIAL_TRACKED_ENTITIES[1], // P-014 (Critical stationary near fire zone)
      basePerson104,
      INITIAL_TRACKED_ENTITIES[3] || INITIAL_TRACKED_ENTITIES[2],
    ];
  }, [currentStepIndex, currentStep]);

  const [selectedEntityState, setSelectedEntityState] = useState<TrackedEntity | null>(null);
  const selectedEntity = selectedEntityState || trackedEntities[0];

  // Dynamic Blind Spots (Camera Coverage Awareness)
  const blindSpots: BlindSpotZone[] = useMemo(() => {
    return INITIAL_BLIND_SPOTS;
  }, []);

  // Dynamic False Alarm Context Verification
  const falseAlarmVerification: FalseAlarmVerification = useMemo(() => {
    const isStepEarly = currentStepIndex <= 2;
    return {
      ...INITIAL_FALSE_ALARM_VERIFICATION,
      verificationStatus: isStepEarly ? 'SUSPECT_ANOMALY' : 'CROSS_CAMERA_VERIFIED',
      overallConfidence: isStepEarly ? 74 : 94,
      reasoning: isStepEarly
        ? 'Single camera anomaly detected. Multi-camera cross-correlation in progress.'
        : 'Optical smoke haze on CAM-03 cross-validated by thermal rise on CAM-04 (142°C) and optical ceiling layer on CAM-02. False alarm probability: <0.3%.',
    };
  }, [currentStepIndex]);

  // Dynamic Fire & Smoke Propagation Timeline (T+00:00, T+00:08, etc.)
  const propagationTimeline: PropagationStage[] = useMemo(() => {
    if (currentStepIndex <= 1) return [];
    if (currentStepIndex <= 3) return INITIAL_PROPAGATION_TIMELINE.slice(0, 1);
    if (currentStepIndex <= 4) return INITIAL_PROPAGATION_TIMELINE.slice(0, 2);
    if (currentStepIndex <= 6) return INITIAL_PROPAGATION_TIMELINE.slice(0, 3);
    return INITIAL_PROPAGATION_TIMELINE;
  }, [currentStepIndex]);

  // Dynamic Crowd Flow Metrics & Bottleneck Prediction
  const crowdFlow: CrowdFlowMetrics = useMemo(() => {
    const isPostBlockage = currentStepIndex >= 7;
    const isCrowdEvacuating = currentStepIndex >= 5;

    return {
      density: isCrowdEvacuating ? 'HIGH' : 'LOW',
      flowDirection: isPostBlockage
        ? '→ EXIT C (180° Eastbound Diversion Active)'
        : isCrowdEvacuating
        ? '→ EXIT B (Converging at West Stairwell)'
        : 'Nominal intra-office circulation',
      congestionPercent: isPostBlockage ? 88 : isCrowdEvacuating ? 78 : 12,
      velocityMps: isPostBlockage ? 0.32 : isCrowdEvacuating ? 0.45 : 0.85,
      bottleneckLocation: isCrowdEvacuating ? 'Staircase B Doorway Threshold' : 'None detected',
      bottleneckRisk: isPostBlockage ? 'CRITICAL' : isCrowdEvacuating ? 'HIGH' : 'NONE',
      recommendedDiversion: isPostBlockage
        ? 'Divert all flow 180° Eastward via Atrium Skybridge to Staircase C (East Wing)'
        : 'Staircase B throughput approaching maximum threshold.',
    };
  }, [currentStepIndex]);

  // Dynamic Vulnerable People Identification
  const vulnerablePeople: VulnerablePerson[] = useMemo(() => {
    if (currentStepIndex <= 1) return [];
    if (currentStepIndex <= 4) return [INITIAL_VULNERABLE_PEOPLE[1]]; // P-014
    if (currentStepIndex <= 6) return [INITIAL_VULNERABLE_PEOPLE[1], INITIAL_VULNERABLE_PEOPLE[2]]; // P-014, P-104
    return INITIAL_VULNERABLE_PEOPLE; // P-027, P-014, P-104
  }, [currentStepIndex]);

  // Dynamic Real-Time Risk Explanation Bullets
  const riskExplanationBullets: string[] = useMemo(() => {
    if (currentStepIndex <= 1) {
      return [
        'All 8 CCTV camera feeds streaming nominal optical baseline',
        'Normal building occupancy of 45 occupants with standard traffic flow',
        'Zero thermal hotspots or particulate haze detected',
      ];
    }
    if (currentStepIndex <= 3) {
      return [
        'Localized thermal anomaly detected on Rack 3 Breaker (Server Hub 204)',
        'Initial particulate haze accumulating near ceiling extraction vent',
        'Adjacent corridors still reporting clear optical conditions',
      ];
    }
    if (currentStepIndex <= 6) {
      return [
        'Active electrical fire confirmed on Rack 3 electrical busbar',
        'Smoke plume breached utility door into West Wing Corridor (Zone B)',
        'Occupants in Tech Office beginning orderly evacuation toward West Egress',
      ];
    }
    return [
      'Critical risk: Fire intensity high in Zone A (Server Hub 204)',
      '31 occupants exposed across West Wing corridor and office zone',
      'Exit B blocked by collapsed ceiling framework and debris',
      'Smoke spreading toward Staircase A; immediate diversion eastward required',
    ];
  }, [currentStepIndex]);

  // Multi-Camera Correlation Summary Banner
  const correlationSummaryText = useMemo(() => {
    if (currentStepIndex <= 1) {
      return '8 CAMERAS SYNCHRONOUSLY MONITORING · NORMAL BASELINE';
    }
    if (currentStepIndex <= 3) {
      return '2 CAMERAS CORRELATED → 1 THERMAL ANOMALY (CAM-04 Hotspot + CAM-02 Optical Check)';
    }
    if (currentStepIndex <= 6) {
      return '3 CAMERAS CORRELATED → 1 CONFIRMED EMERGENCY (CAM-04 Fire + CAM-02 Smoke + CAM-03 Evacuation)';
    }
    return '4 CAMERAS CORRELATED → 1 ACTIVE INCIDENT (CAM-04 Fire + CAM-02 Smoke + CAM-03 Crowd + CAM-05 Blocked Exit B)';
  }, [currentStepIndex]);

  // Dynamic danger zones
  const dangerZones: DangerZone[] = useMemo(() => {
    const isEmergency = currentStepIndex >= 4 && currentStepIndex <= 8;
    return INITIAL_DANGER_ZONES.map((zone) => {
      if (zone.id === 'ZONE-A') {
        // Server Room
        return {
          ...zone,
          riskLevel: isEmergency ? 'critical' : 'low',
          fireSeverity: isEmergency ? 95 : 0,
          smokeDensity: currentStepIndex >= 2 ? 80 : 0,
          propagationTrend: currentStepIndex >= 4 && currentStepIndex <= 6 ? 'expanding' : 'stable',
        };
      }
      if (zone.id === 'ZONE-B') {
        // West Corridor
        return {
          ...zone,
          riskLevel: currentStepIndex >= 7 ? 'critical' : currentStepIndex >= 5 ? 'high' : 'low',
          occupantCount: currentStep.peopleAtRiskCount,
          fireSeverity: currentStepIndex >= 5 ? 40 : 0,
          smokeDensity: currentStepIndex >= 5 ? 85 : 0,
          exitAccessibility: currentStepIndex >= 7 ? 'blocked' : 'clear',
          propagationTrend: currentStepIndex === 5 || currentStepIndex === 6 ? 'rapidly_expanding' : 'stable',
        };
      }
      return zone;
    });
  }, [currentStepIndex, currentStep]);

  // Dynamic exits
  const exits: ExitInspection[] = useMemo(() => {
    return INITIAL_EXITS.map((exit) => {
      if (exit.id === 'EXIT-B') {
        const isBlocked = currentStepIndex >= 7 && currentStepIndex <= 8;
        const isCrowded = currentStepIndex === 6;
        return {
          ...exit,
          status: isBlocked ? 'blocked' : isCrowded ? 'crowded' : 'available',
          currentFlowRate: isBlocked ? 0 : isCrowded ? 42 : 12,
          congestionPercent: isBlocked ? 100 : isCrowded ? 85 : 15,
          blockageReason: isBlocked ? 'Collapsed acoustic ceiling framework & storage obstruction' : undefined,
          recommendation: isBlocked
            ? 'CRITICAL: DO NOT ROUTE OCCUPANTS. Divert all occupants to Staircase C (East Wing).'
            : isCrowded
            ? 'Caution: High crowd density bottleneck at doorway threshold.'
            : 'Available designated West egress exit.',
        };
      }
      if (exit.id === 'EXIT-C') {
        return {
          ...exit,
          status: 'available',
          currentFlowRate: currentStepIndex >= 6 ? 42 : 10,
          congestionPercent: currentStepIndex >= 6 ? 44 : 11,
          recommendation: 'PRIMARY RECOMMENDED ROUTE. 100% Clear with positive pressure airflow verified.',
        };
      }
      return exit;
    });
  }, [currentStepIndex]);

  // Unified dynamic incident state
  const incident: IncidentState = useMemo(() => {
    const isNormal = currentStep.stateMachine === 'NORMAL';
    const isResolved = currentStep.stateMachine === 'RESOLVED';

    // Build timeline items up to current step
    const timelineEvents: TimelineEvent[] = [
      {
        id: 'tl-0',
        timecode: '21:40:00',
        camera: 'ALL-CAM',
        title: 'Multi-Camera Monitoring Baseline Nominal',
        detail: '8 cameras streaming synchronously. AI detection models running with zero alarms.',
        severity: 'info',
        confidence: 99,
        verified: true,
      },
    ];

    if (currentStepIndex >= 2) {
      timelineEvents.push({
        id: 'tl-1',
        timecode: '21:41:04',
        camera: 'CAM-04',
        title: 'Thermal Anomaly on Rack 3 Breaker',
        detail: 'CAM-04 registers 142°C hotspot and initial particulate haze in Server Hub 204.',
        severity: 'caution' as const,
        confidence: 68,
        verified: false,
      });
    }

    if (currentStepIndex >= 4) {
      timelineEvents.push({
        id: 'tl-2',
        timecode: '21:41:48',
        camera: 'CAM-04',
        title: 'Active Combustion Confirmed (412°C)',
        detail: 'Visible flames confirmed on Rack 3. Camera image transitions to active combustion feed.',
        severity: 'critical' as const,
        confidence: 97,
        verified: true,
      });
    }

    if (currentStepIndex >= 5) {
      timelineEvents.push({
        id: 'tl-3',
        timecode: '21:42:04',
        camera: 'CAM-02',
        title: 'Smoke Propagation to West Corridor',
        detail: 'CAM-02 confirms dense smoke migration from Server Room into corridor. Multi-camera fusion binds CAM-04 + CAM-02.',
        severity: 'warning' as const,
        confidence: 96,
        verified: true,
      });
    }

    if (currentStepIndex >= 6) {
      timelineEvents.push({
        id: 'tl-4',
        timecode: '21:42:15',
        camera: 'CAM-05',
        title: 'Crowd Congestion at Staircase B',
        detail: '31 occupants converge on Staircase B threshold. Egress velocity decaying.',
        severity: 'warning' as const,
        confidence: 95,
        verified: true,
      });
    }

    if (currentStepIndex >= 7) {
      timelineEvents.push({
        id: 'tl-5',
        timecode: '21:42:25',
        camera: 'CAM-05',
        title: 'Exit B BLOCKED — Dynamic Route Updated',
        detail: 'Collapsed ceiling blocks Exit B. Route engine reroutes all occupants to CAM-08 East Corridor → Staircase C.',
        severity: 'critical' as const,
        confidence: 100,
        verified: true,
      });
    }

    if (currentStepIndex >= 8) {
      timelineEvents.push({
        id: 'tl-6',
        timecode: '21:43:10',
        camera: 'CAM-08',
        title: 'Occupants Exiting Safely via East Concourse',
        detail: 'Alpha-1 extracts Person #104. Suppression charged in Server Room 204.',
        severity: 'info' as const,
        confidence: 99,
        verified: true,
      });
    }

    return {
      id: 'INCIDENT #1042',
      title: isNormal
        ? 'Continuous Multi-Camera Surveillance'
        : isResolved
        ? 'Incident Contained & Occupants Evacuated'
        : 'Server Room Fire & Egress Redirection Incident',
      stateMachine: currentStep.stateMachine,
      status: isNormal ? 'normal' : isResolved ? 'resolved' : 'active',
      primaryLocation: isNormal ? 'Entire Facility' : 'Floor 2 / Server Hub 204 & West Corridor',
      floor: 'Floor 2',
      overallRisk: currentStep.overallRisk,
      riskRationale: isNormal
        ? 'All 8 camera feeds show nominal operations with zero hazards detected.'
        : currentStep.primarySceneSummary,
      peopleAtRiskCount: currentStep.peopleAtRiskCount,
      activeHazards: currentStep.activeHazards,
      correlatedCameras: currentStep.correlatedCameras,
      currentEvacuationRoute: currentStep.evacuationRoute,
      alternativeRoute: currentStep.alternativeRoute,
      blockedRoute: currentStep.blockedRoute,
      confidenceScore: currentStep.incidentConfidence,
      timeline: timelineEvents,
      executiveSceneSummary: currentStep.primarySceneSummary,
      responderPriorities: isNormal
        ? [
            {
              rank: '01',
              zone: 'Facility Wide',
              priorityLevel: 'caution',
              peopleAtRisk: 0,
              hazardDescription: 'Normal baseline surveillance active across all 8 cameras.',
              actionGuidance: 'Maintain automated computer vision scanning.',
              tacticalUnit: 'Automated Vision Guard',
            },
          ]
        : [
            {
              rank: '01',
              zone: 'West Corridor (Zone B)',
              priorityLevel: 'critical',
              peopleAtRisk: currentStep.peopleAtRiskCount,
              hazardDescription: '31 occupants approaching blocked Exit B; Person #104 disoriented in smoke.',
              actionGuidance: 'Deploy Team Alpha-1 via Central Atrium to intercept and guide East to Staircase C.',
              tacticalUnit: 'Search & Rescue Alpha-1',
            },
            {
              rank: '02',
              zone: 'Server Hub 204 (Zone A)',
              priorityLevel: 'high',
              peopleAtRisk: 0,
              hazardDescription: 'Active electrical combustion flame on Rack 3; 412°C thermal core.',
              actionGuidance: 'Cut Sub-Station 2 electrical breaker; charge CO2 dry chemical line.',
              tacticalUnit: 'Engine 14 Tactical Attack',
            },
            {
              rank: '03',
              zone: 'Staircase B Threshold',
              priorityLevel: 'high',
              peopleAtRisk: 0,
              hazardDescription: 'Physical ceiling debris occlusion preventing emergency egress.',
              actionGuidance: 'Breach Unit Bravo tasked with exterior debris clearance.',
              tacticalUnit: 'Breach Unit Bravo',
            },
          ],
    };
  }, [currentStepIndex, currentStep]);

  // Auto-play timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= SIMULATION_STEPS_DEFINITION.length) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 4000 / simulationSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, simulationSpeed]);

  const startSimulation = () => {
    if (currentStepIndex === SIMULATION_STEPS_DEFINITION.length) {
      setCurrentStepIndex(1);
    }
    setIsPlaying(true);
  };

  const pauseSimulation = () => setIsPlaying(false);
  const resetSimulation = () => {
    setIsPlaying(false);
    setCurrentStepIndex(1);
    setSelectedCameraId('CAM-01');
    setAiGeneratedSummary(null);
  };

  const goToStep = (stepNumber: number) => {
    setCurrentStepIndex(Math.max(1, Math.min(SIMULATION_STEPS_DEFINITION.length, stepNumber)));
    // Automatically focus on the camera where the action is happening
    if (stepNumber === 2 || stepNumber === 3 || stepNumber === 4) {
      setSelectedCameraId('CAM-04');
    } else if (stepNumber === 5) {
      setSelectedCameraId('CAM-02');
    } else if (stepNumber === 6 || stepNumber === 7) {
      setSelectedCameraId('CAM-05');
    } else if (stepNumber === 8) {
      setSelectedCameraId('CAM-08');
    } else if (stepNumber === 9) {
      setSelectedCameraId('CAM-01');
    }
  };

  const nextStep = () => goToStep(currentStepIndex + 1);
  const prevStep = () => goToStep(currentStepIndex - 1);

  const triggerAiSceneSynthesis = async () => {
    setIsAiSynthesizing(true);
    await new Promise((res) => setTimeout(res, 800));

    const promptSummary = `[FIRENEXUS AI SCENE SYNTHESIS · ${currentStep.stateMachine}]
Observations fused across ${currentStep.correlatedCameras.length ? currentStep.correlatedCameras.join(', ') : 'all 8 cameras'}:
- Locus: ${currentStep.cameraStates['CAM-04'].hasFire ? 'Active Fire in Server Room 204' : 'Monitoring'}
- Corridor: ${currentStep.cameraStates['CAM-02'].hasSmoke ? 'Smoke dispersing through West Corridor 2W' : 'Clear'}
- Exits: ${currentStep.cameraStates['CAM-05'].status === 'BLOCKED' ? 'Staircase B BLOCKED by debris' : 'Operational'}
- Egress Path: ${currentStep.evacuationRoute}
- Tactical Rationale: ${currentStep.narrative}`;

    setAiGeneratedSummary(promptSummary);
    setIsAiSynthesizing(false);
  };

  return (
    <SimulationContext.Provider
      value={{
        currentStepIndex,
        currentStep,
        stateMachine,
        isPlaying,
        simulationSpeed,
        setSimulationSpeed,
        startSimulation,
        pauseSimulation,
        resetSimulation,
        goToStep,
        nextStep,
        prevStep,
        incident,
        cameras,
        trackedEntities,
        exits,
        dangerZones,
        blindSpots,
        falseAlarmVerification,
        propagationTimeline,
        crowdFlow,
        vulnerablePeople,
        riskExplanationBullets,
        correlationSummaryText,
        selectedEntity,
        setSelectedEntity: setSelectedEntityState,
        selectedCamera,
        setSelectedCamera,
        currentUser,
        activeRole,
        setActiveRole,
        currentView,
        setCurrentView,
        highlightedPathEntityId,
        setHighlightedPathEntityId,
        isAiSynthesizing,
        triggerAiSceneSynthesis,
        aiGeneratedSummary,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
