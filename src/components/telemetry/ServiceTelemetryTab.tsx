import React from 'react';
import { TELEMETRY_DATA_MAP, ServiceTelemetryData } from '@/data/telemetryMockData';
import {
  Activity,
  AlertTriangle,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';

interface ServiceTelemetryTabProps {
  serviceId: string;
}

// ─────────────────────────────────────────────────────────────
// ELEGANT SVG AREA & LINE CHART GENERATOR
// ─────────────────────────────────────────────────────────────
function renderSvgAreaChart({
  points,
  valueKey,
  color,
  fillColor,
  height = 90,
  minVal,
  maxVal,
  formatVal = (v: number) => `${v}`,
}: {
  points: Array<{ time: string; [key: string]: any }>;
  valueKey: string;
  color: string;
  fillColor: string;
  height?: number;
  minVal?: number;
  maxVal?: number;
  formatVal?: (v: number) => string;
}) {
  const width = 360;
  const paddingX = 14;
  const paddingTop = 12;
  const paddingBottom = 20;

  const vals = points.map((p) => p[valueKey] as number);
  const min = minVal ?? Math.min(...vals, 0);
  const max = maxVal ?? Math.max(...vals, 1);
  const range = max - min || 1;

  const getX = (idx: number) =>
    paddingX + (idx / (points.length - 1)) * (width - paddingX * 2);
  const getY = (v: number) =>
    height - paddingBottom - ((v - min) / range) * (height - paddingTop - paddingBottom);

  const coords = points.map((p, i) => ({
    x: getX(i),
    y: getY(p[valueKey]),
    val: p[valueKey],
    time: p.time,
  }));

  // Build SVG path
  let pathD = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[i];
    const p1 = coords[i + 1];
    const mx = (p0.x + p1.x) / 2;
    pathD += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
  }

  const fillD = `${pathD} L ${coords[coords.length - 1].x} ${height - paddingBottom} L ${coords[0].x} ${height - paddingBottom} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
      <defs>
        <linearGradient id={`grad-${valueKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fillColor} stopOpacity="0.45" />
          <stop offset="95%" stopColor={fillColor} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Subtle Horizontal Reference Grid Lines */}
      <line
        x1={paddingX}
        y1={paddingTop}
        x2={width - paddingX}
        y2={paddingTop}
        stroke="#E9B590"
        strokeOpacity="0.25"
        strokeDasharray="3 3"
      />
      <line
        x1={paddingX}
        y1={height - paddingBottom}
        x2={width - paddingX}
        y2={height - paddingBottom}
        stroke="#E9B590"
        strokeOpacity="0.35"
      />

      {/* Gradient Fill */}
      <path d={fillD} fill={`url(#grad-${valueKey})`} />

      {/* Main Spline Line */}
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" />

      {/* Interactive Data Nodes */}
      {coords.map((c, i) => (
        <g key={i} className="group cursor-pointer">
          <circle
            cx={c.x}
            cy={c.y}
            r={i === coords.length - 1 ? 3.5 : 2.5}
            fill="#FFFFFF"
            stroke={color}
            strokeWidth="1.8"
            className="transition-transform group-hover:scale-150"
          />
        </g>
      ))}

      {/* X-Axis Time Labels */}
      <text
        x={coords[0].x}
        y={height - 5}
        fill="#999286"
        fontSize="9"
        fontFamily="monospace"
        textAnchor="start"
      >
        {coords[0].time}
      </text>
      <text
        x={width / 2}
        y={height - 5}
        fill="#999286"
        fontSize="9"
        fontFamily="monospace"
        textAnchor="middle"
      >
        -6m
      </text>
      <text
        x={coords[coords.length - 1].x}
        y={height - 5}
        fill="#181614"
        fontSize="9"
        fontWeight="bold"
        fontFamily="monospace"
        textAnchor="end"
      >
        now: {formatVal(coords[coords.length - 1].val)}
      </text>
    </svg>
  );
}

