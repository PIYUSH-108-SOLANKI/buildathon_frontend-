import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArchitectureScene } from '@/components/3d/ArchitectureScene';
import { LiveLogStreamer } from '@/components/telemetry/LiveLogStreamer';
import { ServiceTelemetryTab } from '@/components/telemetry/ServiceTelemetryTab';
import { GeminiReasoningTab } from '@/components/telemetry/GeminiReasoningTab';
import { AutonomousRecoveryTab } from '@/components/telemetry/AutonomousRecoveryTab';
import { ArchitectureComponent } from '@/types/architecture';
import {
  findComponentById,
  ORDERS_SERVICE_COMPONENT,
  PAYMENTS_SERVICE_COMPONENT,
  INVENTORY_SERVICE_COMPONENT,
} from '@/data/architectureData';
import {
  SYSTEM_METRICS_DATA,
  MONITORED_SERVICES_DATA,
  RECENT_AI_ACTIVITY_DATA,
} from '@/data/overviewMockData';
import { useOperational } from '@/context/OperationalContext';
import { IncidentCommandCenter } from '@/components/incident/IncidentCommandCenter';
import { AddComponentModal } from '@/components/architecture/AddComponentModal';
import {
  ArrowLeft,
  Sparkles,
  Terminal,
  Activity,
  Cpu,
  Layers,
  ChevronDown,
  ArrowUpRight,
  ShieldCheck,
  ShieldAlert,
  Zap,
  PlusCircle,
  Trash2,
} from 'lucide-react';

interface ArchitectureHomePageProps {
  onSelectService?: (service: ArchitectureComponent) => void;
}

