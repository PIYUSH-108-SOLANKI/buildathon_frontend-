import { SafetyTier } from '@/types/architecture';

// Time-series data point
export interface TelemetryPoint {
  time: string;
  p50Latency: number;
  p95Latency: number;
  errorRate: number;
  throughput: number;
  cpu: number;
  memory: number;
}

// Service Telemetry Profile
export interface ServiceTelemetryData {
  serviceId: string;
  serviceName: string;
  health: 'HEALTHY' | 'DEGRADED' | 'WARNING';
  trend: 'Stable' | 'Recovering' | 'Nominal' | 'Optimal';
  dependencyPressure: 'Low' | 'Medium' | 'Elevated';
  sloCompliancePercent: number;
  metricsSummary: {
    p95LatencyMs: number;
    errorRatePercent: number;
    throughputRpm: number;
    cpuPercent: number;
    memoryPercent: number;
    activeConnections: string;
    queueDepth: string;
  };
  timeSeries: TelemetryPoint[];
  anomalies: Array<{
    id: string;
    time: string;
    type: 'SPIKE' | 'NORMALIZED' | 'RESOLVED' | 'INFO';
    message: string;
    severity: 'low' | 'medium' | 'high' | 'info';
  }>;
}

// Gemini Reasoning Strategy Evaluation
export interface RecoveryStrategy {
  id: string;
  name: string;
  tier: SafetyTier;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  expectedBenefit: string;
  cascadingRisk: string;
  reversibility: string;
  requiresApproval: boolean;
  isFeasible: boolean;
  score: number;
  isSelected?: boolean;
}

// Gemini Reasoning Profile
export interface GeminiReasoningCase {
  serviceId: string;
  serviceName: string;
  diagnosisSummary: {
    rootCause: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    confidenceScore: number; // e.g. 0.94
    incidentState: 'MONITORING' | 'RECOVERY_VERIFIED' | 'ANALYSIS_COMPLETE';
    impactedServices: string[];
    blastRadius: string;
  };
  evidenceList: Array<{
    id: string;
    type: 'LOG' | 'METRIC_SPIKE' | 'DEPENDENCY' | 'FAILURE_PATTERN';
    title: string;
    detail: string;
    timestamp: string;
    badge: string;
  }>;
  strategies: RecoveryStrategy[];
  selectedRecommendation: {
    actionName: string;
    tier: SafetyTier;
    selectionRationale: string;
    rejectionRationale: string;
    estimatedRecoverySeconds: number;
  };
  workflowTimeline: Array<{
    step: string;
    label: string;
    status: 'COMPLETED' | 'ACTIVE' | 'PENDING';
    time: string;
    detail: string;
  }>;
  operatorExplanation: string;
}

