import React, { useState, useEffect } from 'react';
import { IncidentState, IncidentStage, ApprovalState } from '@/types/recovery';
import { useOperational } from '@/context/OperationalContext';
import {
  ORDERS_AUTOFIX_SCENARIO,
  PAYMENTS_APPROVAL_SCENARIO,
  IncidentDemoScenario,
} from '@/data/recoveryMockData';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  XCircle,
  Zap,
} from 'lucide-react';

interface AutonomousRecoveryTabProps {
  serviceId: string;
}

export const AutonomousRecoveryTab: React.FC<AutonomousRecoveryTabProps> = ({ serviceId }) => {
  // Select initial scenario based on service
  const initialScenario =
    serviceId === 'payments-service' ? PAYMENTS_APPROVAL_SCENARIO : ORDERS_AUTOFIX_SCENARIO;

  const [activeScenario, setActiveScenario] = useState<IncidentDemoScenario>(initialScenario);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const stageParam = params.get('stage')?.toUpperCase();
      if (stageParam) {
        const foundIdx = initialScenario.stages.indexOf(stageParam as IncidentStage);
        if (foundIdx >= 0) return foundIdx;
      }
    }
    // If scenario starts at WAITING_APPROVAL (like payments), start at that index
    const idx = initialScenario.stages.indexOf(initialScenario.initialState.currentStage);
    return idx >= 0 ? idx : 0;
  });
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [approvalDecision, setApprovalDecision] = useState<ApprovalState>(
    initialScenario.initialState.selectedAction.approvalState
  );
  const { goToStage } = useOperational();

  // If serviceId changes, update scenario
  useEffect(() => {
    const sc = serviceId === 'payments-service' ? PAYMENTS_APPROVAL_SCENARIO : ORDERS_AUTOFIX_SCENARIO;
    setActiveScenario(sc);
    const idx = sc.stages.indexOf(sc.initialState.currentStage);
    setCurrentStageIndex(idx >= 0 ? idx : 0);
    setApprovalDecision(sc.initialState.selectedAction.approvalState);
    setIsAutoPlaying(false);
  }, [serviceId]);

  const currentStage: IncidentStage = activeScenario.stages[currentStageIndex];

  // Synchronize stage with shared OperationalContext
  useEffect(() => {
    goToStage(currentStage);
  }, [currentStage, goToStage]);

  // Derive current incident state combining initial state and stage snapshot
  const snapshot = activeScenario.stageSnapshots[currentStage] || {};
  const incident: IncidentState = {
    ...activeScenario.initialState,
    ...snapshot,
    currentStage,
    selectedAction: {
      ...activeScenario.initialState.selectedAction,
      ...(snapshot.selectedAction || {}),
      approvalState: approvalDecision,
    },
    timeline: snapshot.timeline || activeScenario.initialState.timeline,
    verification: snapshot.verification || activeScenario.initialState.verification,
  };

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlaying) return;

    // If waiting for approval and not yet approved, pause autoplay
    if (currentStage === 'WAITING_APPROVAL' && approvalDecision === 'PENDING') {
      setIsAutoPlaying(false);
      return;
    }

    if (currentStageIndex >= activeScenario.stages.length - 1) {
      setIsAutoPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStageIndex((prev) => Math.min(prev + 1, activeScenario.stages.length - 1));
    }, 2800);

    return () => clearTimeout(timer);
  }, [isAutoPlaying, currentStageIndex, currentStage, approvalDecision, activeScenario]);

  const handleNextStage = () => {
    if (currentStageIndex < activeScenario.stages.length - 1) {
      setCurrentStageIndex((prev) => prev + 1);
    }
  };

  const handleResetSimulation = () => {
    setIsAutoPlaying(false);
    setCurrentStageIndex(0);
    setApprovalDecision(activeScenario.initialState.selectedAction.approvalState);
  };

  const handleApproveAction = () => {
    setApprovalDecision('APPROVED');
    // Advance to executing
    const execIdx = activeScenario.stages.indexOf('EXECUTING');
    if (execIdx >= 0) {
      setCurrentStageIndex(execIdx);
    }
  };

  const handleRejectAction = () => {
    setApprovalDecision('REJECTED');
  };

  return (
    <div className="space-y-4 pb-6 select-none font-sans">
      {/* ─────────────────────────────────────────────────────────
          1. SIMULATION CONTROLS & DEMO SCENARIO SELECTOR
         ───────────────────────────────────────────────────────── */}
      <div className="p-3.5 rounded-xl bg-white/95 border border-[#E9B590]/40 shadow-soft-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5500] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5500]" />
            </span>
            <span className="text-xs font-bold font-mono text-[#181614]">
              Autonomous Recovery Simulation
            </span>
          </div>

          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FFF7ED] text-[#C2410C] border border-[#FFEDD5]">
            ● DEMO SIMULATION
          </span>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#FAF8F5] border border-[#E9B590]/25 text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              setActiveScenario(ORDERS_AUTOFIX_SCENARIO);
              setCurrentStageIndex(0);
              setApprovalDecision('NOT_REQUIRED');
              setIsAutoPlaying(false);
            }}
            className={`flex-1 py-1.5 px-2 rounded-md font-semibold text-center transition-all cursor-pointer ${
              activeScenario.id === ORDERS_AUTOFIX_SCENARIO.id
                ? 'bg-white text-[#181614] border border-[#E9B590]/40 shadow-soft-xs'
                : 'text-[#79716B] hover:text-[#181614]'
            }`}
          >
            Scenario 1: Orders (AUTO_FIX)
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveScenario(PAYMENTS_APPROVAL_SCENARIO);
              const idx = PAYMENTS_APPROVAL_SCENARIO.stages.indexOf('WAITING_APPROVAL');
              setCurrentStageIndex(idx >= 0 ? idx : 0);
              setApprovalDecision('PENDING');
              setIsAutoPlaying(false);
            }}
            className={`flex-1 py-1.5 px-2 rounded-md font-semibold text-center transition-all cursor-pointer ${
              activeScenario.id === PAYMENTS_APPROVAL_SCENARIO.id
                ? 'bg-white text-[#181614] border border-[#E9B590]/40 shadow-soft-xs'
                : 'text-[#79716B] hover:text-[#181614]'
            }`}
          >
            Scenario 2: Payments (ASK_FIRST)
          </button>
        </div>

        {/* Stepper & Playback Controls */}
        <div className="flex items-center justify-between pt-1 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsAutoPlaying((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold border transition-all cursor-pointer ${
                isAutoPlaying
                  ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FFEDD5]'
                  : 'bg-white text-[#292623] border-[#E9B590]/40 hover:bg-[#FAF8F5]'
              }`}
            >
              <Play className="w-3 h-3 text-[#FF5500]" />
              <span>{isAutoPlaying ? 'Pause' : 'Auto Play'}</span>
            </button>

            <button
              type="button"
              onClick={handleNextStage}
              disabled={currentStageIndex >= activeScenario.stages.length - 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-white border border-[#E9B590]/40 text-[#181614] font-semibold hover:bg-[#FAF8F5] transition-all disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <span>Next Stage</span>
              <span className="text-[10px] text-[#FF5500]">→</span>
            </button>

            <button
              type="button"
              onClick={handleResetSimulation}
              title="Reset to beginning"
              className="p-1.5 rounded-md bg-white border border-[#E9B590]/35 text-[#79716B] hover:text-[#181614] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-[#999286] block">Active Stage:</span>
            <span className="font-bold text-[#FF5500] uppercase text-[11px]">
              {currentStage} ({currentStageIndex + 1}/{activeScenario.stages.length})
            </span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          2. INCIDENT OVERVIEW CARD
         ───────────────────────────────────────────────────────── */}
      <div className="p-4 rounded-xl bg-white/95 border border-[#E9B590]/40 shadow-soft-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[10px] text-[#999286] uppercase font-bold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-[#DC2626]" /> Incident #{incident.id}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
              incident.currentStage === 'RESOLVED'
                ? 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]'
                : incident.severity === 'HIGH'
                ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
                : 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]'
            }`}
          >
            {incident.currentStage === 'RESOLVED' ? 'RESOLVED' : `SEVERITY: ${incident.severity}`}
          </span>
        </div>

        <h2 className="text-sm font-bold text-[#181614] tracking-tight">
          {incident.title}
        </h2>

        <p className="text-xs text-[#57534E] leading-relaxed">
          {incident.rootCause}
        </p>

        <div className="pt-2 border-t border-[#FAF0E6] flex items-center justify-between text-[10px] font-mono text-[#79716B]">
          <span>Detected At: {incident.detectedAt}</span>
          <span>
            Impact: {incident.impactedDependencies.join(', ')}
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          3. VERTICAL INCIDENT RESPONSE TIMELINE
         ───────────────────────────────────────────────────────── */}
      <div className="p-4 rounded-xl bg-white/95 border border-[#E9B590]/40 shadow-soft-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#181614]">
            <Clock className="w-3.5 h-3.5 text-[#FF5500]" />
            <span>Incident Response Lifecycle</span>
          </div>
          <span className="text-[10px] font-mono text-[#047857] font-semibold">
            {incident.currentStage === 'RESOLVED' ? '● MTTD: 1.4s // MTTR: 3.8s' : '● Live Tracking'}
          </span>
        </div>

        {/* Timeline Items */}
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E9B590]/35">
          {incident.timeline.map((event, idx) => {
            const isCurrent = event.stage === incident.currentStage;
            const isCompleted = event.status === 'COMPLETED';

            return (
              <div key={event.id || idx} className="relative group text-xs font-mono">
                {/* Node Dot Icon */}
                <div
                  className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                    isCompleted
                      ? 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]'
                      : isCurrent
                      ? 'bg-[#FFF7ED] text-[#FF5500] border-[#FF5500] shadow-soft-xs animate-pulse'
                      : 'bg-[#FAF8F5] text-[#999286] border-[#E9B590]/30'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#181614]">{event.title}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                          event.stage === 'RESOLVED'
                            ? 'bg-[#ECFDF5] text-[#047857]'
                            : isCurrent
                            ? 'bg-[#FFF7ED] text-[#FF5500]'
                            : 'bg-[#FAF8F5] text-[#79716B]'
                        }`}
                      >
                        {event.stage}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#999286]">{event.timestamp}</span>
                  </div>

                  <p className="text-[11px] text-[#57534E] leading-relaxed">
                    {event.summary}
                  </p>

                  {/* Evidence Pills */}
                  {event.evidence && event.evidence.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {event.evidence.map((ev, eIdx) => (
                        <span
                          key={eIdx}
                          className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E9B590]/25 text-[10px] text-[#79716B]"
                        >
                          {ev}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          4. RECOVERY ACTION INTERFACE & OPERATOR APPROVAL GATE
         ───────────────────────────────────────────────────────── */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#FFF7ED] via-white to-white border border-[#FF5500]/40 shadow-soft-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#FF5500]">
            <Zap className="w-3.5 h-3.5 text-[#FF5500]" />
            <span>AI Selected Strategy: {incident.selectedAction.strategyName}</span>
          </div>

          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
              incident.selectedAction.safetyTier === 'AUTO_FIX'
                ? 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]'
                : incident.selectedAction.safetyTier === 'ASK_FIRST'
                ? 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]'
                : 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
            }`}
          >
            Tier: {incident.selectedAction.safetyTier}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-white/90 border border-[#E9B590]/30 space-y-2 text-xs font-mono">
          <div className="grid grid-cols-2 gap-2 text-[11px] text-[#57534E]">
            <div>
              <strong className="text-[#181614]">Expected Benefit:</strong>{' '}
              {incident.selectedAction.expectedBenefit}
            </div>
            <div>
              <strong className="text-[#DC2626]">Cascading Risk:</strong>{' '}
              {incident.selectedAction.cascadingRisk}
            </div>
          </div>

          <div className="pt-2 border-t border-[#FAF0E6] flex items-center justify-between text-[10px] text-[#79716B]">
            <span>Reversibility: {incident.selectedAction.reversibility}</span>
            <span>Safety Gate Score: {incident.selectedAction.score}/100</span>
          </div>
        </div>

        {/* ── OPERATOR APPROVAL UI FOR ASK_FIRST ── */}
        {incident.selectedAction.safetyTier === 'ASK_FIRST' &&
          incident.currentStage === 'WAITING_APPROVAL' && (
            <div className="p-3.5 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] space-y-2.5 text-xs font-mono">
              <div className="flex items-center gap-2 text-[#D97706] font-bold">
                <ShieldAlert className="w-4 h-4" />
                <span>Operator Approval Required (ASK_FIRST Safety Tier)</span>
              </div>

              <p className="text-[11px] text-[#78350F] leading-relaxed">
                This action modifies live financial message routing. Safety policy requires authorized human confirmation before execution.
              </p>

              {approvalDecision === 'PENDING' ? (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleApproveAction}
                    className="flex-1 py-2 px-3 rounded-md bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs shadow-soft-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Authorize Remediation Plan</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRejectAction}
                    className="py-2 px-3 rounded-md bg-white border border-[#E9B590]/50 text-[#79716B] hover:text-[#DC2626] font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Reject Action
                  </button>
                </div>
              ) : approvalDecision === 'APPROVED' ? (
                <div className="p-2 rounded bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Remediation Plan Approved by Operator. Dispatched to Executor.</span>
                </div>
              ) : (
                <div className="p-2 rounded bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-xs font-bold flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  <span>Action Rejected by Operator. Incident escalated to on-call SRE.</span>
                </div>
              )}
            </div>
          )}

        {/* ── AUTO_FIX EXECUTION LOG ── */}
        {(incident.currentStage === 'EXECUTING' ||
          incident.currentStage === 'VERIFYING' ||
          incident.currentStage === 'RESOLVED') && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#79716B]">
              <span className="flex items-center gap-1 font-bold text-[#181614]">
                <Terminal className="w-3 h-3 text-[#FF5500]" /> Autonomous Execution Terminal
              </span>
              <span className="text-[#047857]">
                {incident.currentStage === 'RESOLVED' ? '✓ Executed & Verified' : '● In-Progress'}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#181614] text-[#F5F5F4] font-mono text-[11px] space-y-1 overflow-x-auto">
              <div className="text-[#A8A29E] text-[10px] select-none">
                $ {incident.selectedAction.commandPreview}
              </div>
              {incident.selectedAction.executionLog.map((logLine, lIdx) => (
                <div key={lIdx} className="leading-relaxed">
                  <span className="text-[#FF5500] mr-1">›</span>
                  {logLine}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────
          5. VERIFICATION EVIDENCE & POSTMORTEM
         ───────────────────────────────────────────────────────── */}
      {(incident.currentStage === 'VERIFYING' || incident.currentStage === 'RESOLVED') && (
        <div className="p-4 rounded-xl bg-white/95 border border-[#E9B590]/40 shadow-soft-xs space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-[#181614]">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Multi-Probe Health Verification</span>
            </div>

            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                incident.verification.status === 'PASSED'
                  ? 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]'
                  : 'bg-[#FFF7ED] text-[#FF5500] border border-[#FFEDD5]'
              }`}
            >
              {incident.verification.status === 'PASSED' ? 'VERIFICATION PASSED' : 'PROBING CLUSTER...'}
            </span>
          </div>

          {/* Pre vs Post Recovery SLIs */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded bg-[#FAF8F5] border border-[#E9B590]/25">
              <span className="text-[10px] text-[#999286] block">P95 Tail Latency</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="line-through text-[#DC2626]">
                  {incident.verification.latencyBaselineMs}ms
                </span>
                <span className="text-[#FF5500] text-xs">→</span>
                <span className="font-bold text-[#047857]">
                  {incident.verification.latencyAfterMs}ms
                </span>
              </div>
            </div>

            <div className="p-2 rounded bg-[#FAF8F5] border border-[#E9B590]/25">
              <span className="text-[10px] text-[#999286] block">Error Rate</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="line-through text-[#DC2626]">
                  {incident.verification.errorRateBaselinePercent}%
                </span>
                <span className="text-[#FF5500] text-xs">→</span>
                <span className="font-bold text-[#047857]">
                  {incident.verification.errorRateAfterPercent}%
                </span>
              </div>
            </div>
          </div>

          {/* Synthetic Health Checks */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] text-[#999286] uppercase font-bold block">
              Active Synthetic Prober Suite
            </span>
            {incident.verification.proberChecks.map((chk, cIdx) => (
              <div
                key={cIdx}
                className="flex items-center justify-between p-2 rounded bg-[#FAF8F5] border border-[#E9B590]/20 text-[11px]"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  <span className="font-bold text-[#181614]">{chk.checkName}</span>
                  <span className="text-[10px] text-[#999286]">({chk.target})</span>
                </div>
                <span className="font-bold text-[#047857]">{chk.durationMs}ms</span>
              </div>
            ))}
          </div>

          {/* Time Saved Metric Banner */}
          {incident.currentStage === 'RESOLVED' && (
            <div className="p-2.5 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-between text-xs text-[#047857]">
              <span>
                <strong>Automated MTTR:</strong> {incident.verification.mttrSeconds}s
              </span>
              <span>
                <strong>Time Saved vs Manual SRE:</strong> ~{incident.verification.timeSavedMinutes} minutes
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
