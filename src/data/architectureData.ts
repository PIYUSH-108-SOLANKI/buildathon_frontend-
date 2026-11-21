import { ArchitectureLayer, ArchitectureComponent, LogEntry } from '@/types/architecture';

// ─────────────────────────────────────────────────────────────
// RESTORED 4-LAYER APPLICATION ARCHITECTURE HIERARCHY
// Layer 01: Frontend (Client Web Storefront)
// Layer 02: API Gateway (Ingress Routing & Reverse Proxy)
// Layer 03: Backend (Core Microservices: Orders & Payments)
// Layer 04: PatchUP AI Engine (Autonomous SRE Sentinel)
// ─────────────────────────────────────────────────────────────

export const ORDERS_SERVICE_COMPONENT: ArchitectureComponent = {
  id: 'orders-service',
  name: 'Orders Service',
  layerId: 'layer-backend',
  layerName: 'Layer 03 — Backend // Processing Pipeline',
  category: 'microservice',
  position: [-0.7, 1.36, -0.6],
  status: 'HEALTHY',
  isDemo: false,
  description: 'Handles cart validation, order creation, SQLite connection pool, and inventory state transitions.',
  dependencies: ['payments-service', 'storefront-db'],
  metrics: {
    p95LatencyMs: 64,
    errorRate: 0.0,
    throughputRpm: 840,
    cpuPercent: 26,
    memoryPercent: 52,
    uptimePercent: 99.96,
    activePods: '3 / 3 Ready',
  },
  aiInsight: {
    culpritProbability: 0.04,
    diagnosis: 'Orders business logic functioning normally. SQLite connection pool healthy.',
    blastRadius: 'Core order pipeline.',
    counterfactualStrategies: [
      {
        name: 'Recycle Connection Pool',
        tier: 'AUTO_FIX',
        expectedBenefit: 'Flushes stale database connections',
        riskOfWorsening: 'LOW',
        cascadingRisk: 'Zero impact; warm pool available',
        reversibility: 'IMMEDIATE',
        score: 88,
      },
    ],
  },
};

export const PAYMENTS_SERVICE_COMPONENT: ArchitectureComponent = {
  id: 'payments-service',
  name: 'Payments Service',
  layerId: 'layer-backend',
  layerName: 'Layer 03 — Backend // Financial Transactions',
  category: 'microservice',
  position: [0.8, 1.36, 0.4],
  status: 'HEALTHY',
  isDemo: false,
  description: 'Processes credit card transactions, fraud verification, and manages payment gateway webhooks.',
  dependencies: ['storefront-db'],
  metrics: {
    p95LatencyMs: 112,
    errorRate: 0.0,
    throughputRpm: 320,
    cpuPercent: 22,
    memoryPercent: 48,
    uptimePercent: 99.91,
    activePods: '2 / 2 Ready',
  },
  aiInsight: {
    culpritProbability: 0.03,
    diagnosis: 'Payment processing normal. Webhook idempotency ledger validated.',
    blastRadius: 'Payment settlement channel.',
    counterfactualStrategies: [
      {
        name: 'Circuit Breaker Fallback Mode',
        tier: 'ASK_FIRST',
        expectedBenefit: 'Queues transactions if upstream gateway slows',
        riskOfWorsening: 'HIGH',
        cascadingRisk: 'Delays payment confirmations for active shoppers',
        reversibility: 'MODERATE',
        score: 35,
      },
    ],
  },
};

export const INVENTORY_SERVICE_COMPONENT: ArchitectureComponent = {
  id: 'inventory-service',
  name: 'Catalog & Inventory',
  layerId: 'layer-backend',
  layerName: 'Layer 03 — Backend // Catalog Indexing',
  category: 'microservice',
  position: [0.0, 1.36, 0.0],
  status: 'HEALTHY',
  isDemo: true, // Explicitly labeled as demo data
  description: 'Catalog indexing, SKU cache, and real-time inventory reservations. (Demo component).',
  dependencies: ['storefront-db'],
  metrics: {
    p95LatencyMs: 38,
    errorRate: 0.0,
    throughputRpm: 540,
    cpuPercent: 16,
    memoryPercent: 36,
    uptimePercent: 99.99,
    activePods: '2 / 2 Ready',
  },
};

