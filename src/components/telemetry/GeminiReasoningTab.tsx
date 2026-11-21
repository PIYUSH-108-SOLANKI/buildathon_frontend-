import React from 'react';
import { GEMINI_REASONING_MAP, GeminiReasoningCase } from '@/data/telemetryMockData';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  XCircle,
  FileText,
  GitBranch,
  Info,
  Scale,
} from 'lucide-react';

interface GeminiReasoningTabProps {
  serviceId: string;
}

export const GeminiReasoningTab: React.FC<GeminiReasoningTabProps> = ({ serviceId }) => {
  const reasoningCase: GeminiReasoningCase =
    GEMINI_REASONING_MAP[serviceId] || GEMINI_REASONING_MAP['orders-service'];

  const {
    diagnosisSummary,
    evidenceList,
    strategies,
    selectedRecommendation,
    workflowTimeline,
    operatorExplanation,
  } = reasoningCase;

  return (
    <div className="space-y-4 pb-6 select-none font-sans">
      {/* ─────────────────────────────────────────────────────────
          1. AI SENTINEL STATUS & CONFIDENCE BANNER
         ───────────────────────────────────────────────────────── */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#FAF5FF] via-white to-[#FFF7ED] border border-[#DDD6FE] shadow-soft-xs">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#8B5CF6]/15 flex items-center justify-center text-[#8B5CF6]">
              <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#181614] tracking-tight">
                  Gemini 2.5 Sentinel Engine
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#EDE9FE] text-[#6D28D9] border border-[#DDD6FE]">
                  PRO REASONING
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#79716B]">
                Autonomous Incident Evaluation & Counterfactual Safety Gate
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono uppercase text-[#79716B] block">
              Confidence
            </span>
            <span className="text-xs font-bold font-mono text-[#047857] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
              {(diagnosisSummary.confidenceScore * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Diagnosis Root Cause Box */}
        <div className="mt-3 p-3 rounded-lg bg-white/95 border border-[#E9B590]/35 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-[#999286] uppercase font-bold flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#FF5500]" /> Inferred Primary Culprit
            </span>
            <span
              className={`px-2 py-0.5 rounded font-bold uppercase ${
                diagnosisSummary.severity === 'HIGH'
                  ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
                  : 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]'
              }`}
            >
              Severity: {diagnosisSummary.severity}
            </span>
          </div>

          <p className="text-xs font-semibold text-[#181614] leading-relaxed">
            {diagnosisSummary.rootCause}
          </p>

          <div className="pt-1.5 border-t border-[#FAF0E6] flex items-center justify-between text-[10px] font-mono text-[#79716B]">
            <span>
              <strong>Blast Radius:</strong> {diagnosisSummary.blastRadius}
            </span>
            <span className="text-[#047857] font-semibold">
              ● State: {diagnosisSummary.incidentState}
            </span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          2. TECHNICAL EVIDENCE OBSERVED
         ───────────────────────────────────────────────────────── */}
      <div className="bg-white/90 rounded-xl border border-[#E9B590]/35 p-4 shadow-soft-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#181614]">
            <FileText className="w-3.5 h-3.5 text-[#FF5500]" />
            <span>Grounded Technical Evidence ({evidenceList.length} Signals)</span>
          </div>
          <span className="text-[10px] font-mono text-[#999286]">
            Multi-modal correlation
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {evidenceList.map((ev) => (
            <div
              key={ev.id}
              className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E9B590]/25 text-xs space-y-1 hover:border-[#FF5500]/50 transition-colors"
            >
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="font-bold text-[#181614] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" />
                  {ev.title}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-white text-[#79716B] border border-[#E9B590]/30 text-[9px]">
                  {ev.badge}
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#57534E] leading-relaxed">
                {ev.detail}
              </p>
              <span className="text-[9px] font-mono text-[#A8A29E] block">
                Timestamp: {ev.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          3. RECOVERY STRATEGY COMPARISON (COUNTERFACTUAL SIMULATION)
         ───────────────────────────────────────────────────────── */}
      <div className="bg-white/90 rounded-xl border border-[#E9B590]/35 p-4 shadow-soft-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#181614]">
            <Scale className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Counterfactual Recovery Evaluation</span>
          </div>
          <span className="text-[10px] font-mono text-[#8B5CF6] font-semibold">
            Safety Gate Scoring
          </span>
        </div>

        <p className="text-[11px] text-[#79716B] leading-relaxed">
          Gemini simulated prospective actions against historical system topology to select the strategy that maximizes availability while minimizing cascading blast radius.
        </p>

        <div className="space-y-2">
          {strategies.map((strat) => (
            <div
              key={strat.id}
              className={`p-3 rounded-xl border text-xs transition-all ${
                strat.isSelected
                  ? 'bg-gradient-to-r from-[#FFF7ED] to-white border-[#FF5500] shadow-soft-sm'
                  : 'bg-white/80 border-[#E9B590]/25 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  {strat.isSelected ? (
                    <CheckCircle2 className="w-4 h-4 text-[#FF5500]" />
                  ) : (
                    <XCircle className="w-4 h-4 text-[#999286]" />
                  )}
                  <span className="font-bold font-mono text-[#181614]">
                    {strat.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                      strat.tier === 'AUTO_FIX'
                        ? 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]'
                        : 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]'
                    }`}
                  >
                    {strat.tier}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-[#181614]">
                    Score: {strat.score}/100
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1 text-[#57534E]">
                <div>
                  <strong className="text-[#181614]">Expected Benefit:</strong>{' '}
                  {strat.expectedBenefit}
                </div>
                <div>
                  <strong className="text-[#DC2626]">Cascading Risk:</strong>{' '}
                  {strat.cascadingRisk}
                </div>
              </div>

              <div className="mt-1.5 pt-1.5 border-t border-[#FAF0E6] flex items-center justify-between text-[10px] font-mono text-[#79716B]">
                <span>
                  Reversibility: <strong>{strat.reversibility}</strong>
                </span>
                <span>
                  Requires Approval:{' '}
                  <strong>{strat.requiresApproval ? 'Yes (SRE Key)' : 'No (Pre-Authorized)'}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          4. SELECTED RECOMMENDATION & WHY OTHERS REJECTED
         ───────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#FFF7ED] via-white to-[#FDF4FF] rounded-xl border border-[#FF5500]/40 p-4 shadow-soft-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#FF5500]">
            <CheckCircle2 className="w-4 h-4 text-[#FF5500]" />
            <span>AI Selected Strategy: {selectedRecommendation.actionName}</span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
            {selectedRecommendation.tier}
          </span>
        </div>

        <div className="space-y-1.5 text-xs leading-relaxed">
          <div className="p-2.5 rounded-lg bg-white/90 border border-[#E9B590]/30">
            <span className="text-[10px] font-mono font-bold text-[#047857] uppercase block mb-0.5">
              ✓ Why Selected:
            </span>
            <p className="text-[#181614] text-[11px]">
              {selectedRecommendation.selectionRationale}
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-white/90 border border-[#E9B590]/30">
            <span className="text-[10px] font-mono font-bold text-[#DC2626] uppercase block mb-0.5">
              ✕ Why Alternative Rejected:
            </span>
            <p className="text-[#57534E] text-[11px]">
              {selectedRecommendation.rejectionRationale}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-[#79716B] pt-1">
          <span>
            Target Recovery Window: <strong>~{selectedRecommendation.estimatedRecoverySeconds}s</strong>
          </span>
          <span className="text-[#047857] font-semibold">
            Status: Non-Destructive Active Execution
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          5. INCIDENT REASONING WORKFLOW TIMELINE
         ───────────────────────────────────────────────────────── */}
      <div className="bg-white/90 rounded-xl border border-[#E9B590]/35 p-4 shadow-soft-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#181614]">
            <GitBranch className="w-3.5 h-3.5 text-[#FF5500]" />
            <span>Autonomous Incident Reasoning Lifecycle</span>
          </div>
          <span className="text-[10px] font-mono text-[#047857]">
            Total MTTD/MTTR: 4.2s
          </span>
        </div>

        <div className="space-y-2">
          {workflowTimeline.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs font-mono">
              <span className="w-5 h-5 rounded-full bg-[#FAF8F5] border border-[#E9B590]/40 flex items-center justify-center text-[10px] font-bold text-[#FF5500] shrink-0 mt-0.5">
                {item.step}
              </span>
              <div className="flex-1 pb-1 border-b border-[#FAF0E6]">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#181614]">{item.label}</span>
                  <span className="text-[10px] text-[#999286]">{item.time}</span>
                </div>
                <p className="text-[10px] text-[#57534E] mt-0.5 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          6. HUMAN-READABLE OPERATOR QUOTE (FOR JUDGES)
         ───────────────────────────────────────────────────────── */}
      <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E9B590]/30 shadow-soft-xs text-xs">
        <div className="flex items-center gap-2 mb-1.5 text-[10px] font-mono uppercase text-[#79716B]">
          <Info className="w-3 h-3 text-[#FF5500]" />
          <span>Operator Synthesis Explanation</span>
        </div>
        <p className="text-[#292623] text-xs leading-relaxed italic">
          "{operatorExplanation}"
        </p>
        <span className="block text-[10px] font-mono text-[#999286] text-right mt-1.5">
          — PatchUP Autonomous SRE Engine // Model Verified
        </span>
      </div>
    </div>
  );
};
