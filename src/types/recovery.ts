import { SafetyTier } from '@/types/architecture';

export type IncidentStage =
  | 'DETECTED'
  | 'DIAGNOSING'
  | 'PLANNING'
  | 'WAITING_APPROVAL'
  | 'EXECUTING'
  | 'VERIFYING'
  | 'RESOLVED'
  | 'CONTAINED'
  | 'FAILED'
  | 'ESCALATED';

export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type ApprovalState = 'NOT_REQUIRED' | 'PENDING' | 'APPROVED' | 'REJECTED';

export type VerificationStatus = 'PENDING' | 'VERIFYING' | 'PASSED' | 'FAILED';

export interface TimelineEvent {
  id: string;
  stage: IncidentStage;
  timestamp: string;
  title: string;
  summary: string;
  evidence?: string[];
  status: 'COMPLETED' | 'IN_PROGRESS' | 'FAILED' | 'SKIPPED';
  details?: string;
}

export interface RecoveryActionPlan {
  id: string;
  strategyName: string;
  safetyTier: SafetyTier;
  approvalState: ApprovalState;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  expectedBenefit: string;
  cascadingRisk: string;
  reversibility: string;
  score: number;
  commandPreview: string;
  executionStatus: 'PENDING' | 'EXECUTING' | 'COMPLETED' | 'BLOCKED' | 'FAILED';
  executionLog: string[];
}

export interface VerificationResult {
  status: VerificationStatus;
  latencyBaselineMs: number;
  latencyAfterMs: number;
  errorRateBaselinePercent: number;
  errorRateAfterPercent: number;
  proberChecks: Array<{
    checkName: string;
    target: string;
    passed: boolean;
    durationMs: number;
  }>;
  healthVerdict: string;
  mttdSeconds: number;
  mttrSeconds: number;
  timeSavedMinutes: number;
}

export interface IncidentState {
  id: string;
  serviceId: string;
  serviceName: string;
  title: string;
  severity: IncidentSeverity;
  currentStage: IncidentStage;
  detectedAt: string;
  resolvedAt?: string;
  rootCause: string;
  impactedDependencies: string[];
  selectedAction: RecoveryActionPlan;
  alternativeStrategies: Array<{
    name: string;
    tier: SafetyTier;
    score: number;
    rejectionReason: string;
  }>;
  timeline: TimelineEvent[];
  verification: VerificationResult;
}