export const GITHUB_SERVICE_COMPONENT: ArchitectureComponent = {
  id: 'git-sep',
  name: 'Git Sep',
  layerId: 'layer-git-sep',
  layerName: 'Layer 00 — Base // Microsoft & GitHub VCS',
  category: 'base_vcs',
  position: [0, 0.28, 0],
  status: 'HEALTHY',
  isDemo: true, // Explicitly labeled as demo component
  description: 'Git Sep — Microsoft & GitHub automated VCS sync, pull request verification, canary rollback git trees, and CI/CD audit ledger.',
  dependencies: ['gateway-service'],
  metrics: {
    p95LatencyMs: 48,
    errorRate: 0.0,
    throughputRpm: 180,
    cpuPercent: 12,
    memoryPercent: 34,
    uptimePercent: 99.99,
    activePods: '2 / 2 Ready',
  },
  aiInsight: {
    culpritProbability: 0.02,
    diagnosis: 'Git Sep webhook delivery and Microsoft GitHub sync ledger nominal. 0 dropped commits.',
    blastRadius: 'Automated remediation commits and canary deployment gate.',
    counterfactualStrategies: [
      {
        name: 'Automated PR Canary Rollback Commit',
        tier: 'AUTO_FIX',
        expectedBenefit: 'Reverts offending configuration commit within 1.2s of telemetry anomaly',
        riskOfWorsening: 'LOW',
        cascadingRisk: 'Zero impact on active shopper transactions',
        reversibility: 'IMMEDIATE',
        score: 95,
      },
    ],
  },
};