export const ServiceTelemetryTab: React.FC<ServiceTelemetryTabProps> = ({ serviceId }) => {
  // Fallback to orders-service data if id not found
  const telemetryData: ServiceTelemetryData =
    TELEMETRY_DATA_MAP[serviceId] || TELEMETRY_DATA_MAP['orders-service'];

  const { metricsSummary, timeSeries, anomalies } = telemetryData;

  return (
    <div className="space-y-4 pb-6 select-none">
      {/* ─────────────────────────────────────────────────────────
          1. LIVE FEED STATUS HEADER STRIP
         ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/80 border border-[#E9B590]/35 shadow-soft-xs text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
          </span>
          <span className="font-semibold text-[#181614]">Live Telemetry Stream</span>
          <span className="text-[10px] text-[#79716B] hidden sm:inline">
            // 5s sampling interval
          </span>
        </div>

        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#FFF7ED] text-[#C2410C] border border-[#FFEDD5]">
          ● SIMULATED SRE FEED
        </span>
      </div>

      {/* ─────────────────────────────────────────────────────────
          2. KEY METRIC SUMMARY TILES (6 SLIs)
         ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* P95 Latency */}
        <div className="bg-white/95 rounded-xl p-2.5 border border-[#E9B590]/40 shadow-soft-xs hover:border-[#FF5500] transition-colors">
          <span className="text-[10px] font-mono uppercase text-[#999286] block">
            P95 Latency
          </span>
          <span className="text-base font-bold font-mono text-[#181614] mt-0.5 block">
            {metricsSummary.p95LatencyMs}ms
          </span>
          <span className="text-[10px] font-mono text-[#047857] flex items-center gap-0.5 mt-0.5">
            <TrendingDown className="w-3 h-3" /> Nominal
          </span>
        </div>

        {/* Error Rate */}
        <div className="bg-white/95 rounded-xl p-2.5 border border-[#E9B590]/40 shadow-soft-xs hover:border-[#FF5500] transition-colors">
          <span className="text-[10px] font-mono uppercase text-[#999286] block">
            Error Rate
          </span>
          <span className="text-base font-bold font-mono text-[#181614] mt-0.5 block">
            {metricsSummary.errorRatePercent.toFixed(2)}%
          </span>
          <span className="text-[10px] font-mono text-[#047857] flex items-center gap-0.5 mt-0.5">
            <ShieldCheck className="w-3 h-3" /> 0 5xx drops
          </span>
        </div>

        {/* Throughput */}
        <div className="bg-white/95 rounded-xl p-2.5 border border-[#E9B590]/40 shadow-soft-xs hover:border-[#FF5500] transition-colors">
          <span className="text-[10px] font-mono uppercase text-[#999286] block">
            Throughput
          </span>
          <span className="text-base font-bold font-mono text-[#181614] mt-0.5 block">
            {metricsSummary.throughputRpm} <span className="text-xs font-normal text-[#79716B]">rpm</span>
          </span>
          <span className="text-[10px] font-mono text-[#57534E] flex items-center gap-0.5 mt-0.5">
            <TrendingUp className="w-3 h-3 text-[#FF5500]" /> Ingress active
          </span>
        </div>

        {/* CPU Usage */}
        <div className="bg-white/95 rounded-xl p-2.5 border border-[#E9B590]/40 shadow-soft-xs hover:border-[#FF5500] transition-colors">
          <span className="text-[10px] font-mono uppercase text-[#999286] block">
            CPU Load
          </span>
          <span className="text-base font-bold font-mono text-[#181614] mt-0.5 block">
            {metricsSummary.cpuPercent}%
          </span>
          <div className="w-full bg-[#FAF8F5] rounded-full h-1 mt-1 overflow-hidden border border-[#E9B590]/25">
            <div
              className="bg-[#FF5500] h-full rounded-full"
              style={{ width: `${metricsSummary.cpuPercent}%` }}
            />
          </div>
        </div>

        {/* Memory RSS */}
        <div className="bg-white/95 rounded-xl p-2.5 border border-[#E9B590]/40 shadow-soft-xs hover:border-[#FF5500] transition-colors">
          <span className="text-[10px] font-mono uppercase text-[#999286] block">
            Resident Memory
          </span>
          <span className="text-base font-bold font-mono text-[#181614] mt-0.5 block">
            {metricsSummary.memoryPercent}%
          </span>
          <div className="w-full bg-[#FAF8F5] rounded-full h-1 mt-1 overflow-hidden border border-[#E9B590]/25">
            <div
              className="bg-[#10B981] h-full rounded-full"
              style={{ width: `${metricsSummary.memoryPercent}%` }}
            />
          </div>
        </div>

        {/* Saturation / Pool Conns */}
        <div className="bg-white/95 rounded-xl p-2.5 border border-[#E9B590]/40 shadow-soft-xs hover:border-[#FF5500] transition-colors">
          <span className="text-[10px] font-mono uppercase text-[#999286] block">
            Pool Conns
          </span>
          <span className="text-xs font-bold font-mono text-[#181614] mt-1 block truncate">
            {metricsSummary.activeConnections}
          </span>
          <span className="text-[10px] font-mono text-[#79716B] block mt-0.5 truncate">
            Queue: {metricsSummary.queueDepth}
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          3. TIME-SERIES CHARTS (4 STREAM CHARTS)
         ───────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        {/* Chart 1: Latency Trend (P95 Tail & P50 Median) */}
        <div className="bg-white/90 rounded-xl border border-[#E9B590]/35 p-4 shadow-soft-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-[#FF5500]" />
              <span className="text-xs font-bold font-mono text-[#181614]">
                Latency Profile (ms)
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono text-[#79716B]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#FF5500]" /> P95 Tail
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" /> P50 Median
              </span>
            </div>
          </div>

          <div className="h-24 w-full">
            {renderSvgAreaChart({
              points: timeSeries,
              valueKey: 'p95Latency',
              color: '#FF5500',
              fillColor: '#FF5500',
              height: 96,
              formatVal: (v) => `${v}ms`,
            })}
          </div>
        </div>

        {/* Chart 2: Throughput (RPM) */}
        <div className="bg-white/90 rounded-xl border border-[#E9B590]/35 p-4 shadow-soft-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[#E65100]" />
              <span className="text-xs font-bold font-mono text-[#181614]">
                Throughput (Requests / Minute)
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#047857]">
              ● Peak: {Math.max(...timeSeries.map((t) => t.throughput))} rpm
            </span>
          </div>

          <div className="h-24 w-full">
            {renderSvgAreaChart({
              points: timeSeries,
              valueKey: 'throughput',
              color: '#F97316',
              fillColor: '#F97316',
              height: 96,
              formatVal: (v) => `${v} rpm`,
            })}
          </div>
        </div>

        {/* Chart 3 & 4 Grid: Error Rate & Hardware Utilization */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Error Rate Chart */}
          <div className="bg-white/90 rounded-xl border border-[#E9B590]/35 p-3 shadow-soft-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold font-mono text-[#181614]">
                Error Rate (%)
              </span>
              <span className="text-[10px] font-mono text-[#047857]">0.0% now</span>
            </div>
            <div className="h-20 w-full">
              {renderSvgAreaChart({
                points: timeSeries,
                valueKey: 'errorRate',
                color: '#EF4444',
                fillColor: '#EF4444',
                height: 80,
                minVal: 0,
                maxVal: 1.0,
                formatVal: (v) => `${v}%`,
              })}
            </div>
          </div>

          {/* CPU Core Trend */}
          <div className="bg-white/90 rounded-xl border border-[#E9B590]/35 p-3 shadow-soft-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold font-mono text-[#181614]">
                CPU Allocation (%)
              </span>
              <span className="text-[10px] font-mono text-[#FF5500]">
                {metricsSummary.cpuPercent}%
              </span>
            </div>
            <div className="h-20 w-full">
              {renderSvgAreaChart({
                points: timeSeries,
                valueKey: 'cpu',
                color: '#FF5500',
                fillColor: '#FF5500',
                height: 80,
                minVal: 0,
                maxVal: 100,
                formatVal: (v) => `${v}%`,
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          4. ANOMALIES & SRE INSIGHTS
         ───────────────────────────────────────────────────────── */}
      <div className="bg-white/90 rounded-xl border border-[#E9B590]/35 p-4 shadow-soft-xs space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#181614]">
          <AlertTriangle className="w-3.5 h-3.5 text-[#FF5500]" />
          <span>Telemetry Anomaly Signals & Guard Events</span>
        </div>

        <div className="space-y-1.5">
          {anomalies.map((an) => (
            <div
              key={an.id}
              className="flex items-start gap-2.5 p-2 rounded-lg bg-[#FAF8F5] border border-[#E9B590]/25 text-xs font-mono"
            >
              <span className="text-[10px] text-[#999286] shrink-0 mt-0.5">
                {an.time}
              </span>
              <span
                className={`px-1.5 py-0.2 rounded text-[9px] font-bold shrink-0 uppercase ${
                  an.type === 'SPIKE'
                    ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
                    : an.type === 'NORMALIZED'
                    ? 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]'
                    : 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]'
                }`}
              >
                {an.type}
              </span>
              <span className="text-[#57534E] text-[11px] leading-relaxed flex-1">
                {an.message}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          5. SERVICE HEALTH & SLO SNAPSHOT
         ───────────────────────────────────────────────────────── */}
      <div className="bg-white/90 rounded-xl border border-[#E9B590]/35 p-3.5 shadow-soft-xs flex items-center justify-between text-xs font-mono">
        <div>
          <span className="text-[10px] text-[#999286] uppercase block">
            SLO Availability Score
          </span>
          <span className="text-sm font-bold text-[#047857] mt-0.5 block">
            {telemetryData.sloCompliancePercent}% / 99.90% Target
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-[#999286] uppercase block">
            Trend & Pressure
          </span>
          <span className="text-xs font-semibold text-[#181614] mt-0.5 block">
            {telemetryData.trend} // {telemetryData.dependencyPressure} Pressure
          </span>
        </div>
      </div>
    </div>
  );
};
