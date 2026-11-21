import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LogEntry } from '@/types/architecture';
import { Play, Pause, ArrowDown, RotateCcw, Filter, Radio, Zap } from 'lucide-react';

interface LiveLogStreamerProps {
  activeServiceId?: string;
  className?: string;
}

// ─────────────────────────────────────────────────────────────
// DYNAMIC DOMAIN-SPECIFIC LOG GENERATORS
// Generates realistic, continuously varying live telemetry logs
// with authentic IDs, realistic latencies, trace spans, and statuses
// ─────────────────────────────────────────────────────────────

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const SKUS = ['SKU-8841-B', 'SKU-2091-A', 'SKU-9904-C', 'SKU-5512-D', 'SKU-1049-F'];
const ENDPOINTS = [
  '/api/v1/orders/checkout',
  '/api/v1/cart/items',
  '/api/v1/orders/status',
  '/api/v1/catalog/featured',
  '/api/v1/payments/intent',
];

function generateDynamicLog(serviceId: string = 'orders-service'): {
  severity: LogEntry['severity'];
  message: string;
} {
  const ordId = `ord_${randInt(10000, 99999)}`;
  const usrId = `usr_${randInt(1000, 9999)}`;
  const sku = randChoice(SKUS);
  const latency = randInt(4, 38);
  const dbLatency = randInt(2, 19);

  switch (serviceId) {
    case 'orders-service': {
      const templates = [
        { severity: 'INFO' as const, message: `HTTP POST /api/v1/orders/checkout -> 201 Created (id=${ordId}, duration=${latency}ms)` },
        { severity: 'INFO' as const, message: `Inventory reservation confirmed: ${sku} (qty=${randInt(1, 3)}, warehouse=us-east-1)` },
        { severity: 'INFO' as const, message: `Cart state transition: CHECKOUT_PENDING -> ORDER_CONFIRMED (user_id=${usrId})` },
        { severity: 'INFO' as const, message: `Database pool acquire: pg_orders_pool duration=${dbLatency}ms (active_handles=${randInt(14, 28)}/60)` },
        { severity: 'INFO' as const, message: `Async event published: topic=orders.created partition=${randInt(0, 3)} offset=${randInt(89000, 99999)}` },
        { severity: 'INFO' as const, message: `Order state audit signed: ledger_hash=0x${randInt(1000000, 9999999).toString(16)} duration=6ms` },
        { severity: 'INFO' as const, message: `HTTP GET /api/v1/orders/${ordId}/status -> 200 OK (latency=${randInt(2, 8)}ms)` },
        { severity: 'WARN' as const, message: `Connection pool wait: pg_orders_pool wait_time=${randInt(16, 22)}ms (threshold=25ms nominal)` },
        { severity: 'AI' as const, message: `PatchUP Sentinel: Orders checkout P95 latency (${randInt(58, 66)}ms) within nominal SLO budget` },
      ];
      return randChoice(templates);
    }

    case 'payments-service': {
      const amt = (randInt(20, 280) + 0.50).toFixed(2);
      const txnId = `txn_${randInt(100000, 999999)}`;
      const templates = [
        { severity: 'INFO' as const, message: `Payment intent created: intent_id=pi_${randInt(10000, 99999)} amount=$${amt} currency=USD` },
        { severity: 'INFO' as const, message: `Stripe gateway webhook verified: signature_valid=true (event=charge.succeeded, id=ch_${randInt(10000, 99999)})` },
        { severity: 'INFO' as const, message: `Double-entry ledger written: debited=acc_${usrId} credited=acc_settle_01 ($${amt})` },
        { severity: 'INFO' as const, message: `Fraud ML score evaluated: risk_score=0.0${randInt(12, 28)} (decision=APPROVE, latency=${randInt(12, 24)}ms)` },
        { severity: 'INFO' as const, message: `PCI-DSS tokenization lookup: token=tok_visa_4242 vault=kms-us-east-1 (latency=3ms)` },
        { severity: 'INFO' as const, message: `Webhook idempotency verified: key=idem_${txnId} (0 duplicate submissions)` },
        { severity: 'WARN' as const, message: `PSP upstream latency variance: stripe_rtt=${randInt(98, 140)}ms (within retry envelope)` },
        { severity: 'AI' as const, message: `PatchUP Sentinel: Payment settlement ledger parity verified at 100.0% integrity` },
      ];
      return randChoice(templates);
    }

    case 'gateway-service': {
      const ep = randChoice(ENDPOINTS);
      const ip = `192.168.1.${randInt(10, 240)}`;
      const templates = [
        { severity: 'INFO' as const, message: `Ingress dispatch: GET ${ep} -> 200 OK (ip=${ip}, latency=${latency}ms)` },
        { severity: 'INFO' as const, message: `TLS 1.3 session reused (cipher=ECDHE-RSA-AES128-GCM-SHA256, handshake=1ms)` },
        { severity: 'INFO' as const, message: `Ingress rate-limiting bucket: consumed=1, remaining=${randInt(1380, 1450)} (burst=1500)` },
        { severity: 'INFO' as const, message: `Edge JWT claims verified: sub=${usrId} role=customer exp=${randInt(1732240000, 1732250000)}` },
        { severity: 'INFO' as const, message: `Upstream HTTP proxy dispatch: target=orders-service route=/checkout (latency=${randInt(12, 28)}ms)` },
        { severity: 'INFO' as const, message: `CORS preflight request OPTIONS ${ep} -> 204 No Content` },
        { severity: 'WARN' as const, message: `Upstream retry pace: route=orders-service attempt=1/3 delay=${randInt(10, 18)}ms` },
        { severity: 'AI' as const, message: `PatchUP Sentinel: Ingress traffic entropy distribution nominal across cluster` },
      ];
      return randChoice(templates);
    }

    case 'frontend-service': {
      const templates = [
        { severity: 'INFO' as const, message: `PulseShop Client: Next.js SSR page hydration completed (duration=${randInt(12, 24)}ms)` },
        { severity: 'INFO' as const, message: `Client route transition: /catalog/featured -> /checkout/confirm (render=${randInt(14, 22)}ms)` },
        { severity: 'INFO' as const, message: `Edge CDN static chunk cache hit: /static/chunks/app-main.js (hit_ratio=99.${randInt(2, 8)}%)` },
        { severity: 'INFO' as const, message: `Browser Core Web Vitals beacon: LCP=1.1s, FID=${randInt(8, 16)}ms, CLS=0.002 (Good)` },
        { severity: 'INFO' as const, message: `In-browser checkout state initialized: session_id=sess_${randInt(10000, 99999)} cart_items=${randInt(1, 4)}` },
        { severity: 'INFO' as const, message: `API Gateway connection ping: wss://gateway.pulseshop.internal/live (RTT=${randInt(3, 6)}ms)` },
        { severity: 'AI' as const, message: `PatchUP Sentinel: Client-side unhandled exception rate verified at 0.00%` },
      ];
      return randChoice(templates);
    }

    case 'git-sep':
    case 'git-service':
    case 'github-service': {
      const commitSha = Math.random().toString(16).substring(2, 8);
      const prNum = randInt(104, 380);
      const templates = [
        { severity: 'INFO' as const, message: `Git Sep: Microsoft / GitHub webhook received (event=push, commit=#${commitSha}, branch=main)` },
        { severity: 'INFO' as const, message: `Git Sep CI/CD: Automated PR #${prNum} verification checks passed (duration=${randInt(18, 42)}s)` },
        { severity: 'INFO' as const, message: `Git Sep Security: Cryptographic webhook signature verified (Microsoft / GitHub token OK)` },
        { severity: 'AI' as const, message: `PatchUP Sentinel: Git Sep automated rollback tree staged (#revert-conf-${randInt(1000, 9999)})` },
        { severity: 'INFO' as const, message: `Git Sep Sync: Upstream branch synchronization latency=${randInt(35, 65)}ms (0 drift)` },
        { severity: 'INFO' as const, message: `Git Sep Canary: Release gate status=HEALTHY (traffic_split=10/90 nominal)` },
      ];
      return randChoice(templates);
    }

    case 'ai-engine':
    case 'gemini-brain': {
      const templates = [
        { severity: 'AI' as const, message: `PatchUP AI Engine: Autonomous sentinel loop running across 4 architectural layers` },
        { severity: 'AI' as const, message: `Synthetic prober completed end-to-end loop: gateway=OK orders=OK payments=OK (${randInt(32, 42)}ms)` },
        { severity: 'AI' as const, message: `Gemini 2.5 multimodal tensor evaluation: divergence_score=0.00${randInt(1, 5)} (nominal bounds)` },
        { severity: 'AI' as const, message: `Autonomous remediation policy gate: AUTO_FIX mode armed, 0 risky commands queued` },
        { severity: 'INFO' as const, message: `Telemetry aggregator collected 3,600 golden metrics across cluster daemonsets` },
        { severity: 'AI' as const, message: `SLO error budget scorecard: availability=99.998% against 99.950% target threshold` },
        { severity: 'INFO' as const, message: `Root cause counterfactual simulator: Standby pass completed in ${randInt(35, 52)}ms (drift=0.00%)` },
        { severity: 'AI' as const, message: `Memory footprint audit: Node memory distribution optimal across all containers` },
      ];
      return randChoice(templates);
    }

    case 'backend-service':
    default: {
      const templates = [
        { severity: 'INFO' as const, message: `Backend cluster supervisor: Orders Service and Payments Service reporting healthy` },
        { severity: 'INFO' as const, message: `HTTP POST /api/v1/orders/checkout -> 201 Created (id=${ordId}, duration=${latency}ms)` },
        { severity: 'INFO' as const, message: `Inventory reservation confirmed: ${sku} (qty=${randInt(1, 2)}, warehouse=us-east-1)` },
        { severity: 'INFO' as const, message: `Payment intent created: intent_id=pi_${randInt(10000, 99999)} amount=$${randInt(40, 180)}.50` },
        { severity: 'WARN' as const, message: `Database connection pool wait: pg_orders_pool wait_time=${randInt(14, 20)}ms (threshold=25ms)` },
        { severity: 'AI' as const, message: `PatchUP Sentinel: Cluster P95 latency (${randInt(62, 68)}ms) within SLO error budget` },
        { severity: 'INFO' as const, message: `Async event published: topic=orders.created partition=2 offset=${randInt(89000, 99000)}` },
        { severity: 'INFO' as const, message: `Stripe gateway webhook verified: signature_valid=true (charge.succeeded)` },
      ];
      return randChoice(templates);
    }
  }
}