export const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  // ── LAYER 04: PATCHUP AI ENGINE (Topmost Platform) ─────────────────────
  {
    id: 'layer-ai-engine',
    name: 'Layer 04 — PatchUP AI Engine',
    levelNumber: 4,
    yPosition: 1.96,
    description: 'Autonomous incident detection, Gemini multimodal reasoning, counterfactual simulation, and policy-governed self-healing.',
    color: '#F9DDCA',
    components: [
      {
        id: 'ai-engine',
        name: 'PatchUP AI Engine',
        layerId: 'layer-ai-engine',
        layerName: 'Layer 04 — PatchUP AI Engine',
        category: 'ai_engine',
        position: [0, 1.96, 0],
        status: 'HEALTHY',
        isDemo: false,
        description: 'Autonomous SRE Sentinel. Ingests full-cluster golden signals, diagnoses root causes via Gemini 2.5, evaluates counterfactual strategies, and enforces safety policy tiers.',
        dependencies: ['gateway-service', 'orders-service', 'payments-service'],
        metrics: {
          p95LatencyMs: 450,
          errorRate: 0.0,
          throughputRpm: 48,
          cpuPercent: 28,
          memoryPercent: 54,
          uptimePercent: 100.0,
          activePods: '1 Sentinel Active',
        },
        aiInsight: {
          culpritProbability: 0.01,
          diagnosis: 'Sentinel monitoring loop active. All PulseShop tiers operating within nominal error budget.',
          blastRadius: 'Reliability plane. Controls autonomous remediation across containerized workloads.',
          counterfactualStrategies: [
            {
              name: 'Preserve Nominal Sentinel State',
              tier: 'AUTO_FIX',
              expectedBenefit: 'Continuous multi-probe telemetry evaluation with sub-second MTTD',
              riskOfWorsening: 'LOW',
              cascadingRisk: 'None detected across monitored application services',
              reversibility: 'IMMEDIATE',
              score: 99,
            },
          ],
        },
      },
    ],
  },

  // ── LAYER 03: BACKEND (Microservice Cluster — Hero Orange Underglow) ────
  {
    id: 'layer-backend',
    name: 'Layer 03 — Backend',
    levelNumber: 3,
    yPosition: 1.54,
    description: 'Core microservice cluster hosting PulseShop domain services: Orders, Payments, and Catalog dependencies.',
    color: '#FF5500',
    components: [
      {
        id: 'backend-service',
        name: 'Backend Microservices',
        layerId: 'layer-backend',
        layerName: 'Layer 03 — Backend',
        category: 'microservice',
        position: [0, 1.54, 0],
        status: 'HEALTHY',
        isDemo: false,
        description: 'Composite backend cluster hosting Orders Service, Payments Service, and dependent services. Select individual microservices below to inspect live telemetry and recovery.',
        dependencies: ['storefront-db'],
        subServices: [
          ORDERS_SERVICE_COMPONENT,
          PAYMENTS_SERVICE_COMPONENT,
          INVENTORY_SERVICE_COMPONENT,
        ],
        metrics: {
          p95LatencyMs: 64,
          errorRate: 0.0,
          throughputRpm: 1160,
          cpuPercent: 24,
          memoryPercent: 50,
          uptimePercent: 99.95,
          activePods: '5 / 5 Ready',
        },
        aiInsight: {
          culpritProbability: 0.04,
          diagnosis: 'Backend cluster healthy. Database pool wait nominal; webhook backlog cleared.',
          blastRadius: 'Core e-commerce checkout and transaction ledger.',
          counterfactualStrategies: [
            {
              name: 'Dynamic Retry Pacing & Connection Pool Flush',
              tier: 'AUTO_FIX',
              expectedBenefit: 'Maintains optimal checkout throughput during transient spikes',
              riskOfWorsening: 'LOW',
              cascadingRisk: 'Zero impact on cached reads',
              reversibility: 'IMMEDIATE',
              score: 96,
            },
          ],
        },
      },
      ORDERS_SERVICE_COMPONENT,
      PAYMENTS_SERVICE_COMPONENT,
      INVENTORY_SERVICE_COMPONENT,
    ],
  },

  // ── LAYER 02: API GATEWAY (Ingress Routing) ───────────────────────────
  {
    id: 'layer-gateway',
    name: 'Layer 02 — API Gateway',
    levelNumber: 2,
    yPosition: 1.12,
    description: 'Reverse proxy, SSL termination, and rate-limiting ingress routing client requests to upstream backend microservices.',
    color: '#F9DDCA',
    components: [
      {
        id: 'gateway-service',
        name: 'API Gateway',
        layerId: 'layer-gateway',
        layerName: 'Layer 02 — API Gateway',
        category: 'microservice',
        position: [0, 1.12, 0],
        status: 'HEALTHY',
        isDemo: false,
        description: 'Edge reverse proxy routing client HTTP requests, terminating TLS, and enforcing token-bucket rate limits across downstream services.',
        dependencies: ['orders-service', 'payments-service'],
        metrics: {
          p95LatencyMs: 42,
          errorRate: 0.01,
          throughputRpm: 1420,
          cpuPercent: 18,
          memoryPercent: 45,
          uptimePercent: 99.98,
          activePods: '3 / 3 Ready',
        },
        aiInsight: {
          culpritProbability: 0.02,
          diagnosis: 'Gateway ingress healthy. SSL termination and routing latency under 45ms.',
          blastRadius: 'Ingress node. If degraded, impacts 100% of user checkouts.',
          counterfactualStrategies: [
            {
              name: 'Scale Gateway Ingress Replicas (3 -> 5)',
              tier: 'AUTO_FIX',
              expectedBenefit: 'Reduces peak tail latency under traffic surges',
              riskOfWorsening: 'LOW',
              cascadingRisk: 'Increases concurrent pool connections to downstream Orders',
              reversibility: 'IMMEDIATE',
              score: 92,
            },
          ],
        },
      },
    ],
  },

  // ── LAYER 01: FRONTEND (Client Storefront) ────────────────────────────
  {
    id: 'layer-frontend',
    name: 'Layer 01 — Frontend',
    levelNumber: 1,
    yPosition: 0.70,
    description: 'Client application storefront handling customer browsing, UI state, rendering, and API Gateway communication.',
    color: '#F9DDCA',
    components: [
      {
        id: 'frontend-service',
        name: 'Frontend',
        layerId: 'layer-frontend',
        layerName: 'Layer 01 — Frontend',
        category: 'microservice',
        position: [0, 0.70, 0],
        status: 'HEALTHY',
        isDemo: true, // Marked demo data
        description: 'PulseShop Web Client Storefront. Handles browser rendering, Next.js SSR hydration, client navigation, and API Gateway communication.',
        dependencies: ['gateway-service'],
        metrics: {
          p95LatencyMs: 24,
          errorRate: 0.0,
          throughputRpm: 1850,
          cpuPercent: 14,
          memoryPercent: 32,
          uptimePercent: 99.98,
          activePods: '2 / 2 Ready',
        },
        aiInsight: {
          culpritProbability: 0.01,
          diagnosis: 'Client web storefront nominal. Edge CDN cache hit ratio 99.2%, 0 client-side unhandled errors.',
          blastRadius: 'User-facing browser presentation tier.',
          counterfactualStrategies: [
            {
              name: 'Edge Static Asset Warmup',
              tier: 'AUTO_FIX',
              expectedBenefit: 'Minimizes first-load paint times across CDN nodes',
              riskOfWorsening: 'LOW',
              cascadingRisk: 'Negligible bandwidth utilization',
              reversibility: 'IMMEDIATE',
              score: 95,
            },
          ],
        },
      },
    ],
  },

  // ── LAYER 00: BASE — GIT SEP (Microsoft & GitHub VCS) ─────────────────
  {
    id: 'layer-git-sep',
    name: 'Layer 00 — Base // Microsoft VCS (Git Sep)',
    levelNumber: 0,
    yPosition: 0.28,
    description: 'Foundational VCS and deployment plane hosting Git Sep: automated Git trees, GitHub webhook sync, and canary rollback commits.',
    color: '#FF5500',
    components: [
      GITHUB_SERVICE_COMPONENT,
    ],
  },
];

