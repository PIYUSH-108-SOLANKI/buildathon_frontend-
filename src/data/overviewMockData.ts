// ─────────────────────────────────────────────────────────────
// PULSESHOP AI SRE OVERVIEW MOCK DATA
// Explicitly verified against running architecture and clearly labeled demo components
// ─────────────────────────────────────────────────────────────

export interface SystemMetricItem {
  id: string;
  label: string;
  value: string;
  unit?: string;
  sublabel: string;
  status: 'healthy' | 'degraded' | 'critical' | 'nominal';
  change?: string;
  description: string;
}

export interface MonitoredServiceItem {
  id: string;
  tierNumber: string;
  name: string;
  tierRole: string;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  latencyMs: number;
  throughputRpm: number;
  errorRatePercent: number;
  cpuPercent: number;
  description: string;
  isHeroOrange?: boolean;
  isDemo?: boolean;
}

export interface AiActivityEvent {
  id: string;
  timestamp: string;
  serviceId: string;
  serviceName: string;
  type: 'PREEMPTIVE_ACTION' | 'SAFETY_GATE' | 'PROBE_AUDIT';
  message: string;
  outcome: string;
}

// ─────────────────────────────────────────────────────────────
// SYSTEM METRICS:
// Note: PatchUP AI is NOT counted as a monitored PulseShop service.
// Monitored Application Tiers: 3 / 3 (Frontend, Gateway, Backend).
// ─────────────────────────────────────────────────────────────
export const SYSTEM_METRICS_DATA: SystemMetricItem[] = [
  {
    id: 'monitored-services',
    label: 'Monitored Tiers',
    value: '3 / 3',
    sublabel: 'PulseShop Application Tiers',
    status: 'healthy',
    change: '100% Online',
    description: 'Frontend, API Gateway & Backend tiers (PatchUP AI Engine observing)',
  },
  {
    id: 'p95-latency',
    label: 'Cluster P95 Latency',
    value: '58',
    unit: 'ms',
    sublabel: 'Weighted Service Average',
    status: 'nominal',
    change: '-14ms vs SLO baseline',
    description: 'Monitored application response times within nominal bounds',
  },
  {
    id: 'error-rate',
    label: 'Aggregate Error Rate',
    value: '0.01',
    unit: '%',
    sublabel: 'HTTP 5xx & Fault Ratio',
    status: 'healthy',
    change: 'Zero unexpected spikes',
    description: 'Well below 0.50% critical circuit breaker threshold',
  },
  {
    id: 'active-incidents',
    label: 'Active Incidents',
    value: '0',
    sublabel: 'Unresolved Anomalies',
    status: 'healthy',
    change: '1 Auto-Mitigated Today',
    description: 'Autonomous recovery active and guarding cluster',
  },
];

// ─────────────────────────────────────────────────────────────
// 4 ARCHITECTURAL TIERS (From Layer 04 down to Layer 01)
// ─────────────────────────────────────────────────────────────
export const MONITORED_SERVICES_DATA: MonitoredServiceItem[] = [
  {
    id: 'ai-engine',
    tierNumber: '04',
    name: 'PatchUP AI Engine',
    tierRole: 'Layer 04 // Autonomous Intelligence & Sentinel',
    status: 'HEALTHY',
    latencyMs: 450,
    throughputRpm: 48,
    errorRatePercent: 0.0,
    cpuPercent: 28,
    description: 'Multimodal Gemini reasoning engine evaluating cluster telemetry, trace anomalies, counterfactual simulations, and safety-gated remediation.',
    isHeroOrange: false,
    isDemo: false,
  },
  {
    id: 'backend-service',
    tierNumber: '03',
    name: 'Backend Services',
    tierRole: 'Layer 03 // Microservice Cluster (Hero Tier)',
    status: 'HEALTHY',
    latencyMs: 64,
    throughputRpm: 1160,
    errorRatePercent: 0.0,
    cpuPercent: 24,
    description: 'Core application logic tier hosting Orders Service (cart & checkout) and Payments Service (PSP webhooks & settlement).',
    isHeroOrange: true,
    isDemo: false,
  },
  {
    id: 'gateway-service',
    tierNumber: '02',
    name: 'API Gateway',
    tierRole: 'Layer 02 // Ingress Routing & Traffic Control',
    status: 'HEALTHY',
    latencyMs: 42,
    throughputRpm: 1420,
    errorRatePercent: 0.01,
    cpuPercent: 18,
    description: 'Reverse proxy and ingress routing client HTTP requests across all downstream microservices.',
    isHeroOrange: false,
    isDemo: false,
  },
  {
    id: 'frontend-service',
    tierNumber: '01',
    name: 'Frontend',
    tierRole: 'Layer 01 // Client Interface & Storefront',
    status: 'HEALTHY',
    latencyMs: 24,
    throughputRpm: 1850,
    errorRatePercent: 0.0,
    cpuPercent: 14,
    description: 'PulseShop Web Client handling customer browsing, UI state, rendering, and API Gateway communication. (Demo Data).',
    isHeroOrange: false,
    isDemo: true,
  },
];

export const RECENT_AI_ACTIVITY_DATA: AiActivityEvent[] = [
  {
    id: 'act-1',
    timestamp: '14:28:10',
    serviceId: 'orders-service',
    serviceName: 'Orders Service',
    type: 'PREEMPTIVE_ACTION',
    message: 'Preemptive connection pool recycle executed on Orders Service database connection pool.',
    outcome: 'P95 latency stabilized (-24ms) before breach threshold',
  },
  {
    id: 'act-2',
    timestamp: '13:12:05',
    serviceId: 'gateway-service',
    serviceName: 'API Gateway',
    type: 'SAFETY_GATE',
    message: 'Ingress rate-limiting token bucket replenished under elevated catalog crawl traffic.',
    outcome: '0 dropped client requests; nominal latency preserved',
  },
  {
    id: 'act-3',
    timestamp: '11:45:30',
    serviceId: 'payments-service',
    serviceName: 'Payments Service',
    type: 'PROBE_AUDIT',
    message: 'Multi-probe synthetic verification of Stripe webhook delivery latency and settlement ledger.',
    outcome: 'SLO verified: 100% compliance across 24 audit probes',
  },
];
