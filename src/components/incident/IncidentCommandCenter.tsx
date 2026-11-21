import React, { useState, useMemo } from 'react';
import { useOperational } from '@/context/OperationalContext';
import { PostmortemReport } from '@/data/postmortemsData';
import {
  ShieldAlert,
  Activity,
  Sparkles,
  Zap,
  ArrowRight,
  Download,
  Copy,
  Check,
  X,
  FileText,
} from 'lucide-react';

export const IncidentCommandCenter: React.FC = () => {
  const {
    incidents,
    scorecard,
    selectedIncident,
    setSelectedIncident,
    activePostmortem,
    setActivePostmortem,
    openPostmortemForIncident,
  } = useOperational();

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'RESOLVED' | 'FAILED'>('ALL');
  const [copiedPostmortem, setCopiedPostmortem] = useState(false);

  // Filter incidents list
  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      if (statusFilter === 'ACTIVE') return inc.status !== 'RESOLVED';
      if (statusFilter === 'RESOLVED') return inc.status === 'RESOLVED' || inc.status === 'CONTAINED';
      if (statusFilter === 'FAILED') return inc.status === 'FAILED' || inc.status === 'ESCALATED';
      return true;
    });
  }, [incidents, statusFilter]);

  // Handle postmortem download
  const handleDownloadPostmortem = (pm: PostmortemReport) => {
    const blob = new Blob([pm.markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PatchUP_Postmortem_${pm.incidentId.replace('#', '')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle postmortem copy
  const handleCopyPostmortem = (pm: PostmortemReport) => {
    navigator.clipboard.writeText(pm.markdownContent).then(() => {
      setCopiedPostmortem(true);
      setTimeout(() => setCopiedPostmortem(false), 2200);
    });
  };

  return (
    <section id="incident-center" className="w-full max-w-7xl mx-auto px-8 py-20 border-t border-[#EFE8E1]">
      {/* ─────────────────────────────────────────────────────────
          1. SECTION HEADER: AUTONOMOUS INCIDENT COMMAND CENTER
         ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-[#EFE8E1]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FF5500] uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Incident Command Center & Global Operations</span>
          </div>
          <h2 className="text-2xl font-bold text-[#181614] tracking-tight">
            Autonomous Recovery & Incident Lifecycle
          </h2>
          <p className="mt-1 text-xs text-[#79716B] max-w-2xl leading-relaxed">
            Historical audit log of detected SLI breaches, Gemini 2.5 root-cause deductions, policy-gated self-healing executions, and verified recovery scorecards across PulseShop.
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center gap-2 text-xs font-mono text-[#79716B]">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span>Self-Healing Engine: Armed</span>
          <span className="px-2 py-0.5 rounded bg-white border border-[#EFE8E1] text-[10px] text-[#999286]">
            DEMO DATA
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          2. AUTONOMOUS RECOVERY SCORECARD (6 STATISTICAL KPI CARDS)
         ───────────────────────────────────────────────────────── */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold font-mono text-[#181614] uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5500]" />
            <span>Autonomous Recovery Scorecard</span>
          </h3>
          <span className="text-[11px] font-mono text-[#999286]">Calculated from cluster incident audit trail</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Card 1: Total Incidents */}
          <div className="bg-white rounded-2xl p-5 border border-[#EFE8E1] shadow-soft-sm flex flex-col justify-between">
            <span className="text-[11px] font-mono font-medium text-[#79716B] uppercase tracking-wider">
              Total Incidents
            </span>
            <div className="my-2">
              <span className="text-2xl font-bold font-mono text-[#181614]">{scorecard.totalDetected}</span>
              <span className="text-xs font-mono text-[#999286] ml-1">audited</span>
            </div>
            <span className="text-[10px] font-mono text-[#57534E]">SLI breaches detected</span>
          </div>

          {/* Card 2: Autonomous Recoveries */}
          <div className="bg-white rounded-2xl p-5 border border-[#FF5500]/40 shadow-soft-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#FFF7ED] rounded-bl-full -z-0" />
            <span className="text-[11px] font-mono font-medium text-[#FF5500] uppercase tracking-wider relative z-10">
              Autonomous Fixes
            </span>
            <div className="my-2 relative z-10">
              <span className="text-2xl font-bold font-mono text-[#FF5500]">{scorecard.autonomousRecoveries}</span>
              <span className="text-xs font-mono text-[#57534E] ml-1">/ {scorecard.totalDetected}</span>
            </div>
            <span className="text-[10px] font-mono text-[#047857] font-semibold relative z-10">
              {scorecard.autonomousPercentage}% without human SRE
            </span>
          </div>

          {/* Card 3: Mean Time to Diagnosis (MTTD) */}
          <div className="bg-white rounded-2xl p-5 border border-[#EFE8E1] shadow-soft-sm flex flex-col justify-between">
            <span className="text-[11px] font-mono font-medium text-[#79716B] uppercase tracking-wider" title="Mean Time to Diagnosis">
              Time to Diagnosis
            </span>
            <div className="my-2">
              <span className="text-2xl font-bold font-mono text-[#181614]">{scorecard.meanTimeToDiagnosis}</span>
              <span className="text-xs font-mono text-[#047857] ml-1">MTTD</span>
            </div>
            <span className="text-[10px] font-mono text-[#57534E]">Gemini reasoning loop</span>
          </div>

          {/* Card 4: Mean Time to Recovery (MTTR) */}
          <div className="bg-white rounded-2xl p-5 border border-[#EFE8E1] shadow-soft-sm flex flex-col justify-between">
            <span className="text-[11px] font-mono font-medium text-[#79716B] uppercase tracking-wider" title="Mean Time to Recovery">
              Time to Recovery
            </span>
            <div className="my-2">
              <span className="text-2xl font-bold font-mono text-[#181614]">{scorecard.meanTimeToRecovery}</span>
              <span className="text-xs font-mono text-[#047857] ml-1">MTTR</span>
            </div>
            <span className="text-[10px] font-mono text-[#047857]">Sub-second execution</span>
          </div>

          {/* Card 5: Unsafe Actions Blocked */}
          <div className="bg-white rounded-2xl p-5 border border-[#EFE8E1] shadow-soft-sm flex flex-col justify-between">
            <span className="text-[11px] font-mono font-medium text-[#79716B] uppercase tracking-wider">
              Actions Blocked
            </span>
            <div className="my-2">
              <span className="text-2xl font-bold font-mono text-[#181614]">{scorecard.unsafeActionsBlocked}</span>
              <span className="text-xs font-mono text-[#B45309] ml-1">prevented</span>
            </div>
            <span className="text-[10px] font-mono text-[#B45309]">Safety Gate policy</span>
          </div>

          {/* Card 6: Recovery Success Rate */}
          <div className="bg-white rounded-2xl p-5 border border-[#EFE8E1] shadow-soft-sm flex flex-col justify-between">
            <span className="text-[11px] font-mono font-medium text-[#79716B] uppercase tracking-wider">
              Success Rate
            </span>
            <div className="my-2">
              <span className="text-2xl font-bold font-mono text-[#047857]">{scorecard.recoverySuccessRate}</span>
            </div>
            <span className="text-[10px] font-mono text-[#047857]">Zero regressions verified</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          3. GLOBAL INCIDENTS TABLE / OVERVIEW LIST WITH FILTERS
         ───────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#EFE8E1] shadow-soft-sm overflow-hidden mb-12">
        {/* Table Filter Header */}
        <div className="p-5 border-b border-[#F2ECE4] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF8F5]/60">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#FF5500]" />
            <h3 className="text-sm font-bold text-[#181614]">Incident Response History</h3>
            <span className="px-2 py-0.5 rounded-full bg-white border border-[#E9B590]/50 text-[10px] font-mono text-[#79716B]">
              {filteredIncidents.length} Records
            </span>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-white text-[#181614] border border-[#E9B590]/60 shadow-soft-xs font-bold'
                  : 'text-[#79716B] hover:text-[#181614]'
              }`}
            >
              All ({incidents.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('ACTIVE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                statusFilter === 'ACTIVE'
                  ? 'bg-white text-[#FF5500] border border-[#FF5500]/40 shadow-soft-xs font-bold'
                  : 'text-[#79716B] hover:text-[#FF5500]'
              }`}
            >
              Active ({incidents.filter((i) => i.status !== 'RESOLVED').length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('RESOLVED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                statusFilter === 'RESOLVED'
                  ? 'bg-white text-[#047857] border border-[#A7F3D0] shadow-soft-xs font-bold'
                  : 'text-[#79716B] hover:text-[#047857]'
              }`}
            >
              Resolved ({incidents.filter((i) => i.status === 'RESOLVED' || i.status === 'CONTAINED').length})
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="divide-y divide-[#F2ECE4] overflow-x-auto">
          {filteredIncidents.map((incident) => {
            const isResolved = incident.status === 'RESOLVED';
            const isContained = incident.status === 'CONTAINED';

            return (
              <div
                key={incident.id}
                className="p-5 hover:bg-[#FAF8F5]/80 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Left: Metadata & Summary */}
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-[#FF5500] bg-[#FFF7ED] px-2 py-0.5 rounded border border-[#FFD8BF]">
                      {incident.displayId}
                    </span>

                    {/* Severity Badge */}
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        incident.severity === 'CRITICAL'
                          ? 'bg-[#FFF1F2] text-[#E11D48] border border-[#FECDD3]'
                          : incident.severity === 'HIGH'
                          ? 'bg-[#FFF7ED] text-[#C2410C] border border-[#FFEDD5]'
                          : 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]'
                      }`}
                    >
                      {incident.severity}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                        isResolved
                          ? 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]'
                          : isContained
                          ? 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]'
                          : 'bg-[#FFF7ED] text-[#FF5500] border border-[#FF5500]/40 animate-pulse'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isResolved ? 'bg-[#10B981]' : isContained ? 'bg-[#F59E0B]' : 'bg-[#FF5500]'
                        }`}
                      />
                      {incident.status}
                    </span>

                    <span className="text-[11px] font-mono text-[#999286]">{incident.serviceName}</span>
                    <span className="text-[11px] font-mono text-[#999286]">&bull; {incident.detectedAt}</span>
                  </div>

                  <h4 className="text-sm font-bold text-[#181614]">{incident.title}</h4>
                  <p className="text-xs text-[#57534E] leading-relaxed line-clamp-2">{incident.summary}</p>

                  <div className="flex items-center gap-4 text-[11px] font-mono text-[#79716B] pt-1">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-[#FF5500]" />
                      <span>Action: <strong>{incident.selectedAction}</strong></span>
                    </span>
                    <span>&bull;</span>
                    <span>MTTD: <strong className="text-[#181614]">{incident.mttdSeconds}s</strong></span>
                    {incident.mttrSeconds && (
                      <>
                        <span>&bull;</span>
                        <span>MTTR: <strong className="text-[#047857]">{incident.mttrSeconds}s</strong></span>
                      </>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-center">
                  {incident.hasPostmortem && (
                    <button
                      type="button"
                      onClick={() => openPostmortemForIncident(incident.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#FAF8F5] border border-[#E9B590]/50 hover:border-[#FF5500] text-xs font-mono text-[#FF5500] transition-all cursor-pointer shadow-soft-2xs"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Postmortem</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedIncident(incident)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-white border border-[#EFE8E1] hover:border-[#FF5500] text-xs font-mono font-medium text-[#181614] transition-all cursor-pointer shadow-soft-2xs group"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FF5500] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          4. INCIDENT DETAIL DRAWER / MODAL
         ───────────────────────────────────────────────────────── */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#EFE8E1] shadow-soft-xl p-7 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#F2ECE4]">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FF5500] mb-1">
                  <span>{selectedIncident.displayId}</span>
                  <span>//</span>
                  <span>{selectedIncident.serviceName}</span>
                </div>
                <h3 className="text-xl font-bold text-[#181614] tracking-tight">{selectedIncident.title}</h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedIncident(null)}
                className="w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#F2ECE4] flex items-center justify-center text-[#79716B] hover:text-[#181614] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Incident Operational Baseline */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EFE8E1]">
                <span className="text-[10px] text-[#999286] block">Severity</span>
                <span className="font-bold text-[#C2410C]">{selectedIncident.severity}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EFE8E1]">
                <span className="text-[10px] text-[#999286] block">Status</span>
                <span className="font-bold text-[#047857]">{selectedIncident.status}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EFE8E1]">
                <span className="text-[10px] text-[#999286] block">Time to Diagnosis</span>
                <span className="font-bold text-[#181614]">{selectedIncident.mttdSeconds}s</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EFE8E1]">
                <span className="text-[10px] text-[#999286] block">Time to Recovery</span>
                <span className="font-bold text-[#047857]">{selectedIncident.mttrSeconds || 3.4}s</span>
              </div>
            </div>

            {/* Root Cause & Summary */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#79716B]">
                Root-Cause Diagnosis (Gemini Multi-Modal)
              </h4>
              <div className="p-4 rounded-xl bg-[#FFFBF7] border border-[#FFD8BF] text-xs text-[#57534E] leading-relaxed">
                {selectedIncident.summary}
              </div>
            </div>

            {/* Selected Remediation */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#79716B]">
                Selected Remediation & Safety Tier
              </h4>
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EFE8E1] space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#181614]">{selectedIncident.selectedAction}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] font-bold">
                    {selectedIncident.safetyTier}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#181614] text-[#E7E5E4] text-[11px] flex items-center justify-between">
                  <code>patchup-agent execute --target={selectedIncident.serviceId} --verified=true</code>
                  <span className="text-[10px] text-[#10B981]">AUTO_EXECUTED</span>
                </div>
              </div>
            </div>

            {/* Footer with Postmortem Callout */}
            <div className="flex items-center justify-between pt-4 border-t border-[#F2ECE4]">
              {selectedIncident.hasPostmortem ? (
                <button
                  type="button"
                  onClick={() => {
                    openPostmortemForIncident(selectedIncident.id);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF5500] hover:bg-[#D94800] text-white text-xs font-mono font-semibold transition-all shadow-soft-xs cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Full Postmortem Report</span>
                </button>
              ) : (
                <span className="text-xs font-mono text-[#999286]">No postmortem generated for minor alerts</span>
              )}

              <button
                type="button"
                onClick={() => setSelectedIncident(null)}
                className="px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE4] text-xs font-mono text-[#57534E] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          5. AI-GENERATED POSTMORTEM REPORT MODAL
         ───────────────────────────────────────────────────────── */}
      {activePostmortem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-[#EFE8E1] shadow-soft-xl p-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between pb-5 border-b border-[#F2ECE4]">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F5F3FF] text-[#6D28D9] border border-[#DDD6FE]">
                    DEMO POSTMORTEM
                  </span>
                  <span className="text-xs font-mono text-[#999286]">{activePostmortem.provenance}</span>
                </div>
                <h3 className="text-xl font-bold text-[#181614] tracking-tight">{activePostmortem.title}</h3>
                <span className="text-xs font-mono text-[#79716B] block mt-0.5">
                  {activePostmortem.incidentId} &bull; {activePostmortem.serviceName} &bull; {activePostmortem.date}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyPostmortem(activePostmortem)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#F2ECE4] border border-[#EFE8E1] text-xs font-mono text-[#181614] transition-all cursor-pointer shadow-soft-2xs"
                  title="Copy Postmortem as Markdown"
                >
                  {copiedPostmortem ? <Check className="w-3.5 h-3.5 text-[#047857]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPostmortem ? 'Copied!' : 'Copy (.md)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadPostmortem(activePostmortem)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF5500] hover:bg-[#D94800] text-white text-xs font-mono font-medium transition-all cursor-pointer shadow-soft-xs"
                  title="Download Markdown Report"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActivePostmortem(null)}
                  className="w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#F2ECE4] flex items-center justify-center text-[#79716B] hover:text-[#181614] transition-colors cursor-pointer ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Executive KPI Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EFE8E1]">
                <span className="text-[10px] text-[#999286] block">Time to Diagnosis (MTTD)</span>
                <span className="text-base font-bold text-[#181614]">{activePostmortem.mttdSeconds}s</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EFE8E1]">
                <span className="text-[10px] text-[#999286] block">Time to Recovery (MTTR)</span>
                <span className="text-base font-bold text-[#047857]">{activePostmortem.mttrSeconds}s</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EFE8E1]">
                <span className="text-[10px] text-[#999286] block">Error Budget Impact</span>
                <span className="text-base font-bold text-[#C2410C]">{activePostmortem.impact.errorBudgetBurn}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EFE8E1]">
                <span className="text-[10px] text-[#999286] block">Hard Downtime</span>
                <span className="text-base font-bold text-[#047857]">{activePostmortem.impact.downtimeDuration}</span>
              </div>
            </div>

            {/* 1. Summary & Root Cause */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF5500]">
                1. Executive Summary & Root Cause Analysis
              </h4>
              <p className="text-xs text-[#292623] leading-relaxed bg-[#FFFBF7] p-4 rounded-xl border border-[#FFD8BF]">
                {activePostmortem.summary}
              </p>
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EFE8E1] text-xs space-y-1">
                <span className="font-bold text-[#181614] block">Root Cause Deduction:</span>
                <p className="text-[#57534E] leading-relaxed">{activePostmortem.rootCause}</p>
              </div>
            </div>

            {/* 2. Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF5500]">
                2. Incident Lifecycle Timeline
              </h4>
              <div className="p-4 rounded-xl bg-white border border-[#EFE8E1] divide-y divide-[#F2ECE4]">
                {activePostmortem.timeline.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-[#999286] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EFE8E1]">
                        {item.timestamp}
                      </span>
                      <span className="text-[#181614] font-medium">{item.event}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#79716B] shrink-0">{item.actor}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Counterfactual Strategies Evaluated */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF5500]">
                3. Counterfactual Strategies Evaluated
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activePostmortem.alternativesEvaluated.map((alt, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                      alt.decision === 'EXECUTED'
                        ? 'bg-[#ECFDF5] border-[#A7F3D0]'
                        : 'bg-[#FAF8F5] border-[#EFE8E1]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#181614]">{alt.strategy}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                          alt.decision === 'EXECUTED'
                            ? 'bg-white text-[#047857] border border-[#A7F3D0]'
                            : 'bg-white text-[#79716B] border border-[#EFE8E1]'
                        }`}
                      >
                        {alt.decision} (Score: {alt.score})
                      </span>
                    </div>
                    <p className="text-[11px] text-[#57534E] leading-relaxed">{alt.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Verification & Prevention */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF5500]">
                4. Prevention Recommendations
              </h4>
              <ul className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EFE8E1] space-y-2 text-xs text-[#292623] list-disc list-inside">
                {activePostmortem.preventionRecommendations.map((rec, idx) => (
                  <li key={idx} className="leading-relaxed">{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
