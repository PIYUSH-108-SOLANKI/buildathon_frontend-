# PatchUP Frontend Integration Handoff Guide

## 1. Executive Summary & Architecture Overview

**PatchUP** is an autonomous AI Site Reliability Engineering (SRE) and self-healing platform.
**PulseShop** is the monitored microservice e-commerce application.

The frontend is built with **React 18 + TypeScript + Vite + Tailwind CSS + Three.js / React Three Fiber**. It renders an interactive 4-layer 3D physical architecture hierarchy of the running application inside a crystal-clear glass enclosure, supporting physical book-pull extraction, real-time telemetry streaming, multi-modal Gemini 2.5 AI reasoning, policy-gated self-healing playbooks, a global incident command center, recovery scorecard, and postmortem generation.

---

## 2. Frontend Folder Structure

```
frontend/
├── public/                     # Static icons, favicons, logos
├── src/
│   ├── components/
│   │   ├── 3d/                 # Three.js / React Three Fiber components
│   │   │   ├── ArchitecturalSlab.tsx   # Precision rounded bevel plate geometry
│   │   │   ├── ArchitectureScene.tsx   # Canvas, studio lighting, OrbitControls, Camera
│   │   │   ├── ArchitectureTower.tsx   # 4-layer stack, physical extraction, health beacons
│   │   │   ├── CameraController.tsx    # Cinematic lerping camera controller
│   │   │   ├── ComponentBlock.tsx      # Sub-service hardware blocks
│   │   │   └── DataFlowCurves.tsx      # Dynamic 3D spline data packets & dependency curves
│   │   ├── incident/           # Global Incident Command Center & Postmortems
│   │   │   └── IncidentCommandCenter.tsx # Scorecard, incident table, detail drawer, postmortems
│   │   ├── telemetry/          # Operational inspection components
│   │   │   ├── AutonomousRecoveryTab.tsx # Interactive incident lifecycle & playbook
│   │   │   ├── GeminiReasoningTab.tsx    # Gemini multimodal root-cause deduction view
│   │   │   ├── LiveLogStreamer.tsx       # Continuous dynamic live log stream (3.1 eps)
│   │   │   └── ServiceTelemetryTab.tsx   # Golden signals, CPU, memory, P95 latency
│   │   └── ui/                 # Reusable atomic UI elements (Buttons, Badges, Cards)
│   ├── context/
│   │   └── OperationalContext.tsx # Centralized shared state for incidents, health & AI
│   ├── data/
│   │   ├── architectureData.ts # 4-layer architecture hierarchy & service metadata
│   │   ├── overviewMockData.ts # Golden signals & baseline system metrics
│   │   ├── postmortemsData.ts  # Demo postmortem reports & markdown generator
│   │   ├── recoveryMockData.ts # Simulated incident lifecycle scenarios & safety tiers
│   │   └── telemetryMockData.ts# Time-series telemetry points for chart widgets
│   ├── pages/
│   │   └── ArchitectureHomePage.tsx # Unified single-page spatial SRE dashboard
│   ├── styles/
│   │   └── globals.css         # Tailwind base, transparent scrollbars, float keyframes
│   ├── types/
│   │   ├── architecture.ts     # Architectural components, health states, safety tiers
│   │   ├── index.ts            # Core export barrel
│   │   └── recovery.ts         # Incident stages, actions, verification result types
│   ├── App.tsx                 # Root component wrapped with OperationalProvider
│   └── main.tsx                # React DOM entry point
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Design system colors, fonts, shadows
├── tsconfig.json               # TypeScript compiler configuration
└── vite.config.ts              # Vite bundler configuration & @ path alias
```

---

## 3. Important Components & Responsibilities

| Component | Responsibility |
| :--- | :--- |
| `OperationalContext.tsx` | Central shared store for incident status, layer health, AI activity text, scorecard KPIs, and postmortems. |
| `ArchitectureHomePage.tsx` | Primary layout coordinator: Top floating PatchUP branding, 3D Canvas, Hover tooltip, Floating AI controls, System Golden Signals, and Incident Command Center. |
| `ArchitectureTower.tsx` | Four floating physical platforms (`01 Frontend`, `02 Gateway`, `03 Backend`, `04 AI Engine`), hardware health beacons, and physical extraction physics. |
| `DataFlowCurves.tsx` | Refined 3D spline curves with travelling data packets color-coded by health state (`HEALTHY` orange, `DEGRADED` amber, `CRITICAL` red, `RECOVERING` pulsing orange). |
| `IncidentCommandCenter.tsx` | Autonomous recovery scorecard (MTTD, MTTR, success rate), incident audit trail table with status filters, slide-over detail drawer, and postmortem viewer. |
| `LiveLogStreamer.tsx` | Real-time streaming console with dynamic variable injection, continuous natural interval (280–620ms), auto-scroll, and pause controls. |
| `GeminiReasoningTab.tsx` | Displays Gemini 2.5 multimodal telemetry deduction, root-cause probability, blast radius, and counterfactual risk matrices. |
| `AutonomousRecoveryTab.tsx` | Interactive 7-stage incident response lifecycle (`DETECTED` → `RESOLVED`), safety tiers (`AUTO_FIX` vs `ASK_FIRST`), and prober verification. |

