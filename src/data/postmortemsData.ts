// ─────────────────────────────────────────────────────────────
// PATCHUP AUTONOMOUS SRE: POSTMORTEM MOCK DATA
// Clearly labeled as DEMO POSTMORTEMS for simulated historical incidents
// ─────────────────────────────────────────────────────────────

export interface PostmortemReport {
  id: string;
  incidentId: string;
  title: string;
  serviceId: string;
  serviceName: string;
  date: string;
  author: string;
  provenance: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: 'RESOLVED' | 'CONTAINED';
  mttdSeconds: number;
  mttrSeconds: number;
  summary: string;
  rootCause: string;
  impact: {
    userImpact: string;
    affectedServices: string[];
    errorBudgetBurn: string;
    downtimeDuration: string;
  };
  timeline: Array<{
    timestamp: string;
    event: string;
    actor: string;
  }>;
  alternativesEvaluated: Array<{
    strategy: string;
    tier: string;
    score: number;
    decision: 'REJECTED' | 'EXECUTED';
    reason: string;
  }>;
  actionTaken: {
    strategyName: string;
    commandExecuted: string;
    executionTimeMs: number;
    safetyTier: string;
  };
  verificationResults: {
    p95LatencyBefore: string;
    p95LatencyAfter: string;
    errorRateBefore: string;
    errorRateAfter: string;
    proberVerdict: string;
  };
  preventionRecommendations: string[];
  markdownContent: string;
}

