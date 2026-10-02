export type UserRole = 'admin' | 'emergency_officer' | 'fire_officer' | 'operator' | 'viewer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  badgeNumber: string;
  station: string;
  callsign: string;
}

export type ViewNavigation =
  | 'landing'
  | 'signin'
  | 'signup'
  | 'forgot_password'
  | 'live_scene'
  | 'detection'
  | 'tracking'
  | 'inspection'
  | 'scene_understanding'
  | 'incidents'
  | '3d_environment'
  | 'response'
  | 'analytics'
  | 'reports'
  | 'admin';

export type RiskLevel = 'low' | 'moderate' | 'caution' | 'high' | 'critical' | 'safe';

export type IncidentStateMachine =
  | 'NORMAL'
  | 'ANOMALY_DETECTED'
  | 'VERIFYING'
  | 'INCIDENT_CONFIRMED'
  | 'RISK_ESCALATING'
  | 'EVACUATION_ACTIVE'
  | 'ROUTE_UPDATED'
  | 'INCIDENT_STABILIZING'
  | 'RESOLVED';

export type DetectionCategory =
  | 'fire'
  | 'smoke'
  | 'person'
  | 'obstacle'
  | 'exit'
  | 'crowd'
  | 'equipment';

export type VerificationState = 'verified' | 'context_verification' | 'unverified';

export interface BoundingBox {
  ymin: number;
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface DetectionItem {
  id: string;
  label: string;
  category: DetectionCategory;
  confidence: number;
  box: BoundingBox;
  verificationState: VerificationState;
  falsePositiveContext?: string;
  thermalReading?: string;
  correlatedCameras?: string[];
  trackId?: string;
}

export interface CameraFeedState {
  id: string;
  name: string;
  location: string;
  floor: string;
  zone: string;
  status: 'NORMAL' | 'ANOMALY' | 'FIRE_DETECTED' | 'SMOKE_DETECTED' | 'CONGESTED' | 'BLOCKED' | 'SAFE_EVAC';
  statusText: string;
  hasFire: boolean;
  hasSmoke: boolean;
  peopleCount: number;
  imageNormal: string;
  imageEmergency: string;
  activeImage: string;
  detections: DetectionItem[];
  relatedCameras: string[];
  incidentRelationship: string;
  blindSpotCoverage: 'full' | 'partial' | 'blind';
  coverageNotes: string;
  fps: number;
  ip?: string;
  fovAngle?: number;
  position3D: [number, number, number];
}

export interface MovementPathNode {
  camera: string;
  location: string;
  timestamp: string;
  x: number;
  y: number;
}

export interface TrackedEntity {
  id: string;
  type: 'person' | 'crowd' | 'fire_front' | 'smoke_plume';
  label: string;
  currentCamera: string;
  currentLocation: string;
  previousLocation: string;
  direction: string;
  movementStatus: 'moving' | 'slowing' | 'fallen' | 'stationary' | 'trapped' | 'expanding' | 'safe';
  speedMps: number;
  riskStatus: RiskLevel;
  riskReason: string;
  nearestAvailableRoute: string;
  pathHistory: MovementPathNode[];
  context: {
    fireDistanceMeters: number;
    smokeDensity: 'none' | 'light' | 'moderate' | 'heavy';
    crowdDensity: 'low' | 'medium' | 'high';
    exitCondition: string;
    exposureSeconds: number;
  };
}

export interface ExitInspection {
  id: string;
  name: string;
  location: string;
  status: 'safe' | 'available' | 'crowded' | 'blocked' | 'unavailable' | 'unsafe' | 'unknown';
  flowCapacityPerMin: number;
  currentFlowRate: number;
  congestionPercent: number;
  monitoredByCamera: string;
  blockageReason?: string;
  recommendation: string;
}

export interface BlindSpotZone {
  id: string;
  zone: string;
  location: string;
  status: 'UNVERIFIED_AREA' | 'COVERED';
  coveragePercent: number;
  unmonitoredReason: string;
  recommendedVerification: string;
}

export interface FalseAlarmVerification {
  primaryCamera: string;
  primaryDetection: string;
  primaryConfidence: number;
  crossCheckCameras: {
    camera: string;
    reading: string;
    confidence: number;
    confirmed: boolean;
  }[];
  overallConfidence: number;
  verificationStatus: 'CROSS_CAMERA_VERIFIED' | 'SUSPECT_ANOMALY' | 'DISMISSED';
  reasoning: string;
}

export interface CrowdFlowMetrics {
  density: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  flowDirection: string;
  congestionPercent: number;
  velocityMps: number;
  bottleneckLocation: string;
  bottleneckRisk: 'NONE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  recommendedDiversion: string;
}

export interface PropagationStage {
  elapsedTime: string; // e.g. "T+00:00", "T+00:08", "T+00:21", "T+00:37"
  timestamp: string;
  event: string;
  affectedZone: string;
  spreadDirection: string;
  severity: 'info' | 'caution' | 'warning' | 'critical';
}

export interface VulnerablePerson {
  id: string;
  label: string;
  camera: string;
  location: string;
  riskLevel: RiskLevel;
  riskReason: string;
  hazardProximityMeters: number;
  isolationStatus: 'isolated' | 'in_group' | 'fallen' | 'stationary' | 'trapped' | 'moving_to_danger';
  recommendedAction: string;
}

export interface DangerZone {
  id: string;
  name: string;
  floor: string;
  riskLevel: RiskLevel;
  occupantCount: number;
  fireSeverity: number;
  smokeDensity: number;
  exitAccessibility: 'clear' | 'compromised' | 'blocked';
  propagationTrend: 'stable' | 'expanding' | 'rapidly_expanding';
}

export interface TimelineEvent {
  id: string;
  timecode: string;
  camera: string;
  title: string;
  detail: string;
  severity: 'info' | 'caution' | 'warning' | 'critical';
  confidence: number;
  verified: boolean;
}

export interface ResponderPriority {
  rank: string;
  zone: string;
  priorityLevel: 'caution' | 'high' | 'critical';
  peopleAtRisk: number;
  hazardDescription: string;
  actionGuidance: string;
  tacticalUnit: string;
}

export interface IncidentState {
  id: string;
  title: string;
  stateMachine: IncidentStateMachine;
  status: 'normal' | 'active' | 'contained' | 'resolved';
  primaryLocation: string;
  floor: string;
  overallRisk: RiskLevel;
  riskRationale: string;
  peopleAtRiskCount: number;
  activeHazards: string[];
  correlatedCameras: string[];
  currentEvacuationRoute: string;
  alternativeRoute: string;
  blockedRoute: string;
  timeline: TimelineEvent[];
  responderPriorities: ResponderPriority[];
  executiveSceneSummary: string;
  confidenceScore: number;
}

export interface SimulationStepDefinition {
  stepIndex: number;
  stepName: string;
  stateMachine: IncidentStateMachine;
  narrative: string;
  incidentConfidence: number;
  overallRisk: RiskLevel;
  peopleAtRiskCount: number;
  activeHazards: string[];
  correlatedCameras: string[];
  cameraStates: Record<
    string,
    {
      status: CameraFeedState['status'];
      statusText: string;
      hasFire: boolean;
      hasSmoke: boolean;
      peopleCount: number;
      useEmergencyImage: boolean;
      detections: DetectionItem[];
    }
  >;
  person104Location: {
    camera: string;
    location: string;
    movementStatus: TrackedEntity['movementStatus'];
    risk: RiskLevel;
    reason: string;
  };
  primarySceneSummary: string;
  evacuationRoute: string;
  alternativeRoute: string;
  blockedRoute: string;
}