---

## 4. Centralized Mock Data & State Architecture

All mock data is centralized under `frontend/src/data/`:
- `architectureData.ts`: Master registry of architectural components and nested microservices.
- `recoveryMockData.ts`: Multi-stage incident scenarios (`ORDERS_AUTOFIX_SCENARIO`, `PAYMENTS_APPROVAL_SCENARIO`).
- `postmortemsData.ts`: Fully formatted SRE postmortem reports with markdown export.
- `overviewMockData.ts`: Cluster baseline statistics and recent autonomous actions.

### Shared State Derivation
When an incident is simulated:
1. `layerHealth['backend-service']` dynamically transitions: `DETECTED` (Degraded/Amber) → `EXECUTING` (Recovering/Orange) → `RESOLVED` (Healthy/Green).
2. `DataFlowCurves` updates spline color and packet cadence according to connected layer health.
3. `ArchitectureTower` status LEDs update on the physical hardware bevels.
4. Top header `PatchUP AI:` pill updates with real-time stage description ("Analyzing an anomaly", "Executing an authorized recovery", etc.).
5. Header `Incidents` counter and System at a Glance cards update in lockstep.

---

## 5. Service ID & Layer Mappings

| UI Service ID | Architectural Layer | Mapped Component | Running Port / Protocol |
| :--- | :--- | :--- | :--- |
| `frontend-service` | Layer 01 | Client Web Storefront (Next.js SSR) | `http://localhost:3000` |
| `gateway-service` | Layer 02 | API Gateway / Reverse Proxy (Envoy) | `http://localhost:8080` |
| `backend-service` | Layer 03 | Microservice Cluster | Virtual Layer Group |
| `orders-service` | Layer 03 | Orders Service (Cart, Checkout, DB) | `http://localhost:5001` (REST) |
| `payments-service` | Layer 03 | Payments Service (Stripe Gateway) | `http://localhost:5002` (REST) |
| `inventory-service` | Layer 03 | Catalog & Inventory (Demo SKU Cache) | `http://localhost:5003` (gRPC) |
| `github-service` | Layer 03 | GitHub VCS & Webhook Sync (CI/CD) | `http://localhost:5004` (Webhook) |
| `ai-engine` | Layer 04 | PatchUP AI Engine (Gemini 2.5 Sentinel) | Internal Reasoning Loop |
| `payments-service`| Layer 03 | Payments Service (Stripe Webhook, PCI) | `http://localhost:5002` (REST) |
| `inventory-service`| Layer 03 | Inventory & Catalog Service | `http://localhost:5003` (REST) |
| `ai-engine` | Layer 04 | PatchUP Autonomous AI Sentinel | `http://localhost:8000` (FastAPI / gRPC) |

---

## 6. Incident State & Lifecycle Mappings

```
DETECTED ──> DIAGNOSING ──> PLANNING ──> WAITING_APPROVAL (if ASK_FIRST) ──> EXECUTING ──> VERIFYING ──> RESOLVED
                                                                                                    ├──> CONTAINED
                                                                                                    └──> FAILED / ESCALATED
```

### Safety Tiers
- **`AUTO_FIX`**: Completely autonomous execution without human intervention (e.g., dynamic traffic shedding, Envoy cache rehash, worker scale).
- **`ASK_FIRST`**: Policy gate requires human SRE confirmation before applying commands (e.g., provider gateway route failover, container termination).
- **`NEVER_DO`**: Hard-blocked by safety gate (e.g., dropping database tables, unverified container force-kills).

---

## 7. Recommended Backend Integration Points

### A. REST Endpoints to Implement

```typescript
// 1. Cluster Golden Signals & Health
GET /api/v1/cluster/health
Response: {
  status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL',
  activeIncidents: number,
  tiers: Record<string, 'HEALTHY' | 'DEGRADED' | 'CRITICAL' | 'RECOVERING'>
}

// 2. Incident Audit Trail & Details
GET /api/v1/incidents?status=ALL|ACTIVE|RESOLVED
GET /api/v1/incidents/:incidentId
POST /api/v1/incidents/:incidentId/approve   // Operator approval for ASK_FIRST actions
POST /api/v1/incidents/:incidentId/simulate  // Trigger demo fault injection

// 3. Postmortem Generation & Retrieval
GET /api/v1/incidents/:incidentId/postmortem
Response: PostmortemReport (matches frontend/src/data/postmortemsData.ts schema)

// 4. Autonomous Recovery Scorecard
GET /api/v1/scorecard
Response: {
  totalDetected: number,
  autonomousRecoveries: number,
  meanTimeToDiagnosisSeconds: number,
  meanTimeToRecoverySeconds: number,
  unsafeActionsBlocked: number,
  recoverySuccessRate: number
}
```