export const POSTMORTEMS_DATA: Record<string, PostmortemReport> = {
  'inc-9021': {
    id: 'pm-inc-9021',
    incidentId: '#INC-9021',
    title: 'Orders Service — Checkout Latency Surge & SQLite Pool Saturation',
    serviceId: 'orders-service',
    serviceName: 'Orders Service (Layer 03)',
    date: '2026-11-21 00:58:14 UTC',
    author: 'PatchUP Sentinel AI Engine (Gemini 2.5 Multi-modal Reasoner)',
    provenance: 'DEMO POSTMORTEM — Simulated Autonomous Self-Healing Verification',
    severity: 'HIGH',
    status: 'RESOLVED',
    mttdSeconds: 1.8,
    mttrSeconds: 3.4,
    summary:
      'Synthetic checkout probers detected a sharp P95 latency deviation (112ms vs 54ms nominal baseline) in Orders Service checkout flow. Gemini correlated database handle exhaustion caused by unpaced client retries during downstream PSP timeout jitter. PatchUP autonomously triaged the fault, verified blast radius, and executed dynamic traffic shedding and retry pacing within 3.4 seconds, restoring nominal latency with zero dropped orders.',
    rootCause:
      'Upstream client retries lacked exponential backoff and jitter during downstream PSP network blip, leading to SQLite connection pool handle starvation (active handles 28/30, thread wait times spiked to 19ms).',
    impact: {
      userImpact: 'Sub-second checkout lag for ~42 concurrent sessions; zero failed transactions or dropped baskets.',
      affectedServices: ['orders-service', 'storefront-db', 'gateway-service'],
      errorBudgetBurn: '0.008% of monthly 30-day rolling availability budget',
      downtimeDuration: '0.00s (zero hard downtime)',
    },
    timeline: [
      { timestamp: '00:58:14.204', event: 'Synthetic prober detected SLI breach: P95 latency 112ms (threshold 80ms)', actor: 'PulseShop Synthetic Prober' },
      { timestamp: '00:58:14.890', event: 'Gemini reasoning loop correlated SQLite connection pool wait spike (19ms) with PSP retry wave', actor: 'Gemini 2.5 Multimodal Engine' },
      { timestamp: '00:58:15.420', event: 'Evaluated 4 counterfactual remediation strategies against Safety Policy Gate', actor: 'PatchUP Policy Engine' },
      { timestamp: '00:58:16.010', event: 'Selected AUTO_FIX Action: Dynamic Ingress Circuit Breaker & Retry Pacing (Score: 96/100)', actor: 'PatchUP Autonomous Executor' },
      { timestamp: '00:58:16.890', event: 'Applied dynamic Envoy ingress filter: shed 15% non-critical traffic + 1200ms backoff jitter', actor: 'Docker / Ingress Daemon' },
      { timestamp: '00:58:17.604', event: 'Multi-probe health verification passed: P95 latency returned to 58ms nominal; DB wait 4ms', actor: 'PatchUP Multi-Probe Verifier' },
    ],
    alternativesEvaluated: [
      {
        strategy: 'Dynamic Ingress Circuit Breaker & Retry Pacing',
        tier: 'AUTO_FIX',
        score: 96,
        decision: 'EXECUTED',
        reason: 'Optimal reversibility (<2s), zero persistent state mutation, restored DB pool capacity instantly.',
      },
      {
        strategy: 'Docker Hard Container Restart',
        tier: 'ASK_FIRST',
        score: 34,
        decision: 'REJECTED',
        reason: 'Severing container terminates 42 in-flight transactions and initiates secondary cold boot storm.',
      },
      {
        strategy: 'Database Force Flush & Connection Kill',
        tier: 'NEVER_DO',
        score: 12,
        decision: 'REJECTED',
        reason: 'Blocked by Policy Gate: violates ACID ledger safety constraint; risks dropping uncommitted orders.',
      },
      {
        strategy: 'Manual PagerDuty Escalation',
        tier: 'ASK_FIRST',
        score: 42,
        decision: 'REJECTED',
        reason: 'Estimated SRE human MTTA is ~15 minutes, which would breach the 99.9% SLO error budget.',
      },
    ],
    actionTaken: {
      strategyName: 'Dynamic Ingress Circuit Breaker & Retry Pacing',
      commandExecuted: 'patchup-agent filter trip --target=orders-service --shed=15% --jitter=true',
      executionTimeMs: 880,
      safetyTier: 'AUTO_FIX (No Human Approval Required)',
    },
    verificationResults: {
      p95LatencyBefore: '112ms',
      p95LatencyAfter: '58ms (Nominal)',
      errorRateBefore: '0.40%',
      errorRateAfter: '0.00%',
      proberVerdict: 'VERIFIED_HEALTHY (All 6 synthetic probe endpoints passed in 32ms)',
    },
    preventionRecommendations: [
      'Inject Decorrelated Jitter backoff logic directly into frontend client checkout hook.',
      'Scale SQLite threadpool connection reservation envelope from 30 to 50 active handles in Kubernetes deployment config.',
      'Add preemptive circuit breaker trip rule at Gateway level when PSP webhook latency exceeds 120ms for 3 consecutive intervals.',
    ],
    markdownContent: `# [DEMO POSTMORTEM] Incident Report #INC-9021
**Service**: Orders Service (Layer 03 — Backend)  
**Date**: 2026-11-21 00:58:14 UTC  
**Severity**: HIGH  
**Status**: RESOLVED (Self-Healed via PatchUP AUTO_FIX)  
**Author**: PatchUP Sentinel AI Engine (Gemini 2.5 Multi-modal Reasoner)  
**Time to Diagnosis (MTTD)**: 1.8 seconds  
**Time to Recovery (MTTR)**: 3.4 seconds  

---

## 1. Executive Summary
At 00:58:14 UTC, synthetic checkout probers flagged a P95 latency deviation of 112ms against the 54ms baseline in the Orders Service. Gemini 2.5 identified downstream payment latency jitter causing an unpaced client retry storm that saturated the SQLite pool. PatchUP autonomously engaged an ingress shedding and retry jitter policy, recovering nominal latency in 3.4 seconds without human intervention or data loss.

## 2. Root Cause Analysis
During upstream PSP network fluctuation, client retry attempts cascaded rapidly without backoff jitter. As a result, database pool acquire times spiked from 4ms to 19ms, causing in-flight request queues to build up to 28 concurrent handles.

## 3. Impact Assessment
- **Customer Impact**: Minor latency for 42 sessions during checkout confirmation. Zero basket abandonments.
- **Error Budget**: 0.008% of monthly SLO allocation.
- **Affected Tiers**: Orders Service, Storefront Database, API Gateway.

## 4. Remediation & Counterfactual Analysis
- **Selected Action**: Dynamic Ingress Circuit Breaker & Retry Pacing (Score: 96/100, Tier: AUTO_FIX).
- **Command**: \`patchup-agent filter trip --target=orders-service --shed=15% --jitter=true\`
- **Rejected Actions**:
  - Container hard restart (Score: 34 - risks dropping in-flight transactions).
  - DB process force kill (Score: 12 - NEVER_DO safety violation).
  - Manual escalation (Score: 42 - human MTTA too slow).

## 5. Verification Results
- **P95 Latency**: 112ms -> 58ms (48.2% reduction)
- **Error Rate**: 0.40% -> 0.00%
- **Prober Verdict**: All 6 synthetic endpoints verified healthy in 32ms.

## 6. Preventative Action Items
1. [Architecture] Implement Decorrelated Jitter backoff on client checkout handlers.
2. [Capacity] Increase database connection handle pool limit from 30 to 50.
3. [Monitoring] Configure proactive upstream shedding trigger on PSP latency jitter.
`,
  },

  'inc-9018': {
    id: 'pm-inc-9018',
    incidentId: '#INC-9018',
    title: 'Payments Service — Upstream PSP Webhook Timeout & Gateway Retry Saturation',
    serviceId: 'payments-service',
    serviceName: 'Payments Service (Layer 03)',
    date: '2026-11-20 22:15:02 UTC',
    author: 'PatchUP Sentinel AI Engine',
    provenance: 'DEMO POSTMORTEM — Simulated Autonomous Self-Healing Verification',
    severity: 'CRITICAL',
    status: 'RESOLVED',
    mttdSeconds: 2.1,
    mttrSeconds: 4.8,
    summary:
      'Stripe upstream webhook gateway experienced transient timeout spikes exceeding 2500ms. PatchUP detected pending webhook queue saturation, evaluated risk classification, engaged policy gate for secondary PSP node failover, and routed traffic to backup PSP gateway in 4.8 seconds.',
    rootCause:
      'Upstream provider BGP route flap introduced 2400ms RTT to primary payment processor webhook endpoint.',
    impact: {
      userImpact: 'Temporary payment authorization hold on 8 transactions; all succeeded after failover.',
      affectedServices: ['payments-service', 'gateway-service'],
      errorBudgetBurn: '0.012% of monthly budget',
      downtimeDuration: '0.00s',
    },
    timeline: [
      { timestamp: '22:15:02.100', event: 'Stripe gateway RTT exceeded 2000ms threshold (measured: 2480ms)', actor: 'Telemetry Sentinel' },
      { timestamp: '22:15:03.200', event: 'Gemini detected network divergence outside internal cluster boundary', actor: 'Gemini Reasoning' },
      { timestamp: '22:15:04.400', event: 'Engaged ASK_FIRST Safety Gate; verified idempotency key state', actor: 'Safety Policy Gate' },
      { timestamp: '22:15:05.100', event: 'Executed verified route switch to secondary payment processor link', actor: 'Autonomous Executor' },
      { timestamp: '22:15:06.900', event: 'Multi-probe health checks passed on secondary PSP path', actor: 'Verifier' },
    ],
    alternativesEvaluated: [
      {
        strategy: 'Autonomous PSP Gateway Route Switch',
        tier: 'ASK_FIRST',
        score: 92,
        decision: 'EXECUTED',
        reason: 'Restores payment processing immediately via authenticated secondary provider tunnel.',
      },
      {
        strategy: 'Local Payment Service Container Restart',
        tier: 'NEVER_DO',
        score: 18,
        decision: 'REJECTED',
        reason: 'Local container restart does not resolve external BGP provider routing flap.',
      },
    ],
    actionTaken: {
      strategyName: 'Dynamic Payment Ingress Failover',
      commandExecuted: 'patchup-agent route switch --service=payments --upstream=psp-secondary --preserve-idem=true',
      executionTimeMs: 1200,
      safetyTier: 'ASK_FIRST (Pre-authorized by SRE SLA policy)',
    },
    verificationResults: {
      p95LatencyBefore: '2480ms',
      p95LatencyAfter: '112ms (Nominal)',
      errorRateBefore: '1.20%',
      errorRateAfter: '0.00%',
      proberVerdict: 'VERIFIED_HEALTHY (Secondary PSP endpoint responsive in 18ms)',
    },
    preventionRecommendations: [
      'Enable dual-homed multi-region webhook ingress routing with active-active latency probing.',
      'Configure automatic health-checked PSP fallback circuit with 3-consecutive-timeout threshold.',
    ],
    markdownContent: `# [DEMO POSTMORTEM] Incident Report #INC-9018
**Service**: Payments Service (Layer 03 — Backend)  
**Date**: 2026-11-20 22:15:02 UTC  
**Severity**: CRITICAL  
**Status**: RESOLVED (Self-Healed via PatchUP Autonomous Failover)  
**Time to Diagnosis**: 2.1s | **Time to Recovery**: 4.8s  

---
## Summary
Upstream payment processor network flapping caused 2480ms response times. PatchUP triaged the external dependency fault, engaged idempotent session protection, and rerouted ingress to the secondary PSP tunnel in 4.8 seconds.
`,
  },

  'inc-9014': {
    id: 'pm-inc-9014',
    incidentId: '#INC-9014',
    title: 'API Gateway — Route Table Partition Cache Saturation & Ingress Latency Spill',
    serviceId: 'gateway-service',
    serviceName: 'API Gateway (Layer 02)',
    date: '2026-11-20 18:42:11 UTC',
    author: 'PatchUP Sentinel AI Engine',
    provenance: 'DEMO POSTMORTEM — Simulated Autonomous Self-Healing Verification',
    severity: 'HIGH',
    status: 'RESOLVED',
    mttdSeconds: 1.4,
    mttrSeconds: 2.9,
    summary:
      'High ingress traffic burst triggered hash bucket collisions in Envoy route lookup tables. PatchUP hot-reloaded routing partition cache with doubled bucket sizing, restoring sub-millisecond route dispatch in 2.9 seconds.',
    rootCause:
      'Route hash table partition bucket factor undersized for sudden 3.5x ingress traffic burst.',
    impact: {
      userImpact: '18ms edge latency overhead for 340 requests during peak burst.',
      affectedServices: ['gateway-service'],
      errorBudgetBurn: '0.003%',
      downtimeDuration: '0.00s',
    },
    timeline: [
      { timestamp: '18:42:11.050', event: 'Envoy route lookup latency exceeded 15ms threshold', actor: 'Gateway Telemetry' },
      { timestamp: '18:42:12.100', event: 'Gemini detected cache bucket collision pattern', actor: 'Gemini Engine' },
      { timestamp: '18:42:13.200', event: 'Applied AUTO_FIX hot-reload configuration', actor: 'Autonomous Executor' },
      { timestamp: '18:42:13.950', event: 'Ingress route lookup verified at 0.8ms nominal', actor: 'Verifier' },
    ],
    alternativesEvaluated: [
      {
        strategy: 'Hot-Reload Routing Partition Cache',
        tier: 'AUTO_FIX',
        score: 98,
        decision: 'EXECUTED',
        reason: 'Zero connection drops; dynamic atomic Envoy config swap.',
      },
    ],
    actionTaken: {
      strategyName: 'Envoy Partition Table Dynamic Rehash',
      commandExecuted: 'patchup-agent gateway rehash --buckets=4096 --atomic=true',
      executionTimeMs: 750,
      safetyTier: 'AUTO_FIX',
    },
    verificationResults: {
      p95LatencyBefore: '22ms',
      p95LatencyAfter: '1.2ms',
      errorRateBefore: '0.00%',
      errorRateAfter: '0.00%',
      proberVerdict: 'VERIFIED_HEALTHY',
    },
    preventionRecommendations: [
      'Set default Envoy route hash table allocation to 8,192 buckets in Helm values chart.',
    ],
    markdownContent: `# [DEMO POSTMORTEM] Incident Report #INC-9014
**Service**: API Gateway (Layer 02)  
**Date**: 2026-11-20 18:42:11 UTC  
**Severity**: HIGH | **Status**: RESOLVED  
**MTTD**: 1.4s | **MTTR**: 2.9s  
`,
  },
};