// Helper to find any component across all layers with aliases
export function findComponentById(id: string): ArchitectureComponent | undefined {
  // Alias mappings
  let lookupId = id;
  if (id === 'gemini-brain') lookupId = 'ai-engine';

  for (const layer of ARCHITECTURE_LAYERS) {
    const found = layer.components.find((c) => c.id === lookupId || c.id === id);
    if (found) return found;

    // Also search nested subservices
    for (const c of layer.components) {
      if (c.subServices) {
        const subFound = c.subServices.find((s) => s.id === lookupId || s.id === id);
        if (subFound) return subFound;
      }
    }
  }

  // Fallbacks for known service IDs
  if (id === 'orders-service') return ORDERS_SERVICE_COMPONENT;
  if (id === 'payments-service') return PAYMENTS_SERVICE_COMPONENT;
  if (id === 'inventory-service') return INVENTORY_SERVICE_COMPONENT;
  if (id === 'git-sep' || id === 'github-service' || id === 'git-service' || id === 'layer-git-sep') return GITHUB_SERVICE_COMPONENT;

  return undefined;
}

// Seed logs generator for the live terminal
export const SEED_LOGS: LogEntry[] = [
  {
    id: 'log-git-sep-1',
    timestamp: '19:20:11.890',
    severity: 'INFO',
    service: 'git-sep',
    message: 'Git Sep: Microsoft / GitHub webhook ingress: event=push branch=main repo=pulseshop/core commit=8f392a (verified)',
    isSimulated: true,
  },
  {
    id: 'log-git-sep-2',
    timestamp: '19:20:12.450',
    severity: 'AI',
    service: 'git-sep',
    message: 'Git Sep: Automated PR canary rollback commit tree verified against PatchUP safety gate',
    isSimulated: true,
  },
  {
    id: 'log-1',
    timestamp: '19:20:12.104',
    severity: 'INFO',
    service: 'frontend-service',
    message: 'Client SPA route transition: /catalog -> /checkout (render=18ms)',
    isSimulated: true,
  },
  {
    id: 'log-2',
    timestamp: '19:20:13.410',
    severity: 'INFO',
    service: 'gateway-service',
    message: 'HTTP POST /api/v1/orders/checkout -> 201 Created (ip=192.168.1.104, latency=24ms)',
    isSimulated: true,
  },
  {
    id: 'log-3',
    timestamp: '19:20:14.280',
    severity: 'INFO',
    service: 'orders-service',
    message: 'Cart state transition: CHECKOUT_PENDING -> ORDER_CONFIRMED (ord_91823)',
    isSimulated: true,
  },
  {
    id: 'log-4',
    timestamp: '19:20:15.892',
    severity: 'AI',
    service: 'ai-engine',
    message: 'PatchUP Sentinel: Telemetry matrix nominal across all 4 architectural layers',
    isSimulated: true,
  },
  {
    id: 'log-5',
    timestamp: '19:20:16.015',
    severity: 'INFO',
    service: 'payments-service',
    message: 'Charge authorized: txn_771928 amount=$84.50 status=settled (PSP latency=42ms)',
    isSimulated: true,
  },
];