### B. WebSocket / Server-Sent Events (SSE)

```typescript
// Real-time Telemetry & Log Stream
WS /ws/telemetry/logs?serviceId=:serviceId
Payload format: {
  id: string,
  timestamp: string,
  severity: 'INFO' | 'WARN' | 'ERROR' | 'AI',
  service: string,
  message: string
}

// Real-time AI Agent Lifecycle Events
WS /ws/agent/activity
Payload format: {
  stage: 'DETECTED' | 'DIAGNOSING' | 'PLANNING' | 'EXECUTING' | 'VERIFYING' | 'RESOLVED',
  serviceId: string,
  actionName?: string,
  confidence?: number,
  stateText: string
}
```

---

## 8. Environment Variables

Create `.env` in `frontend/`:
```bash
# Backend REST Base URL
VITE_API_BASE_URL=http://localhost:8000/api/v1

# Real-time WebSocket Gateway
VITE_WS_BASE_URL=ws://localhost:8000/ws

# PulseShop Monitored Target URL
VITE_PULSESHOP_URL=http://localhost:3000

# Enable/Disable Synthetic Demo Fallbacks
VITE_ENABLE_DEMO_DATA=true
```

---

## 9. Build & Run Commands

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start local development server (running on port 3000)
npm run dev

# Run TypeScript typecheck
npx tsc --noEmit

# Production build
npm run build

# Preview production build
npm run preview
```

---

## 10. Known Limitations & Teammate Integration Tasks

1. **Live Logs**: Currently driven by domain-specific synthetic continuous generators (`LiveLogStreamer.tsx`). Replace the generator hook with a WebSocket stream from `VITE_WS_BASE_URL/ws/telemetry/logs`.
2. **Incident Actions**: Currently simulated using preset stage transitions. Connect `approve` / `execute` button clicks to `POST /api/v1/incidents/:incidentId/approve`.
3. **Postmortem Export**: Fully functional client-side Markdown file generator and clipboard copy. Backend can optionally persist generated reports in S3 or database.
4. **Performance Note**: The 3D scene uses ACESFilmic tone mapping and soft contact shadows. Performance remains steady at 60 FPS on standard modern laptops.

---

## 11. Semantic 3D Symbols, Branding & Customizable Architecture

1. **Semantic 3D Embossed Symbols**:
   - Replaced all generic concentric circles and diamond tiles on ceramic platform tops with bespoke 3D embossed safety-orange symbols (`#FF5500`):
     - **Layer 01 — Frontend**: Browser window symbol with 3-dot header bar, layout card, and wireframe text lines.
     - **Layer 02 — API Gateway**: Central network routing hub with 4 diagonal branching connection rays and 4 circular nodes.
     - **Layer 03 — Backend**: Dual server-rack chassis with status LED and horizontal drive bay slots.
     - **Layer 04 — PatchUP AI Engine**: Microprocessor chip with central beveled die and 8 radiating pin leads.
     - **GitHub VCS Sync**: Git branch graph with trunk line, branch ray, and 3 commit node discs.
   - All symbols lie flush on porcelain platform tops (`y = 0.094`, rotated 45° for isometric view), moving synchronously during extraction.

2. **Homepage Product & Application Branding**:
   - **Top-Right**: Floating **PatchUP** wordmark with energetic orange brush-stroke underline accent.
   - **Upper-Left (lower)**: **PulseShop** with bold typography and dynamic status pill (`● Running` / `Monitored application`).
   - **Top-Center**: Floating PatchUP AI activity status pill and Incidents counter.

3. **Architecture Customization & Add Component**:
   - Centered beneath the 3D tower on the homepage: `⊕ Add Component` floating button.
   - `AddComponentModal.tsx`: Lightweight modal supporting quick presets (GitHub VCS, Redis Cache, PostgreSQL Shard, Auth0 IDP) or custom component registration.
   - Dynamically adds components to topology, calculates operational metrics, and persists to `localStorage` (`patchup_custom_components_v1`).
   - Default core components are protected from deletion; custom components display a "Demo" badge and can be deleted.

4. **Dedicated Inspection & Floating AI Controls**:
   - Left side: Service Inspection workspace with Live Stream logs, Golden Signals, and nested microservice selector.
   - Right side: Extracted 3D microservice platform with authentic embossed symbol.
   - Directly below extracted 3D microservice:
     - `[purple chip] Gemini Reasoning`
     - `[orange shield] Recovery`
     - Floating side by side with zero enclosing cards, transparent background, and gentle floating animation.

