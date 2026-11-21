import React, { useState } from 'react';
import { ArchitectureComponent } from '@/types/architecture';
import { X, PlusCircle, Sparkles, Check, Globe, Server, Database, GitBranch } from 'lucide-react';

interface AddComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddComponent: (comp: Partial<ArchitectureComponent>) => void;
}

interface ComponentPreset {
  name: string;
  category: 'microservice' | 'database' | 'collector' | 'ai_engine';
  layerId: string;
  layerName: string;
  description: string;
  endpoints: string[];
  dependencies: string[];
  icon: React.FC<{ className?: string }>;
}

const PRESETS: ComponentPreset[] = [
  {
    name: 'GitHub VCS & Webhook Sync',
    category: 'microservice',
    layerId: 'layer-backend',
    layerName: 'Layer 03 — Backend // VCS & CI/CD Pipeline',
    description: 'Automated GitHub webhook ingress, pull request verification, canary rollback git trees, and CI/CD audit ledger.',
    endpoints: ['/api/v1/github/webhooks', '/api/v1/github/deploy-status'],
    dependencies: ['gateway-service'],
    icon: GitBranch,
  },
  {
    name: 'Redis Session & Query Cache',
    category: 'collector',
    layerId: 'layer-backend',
    layerName: 'Layer 03 — Backend // Distributed Cache',
    description: 'In-memory Redis cache cluster for fast shopper session lookups and product catalog caching.',
    endpoints: ['redis://cache-cluster.internal:6379'],
    dependencies: ['orders-service'],
    icon: Database,
  },
  {
    name: 'PostgreSQL Core Shard',
    category: 'database',
    layerId: 'layer-backend',
    layerName: 'Layer 03 — Backend // Relational Storage',
    description: 'Primary PostgreSQL transaction database shard with connection pooling and automated failover replicas.',
    endpoints: ['postgresql://pg-primary.internal:5432/pulseshop'],
    dependencies: ['orders-service', 'payments-service'],
    icon: Server,
  },
  {
    name: 'Auth0 Identity Provider',
    category: 'microservice',
    layerId: 'layer-gateway',
    layerName: 'Layer 02 — API Gateway // Identity & SSO',
    description: 'Customer OAuth2 and JWT bearer authentication gateway with token caching and rate limiting.',
    endpoints: ['/api/v1/auth/token', '/api/v1/auth/userinfo'],
    dependencies: ['gateway-service'],
    icon: Globe,
  },
];