// ─────────────────────────────────────────────────────────────
// COMPREHENSIVE TELEMETRY DATA POOLS
// ─────────────────────────────────────────────────────────────
export const TELEMETRY_DATA_MAP: Record<string, ServiceTelemetryData> = {
  'orders-service': {
    serviceId: 'orders-service',
    serviceName: 'Orders Service',
    health: 'HEALTHY',
    trend: 'Stable',
    dependencyPressure: 'Low',
    sloCompliancePercent: 99.96,
    metricsSummary: {
      p95LatencyMs: 64,
      errorRatePercent: 0.0,
      throughputRpm: 840,
      cpuPercent: 26,
      memoryPercent: 52,
      activeConnections: '18 / 60 pool',
      queueDepth: '2 / 200 slots',
    },
    timeSeries: [
      { time: '-14m', p50Latency: 22, p95Latency: 54, errorRate: 0.0, throughput: 780, cpu: 22, memory: 50 },
      { time: '-12m', p50Latency: 24, p95Latency: 56, errorRate: 0.0, throughput: 810, cpu: 24, memory: 50 },
      { time: '-10m', p50Latency: 28, p95Latency: 88, errorRate: 0.2, throughput: 890, cpu: 32, memory: 53 },
      { time: '-8m',  p50Latency: 35, p95Latency: 112, errorRate: 0.4, throughput: 920, cpu: 38, memory: 56 },
      { time: '-6m',  p50Latency: 31, p95Latency: 94, errorRate: 0.1, throughput: 860, cpu: 30, memory: 54 },
      { time: '-4m',  p50Latency: 26, p95Latency: 70, errorRate: 0.0, throughput: 840, cpu: 28, memory: 52 },
      { time: '-2m',  p50Latency: 24, p95Latency: 66, errorRate: 0.0, throughput: 835, cpu: 26, memory: 52 },
      { time: 'now',  p50Latency: 23, p95Latency: 64, errorRate: 0.0, throughput: 840, cpu: 26, memory: 52 },
    ],
    anomalies: [
      { id: 'an-1', time: '00:58:14', type: 'SPIKE', message: 'Transient P95 database lock contention spike (112ms)', severity: 'medium' },
      { id: 'an-2', time: '01:00:22', type: 'NORMALIZED', message: 'Pool recycled automatically by PatchUP Sentinel', severity: 'low' },
      { id: 'an-3', time: '01:02:40', type: 'RESOLVED', message: 'Queue depth normalized; 0 dropped orders', severity: 'info' },
    ],
  },

  'gateway-service': {
    serviceId: 'gateway-service',
    serviceName: 'API Gateway',
    health: 'HEALTHY',
    trend: 'Optimal',
    dependencyPressure: 'Low',
    sloCompliancePercent: 99.98,
    metricsSummary: {
      p95LatencyMs: 42,
      errorRatePercent: 0.01,
      throughputRpm: 1420,
      cpuPercent: 18,
      memoryPercent: 45,
      activeConnections: '240 SSL conns',
      queueDepth: '0 backlog',
    },
    timeSeries: [
      { time: '-14m', p50Latency: 14, p95Latency: 38, errorRate: 0.0, throughput: 1350, cpu: 16, memory: 44 },
      { time: '-12m', p50Latency: 15, p95Latency: 40, errorRate: 0.01, throughput: 1380, cpu: 17, memory: 44 },
      { time: '-10m', p50Latency: 16, p95Latency: 42, errorRate: 0.01, throughput: 1410, cpu: 18, memory: 45 },
      { time: '-8m',  p50Latency: 18, p95Latency: 49, errorRate: 0.02, throughput: 1480, cpu: 22, memory: 46 },
      { time: '-6m',  p50Latency: 17, p95Latency: 45, errorRate: 0.01, throughput: 1440, cpu: 19, memory: 45 },
      { time: '-4m',  p50Latency: 15, p95Latency: 43, errorRate: 0.01, throughput: 1430, cpu: 18, memory: 45 },
      { time: '-2m',  p50Latency: 15, p95Latency: 42, errorRate: 0.01, throughput: 1425, cpu: 18, memory: 45 },
      { time: 'now',  p50Latency: 15, p95Latency: 42, errorRate: 0.01, throughput: 1420, cpu: 18, memory: 45 },
    ],
    anomalies: [
      { id: 'gw-1', time: '00:54:10', type: 'INFO', message: 'Token bucket rate-limit ingress calibrated to 1,500 rpm', severity: 'info' },
      { id: 'gw-2', time: '01:01:05', type: 'NORMALIZED', message: 'TLS 1.3 handshake cache hit ratio at 98.4%', severity: 'info' },
    ],
  },

  'payments-service': {
    serviceId: 'payments-service',
    serviceName: 'Payments Service',
    health: 'HEALTHY',
    trend: 'Recovering',
    dependencyPressure: 'Medium',
    sloCompliancePercent: 99.91,
    metricsSummary: {
      p95LatencyMs: 112,
      errorRatePercent: 0.0,
      throughputRpm: 320,
      cpuPercent: 22,
      memoryPercent: 48,
      activeConnections: '12 webhook pipes',
      queueDepth: '4 intent holds',
    },
    timeSeries: [
      { time: '-14m', p50Latency: 42, p95Latency: 98,  errorRate: 0.0, throughput: 310, cpu: 20, memory: 46 },
      { time: '-12m', p50Latency: 45, p95Latency: 104, errorRate: 0.0, throughput: 315, cpu: 21, memory: 47 },
      { time: '-10m', p50Latency: 72, p95Latency: 186, errorRate: 0.5, throughput: 340, cpu: 28, memory: 52 },
      { time: '-8m',  p50Latency: 64, p95Latency: 154, errorRate: 0.2, throughput: 330, cpu: 25, memory: 50 },
      { time: '-6m',  p50Latency: 52, p95Latency: 128, errorRate: 0.0, throughput: 325, cpu: 23, memory: 49 },
      { time: '-4m',  p50Latency: 48, p95Latency: 118, errorRate: 0.0, throughput: 322, cpu: 22, memory: 48 },
      { time: '-2m',  p50Latency: 46, p95Latency: 114, errorRate: 0.0, throughput: 320, cpu: 22, memory: 48 },
      { time: 'now',  p50Latency: 45, p95Latency: 112, errorRate: 0.0, throughput: 320, cpu: 22, memory: 48 },
    ],
    anomalies: [
      { id: 'py-1', time: '00:52:18', type: 'SPIKE', message: 'Third-party PSP webhook acknowledgment timeout (186ms)', severity: 'medium' },
      { id: 'py-2', time: '00:56:42', type: 'RESOLVED', message: 'Webhook retry backoff activated; ledger reconciliation intact', severity: 'info' },
    ],
  },

  'gemini-brain': {
    serviceId: 'gemini-brain',
    serviceName: 'PatchUP AI Engine',
    health: 'HEALTHY',
    trend: 'Optimal',
    dependencyPressure: 'Low',
    sloCompliancePercent: 99.99,
    metricsSummary: {
      p95LatencyMs: 450,
      errorRatePercent: 0.0,
      throughputRpm: 48,
      cpuPercent: 28,
      memoryPercent: 54,
      activeConnections: '4 tensor probers',
      queueDepth: '0 evaluation lag',
    },
    timeSeries: [
      { time: '-14m', p50Latency: 180, p95Latency: 440, errorRate: 0.0, throughput: 46, cpu: 26, memory: 53 },
      { time: '-12m', p50Latency: 185, p95Latency: 445, errorRate: 0.0, throughput: 47, cpu: 27, memory: 53 },
      { time: '-10m', p50Latency: 190, p95Latency: 460, errorRate: 0.0, throughput: 49, cpu: 29, memory: 55 },
      { time: '-8m',  p50Latency: 188, p95Latency: 455, errorRate: 0.0, throughput: 48, cpu: 28, memory: 54 },
      { time: '-6m',  p50Latency: 184, p95Latency: 452, errorRate: 0.0, throughput: 48, cpu: 28, memory: 54 },
      { time: '-4m',  p50Latency: 182, p95Latency: 450, errorRate: 0.0, throughput: 48, cpu: 28, memory: 54 },
      { time: '-2m',  p50Latency: 180, p95Latency: 450, errorRate: 0.0, throughput: 48, cpu: 28, memory: 54 },
      { time: 'now',  p50Latency: 180, p95Latency: 450, errorRate: 0.0, throughput: 48, cpu: 28, memory: 54 },
    ],
    anomalies: [
      { id: 'gb-1', time: '01:02:11', type: 'INFO', message: 'Autonomous counterfactual policy audit: 0 policy drift detected', severity: 'info' },
      { id: 'gb-2', time: '01:03:00', type: 'INFO', message: 'Continuous model reasoning latency verified at 450ms P95', severity: 'info' },
    ],
  },

  'ai-engine': {
    serviceId: 'ai-engine',
    serviceName: 'PatchUP AI Engine',
    health: 'HEALTHY',
    trend: 'Optimal',
    dependencyPressure: 'Low',
    sloCompliancePercent: 99.99,
    metricsSummary: {
      p95LatencyMs: 450,
      errorRatePercent: 0.0,
      throughputRpm: 48,
      cpuPercent: 28,
      memoryPercent: 54,
      activeConnections: '4 tensor probers',
      queueDepth: '0 evaluation lag',
    },
    timeSeries: [
      { time: '-14m', p50Latency: 180, p95Latency: 440, errorRate: 0.0, throughput: 46, cpu: 26, memory: 53 },
      { time: '-12m', p50Latency: 185, p95Latency: 445, errorRate: 0.0, throughput: 47, cpu: 27, memory: 53 },
      { time: '-10m', p50Latency: 190, p95Latency: 460, errorRate: 0.0, throughput: 49, cpu: 29, memory: 55 },
      { time: '-8m',  p50Latency: 188, p95Latency: 455, errorRate: 0.0, throughput: 48, cpu: 28, memory: 54 },
      { time: '-6m',  p50Latency: 184, p95Latency: 452, errorRate: 0.0, throughput: 48, cpu: 28, memory: 54 },
      { time: '-4m',  p50Latency: 182, p95Latency: 450, errorRate: 0.0, throughput: 48, cpu: 28, memory: 54 },
      { time: '-2m',  p50Latency: 180, p95Latency: 450, errorRate: 0.0, throughput: 48, cpu: 28, memory: 54 },
      { time: 'now',  p50Latency: 180, p95Latency: 450, errorRate: 0.0, throughput: 48, cpu: 28, memory: 54 },
    ],
    anomalies: [
      { id: 'ae-1', time: '01:02:11', type: 'INFO', message: 'Autonomous counterfactual policy audit: 0 policy drift detected', severity: 'info' },
      { id: 'ae-2', time: '01:03:00', type: 'INFO', message: 'Continuous model reasoning latency verified at 450ms P95', severity: 'info' },
    ],
  },

  'frontend-service': {
    serviceId: 'frontend-service',
    serviceName: 'Frontend',
    health: 'HEALTHY',
    trend: 'Optimal',
    dependencyPressure: 'Low',
    sloCompliancePercent: 99.98,
    metricsSummary: {
      p95LatencyMs: 24,
      errorRatePercent: 0.0,
      throughputRpm: 1850,
      cpuPercent: 14,
      memoryPercent: 32,
      activeConnections: '1,850 web sessions',
      queueDepth: '0 render lag',
    },
    timeSeries: [
      { time: '-14m', p50Latency: 12, p95Latency: 22, errorRate: 0.0, throughput: 1720, cpu: 12, memory: 30 },
      { time: '-12m', p50Latency: 12, p95Latency: 23, errorRate: 0.0, throughput: 1780, cpu: 13, memory: 31 },
      { time: '-10m', p50Latency: 14, p95Latency: 25, errorRate: 0.0, throughput: 1840, cpu: 14, memory: 32 },
      { time: '-8m',  p50Latency: 15, p95Latency: 26, errorRate: 0.0, throughput: 1890, cpu: 15, memory: 33 },
      { time: '-6m',  p50Latency: 13, p95Latency: 24, errorRate: 0.0, throughput: 1860, cpu: 14, memory: 32 },
      { time: '-4m',  p50Latency: 13, p95Latency: 24, errorRate: 0.0, throughput: 1850, cpu: 14, memory: 32 },
      { time: '-2m',  p50Latency: 12, p95Latency: 24, errorRate: 0.0, throughput: 1850, cpu: 14, memory: 32 },
      { time: 'now',  p50Latency: 12, p95Latency: 24, errorRate: 0.0, throughput: 1850, cpu: 14, memory: 32 },
    ],
    anomalies: [
      { id: 'fe-1', time: '01:00:15', type: 'INFO', message: 'Client core web vitals LCP: 1.1s (Good), CLS: 0.002', severity: 'info' },
      { id: 'fe-2', time: '01:02:40', type: 'NORMALIZED', message: 'Edge CDN cache hit ratio maintained at 99.2%', severity: 'info' },
    ],
  },

  'backend-service': {
    serviceId: 'backend-service',
    serviceName: 'Backend Services',
    health: 'HEALTHY',
    trend: 'Stable',
    dependencyPressure: 'Low',
    sloCompliancePercent: 99.95,
    metricsSummary: {
      p95LatencyMs: 64,
      errorRatePercent: 0.0,
      throughputRpm: 1160,
      cpuPercent: 24,
      memoryPercent: 50,
      activeConnections: '30 active DB handles',
      queueDepth: '6 aggregate backlog',
    },
    timeSeries: [
      { time: '-14m', p50Latency: 28, p95Latency: 60, errorRate: 0.0, throughput: 1090, cpu: 21, memory: 48 },
      { time: '-12m', p50Latency: 29, p95Latency: 62, errorRate: 0.0, throughput: 1125, cpu: 22, memory: 49 },
      { time: '-10m', p50Latency: 35, p95Latency: 98, errorRate: 0.2, throughput: 1230, cpu: 30, memory: 52 },
      { time: '-8m',  p50Latency: 40, p95Latency: 118, errorRate: 0.3, throughput: 1250, cpu: 32, memory: 53 },
      { time: '-6m',  p50Latency: 34, p95Latency: 88, errorRate: 0.1, throughput: 1185, cpu: 26, memory: 51 },
      { time: '-4m',  p50Latency: 30, p95Latency: 72, errorRate: 0.0, throughput: 1162, cpu: 25, memory: 50 },
      { time: '-2m',  p50Latency: 28, p95Latency: 66, errorRate: 0.0, throughput: 1155, cpu: 24, memory: 50 },
      { time: 'now',  p50Latency: 28, p95Latency: 64, errorRate: 0.0, throughput: 1160, cpu: 24, memory: 50 },
    ],
    anomalies: [
      { id: 'be-1', time: '00:58:14', type: 'SPIKE', message: 'Transient Orders DB connection pool wait (18ms)', severity: 'medium' },
      { id: 'be-2', time: '01:00:22', type: 'NORMALIZED', message: 'Autonomous pool recycled; Orders & Payments healthy', severity: 'low' },
    ],
  },

  'inventory-service': {
    serviceId: 'inventory-service',
    serviceName: 'Catalog & Inventory (Demo)',
    health: 'HEALTHY',
    trend: 'Optimal',
    dependencyPressure: 'Low',
    sloCompliancePercent: 99.99,
    metricsSummary: {
      p95LatencyMs: 38,
      errorRatePercent: 0.0,
      throughputRpm: 540,
      cpuPercent: 16,
      memoryPercent: 36,
      activeConnections: '8 redis pipes',
      queueDepth: '0 sync lag',
    },
    timeSeries: [
      { time: '-14m', p50Latency: 16, p95Latency: 36, errorRate: 0.0, throughput: 510, cpu: 15, memory: 35 },
      { time: '-12m', p50Latency: 16, p95Latency: 36, errorRate: 0.0, throughput: 520, cpu: 15, memory: 35 },
      { time: '-10m', p50Latency: 18, p95Latency: 40, errorRate: 0.0, throughput: 550, cpu: 17, memory: 37 },
      { time: '-8m',  p50Latency: 18, p95Latency: 39, errorRate: 0.0, throughput: 545, cpu: 16, memory: 36 },
      { time: '-6m',  p50Latency: 17, p95Latency: 38, errorRate: 0.0, throughput: 540, cpu: 16, memory: 36 },
      { time: '-4m',  p50Latency: 17, p95Latency: 38, errorRate: 0.0, throughput: 540, cpu: 16, memory: 36 },
      { time: '-2m',  p50Latency: 16, p95Latency: 38, errorRate: 0.0, throughput: 540, cpu: 16, memory: 36 },
      { time: 'now',  p50Latency: 16, p95Latency: 38, errorRate: 0.0, throughput: 540, cpu: 16, memory: 36 },
    ],
    anomalies: [
      { id: 'inv-1', time: '01:01:10', type: 'INFO', message: 'Demo catalog indexing nominal (2,400 SKUs warm in Redis)', severity: 'info' },
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// COMPREHENSIVE GEMINI REASONING DATA CASES
// ─────────────────────────────────────────────────────────────
export const GEMINI_REASONING_MAP: Record<string, GeminiReasoningCase> = {
  'orders-service': {
    serviceId: 'orders-service',
    serviceName: 'Orders Service',
    diagnosisSummary: {
      rootCause: 'Downstream payment dependency latency spike causing upstream connection pool saturation and thread queue buildup.',
      severity: 'HIGH',
      confidenceScore: 0.94,
      incidentState: 'RECOVERY_VERIFIED',
      impactedServices: ['orders-service', 'storefront-db', 'gateway-service'],
      blastRadius: 'Checkout pipeline (e-commerce customer conversions).',
    },
    evidenceList: [
      {
        id: 'ev-1',
        type: 'LOG',
        title: 'DB Connection Wait Warning',
        detail: 'Database connection pool wait: pg_orders_pool wait_time=18ms (threshold=25ms exceeded peak at 34ms).',
        timestamp: '00:58:24.102',
        badge: 'orders.log // line 489',
      },
      {
        id: 'ev-2',
        type: 'METRIC_SPIKE',
        title: 'P95 Latency Surge Correlation',
        detail: 'P95 tail latency jumped from baseline 54ms to 112ms concurrently with payment webhook latency surge.',
        timestamp: '00:58:32.410',
        badge: 'r=0.98 cross-correlation',
      },
      {
        id: 'ev-3',
        type: 'DEPENDENCY',
        title: 'Downstream Bottleneck Propagation',
        detail: 'storefront-db thread saturation reached 82% due to holding transactions awaiting external stripe tokenization.',
        timestamp: '00:59:01.004',
        badge: 'topological graph edge',
      },
      {
        id: 'ev-4',
        type: 'FAILURE_PATTERN',
        title: 'Cascading Retry Amplification',
        detail: 'HTTP client retry backoff storm detected: 14 concurrent client retries without jitter.',
        timestamp: '00:59:15.820',
        badge: 'known failure pattern #SRE-41',
      },
    ],
    strategies: [
      {
        id: 'strat-1',
        name: 'Trip Ingress Circuit Breaker',
        tier: 'AUTO_FIX',
        riskLevel: 'LOW',
        expectedBenefit: 'Isolates slow payment requests; sheds 15% excess retries; protects DB pool.',
        cascadingRisk: 'Zero impact on cached reads; prevents full cluster crash.',
        reversibility: 'Immediate (<2 sec via envoy filter dynamic update)',
        requiresApproval: false,
        isFeasible: true,
        score: 96,
        isSelected: true,
      },
      {
        id: 'strat-2',
        name: 'Docker Hard Container Restart',
        tier: 'ASK_FIRST',
        riskLevel: 'HIGH',
        expectedBenefit: 'Terminates stuck worker processes and flushes local memory buffers.',
        cascadingRisk: 'Drops 42 active in-flight checkout transactions; triggers immediate 503 storm.',
        reversibility: 'Irreversible (active socket connections severed)',
        requiresApproval: true,
        isFeasible: true,
        score: 34,
        isSelected: false,
      },
      {
        id: 'strat-3',
        name: 'Dynamic Exponential Backoff Adjustment',
        tier: 'AUTO_FIX',
        riskLevel: 'LOW',
        expectedBenefit: 'Paces incoming retries from 200ms to 1200ms with full random jitter.',
        cascadingRisk: 'Slight user-perceived delay (1s) on degraded payment gateway.',
        reversibility: 'Immediate (<1 sec)',
        requiresApproval: false,
        isFeasible: true,
        score: 88,
        isSelected: false,
      },
      {
        id: 'strat-4',
        name: 'Escalate to Human On-Call Engineer',
        tier: 'ASK_FIRST',
        riskLevel: 'MEDIUM',
        expectedBenefit: 'Human operator validation before risky systemic intervention.',
        cascadingRisk: '15+ minute MTTD/MTTR manual response time; SLO violation threshold breached.',
        reversibility: 'N/A',
        requiresApproval: true,
        isFeasible: true,
        score: 42,
        isSelected: false,
      },
    ],
    selectedRecommendation: {
      actionName: 'CIRCUIT_BREAKER_TRIP + EXPONENTIAL_RETRY_PACING',
      tier: 'AUTO_FIX',
      selectionRationale: 'Safe non-destructive intervention. Recycles pool pressure in <4 seconds without severing active transactions, keeping 99.6% of checkouts operating nominally.',
      rejectionRationale: 'Docker container hard restart was rejected because restarting during a connection storm causes immediate connection flood upon boot, amplifying the outage.',
      estimatedRecoverySeconds: 4.2,
    },
    workflowTimeline: [
      { step: '01', label: 'Anomaly Detected', status: 'COMPLETED', time: '00:58:14', detail: 'Synthetic prober detected 112ms tail latency deviation' },
      { step: '02', label: 'Telemetry Correlated', status: 'COMPLETED', time: '00:58:20', detail: 'Cross-layer Pearson correlation identified DB pool contention' },
      { step: '03', label: 'Root Cause Inferred', status: 'COMPLETED', time: '00:58:28', detail: 'Downstream payment latency amplification diagnosed with 0.94 confidence' },
      { step: '04', label: '4 Strategies Simulated', status: 'COMPLETED', time: '00:58:35', detail: 'Counterfactual safety policy evaluated; Container Restart rejected' },
      { step: '05', label: 'Autonomous Remediation', status: 'COMPLETED', time: '00:58:38', detail: 'AUTO_FIX gate executed circuit breaker shedding & retry jitter' },
      { step: '06', label: 'System Verified Nominal', status: 'ACTIVE', time: '00:58:44', detail: 'P95 latency dropped back to 64ms; SLO compliance verified at 99.96%' },
    ],
    operatorExplanation: 'PatchUP Sentinel selected non-destructive circuit breaker shedding and retry pacing. Hard container restart was explicitly rejected because restarting under queue pressure would have severed in-flight transactions and triggered a secondary cascade across the API Gateway.',
  },

  'gateway-service': {
    serviceId: 'gateway-service',
    serviceName: 'API Gateway',
    diagnosisSummary: {
      rootCause: 'Transient TLS 1.3 handshake burst from mobile clients during flash campaign.',
      severity: 'LOW',
      confidenceScore: 0.96,
      incidentState: 'MONITORING',
      impactedServices: ['gateway-service'],
      blastRadius: 'Ingress edge boundary only.',
    },
    evidenceList: [
      {
        id: 'gw-ev-1',
        type: 'METRIC_SPIKE',
        title: 'Ingress RPS Surge',
        detail: 'RPS climbed to 1,480 rpm (+22% above baseline) during mobile push notification broadcast.',
        timestamp: '00:54:12.800',
        badge: 'metrics.ingress_rps',
      },
      {
        id: 'gw-ev-2',
        type: 'LOG',
        title: 'Token Bucket Replenishment',
        detail: 'Ingress rate-limiting token bucket maintained healthy buffer: burst=1500, drop=0.',
        timestamp: '00:54:18.012',
        badge: 'envoy.ratelimit // info',
      },
    ],
    strategies: [
      {
        id: 'gw-strat-1',
        name: 'Scale Gateway Ingress Pods (3 -> 5)',
        tier: 'AUTO_FIX',
        riskLevel: 'LOW',
        expectedBenefit: 'Distributes cryptographic TLS handshake CPU overhead evenly.',
        cascadingRisk: 'None. Stateless ingress layer.',
        reversibility: 'Immediate',
        requiresApproval: false,
        isFeasible: true,
        score: 95,
        isSelected: true,
      },
    ],
    selectedRecommendation: {
      actionName: 'HORIZONTAL_AUTOSCALE_INGRESS',
      tier: 'AUTO_FIX',
      selectionRationale: 'Stateless scale-out absorbs cryptographic overhead with 0 downtime.',
      rejectionRationale: 'Rate limiting was not required as downstream services were not saturated.',
      estimatedRecoverySeconds: 2.8,
    },
    workflowTimeline: [
      { step: '01', label: 'Traffic Surge Detected', status: 'COMPLETED', time: '00:54:10', detail: '1,480 rpm detected across edge proxy' },
      { step: '02', label: 'Downstream Pressure Audited', status: 'COMPLETED', time: '00:54:14', detail: 'Orders & Payments operating well within capacity' },
      { step: '03', label: 'Preemptive Scale Executed', status: 'COMPLETED', time: '00:54:18', detail: 'Scaled ingress replica set to maintain <45ms SLA' },
      { step: '04', label: 'SLA Verified', status: 'ACTIVE', time: '00:54:24', detail: 'Average latency steady at 15ms' },
    ],
    operatorExplanation: 'PatchUP autonomous autoscaler scaled the ingress deployment preemptively to prevent CPU throttling on crypto handshakes during the traffic surge.',
  },

  'payments-service': {
    serviceId: 'payments-service',
    serviceName: 'Payments Service',
    diagnosisSummary: {
      rootCause: 'Third-party payment gateway partner webhook acknowledgment lag.',
      severity: 'MEDIUM',
      confidenceScore: 0.91,
      incidentState: 'RECOVERY_VERIFIED',
      impactedServices: ['payments-service', 'storefront-db'],
      blastRadius: 'Payment ledger reconciliation queue.',
    },
    evidenceList: [
      {
        id: 'py-ev-1',
        type: 'LOG',
        title: 'Webhook Retries Queued',
        detail: 'Webhook delivery backlog: 2 webhook deliveries queued for retry after 186ms timeout.',
        timestamp: '00:52:18.910',
        badge: 'payments.log // warn',
      },
      {
        id: 'py-ev-2',
        type: 'FAILURE_PATTERN',
        title: 'Partner PSP Degraded',
        detail: 'Stripe external sandbox API latency increased to 350ms across external egress interface.',
        timestamp: '00:52:25.400',
        badge: 'external_dependency_monitor',
      },
    ],
    strategies: [
      {
        id: 'py-strat-1',
        name: 'Asynchronous Webhook Queue Decoupling',
        tier: 'AUTO_FIX',
        riskLevel: 'LOW',
        expectedBenefit: 'Drains synchronous webhook requests into Redis queue; frees thread pool.',
        cascadingRisk: 'Negligible. Webhook processor handles eventual consistency.',
        reversibility: 'Immediate',
        requiresApproval: false,
        isFeasible: true,
        score: 94,
        isSelected: true,
      },
    ],
    selectedRecommendation: {
      actionName: 'ASYNC_WEBHOOK_QUEUE_DECOUPLING',
      tier: 'AUTO_FIX',
      selectionRationale: 'Decouples slow third-party responses from user-facing checkout threads.',
      rejectionRationale: 'Aborting webhook processing would cause ghost orders.',
      estimatedRecoverySeconds: 3.1,
    },
    workflowTimeline: [
      { step: '01', label: 'Webhook Lag Alert', status: 'COMPLETED', time: '00:52:18', detail: 'External egress partner latency exceeded 200ms' },
      { step: '02', label: 'Ledger Audit Triggered', status: 'COMPLETED', time: '00:52:22', detail: 'Double-entry parity verified 100%' },
      { step: '03', label: 'Async Queue Decoupled', status: 'COMPLETED', time: '00:52:26', detail: 'Threads decoupled to prevent blocking checkout' },
      { step: '04', label: 'Healthy State Verified', status: 'ACTIVE', time: '00:52:30', detail: 'P95 latency normalized to 112ms' },
    ],
    operatorExplanation: 'PatchUP Sentinel routed webhook acknowledgments into an isolated asynchronous Redis queue, protecting the primary checkout thread pool while preserving 100% financial ledger consistency.',
  },

  'gemini-brain': {
    serviceId: 'gemini-brain',
    serviceName: 'Gemini 2.5 AI Brain',
    diagnosisSummary: {
      rootCause: 'Nominal operational status. Continuous counterfactual safety validation active.',
      severity: 'LOW',
      confidenceScore: 0.99,
      incidentState: 'MONITORING',
      impactedServices: ['All 4 Microservice Tiers'],
      blastRadius: 'Autonomous SRE supervision boundary.',
    },
    evidenceList: [
      {
        id: 'gb-ev-1',
        type: 'LOG',
        title: 'Counterfactual Simulation Audit',
        detail: 'Synthetic prober completed end-to-end loop: gateway=OK orders=OK payments=OK (38ms).',
        timestamp: '01:03:12.400',
        badge: 'gemini.sentinel // nominal',
      },
      {
        id: 'gb-ev-2',
        type: 'METRIC_SPIKE',
        title: 'Zero Policy Anomaly',
        detail: '0 policy divergence detected across 3,600 cluster golden telemetry signals.',
        timestamp: '01:03:18.100',
        badge: 'entropy=0.002 (safe)',
      },
    ],
    strategies: [
      {
        id: 'gb-strat-1',
        name: 'Maintain Continuous Autonomous Guard',
        tier: 'AUTO_FIX',
        riskLevel: 'LOW',
        expectedBenefit: 'Maintains sub-5s MTTD/MTTR automated self-healing readiness.',
        cascadingRisk: 'None.',
        reversibility: 'Immediate',
        requiresApproval: false,
        isFeasible: true,
        score: 99,
        isSelected: true,
      },
    ],
    selectedRecommendation: {
      actionName: 'AUTONOMOUS_GUARD_ACTIVE',
      tier: 'AUTO_FIX',
      selectionRationale: 'All 4 layers healthy. Continuous reasoning engine in warm standby.',
      rejectionRationale: 'No remedial action warranted.',
      estimatedRecoverySeconds: 0,
    },
    workflowTimeline: [
      { step: '01', label: 'Model Warmup', status: 'COMPLETED', time: '01:00:00', detail: 'Gemini 2.5 Pro reasoning weights loaded into inference memory' },
      { step: '02', label: 'Topology Ingestion', status: 'COMPLETED', time: '01:01:00', detail: 'PulseShop microservice dependency graph compiled' },
      { step: '03', label: 'Continuous Telemetry Loop', status: 'ACTIVE', time: '01:03:00', detail: 'Evaluating golden signals every 500ms' },
    ],
    operatorExplanation: 'Gemini 2.5 Sentinel is operating in real-time supervisory mode across PulseShop. Counterfactual models simulate recovery paths continually to maintain sub-5s automated remediation readiness.',
  },

  'ai-engine': {
    serviceId: 'ai-engine',
    serviceName: 'PatchUP AI Engine',
    diagnosisSummary: {
      rootCause: 'All 4 architectural tiers operating within nominal error budget. Zero anomalous divergence.',
      severity: 'LOW',
      confidenceScore: 0.99,
      incidentState: 'MONITORING',
      impactedServices: [],
      blastRadius: 'Zero containment required. Autonomous guard standing by.',
    },
    evidenceList: [
      {
        id: 'ae-ev-1',
        type: 'LOG',
        title: 'Counterfactual Simulation Audit',
        detail: 'Synthetic prober completed end-to-end loop: gateway=OK orders=OK payments=OK (38ms).',
        timestamp: '01:03:12.400',
        badge: 'gemini.sentinel // nominal',
      },
      {
        id: 'ae-ev-2',
        type: 'METRIC_SPIKE',
        title: 'Zero Policy Anomaly',
        detail: '0 policy divergence detected across 3,600 cluster golden telemetry signals.',
        timestamp: '01:03:18.100',
        badge: 'entropy=0.002 (safe)',
      },
    ],
    strategies: [
      {
        id: 'ae-strat-1',
        name: 'Maintain Continuous Autonomous Guard',
        tier: 'AUTO_FIX',
        riskLevel: 'LOW',
        expectedBenefit: 'Maintains sub-5s MTTD/MTTR automated self-healing readiness.',
        cascadingRisk: 'None.',
        reversibility: 'Immediate',
        requiresApproval: false,
        isFeasible: true,
        score: 99,
        isSelected: true,
      },
    ],
    selectedRecommendation: {
      actionName: 'AUTONOMOUS_GUARD_ACTIVE',
      tier: 'AUTO_FIX',
      selectionRationale: 'All 4 layers healthy. Continuous reasoning engine in warm standby.',
      rejectionRationale: 'No remedial action warranted.',
      estimatedRecoverySeconds: 0,
    },
    workflowTimeline: [
      { step: '01', label: 'Model Warmup', status: 'COMPLETED', time: '01:00:00', detail: 'Gemini 2.5 Pro reasoning weights loaded into inference memory' },
      { step: '02', label: 'Topology Ingestion', status: 'COMPLETED', time: '01:01:00', detail: 'PulseShop microservice dependency graph compiled' },
      { step: '03', label: 'Continuous Telemetry Loop', status: 'ACTIVE', time: '01:03:00', detail: 'Evaluating golden signals every 500ms' },
    ],
    operatorExplanation: 'PatchUP AI Engine executes continuous multimodal SRE reasoning across all PulseShop layers. It detects anomalies, plans counterfactual recovery strategies, and enforces safety gates.',
  },

  'frontend-service': {
    serviceId: 'frontend-service',
    serviceName: 'Frontend',
    diagnosisSummary: {
      rootCause: 'PulseShop Web Client operating normally. Edge CDN cache hit ratio 99.2%, 0 unhandled client exceptions.',
      severity: 'LOW',
      confidenceScore: 0.98,
      incidentState: 'MONITORING',
      impactedServices: ['frontend-service'],
      blastRadius: 'Client presentation layer.',
    },
    evidenceList: [
      {
        id: 'fe-ev-1',
        type: 'LOG',
        title: 'Core Web Vitals Nominal',
        detail: 'LCP=1.1s, FID=12ms, CLS=0.002. 0 unhandled JavaScript exceptions in last 60 minutes.',
        timestamp: '01:00:15.100',
        badge: 'browser.vitals // OK',
      },
      {
        id: 'fe-ev-2',
        type: 'DEPENDENCY',
        title: 'API Gateway Ingress Latency Nominal',
        detail: 'Next.js SSR client requests to API Gateway average 6ms over internal service mesh.',
        timestamp: '01:02:40.200',
        badge: 'edge.mesh // 6ms',
      },
    ],
    strategies: [
      {
        id: 'fe-strat-1',
        name: 'Maintain Nominal Edge Delivery',
        tier: 'AUTO_FIX',
        riskLevel: 'LOW',
        expectedBenefit: 'Ensures sub-30ms client interaction latency for active shoppers.',
        cascadingRisk: 'None.',
        reversibility: 'Immediate',
        requiresApproval: false,
        isFeasible: true,
        score: 97,
        isSelected: true,
      },
    ],
    selectedRecommendation: {
      actionName: 'EDGE_CACHE_OPTIMAL',
      tier: 'AUTO_FIX',
      selectionRationale: 'Client tier is healthy with zero unhandled client errors.',
      rejectionRationale: 'No action required.',
      estimatedRecoverySeconds: 0,
    },
    workflowTimeline: [
      { step: '01', label: 'Synthetic Client Probe', status: 'COMPLETED', time: '01:00:00', detail: 'Headless browser check completed with 200 OK' },
      { step: '02', label: 'SSR Hydration Audit', status: 'COMPLETED', time: '01:01:00', detail: '0 hydration mismatch errors detected' },
      { step: '03', label: 'Continuous Telemetry', status: 'ACTIVE', time: '01:02:00', detail: 'Ingesting browser RUM telemetry' },
    ],
    operatorExplanation: 'PulseShop Frontend client layer is healthy and running smoothly. Edge CDN and browser rendering metrics are well within nominal SLO boundaries.',
  },

  'backend-service': {
    serviceId: 'backend-service',
    serviceName: 'Backend Services',
    diagnosisSummary: {
      rootCause: 'Downstream payment dependency latency spike causing transient Orders connection pool contention (auto-mitigated).',
      severity: 'HIGH',
      confidenceScore: 0.94,
      incidentState: 'RECOVERY_VERIFIED',
      impactedServices: ['orders-service', 'payments-service', 'storefront-db'],
      blastRadius: 'Core order processing pipeline and payment reconciliation.',
    },
    evidenceList: [
      {
        id: 'be-ev-1',
        type: 'LOG',
        title: 'Orders DB Connection Pool Contention',
        detail: 'Database connection pool wait: pg_orders_pool wait_time=18ms (threshold=25ms).',
        timestamp: '00:58:24.102',
        badge: 'orders.log // line 489',
      },
      {
        id: 'be-ev-2',
        type: 'METRIC_SPIKE',
        title: 'Payment Webhook Acknowledgment Timeout',
        detail: 'Third-party PSP webhook acknowledgment timeout (186ms) queued 4 intent holds.',
        timestamp: '00:58:32.410',
        badge: 'payments.log // line 102',
      },
    ],
    strategies: [
      {
        id: 'be-strat-1',
        name: 'Dynamic Ingress Circuit Breaker & Retry Pacing',
        tier: 'AUTO_FIX',
        riskLevel: 'LOW',
        expectedBenefit: 'Sheds 15% non-critical traffic; paces retries to 1200ms with jitter; restores DB pool capacity.',
        cascadingRisk: 'Zero impact on cached reads; prevents full cluster connection exhaustion.',
        reversibility: 'Immediate (<2s via Envoy dynamic filter config update)',
        requiresApproval: false,
        isFeasible: true,
        score: 96,
        isSelected: true,
      },
      {
        id: 'be-strat-2',
        name: 'Authorize PSP Buffer Flush & Webhook Re-sync',
        tier: 'ASK_FIRST',
        riskLevel: 'MEDIUM',
        expectedBenefit: 'Flushes stagnant webhook delivery queue and syncs settlement ledger.',
        cascadingRisk: 'Requires operator confirmation to prevent double-charging.',
        reversibility: 'Reversible via idempotency key',
        requiresApproval: true,
        isFeasible: true,
        score: 84,
      },
    ],
    selectedRecommendation: {
      actionName: 'DYNAMIC_CIRCUIT_BREAKER',
      tier: 'AUTO_FIX',
      selectionRationale: 'Autonomously mitigates connection contention with zero customer disruption.',
      rejectionRationale: 'Docker restart rejected to prevent dropping in-flight checkouts.',
      estimatedRecoverySeconds: 3.8,
    },
    workflowTimeline: [
      { step: '01', label: 'Anomaly Detection', status: 'COMPLETED', time: '00:58:14', detail: 'Synthetic checkout loop flagged 112ms P95 latency surge' },
      { step: '02', label: 'Gemini Diagnosis', status: 'COMPLETED', time: '00:58:16', detail: 'Root cause identified: SQLite pool wait correlated with payment timeout' },
      { step: '03', label: 'Autonomous Remediation', status: 'COMPLETED', time: '00:58:18', detail: 'Dynamic filter tripped; connection pool flushed; latency restored to 64ms' },
    ],
    operatorExplanation: 'Backend cluster microservices (Orders & Payments) have been verified. An autonomous circuit breaker mitigated a transient connection contention event.',
  },
};