export const ArchitectureHomePage: React.FC<ArchitectureHomePageProps> = ({
  onSelectService,
}) => {
  const [hoveredServiceId, setHoveredServiceId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return new URLSearchParams(window.location.search).get('hover') || null;
  });
  const {
    layerHealth,
    aiActivity,
    activeIncidentCount,
    criticalIncidentCount,
    customComponents,
    addComponent,
    removeComponent,
  } = useOperational();
  const [isAddComponentModalOpen, setIsAddComponentModalOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<ArchitectureComponent | null>(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const focusId = params.get('focus');
    return focusId ? findComponentById(focusId) || null : null;
  });
  const [activeTab, setActiveTab] = useState<'logs' | 'metrics' | 'ai' | 'recovery'>(() => {
    if (typeof window === 'undefined') return 'logs';
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'metrics' || tab === 'telemetry') return 'metrics';
    if (tab === 'ai' || tab === 'reasoning') return 'ai';
    if (tab === 'recovery' || tab === 'incident') return 'recovery';
    return 'logs';
  });

  // Active sub-service for Layer 03 (Backend)
  const [activeSubServiceId, setActiveSubServiceId] = useState<string>('orders-service');

  const containerRef = useRef<HTMLDivElement>(null);

  // Check if current focused layer is Backend (Layer 03)
  const isBackendLayer = useMemo(() => {
    if (!selectedComponent) return false;
    return (
      selectedComponent.id === 'backend-service' ||
      selectedComponent.id === 'orders-service' ||
      selectedComponent.id === 'payments-service' ||
      selectedComponent.id === 'inventory-service' ||
      selectedComponent.layerId === 'layer-backend' ||
      customComponents.some((c) => c.id === selectedComponent.id && c.layerId === 'layer-backend')
    );
  }, [selectedComponent, customComponents]);

  // Nested backend subservices list (Orders, Payments, Inventory + user custom microservices)
  const backendSubServices = useMemo(() => {
    const customInBackend = customComponents.filter(
      (c) => c.layerId === 'layer-backend' && !['git-sep', 'github-service'].includes(c.id)
    );
    return [
      ORDERS_SERVICE_COMPONENT,
      PAYMENTS_SERVICE_COMPONENT,
      INVENTORY_SERVICE_COMPONENT,
      ...customInBackend,
    ];
  }, [customComponents]);

  // Sync activeSubServiceId when a specific subservice is clicked directly
  useEffect(() => {
    if (!selectedComponent) return;
    if (selectedComponent.id === 'payments-service') {
      setActiveSubServiceId('payments-service');
    } else if (selectedComponent.id === 'inventory-service') {
      setActiveSubServiceId('inventory-service');
    } else if (selectedComponent.id === 'orders-service') {
      setActiveSubServiceId('orders-service');
    } else if (backendSubServices.some((s) => s.id === selectedComponent.id)) {
      setActiveSubServiceId(selectedComponent.id);
    }
  }, [selectedComponent, backendSubServices]);

  // Active subservice component
  const activeSubComponent = useMemo(() => {
    if (!isBackendLayer) return null;
    return backendSubServices.find((s) => s.id === activeSubServiceId) || ORDERS_SERVICE_COMPONENT;
  }, [isBackendLayer, activeSubServiceId, backendSubServices]);

  // Effective component driving the inspection details
  const effectiveComponent = selectedComponent
    ? (isBackendLayer && activeSubComponent ? activeSubComponent : selectedComponent)
    : null;
  const effectiveServiceId = selectedComponent
    ? (isBackendLayer ? activeSubServiceId : selectedComponent.id)
    : null;
  const displayMetrics = effectiveComponent?.metrics || selectedComponent?.metrics || {
    p95LatencyMs: 0,
    errorRate: 0,
    throughputRpm: 0,
    uptimePercent: 100,
    activePods: 'N/A',
  };

  // Dynamic application status derived from monitored services
  const systemStatus = useMemo(() => {
    const hasCritical = MONITORED_SERVICES_DATA.some((s) => s.status === 'CRITICAL');
    if (hasCritical) {
      return {
        label: 'Down',
        dotColor: 'bg-[#EF4444]',
        pingColor: 'bg-[#EF4444]/60',
        textColor: 'text-[#DC2626]',
      };
    }
    const hasWarning = MONITORED_SERVICES_DATA.some((s) => s.status === 'WARNING');
    if (hasWarning) {
      return {
        label: 'Degraded',
        dotColor: 'bg-[#F59E0B]',
        pingColor: 'bg-[#F59E0B]/60',
        textColor: 'text-[#D97706]',
      };
    }
    return {
      label: 'Running',
      dotColor: 'bg-[#10B981]',
      pingColor: 'bg-[#10B981]/50',
      textColor: 'text-[#047857]',
    };
  }, []);

  // Initialize from URL query if present (e.g. ?focus=orders-service or ?scroll=metrics) or anchor hash
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const focusId = params.get('focus');
    const scrollTarget = params.get('scroll');

    if (focusId) {
      const comp = findComponentById(focusId);
      if (comp) setSelectedComponent(comp);
    } else if (scrollTarget === 'metrics') {
      const el = document.getElementById('system-metrics');
      if (el) {
        window.scrollTo(0, el.offsetTop || 960);
      }
    } else if (scrollTarget === 'health') {
      const el = document.getElementById('service-health');
      if (el) {
        window.scrollTo(0, el.offsetTop || 1600);
      }
    } else if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        target.scrollIntoView({ behavior: 'auto' });
      }
    }
  }, []);

  // Keyboard shortcut: Escape returns to overview
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedComponent) {
        handleResetFocus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedComponent]);

  const handleSelectService = (comp: ArchitectureComponent) => {
    setSelectedComponent(comp);
    if (onSelectService) {
      onSelectService(comp);
    }
    // Smoothly scroll to the top hero section so the focused inspection view is front and center
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectById = (serviceId: string) => {
    const comp = findComponentById(serviceId);
    if (comp) {
      handleSelectService(comp);
    }
  };

  const handleResetFocus = () => {
    setSelectedComponent(null);
  };

  const scrollToMetrics = () => {
    const metricsEl = document.getElementById('system-metrics');
    if (metricsEl) {
      metricsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-[#FAF8F5] text-[#292623] select-none ${
        selectedComponent ? 'h-screen overflow-hidden' : 'min-h-screen'
      }`}
    >
      {/* ─────────────────────────────────────────────────────────
          1. HERO VIEWPORT: 3D HERO + PRODUCT OVERVIEW HEADER
             Full-screen 3D architectural canvas with header overlay
         ───────────────────────────────────────────────────────── */}
      <section className="relative w-full h-screen flex flex-col overflow-hidden">
        {/* Top Product Header Overlay (Visible on Architecture Overview) */}
        {!selectedComponent && (
          <header className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
            {/* Upper-Left: Monitored Application Identity (Image 6) */}
            <div className="absolute top-9 sm:top-11 left-6 sm:left-8 z-30 pointer-events-auto select-none">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#181614] font-sans">
                    PulseShop
                  </span>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-xs font-mono font-medium text-emerald-700">
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${systemStatus.pingColor}`} />
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${systemStatus.dotColor}`} />
                    </span>
                    {systemStatus.label}
                  </span>
                </div>
                <span className="text-xs font-mono text-[#79716B] mt-0.5">
                  Monitored application
                </span>
              </div>
            </div>

            {/* Top-Right: Product Identity Wordmark with Orange Underline Accent (Image 6) */}
            <div className="absolute top-6 sm:top-7 right-6 sm:right-8 z-30 pointer-events-auto select-none">
              <div className="flex flex-col items-end">
                <div className="relative flex items-baseline">
                  <span className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans text-[#181614]">
                    Patch<span className="text-[#FF5500]">UP</span>
                  </span>
                  {/* Signature Orange Brush Stroke Underline Accent */}
                  <svg
                    className="absolute -bottom-2 right-0 w-24 sm:w-28 h-3 text-[#FF5500]"
                    viewBox="0 0 110 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 8C28 3.5 75 3 108 7.5C88 10 50 10.5 2 8Z"
                      fill="currentColor"
                      fillOpacity="0.9"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Top-Center Floating AI Sentinel & Incidents Navigation */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-25 pointer-events-auto hidden md:flex items-center gap-2.5 select-none">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-[#E9B590]/40 shadow-soft-xs text-xs font-mono text-[#181614]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B5CF6] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8B5CF6]" />
                </span>
                <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span className="text-[#79716B]">PatchUP AI:</span>
                <span className="font-semibold text-[#181614]">{aiActivity.stateText}</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('incident-center');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-[#E9B590]/40 hover:border-[#FF5500] text-xs font-mono text-[#292623] shadow-soft-xs transition-all cursor-pointer hover:scale-[1.02]"
                title="Navigate to Incident Command Center"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    activeIncidentCount > 0 ? 'bg-[#FF5500] animate-pulse' : 'bg-[#10B981]'
                  }`}
                />
                <span className="font-semibold text-[#181614]">
                  {activeIncidentCount} {activeIncidentCount === 1 ? 'Incident' : 'Incidents'}
                </span>
                {criticalIncidentCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#FFF1F2] text-[#E11D48] border border-[#FECDD3]">
                    {criticalIncidentCount} CRITICAL
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={scrollToMetrics}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-[#E9B590]/40 hover:border-[#FF5500] text-xs font-semibold font-mono text-[#292623] shadow-soft-xs transition-all cursor-pointer hover:scale-[1.02]"
              >
                <span>Metrics</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#FF5500]" />
              </button>
            </div>
          </header>
        )}

        {/* ─────────────────────────────────────────────────────────
            FULL-VIEWPORT UNIFIED 3D ARCHITECTURAL CANVAS
            The canvas spans 100% of the viewport with the warm ivory background
            and orange perspective grid (#E9B590 / #F3D4BF) extending seamlessly
            across the entire window.
            In overview: Complete architecture is centered.
            In inspection: Selected layer physically slides SCREEN-LEFT from the stack,
            then reframes in the RIGHT ~58-62% inspection viewport.
           ───────────────────────────────────────────────────────── */}
        <div className="absolute inset-0 w-full h-full z-0">
          <ArchitectureScene
            hoveredServiceId={hoveredServiceId}
            selectedServiceId={effectiveServiceId}
            onHoverService={setHoveredServiceId}
            onSelectService={handleSelectService}
          />
        </div>

        {/* ─────────────────────────────────────────────────────────
            FLOATING MICROSERVICE HOVER DETAILS TOOLTIP (Overview Mode)
            Contextual, small, translucent tooltip displaying component name,
            health status, P95 latency, active incident count, and click prompt.
           ───────────────────────────────────────────────────────── */}
        {!selectedComponent && hoveredServiceId && (
          <div className="absolute top-24 md:top-28 right-8 md:right-16 z-20 pointer-events-none animate-in fade-in slide-in-from-right-3 duration-200">
            {(() => {
              const comp = findComponentById(hoveredServiceId);
              const isBackend =
                hoveredServiceId === 'backend-service' ||
                hoveredServiceId === 'orders-service' ||
                hoveredServiceId === 'payments-service';
              const health = layerHealth[hoveredServiceId] || 'HEALTHY';

              const healthDotColor =
                health === 'CRITICAL'
                  ? 'bg-[#EF4444]'
                  : health === 'DEGRADED'
                  ? 'bg-[#F59E0B]'
                  : health === 'RECOVERING'
                  ? 'bg-[#FF5500] animate-pulse'
                  : 'bg-[#10B981]';

              const healthTextColor =
                health === 'CRITICAL'
                  ? 'text-[#E11D48]'
                  : health === 'DEGRADED'
                  ? 'text-[#B45309]'
                  : health === 'RECOVERING'
                  ? 'text-[#C2410C]'
                  : 'text-[#047857]';

              const healthBgColor =
                health === 'CRITICAL'
                  ? 'bg-[#FFF1F2] border-[#FECDD3]'
                  : health === 'DEGRADED'
                  ? 'bg-[#FFFBEB] border-[#FDE68A]'
                  : health === 'RECOVERING'
                  ? 'bg-[#FFF7ED] border-[#FFEDD5]'
                  : 'bg-[#ECFDF5] border-[#A7F3D0]';

              const isGitSep =
                hoveredServiceId === 'git-sep' ||
                hoveredServiceId === 'github-service' ||
                hoveredServiceId === 'layer-git-sep';

              const displayName = isGitSep
                ? 'Layer 00 — Base (Git Sep // Microsoft VCS)'
                : isBackend
                ? 'Layer 03 — Backend (Orders & Payments)'
                : hoveredServiceId === 'frontend-service'
                ? 'Layer 01 — Frontend Storefront'
                : hoveredServiceId === 'gateway-service'
                ? 'Layer 02 — API Gateway Ingress'
                : 'Layer 04 — PatchUP AI Engine';

              const latencyText = isGitSep
                ? '48ms P95'
                : hoveredServiceId === 'frontend-service'
                ? '18ms P95'
                : hoveredServiceId === 'gateway-service'
                ? '12ms P95'
                : hoveredServiceId === 'ai-engine'
                ? 'Sub-second MTTR'
                : '64ms P95';

              const activeIncText =
                isBackend && activeIncidentCount > 0
                  ? `${activeIncidentCount} Active Incident`
                  : '0 Active Incidents';

              return (
                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-[#E9B590]/50 shadow-soft-lg w-72 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#999286] uppercase tracking-wider">
                      Microservice Node
                    </span>
                    <span
                      className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${healthBgColor} ${healthTextColor}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${healthDotColor}`} />
                      {health}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[#181614] tracking-tight">{displayName}</h4>
                    <p className="text-[11px] text-[#57534E] leading-snug line-clamp-2 mt-0.5">
                      {comp?.description || 'Monitored architectural component in high-availability cluster.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#F2ECE4] text-[11px] font-mono">
                    <span className="text-[#181614] font-medium flex items-center gap-1">
                      <Activity className="w-3 h-3 text-[#FF5500]" />
                      {latencyText}
                    </span>
                    <span className="text-[#79716B]">{activeIncText}</span>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-[#FF5500] font-semibold">
                    <span>&crarr; Click layer to inspect</span>
                    <span>&rarr;</span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────
            MINIMAL FLOATING AI CONTROLS (DIRECTLY BELOW EXTRACTED 3D MICROSERVICE)
            Centered relative to the 3D microservice object area on the right (Image 4):
            - Purple Gemini chip icon + "Gemini Reasoning"
            - Orange shield icon + "Recovery"
            Completely transparent, gentle floating animation, zero card enclosure.
           ───────────────────────────────────────────────────────── */}
        {selectedComponent && (
          <div className="absolute bottom-8 sm:bottom-10 md:bottom-12 left-0 md:left-[480px] lg:left-[520px] xl:left-[560px] right-0 z-30 pointer-events-auto flex items-center justify-center select-none">
            <div className="flex items-center gap-8 sm:gap-10 animate-gentle-float">
              {/* 1. Purple Gemini chip icon + Gemini Reasoning (more prominent) */}
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'ai' ? 'logs' : 'ai')}
                className="group flex items-center gap-2 py-1.5 px-2 bg-transparent border-none cursor-pointer transition-all duration-200 hover:scale-105 focus:outline-none"
                title="Inspect Gemini AI Reasoning & Root-Cause Deduction"
              >
                <Cpu
                  className={`w-4 h-4 text-[#8B5CF6] transition-all duration-200 ${
                    activeTab === 'ai'
                      ? 'drop-shadow-[0_0_10px_rgba(139,92,246,0.8)] scale-110'
                      : 'group-hover:text-[#7C3AED] group-hover:drop-shadow-[0_0_6px_rgba(139,92,246,0.5)]'
                  }`}
                />
                <span
                  className={`text-sm tracking-tight transition-all duration-200 ${
                    activeTab === 'ai'
                      ? 'font-bold text-[#181614] underline decoration-[#8B5CF6] decoration-2 underline-offset-4'
                      : 'font-semibold text-[#181614] group-hover:text-[#7C3AED]'
                  }`}
                >
                  Gemini Reasoning
                </span>
              </button>

              {/* 2. Orange shield icon + Recovery */}
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'recovery' ? 'logs' : 'recovery')}
                className="group flex items-center gap-2 py-1.5 px-2 bg-transparent border-none cursor-pointer transition-all duration-200 hover:scale-105 focus:outline-none"
                title="View Autonomous Recovery & Incident Timeline"
              >
                <ShieldAlert
                  className={`w-4 h-4 text-[#FF5500] transition-all duration-200 ${
                    activeTab === 'recovery'
                      ? 'drop-shadow-[0_0_10px_rgba(255,85,0,0.8)] scale-110'
                      : 'group-hover:text-[#EA580C] group-hover:drop-shadow-[0_0_6px_rgba(255,85,0,0.5)]'
                  }`}
                />
                <span
                  className={`text-sm tracking-tight transition-all duration-200 ${
                    activeTab === 'recovery'
                      ? 'font-bold text-[#181614] underline decoration-[#FF5500] decoration-2 underline-offset-4'
                      : 'font-medium text-[#57534E] group-hover:text-[#181614]'
                  }`}
                >
                  Recovery
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────
            FLOATING "ADD COMPONENT" BUTTON (CENTERED UNDER 3D TOWER)
            Matching Image 6 (media_1795302341563_01e4774d.png)
           ───────────────────────────────────────────────────────── */}
        {!selectedComponent && (
          <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex flex-col items-center gap-3 select-none">
            <button
              type="button"
              onClick={() => setIsAddComponentModalOpen(true)}
              className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 hover:bg-white border border-[#E9B590]/60 hover:border-[#FF5500] text-sm font-mono font-medium text-[#FF5500] shadow-soft-sm hover:shadow-soft-md transition-all duration-200 cursor-pointer hover:scale-105"
            >
              <PlusCircle className="w-4 h-4 text-[#FF5500] group-hover:rotate-90 transition-transform duration-300" />
              <span>Add Component</span>
            </button>
          </div>
        )}

        {/* Subtle Idle Helper Pill & Scroll Invitation (visible on Overview) */}
        {!selectedComponent && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 pointer-events-auto">
            <button
              type="button"
              onClick={scrollToMetrics}
              className="flex items-center gap-1.5 text-[11px] font-mono text-[#999286] hover:text-[#181614] transition-colors cursor-pointer"
            >
              <span>Scroll for system overview</span>
              <ChevronDown className="w-3 h-3 text-[#FF5500] animate-bounce" />
            </button>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────
            SERVICE INSPECTION INTERFACE (SPATIAL FLOATING TOOLS OVER 3D WORLD)
            Completely transparent parent container:
            - NO large white or ivory sidebar background
            - NO backdrop-blur
            - NO vertical divider or full-height borders
            - NO sidebar shadows
            The orange perspective grid remains clearly visible throughout the entire left area!
           ───────────────────────────────────────────────────────── */}
        <aside
          className={`absolute top-0 left-0 bottom-0 w-full md:w-[44%] lg:w-[46%] xl:w-[43%] h-full z-30 flex flex-col bg-transparent pointer-events-none transition-all duration-700 ease-out overflow-hidden ${
            selectedComponent
              ? 'translate-x-0 opacity-100'
              : '-translate-x-full opacity-0'
          }`}
        >
          {selectedComponent && (
            <div className="flex flex-col h-full w-full overflow-y-auto px-7 py-6 space-y-4 pointer-events-auto [scrollbar-width:thin] [scrollbar-color:rgba(233,181,144,0.35)_transparent]">
              {/* 1. Floating Top Navigation Bar */}
              <div className="flex items-center justify-between shrink-0">
                <button
                  type="button"
                  onClick={handleResetFocus}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white border border-[#E9B590]/40 hover:border-[#FF5500] text-xs font-semibold text-[#292623] transition-all cursor-pointer group shadow-soft-xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[#FF5500] group-hover:-translate-x-0.5 transition-transform" />
                  <span>Back to Architecture</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-[#FAF8F5] border border-[#E9B590]/30 text-[10px] font-mono text-[#79716B]">
                    Esc
                  </kbd>
                </button>

                <div className="flex items-center gap-2">
                  {(selectedComponent.isDemo || (isBackendLayer && activeSubComponent?.isDemo)) && (
                    <span className="px-2 py-0.5 rounded-full bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A] text-[10px] font-mono font-semibold">
                      DEMO DATA
                    </span>
                  )}
                  <span className="hidden sm:inline-flex text-[10px] font-mono text-[#999286]">
                    us-east-1 // prod
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-[#ECFDF5]/90 text-[#047857] border border-[#A7F3D0] shadow-soft-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                    {(effectiveComponent || selectedComponent).status}
                  </span>
                </div>
              </div>

              {/* 2. Floating Service Identity & Metadata */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#999286] uppercase tracking-wider">
                  <Layers className="w-3.5 h-3.5 text-[#FF5500]" />
                  <span>
                    {selectedComponent.layerName} // {effectiveServiceId}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl font-bold text-[#181614] tracking-tight">
                    {isBackendLayer ? `${activeSubComponent?.name || 'Backend'}` : selectedComponent.name}
                  </h1>
                  {isBackendLayer && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E9B590]/50 text-[#79716B]">
                      Layer 03
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#57534E] leading-relaxed max-w-xl">
                  {effectiveComponent?.description || selectedComponent.description}
                </p>
              </div>

              {/* 3. Nested Microservices Selector for Layer 03 (Backend) */}
              {isBackendLayer && (
                <div className="p-2.5 rounded-xl bg-white/95 border border-[#E9B590]/40 shadow-soft-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#79716B] flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-[#FF5500]" />
                      Nested Microservices ({backendSubServices.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddComponentModalOpen(true)}
                      className="flex items-center gap-1 text-[10px] font-mono font-semibold text-[#FF5500] hover:text-[#EA580C] cursor-pointer"
                    >
                      <PlusCircle className="w-3 h-3" />
                      <span>Add Service</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {backendSubServices.map((sub) => {
                      const isActive = activeSubServiceId === sub.id;
                      const isCustom = sub.isDemo && !['inventory-service', 'github-service', 'git-sep'].includes(sub.id);
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => setActiveSubServiceId(sub.id)}
                          className={`p-2 rounded-lg text-left transition-all cursor-pointer border flex flex-col justify-between ${
                            isActive
                              ? 'bg-[#FAF8F5] border-[#FF5500] ring-1 ring-[#FF5500]/30 shadow-soft-2xs'
                              : 'bg-white/80 border-[#E9B590]/30 hover:border-[#FF5500]/50 hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isActive ? 'bg-[#FF5500]' : 'bg-[#10B981]'
                              }`}
                            />
                            <div className="flex items-center gap-1">
                              {sub.isDemo ? (
                                <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]/60">
                                  DEMO
                                </span>
                              ) : (
                                <span className="text-[8px] font-mono text-[#999286]">
                                  PROD
                                </span>
                              )}
                              {isCustom && (
                                <span
                                  role="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeComponent(sub.id);
                                    if (activeSubServiceId === sub.id) {
                                      setActiveSubServiceId('orders-service');
                                    }
                                  }}
                                  className="text-[#999286] hover:text-[#EF4444] transition-colors p-0.5"
                                  title="Remove component"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-xs font-bold text-[#181614] truncate">
                            {sub.name}
                          </div>
                          <div className="text-[10px] font-mono text-[#79716B] mt-0.5 truncate">
                            {sub.id === 'git-sep' || sub.id === 'github-service'
                              ? 'Microsoft VCS · 48ms'
                              : `${sub.metrics.p95LatencyMs}ms · ${sub.metrics.throughputRpm}rpm`}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. Individually Surfaced Top 4 Operational KPI Cards */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-white/95 rounded-xl p-3 border border-[#E9B590]/40 shadow-soft-xs">
                  <span className="text-[10px] font-mono uppercase text-[#999286] block">
                    P95 Latency
                  </span>
                  <span className="text-base font-bold font-mono text-[#181614] mt-0.5 block">
                    {displayMetrics.p95LatencyMs}ms
                  </span>
                  <span className="text-[10px] font-mono text-[#047857] flex items-center gap-0.5 mt-0.5">
                    <ShieldCheck className="w-3 h-3" /> Nominal
                  </span>
                </div>

                <div className="bg-white/95 rounded-xl p-3 border border-[#E9B590]/40 shadow-soft-xs">
                  <span className="text-[10px] font-mono uppercase text-[#999286] block">
                    Throughput
                  </span>
                  <span className="text-base font-bold font-mono text-[#181614] mt-0.5 block">
                    {displayMetrics.throughputRpm} rpm
                  </span>
                  <span className="text-[10px] font-mono text-[#57534E] mt-0.5 block">
                    Active ingress
                  </span>
                </div>

                <div className="bg-white/95 rounded-xl p-3 border border-[#E9B590]/40 shadow-soft-xs">
                  <span className="text-[10px] font-mono uppercase text-[#999286] block">
                    Error Rate
                  </span>
                  <span className="text-base font-bold font-mono text-[#181614] mt-0.5 block">
                    {displayMetrics.errorRate || 0.0}%
                  </span>
                  <span className="text-[10px] font-mono text-[#047857] mt-0.5 block">
                    0 dropped
                  </span>
                </div>

                <div className="bg-white/95 rounded-xl p-3 border border-[#E9B590]/40 shadow-soft-xs">
                  <span className="text-[10px] font-mono uppercase text-[#999286] block">
                    Active Pods
                  </span>
                  <span className="text-base font-bold font-mono text-[#181614] mt-0.5 block">
                    {displayMetrics.activePods || '3 / 3 Ready'}
                  </span>
                  <span className="text-[10px] font-mono text-[#047857] mt-0.5 block">
                    {displayMetrics.uptimePercent || 99.99}% uptime
                  </span>
                </div>
              </div>

              {/* 5. Left Workspace View & Header Context */}
              {/* When in AI mode, display focused Gemini header with return to logs action */}
              {activeTab === 'ai' && (
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-white/95 via-[#FFFBF7]/95 to-[#FFF5ED]/95 border border-[#FF5500]/30 shadow-soft-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF5500]/20 to-[#8B5CF6]/20 flex items-center justify-center text-[#FF5500]">
                      <Sparkles className="w-4 h-4 text-[#FF5500]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#181614] font-mono">Gemini AI Reasoning</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#FFF7ED] text-[#FF5500] border border-[#FFD8BF]">
                          ACTIVE
                        </span>
                      </div>
                      <span className="text-[10px] text-[#79716B]">Multimodal root cause deduction & telemetry correlation</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('logs')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#FAF8F5] border border-[#E9B590]/50 hover:border-[#FF5500] text-xs font-mono font-medium text-[#FF5500] shadow-soft-2xs transition-all cursor-pointer group"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Return to Live Stream</span>
                  </button>
                </div>
              )}

              {/* When in Recovery mode, display focused Self-Healing header with return action */}
              {activeTab === 'recovery' && (
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-white/95 via-[#F9FDFB]/95 to-[#ECFDF5]/95 border border-[#10B981]/30 shadow-soft-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#ECFDF5] flex items-center justify-center text-[#047857]">
                      <ShieldAlert className="w-4 h-4 text-[#047857]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#181614] font-mono">Autonomous Self-Healing</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-medium bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
                          ACTIVE
                        </span>
                      </div>
                      <span className="text-[10px] text-[#79716B]">Policy-gated incident lifecycle & remediation playbook</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('logs')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#FAF8F5] border border-[#A7F3D0] hover:border-[#10B981] text-xs font-mono font-medium text-[#047857] shadow-soft-2xs transition-all cursor-pointer group"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Return to Live Stream</span>
                  </button>
                </div>
              )}

              {/* In primary live streaming / telemetry mode: Clean dual toggle */}
              {(activeTab === 'logs' || activeTab === 'metrics') && (
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setActiveTab('logs')}
                      className={`py-1.5 px-3 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                        activeTab === 'logs'
                          ? 'bg-white/95 text-[#181614] border border-[#E9B590]/50 shadow-soft-xs'
                          : 'text-[#79716B] hover:text-[#181614] hover:bg-white/60'
                      }`}
                    >
                      <Terminal className="w-3.5 h-3.5 text-[#FF5500]" />
                      <span>Live Stream</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('metrics')}
                      className={`py-1.5 px-3 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                        activeTab === 'metrics'
                          ? 'bg-white/95 text-[#181614] border border-[#E9B590]/50 shadow-soft-xs'
                          : 'text-[#79716B] hover:text-[#181614] hover:bg-white/60'
                      }`}
                    >
                      <Activity className="w-3.5 h-3.5 text-[#047857]" />
                      <span>Telemetry Signals</span>
                    </button>
                  </div>

                  <div className="text-[10px] font-mono text-[#999286] hidden sm:flex items-center gap-1.5">
                    <span>AI modules floating on canvas ↘</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" />
                  </div>
                </div>
              )}

              {/* 6. Active Tab Content (Floating inside transparent space) */}
              <div className="pt-1">
                {activeTab === 'logs' && (
                  <LiveLogStreamer
                    activeServiceId={effectiveServiceId || 'orders-service'}
                    className="min-h-[440px]"
                  />
                )}

                {activeTab === 'metrics' && (
                  <ServiceTelemetryTab serviceId={effectiveServiceId || 'orders-service'} />
                )}

                {activeTab === 'ai' && (
                  <GeminiReasoningTab serviceId={effectiveServiceId || 'orders-service'} />
                )}

                {activeTab === 'recovery' && (
                  <AutonomousRecoveryTab serviceId={effectiveServiceId || 'orders-service'} />
                )}
              </div>
            </div>
          )}
        </aside>
      </section>

      {/* ─────────────────────────────────────────────────────────
          2. SECTION TWO: SYSTEM AT A GLANCE (METRICS OVERVIEW)
         ───────────────────────────────────────────────────────── */}
      <section
        id="system-metrics"
        className="w-full max-w-7xl mx-auto px-8 py-20 border-t border-[#EFE8E1]"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-[#EFE8E1]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FF5500] uppercase tracking-wider mb-2">
              <Activity className="w-3.5 h-3.5" />
              <span>System at a Glance</span>
            </div>
            <h2 className="text-2xl font-bold text-[#181614] tracking-tight">
              Cluster Health & Golden Signals
            </h2>
            <p className="mt-1 text-xs text-[#79716B] max-w-xl leading-relaxed">
              Real-time operational baseline across monitored PulseShop application tiers.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-2 text-xs font-mono text-[#79716B]">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span>Telemetry Baseline: Nominal</span>
            <span className="px-2 py-0.5 rounded bg-white border border-[#EFE8E1] text-[10px] text-[#999286]">
              DEMO DATA
            </span>
          </div>
        </div>

        {/* 4 Clean Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SYSTEM_METRICS_DATA.map((metric) => {
            const isIncidentMetric = metric.id === 'active-incidents';
            const displayValue = isIncidentMetric ? activeIncidentCount.toString() : metric.value;
            const displayStatus = isIncidentMetric && activeIncidentCount > 0 ? 'critical' : metric.status;
            const displayChange = isIncidentMetric && activeIncidentCount > 0 ? `${activeIncidentCount} Active Alert` : metric.change;

            return (
              <div
                key={metric.id}
                className={`bg-white rounded-2xl p-6 border shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col justify-between ${
                  isIncidentMetric && activeIncidentCount > 0
                    ? 'border-[#FF5500]/50 ring-1 ring-[#FF5500]/20'
                    : 'border-[#EFE8E1] hover:border-[#FF5500]/40'
                }`}
              >
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#999286] block mb-3">
                    {metric.label}
                  </span>

                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-3xl font-extrabold font-mono tracking-tight ${
                      isIncidentMetric && activeIncidentCount > 0 ? 'text-[#FF5500]' : 'text-[#181614]'
                    }`}>
                      {displayValue}
                    </span>
                    {metric.unit && (
                      <span className="text-sm font-mono text-[#79716B] font-semibold">
                        {metric.unit}
                      </span>
                    )}
                  </div>

                  <div className="mt-1 text-xs text-[#57534E] font-medium">
                    {metric.sublabel}
                  </div>
                </div>

                <div className="mt-6 pt-3.5 border-t border-[#F2ECE4] flex items-center justify-between text-[11px] font-mono">
                  <span className={`font-semibold flex items-center gap-1 ${
                    isIncidentMetric && activeIncidentCount > 0 ? 'text-[#FF5500]' : 'text-[#047857]'
                  }`}>
                    {isIncidentMetric && activeIncidentCount > 0 ? (
                      <ShieldAlert className="w-3.5 h-3.5 text-[#FF5500]" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5" />
                    )}
                    {displayChange}
                  </span>
                  <span className="text-[#999286] text-[10px]">
                    {displayStatus}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          PHASE 2: GLOBAL INCIDENTS, RECOVERY SCORECARD & POSTMORTEMS
          (Centralized operational history & AI remediation command center)
         ───────────────────────────────────────────────────────── */}
      <IncidentCommandCenter />

      {/* ─────────────────────────────────────────────────────────
          3. SECTION THREE: MONITORED MICROSERVICE HEALTH & AI ACTIVITY
         ───────────────────────────────────────────────────────── */}
      <section
        id="service-health"
        className="w-full max-w-7xl mx-auto px-8 pb-24 space-y-12"
      >
        {/* Microservice Hierarchy Grid */}
        <div>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#EFE8E1]">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FF5500] uppercase tracking-wider mb-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Architecture Inventory</span>
              </div>
              <h2 className="text-xl font-bold text-[#181614] tracking-tight">
                Monitored Architecture Hierarchy
              </h2>
            </div>

            <div className="text-xs font-mono text-[#79716B]">
              4 Physical Architectural Tiers (3 PulseShop + 1 PatchUP Sentinel)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {MONITORED_SERVICES_DATA.map((service) => (
              <div
                key={service.id}
                className={`bg-white rounded-2xl p-6 border shadow-soft-sm transition-all hover:shadow-soft-md ${
                  service.isHeroOrange
                    ? 'border-[#FF5500]/40 ring-1 ring-[#FF5500]/20'
                    : 'border-[#EFE8E1]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#EFE8E1] flex items-center justify-center text-xs font-mono font-bold text-[#181614]">
                      {service.tierNumber}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#181614]">
                          {service.name}
                        </h3>
                        {service.isDemo && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
                            DEMO
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-[#999286] block">
                        {service.tierRole}
                      </span>
                    </div>
                  </div>

                  <span className="flex items-center gap-1.5 text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    {service.status}
                  </span>
                </div>

                <p className="mt-3.5 text-xs text-[#57534E] leading-relaxed">
                  {service.description}
                </p>

                {/* Telemetry Metric Pills */}
                <div className="mt-5 pt-4 border-t border-[#F2ECE4] flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs font-mono text-[#79716B]">
                    <span>
                      Latency: <strong className="text-[#181614]">{service.latencyMs}ms</strong>
                    </span>
                    <span>&bull;</span>
                    <span>
                      Throughput: <strong className="text-[#181614]">{service.throughputRpm} rpm</strong>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectById(service.id)}
                    className="flex items-center gap-1 text-xs font-semibold font-mono text-[#FF5500] hover:text-[#D94800] transition-colors cursor-pointer group"
                  >
                    <span>Inspect in 3D</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compact Recent AI Activity Section */}
        <div className="bg-white rounded-2xl border border-[#EFE8E1] p-6 shadow-soft-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F2ECE4]">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#8B5CF6]" />
              <h3 className="text-sm font-bold text-[#181614]">
                Recent Autonomous SRE Activity
              </h3>
              <span className="px-2 py-0.5 rounded bg-[#F5F3FF] border border-[#DDD6FE] text-[10px] font-mono text-[#6D28D9] font-medium">
                DEMO FEED
              </span>
            </div>

            <span className="text-xs font-mono text-[#79716B]">
              Sub-second MTTR verification
            </span>
          </div>

          <div className="divide-y divide-[#F2ECE4]">
            {RECENT_AI_ACTIVITY_DATA.map((activity) => (
              <div
                key={activity.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-[#999286] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EFE8E1]">
                    {activity.timestamp}
                  </span>
                  <span className="font-semibold text-[#181614]">
                    {activity.serviceName}
                  </span>
                  <span className="text-[#57534E] text-[11px]">
                    {activity.message}
                  </span>
                </div>

                <span className="text-[11px] font-mono text-[#047857] flex items-center gap-1 shrink-0">
                  <ShieldCheck className="w-3 h-3 text-[#10B981]" />
                  {activity.outcome}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          4. FOOTER
         ───────────────────────────────────────────────────────── */}
      <footer className="w-full border-t border-[#EFE8E1] bg-white py-8 px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#181614]">PatchUP</span>
            <span className="text-xs text-[#999286]">
              Autonomous AI Site Reliability Engineering Platform
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-xs font-mono text-[#999286]">
              Monitored Target: PulseShop // us-east-1 // Production
            </span>
          </div>
        </div>
      </footer>
      {/* Add Architecture Component Modal */}
      <AddComponentModal
        isOpen={isAddComponentModalOpen}
        onClose={() => setIsAddComponentModalOpen(false)}
        onAddComponent={addComponent}
      />
    </div>
  );
};

export default ArchitectureHomePage;