function generateInitialLogs(serviceId: string = 'orders-service', count: number = 14): LogEntry[] {
  const now = Date.now();
  const logs: LogEntry[] = [];

  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(now - i * 650);
    const timeStr = `${time.toTimeString().split(' ')[0]}.${String(time.getMilliseconds()).padStart(3, '0')}`;
    const dynamic = generateDynamicLog(serviceId);

    logs.push({
      id: `seed-log-${serviceId}-${i}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: timeStr,
      severity: dynamic.severity,
      service: serviceId,
      message: dynamic.message,
      isSimulated: true,
    });
  }

  return logs;
}

export const LiveLogStreamer: React.FC<LiveLogStreamerProps> = ({
  activeServiceId = 'orders-service',
  className = '',
}) => {
  const [logs, setLogs] = useState<LogEntry[]>(() => generateInitialLogs(activeServiceId));
  const [isPaused, setIsPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [streamRate, setStreamRate] = useState<number>(3.1);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const latestLogIdRef = useRef<string | null>(null);

  // When activeServiceId changes, immediately seed fresh, domain-specific logs
  useEffect(() => {
    setLogs(generateInitialLogs(activeServiceId, 14));
  }, [activeServiceId]);

  // Append a single log entry
  const appendLog = useCallback(() => {
    const dynamic = generateDynamicLog(activeServiceId);
    const now = new Date();
    const timeStr = `${now.toTimeString().split(' ')[0]}.${String(
      now.getMilliseconds()
    ).padStart(3, '0')}`;
    const newId = `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    latestLogIdRef.current = newId;

    const newEntry: LogEntry = {
      id: newId,
      timestamp: timeStr,
      severity: dynamic.severity,
      service: activeServiceId,
      message: dynamic.message,
      isSimulated: true,
    };

    setLogs((prev) => {
      // Keep generous ring buffer of 180 entries
      const next = prev.length > 180 ? prev.slice(-160) : prev;
      return [...next, newEntry];
    });
  }, [activeServiceId]);

  // Dynamic continuous live log streaming loop ("running running running")
  useEffect(() => {
    if (isPaused) return;

    let timeoutId: NodeJS.Timeout;
    let isActive = true;

    const scheduleNextLog = () => {
      if (!isActive || isPaused) return;

      // Realistic cadence: 280ms to 620ms between events (~2.5 - 3.5 events/sec)
      const nextDelay = randInt(280, 620);

      timeoutId = setTimeout(() => {
        appendLog();

        // 20% probability of an immediate companion burst (e.g. DB query 80ms after HTTP event)
        if (Math.random() < 0.22) {
          setTimeout(() => {
            if (isActive && !isPaused) appendLog();
          }, randInt(70, 110));
        }

        scheduleNextLog();
      }, nextDelay);
    };

    scheduleNextLog();

    // Occasional subtle fluctuation in display rate for authentic realism
    const rateInterval = setInterval(() => {
      setStreamRate(+(2.6 + Math.random() * 0.9).toFixed(1));
    }, 2400);

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
      clearInterval(rateInterval);
    };
  }, [isPaused, appendLog]);

  // Smooth auto-scroll behavior
  useEffect(() => {
    if (autoScroll && scrollContainerRef.current) {
      const el = scrollContainerRef.current;
      // Scroll smoothly to bottom
      el.scrollTo({
        top: el.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [logs, autoScroll]);

  // Pause auto-scroll when user manually scrolls up
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 40;
    if (!isAtBottom && autoScroll) {
      setAutoScroll(false);
    }
  };

  // Filter logs by active service and severity
  const filteredLogs = logs.filter((log) => {
    if (filterSeverity !== 'ALL' && log.severity !== filterSeverity) return false;
    return true;
  });

  const getSeverityBadge = (severity: LogEntry['severity']) => {
    switch (severity) {
      case 'ERROR':
        return 'bg-[#FFF1F2] text-[#BE123C] border-[#FECDD3]';
      case 'WARN':
        return 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]';
      case 'AI':
        return 'bg-[#F5F3FF] text-[#6D28D9] border-[#DDD6FE]';
      case 'INFO':
      default:
        return 'bg-[#FAF8F5] text-[#79716B] border-[#EFE8E1]';
    }
  };

  return (
    <div
      className={`rounded-xl border border-[#E9B590]/40 bg-white/95 shadow-soft-xs flex flex-col overflow-hidden text-xs ${className}`}
    >
      {/* Terminal Header Toolbar */}
      <div className="px-4 py-2.5 bg-[#FAF8F5]/80 border-b border-[#E9B590]/25 flex items-center justify-between gap-2 select-none shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            {!isPaused && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isPaused ? 'bg-[#F59E0B]' : 'bg-[#10B981]'
              }`}
            />
          </div>
          <span className="font-semibold text-[#181614] tracking-tight">
            Live Telemetry Logs
          </span>

          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
            <Radio className="w-2.5 h-2.5 animate-pulse text-[#10B981]" />
            <span>{isPaused ? 'PAUSED' : `STREAMING (${streamRate} eps)`}</span>
          </span>
        </div>

        {/* Stream Controls */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono">
          {/* Pause / Resume */}
          <button
            type="button"
            onClick={() => setIsPaused((p) => !p)}
            className="px-2.5 py-1 rounded-md bg-white border border-[#EFE8E1] text-[#292623] hover:bg-[#F6F4F0] hover:border-[#FF5500]/40 transition-all flex items-center gap-1 cursor-pointer shadow-soft-2xs"
          >
            {isPaused ? (
              <>
                <Play className="w-3 h-3 text-[#10B981]" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3 text-[#FF5500]" />
                <span>Pause</span>
              </>
            )}
          </button>

          {/* Auto Scroll Toggle */}
          <button
            type="button"
            onClick={() => setAutoScroll((a) => !a)}
            className={`px-2.5 py-1 rounded-md border transition-all flex items-center gap-1 cursor-pointer shadow-soft-2xs ${
              autoScroll
                ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FFD8BF] font-semibold'
                : 'bg-white text-[#79716B] border-[#EFE8E1] hover:text-[#181614]'
            }`}
          >
            <ArrowDown className={`w-3 h-3 ${autoScroll ? 'animate-bounce' : ''}`} />
            <span>Auto-scroll</span>
          </button>

          {/* Clear Buffer */}
          <button
            type="button"
            onClick={() => setLogs([])}
            title="Clear buffer"
            className="p-1.5 rounded-md bg-white border border-[#EFE8E1] text-[#79716B] hover:text-[#181614] hover:bg-[#F6F4F0] transition-colors cursor-pointer shadow-soft-2xs"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Filter Tabs & Event Counters */}
      <div className="px-4 py-2 bg-[#FAF8F5]/50 border-b border-[#E9B590]/20 flex items-center justify-between select-none text-[11px] font-mono shrink-0">
        <div className="flex items-center gap-2">
          <Filter className="w-3 h-3 text-[#79716B]" />
          <span className="text-[#999286]">Filter:</span>
          {['ALL', 'INFO', 'WARN', 'ERROR', 'AI'].map((sev) => (
            <button
              key={sev}
              type="button"
              onClick={() => setFilterSeverity(sev)}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                filterSeverity === sev
                  ? 'bg-[#181614] text-white shadow-soft-2xs'
                  : 'text-[#79716B] hover:text-[#181614] hover:bg-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-[10px] text-[#999286]">
          <span className="flex items-center gap-1">
            <Zap className="w-2.5 h-2.5 text-[#FF5500]" />
            <span>{filteredLogs.length} events buffered</span>
          </span>
        </div>
      </div>

      {/* Log Feed Lines */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="p-3.5 font-mono space-y-1 overflow-y-auto flex-1 min-h-[360px] max-h-[460px] bg-white [scrollbar-width:thin] [scrollbar-color:rgba(233,181,144,0.35)_transparent]"
      >
        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-[#79716B]">
            No log entries in buffer matching active criteria.
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isLatest = log.id === latestLogIdRef.current;
            return (
              <div
                key={log.id}
                className={`flex items-start gap-2 text-xs leading-relaxed p-1 rounded transition-colors ${
                  isLatest ? 'bg-[#FFF7ED]/70' : 'hover:bg-[#FAF8F5]'
                }`}
              >
                <span className="text-[#A8A29E] shrink-0 select-none text-[11px]">
                  {log.timestamp}
                </span>
                <span
                  className={`px-1.5 py-0.2 rounded border font-semibold text-[10px] shrink-0 select-none ${getSeverityBadge(
                    log.severity
                  )}`}
                >
                  {log.severity}
                </span>
                <span className="text-[#C2410C] shrink-0 font-medium text-[11px]">
                  [{log.service}]
                </span>
                <span className="text-[#292623] break-all">{log.message}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