export const AddComponentModal: React.FC<AddComponentModalProps> = ({
  isOpen,
  onClose,
  onAddComponent,
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [layerId, setLayerId] = useState('layer-backend');
  const [category, setCategory] = useState<'microservice' | 'database' | 'collector' | 'ai_engine'>('microservice');
  const [description, setDescription] = useState('');
  const [endpoints, setEndpoints] = useState('');
  const [selectedDependencies, setSelectedDependencies] = useState<string[]>(['gateway-service']);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]+/g, '-')) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    }
  };

  const applyPreset = (preset: ComponentPreset, index: number) => {
    setName(preset.name);
    setSlug(preset.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    setLayerId(preset.layerId);
    setCategory(preset.category);
    setDescription(preset.description);
    setEndpoints(preset.endpoints.join(', '));
    setSelectedDependencies(preset.dependencies);
    setSelectedPresetIndex(index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const layerNameMap: Record<string, string> = {
      'layer-git-sep': 'Layer 00 — Base // Microsoft VCS (Git Sep)',
      'layer-frontend': 'Layer 01 — Frontend // Client Presentation',
      'layer-gateway': 'Layer 02 — API Gateway // Ingress & Routing',
      'layer-backend': 'Layer 03 — Backend // Processing & Logic',
      'layer-ai-engine': 'Layer 04 — PatchUP AI Engine // Sentinel',
    };

    const finalSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    onAddComponent({
      id: finalSlug,
      name: name.trim(),
      layerId,
      layerName: layerNameMap[layerId] || 'Layer 03 — Backend',
      category,
      description: description.trim() || `${name.trim()} component registered to monitored topology. (Demo component).`,
      dependencies: selectedDependencies,
      status: 'HEALTHY',
      isDemo: true,
      metrics: {
        p95LatencyMs: Math.floor(Math.random() * 45) + 20,
        errorRate: 0.0,
        throughputRpm: Math.floor(Math.random() * 250) + 120,
        cpuPercent: Math.floor(Math.random() * 18) + 10,
        memoryPercent: Math.floor(Math.random() * 25) + 25,
        uptimePercent: 99.99,
        activePods: '1 / 1 Ready (Demo)',
      },
    });

    onClose();
  };

  const toggleDependency = (depId: string) => {
    setSelectedDependencies((prev) =>
      prev.includes(depId) ? prev.filter((d) => d !== depId) : [...prev, depId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
      {/* Dimmed backdrop with subtle blur */}
      <div
        className="fixed inset-0 bg-[#181614]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl border border-[#E9B590]/60 shadow-soft-2xl overflow-hidden z-10 animate-scale-in">
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#F2ECE4] bg-gradient-to-r from-white via-[#FFFBF7] to-[#FFF5ED]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF5500]/20 to-[#FF7A24]/10 flex items-center justify-center text-[#FF5500] border border-[#FF5500]/30 shadow-soft-xs">
              <PlusCircle className="w-5 h-5 text-[#FF5500]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#181614] font-sans tracking-tight">
                Add Architecture Component
              </h2>
              <p className="text-xs text-[#79716B] font-mono mt-0.5">
                Extend PulseShop monitored topology with custom services
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#999286] hover:text-[#181614] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Quick Presets Carousel */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-semibold uppercase text-[#79716B] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#FF5500]" />
                Quick Component Presets
              </span>
              <span className="text-[10px] font-mono text-[#999286]">Click to auto-populate</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p, idx) => {
                const IconComponent = p.icon;
                const isSelected = selectedPresetIndex === idx;
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => applyPreset(p, idx)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-[#FFF7ED] border-[#FF5500] ring-1 ring-[#FF5500]/40'
                        : 'bg-[#FAF8F5] border-[#E9B590]/40 hover:border-[#FF5500]/60 hover:bg-white'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#FF5500] border border-[#E9B590]/30 shrink-0 mt-0.5">
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#181614] truncate font-sans">
                        {p.name}
                      </div>
                      <div className="text-[10px] font-mono text-[#79716B] truncate">
                        {p.category}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Component Name & ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-xs font-mono font-medium text-[#181614] block mb-1">
                Component Name <span className="text-[#FF5500]">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. GitHub VCS & Webhook Sync"
                className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E9B590]/50 focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500]/40 text-xs font-mono text-[#181614] outline-none transition-all placeholder:text-[#999286]"
              />
            </div>
            <div>
              <label className="text-xs font-mono font-medium text-[#181614] block mb-1">
                Identifier (Slug)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. github-vcs-sync"
                className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E9B590]/50 focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500]/40 text-xs font-mono text-[#57534E] outline-none transition-all placeholder:text-[#999286]"
              />
            </div>
          </div>

          {/* Architecture Tier & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono font-medium text-[#181614] block mb-1">
                Target Architecture Tier
              </label>
              <select
                value={layerId}
                onChange={(e) => setLayerId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E9B590]/50 focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500]/40 text-xs font-mono text-[#181614] outline-none cursor-pointer"
              >
                <option value="layer-backend">Layer 03 — Backend (Microservices)</option>
                <option value="layer-gateway">Layer 02 — API Gateway (Ingress)</option>
                <option value="layer-frontend">Layer 01 — Frontend (Client Web)</option>
                <option value="layer-git-sep">Layer 00 — Base (Microsoft & GitHub VCS)</option>
                <option value="layer-ai-engine">Layer 04 — PatchUP AI Engine</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-mono font-medium text-[#181614] block mb-1">
                Component Type
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E9B590]/50 focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500]/40 text-xs font-mono text-[#181614] outline-none cursor-pointer"
              >
                <option value="microservice">Microservice</option>
                <option value="database">Database Storage</option>
                <option value="collector">Cache / Collector</option>
                <option value="ai_engine">AI / Machine Learning</option>
              </select>
            </div>
          </div>

          {/* Endpoints & Description */}
          <div>
            <label className="text-xs font-mono font-medium text-[#181614] block mb-1">
              Health / Ingress Endpoints
            </label>
            <input
              type="text"
              value={endpoints}
              onChange={(e) => setEndpoints(e.target.value)}
              placeholder="e.g. /api/v1/health, /webhooks/ingress"
              className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E9B590]/50 focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500]/40 text-xs font-mono text-[#181614] outline-none transition-all placeholder:text-[#999286]"
            />
          </div>

          <div>
            <label className="text-xs font-mono font-medium text-[#181614] block mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of microservice responsibilities..."
              className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E9B590]/50 focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500]/40 text-xs font-mono text-[#181614] outline-none transition-all placeholder:text-[#999286] resize-none"
            />
          </div>

          {/* Dependencies Multi-Select */}
          <div>
            <label className="text-xs font-mono font-medium text-[#181614] block mb-1.5">
              Service Dependencies
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'gateway-service', label: 'API Gateway' },
                { id: 'orders-service', label: 'Orders Service' },
                { id: 'payments-service', label: 'Payments Service' },
                { id: 'storefront-db', label: 'Storefront DB' },
              ].map((dep) => {
                const isSelected = selectedDependencies.includes(dep.id);
                return (
                  <button
                    key={dep.id}
                    type="button"
                    onClick={() => toggleDependency(dep.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-[#FFF7ED] text-[#FF5500] border-[#FF5500]/50 font-medium'
                        : 'bg-[#FAF8F5] text-[#79716B] border-[#E9B590]/30 hover:border-[#FF5500]/40'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-[#FF5500]" />}
                    <span>{dep.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Demo Notice Banner */}
          <div className="p-3 rounded-xl bg-[#FFFBF7] border border-[#E9B590]/40 text-[11px] font-mono text-[#79716B] flex items-start gap-2">
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A] shrink-0 mt-0.5">
              DEMO DATA
            </span>
            <span>
              New component will be registered into the active architecture with simulated live telemetry and verified zero impact on production safety policies.
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#F2ECE4]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-mono font-medium text-[#79716B] hover:text-[#181614] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#FF5500] hover:bg-[#EA580C] text-white text-xs font-mono font-bold shadow-soft-sm hover:shadow-soft-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register Component</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
