export type LayerId =
  | 'app-layer'
  | 'obs-layer'
  | 'ai-layer'
  | 'response-layer'
  | 'verify-layer'
  | 'layer-git-sep'
  | 'layer-frontend'
  | 'layer-gateway'
  | 'layer-backend'
  | 'layer-ai-engine';

export type ServiceHealth = 'HEALTHY' | 'WARNING' | 'DEGRADED' | 'DOWN';

export type SafetyTier = 'AUTO_FIX' | 'ASK_FIRST' | 'NEVER_DO';

export interface ArchitectureComponent {
  id: string;
  name: string;
  layerId: LayerId | string;
  layerName: string;
  category: 'microservice' | 'database' | 'collector' | 'ai_engine' | 'executor' | 'verifier' | 'base_vcs';
  position: [number, number, number]; // 3D coordinates [x, y, z]
  size?: [number, number, number];
  status: ServiceHealth;
  description: string;
  dependencies: string[];
  isDemo?: boolean;
  subServices?: ArchitectureComponent[];
  metrics: {
    p95LatencyMs: number;
    errorRate: number;
    throughputRpm: number;
    cpuPercent: number;
    memoryPercent: number;
    uptimePercent: number;
    activePods?: string;
  };
  aiInsight?: {
    culpritProbability: number;
    diagnosis: string;
    blastRadius: string;
    counterfactualStrategies: Array<{
      name: string;
      tier: SafetyTier;
      expectedBenefit: string;
      riskOfWorsening: 'LOW' | 'MEDIUM' | 'HIGH';
      cascadingRisk: string;
      reversibility: string;
      score: number;
    }>;
  };
}

export interface ArchitectureLayer {
  id: LayerId;
  name: string;
  levelNumber: number;
  yPosition: number;
  description: string;
  color: string;
  components: ArchitectureComponent[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  severity: 'INFO' | 'WARN' | 'ERROR' | 'AI';
  service: string;
  message: string;
  isSimulated?: boolean;
}
