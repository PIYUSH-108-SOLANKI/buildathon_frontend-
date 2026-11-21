import React, { useState } from 'react';
import { ArchitectureComponent } from '@/types/architecture';
import { LiveLogStreamer } from '@/components/telemetry/LiveLogStreamer';
import { Badge, Card, MetricDisplay, SectionHeading, StatusIndicator, Button } from '@/components/ui';
import {
  ArrowLeft,
  Activity,
  Terminal,
  Sparkles,
  Layers,
} from 'lucide-react';

interface ServiceDetailPageProps {
  service: ArchitectureComponent;
  onBack: () => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  service,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'logs' | 'metrics' | 'ai'>('logs');

  return (
    <div className="min-h-screen bg-[#FBFAF8] text-[#292623] flex flex-col antialiased">
      {/* ─────────────────────────────────────────────────────────
          1. TOP NAVIGATION & SERVICE IDENTIFIER
         ───────────────────────────────────────────────────────── */}
      <header className="h-16 bg-white border-b border-[#EFE8E1] px-8 flex items-center justify-between sticky top-0 z-30 shadow-soft-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 h-8 text-xs font-semibold hover:border-[#F28C55]"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#F28C55]" />
            <span>Back to System Architecture</span>
          </Button>

          <div className="h-4 w-px bg-[#EFE8E1]" />

          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-bold text-[#292623] tracking-tight">
              {service.name}
            </h1>
            <Badge
              variant={
                service.status === 'HEALTHY'
                  ? 'healthy'
                  : service.status === 'WARNING'
                  ? 'degraded'
                  : 'critical'
              }
              size="sm"
            >
              {service.status}
            </Badge>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-[#F6F4F0] text-xs font-medium font-mono text-[#79716B]">
          <button
            type="button"
            onClick={() => setActiveTab('logs')}
            className={`py-1.5 px-3 rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'logs'
                ? 'bg-white text-[#292623] shadow-soft-sm font-semibold'
                : 'hover:text-[#292623]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-[#F28C55]" />
            <span>Live Streaming Logs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('metrics')}
            className={`py-1.5 px-3 rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'metrics'
                ? 'bg-white text-[#292623] shadow-soft-sm font-semibold'
                : 'hover:text-[#292623]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Telemetry & Health</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ai')}
            className={`py-1.5 px-3 rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'ai'
                ? 'bg-white text-[#292623] shadow-soft-sm font-semibold'
                : 'hover:text-[#292623]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Gemini AI Reasoning</span>
          </button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────
          2. MAIN CONTENT AREA
         ───────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-8 py-8 space-y-6">
        {/* Service Sub-bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EFE8E1]">
          <div>
            <p className="text-xs text-[#79716B] leading-relaxed max-w-2xl">
              {service.description}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-[#79716B]">
            <span>Replicas: <strong className="text-[#292623]">{service.metrics.activePods || 'Core Engine'}</strong></span>
            <span>&bull;</span>
            <span>Uptime: <strong className="text-[#047857]">{service.metrics.uptimePercent}%</strong></span>
          </div>
        </div>

        {/* TAB 1: LIVE LOGS (PRIMARY REQUEST) */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            <SectionHeading
              title={`Live Streaming Logs — ${service.name}`}
              description="Real-time standard output and diagnostic events emitted by this service container."
            />
            {/* Dedicated full-width live terminal */}
            <LiveLogStreamer activeServiceId={service.id} className="min-h-[500px]" />
          </div>
        )}

        {/* TAB 2: TELEMETRY & METRICS */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <div>
              <SectionHeading title="Operational SLIs & Telemetry" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricDisplay
                  label="P95 Response Latency"
                  value={service.metrics.p95LatencyMs}
                  unit="ms"
                  trend="neutral"
                  delta="nominal"
                />
                <MetricDisplay
                  label="Throughput"
                  value={service.metrics.throughputRpm}
                  unit="rpm"
                  trend="up"
                  delta="+3.2%"
                  positiveIsGood
                />
                <MetricDisplay
                  label="HTTP 5xx Error Rate"
                  value={service.metrics.errorRate}
                  unit="%"
                  trend="down"
                  delta="0.0%"
                  positiveIsGood
                />
                <MetricDisplay
                  label="CPU Utilization"
                  value={service.metrics.cpuPercent}
                  unit="%"
                  trend="neutral"
                  delta="nominal"
                />
              </div>
            </div>

            {/* Dependency Graph Links */}
            <div>
              <SectionHeading title="Topological Connections" />
              <Card padding="md" className="space-y-3">
                <p className="text-xs text-[#79716B]">
                  Direct service-to-service communication pathways configured for this microservice:
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.dependencies.length === 0 ? (
                    <span className="text-xs font-mono text-[#79716B]">
                      No downstream dependencies.
                    </span>
                  ) : (
                    service.dependencies.map((dep) => (
                      <span
                        key={dep}
                        className="px-3 py-1.5 rounded-lg text-xs font-mono bg-[#F6F4F0] text-[#292623] border border-[#EFE8E1] flex items-center gap-1.5"
                      >
                        <Layers className="w-3 h-3 text-[#F28C55]" />
                        <span>&rarr; {dep}</span>
                      </span>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 3: GEMINI AI REASONING */}
        {activeTab === 'ai' && (
          <div className="space-y-6">
            <SectionHeading title="Gemini AI Diagnostic Evaluation" />

            <Card padding="lg" className="space-y-4 bg-[#FFF9F5] border-[#F9DDCA]">
              <div className="flex items-center justify-between">
                <StatusIndicator status="ai" label="Gemini 2.5 Flash SRE Engine" />
                <Badge variant="ai" size="sm">
                  Confidence 98%
                </Badge>
              </div>
              <p className="text-sm text-[#292623] leading-relaxed">
                {service.aiInsight?.diagnosis ||
                  'Service operational telemetry validated against statistical baseline. No anomalous error distribution or cascade propagation detected.'}
              </p>
              <div className="text-xs font-mono text-[#79716B] pt-2 border-t border-[#F9DDCA]">
                <span>Blast radius analysis: </span>
                <span className="text-[#292623] font-semibold">
                  {service.aiInsight?.blastRadius || 'Contained within cluster boundary.'}
                </span>
              </div>
            </Card>

            {/* Counterfactual Evaluation Options */}
            <div>
              <SectionHeading
                title="Counterfactual Remediation Strategies"
                description="Simulated recovery options evaluated prior to autonomous execution."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(service.aiInsight?.counterfactualStrategies || [
                  {
                    name: 'Preserve Nominal Route Allocation',
                    tier: 'AUTO_FIX' as const,
                    expectedBenefit: 'Maintains zero order drop and predictable latency',
                    riskOfWorsening: 'LOW' as const,
                    cascadingRisk: 'Zero impact on downstream callers',
                    reversibility: 'IMMEDIATE',
                    score: 96,
                  },
                ]).map((strat, idx) => (
                  <Card key={idx} padding="md" className="space-y-3 hover:border-[#F28C55]">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#292623]">
                        {strat.name}
                      </span>
                      <Badge variant={strat.tier === 'AUTO_FIX' ? 'healthy' : 'degraded'} size="sm">
                        {strat.tier}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#79716B] leading-relaxed">
                      {strat.expectedBenefit}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#79716B] pt-2 border-t border-[#EFE8E1]">
                      <div>
                        <span>Risk of worsening: </span>
                        <strong className="text-[#047857]">{strat.riskOfWorsening}</strong>
                      </div>
                      <div className="text-right">
                        <span>Risk-adjusted score: </span>
                        <strong className="text-[#F28C55]">{strat.score}/100</strong>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
